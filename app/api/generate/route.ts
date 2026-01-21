// app/api/generate/route.ts
// IMPROVED VERSION - Multi-Stage Pipeline
// Drop-in replacement for your existing route.ts

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 300;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =============================================================================
// STAGE 1: DESIGN DIRECTIONS (6 distinct styles instead of generic)
// =============================================================================

const DESIGN_DIRECTIONS: Record<string, {
  name: string;
  fonts: { display: string; body: string; import: string };
  colors: Record<string, string>;
  characteristics: string;
}> = {
  luxury_minimal: {
    name: "Luxury Minimal",
    fonts: {
      display: "Cormorant Garamond",
      body: "Crimson Pro",
      import: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Crimson+Pro:wght@400;500;600&display=swap"
    },
    colors: {
      primary: "#1a1a1a",
      primaryRgb: "26, 26, 26",
      secondary: "#c9a227",
      secondaryRgb: "201, 162, 39",
      accent: "#8b7355",
      bgPrimary: "#faf9f7",
      bgSecondary: "#f5f3ef",
      textPrimary: "#1a1a1a",
      textSecondary: "#5c5c5c",
      border: "#e8e6e1"
    },
    characteristics: "Lots of whitespace (160px+ section padding), subtle animations, serif typography, muted earth tones, editorial feel, thin borders, understated elegance"
  },
  
  bold_modern: {
    name: "Bold Modern",
    fonts: {
      display: "Space Grotesk",
      body: "DM Sans",
      import: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
    },
    colors: {
      primary: "#6366f1",
      primaryRgb: "99, 102, 241",
      secondary: "#8b5cf6",
      secondaryRgb: "139, 92, 246",
      accent: "#22d3ee",
      bgPrimary: "#ffffff",
      bgSecondary: "#f8fafc",
      textPrimary: "#0f172a",
      textSecondary: "#475569",
      border: "#e2e8f0"
    },
    characteristics: "Strong geometric typography, gradient accents, card-based layouts, smooth micro-interactions, vibrant but professional"
  },
  
  warm_organic: {
    name: "Warm Organic",
    fonts: {
      display: "Fraunces",
      body: "Source Serif Pro",
      import: "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Source+Serif+Pro:wght@400;600&display=swap"
    },
    colors: {
      primary: "#2d5016",
      primaryRgb: "45, 80, 22",
      secondary: "#b45309",
      secondaryRgb: "180, 83, 9",
      accent: "#dc2626",
      bgPrimary: "#fffbeb",
      bgSecondary: "#fef3c7",
      textPrimary: "#1c1917",
      textSecondary: "#57534e",
      border: "#e7e5e4"
    },
    characteristics: "Rounded corners (20px+), warm earth palette, friendly approachable vibe, organic shapes, soft shadows"
  },
  
  dark_premium: {
    name: "Dark Premium",
    fonts: {
      display: "Bebas Neue",
      body: "Barlow",
      import: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap"
    },
    colors: {
      primary: "#ffffff",
      primaryRgb: "255, 255, 255",
      secondary: "#a855f7",
      secondaryRgb: "168, 85, 247",
      accent: "#06b6d4",
      bgPrimary: "#09090b",
      bgSecondary: "#18181b",
      textPrimary: "#fafafa",
      textSecondary: "#a1a1aa",
      border: "rgba(255,255,255,0.1)"
    },
    characteristics: "Dark theme, glowing effects, gradient borders, glassmorphism cards, high contrast, neon accents, dramatic"
  },
  
  editorial_classic: {
    name: "Editorial Classic",
    fonts: {
      display: "Playfair Display",
      body: "Source Sans Pro",
      import: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap"
    },
    colors: {
      primary: "#1e3a5f",
      primaryRgb: "30, 58, 95",
      secondary: "#b8860b",
      secondaryRgb: "184, 134, 11",
      accent: "#166534",
      bgPrimary: "#ffffff",
      bgSecondary: "#f8f6f3",
      textPrimary: "#1e293b",
      textSecondary: "#64748b",
      border: "#e2e8f0"
    },
    characteristics: "Classic typography pairing, structured grid, professional trustworthy feel, navy/gold color story, refined borders"
  },
  
  vibrant_energy: {
    name: "Vibrant Energy",
    fonts: {
      display: "Syne",
      body: "Outfit",
      import: "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap"
    },
    colors: {
      primary: "#7c3aed",
      primaryRgb: "124, 58, 237",
      secondary: "#ec4899",
      secondaryRgb: "236, 72, 153",
      accent: "#14b8a6",
      bgPrimary: "#fafafa",
      bgSecondary: "#f3e8ff",
      textPrimary: "#18181b",
      textSecondary: "#52525b",
      border: "#e4e4e7"
    },
    characteristics: "Bold gradients, playful animations, colorful accents, energetic feel, bouncy hover effects, gradient text"
  }
};

// =============================================================================
// STAGE 2: INDUSTRY-SPECIFIC IMAGES (Curated, not random)
// =============================================================================

const CURATED_IMAGES: Record<string, {
  hero: string;
  about: string;
  feature1: string;
  feature2: string;
  feature3: string;
  testimonialBg: string;
}> = {
  'restaurant': {
    hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=85',
    about: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&q=80',
    feature1: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    feature2: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
    feature3: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    testimonialBg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80',
  },
  'health-beauty': {
    hero: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=85',
    about: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
    feature1: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    feature2: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80',
    feature3: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80',
    testimonialBg: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80',
  },
  'fitness': {
    hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85',
    about: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    feature1: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=600&q=80',
    feature2: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    feature3: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80',
    testimonialBg: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80',
  },
  'professional': {
    hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=85',
    about: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    feature1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    feature2: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
    feature3: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    testimonialBg: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1920&q=80',
  },
  'tech-startup': {
    hero: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=85',
    about: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    feature1: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    feature2: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80',
    feature3: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    testimonialBg: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&q=80',
  },
  'real-estate': {
    hero: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85',
    about: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    feature1: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&q=80',
    feature2: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    feature3: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80',
    testimonialBg: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80',
  },
  'local-services': {
    hero: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&q=85',
    about: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    feature1: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    feature2: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    feature3: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80',
    testimonialBg: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
  },
  'ecommerce': {
    hero: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=85',
    about: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    feature1: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    feature2: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    feature3: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
    testimonialBg: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&q=80',
  },
  'medical': {
    hero: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=85',
    about: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    feature1: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80',
    feature2: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600&q=80',
    feature3: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80',
    testimonialBg: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1920&q=80',
  },
  'education': {
    hero: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=85',
    about: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    feature1: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600&q=80',
    feature2: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80',
    feature3: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    testimonialBg: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80',
  },
};

// =============================================================================
// STAGE 3: INDUSTRY-TO-STYLE MAPPING (Smart defaults)
// =============================================================================

const INDUSTRY_STYLE_MAP: Record<string, string[]> = {
  'restaurant': ['luxury_minimal', 'warm_organic', 'dark_premium'],
  'health-beauty': ['luxury_minimal', 'warm_organic', 'vibrant_energy'],
  'fitness': ['dark_premium', 'vibrant_energy', 'bold_modern'],
  'professional': ['editorial_classic', 'bold_modern', 'luxury_minimal'],
  'tech-startup': ['bold_modern', 'dark_premium', 'vibrant_energy'],
  'real-estate': ['editorial_classic', 'luxury_minimal', 'bold_modern'],
  'local-services': ['bold_modern', 'warm_organic', 'editorial_classic'],
  'ecommerce': ['bold_modern', 'vibrant_energy', 'dark_premium'],
  'medical': ['editorial_classic', 'bold_modern', 'luxury_minimal'],
  'education': ['bold_modern', 'warm_organic', 'vibrant_energy'],
  'construction': ['bold_modern', 'dark_premium', 'editorial_classic'],
  'nonprofit': ['warm_organic', 'bold_modern', 'vibrant_energy'],
  'portfolio': ['dark_premium', 'luxury_minimal', 'vibrant_energy'],
};

// =============================================================================
// HELPER: Call Claude API
// =============================================================================

async function callClaude(systemPrompt: string, userMessage: string, maxTokens: number = 4000): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }
  return content.text.trim();
}

// =============================================================================
// HELPER: Parse JSON safely
// =============================================================================

function parseJSON(text: string): any {
  let cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.substring(start, end + 1);
  }
  return JSON.parse(cleaned);
}

// =============================================================================
// STAGE 1: Business Analysis & Brand Strategy
// =============================================================================

const STAGE_1_SYSTEM = `You are a brand strategist who has worked with Fortune 500 companies. Analyze the business and create a brand strategy.

Output ONLY valid JSON with this exact structure:
{
  "target_audience": {
    "primary": "description of ideal customer",
    "pain_points": ["pain 1", "pain 2", "pain 3"],
    "desires": ["desire 1", "desire 2", "desire 3"]
  },
  "brand_voice": {
    "personality": "3-4 adjectives",
    "tone": "how the brand should speak"
  },
  "value_proposition": {
    "main": "one compelling sentence",
    "proof_points": ["proof 1", "proof 2", "proof 3"]
  },
  "competitive_advantage": "what makes them unique"
}`;

async function analyzeBusinesss(project: any): Promise<any> {
  const prompt = `Analyze this business:
Name: ${project.business_name}
Industry: ${project.industry || 'professional'}
Description: ${project.description || 'A quality business'}
Target Customer: ${project.target_customer || 'Not specified'}
Unique Value: ${project.unique_value || 'Not specified'}
Website Goal: ${project.website_goal || 'Generate leads'}`;

  const result = await callClaude(STAGE_1_SYSTEM, prompt, 1500);
  return parseJSON(result);
}

// =============================================================================
// STAGE 2: Conversion-Focused Copywriting
// =============================================================================

const STAGE_2_SYSTEM = `You are a direct-response copywriter who has generated millions in revenue. Write website copy that CONVERTS.

RULES:
- Headlines: Create EMOTION, not description. Max 8 words.
- Subheadlines: Clarify the benefit. Max 20 words.
- CTAs: Action verb + benefit (e.g., "Get Your Free Quote", "Start Saving Today")
- ALWAYS include specific numbers (make them up if needed but keep believable)
- NEVER use: "solutions", "leverage", "synergy", "cutting-edge", "world-class"

Output ONLY valid JSON:
{
  "hero": {
    "badge": "short trust indicator",
    "headline": "emotional 6-8 word headline",
    "subheadline": "clarifying benefit statement",
    "cta_primary": "action + benefit",
    "cta_secondary": "lower commitment action"
  },
  "social_proof": {
    "stat_1": { "number": "500+", "label": "Happy Clients" },
    "stat_2": { "number": "15", "label": "Years Experience" },
    "stat_3": { "number": "98%", "label": "Satisfaction Rate" },
    "stat_4": { "number": "24h", "label": "Response Time" }
  },
  "about": {
    "badge": "About Us",
    "headline": "why we exist headline",
    "paragraphs": ["paragraph 1 about story", "paragraph 2 about mission"]
  },
  "services": {
    "badge": "What We Offer",
    "headline": "services section headline",
    "items": [
      { "title": "Service Name", "description": "2 sentence benefit-focused description", "icon": "sparkles" },
      { "title": "Service Name", "description": "2 sentence benefit-focused description", "icon": "shield" },
      { "title": "Service Name", "description": "2 sentence benefit-focused description", "icon": "clock" }
    ]
  },
  "testimonials": [
    { "quote": "specific testimonial with result", "name": "First Last", "role": "Title, Company", "rating": 5 },
    { "quote": "specific testimonial with result", "name": "First Last", "role": "Title, Company", "rating": 5 },
    { "quote": "specific testimonial with result", "name": "First Last", "role": "Title, Company", "rating": 5 }
  ],
  "cta_section": {
    "headline": "conversion-focused headline",
    "subheadline": "overcome final objection",
    "cta": "strong call to action",
    "trust_note": "guarantee or reassurance"
  },
  "footer": {
    "tagline": "memorable one-liner"
  }
}`;

async function writeCopy(project: any, brandAnalysis: any): Promise<any> {
  const prompt = `Write conversion-focused copy for:
Business: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description || 'A quality business'}

Brand Strategy:
${JSON.stringify(brandAnalysis, null, 2)}

Contact: ${project.contact_email || 'hello@example.com'} | ${project.contact_phone || '(555) 123-4567'}`;

  const result = await callClaude(STAGE_2_SYSTEM, prompt, 3000);
  return parseJSON(result);
}

// =============================================================================
// STAGE 3: Design Direction Selection
// =============================================================================

const STAGE_3_SYSTEM = `You are a creative director choosing the perfect design direction for a website.

Available directions:
1. luxury_minimal - Serif fonts, lots of whitespace, muted colors, editorial feel
2. bold_modern - Geometric sans-serif, gradient accents, vibrant but professional
3. warm_organic - Rounded corners, earth tones, friendly approachable vibe
4. dark_premium - Dark theme, glowing effects, glassmorphism, dramatic
5. editorial_classic - Classic serif/sans pairing, navy/gold, professional trust
6. vibrant_energy - Bold gradients, playful animations, energetic colorful

Output ONLY valid JSON:
{
  "selected_direction": "direction_key",
  "reasoning": "why this fits the brand",
  "hero_layout": "split_left | split_right | centered | full_bleed",
  "special_effects": ["effect1", "effect2"]
}`;

async function selectDesignDirection(project: any, brandAnalysis: any): Promise<any> {
  const industry = project.industry || 'professional';
  const suggestedStyles = INDUSTRY_STYLE_MAP[industry] || ['bold_modern', 'editorial_classic'];
  
  const prompt = `Select the best design direction for:
Business: ${project.business_name}
Industry: ${industry}
Style Preference: ${project.style || 'modern'}
Mood: ${Array.isArray(project.mood_tags) ? project.mood_tags.join(', ') : 'professional'}

Brand Analysis:
${JSON.stringify(brandAnalysis, null, 2)}

Suggested directions for this industry: ${suggestedStyles.join(', ')}
But choose what's BEST for this specific brand.`;

  const result = await callClaude(STAGE_3_SYSTEM, prompt, 1000);
  return parseJSON(result);
}

// =============================================================================
// STAGE 4: HTML Generation (with Golden Examples)
// =============================================================================

function buildMasterPrompt(
  project: any,
  copy: any,
  designChoice: any,
  direction: typeof DESIGN_DIRECTIONS[string],
  images: typeof CURATED_IMAGES[string]
): string {
  const isDark = designChoice.selected_direction === 'dark_premium';
  
  return `You are an elite frontend developer creating a $50,000+ website.

## BUSINESS
Name: ${project.business_name}
Industry: ${project.industry}
Email: ${project.contact_email || 'hello@' + (project.business_name || 'company').toLowerCase().replace(/[^a-z]/g, '') + '.com'}
Phone: ${project.contact_phone || '(555) 123-4567'}
Address: ${project.address || ''}

## COPY (Use this EXACT content)
${JSON.stringify(copy, null, 2)}

## DESIGN DIRECTION: ${direction.name}
Font Import: ${direction.fonts.import}
Display Font: ${direction.fonts.display}
Body Font: ${direction.fonts.body}
Characteristics: ${direction.characteristics}

## CSS VARIABLES (Use these EXACTLY)
:root {
  --primary: ${direction.colors.primary};
  --primary-rgb: ${direction.colors.primaryRgb};
  --secondary: ${direction.colors.secondary};
  --secondary-rgb: ${direction.colors.secondaryRgb};
  --accent: ${direction.colors.accent};
  --bg-primary: ${direction.colors.bgPrimary};
  --bg-secondary: ${direction.colors.bgSecondary};
  --text-primary: ${direction.colors.textPrimary};
  --text-secondary: ${direction.colors.textSecondary};
  --border: ${direction.colors.border};
  --font-display: '${direction.fonts.display}', serif;
  --font-body: '${direction.fonts.body}', sans-serif;
}

## IMAGES (Use these EXACTLY)
Hero: ${images.hero}
About: ${images.about}
Feature 1: ${images.feature1}
Feature 2: ${images.feature2}
Feature 3: ${images.feature3}
Testimonial avatars: https://i.pravatar.cc/100?img=1, https://i.pravatar.cc/100?img=2, https://i.pravatar.cc/100?img=3

## HERO LAYOUT: ${designChoice.hero_layout}
## SPECIAL EFFECTS: ${designChoice.special_effects?.join(', ') || 'subtle animations'}

## GOLDEN EXAMPLE: Premium Hero Section
\`\`\`html
<section class="hero">
  <div class="hero-bg">
    <div class="hero-gradient hero-gradient-1"></div>
    <div class="hero-gradient hero-gradient-2"></div>
  </div>
  <div class="container">
    <div class="hero-grid">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>{{BADGE_TEXT}}</span>
        </div>
        <h1 class="hero-title">
          {{HEADLINE_PART_1}}<br>
          <span class="text-gradient">{{HEADLINE_PART_2}}</span>
        </h1>
        <p class="hero-subtitle">{{SUBHEADLINE}}</p>
        <div class="hero-ctas">
          <a href="#contact" class="btn btn-primary">{{CTA_PRIMARY}}</a>
          <a href="#services" class="btn btn-secondary">{{CTA_SECONDARY}}</a>
        </div>
        <div class="hero-stats">
          <div class="stat"><span class="stat-number">{{STAT_1_NUM}}</span><span class="stat-label">{{STAT_1_LABEL}}</span></div>
          <div class="stat"><span class="stat-number">{{STAT_2_NUM}}</span><span class="stat-label">{{STAT_2_LABEL}}</span></div>
          <div class="stat"><span class="stat-number">{{STAT_3_NUM}}</span><span class="stat-label">{{STAT_3_LABEL}}</span></div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-image-wrapper">
          <img src="{{HERO_IMAGE}}" alt="{{ALT}}" class="hero-image">
          <div class="floating-card floating-card-1">
            <div class="card-icon">✓</div>
            <div class="card-content">
              <span class="card-title">{{CARD_TITLE}}</span>
              <span class="card-text">{{CARD_TEXT}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
\`\`\`

## REQUIRED CSS PATTERNS
\`\`\`css
/* Hero */
.hero { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; padding-top: 100px; }
.hero-bg { position: absolute; inset: 0; z-index: -1; }
.hero-gradient { position: absolute; width: 600px; height: 600px; border-radius: 50%; filter: blur(80px); opacity: 0.5; }
.hero-gradient-1 { background: var(--primary); top: -200px; right: -100px; animation: float 20s ease-in-out infinite; }
.hero-gradient-2 { background: var(--secondary); bottom: -200px; left: -100px; animation: float 15s ease-in-out infinite reverse; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -30px); } }

.hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(var(--primary-rgb), 0.1); border-radius: 100px; font-size: 14px; margin-bottom: 24px; }
.badge-dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.hero-title { font-family: var(--font-display); font-size: clamp(48px, 6vw, 72px); font-weight: 700; line-height: 1.1; margin-bottom: 24px; }
.text-gradient { background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-subtitle { font-size: 20px; color: var(--text-secondary); margin-bottom: 40px; max-width: 500px; line-height: 1.6; }

.hero-ctas { display: flex; gap: 16px; margin-bottom: 48px; }
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 16px 32px; font-weight: 600; border-radius: 12px; transition: all 0.3s ease; }
.btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.4); }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(var(--primary-rgb), 0.5); }
.btn-secondary { background: transparent; color: var(--text-primary); border: 2px solid var(--border); }
.btn-secondary:hover { border-color: var(--primary); color: var(--primary); }

.hero-stats { display: flex; gap: 48px; }
.stat-number { display: block; font-family: var(--font-display); font-size: 32px; font-weight: 700; }
.stat-label { font-size: 14px; color: var(--text-secondary); }

.hero-image { width: 100%; border-radius: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.15); }
.floating-card { position: absolute; background: white; padding: 16px 20px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); animation: float-card 6s ease-in-out infinite; }
@keyframes float-card { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

/* Cards */
.card { background: var(--bg-secondary); border-radius: 24px; padding: 40px; border: 1px solid var(--border); transition: all 0.4s ease; }
.card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); border-color: transparent; }

/* Sections */
section { padding: 120px 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-badge { display: inline-block; padding: 8px 16px; background: rgba(var(--primary-rgb), 0.1); color: var(--primary); border-radius: 100px; font-size: 14px; font-weight: 600; margin-bottom: 16px; }
.section-title { font-family: var(--font-display); font-size: clamp(36px, 5vw, 56px); font-weight: 700; margin-bottom: 24px; }

/* Animations */
.reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s ease; }
.reveal.active { opacity: 1; transform: translateY(0); }

/* Responsive */
@media (max-width: 968px) {
  .hero-grid { grid-template-columns: 1fr; text-align: center; }
  .hero-subtitle { margin-inline: auto; }
  .hero-ctas { justify-content: center; }
  .hero-stats { justify-content: center; }
  .hero-visual { display: none; }
}
\`\`\`

## REQUIRED JAVASCRIPT
\`\`\`javascript
document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
  
  // Nav scroll
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
  
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Counter animation
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));
});
\`\`\`

## SECTIONS TO GENERATE (In Order)
1. NAV - Fixed, blur on scroll, logo + links + CTA
2. HERO - Use the golden example pattern above, fill in the copy
3. FEATURES/SERVICES - 3-6 cards with icons
4. ABOUT - Split layout with image
5. STATS - 4 animated counters (use data-count attribute)
6. TESTIMONIALS - 3 cards with real-looking quotes
7. CTA - Gradient background, compelling copy
8. CONTACT - Form + contact info
9. FOOTER - Logo, links, social, copyright

## OUTPUT
Generate the COMPLETE HTML file starting with <!DOCTYPE html> and ending with </html>.
- ALL CSS in <style> tag in <head>
- ALL JavaScript in <script> tag before </body>
- Use the EXACT copy provided
- Use the EXACT colors and fonts from the design direction
- Mobile responsive (test at 375px, 768px, 1024px)
- Add class="reveal" to sections for scroll animation

NO explanations. NO markdown code blocks. Just the HTML.`;
}

// =============================================================================
// STAGE 5: Quality Review
// =============================================================================

async function reviewAndFix(html: string, direction: typeof DESIGN_DIRECTIONS[string]): Promise<string> {
  const reviewPrompt = `Review this HTML for quality issues:

CHECKLIST:
1. Does it use the correct fonts? (${direction.fonts.display} / ${direction.fonts.body})
2. Are colors consistent with the design direction?
3. Is it mobile responsive?
4. Do all animations work?
5. Is the hero impactful?
6. Are CTAs prominent?

If you find issues, fix them and output the corrected HTML.
If no issues, output the HTML unchanged.

Output ONLY the complete HTML starting with <!DOCTYPE html>

HTML TO REVIEW:
${html.substring(0, 30000)}`;

  const result = await callClaude(
    'You are a QA specialist reviewing websites. Fix any issues found.',
    reviewPrompt,
    16000
  );

  let fixed = result.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  const doctypeIndex = fixed.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) {
    fixed = fixed.substring(doctypeIndex);
  }
  return fixed;
}

// =============================================================================
// MAIN GENERATION PIPELINE
// =============================================================================

async function generateWebsite(project: any): Promise<string> {
  const industry = (project.industry || 'professional').toLowerCase();
  
  console.log('🚀 Stage 1: Analyzing business...');
  const brandAnalysis = await analyzeBusinesss(project);
  
  console.log('🚀 Stage 2: Writing copy...');
  const copy = await writeCopy(project, brandAnalysis);
  
  console.log('🚀 Stage 3: Selecting design direction...');
  const designChoice = await selectDesignDirection(project, brandAnalysis);
  
  const directionKey = designChoice.selected_direction || 'bold_modern';
  const direction = DESIGN_DIRECTIONS[directionKey] || DESIGN_DIRECTIONS['bold_modern'];
  console.log(`   Selected: ${direction.name}`);
  
  const images = CURATED_IMAGES[industry] || CURATED_IMAGES['professional'];
  
  console.log('🚀 Stage 4: Generating HTML...');
  const masterPrompt = buildMasterPrompt(project, copy, designChoice, direction, images);
  
  let html = await callClaude(
    'You are an elite frontend developer. Generate production-ready HTML.',
    masterPrompt,
    16000
  );
  
  // Clean up response
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) {
    html = html.substring(doctypeIndex);
  }
  
  console.log('🚀 Stage 5: Quality review...');
  html = await reviewAndFix(html, direction);
  
  console.log('✅ Generation complete!');
  return html;
}

// =============================================================================
// API HANDLERS
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Fetch project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Update status to generating
    await supabase
      .from('projects')
      .update({ status: 'GENERATING' })
      .eq('id', projectId);

    // Generate website
    const html = await generateWebsite(project);

    // Validate output
    if (!html.includes('<!DOCTYPE html>') && !html.includes('<!doctype html>')) {
      throw new Error('Invalid HTML output');
    }

    // Save result
    await supabase
      .from('projects')
      .update({ 
        generated_html: html, 
        status: 'PREVIEW_READY' 
      })
      .eq('id', projectId);

    return NextResponse.json({ 
      success: true, 
      html,
      message: 'Website generated successfully'
    });

  } catch (error: any) {
    console.error('❌ Generation error:', error);
    
    // Try to update status on error
    try {
      const body = await request.clone().json();
      if (body.projectId) {
        await supabase
          .from('projects')
          .update({ status: 'QUEUED' })
          .eq('id', body.projectId);
      }
    } catch {}

    return NextResponse.json(
      { error: 'Generation failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: '4.0 - Multi-Stage Pipeline',
    stages: [
      '1. Business Analysis',
      '2. Copywriting',
      '3. Design Direction',
      '4. HTML Generation',
      '5. Quality Review'
    ],
    designDirections: Object.keys(DESIGN_DIRECTIONS),
    supportedIndustries: Object.keys(CURATED_IMAGES),
  });
}
