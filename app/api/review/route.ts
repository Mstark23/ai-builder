import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================
// DESIGN DIRECTION SPECIFICATIONS
// ============================================
const designSpecs: Record<string, {
  requiredElements: string[];
  colorProfile: string;
  typographyRules: string[];
  layoutRules: string[];
  forbiddenElements: string[];
}> = {
  luxury_minimal: {
    requiredElements: ['generous whitespace', 'serif headlines', 'subtle animations', 'refined color palette'],
    colorProfile: 'Muted, sophisticated palette with possible gold/cream accents. No bright or saturated colors.',
    typographyRules: ['Serif font for headlines (Cormorant, Playfair, etc.)', 'Clean sans-serif for body', 'Large letter-spacing in headlines'],
    layoutRules: ['Asymmetric layouts welcome', 'Lots of breathing room', 'Single-column sections', 'Minimal visual clutter'],
    forbiddenElements: ['Bright neon colors', 'Busy patterns', 'Multiple competing fonts', 'Dense content blocks'],
  },
  bold_modern: {
    requiredElements: ['oversized typography', 'geometric shapes', 'high contrast', 'bold CTAs'],
    colorProfile: 'High contrast with one bold accent color (red, pink, electric blue). Black and white as base.',
    typographyRules: ['Sans-serif geometric fonts (Space Grotesk, DM Sans)', 'Extra bold weights', 'Oversized headlines (60px+)'],
    layoutRules: ['Asymmetric/broken grid layouts', 'Overlapping elements', 'Strong visual hierarchy', 'Dynamic angles allowed'],
    forbiddenElements: ['Script fonts', 'Pastel colors', 'Traditional centered layouts', 'Small timid typography'],
  },
  warm_organic: {
    requiredElements: ['earth tones', 'rounded corners', 'natural textures', 'friendly imagery'],
    colorProfile: 'Warm earth palette: terracotta, sage, cream, brown, muted orange. No cold blues or stark whites.',
    typographyRules: ['Friendly serif or rounded sans-serif', 'Warm, approachable feel', 'Medium weights'],
    layoutRules: ['Rounded corners on cards/buttons', 'Soft shadows', 'Organic flowing sections', 'Cozy, inviting feel'],
    forbiddenElements: ['Sharp corners', 'Cold color palette', 'Stark minimalism', 'Tech/futuristic elements'],
  },
  dark_premium: {
    requiredElements: ['dark background (#0D0D0D or similar)', 'gradient accents', 'glowing effects', 'glass morphism'],
    colorProfile: 'Dark base (#0A0A0A to #1A1A2E) with luminous accents (purple, cyan, magenta gradients).',
    typographyRules: ['Clean modern sans-serif', 'White or light gray text', 'Possible gradient text effects'],
    layoutRules: ['Card-based layouts with glass effect', 'Subtle background gradients', 'Glowing hover states', 'Depth through layering'],
    forbiddenElements: ['White backgrounds', 'Bright flat colors', 'Traditional corporate styling', 'Heavy drop shadows'],
  },
  editorial_classic: {
    requiredElements: ['strong typography hierarchy', 'grid-based layout', 'dramatic imagery', 'editorial spacing'],
    colorProfile: 'Mostly black, white, with one accent (gold, deep red, or navy). Magazine-like sophistication.',
    typographyRules: ['Classic serif for headlines (Playfair, Times, Lora)', 'Clear hierarchy', 'Pull quotes styled'],
    layoutRules: ['Strong grid structure', 'Magazine-style layouts', 'Large hero images', 'Text-focused sections'],
    forbiddenElements: ['Playful elements', 'Rounded buttons', 'Casual fonts', 'Busy backgrounds'],
  },
  vibrant_energy: {
    requiredElements: ['bold bright colors', 'playful animations', 'dynamic shapes', 'friendly illustrations'],
    colorProfile: 'Vibrant, saturated colors: orange, teal, yellow, pink. High energy palette.',
    typographyRules: ['Rounded friendly sans-serif (Poppins, Nunito)', 'Playful weights', 'Possible bouncy animations'],
    layoutRules: ['Dynamic flowing shapes', 'Colorful sections', 'Fun hover effects', 'Energetic visual rhythm'],
    forbiddenElements: ['Muted colors', 'Serious corporate tone', 'Minimal stark layouts', 'Traditional structure'],
  },
};

// ============================================
// REVIEW CRITERIA WEIGHTS
// ============================================
const reviewWeights = {
  designDirection: 25,    // Does it match the selected style?
  brandVoice: 20,         // Does copy match the tone?
  colorPalette: 15,       // Colors match preference?
  features: 15,           // Are requested features present?
  heroSection: 10,        // Hero matches preference?
  responsiveness: 10,     // Mobile-friendly indicators?
  accessibility: 5,       // Basic a11y present?
};

// ============================================
// MAIN REVIEW FUNCTION
// ============================================
export async function POST(request: NextRequest) {
  // Auth: only admins can trigger reviews
  // Auth handled by admin layout

  try {
    const { projectId, generatedHtml } = await request.json();

    if (!projectId || !generatedHtml) {
      return NextResponse.json(
        { error: 'Missing projectId or generatedHtml' },
        { status: 400 }
      );
    }

    // Fetch project requirements from database
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get design specs for the selected direction
    const designDirection = project.design_direction || 'bold_modern';
    const specs = designSpecs[designDirection] || designSpecs.bold_modern;

    // Build the review prompt
    const reviewPrompt = buildReviewPrompt(project, specs, generatedHtml);

    // Call Claude for review
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: reviewPrompt,
        },
      ],
    });

    const reviewText = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';

    // Parse the structured review response
    const reviewResult = parseReviewResponse(reviewText);

    // Save review to database
    await supabase
      .from('projects')
      .update({
        review_score: reviewResult.overallScore,
        review_details: reviewResult,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    return NextResponse.json({
      success: true,
      review: reviewResult,
    });

  } catch (error: any) {
    console.error('Review error:', error);
    return NextResponse.json(
      { error: error.message || 'Review failed' },
      { status: 500 }
    );
  }
}

// ============================================
// BUILD REVIEW PROMPT
// ============================================
function buildReviewPrompt(
  project: any, 
  specs: typeof designSpecs[string],
  html: string
): string {
  return `You are a senior web design quality assurance specialist. Your job is to review a generated website against the client's requirements and provide a detailed quality assessment.

## CLIENT REQUIREMENTS

**Business:** ${project.business_name}
**Industry:** ${project.industry}
**Description:** ${project.description || 'Not provided'}

**Design Direction:** ${project.design_direction || 'Not specified'}
- Required Elements: ${specs.requiredElements.join(', ')}
- Color Profile: ${specs.colorProfile}
- Typography Rules: ${specs.typographyRules.join('; ')}
- Layout Rules: ${specs.layoutRules.join('; ')}
- Forbidden Elements: ${specs.forbiddenElements.join(', ')}

**Brand Voice:** ${project.brand_voice || 'Not specified'}
${project.brand_voice === 'formal' ? '- Copy should be professional, authoritative, precise' : ''}
${project.brand_voice === 'conversational' ? '- Copy should be warm, friendly, approachable' : ''}
${project.brand_voice === 'playful' ? '- Copy should be fun, energetic, light-hearted' : ''}
${project.brand_voice === 'authoritative' ? '- Copy should be expert, confident, knowledge-driven' : ''}
${project.brand_voice === 'luxurious' ? '- Copy should be refined, sophisticated, exclusive' : ''}

**Color Preference:** ${project.color_preference || 'auto'}
${project.existing_colors ? `**Must Use Colors:** ${project.existing_colors}` : ''}

**Hero Preference:** ${project.hero_preference || 'Not specified'}
${project.hero_preference === 'image-led' ? '- Hero should have large background image with text overlay' : ''}
${project.hero_preference === 'text-led' ? '- Hero should emphasize bold typography with minimal imagery' : ''}
${project.hero_preference === 'split' ? '- Hero should have text on one side, image on other' : ''}
${project.hero_preference === 'video' ? '- Hero should have video or animated background' : ''}

**Target Customer:** ${project.target_customer || 'Not specified'}

**Requested Features:** ${project.features?.join(', ') || 'None specified'}

**Primary Services:** ${project.primary_services?.join(', ') || 'None specified'}

**Unique Value Proposition:** ${project.unique_value || 'Not specified'}

**Call to Action:** ${project.call_to_action || 'Not specified'}

**Website Goal:** ${project.website_goal || 'Not specified'}

---

## GENERATED HTML TO REVIEW

\`\`\`html
${html.substring(0, 50000)}
\`\`\`

---

## YOUR TASK

Analyze the generated HTML against ALL the requirements above. Provide a structured review in the following JSON format:

\`\`\`json
{
  "overallScore": <number 0-100>,
  "passesQuality": <boolean - true if score >= 75>,
  
  "categories": {
    "designDirection": {
      "score": <number 0-100>,
      "status": "pass" | "warning" | "fail",
      "findings": [
        {"check": "<what was checked>", "result": "pass" | "fail", "detail": "<specific detail>"}
      ],
      "missingElements": ["<element that should be present but isn't>"],
      "forbiddenElementsFound": ["<element that shouldn't be there but is>"]
    },
    "brandVoice": {
      "score": <number 0-100>,
      "status": "pass" | "warning" | "fail",
      "findings": [
        {"check": "<what was checked>", "result": "pass" | "fail", "detail": "<specific detail>"}
      ],
      "toneIssues": ["<any copy that doesn't match the brand voice>"]
    },
    "colorPalette": {
      "score": <number 0-100>,
      "status": "pass" | "warning" | "fail",
      "colorsFound": ["<hex colors detected>"],
      "matchesDirection": <boolean>,
      "issues": ["<any color problems>"]
    },
    "features": {
      "score": <number 0-100>,
      "status": "pass" | "warning" | "fail",
      "requestedFeatures": ["<feature>"],
      "foundFeatures": ["<feature>"],
      "missingFeatures": ["<feature>"]
    },
    "heroSection": {
      "score": <number 0-100>,
      "status": "pass" | "warning" | "fail",
      "matchesPreference": <boolean>,
      "hasHeadline": <boolean>,
      "hasCTA": <boolean>,
      "ctaText": "<actual CTA text found>",
      "issues": ["<any hero problems>"]
    },
    "contentQuality": {
      "score": <number 0-100>,
      "status": "pass" | "warning" | "fail",
      "businessNameCorrect": <boolean>,
      "servicesIncluded": <boolean>,
      "uniqueValuePresent": <boolean>,
      "issues": ["<any content problems>"]
    },
    "technicalQuality": {
      "score": <number 0-100>,
      "status": "pass" | "warning" | "fail",
      "hasResponsiveClasses": <boolean>,
      "hasSemanticHTML": <boolean>,
      "hasAltTags": <boolean>,
      "issues": ["<any technical problems>"]
    }
  },
  
  "criticalIssues": [
    "<issue that MUST be fixed before delivery>"
  ],
  
  "warnings": [
    "<issue that should be fixed but isn't critical>"
  ],
  
  "suggestions": [
    "<optional improvement that would enhance quality>"
  ],
  
  "summary": "<2-3 sentence summary of the review>"
}
\`\`\`

Be thorough and specific. Reference actual elements from the HTML when possible. A score of 75+ means ready for client review, 50-74 needs revisions, below 50 requires regeneration.`;
}

// ============================================
// PARSE REVIEW RESPONSE
// ============================================
function parseReviewResponse(text: string): any {
  try {
    // Extract JSON from the response
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    
    // Try parsing the whole text as JSON
    return JSON.parse(text);
  } catch (e) {
    // Return a default structure if parsing fails
    console.error('Failed to parse review response:', e);
    return {
      overallScore: 0,
      passesQuality: false,
      error: 'Failed to parse review',
      rawResponse: text.substring(0, 1000),
      categories: {},
      criticalIssues: ['Review parsing failed - manual review required'],
      warnings: [],
      suggestions: [],
      summary: 'Automated review failed. Please review manually.',
    };
  }
}

// ============================================
// GET - Fetch existing review
// ============================================
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json(
      { error: 'Missing projectId' },
      { status: 400 }
    );
  }

  const { data: project, error } = await supabase
    .from('projects')
    .select('review_score, review_details, reviewed_at')
    .eq('id', projectId)
    .single();

  if (error || !project) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    hasReview: !!project.review_details,
    score: project.review_score,
    details: project.review_details,
    reviewedAt: project.reviewed_at,
  });
}
