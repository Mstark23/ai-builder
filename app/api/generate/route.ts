/**
 * VERKTORLABS Website Generation API v2.3
 * 
 * Industry-intelligent website generation using comprehensive research data.
 * Fetches industry intelligence from Supabase with static fallback.
 * 
 * Endpoints:
 * - POST /api/generate - Generate a website page
 * - GET  /api/generate - Health check and available industries
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
  // E-commerce aliases
  'ecommerce': 'fashion-clothing',
  'e-commerce': 'fashion-clothing',
  'retail': 'fashion-clothing',
  'shop': 'fashion-clothing',
  'store': 'fashion-clothing',
  'online-store': 'fashion-clothing',
  'jewelry': 'jewelry',
  
  // Restaurant aliases
  'food': 'restaurant',
  'dining': 'restaurant',
  'cafe': 'cafe-coffee-shop',
  'coffee': 'cafe-coffee-shop',
  
  // Professional aliases
  'lawyer': 'law-firm',
  'legal': 'law-firm',
  'attorney': 'law-firm',
  'accountant': 'accounting-cpa',
  'accounting': 'accounting-cpa',
  'finance': 'financial-advisor',
  'financial': 'financial-advisor',
  'realestate': 'real-estate-residential',
  'real-estate': 'real-estate-residential',
  'realtor': 'real-estate-residential',
  
  // Healthcare aliases
  'dental': 'dental-clinic',
  'dentist': 'dental-clinic',
  'medical': 'dental-clinic',
  'healthcare': 'dental-clinic',
  'health': 'dental-clinic',
  
  // Tech aliases
  'saas': 'saas-startup',
  'software': 'saas-startup',
  'tech': 'saas-startup',
  'startup': 'saas-startup',
  'app': 'mobile-app',
  
  // Creative aliases
  'photography': 'photography-wedding',
  'photographer': 'photography-wedding',
  'design': 'portfolio-designer',
  'designer': 'portfolio-designer',
  'agency': 'marketing-agency',
  'marketing': 'marketing-agency',
  
  // Local services aliases
  'salon': 'salon-hair',
  'hair': 'salon-hair',
  'barbershop': 'salon-hair',
  'spa': 'med-spa',
  'beauty': 'med-spa',
  'gym': 'gym-boutique',
  'fitness': 'fitness-gym',
  'yoga': 'yoga-pilates',
  
  // Other aliases
  'hotel': 'hotel-hospitality',
  'hospitality': 'hotel-hospitality',
  'nonprofit': 'nonprofit-charity',
  'charity': 'nonprofit-charity',
  'wedding': 'wedding-planner',
  'events': 'wedding-planner',
  'coaching': 'coach-life',
  'coach': 'coach-life',
  'course': 'course-creator',
  'education': 'course-creator',
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

  // Try database first with original ID
  try {
    const { data, error } = await supabase
      .from('industries')
      .select('intelligence')
      .eq('id', industryId)
      .single();

    if (!error && data?.intelligence) {
      console.log(`✅ Loaded "${industryId}" from database`);
      return {
        intelligence: ensureCompleteIntelligence(data.intelligence as Partial<IndustryIntelligence>, industryId),
        source: 'database',
        originalId,
      };
    }
  } catch (err) {
    // Continue to next fallback
  }

  // Try database with normalized ID if different
  if (wasNormalized) {
    try {
      const { data, error } = await supabase
        .from('industries')
        .select('intelligence')
        .eq('id', normalizedId)
        .single();

      if (!error && data?.intelligence) {
        console.log(`✅ Loaded "${normalizedId}" from database (mapped from "${industryId}")`);
        return {
          intelligence: ensureCompleteIntelligence(data.intelligence as Partial<IndustryIntelligence>, normalizedId),
          source: 'database',
          originalId,
          mappedFrom: industryId,
        };
      }
    } catch (err) {
      // Continue to next fallback
    }
  }

  // Try static data with original ID
  const staticIndustry = getIndustry(industryId);
  if (staticIndustry) {
    console.log(`📦 Loaded "${industryId}" from static data`);
    return {
      intelligence: ensureCompleteIntelligence(staticIndustry, industryId),
      source: 'static',
      originalId,
    };
  }

  // Try static data with normalized ID
  if (wasNormalized) {
    const normalizedStaticIndustry = getIndustry(normalizedId);
    if (normalizedStaticIndustry) {
      console.log(`📦 Loaded "${normalizedId}" from static data (mapped from "${industryId}")`);
      return {
        intelligence: ensureCompleteIntelligence(normalizedStaticIndustry, normalizedId),
        source: 'static',
        originalId,
        mappedFrom: industryId,
      };
    }
  }

  // Use complete fallback
  console.warn(`⚠️ Industry "${industryId}" not found, using fallback`);
  return {
    intelligence: ensureCompleteIntelligence(undefined, industryId),
    source: 'fallback',
    originalId,
  };
}

// =============================================================================
// PROMPT BUILDING
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

function buildSectionInstructions(sections: Section[], excludeIds: string[] = []): string {
  const filteredSections = sections.filter((s) => !excludeIds.includes(s.id));
  
  return filteredSections
    .map((section) => {
      const tag = section.required ? '🔴 REQUIRED' : '🟡 RECOMMENDED';
      return `
### ${section.name} [${tag}]
**Purpose:** ${section.purpose}
**Key Elements:**
${section.keyElements.map((el) => `  • ${el}`).join('\n')}`;
    })
    .join('\n\n');
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

  // Apply overrides with safe access
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
  
  const sectionInstructions = buildSectionInstructions(
    intelligence.sections,
    customizations?.excludeSections
  );

  const inspirationBrands = intelligence.topBrands.slice(0, 4).join(', ');

  return `You are an elite website designer creating a ${pageType} page for "${businessName}".
Your designs are informed by extensive research on the most successful ${intelligence.name} websites.

═══════════════════════════════════════════════════════════════════════════════
                              INDUSTRY INTELLIGENCE
═══════════════════════════════════════════════════════════════════════════════

## Industry: ${intelligence.name}
## Inspired By: ${inspirationBrands}
## Category: ${intelligence.category}

These brands set the standard for ${intelligence.name} websites. Study their patterns:
${intelligence.topBrands.map((brand) => `• ${brand}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                              CUSTOMER PSYCHOLOGY
═══════════════════════════════════════════════════════════════════════════════

Understanding your visitors is critical to conversion. This research reveals what works:

### What Customers NEED to See (Before They'll Convert)
${intelligence.psychology.customerNeeds.map((need) => `✓ ${need}`).join('\n')}

### Trust Factors That Drive Decisions
${intelligence.psychology.trustFactors.map((factor) => `🛡️ ${factor}`).join('\n')}

### Emotional Triggers to Leverage
${intelligence.psychology.emotionalTriggers.map((trigger) => `❤️ ${trigger}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                              PAGE SECTIONS
═══════════════════════════════════════════════════════════════════════════════

Create these sections following proven patterns from top ${intelligence.name} websites:

${sectionInstructions}

═══════════════════════════════════════════════════════════════════════════════
                              DESIGN SYSTEM
═══════════════════════════════════════════════════════════════════════════════

Apply this exact design system. These choices are research-backed for ${intelligence.name}:

### Color Palette
${intelligence.design.colorDescription}

\`\`\`css
:root {
  --primary: ${colors.primary};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  --background: ${colors.background};
}
\`\`\`

### Typography
${intelligence.design.typography}

- **Headings:** ${fonts.heading} (import from Google Fonts)
- **Body Text:** ${fonts.body} (import from Google Fonts)

### Visual Style
- **Images:** ${intelligence.design.imageStyle}
- **Spacing:** ${intelligence.design.spacing}

### Overall Mood
${intelligence.design.mood}

═══════════════════════════════════════════════════════════════════════════════
                              COPYWRITING STYLE
═══════════════════════════════════════════════════════════════════════════════

### Tone of Voice
${intelligence.copywriting.tone}

### Example Headlines That Convert (Use These Patterns)
${intelligence.copywriting.exampleHeadlines.map((h) => `📝 "${h}"`).join('\n')}

### Proven CTAs for This Industry
${intelligence.copywriting.exampleCTAs.map((cta) => `🎯 "${cta}"`).join('\n')}

### ❌ Phrases to AVOID (Overused/Ineffective)
${intelligence.copywriting.avoidPhrases.map((phrase) => `• "${phrase}"`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                              CURATED IMAGES
═══════════════════════════════════════════════════════════════════════════════

Use these pre-selected, high-quality images (Unsplash URLs):

### Hero/Banner Images
${intelligence.images.hero.map((url) => url).join('\n')}

### Product/Service Images
${intelligence.images.products.map((url) => url).join('\n')}

### Lifestyle/Context Images
${intelligence.images.lifestyle.map((url) => url).join('\n')}

### About/Team Images
${intelligence.images.about.map((url) => url).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                              BUSINESS DETAILS
═══════════════════════════════════════════════════════════════════════════════

**Business Name:** ${businessName}
${businessDescription ? `**Description:** ${businessDescription}` : ''}
${targetAudience ? `**Target Audience:** ${targetAudience}` : ''}
${uniqueSellingPoints?.length ? `**Unique Selling Points:**\n${uniqueSellingPoints.map((usp) => `• ${usp}`).join('\n')}` : ''}
${location ? `**Location:** ${location}` : ''}
${contactInfo?.phone ? `**Phone:** ${contactInfo.phone}` : ''}
${contactInfo?.email ? `**Email:** ${contactInfo.email}` : ''}
${contactInfo?.address ? `**Address:** ${contactInfo.address}` : ''}

═══════════════════════════════════════════════════════════════════════════════
                              OUTPUT REQUIREMENTS
═══════════════════════════════════════════════════════════════════════════════

Generate a COMPLETE, PRODUCTION-READY single-page website that:

1. ✅ Follows the design system EXACTLY (colors, fonts, spacing)
2. ✅ Includes ALL required sections with proper hierarchy
3. ✅ Uses the provided Unsplash images (with proper sizing: ?w=1920 for hero, ?w=800 for cards)
4. ✅ Implements the copywriting style and tone
5. ✅ Is fully responsive (mobile-first approach)
6. ✅ Is accessible (semantic HTML, ARIA labels, proper contrast)
7. ✅ Includes Google Fonts import in <head>
8. ✅ Has smooth scroll behavior
9. ✅ Includes subtle, professional animations (fade-in, hover states)
10. ✅ Uses CSS custom properties for the color system

Output the complete HTML document with embedded <style> and minimal <script> tags.
Start with <!DOCTYPE html> and include everything needed for the page to work standalone.

DO NOT include any markdown, explanations, or code blocks - ONLY the raw HTML.`;
}

// =============================================================================
// API HANDLERS
// =============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as GenerateRequest;

    // Extract project data
    const { project, pageType = 'landing', customInstructions, customizations } = body;
    
    // Safely check project object
    if (!project || typeof project !== 'object') {
      return NextResponse.json(
        {
          error: 'Invalid request: project object is required',
          required: ['project.id', 'project.industry', 'project.businessName'],
        },
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

    // Validate required fields
    if (!projectId || !industryId || !businessName) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['project.id', 'project.industry', 'project.businessName'],
          received: { projectId: !!projectId, industryId: !!industryId, businessName: !!businessName },
        },
        { status: 400 }
      );
    }

    // Fetch industry intelligence (with alias mapping and safe fallback)
    const { intelligence, source, mappedFrom } = await getIndustryIntelligence(industryId);

    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`🚀 GENERATING WEBSITE`);
    console.log(`   Business: ${businessName}`);
    console.log(`   Industry: ${intelligence.name} (${intelligence.id})`);
    console.log(`   Original ID: ${industryId}${mappedFrom ? ` (mapped to ${intelligence.id})` : ''}`);
    console.log(`   Source: ${source}`);
    console.log(`   Page Type: ${pageType}`);
    console.log('═══════════════════════════════════════════════════════════════');

    // Build the detailed prompt
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

    // Append custom instructions if provided
    if (customInstructions) {
      prompt += `\n\n═══════════════════════════════════════════════════════════════════════════════
                              ADDITIONAL INSTRUCTIONS
═══════════════════════════════════════════════════════════════════════════════

${customInstructions}`;
    }

    // Generate with Claude
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract generated content
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Clean up the response (remove any markdown if present)
    let html = content.text.trim();
    
    // Handle if wrapped in code blocks
    const htmlMatch = html.match(/```(?:html)?\n?([\s\S]*?)```/);
    if (htmlMatch) {
      html = htmlMatch[1].trim();
    }

    // Ensure it starts with DOCTYPE
    if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<!doctype')) {
      const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
      if (doctypeIndex > 0) {
        html = html.substring(doctypeIndex);
      }
    }

    // Calculate generation time
    const generationTime = Date.now() - startTime;

    // Log to database (non-blocking)
    supabase
      .from('generations')
      .insert({
        project_id: projectId,
        industry_id: intelligence.id,
        business_name: businessName,
        page_type: pageType,
        html_content: html,
        intelligence_snapshot: intelligence,
        intelligence_source: source,
        generation_time_ms: generationTime,
        created_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) {
          console.log('Note: Could not log generation:', error.message);
        }
      });

    // Build response
    const response: GenerateResponse = {
      success: true,
      industry: intelligence.id,
      industryName: intelligence.name,
      usedFallback: source === 'fallback',
      generatedCode: html,
      metadata: {
        model: 'claude-sonnet-4-20250514',
        pageType,
        sectionsIncluded: intelligence.sections.map((s) => s.id),
        designSystem: {
          colors: intelligence.design.colors,
          fonts: intelligence.design.fonts,
          mood: intelligence.design.mood,
        },
      },
    };

    console.log(`✅ Generated in ${generationTime}ms (${html.length} bytes)`);

    return NextResponse.json({
      ...response,
      projectId,
      intelligenceSource: source,
      generationTimeMs: generationTime,
      inspirationBrands: intelligence.topBrands.slice(0, 4),
      mappedFrom: mappedFrom || null,
    });
  } catch (error) {
    console.error('❌ Generation error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate website',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Group industries by category
  const byCategory = ALL_INDUSTRIES.reduce(
    (acc, ind) => {
      if (!acc[ind.category]) {
        acc[ind.category] = [];
      }
      acc[ind.category].push({
        id: ind.id,
        name: ind.name,
        topBrands: ind.topBrands.slice(0, 3),
      });
      return acc;
    },
    {} as Record<string, { id: string; name: string; topBrands: string[] }[]>
  );

  // Check database connectivity
  let dbStatus = 'unknown';
  try {
    const { count, error } = await supabase
      .from('industries')
      .select('*', { count: 'exact', head: true });
    
    if (!error) {
      dbStatus = `connected (${count} industries)`;
    } else {
      dbStatus = `error: ${error.message}`;
    }
  } catch (err) {
    dbStatus = 'not configured';
  }

  return NextResponse.json({
    status: 'healthy',
    service: 'VERKTORLABS Website Generation API',
    version: '2.3.0',
    database: dbStatus,
    statistics: {
      totalIndustries: INDUSTRY_STATS.total,
      bySource: INDUSTRY_STATS.bySource,
      categories: INDUSTRY_STATS.categories,
    },
    industryAliases: Object.keys(INDUSTRY_ID_ALIASES),
    industriesByCategory: byCategory,
    endpoints: {
      'POST /api/generate': {
        description: 'Generate a website using industry intelligence',
        body: {
          project: {
            id: 'string (required)',
            industry: 'string (required) - industry ID or alias',
            businessName: 'string (required)',
            businessDescription: 'string (optional)',
            targetAudience: 'string (optional)',
            uniqueSellingPoints: 'string[] (optional)',
            location: 'string (optional)',
            contactInfo: {
              phone: 'string (optional)',
              email: 'string (optional)',
              address: 'string (optional)',
            },
          },
          pageType: 'string (optional) - landing, homepage, about, services, contact, product',
          customInstructions: 'string (optional)',
          customizations: {
            excludeSections: 'string[] (optional)',
            colorOverride: 'Partial<ColorPalette> (optional)',
            fontOverride: 'Partial<FontPairing> (optional)',
          },
        },
      },
      'GET /api/generate': 'This endpoint - health check and industry listing',
    },
  });
}
