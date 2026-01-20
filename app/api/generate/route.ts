import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 300;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// =============================================================================
// BILLION-DOLLAR DESIGN SYSTEM
// Patterns extracted from: Stripe, Airbnb, Apple, Nike, Linear, Vercel, Shopify
// =============================================================================

const ELITE_SYSTEM_PROMPT = `You are a world-class creative director who has designed for Apple, Stripe, Airbnb, and Linear. Your websites generate billions in revenue. You don't create "nice" websites - you create ELITE, conversion-optimized digital experiences that make visitors say "WOW."

## THE BILLION-DOLLAR DESIGN SYSTEM

### PATTERN 1: HERO SECTION (Critical - This makes or breaks conversions)
REQUIRED ELEMENTS:
- Headline: 60-84px, font-weight: 800, letter-spacing: -0.03em, line-height: 1.05
- The headline must create EMOTION, not describe features
  BAD: "We Build Websites" 
  GOOD: "Your Brand Deserves to Be Unforgettable"
- Subheadline: 18-24px, max 2 lines, color: secondary text
- TWO CTAs only: Primary (filled, glowing) + Secondary (outline/ghost)
- Social proof visible: "Trusted by X+" or avatar stack or client logos
- Background: gradient mesh OR full-bleed image with overlay OR animated shapes

HERO CSS REQUIRED:
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.hero h1 {
  font-size: clamp(48px, 8vw, 84px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: 24px;
}
.hero-gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

### PATTERN 2: FLOATING SHAPES & GRADIENT MESH (The "WOW" Factor)
Every premium site has decorative elements that create depth:
.hero-blob {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--primary-rgb), 0.15), transparent 70%);
  filter: blur(60px);
  animation: float 8s ease-in-out infinite;
}
.hero-blob-1 { top: -200px; right: -100px; }
.hero-blob-2 { bottom: -200px; left: -100px; animation-delay: -4s; }

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.05); }
}

### PATTERN 3: TRUST BAR (Immediately after hero)
.trust-bar {
  padding: 60px 0;
  text-align: center;
  border-bottom: 1px solid var(--border);
}
.trust-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
  opacity: 0.5;
  filter: grayscale(100%);
  transition: all 0.5s ease;
}
.trust-logos:hover {
  opacity: 0.8;
  filter: grayscale(50%);
}

### PATTERN 4: BENTO GRID FEATURES (Not boring 3-column)
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: 24px;
}
.bento-card {
  background: var(--card-bg);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid var(--border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.bento-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border-color: transparent;
}
.bento-card.large { grid-column: span 2; grid-row: span 2; }
.bento-card.wide { grid-column: span 2; }
.bento-card.tall { grid-row: span 2; }

### PATTERN 5: GLASSMORPHISM CARDS
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
}
.glass-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

### PATTERN 6: GLOWING CTA BUTTONS
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 18px 36px;
  background: var(--primary);
  color: white;
  font-weight: 600;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.4);
}
.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.5);
}

### PATTERN 7: ANIMATED STATS COUNTER
.stats-section {
  padding: 100px 0;
  background: var(--primary);
  color: white;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  text-align: center;
}
.stat-number {
  font-size: clamp(48px, 6vw, 72px);
  font-weight: 800;
  line-height: 1;
  margin-bottom: 8px;
}

### PATTERN 8: TESTIMONIAL CARDS
.testimonial-card {
  background: var(--card-bg);
  padding: 40px;
  border-radius: 24px;
  position: relative;
}
.testimonial-card::before {
  content: '"';
  position: absolute;
  top: 20px;
  left: 30px;
  font-size: 100px;
  font-family: Georgia, serif;
  color: var(--primary);
  opacity: 0.1;
  line-height: 1;
}

### PATTERN 9: SCROLL REVEAL ANIMATIONS
.reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
.stagger > * {
  opacity: 0;
  transform: translateY(30px);
}
.stagger.active > * {
  opacity: 1;
  transform: translateY(0);
}
.stagger.active > *:nth-child(1) { transition-delay: 0.1s; }
.stagger.active > *:nth-child(2) { transition-delay: 0.2s; }
.stagger.active > *:nth-child(3) { transition-delay: 0.3s; }
.stagger.active > *:nth-child(4) { transition-delay: 0.4s; }

### PATTERN 10: STICKY NAVIGATION
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 0;
  transition: all 0.3s ease;
}
nav.scrolled {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 12px 0;
}

### PATTERN 11: GRADIENT CTA SECTION
.cta-section {
  padding: 120px 0;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  text-align: center;
  position: relative;
  overflow: hidden;
}

## CRITICAL RULES - NEVER BREAK THESE

1. TYPOGRAPHY: Import Google Fonts, Headlines clamp(48px, 8vw, 84px), weight 800
2. COLORS: Define ALL as CSS variables with RGB variants
3. SPACING: Section padding 120-160px vertical, Container 1200px max
4. ANIMATIONS: cubic-bezier easing, IntersectionObserver for reveals
5. MOBILE: Breakpoints 1200px, 768px, 480px, Touch targets 48px min

## OUTPUT REQUIREMENTS
Return ONLY the complete HTML file:
- Start with <!DOCTYPE html>
- End with </html>
- NO markdown, NO explanations
- ALL CSS in <style> tag
- ALL JavaScript in <script> tag before </body>
- Must look like a $100,000 website`;

// =============================================================================
// INDUSTRY-SPECIFIC WOW FACTORS
// =============================================================================

const INDUSTRY_WOW_FACTORS: Record<string, string> = {
  'restaurant': `
RESTAURANT WOW FACTORS:
- Hero: Full-bleed food photography with dark overlay, elegant serif headline
- Color: Warm burgundy (#7f1d1d), cream (#fffbeb), gold accents
- Typography: Playfair Display for headlines
- Special: Menu section with hover effects, Reservation CTA, Gallery with lightbox
- Copy tone: Sensual, appetizing. "Handcrafted", "Farm-fresh", "Artisanal"`,

  'local-services': `
LOCAL SERVICES WOW FACTORS:
- Hero: Split layout - headline left, team photo right
- HUGE phone number in hero (click-to-call)
- Color: Trust blue (#1e40af), action orange (#ea580c)
- Special: Trust badges (Licensed, Insured, 5-Star), Before/After slider
- Copy tone: Confident, reassuring. "We'll be there in 60 minutes"`,

  'professional': `
PROFESSIONAL SERVICES WOW FACTORS:
- Hero: Sophisticated gradient, credibility headline
- Color: Navy (#1e3a5f), gold accents (#b8860b)
- Special: Team with credentials, Case studies with results
- Copy tone: Authoritative, expert. Emphasize results`,

  'health-beauty': `
HEALTH & BEAUTY WOW FACTORS:
- Hero: Soft, aspirational imagery
- Color: Soft pink (#fdf2f8), rose gold (#be8b78)
- Typography: Cormorant Garamond for elegance
- Special: Service menu with pricing, Before/After gallery
- Copy tone: Pampering, aspirational. "Reveal your radiance"`,

  'real-estate': `
REAL ESTATE WOW FACTORS:
- Hero: Stunning property image, search bar prominent
- Color: Emerald (#047857) or navy, gold accents
- Special: Featured listings carousel, Agent profile, Home valuation CTA
- Copy tone: Sophisticated, trustworthy. "Find your dream home"`,

  'ecommerce': `
E-COMMERCE WOW FACTORS:
- Hero: Product showcase with "Shop Now" CTA
- Special: Featured products grid, Benefits bar, Customer reviews
- Copy tone: Benefit-focused with urgency`,

  'portfolio': `
PORTFOLIO WOW FACTORS:
- Hero: Bold statement, work visible immediately
- Color: High contrast, experimental
- Special: Project gallery with filters, Case studies
- Copy tone: Creative, confident, personal`,

  'fitness': `
FITNESS WOW FACTORS:
- Hero: High-energy imagery, motivational headline
- Color: Electric orange (#ea580c), dark backgrounds
- Special: Class schedule, Membership tiers, Transformation gallery
- Copy tone: Motivational. "Transform your body"`,

  'tech-startup': `
TECH/SAAS WOW FACTORS:
- Hero: Product screenshot, gradient mesh background
- Color: Vibrant purple (#7c3aed), cyan (#06b6d4)
- Dark mode recommended
- Special: Feature bento grid, Pricing table, Demo CTA
- Copy tone: Clear, benefit-focused, no jargon`,

  'medical': `
MEDICAL WOW FACTORS:
- Hero: Calming, professional, care-focused
- Color: Teal (#0d9488), soft blue, clean white
- Special: Doctor profiles with credentials, Appointment booking
- Copy tone: Compassionate, professional, reassuring`,

  'construction': `
CONSTRUCTION WOW FACTORS:
- Hero: Project photography, strong headline
- Color: Orange (#ea580c), dark gray, safety yellow
- Special: Project gallery, Certifications, Quote request
- Copy tone: Strong, reliable. "Built to last"`,

  'nonprofit': `
NONPROFIT WOW FACTORS:
- Hero: Emotional imagery, mission headline
- Special: Impact stats animated, Stories of change, Donation form
- Copy tone: Inspiring, urgent. Focus on impact`,

  'education': `
EDUCATION WOW FACTORS:
- Hero: Transformation promise
- Color: Warm blue (#3b82f6), success green
- Special: Course cards, Instructor profiles, Success stories
- Copy tone: Inspiring, supportive. Focus on outcomes`,
};

// =============================================================================
// STYLE CONFIGURATIONS
// =============================================================================

const STYLE_CONFIGS: Record<string, string> = {
  'modern': `MODERN: Clean lines, subtle shadows, gradient accents, 16-24px radius, light background`,
  'elegant': `ELEGANT: Serif headlines (Playfair Display), navy/gold/cream, thin borders, more whitespace`,
  'bold': `BOLD: MASSIVE headlines (80-100px), high contrast, full-bleed images, dramatic hovers`,
  'minimal': `MINIMAL: Maximum whitespace (180px padding), only 2 colors, no decoration, typography as hero`,
  'playful': `PLAYFUL: Rounded corners (24px+), bright colors, bouncy animations, friendly tone`,
  'corporate': `CORPORATE: Professional blue, structured grids, conservative typography, trust badges`,
  'dark': `DARK MODE: Background #09090b, text #fafafa, glowing colors, glassmorphism, gradient mesh`,
};

// =============================================================================
// COLOR PALETTES
// =============================================================================

const COLOR_PALETTES: Record<string, { primary: string; primaryRgb: string; secondary: string; secondaryRgb: string }> = {
  'auto': { primary: '#6366f1', primaryRgb: '99, 102, 241', secondary: '#8b5cf6', secondaryRgb: '139, 92, 246' },
  'blue': { primary: '#2563eb', primaryRgb: '37, 99, 235', secondary: '#3b82f6', secondaryRgb: '59, 130, 246' },
  'green': { primary: '#059669', primaryRgb: '5, 150, 105', secondary: '#10b981', secondaryRgb: '16, 185, 129' },
  'red': { primary: '#dc2626', primaryRgb: '220, 38, 38', secondary: '#ef4444', secondaryRgb: '239, 68, 68' },
  'purple': { primary: '#7c3aed', primaryRgb: '124, 58, 237', secondary: '#8b5cf6', secondaryRgb: '139, 92, 246' },
  'orange': { primary: '#ea580c', primaryRgb: '234, 88, 12', secondary: '#f97316', secondaryRgb: '249, 115, 22' },
  'neutral': { primary: '#18181b', primaryRgb: '24, 24, 27', secondary: '#3f3f46', secondaryRgb: '63, 63, 70' },
  'gold': { primary: '#b45309', primaryRgb: '180, 83, 9', secondary: '#d97706', secondaryRgb: '217, 119, 6' },
};

// =============================================================================
// BUILD USER PROMPT
// =============================================================================

function buildUserPrompt(project: any): string {
  const industry = project.industry || 'professional';
  const style = project.style || 'modern';
  const colorKey = project.color_preference || 'auto';
  
  const industryWow = INDUSTRY_WOW_FACTORS[industry] || INDUSTRY_WOW_FACTORS['professional'];
  const styleConfig = STYLE_CONFIGS[style] || STYLE_CONFIGS['modern'];
  const colors = COLOR_PALETTES[colorKey] || COLOR_PALETTES['auto'];
  
  const features = Array.isArray(project.features) ? project.features.join(', ') : '';
  const moodTags = Array.isArray(project.mood_tags) ? project.mood_tags.join(', ') : '';

  const isDark = style === 'dark';

  return `Create a STUNNING, $100,000 website for:

## BUSINESS
- Name: ${project.business_name}
- Industry: ${industry}
- Description: ${project.description || 'A premium business'}
- Unique Value: ${project.unique_value || 'Excellence in every detail'}
- Target: ${project.target_customer || 'Discerning customers'}
- Goal: ${project.website_goal || 'Generate leads'}

## STYLE & COLORS
${styleConfig}

CSS Variables Required:
:root {
  --primary: ${colors.primary};
  --primary-rgb: ${colors.primaryRgb};
  --secondary: ${colors.secondary};
  --secondary-rgb: ${colors.secondaryRgb};
  --accent: #f59e0b;
  ${isDark ? `
  --bg-primary: #09090b;
  --bg-secondary: #18181b;
  --bg-card: rgba(255, 255, 255, 0.05);
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --border: rgba(255, 255, 255, 0.1);` : `
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-card: #ffffff;
  --text-primary: #09090b;
  --text-secondary: #52525b;
  --border: #e4e4e7;`}
}

## INDUSTRY REQUIREMENTS
${industryWow}

## FEATURES TO INCLUDE
${features || 'Contact form, Services, Testimonials'}

## MOOD
${moodTags || 'Professional, trustworthy'}

## CONTACT
- Email: ${project.contact_email || 'hello@business.com'}
- Phone: ${project.contact_phone || '(555) 123-4567'}
- Address: ${project.address || 'New York, NY'}

## REQUIRED SECTIONS (In Order)

1. NAV - Fixed, blur on scroll, logo + 5 links + CTA button
2. HERO - Full viewport, EMOTIONAL headline with gradient text, 2 CTAs, social proof, floating blobs
3. TRUST BAR - "Trusted by X+" with 5 placeholder company names
4. FEATURES - BENTO GRID layout (not boring columns), glassmorphism if dark
5. ABOUT - Split layout, image left, content right, experience badge
6. STATS - 4 animated counters on gradient/primary background
7. TESTIMONIALS - 3 cards with stars, photos (pravatar.cc), quotes, names
8. PROCESS - 3-4 numbered steps
9. CTA - Gradient background, compelling headline, white button
10. CONTACT - Form (name, email, phone, message) + contact info
11. FOOTER - Logo, links, social icons, copyright

## MUST INCLUDE

Google Fonts in head:
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">

JavaScript for:
- Scroll reveal (IntersectionObserver)
- Nav scroll effect
- Mobile menu toggle
- Smooth scroll
- Counter animation
- Form submit feedback

## IMAGES
- Hero: https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80
- About: https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80
- Avatars: https://i.pravatar.cc/150?img=1 (change number for different faces)

Generate the complete HTML now. Must look like $100,000 website. NO explanations - just HTML starting with <!DOCTYPE html>.`;
}

// =============================================================================
// CLEAN HTML
// =============================================================================

function cleanHTML(content: string): string {
  let cleaned = content.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  const doctypeMatch = cleaned.match(/<!DOCTYPE html>/i);
  const htmlEndMatch = cleaned.match(/<\/html>/i);
  if (doctypeMatch && htmlEndMatch) {
    cleaned = cleaned.substring(doctypeMatch.index!, htmlEndMatch.index! + 7);
  }
  return cleaned.trim();
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

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await supabase.from('projects').update({ status: 'GENERATING' }).eq('id', projectId);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: ELITE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(project) }],
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    const html = cleanHTML(content.text);
    if (!html.includes('<!DOCTYPE html>')) throw new Error('Invalid HTML');

    await supabase.from('projects').update({ generated_html: html, status: 'REVIEW' }).eq('id', projectId);

    return NextResponse.json({ success: true, html, tokensUsed: response.usage?.output_tokens || 0 });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Failed', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'AI Website Generator v3.0 - Billion Dollar Edition',
    patterns: ['Gradient mesh', 'Bento grid', 'Glassmorphism', 'Glowing CTAs', 'Scroll reveals', 'Counter animations'],
  });
}
