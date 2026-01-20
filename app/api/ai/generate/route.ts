// app/api/ai/generate/route.ts
// AI Website Generation - Node.js Runtime with proper error handling

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use Node.js runtime (not Edge) for Supabase compatibility
// For longer timeout, you need Vercel Pro plan
export const maxDuration = 60; // seconds (requires Pro plan, otherwise defaults to 10s)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// MASTER SYSTEM PROMPT
// ============================================================================
const MASTER_SYSTEM_PROMPT = `You are an elite web designer. Create stunning $100K quality websites.

## RULES
- Hero headlines: clamp(48px, 8vw, 80px)
- Section padding: 100px-150px vertical
- Maximum 3 colors plus neutrals
- Smooth transitions: 0.3s ease
- Include scroll animations
- Mobile responsive

## REQUIRED CSS
:root with --primary, --secondary, --background, --text, --font-display, --font-body
.reveal class for scroll animations
.gradient-text for gradient headlines
Smooth scroll, selection color

## REQUIRED JS
- Page load animation
- Scroll reveal with IntersectionObserver
- Mobile menu toggle
- Smooth anchor scrolling

## OUTPUT
Return ONLY complete HTML starting with <!DOCTYPE html> and ending with </html>.
NO markdown, NO explanations, NO code blocks.`;

// ============================================================================
// INDUSTRY CONFIGS (Condensed)
// ============================================================================
const INDUSTRIES: Record<string, { colors: string; fonts: string; sections: string }> = {
  'restaurant': {
    colors: 'Burgundy #7f1d1d, Gold #d97706, Cream #fefce8',
    fonts: 'Playfair Display + Lato',
    sections: 'Hero with food photo, About/Story, Menu highlights, Gallery, Reviews, Location/Hours, Footer'
  },
  'local-services': {
    colors: 'Blue #1e40af, Orange #ea580c, White',
    fonts: 'Poppins + Inter',
    sections: 'Hero with trust badges + phone, Services grid, Why Us, Gallery, Reviews, Service Areas, Contact form, Footer'
  },
  'professional': {
    colors: 'Navy #1e3a5f, Gold #b8860b, White',
    fonts: 'Libre Baskerville + Inter',
    sections: 'Hero with value prop, Services, About/Credentials, Team, Results/Cases, Testimonials, Contact, Footer'
  },
  'health-beauty': {
    colors: 'Sage #84a98c, Blush #f4a5a4, Cream #fefcf3',
    fonts: 'Cormorant Garamond + Quicksand',
    sections: 'Hero serene imagery, Services/Treatments, About, Team, Gallery, Testimonials, Booking CTA, Contact, Footer'
  },
  'real-estate': {
    colors: 'Navy #1e3a5f, Gold #b8860b, White',
    fonts: 'Poppins + Inter',
    sections: 'Hero with property, Featured Listings, Agent Profile, Why Us, Testimonials, Areas, Contact, Footer'
  },
  'fitness': {
    colors: 'Black #0a0a0a, Cyan #00d4ff, White',
    fonts: 'Oswald + Inter',
    sections: 'Hero action shot, Programs, Transformations, Trainers, Facility, Pricing, CTA, Contact, Footer'
  },
  'tech-startup': {
    colors: 'Purple #6366f1, Pink #ec4899, Dark #0f0f0f',
    fonts: 'Space Grotesk + Inter',
    sections: 'Hero with product, Logo bar, Features bento, How it works, Pricing, Testimonials, FAQ, CTA, Footer'
  },
  'medical': {
    colors: 'Teal #0d9488, White, Soft blue',
    fonts: 'Inter + Source Sans Pro',
    sections: 'Hero reassuring, Services, Doctors, Why Us, Testimonials, Insurance, Location, Contact, Footer'
  },
  'construction': {
    colors: 'Orange #d97706, Dark gray #1f2937, White',
    fonts: 'Oswald + Inter',
    sections: 'Hero project photo, Services, Gallery, About, Why Us, Testimonials, Contact/Quote, Footer'
  },
  'ecommerce': {
    colors: 'Black, Accent color, White',
    fonts: 'DM Sans + Inter',
    sections: 'Hero product, Trust badges, Featured Products, Categories, Bestsellers, Reviews, Newsletter, Footer'
  },
  'portfolio': {
    colors: 'Black #18181b, Purple #a855f7, White',
    fonts: 'Space Grotesk + Inter',
    sections: 'Hero minimal, Selected Works grid, About, Services, Testimonials, Contact, Footer'
  },
  'education': {
    colors: 'Indigo #4f46e5, Purple, Light purple bg',
    fonts: 'Plus Jakarta Sans + Inter',
    sections: 'Hero with instructor, Who its for, Curriculum, Instructor bio, Success stories, Pricing, FAQ, CTA, Footer'
  }
};

// ============================================================================
// CLAUDE API CALL
// ============================================================================
async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Claude API Error:', response.status, errorText);
    throw new Error(`Claude API error: ${response.status} - ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  
  if (!data.content || !data.content[0] || !data.content[0].text) {
    throw new Error('Invalid response from Claude API');
  }
  
  return data.content[0].text;
}

function cleanHtml(response: string): string {
  let html = response.trim();
  
  // Remove markdown code blocks if present
  html = html.replace(/^```html?\s*\n?/i, '');
  html = html.replace(/\n?```\s*$/i, '');
  
  // Find and extract just the HTML
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) {
    html = html.substring(doctypeIndex);
  }
  
  const htmlEndIndex = html.toLowerCase().lastIndexOf('</html>');
  if (htmlEndIndex > 0) {
    html = html.substring(0, htmlEndIndex + 7);
  }
  
  return html;
}

// ============================================================================
// GENERATE WEBSITE
// ============================================================================
async function generateWebsite(project: any): Promise<string> {
  const industry = (project.industry || 'professional').toLowerCase().replace(/\s+/g, '-');
  const config = INDUSTRIES[industry] || INDUSTRIES['professional'];
  
  const userPrompt = `Create a premium website for:

BUSINESS: ${project.business_name}
INDUSTRY: ${project.industry}
DESCRIPTION: ${project.description || 'A professional business'}
GOAL: ${project.website_goal || 'Generate leads'}
STYLE: ${project.style || 'modern'}

COLORS: ${config.colors}
FONTS: ${config.fonts}
SECTIONS: ${config.sections}

CONTACT:
- Email: ${project.contact_email || 'contact@business.com'}
- Phone: ${project.contact_phone || '(555) 123-4567'}
- Address: ${project.address || 'City, State'}

FEATURES: ${(project.features || []).join(', ') || 'Contact form, Testimonials'}

Create a stunning, complete HTML website. Include all CSS in <style> and all JS in <script>.
Use real Unsplash images (https://images.unsplash.com/photo-ID?w=WIDTH&q=80).
Write compelling copy for this specific business.
Make it mobile responsive.
Include scroll reveal animations.

Output ONLY the HTML code.`;

  const response = await callClaude(MASTER_SYSTEM_PROMPT, userPrompt);
  return cleanHtml(response);
}

async function reviseWebsite(html: string, feedback: string, project: any): Promise<string> {
  const userPrompt = `Revise this website based on feedback.

BUSINESS: ${project.business_name}
FEEDBACK: ${feedback}

CURRENT HTML:
${html.substring(0, 15000)}

Apply the requested changes. Maintain all animations and responsive design.
Output ONLY the complete HTML code.`;

  const response = await callClaude('You are an elite web designer making revisions. Output only complete HTML.', userPrompt);
  return cleanHtml(response);
}

async function quickEdit(html: string, instruction: string): Promise<string> {
  const userPrompt = `Make this edit to the website:

EDIT: ${instruction}

CURRENT HTML:
${html.substring(0, 15000)}

Apply the edit. Keep everything else intact.
Output ONLY the complete HTML code.`;

  const response = await callClaude('Apply the requested edit. Output only complete HTML.', userPrompt);
  return cleanHtml(response);
}

// ============================================================================
// API HANDLER
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, action } = body;

    // Validate
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Get project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*, customers(name, email, phone, business_name)')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      console.error('Project fetch error:', projectError);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Handle actions
    if (action === 'generate') {
      console.log('Generating website for:', project.business_name);
      
      const html = await generateWebsite(project);
      
      // Save to database
      const { error: updateError } = await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          status: 'PREVIEW_READY',
        })
        .eq('id', projectId);

      if (updateError) {
        console.error('Update error:', updateError);
      }

      return NextResponse.json({ 
        success: true, 
        html,
        message: 'Website generated successfully!' 
      });
    }

    if (action === 'revise') {
      const { feedback, currentHtml } = body;
      
      if (!feedback) {
        return NextResponse.json({ error: 'Feedback is required' }, { status: 400 });
      }

      const html = await reviseWebsite(
        currentHtml || project.generated_html, 
        feedback, 
        project
      );
      
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
        message: 'Revisions applied!' 
      });
    }

    if (action === 'quick-edit') {
      const { instruction, currentHtml } = body;
      
      if (!instruction) {
        return NextResponse.json({ error: 'Instruction is required' }, { status: 400 });
      }

      const html = await quickEdit(
        currentHtml || project.generated_html, 
        instruction
      );
      
      await supabase
        .from('projects')
        .update({ generated_html: html })
        .eq('id', projectId);

      return NextResponse.json({ 
        success: true, 
        html,
        message: 'Edit applied!' 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Generation failed', 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
