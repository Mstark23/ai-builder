import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 300;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `You are an elite creative director who has won every Awwwards Site of the Day. You create websites that companies pay $100,000+ for.

## THE 7 LAWS OF ELITE WEBSITES

**LAW 1: TYPOGRAPHY IS POWER**
- Hero headlines: clamp(48px, 7vw, 84px) - MASSIVE, CONFIDENT
- Letter-spacing: -0.025em on headlines
- Font weight contrast: 400 vs 800
- Use Google Fonts (Inter for body, Outfit for headlines)

**LAW 2: COLOR WITH INTENTION**
- Maximum 3 colors: primary, secondary, accent
- Always define CSS variables with RGB values for rgba() usage
- Accent color used SURGICALLY - only for CTAs

**LAW 3: WHITESPACE IS LUXURY**
- Section padding: 100px-160px vertical
- Container max-width: 1200px
- Card padding: 32-48px minimum

**LAW 4: MOTION CREATES EMOTION**
- Scroll-triggered reveal animations
- Hover states: translateY(-4px) + shadow
- Smooth transitions: 0.3s cubic-bezier(0.4, 0, 0.2, 1)

**LAW 5: THE "WOW" ELEMENT**
Every website needs ONE standout feature:
- Gradient text on hero headline
- Glassmorphism cards
- Glowing CTA buttons
- Animated background blobs
- Bento grid layouts

**LAW 6: COPY THAT CONVERTS**
- Headlines create EMOTION, not describe features
- Benefits over features
- Social proof (stats, testimonials)
- CTAs that create desire

**LAW 7: PREMIUM DETAILS**
- Custom ::selection color
- Smooth scroll behavior
- Focus-visible states
- Custom scrollbar styling

## OUTPUT REQUIREMENTS

Return ONLY the complete HTML file:
- Start with <!DOCTYPE html>
- End with </html>
- NO explanations, NO markdown, NO code blocks
- ALL CSS in <style> tag in <head>
- ALL JavaScript in <script> tag before </body>
- Must be 100% mobile responsive
- Must include scroll reveal animations
- Must include functional navigation
- Must look like it cost $50,000+ to build`;

function buildUserPrompt(data: any): string {
  return `Create a complete, premium, production-ready website for:

## BUSINESS DETAILS
- **Name:** ${data.businessName}
- **Industry:** ${data.industry || 'Professional Services'}
- **Description:** ${data.description || 'A premium business offering top-tier services'}
- **Goal:** ${data.goal || 'Generate leads and showcase services'}

## CONTACT INFO (use in contact section & footer)
- **Email:** ${data.email || 'hello@example.com'}
- **Phone:** ${data.phone || '(555) 123-4567'}
- **Address:** ${data.address || '123 Business Ave, City, State'}

## STYLE PREFERENCES
- **Style:** ${data.style || 'modern'}
- **Primary Color:** ${data.primaryColor || '#6366f1'}
- **Dark Mode:** ${data.darkMode ? 'Yes' : 'No'}

## REQUIRED SECTIONS
1. **Navigation** - Sticky, with logo and smooth scroll links
2. **Hero** - Full viewport, gradient text headline, compelling CTA, social proof
3. **Services/Features** - 4-6 cards with icons, bento grid or standard grid
4. **About** - Split layout with image, story, years of experience badge
5. **Testimonials** - 3 customer reviews with photos, names, ratings
6. **Stats** - 4 impressive numbers with count-up animation
7. **CTA Section** - Gradient background, compelling headline
8. **Contact** - Form with name, email, message + contact info
9. **Footer** - Links, social media, copyright

## MUST INCLUDE
- Google Fonts import (Inter + Outfit)
- CSS variables for all colors
- Mobile responsive (test at 768px and 480px)
- Scroll reveal animations with IntersectionObserver
- Form submission feedback
- Hover effects on all interactive elements
- Back to top button

Generate the complete HTML file now. Remember: NO explanations, just the HTML.`;
}

function cleanHTML(content: string): string {
  let cleaned = content.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  
  const doctypeMatch = cleaned.match(/<!DOCTYPE html>/i);
  const htmlEndMatch = cleaned.match(/<\/html>/i);
  
  if (doctypeMatch && htmlEndMatch) {
    const startIndex = doctypeMatch.index!;
    const endIndex = htmlEndMatch.index! + 7;
    cleaned = cleaned.substring(startIndex, endIndex);
  }
  
  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: buildUserPrompt(body) }
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const html = cleanHTML(content.text);

    if (!html.includes('<!DOCTYPE html>') || !html.includes('</html>')) {
      throw new Error('Invalid HTML generated');
    }

    return NextResponse.json({
      success: true,
      html: html,
      tokensUsed: response.usage?.output_tokens || 0,
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate website',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'AI Website Generator',
    version: '2.0.0',
    endpoints: {
      POST: {
        description: 'Generate a website',
        body: {
          businessName: 'string (required)',
          industry: 'string',
          description: 'string',
          style: 'modern | elegant | bold | minimal | dark',
          primaryColor: 'hex color',
          darkMode: 'boolean'
        }
      }
    }
  });
}
