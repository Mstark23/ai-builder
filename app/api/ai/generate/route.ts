// app/api/ai/generate/route.ts
// Full website generation - now with proper token limit

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 300;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateWithClaude(project: any): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }

  const prompt = `Create a stunning, complete website for "${project.business_name}".

BUSINESS INFO:
- Industry: ${project.industry || 'business'}
- Style: ${project.style || 'modern'}
- Description: ${project.description || 'Professional business'}
- Goal: ${project.website_goal || 'Generate leads and sales'}

REQUIRED SECTIONS:
1. Navigation - Logo + links + CTA button
2. Hero - Big headline, subtitle, CTA buttons, maybe an image
3. About - Company story and values
4. Services/Products - 3-4 items with icons/images
5. Testimonials - 2-3 customer reviews with names
6. Contact - Form with name, email, message fields
7. Footer - Links, social icons, copyright

DESIGN REQUIREMENTS:
- Use a cohesive color palette that fits ${project.industry || 'the business'}
- Modern typography with Google Fonts
- Mobile responsive (use media queries)
- Smooth scroll behavior
- Hover effects on buttons and cards
- Scroll reveal animations using IntersectionObserver

CSS MUST INCLUDE:
- CSS variables for colors (:root { --primary: #xxx; })
- Flexbox/Grid layouts
- Smooth transitions
- .reveal class for scroll animations

JS MUST INCLUDE:
- Scroll reveal with IntersectionObserver
- Mobile menu toggle
- Smooth anchor scrolling
- Form submission handling (preventDefault + success message)

OUTPUT: Complete HTML file with all CSS in <style> and all JS in <script>.
Start with <!DOCTYPE html> and end with </html>.
Do NOT include any explanations - ONLY the HTML code.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 12000, // Increased for complete websites
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API: ${response.status} - ${error.substring(0, 100)}`);
  }

  const data = await response.json();
  let html = data.content[0].text.trim();
  
  // Clean markdown if present
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  
  // Ensure it starts with DOCTYPE
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) {
    html = html.substring(doctypeIndex);
  }
  
  return html;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, action } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const { data: project, error: dbError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (dbError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (action === 'generate') {
      const html = await generateWithClaude(project);
      
      await supabase
        .from('projects')
        .update({ generated_html: html, status: 'PREVIEW_READY' })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html });
    }

    if (action === 'quick-edit') {
      const { instruction, currentHtml } = body;
      const htmlToEdit = (currentHtml || project.generated_html || '').substring(0, 15000);
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 12000,
          messages: [{ 
            role: 'user', 
            content: `Edit this website: ${instruction}

Current HTML:
${htmlToEdit}

Apply the edit and return the COMPLETE HTML code. Start with <!DOCTYPE html>.` 
          }],
        }),
      });

      if (!response.ok) throw new Error('Edit failed');
      
      const data = await response.json();
      let html = data.content[0].text.trim();
      html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');

      await supabase
        .from('projects')
        .update({ generated_html: html })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html });
    }

    if (action === 'revise') {
      const { feedback, currentHtml } = body;
      const htmlToEdit = (currentHtml || project.generated_html || '').substring(0, 15000);
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 12000,
          messages: [{ 
            role: 'user', 
            content: `Revise this website based on feedback: ${feedback}

Current HTML:
${htmlToEdit}

Apply all changes and return the COMPLETE HTML code. Start with <!DOCTYPE html>.` 
          }],
        }),
      });

      if (!response.ok) throw new Error('Revision failed');
      
      const data = await response.json();
      let html = data.content[0].text.trim();
      html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');

      await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          revision_count: (project.revision_count || 0) + 1 
        })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
