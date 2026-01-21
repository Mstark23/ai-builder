/**
 * VERKTORLABS Website Generation API v2
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
  fallbackIntelligence,
  INDUSTRY_STATS,
} from '@/lib/industry-intelligence';
import { getInspirationText } from '@/lib/industry-options';

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
// INDUSTRY INTELLIGENCE FETCHING
// =============================================================================

interface IntelligenceResult {
  intelligence: IndustryIntelligence;
  source: 'database' | 'static' | 'fallback';
}

/**
 * Fetch industry intelligence with cascading fallback:
 * 1. Try Supabase database
 * 2. Fall back to static data
 * 3. Fall back to generic template
 */
async function getIndustryIntelligence(industryId: string): Promise<IntelligenceResult> {
  // Try database first
  try {
    const { data, error } = await supabase
      .from('industries')
      .select('intelligence')
      .eq('id', industryId)
      .single();

    if (!error && data?.intelligence) {
      console.log(`✅ Loaded "${industryId}" from database`);
      return {
        intelligence: data.intelligence as IndustryIntelligence,
        source: 'database',
      };
    }
  } catch (err) {
    console.warn(`⚠️ Database lookup failed for "${industryId}":`, err);
  }

  // Try static data
  const staticIndustry = getIndustry(industryId);
  if (staticIndustry) {
    console.log(`📦 Loaded "${industryId}" from static data`);
    return {
      intelligence: staticIndustry,
      source: 'static',
    };
  }

  // Use fallback
  console.warn(`⚠️ Industry "${industryId}" not found, using fallback`);
  return {
    intelligence: { ...fallbackIntelligence, id: industryId },
    source: 'fallback',
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

/**
 * Build section instructions from industry data
 */
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

/**
 * Build the complete generation prompt using all intelligence data
 */
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
  const colors = { ...intelligence.design.colors, ...customizations?.colorOverride };
  const fonts = { ...intelligence.design.fonts, ...customizations?.fontOverride };
  const sectionInstructions = buildSectionInstructions(
    intelligence.sections,
    customizations?.excludeSections
  );

  // Get inspiration text
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

/**
 * POST /api/generate - Generate a website
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as GenerateRequest;

    // Extract project data
    const { project, pageType = 'landing', customInstructions, customizations } = body;
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
        },
        { status: 400 }
      );
    }

    // Fetch industry intelligence
    const { intelligence, source } = await getIndustryIntelligence(industryId);

    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`🚀 GENERATING WEBSITE`);
    console.log(`   Business: ${businessName}`);
    console.log(`   Industry: ${intelligence.name} (${intelligence.id})`);
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
      // Try to find the doctype
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

/**
 * GET /api/generate - Health check and industry listing
 */
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
    version: '2.1.0',
    database: dbStatus,
    statistics: {
      totalIndustries: INDUSTRY_STATS.total,
      bySource: INDUSTRY_STATS.bySource,
      categories: INDUSTRY_STATS.categories,
    },
    industriesByCategory: byCategory,
    endpoints: {
      'POST /api/generate': {
        description: 'Generate a website using industry intelligence',
        body: {
          project: {
            id: 'string (required)',
            industry: 'string (required) - industry ID',
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
