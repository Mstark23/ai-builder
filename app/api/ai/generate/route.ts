// app/api/ai/generate/route.ts
// API Route for AI Website Generation

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Claude API call
async function callClaude(prompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// Industry configurations
const INDUSTRY_CONFIG: Record<string, {
  sections: string[];
  features: string[];
  colorSchemes: string[];
}> = {
  restaurant: {
    sections: ['Hero', 'About', 'Menu', 'Gallery', 'Reviews', 'Hours & Location', 'Contact'],
    features: ['Online Menu', 'Reservation Form', 'Photo Gallery', 'Google Maps', 'Social Media'],
    colorSchemes: ['Warm reds and browns', 'Elegant black and gold', 'Fresh greens'],
  },
  'local-services': {
    sections: ['Hero', 'Services', 'About', 'Why Choose Us', 'Testimonials', 'Service Areas', 'Contact'],
    features: ['Service Cards', 'Quote Form', 'Before/After Gallery', 'Trust Badges', 'FAQ'],
    colorSchemes: ['Professional blue', 'Trustworthy green', 'Bold orange'],
  },
  ecommerce: {
    sections: ['Hero', 'Featured Products', 'Categories', 'About Brand', 'Reviews', 'Newsletter', 'Footer'],
    features: ['Product Grid', 'Categories', 'Search', 'Newsletter Signup', 'Social Proof'],
    colorSchemes: ['Minimal black/white', 'Luxury gold', 'Vibrant colors'],
  },
  professional: {
    sections: ['Hero', 'Services', 'About', 'Team', 'Case Studies', 'Testimonials', 'Contact'],
    features: ['Service Descriptions', 'Team Profiles', 'Client Logos', 'Contact Form'],
    colorSchemes: ['Corporate navy', 'Modern teal', 'Elegant dark blue'],
  },
  'health-beauty': {
    sections: ['Hero', 'Services', 'About', 'Team', 'Gallery', 'Pricing', 'Booking', 'Contact'],
    features: ['Service Menu', 'Booking Form', 'Gallery', 'Team Profiles', 'Special Offers'],
    colorSchemes: ['Spa green', 'Luxury rose gold', 'Natural earth tones'],
  },
  'real-estate': {
    sections: ['Hero', 'Featured Listings', 'Services', 'About', 'Testimonials', 'Contact'],
    features: ['Property Cards', 'Search Filters', 'Agent Profile', 'Contact Form'],
    colorSchemes: ['Luxury navy/gold', 'Modern black/white', 'Warm browns'],
  },
  portfolio: {
    sections: ['Hero', 'Work/Projects', 'About', 'Services', 'Testimonials', 'Contact'],
    features: ['Project Gallery', 'Filterable Portfolio', 'Contact Form', 'Social Links'],
    colorSchemes: ['Minimal white/black', 'Creative bold', 'Dark mode'],
  },
};

// Style configurations
const STYLE_CONFIG: Record<string, string[]> = {
  modern: ['Clean lines', 'Minimalist', 'Bold typography', 'White space', 'Sans-serif fonts'],
  elegant: ['Sophisticated', 'Luxurious', 'Serif fonts', 'Gold accents', 'Muted colors'],
  bold: ['Eye-catching', 'Vibrant colors', 'Large typography', 'Strong contrasts', 'Dynamic'],
  minimal: ['Simple', 'Clean', 'Maximum white space', 'Limited colors', 'Essential only'],
  playful: ['Fun', 'Rounded shapes', 'Bright colors', 'Illustrations', 'Casual fonts'],
  corporate: ['Professional', 'Structured', 'Blue schemes', 'Formal', 'Grid-based'],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, action } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Fetch project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*, customers(name, email, phone, business_name)')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Handle different actions
    if (action === 'generate') {
      const html = await generateWebsite(project);
      
      // Save generated HTML to project
      await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          status: 'PREVIEW_READY',
        })
        .eq('id', projectId);

      return NextResponse.json({ 
        success: true, 
        html,
        message: 'Website generated successfully'
      });
    }

    if (action === 'revise') {
      const { feedback, currentHtml } = body;
      
      if (!feedback) {
        return NextResponse.json({ error: 'Feedback required for revision' }, { status: 400 });
      }

      const html = await reviseWebsite(currentHtml || project.generated_html, feedback, project);
      
      // Save revised HTML
      await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          revision_count: (project.revision_count || 0) + 1,
        })
        .eq('id', projectId);

      return NextResponse.json({ 
        success: true, 
        html,
        message: 'Revisions applied successfully'
      });
    }

    if (action === 'quick-edit') {
      const { instruction, currentHtml } = body;
      
      if (!instruction) {
        return NextResponse.json({ error: 'Instruction required' }, { status: 400 });
      }

      const html = await quickEdit(currentHtml || project.generated_html, instruction);
      
      // Save edited HTML
      await supabase
        .from('projects')
        .update({ generated_html: html })
        .eq('id', projectId);

      return NextResponse.json({ 
        success: true, 
        html,
        message: 'Edit applied successfully'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: String(error) },
      { status: 500 }
    );
  }
}

// Generate website function
async function generateWebsite(project: any): Promise<string> {
  const industry = (project.industry || 'local-services').toLowerCase().replace(/\s+/g, '-');
  const style = (project.style || 'modern').toLowerCase();
  
  const industryConfig = INDUSTRY_CONFIG[industry] || INDUSTRY_CONFIG['local-services'];
  const styleConfig = STYLE_CONFIG[style] || STYLE_CONFIG['modern'];

  const prompt = `You are an expert web developer and designer. Generate a complete, production-ready, single-page website.

## BUSINESS DETAILS:
- **Business Name:** ${project.business_name}
- **Industry:** ${project.industry}
- **Style:** ${project.style}
- **Description:** ${project.description || 'A professional business website'}
- **Website Goal:** ${project.website_goal || 'Generate leads and showcase services'}
- **Features Requested:** ${(project.features || []).join(', ') || 'Standard features'}
${project.inspirations ? `- **Inspirations:** ${project.inspirations}` : ''}
${project.customers?.email ? `- **Contact Email:** ${project.customers.email}` : ''}
${project.customers?.phone ? `- **Contact Phone:** ${project.customers.phone}` : ''}

## INDUSTRY-SPECIFIC REQUIREMENTS:
- **Sections to Include:** ${industryConfig.sections.join(', ')}
- **Features:** ${industryConfig.features.join(', ')}
- **Color Suggestions:** ${industryConfig.colorSchemes.join(', ')}

## STYLE REQUIREMENTS (${style}):
${styleConfig.join(', ')}

## TECHNICAL REQUIREMENTS:
1. Generate a COMPLETE HTML file with embedded CSS and JavaScript
2. Must be FULLY responsive (mobile-first approach)
3. Use Google Fonts (include link tags)
4. Add smooth scroll behavior
5. Include subtle animations (fade-in, hover effects)
6. Use semantic HTML5 elements
7. Include proper meta tags for SEO
8. Use placeholder images from https://placehold.co (format: https://placehold.co/600x400/HEXCOLOR/HEXCOLOR/png?text=Image+Text)
9. Include a functional contact form (frontend structure)
10. Make it look like a premium $5000+ website
11. NO external CSS frameworks - write custom CSS
12. Use CSS Grid and Flexbox
13. Use CSS custom properties for colors
14. Add a sticky/fixed navigation header
15. Include smooth scrolling to sections
16. Add hover animations on buttons and cards
17. Ensure all sections have good padding and spacing
18. Use a cohesive color palette throughout

## IMPORTANT:
- The website should be COMPLETE and ready to use
- Include ALL sections listed above
- Make sure it looks PROFESSIONAL and MODERN
- The design should match the "${style}" style perfectly

Return ONLY the complete HTML file. Start with <!DOCTYPE html> and end with </html>.
No explanations, no markdown code blocks, just the raw HTML.`;

  const response = await callClaude(prompt);
  
  // Clean up response - remove any markdown if present
  let html = response.trim();
  if (html.startsWith('```html')) {
    html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  }
  if (html.startsWith('```')) {
    html = html.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  
  return html;
}

// Revise website function
async function reviseWebsite(currentHtml: string, feedback: string, project: any): Promise<string> {
  const prompt = `You are an expert web developer. Apply the requested changes to this website.

## CURRENT WEBSITE:
${currentHtml}

## CUSTOMER FEEDBACK / CHANGES REQUESTED:
${feedback}

## BUSINESS CONTEXT:
- Business: ${project.business_name}
- Industry: ${project.industry}
- Style: ${project.style}

## INSTRUCTIONS:
1. Carefully read the customer's feedback
2. Apply ALL requested changes
3. Keep the existing design style and quality
4. Maintain responsiveness
5. If feedback is vague, make reasonable interpretations

Return ONLY the complete updated HTML file. No explanations, no code blocks.
Start with <!DOCTYPE html> and end with </html>.`;

  const response = await callClaude(prompt);
  
  let html = response.trim();
  if (html.startsWith('```html')) {
    html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  }
  if (html.startsWith('```')) {
    html = html.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  
  return html;
}

// Quick edit function
async function quickEdit(currentHtml: string, instruction: string): Promise<string> {
  const prompt = `Apply this specific change to the website: "${instruction}"

Current HTML:
${currentHtml}

Return ONLY the complete updated HTML. No explanations.
Start with <!DOCTYPE html> and end with </html>.`;

  const response = await callClaude(prompt);
  
  let html = response.trim();
  if (html.startsWith('```html')) {
    html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  }
  if (html.startsWith('```')) {
    html = html.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  
  return html;
}