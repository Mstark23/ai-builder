// app/api/ai/generate/route.ts
// Ultra-fast version with streaming-like behavior

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This MUST be set for Pro plan to use 60s timeout
export const maxDuration = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateWithClaude(project: any): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }

  // Very concise prompt for fast generation
  const prompt = `Create HTML for: ${project.business_name} (${project.industry}).
${project.description || ''} Style: ${project.style || 'modern'}.

Requirements:
- Single HTML file with CSS in <style> and JS in <script>
- Hero, About, Services, Testimonials, Contact, Footer
- Mobile responsive
- Scroll animations using IntersectionObserver

Output ONLY the HTML code starting with <!DOCTYPE html>`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096, // Smaller for faster response
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
  
  return html;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
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

      const duration = Date.now() - startTime;
      return NextResponse.json({ 
        success: true, 
        html,
        generatedIn: `${duration}ms`
      });
    }

    if (action === 'quick-edit') {
      const { instruction, currentHtml } = body;
      const htmlToEdit = (currentHtml || project.generated_html || '').substring(0, 8000);
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          messages: [{ 
            role: 'user', 
            content: `Edit: ${instruction}\n\nHTML:\n${htmlToEdit}\n\nReturn complete HTML.` 
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
      const htmlToEdit = (currentHtml || project.generated_html || '').substring(0, 8000);
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          messages: [{ 
            role: 'user', 
            content: `Revise based on: ${feedback}\n\nHTML:\n${htmlToEdit}\n\nReturn complete HTML.` 
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
