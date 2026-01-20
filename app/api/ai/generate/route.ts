// app/api/ai/generate/route.ts
// Minimal fast version - generates in under 30 seconds

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Minimal prompt for faster generation
const SYSTEM_PROMPT = `Create a modern single-page website. Output ONLY valid HTML code.
Include: CSS in <style>, JS in <script>, mobile responsive design, scroll animations.
Start with <!DOCTYPE html>, end with </html>. NO explanations.`;

async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }

  console.log('Calling Claude API...');
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }],
      system: SYSTEM_PROMPT,
    }),
  });

  console.log('Claude response status:', response.status);

  if (!response.ok) {
    const err = await response.text();
    console.error('Claude error:', err);
    throw new Error(`API Error ${response.status}: ${err.substring(0, 100)}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

function cleanHtml(text: string): string {
  let html = text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  
  const start = html.indexOf('<!DOCTYPE');
  if (start > 0) html = html.substring(start);
  
  const end = html.lastIndexOf('</html>');
  if (end > 0) html = html.substring(0, end + 7);
  
  return html;
}

export async function POST(request: NextRequest) {
  console.log('=== Generate API Called ===');
  
  try {
    const body = await request.json();
    const { projectId, action } = body;

    console.log('Action:', action, 'ProjectId:', projectId);

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Check API key first
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('No ANTHROPIC_API_KEY!');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Get project
    const { data: project, error: dbError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (dbError || !project) {
      console.error('DB error:', dbError);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    console.log('Project:', project.business_name);

    if (action === 'generate') {
      const prompt = `Create a website for "${project.business_name}".
Industry: ${project.industry || 'business'}
Style: ${project.style || 'modern'}
Description: ${project.description || 'Professional services'}
Goal: ${project.website_goal || 'Generate leads'}

Include these sections:
1. Hero with headline and CTA button
2. About section
3. Services/Features (3-4 items)
4. Testimonials (2-3 reviews)
5. Contact section with form
6. Footer

Use colors that match the ${project.industry || 'business'} industry.
Make it visually stunning with modern design.
Include smooth scroll animations.`;

      console.log('Generating website...');
      const response = await callClaude(prompt);
      const html = cleanHtml(response);
      
      console.log('HTML generated, length:', html.length);

      // Save to DB
      await supabase
        .from('projects')
        .update({ generated_html: html, status: 'PREVIEW_READY' })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html });
    }

    if (action === 'quick-edit') {
      const { instruction, currentHtml } = body;
      
      const prompt = `Edit this website: ${instruction}

Current HTML (first 10000 chars):
${(currentHtml || project.generated_html || '').substring(0, 10000)}

Apply the edit and return the complete HTML.`;

      const response = await callClaude(prompt);
      const html = cleanHtml(response);

      await supabase
        .from('projects')
        .update({ generated_html: html })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html });
    }

    if (action === 'revise') {
      const { feedback, currentHtml } = body;
      
      const prompt = `Revise this website based on feedback: ${feedback}

Current HTML (first 10000 chars):
${(currentHtml || project.generated_html || '').substring(0, 10000)}

Apply all changes and return complete HTML.`;

      const response = await callClaude(prompt);
      const html = cleanHtml(response);

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
    console.error('=== ERROR ===', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
