// app/api/regenerate-section/route.ts
// Regenerate individual sections without rebuilding entire site
// V2 - Improved section detection and regeneration

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 120;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =============================================================================
// SECTION DEFINITIONS
// =============================================================================

const SECTIONS = {
  nav: {
    name: 'Navigation',
    selector: /<nav[\s\S]*?<\/nav>/i,
    description: 'Top navigation bar with logo and menu links',
  },
  hero: {
    name: 'Hero Section',
    selector: /<section[^>]*(?:id=["']hero["']|class=["'][^"']*hero[^"']*["'])[\s\S]*?<\/section>/i,
    fallbackSelector: /<section[^>]*>[\s\S]*?<\/section>/i, // First section after nav
    description: 'Main hero banner with headline, subheadline, and CTA',
  },
  services: {
    name: 'Services Section',
    selector: /<section[^>]*(?:id=["'](?:services|features)["']|class=["'][^"']*(?:services|features)[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Services or features grid with cards',
  },
  about: {
    name: 'About Section',
    selector: /<section[^>]*(?:id=["']about["']|class=["'][^"']*about[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'About us section with company story',
  },
  testimonials: {
    name: 'Testimonials Section',
    selector: /<section[^>]*(?:id=["']testimonials["']|class=["'][^"']*testimonial[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Customer testimonials and reviews',
  },
  stats: {
    name: 'Stats Section',
    selector: /<section[^>]*(?:id=["']stats["']|class=["'][^"']*stats[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Statistics and numbers section',
  },
  cta: {
    name: 'CTA Section',
    selector: /<section[^>]*(?:id=["']cta["']|class=["'][^"']*cta[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Call-to-action banner section',
  },
  contact: {
    name: 'Contact Section',
    selector: /<section[^>]*(?:id=["']contact["']|class=["'][^"']*contact[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Contact form and information',
  },
  footer: {
    name: 'Footer',
    selector: /<footer[\s\S]*?<\/footer>/i,
    description: 'Page footer with links and copyright',
  },
};

type SectionKey = keyof typeof SECTIONS;

// =============================================================================
// DESIGN DIRECTIONS (same as generate route)
// =============================================================================

const DESIGN_DIRECTIONS: Record<string, {
  name: string;
  fonts: { display: string; body: string };
  colors: Record<string, string>;
  characteristics: string;
}> = {
  luxury_minimal: {
    name: "Luxury Minimal",
    fonts: { display: "Cormorant Garamond", body: "Crimson Pro" },
    colors: {
      primary: "#1a1a1a", secondary: "#c9a227", bgPrimary: "#faf9f7",
      bgSecondary: "#f5f3ef", textPrimary: "#1a1a1a", textSecondary: "#5c5c5c"
    },
    characteristics: "Lots of whitespace, subtle animations, serif typography, muted earth tones"
  },
  bold_modern: {
    name: "Bold Modern",
    fonts: { display: "Space Grotesk", body: "DM Sans" },
    colors: {
      primary: "#6366f1", secondary: "#8b5cf6", bgPrimary: "#ffffff",
      bgSecondary: "#f8fafc", textPrimary: "#0f172a", textSecondary: "#475569"
    },
    characteristics: "Strong geometric typography, gradient accents, card-based layouts"
  },
  warm_organic: {
    name: "Warm Organic",
    fonts: { display: "Fraunces", body: "Source Serif Pro" },
    colors: {
      primary: "#2d5016", secondary: "#b45309", bgPrimary: "#fffbeb",
      bgSecondary: "#fef3c7", textPrimary: "#1c1917", textSecondary: "#57534e"
    },
    characteristics: "Rounded corners, warm earth palette, friendly approachable vibe"
  },
  dark_premium: {
    name: "Dark Premium",
    fonts: { display: "Bebas Neue", body: "Barlow" },
    colors: {
      primary: "#ffffff", secondary: "#a855f7", bgPrimary: "#09090b",
      bgSecondary: "#18181b", textPrimary: "#fafafa", textSecondary: "#a1a1aa"
    },
    characteristics: "Dark theme, glowing effects, gradient borders, glassmorphism"
  },
  editorial_classic: {
    name: "Editorial Classic",
    fonts: { display: "Playfair Display", body: "Source Sans Pro" },
    colors: {
      primary: "#1e3a5f", secondary: "#b8860b", bgPrimary: "#ffffff",
      bgSecondary: "#f8f6f3", textPrimary: "#1e293b", textSecondary: "#64748b"
    },
    characteristics: "Classic typography, structured grid, professional trustworthy feel"
  },
  vibrant_energy: {
    name: "Vibrant Energy",
    fonts: { display: "Syne", body: "Outfit" },
    colors: {
      primary: "#7c3aed", secondary: "#ec4899", bgPrimary: "#fafafa",
      bgSecondary: "#f3e8ff", textPrimary: "#18181b", textSecondary: "#52525b"
    },
    characteristics: "Bold gradients, playful animations, colorful accents"
  }
};

// =============================================================================
// BRAND VOICE CONFIG
// =============================================================================

const BRAND_VOICE_CONFIG: Record<string, { tone: string; style: string }> = {
  formal: { tone: "Professional, authoritative", style: "Third person, precise language" },
  conversational: { tone: "Warm, friendly", style: "Second person, contractions allowed" },
  playful: { tone: "Fun, energetic", style: "Casual, exclamation points sparingly" },
  authoritative: { tone: "Expert, confident", style: "Data-backed, definitive statements" },
  luxurious: { tone: "Refined, sophisticated", style: "Elegant vocabulary, sensory language" },
};

// =============================================================================
// HELPER: Extract existing section
// =============================================================================

function extractSection(html: string, sectionKey: SectionKey): string | null {
  const section = SECTIONS[sectionKey];
  const match = html.match(section.selector);
  return match ? match[0] : null;
}

// =============================================================================
// HELPER: Replace section in HTML
// =============================================================================

function replaceSection(html: string, sectionKey: SectionKey, newSection: string): string {
  const section = SECTIONS[sectionKey];
  
  // Try main selector first
  if (section.selector.test(html)) {
    return html.replace(section.selector, newSection);
  }
  
  // If no match and has fallback, try that
  if ('fallbackSelector' in section && section.fallbackSelector) {
    const fallback = section.fallbackSelector as RegExp;
    if (fallback.test(html)) {
      return html.replace(fallback, newSection);
    }
  }
  
  return html;
}

// =============================================================================
// HELPER: Extract CSS variables from existing HTML
// =============================================================================

function extractCSSVariables(html: string): string {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!styleMatch) return '';
  
  const rootMatch = styleMatch[1].match(/:root\s*{([^}]*)}/i);
  return rootMatch ? rootMatch[1] : '';
}

// =============================================================================
// SECTION-SPECIFIC PROMPTS
// =============================================================================

function getSectionPrompt(
  sectionKey: SectionKey,
  project: any,
  direction: typeof DESIGN_DIRECTIONS[string],
  feedback: string,
  existingSection: string | null,
  cssVariables: string
): string {
  const section = SECTIONS[sectionKey];
  const brandVoice = BRAND_VOICE_CONFIG[project.brand_voice] || BRAND_VOICE_CONFIG.conversational;
  
  const baseContext = `
## BUSINESS CONTEXT
Name: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description || ''}
Target Customer: ${project.target_customer || ''}
Unique Value: ${project.unique_value || ''}
Primary Services: ${project.primary_services?.join(', ') || ''}
CTA Text: ${project.call_to_action || 'Get Started'}

## DESIGN DIRECTION: ${direction.name}
${direction.characteristics}
Fonts: ${direction.fonts.display} (headlines), ${direction.fonts.body} (body)

## BRAND VOICE: ${brandVoice.tone}
Style: ${brandVoice.style}

## CSS VARIABLES (use these exactly)
${cssVariables}

## CONTACT INFO
Email: ${project.contact_email || 'hello@example.com'}
Phone: ${project.contact_phone || '(555) 123-4567'}
Address: ${project.address || ''}
`;

  const feedbackSection = feedback ? `
## CUSTOMER FEEDBACK
"${feedback}"

Address this feedback directly in the new design.
` : '';

  const existingContext = existingSection ? `
## EXISTING SECTION (for reference)
\`\`\`html
${existingSection.substring(0, 3000)}
\`\`\`

Improve upon this while maintaining consistency with the rest of the page.
` : '';

  // Section-specific instructions
  const sectionInstructions: Record<SectionKey, string> = {
    nav: `
Generate a fixed navigation bar with:
- Logo/brand name on left
- Navigation links (Home, About, Services, Contact)
- CTA button on right
- Blur effect on scroll (add .scrolled class via JS)
- Mobile hamburger menu
`,
    hero: `
Generate a hero section with:
- Trust badge (e.g., "Trusted by 500+ clients")
- Powerful headline (6-8 words, emotional)
- Subheadline (clarify the benefit)
- Primary CTA button: "${project.call_to_action || 'Get Started'}"
- Secondary CTA (lower commitment)
- 3-4 social proof stats
- Hero image or visual element
- Layout: ${project.hero_preference || 'split_left'}
`,
    services: `
Generate a services/features section with:
- Section badge
- Compelling headline
- 3-6 service cards with:
  - Icon (use SVG or emoji)
  - Service name
  - 2-sentence benefit-focused description
- Hover effects on cards
${project.primary_services?.length > 0 ? `
Feature these services: ${project.primary_services.join(', ')}` : ''}
`,
    about: `
Generate an about section with:
- Section badge "About Us"
- Headline about company mission/story
- 2 paragraphs of compelling copy
- Image on one side, text on other
- Optional: key differentiators or values
`,
    testimonials: `
Generate a testimonials section with:
- Section badge
- Headline
- 3 testimonial cards with:
  - Quote (specific, with results if possible)
  - Customer name
  - Role/Company
  - Avatar image (use https://i.pravatar.cc/100?img=X)
  - Star rating
`,
    stats: `
Generate a stats/numbers section with:
- 4 key statistics
- Large animated numbers (use data-count attribute)
- Labels below numbers
- Examples: clients served, years experience, satisfaction rate, projects completed
`,
    cta: `
Generate a CTA section with:
- Gradient or colored background
- Compelling headline (overcome objections)
- Subheadline
- Primary CTA button
- Trust note (guarantee, no commitment, etc.)
`,
    contact: `
Generate a contact section with:
- Section headline
- Contact form (name, email, phone, message)
- Contact information sidebar:
  - Email: ${project.contact_email || 'hello@example.com'}
  - Phone: ${project.contact_phone || '(555) 123-4567'}
  - Address: ${project.address || ''}
- Optional: map placeholder or social links
`,
    footer: `
Generate a footer with:
- Logo/brand name
- Quick links (Home, About, Services, Contact)
- Contact information
- Social media icons
- Copyright notice with current year
- Optional: newsletter signup
`,
  };

  return `You are an elite frontend developer. Generate ONLY the HTML for the ${section.name}.

${baseContext}
${feedbackSection}
${existingContext}

## SECTION REQUIREMENTS
${sectionInstructions[sectionKey]}

## RULES
1. Output ONLY the section HTML (starting with <section>, <nav>, or <footer>)
2. Use the CSS variables provided (var(--primary), var(--bg-primary), etc.)
3. Use the correct font families: var(--font-display), var(--font-body)
4. Include class="reveal" for scroll animation
5. Make it mobile responsive
6. NO <style> tags - use inline styles only if needed for unique elements
7. NO <script> tags
8. NO explanations, NO markdown code blocks

Output the HTML now:`;
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, section, feedback } = body;

    // Validate inputs
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    if (!section || !SECTIONS[section as SectionKey]) {
      return NextResponse.json({ 
        error: 'Invalid section', 
        validSections: Object.keys(SECTIONS) 
      }, { status: 400 });
    }

    const sectionKey = section as SectionKey;

    // Fetch project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.generated_html) {
      return NextResponse.json({ error: 'No generated HTML to modify' }, { status: 400 });
    }

    // Get design direction
    const directionKey = project.design_direction || 'bold_modern';
    const direction = DESIGN_DIRECTIONS[directionKey] || DESIGN_DIRECTIONS.bold_modern;

    // Extract existing section and CSS
    const existingSection = extractSection(project.generated_html, sectionKey);
    const cssVariables = extractCSSVariables(project.generated_html);

    // Build prompt
    const prompt = getSectionPrompt(
      sectionKey,
      project,
      direction,
      feedback || '',
      existingSection,
      cssVariables
    );

    console.log(`🔄 Regenerating ${sectionKey} for project ${projectId}...`);

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Clean up response
    let newSection = content.text.trim();
    newSection = newSection.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');

    // Validate we got HTML
    const validTags = ['<section', '<nav', '<footer', '<header'];
    const hasValidTag = validTags.some(tag => newSection.toLowerCase().startsWith(tag));
    
    if (!hasValidTag) {
      // Try to extract section from response
      const sectionMatch = newSection.match(/<(?:section|nav|footer|header)[\s\S]*<\/(?:section|nav|footer|header)>/i);
      if (sectionMatch) {
        newSection = sectionMatch[0];
      } else {
        throw new Error('Invalid section HTML generated');
      }
    }

    // Replace section in full HTML
    const updatedHtml = replaceSection(project.generated_html, sectionKey, newSection);

    // Validate replacement worked
    if (updatedHtml === project.generated_html && existingSection) {
      console.warn('Section replacement may have failed - HTML unchanged');
    }

    // Save updated HTML
    const { error: updateError } = await supabase
      .from('projects')
      .update({ 
        generated_html: updatedHtml,
        status: 'PREVIEW_READY'
      })
      .eq('id', projectId);

    if (updateError) {
      throw updateError;
    }

    console.log(`✅ Section ${sectionKey} regenerated successfully`);

    return NextResponse.json({
      success: true,
      section: sectionKey,
      message: `${SECTIONS[sectionKey].name} regenerated successfully`,
      newSection: newSection.substring(0, 500) + '...', // Preview
    });

  } catch (error: any) {
    console.error('❌ Section regeneration error:', error);
    return NextResponse.json(
      { error: 'Regeneration failed', details: error.message },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET: List available sections
// =============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (projectId) {
    // Return detected sections for a specific project
    const { data: project } = await supabase
      .from('projects')
      .select('generated_html')
      .eq('id', projectId)
      .single();

    if (!project?.generated_html) {
      return NextResponse.json({ error: 'Project not found or no HTML' }, { status: 404 });
    }

    const detectedSections: Record<string, boolean> = {};
    for (const [key, section] of Object.entries(SECTIONS)) {
      detectedSections[key] = section.selector.test(project.generated_html);
    }

    return NextResponse.json({
      sections: detectedSections,
      available: Object.keys(SECTIONS),
    });
  }

  // Return all available sections
  return NextResponse.json({
    sections: Object.entries(SECTIONS).map(([key, value]) => ({
      id: key,
      name: value.name,
      description: value.description,
    })),
  });
}
