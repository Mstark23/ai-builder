// /app/api/generate/route.ts
// Simplified API handler - no external dependencies

import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, businessName, industry, description, style } = body;

    if (!businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    // Build the prompt
    const systemPrompt = `You are an elite web designer. Create a complete, production-ready HTML website.

## RULES
1. Return ONLY the complete HTML file
2. Start with <!DOCTYPE html> and end with </html>
3. ALL CSS in a single <style> tag in <head>
4. ALL JavaScript in a single <script> tag before </body>
5. Must be fully mobile responsive
6. Use modern design: gradients, shadows, animations
7. Include: Nav, Hero, Services, About, Testimonials, Contact, Footer

## DESIGN STYLE
- Clean, modern aesthetic
- Primary color: #6366f1 (indigo)
- Use Google Fonts (Inter, Outfit)
- Smooth scroll animations
- Professional typography`;

    const userPrompt = `Create a stunning website for:

Business: ${businessName}
Industry: ${industry || 'Professional Services'}
Description: ${description || 'A premium business'}
Style: ${style || 'modern'}

Include these sections:
1. Navigation with logo and menu
2. Hero section with headline, description, and CTA
3. Services/Features section (4-6 items)
4. About section with image
5. Testimonials (3 reviews)
6. Contact form
7. Footer with links

Make it look like a $50,000 website. Generate the complete HTML now.`;

    // Call your AI provider here
    // For now, return a placeholder response
    
    return NextResponse.json({
      success: true,
      message: 'API endpoint working. Add your AI provider (OpenAI/Anthropic) to generate websites.',
      prompt: {
        system: systemPrompt,
        user: userPrompt
      }
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate website', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'AI Website Generator',
    version: '1.0.0',
    usage: {
      method: 'POST',
      body: {
        businessName: 'string (required)',
        industry: 'string (optional)',
        description: 'string (optional)',
        style: 'modern | elegant | bold | minimal (optional)'
      }
    }
  });
}
