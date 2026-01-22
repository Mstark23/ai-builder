/**
 * VERKTORLABS Website Generation API v3.0 - FIXED
 * 
 * KEY FIX: Now includes actual component templates and CSS in the prompt
 * so Claude can use your pre-built design system instead of generating from scratch.
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import type {
  IndustryIntelligence,
  GenerateRequest,
  GenerateResponse,
  Section,
  ColorPalette,
  FontPairing,
} from '@/types/industry';

// Import static data as fallback
import {
  ALL_INDUSTRIES,
  getIndustry,
  INDUSTRY_STATS,
} from '@/lib/industry-intelligence';

// ⭐ NEW: Import the actual component libraries
import { REQUIRED_CSS, REQUIRED_JS, ANIMATION_KEYFRAMES, MASTER_SYSTEM_PROMPT } from '@/lib/ai/master-prompt';
import { HERO_COMPONENTS } from '@/lib/ai/components';
import { ALL_SECTIONS } from '@/lib/ai/all-sections';
import { ICONS } from '@/lib/ai/icons';

// =============================================================================
// INITIALIZATION
// =============================================================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =============================================================================
// COMPONENT TEMPLATE SELECTOR
// =============================================================================

/**
 * Select appropriate section templates based on industry and style
 */
function selectTemplates(industry: string, style: string) {
  // Map industry to best template choices
  const heroChoice = style === 'minimal' ? 'centeredHero' : 
                     style === 'bold' ? 'videoHero' : 'splitHero';
  
  const servicesChoice = industry.includes('restaurant') ? 'tabs' :
                         industry.includes('salon') ? 'hoverCards' :
                         industry.includes('law') ? 'iconCards' : 'bentoGrid';
  
  const testimonialsChoice = style === 'elegant' ? 'featuredSingle' : 'slider';
  
  return {
    hero: HERO_COMPONENTS[heroChoice as keyof typeof HERO_COMPONENTS] || HERO_COMPONENTS.splitHero,
    services: ALL_SECTIONS.services[servicesChoice as keyof typeof ALL_SECTIONS.services] || ALL_SECTIONS.services.bentoGrid,
    testimonials: ALL_SECTIONS.testimonials[testimonialsChoice as keyof typeof ALL_SECTIONS.testimonials] || ALL_SECTIONS.testimonials.slider,
    about: ALL_SECTIONS.about?.splitImage || '',
    contact: ALL_SECTIONS.contact?.splitForm || '',
    cta: ALL_SECTIONS.cta?.gradient || '',
    footer: ALL_SECTIONS.footer?.modern || '',
  };
}

// =============================================================================
// DEFAULT FALLBACK INTELLIGENCE (Complete Structure)
// =============================================================================

const DEFAULT_FALLBACK: IndustryIntelligence = {
  id: 'general',
  name: 'General Business',
  category: 'general',
  topBrands: ['Apple', 'Airbnb', 'Stripe', 'Notion'],
  psychology: {
    customerNeeds: [
      'Clear understanding of services/products',
      'Easy way to contact or purchase',
      'Trust and credibility signals',
      'Professional appearance',
    ],
    trustFactors: [
      'Professional design',
      'Clear contact information',
      'Customer testimonials',
      'About us section',
    ],
    emotionalTriggers: [
      'Confidence in quality',
      'Ease of doing business',
      'Professional reliability',
      'Modern and current',
    ],
  },
  sections: [
    { id: 'hero', name: 'Hero', purpose: 'Capture attention and communicate value proposition', keyElements: ['Headline', 'Subheadline', 'CTA Button', 'Hero Image'], required: true },
    { id: 'services', name: 'Services', purpose: 'Showcase what you offer', keyElements: ['Service cards', 'Icons', 'Brief descriptions'], required: true },
    { id: 'about', name: 'About', purpose: 'Build trust and connection', keyElements: ['Company story', 'Mission', 'Team photo'], required: true },
    { id: 'testimonials', name: 'Testimonials', purpose: 'Social proof', keyElements: ['Customer quotes', 'Names', 'Photos'], required: false },
    { id: 'contact', name: 'Contact', purpose: 'Enable customer connection', keyElements: ['Contact form', 'Phone', 'Email', 'Address'], required: true },
    { id: 'footer', name: 'Footer', purpose: 'Navigation and legal', keyElements: ['Links', 'Social media', 'Copyright'], required: true },
  ],
  design: {
    colors: {
      primary: '#000000',
      secondary: '#4F46E5',
      accent: '#10B981',
      background: '#FFFFFF',
    },
    colorDescription: 'Clean, professional palette with black primary and indigo accent',
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    typography: 'Modern sans-serif typography for clean readability',
    imageStyle: 'Professional, high-quality photography with clean compositions',
    spacing: 'Generous whitespace for premium feel',
    mood: 'Professional, trustworthy, modern',
  },
  copywriting: {
    tone: 'Professional yet approachable, clear and concise',
    exampleHeadlines: [
      'Solutions That Drive Results',
      'Your Success, Our Mission',
      'Excellence in Every Detail',
    ],
    exampleCTAs: [
      'Get Started',
      'Learn More',
      'Contact Us',
      'Request a Quote',
    ],
    avoidPhrases: [
      'We are the best',
      'Synergy',
      'Revolutionary',
      'Game-changing',
    ],
  },
  images: {
    hero: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920',
    ],
    products: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    ],
    lifestyle: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    ],
    about: [
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
    ],
  },
};

// =============================================================================
// INDUSTRY ID MAPPING (for legacy/simplified IDs)
// =============================================================================

const INDUSTRY_ID_ALIASES: Record<string, string> = {
  'ecommerce': 'fashion-clothing',
  'e-commerce': 'fashion-clothing',
  'retail': 'fashion-clothing',
  'restaurant': 'restaurant',
  'food': 'restaurant',
  'lawyer': 'law-firm',
  'legal': 'law-firm',
  'salon': 'salon-hair',
  'spa': 'med-spa',
  'general': 'general',
};

function normalizeIndustryId(id: string): string {
  const normalized = id.toLowerCase().trim();
  return INDUSTRY_ID_ALIASES[normalized] || normalized;
}

// =============================================================================
// SAFE PROPERTY ACCESS HELPERS
// =============================================================================

function ensureCompleteIntelligence(partial: Partial<IndustryIntelligence> | undefined, id: string): IndustryIntelligence {
  if (!partial) {
    return { ...DEFAULT_FALLBACK, id, name: `${id} Business` };
  }

  return {
    id: partial.id || id,
    name: partial.name || `${id} Business`,
    category: partial.category || 'general',
    topBrands: partial.topBrands?.length ? partial.topBrands : DEFAULT_FALLBACK.topBrands,
    psychology: {
      customerNeeds: partial.psychology?.customerNeeds?.length ? partial.psychology.customerNeeds : DEFAULT_FALLBACK.psychology.customerNeeds,
      trustFactors: partial.psychology?.trustFactors?.length ? partial.psychology.trustFactors : DEFAULT_FALLBACK.psychology.trustFactors,
      emotionalTriggers: partial.psychology?.emotionalTriggers?.length ? partial.psychology.emotionalTriggers : DEFAULT_FALLBACK.psychology.emotionalTriggers,
    },
    sections: partial.sections?.length ? partial.sections : DEFAULT_FALLBACK.sections,
    design: {
      colors: {
        primary: partial.design?.colors?.primary || DEFAULT_FALLBACK.design.colors.primary,
        secondary: partial.design?.colors?.secondary || DEFAULT_FALLBACK.design.colors.secondary,
        accent: partial.design?.colors?.accent || DEFAULT_FALLBACK.design.colors.accent,
        background: partial.design?.colors?.background || DEFAULT_FALLBACK.design.colors.background,
      },
      colorDescription: partial.design?.colorDescription || DEFAULT_FALLBACK.design.colorDescription,
      fonts: {
        heading: partial.design?.fonts?.heading || DEFAULT_FALLBACK.design.fonts.heading,
        body: partial.design?.fonts?.body || DEFAULT_FALLBACK.design.fonts.body,
      },
      typography: partial.design?.typography || DEFAULT_FALLBACK.design.typography,
      imageStyle: partial.design?.imageStyle || DEFAULT_FALLBACK.design.imageStyle,
      spacing: partial.design?.spacing || DEFAULT_FALLBACK.design.spacing,
      mood: partial.design?.mood || DEFAULT_FALLBACK.design.mood,
    },
    copywriting: {
      tone: partial.copywriting?.tone || DEFAULT_FALLBACK.copywriting.tone,
      exampleHeadlines: partial.copywriting?.exampleHeadlines?.length ? partial.copywriting.exampleHeadlines : DEFAULT_FALLBACK.copywriting.exampleHeadlines,
      exampleCTAs: partial.copywriting?.exampleCTAs?.length ? partial.copywriting.exampleCTAs : DEFAULT_FALLBACK.copywriting.exampleCTAs,
      avoidPhrases: partial.copywriting?.avoidPhrases?.length ? partial.copywriting.avoidPhrases : DEFAULT_FALLBACK.copywriting.avoidPhrases,
    },
    images: {
      hero: partial.images?.hero?.length ? partial.images.hero : DEFAULT_FALLBACK.images.hero,
      products: partial.images?.products?.length ? partial.images.products : DEFAULT_FALLBACK.images.products,
      lifestyle: partial.images?.lifestyle?.length ? partial.images.lifestyle : DEFAULT_FALLBACK.images.lifestyle,
      about: partial.images?.about?.length ? partial.images.about : DEFAULT_FALLBACK.images.about,
    },
  };
}

// =============================================================================
// INDUSTRY INTELLIGENCE FETCHING
// =============================================================================

interface IntelligenceResult {
  intelligence: IndustryIntelligence;
  source: 'database' | 'static' | 'fallback';
  originalId?: string;
  mappedFrom?: string;
}

async function getIndustryIntelligence(industryId: string): Promise<IntelligenceResult> {
  const originalId = industryId;
  const normalizedId = normalizeIndustryId(industryId);
  const wasNormalized = normalizedId !== industryId.toLowerCase().trim();

  // Try database first
  try {
    const { data, error } = await supabase
      .from('industries')
      .select('intelligence')
      .eq('id', industryId)
      .single();

    if (!error && data?.intelligence) {
      return {
        intelligence: ensureCompleteIntelligence(data.intelligence as Partial<IndustryIntelligence>, industryId),
        source: 'database',
        originalId,
      };
    }
  } catch {
    // Continue to fallback
  }

  // Try static data
  const staticIndustry = getIndustry(normalizedId);
  if (staticIndustry) {
    return {
      intelligence: ensureCompleteIntelligence(staticIndustry, normalizedId),
      source: 'static',
      originalId,
      mappedFrom: wasNormalized ? industryId : undefined,
    };
  }

  // Use fallback
  return {
    intelligence: ensureCompleteIntelligence(undefined, industryId),
    source: 'fallback',
    originalId,
  };
}

// =============================================================================
// ⭐ FIXED PROMPT BUILDING - Now includes actual templates!
// =============================================================================

interface PromptConfig {
  intelligence: IndustryIntelligence;
  businessName: string;
  businessDescription?: string;
  targetAudience?: string;
  uniqueSellingPoints?: string[];
  location?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  customizations?: {
    excludeSections?: string[];
    colorOverride?: Partial<ColorPalette>;
    fontOverride?: Partial<FontPairing>;
  };
  pageType: string;
}

function buildDetailedPrompt(config: PromptConfig): string {
  const {
    intelligence,
    businessName,
    businessDescription,
    targetAudience,
    uniqueSellingPoints,
    location,
    contactInfo,
    customizations,
    pageType,
  } = config;

  // Apply overrides
  const colors = {
    primary: customizations?.colorOverride?.primary || intelligence.design.colors.primary,
    secondary: customizations?.colorOverride?.secondary || intelligence.design.colors.secondary,
    accent: customizations?.colorOverride?.accent || intelligence.design.colors.accent,
    background: customizations?.colorOverride?.background || intelligence.design.colors.background,
  };
  
  const fonts = {
    heading: customizations?.fontOverride?.heading || intelligence.design.fonts.heading,
    body: customizations?.fontOverride?.body || intelligence.design.fonts.body,
  };

  // Select appropriate templates for this industry/style
  const templates = selectTemplates(intelligence.id, 'modern');

  // ⭐ THE KEY FIX: Include actual CSS and templates in the prompt
  return `${MASTER_SYSTEM_PROMPT}

═══════════════════════════════════════════════════════════════════════════════
                              BUSINESS DETAILS
═══════════════════════════════════════════════════════════════════════════════

**Business Name:** ${businessName}
**Industry:** ${intelligence.name}
${businessDescription ? `**Description:** ${businessDescription}` : ''}
${targetAudience ? `**Target Audience:** ${targetAudience}` : ''}
${uniqueSellingPoints?.length ? `**Unique Selling Points:**\n${uniqueSellingPoints.map((usp) => `• ${usp}`).join('\n')}` : ''}
${location ? `**Location:** ${location}` : ''}
${contactInfo?.phone ? `**Phone:** ${contactInfo.phone}` : ''}
${contactInfo?.email ? `**Email:** ${contactInfo.email}` : ''}
${contactInfo?.address ? `**Address:** ${contactInfo.address}` : ''}

═══════════════════════════════════════════════════════════════════════════════
                              DESIGN SYSTEM (USE THIS EXACTLY)
═══════════════════════════════════════════════════════════════════════════════

Your website MUST use this exact color system. Update the CSS variables:

\`\`\`css
:root {
  --primary: ${colors.primary};
  --primary-rgb: ${hexToRgb(colors.primary)};
  --secondary: ${colors.secondary};
  --secondary-rgb: ${hexToRgb(colors.secondary)};
  --accent: ${colors.accent};
  --accent-rgb: ${hexToRgb(colors.accent)};
  --background: ${colors.background};
  --font-display: '${fonts.heading}', sans-serif;
  --font-body: '${fonts.body}', sans-serif;
}
\`\`\`

═══════════════════════════════════════════════════════════════════════════════
                    REQUIRED CSS FRAMEWORK (INCLUDE IN <style>)
═══════════════════════════════════════════════════════════════════════════════

${REQUIRED_CSS}

${ANIMATION_KEYFRAMES}

═══════════════════════════════════════════════════════════════════════════════
                    SECTION TEMPLATES (USE THESE AS BASE)
═══════════════════════════════════════════════════════════════════════════════

Use these pre-built section templates. Replace placeholders like [HEADLINE], [BUSINESS_NAME], etc.

### HERO SECTION TEMPLATE:
${templates.hero}

### SERVICES SECTION TEMPLATE:
${templates.services}

### TESTIMONIALS SECTION TEMPLATE:
${templates.testimonials}

═══════════════════════════════════════════════════════════════════════════════
                    REQUIRED JAVASCRIPT (INCLUDE BEFORE </body>)
═══════════════════════════════════════════════════════════════════════════════

${REQUIRED_JS}

═══════════════════════════════════════════════════════════════════════════════
                              IMAGES TO USE
═══════════════════════════════════════════════════════════════════════════════

Hero Images (pick one):
${intelligence.images.hero.map((url) => `• ${url}`).join('\n')}

About/Team Images:
${intelligence.images.about.map((url) => `• ${url}`).join('\n')}

Product/Service Images:
${intelligence.images.products.map((url) => `• ${url}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                              COPYWRITING GUIDANCE
═══════════════════════════════════════════════════════════════════════════════

Tone: ${intelligence.copywriting.tone}

Example Headlines (use similar style):
${intelligence.copywriting.exampleHeadlines.map((h) => `• "${h}"`).join('\n')}

CTA Buttons (use these):
${intelligence.copywriting.exampleCTAs.map((cta) => `• "${cta}"`).join('\n')}

DO NOT use these overused phrases:
${intelligence.copywriting.avoidPhrases.map((p) => `• "${p}"`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                              OUTPUT INSTRUCTIONS
═══════════════════════════════════════════════════════════════════════════════

1. Output a COMPLETE HTML document starting with <!DOCTYPE html>
2. Include ALL the CSS from above in a <style> tag in <head>
3. Include the JavaScript before </body>
4. Use the section templates provided, filling in business-specific content
5. Make sure colors match the design system
6. Ensure fully responsive design
7. DO NOT include markdown code blocks - just raw HTML
8. DO NOT add explanations - just the HTML

Generate the website now:`;
}

// Helper to convert hex to RGB values
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

// =============================================================================
// API HANDLERS
// =============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as GenerateRequest;
    const { project, pageType = 'landing', customInstructions, customizations } = body;
    
    if (!project || typeof project !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request: project object is required' },
        { status: 400 }
      );
    }

    const {
      id: projectId,
      industry: industryId,
      businessName,
      businessDescription,
      targetAudience,
      uniqueSellingPoints,
      location,
      contactInfo,
    } = project;

    if (!projectId || !industryId || !businessName) {
      return NextResponse.json(
        { error: 'Missing required fields: project.id, project.industry, project.businessName' },
        { status: 400 }
      );
    }

    // Fetch industry intelligence
    const { intelligence, source, mappedFrom } = await getIndustryIntelligence(industryId);

    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`🚀 GENERATING WEBSITE (FIXED v3.0)`);
    console.log(`   Business: ${businessName}`);
    console.log(`   Industry: ${intelligence.name} (${intelligence.id})`);
    console.log(`   Source: ${source}`);
    console.log('═══════════════════════════════════════════════════════════════');

    // Build prompt with actual templates included
    let prompt = buildDetailedPrompt({
      intelligence,
      businessName,
      businessDescription,
      targetAudience,
      uniqueSellingPoints,
      location,
      contactInfo,
      customizations,
      pageType,
    });

    if (customInstructions) {
      prompt += `\n\nADDITIONAL INSTRUCTIONS:\n${customInstructions}`;
    }

    // Generate with Claude
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Clean up response
    let html = content.text.trim();
    const htmlMatch = html.match(/```(?:html)?\n?([\s\S]*?)```/);
    if (htmlMatch) {
      html = htmlMatch[1].trim();
    }

    // Ensure DOCTYPE
    if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<!doctype')) {
      const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
      if (doctypeIndex > 0) {
        html = html.substring(doctypeIndex);
      }
    }

    const generationTime = Date.now() - startTime;
    console.log(`✅ Generated in ${generationTime}ms (${html.length} bytes)`);

    return NextResponse.json({
      success: true,
      industry: intelligence.id,
      industryName: intelligence.name,
      usedFallback: source === 'fallback',
      generatedCode: html,
      projectId,
      intelligenceSource: source,
      generationTimeMs: generationTime,
      mappedFrom: mappedFrom || null,
    });
  } catch (error) {
    console.error('❌ Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate website', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'VERKTORLABS Website Generation API',
    version: '3.0.0 (FIXED)',
    note: 'Now includes actual component templates in prompts',
  });
}
