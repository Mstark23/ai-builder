// /app/api/ai/generate/route.ts
// Main API handler for AI website generation
// Imports all modules and assembles prompts dynamically

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

// Import our modular system
import { getMasterPrompt, getFullCSS, getFullJS, REQUIRED_CSS, REQUIRED_JS, ANIMATION_KEYFRAMES } from '@/lib/ai/master-prompt';
import { getIndustryTemplate, generateIndustryPrompt, detectIndustry, getIndustryCSSVariables } from '@/lib/ai/industries';
import { getComponentReference } from '@/lib/ai/components';
import { getEffectsReference, getRecommendedEffects } from '@/lib/ai/effects';
import { getIconsReference, getRecommendedIcons } from '@/lib/ai/icons';
import { getAnimationsReference, getRecommendedAnimations } from '@/lib/ai/animations';

// Vercel Pro plan: 300 second timeout
export const maxDuration = 300;

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// ============================================================================
// STYLE MODIFIERS
// ============================================================================

const STYLE_MODIFIERS: Record<string, string> = {
  modern: `
STYLE: MODERN
- Clean lines with subtle shadows
- Gradient accents on buttons and highlights
- Card-based layouts with rounded corners (16-24px)
- Ample whitespace
- Sans-serif fonts (Inter, DM Sans, Outfit)
- Subtle animations on scroll
- Light backgrounds with dark text
`,
  elegant: `
STYLE: ELEGANT
- Refined serif typography for headlines (Playfair Display, Cormorant)
- Sophisticated color palette (navy, gold, cream)
- Generous letter-spacing on headings
- Thin borders and delicate dividers
- Subtle gold or metallic accents
- Smooth, understated animations
- Premium feel with attention to typographic details
`,
  bold: `
STYLE: BOLD
- Oversized typography (headlines 80-120px)
- High contrast colors (black/white with vibrant accent)
- Strong geometric shapes
- Full-bleed images
- Dramatic hover effects
- Striking section transitions
- Unapologetic, confident design
`,
  minimal: `
STYLE: MINIMAL
- Maximum whitespace (150px+ section padding)
- Limited color palette (2 colors max)
- Essential elements only - no decoration
- Typography as the hero element
- Subtle micro-interactions
- Clean, borderless cards
- Content-first approach
`,
  playful: `
STYLE: PLAYFUL
- Rounded corners everywhere (20px+)
- Bright, cheerful colors
- Bouncy animations and hover effects
- Friendly, casual copy tone
- Illustrations or playful icons
- Asymmetric layouts
- Fun micro-interactions
`,
  dark: `
STYLE: DARK MODE
- Dark background (#09090b or #0a0a0a)
- Light text (#fafafa)
- Glowing accent colors
- Subtle gradients in backgrounds
- Glass morphism effects
- Neon-style hover states
- Grid patterns or noise textures
`,
  corporate: `
STYLE: CORPORATE
- Professional blue color scheme
- Clean, structured grid layouts
- Conservative typography (Inter, Source Sans)
- Formal imagery (team photos, offices)
- Trust badges and certifications prominent
- Clear hierarchy and navigation
- Accessible and ADA-compliant
`,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function cleanHTML(content: string): string {
  // Remove markdown code blocks
  let cleaned = content.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  
  // Find the actual HTML document
  const doctypeMatch = cleaned.match(/<!DOCTYPE html>/i);
  const htmlEndMatch = cleaned.match(/<\/html>/i);
  
  if (doctypeMatch && htmlEndMatch) {
    const startIndex = doctypeMatch.index!;
    const endIndex = htmlEndMatch.index! + 7;
    cleaned = cleaned.substring(startIndex, endIndex);
  }
  
  return cleaned.trim();
}

function buildSystemPrompt(industry: string, style: string): string {
  // Get industry template
  const industryTemplate = getIndustryTemplate(industry);
  const industryPrompt = industryTemplate 
    ? generateIndustryPrompt(industryTemplate) 
    : '';
  
  // Get style modifier
  const styleModifier = STYLE_MODIFIERS[style] || STYLE_MODIFIERS.modern;
  
  // Get recommended effects, icons, animations for this industry
  const recommendedEffects = getRecommendedEffects(industry);
  const recommendedIcons = getRecommendedIcons(industry);
  const recommendedAnimations = getRecommendedAnimations(industry);
  
  // Build the complete system prompt
  return `${getMasterPrompt()}

${industryPrompt}

${styleModifier}

## RECOMMENDED FOR THIS PROJECT
- Effects to use: ${recommendedEffects.join(', ')}
- Icons to use: ${recommendedIcons.join(', ')}
- Animations to use: ${recommendedAnimations.join(', ')}

${getComponentReference()}

${getEffectsReference()}

${getIconsReference()}

${getAnimationsReference()}

## CRITICAL REQUIREMENTS

1. Return ONLY the complete HTML file - no explanations, no markdown
2. Start with <!DOCTYPE html> and end with </html>
3. ALL CSS must be in a single <style> tag in <head>
4. ALL JavaScript must be in a single <script> tag before </body>
5. Must be 100% mobile responsive
6. Must include all sections specified for the industry
7. Use the EXACT colors from the industry template
8. Use the EXACT fonts from the industry template (include Google Fonts import)
9. Use the provided Unsplash image URLs
10. Include scroll reveal animations (.reveal class with IntersectionObserver)
11. Include smooth scrolling and navbar scroll effect
12. Forms should have visual feedback on submission
13. All buttons must have hover states
14. Include a floating back-to-top button
15. The website must look like it cost $50,000-$100,000 to build

## CSS VARIABLES TO INCLUDE
\`\`\`css
:root {
${industryTemplate ? getIndustryCSSVariables(industryTemplate) : '  --primary: #6366f1;'}
}
\`\`\`
`;
}

function buildUserPrompt(project: any): string {
  const features = project.features?.join(', ') || 'general services';
  
  return `Create a complete, premium, production-ready website for:

## BUSINESS DETAILS
- **Name:** ${project.business_name}
- **Industry:** ${project.industry}
- **Description:** ${project.description || 'A premium business in its industry'}
- **Goal:** ${project.website_goal || 'Generate leads and showcase services'}
- **Target Customer:** ${project.target_customer || 'Quality-focused customers'}
- **Features/Services:** ${features}

## CONTACT INFORMATION
- **Email:** ${project.contact_email || 'contact@example.com'}
- **Phone:** ${project.contact_phone || '(555) 123-4567'}
- **Address:** ${project.address || '123 Main Street, City, State'}

## REQUIREMENTS
1. Create a stunning hero section that immediately captures attention
2. Use the industry-specific color palette and fonts
3. Include ALL sections appropriate for this industry
4. Write compelling, benefit-focused copy throughout
5. Include social proof (testimonials, stats, trust badges)
6. Make CTAs prominent and action-oriented
7. Ensure perfect mobile responsiveness
8. Add smooth scroll reveal animations
9. Include a functional contact form
10. Add a professional footer with all necessary links

Generate the complete HTML file now.`;
}

function buildQuickEditPrompt(project: any, currentHtml: string, editRequest: string): string {
  return `You are editing an existing website. Here is the current HTML:

\`\`\`html
${currentHtml}
\`\`\`

## EDIT REQUEST
${editRequest}

## INSTRUCTIONS
1. Make ONLY the requested changes
2. Keep all existing styles, scripts, and structure intact
3. Return the COMPLETE modified HTML file
4. Do not add explanations - just return the HTML

Return the complete modified HTML file now.`;
}

function buildRevisionPrompt(project: any, currentHtml: string, feedback: string): string {
  return `You are revising a website based on client feedback. Here is the current HTML:

\`\`\`html
${currentHtml}
\`\`\`

## CLIENT FEEDBACK
${feedback}

## BUSINESS CONTEXT
- **Name:** ${project.business_name}
- **Industry:** ${project.industry}
- **Goal:** ${project.website_goal || 'Generate leads'}

## INSTRUCTIONS
1. Address ALL points in the client feedback
2. Maintain the overall design quality and consistency
3. Keep the same color scheme and fonts unless specifically asked to change
4. Return the COMPLETE revised HTML file
5. Ensure the revision still looks premium and professional

Return the complete revised HTML file now.`;
}

// ============================================================================
// MAIN API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, action = 'generate', editRequest, feedback } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Fetch project from database
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Detect industry if not set or generic
    let industry = project.industry?.toLowerCase().replace(/\s+/g, '-') || 'professional';
    if (industry === 'other' || industry === 'general') {
      industry = detectIndustry(project.description || project.business_name || '');
    }
    
    // Get style
    const style = project.style?.toLowerCase() || 'modern';

    let messages: any[] = [];
    let systemPrompt = '';

    // Build prompts based on action
    switch (action) {
      case 'generate':
        systemPrompt = buildSystemPrompt(industry, style);
        messages = [
          { role: 'user', content: buildUserPrompt({ ...project, industry }) }
        ];
        break;

      case 'quick-edit':
        if (!project.generated_html) {
          return NextResponse.json(
            { error: 'No existing website to edit' },
            { status: 400 }
          );
        }
        systemPrompt = getMasterPrompt();
        messages = [
          { role: 'user', content: buildQuickEditPrompt(project, project.generated_html, editRequest || 'Make general improvements') }
        ];
        break;

      case 'revise':
        if (!project.generated_html) {
          return NextResponse.json(
            { error: 'No existing website to revise' },
            { status: 400 }
          );
        }
        systemPrompt = buildSystemPrompt(industry, style);
        messages = [
          { role: 'user', content: buildRevisionPrompt(project, project.generated_html, feedback || 'Make it better') }
        ];
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: generate, quick-edit, or revise' },
          { status: 400 }
        );
    }

    // Update project status
    await supabase
      .from('projects')
      .update({ status: 'generating' })
      .eq('id', projectId);

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: systemPrompt,
      messages: messages,
    });

    // Extract the generated HTML
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const generatedHtml = cleanHTML(content.text);

    // Validate the HTML
    if (!generatedHtml.includes('<!DOCTYPE html>') || !generatedHtml.includes('</html>')) {
      throw new Error('Generated content is not valid HTML');
    }

    // Update project with generated HTML
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        generated_html: generatedHtml,
        status: 'completed',
        revision_count: (project.revision_count || 0) + (action === 'revise' ? 1 : 0),
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      html: generatedHtml,
      action: action,
      industry: industry,
      style: style,
      tokensUsed: response.usage?.output_tokens || 0,
    });

  } catch (error: any) {
    console.error('Generation error:', error);

    // Try to update project status to failed
    try {
      const body = await request.clone().json();
      if (body.projectId) {
        await supabase
          .from('projects')
          .update({ status: 'failed' })
          .eq('id', body.projectId);
      }
    } catch (e) {
      // Ignore update errors
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate website',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET HANDLER - Health check and info
// ============================================================================

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    service: 'AI Website Generator',
    version: '2.0.0',
    features: [
      '12 industry templates',
      '7 style modifiers',
      '100+ icons',
      '40+ animations',
      'Glassmorphism & gradients',
      'Mobile responsive',
      'Scroll animations',
      'Premium design system',
    ],
    endpoints: {
      POST: {
        description: 'Generate or edit website',
        body: {
          projectId: 'string (required)',
          action: 'generate | quick-edit | revise',
          editRequest: 'string (for quick-edit)',
          feedback: 'string (for revise)',
        },
      },
    },
    industries: [
      'restaurant',
      'local-services',
      'professional',
      'health-beauty',
      'real-estate',
      'fitness',
      'tech-startup',
      'medical',
      'construction',
      'ecommerce',
      'portfolio',
      'education',
    ],
    styles: [
      'modern',
      'elegant',
      'bold',
      'minimal',
      'playful',
      'dark',
      'corporate',
    ],
  });
}
