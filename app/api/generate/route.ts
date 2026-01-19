// app/api/ai/generate/route.ts
// Elite AI Website Generation - Million Dollar Websites

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// The Elite Creative Director System Prompt
const ELITE_SYSTEM_PROMPT = `You are the world's most sought-after web designer. Your websites have won every major design award - Awwwards Site of the Day, FWA, CSS Design Awards. Brands like Apple, Stripe, and Linear fight to hire you.

Your secret? You understand that a website isn't just information - it's an EXPERIENCE. Every pixel, every animation, every scroll interaction is intentional.

## YOUR DESIGN DNA

**THE APPLE PRINCIPLE**: Simplicity is the ultimate sophistication. Remove everything that doesn't serve the story. What remains should be perfect.

**THE STRIPE PRINCIPLE**: Gradients aren't decoration - they create depth and dimension. Shadows aren't effects - they establish hierarchy. Animation isn't flashy - it guides the eye.

**THE LINEAR PRINCIPLE**: Dark modes feel premium. Subtle grain adds texture. Micro-interactions create delight. Speed is a feature.

## WHAT MAKES A MILLION-DOLLAR WEBSITE

1. **THE HERO STOPS YOU COLD**
   - Massive, confident typography (60-120px headlines)
   - A single, powerful message
   - Cinematic imagery or mesmerizing gradients
   - Subtle motion that draws you in

2. **EVERY SECTION HAS PURPOSE**
   - No filler content
   - Each section answers a question or builds desire
   - Visual variety prevents scroll fatigue
   - Strategic CTAs placed at decision moments

3. **TYPOGRAPHY IS ART**
   - Font pairing that creates tension and harmony
   - Generous line-height (1.5-1.8 for body)
   - Letter-spacing that breathes
   - Size contrast that creates hierarchy (don't be afraid of BIG)

4. **COLOR TELLS A STORY**
   - A dominant color that owns the brand
   - An accent that demands action
   - Neutrals that let content breathe
   - Gradients that add dimension, not chaos

5. **ANIMATIONS HAVE MEANING**
   - Elements fade in as you scroll (Intersection Observer)
   - Hover states reward exploration
   - Transitions are smooth, never jarring (0.3s ease is your friend)
   - Loading states feel intentional

6. **DETAILS NOBODY NOTICES (BUT EVERYONE FEELS)**
   - Consistent spacing system (8px base grid)
   - Subtle shadows that create depth
   - Border-radius that matches the brand personality
   - Custom selection colors
   - Smooth scroll behavior

## YOUR TECHNICAL STANDARDS

You write clean, semantic HTML5. Your CSS is organized with custom properties. Your JavaScript is minimal but powerful.

You ALWAYS include:
- Intersection Observer for scroll animations
- Smooth scroll behavior
- Hover micro-interactions
- Mobile-responsive design (mobile-first)
- Proper meta tags
- Google Fonts with display=swap
- CSS custom properties for theming

## YOUR OUTPUT RULES

1. Output ONLY raw HTML - no markdown, no explanations, no code blocks
2. Start with <!DOCTYPE html>, end with </html>
3. All CSS in a single <style> tag in <head>
4. All JavaScript in a single <script> tag before </body>
5. Use https://picsum.photos for images (they look real and professional)
6. Use https://fonts.googleapis.com for typography`;


// Industry-specific creative briefs
const INDUSTRY_BRIEFS: Record<string, string> = {
  'restaurant': `
## RESTAURANT WEBSITE BRIEF

**THE FEELING**: Walking into a restaurant where you know the food will be incredible before you even see the menu. Anticipation. Appetite. Warmth.

**HERO APPROACH**: Full-bleed food photography with a dark overlay. The restaurant name in an elegant serif or script. A single line about what makes this place special. "Reserve a Table" button that glows.

**COLOR PSYCHOLOGY**: 
- Rich burgundies and deep oranges stimulate appetite
- Cream and warm whites feel inviting
- Gold accents suggest quality
- Dark backgrounds make food photography pop

**MUST-HAVE SECTIONS**:
1. Hero with signature dish or restaurant interior
2. "Our Story" with atmospheric photo
3. Menu highlights (not full menu - tease the best dishes)
4. Photo gallery that makes mouths water
5. Testimonials from real diners
6. Hours, location with embedded map, reservation CTA
7. Footer with social links and contact

**TYPOGRAPHY**: Elegant serif for headlines (Playfair Display, Cormorant), clean sans-serif for body (Lato, Open Sans)

**SPECIAL TOUCHES**: 
- Parallax on food images
- Menu items that reveal descriptions on hover
- A subtle texture overlay (like paper or linen)
- Warm, glowing button hovers`,

  'local-services': `
## LOCAL SERVICE BUSINESS BRIEF

**THE FEELING**: Relief. "Finally, a professional I can trust." Competence meets approachability. They'll show up on time and do it right.

**HERO APPROACH**: Split design - powerful headline on one side, image of the team/work on the other. Trust badges floating nearby. Clear "Get a Quote" CTA.

**COLOR PSYCHOLOGY**:
- Blues build trust and professionalism
- Greens suggest growth and reliability
- Orange CTAs create urgency without aggression
- Clean whites feel organized and clean

**MUST-HAVE SECTIONS**:
1. Hero with value proposition and primary CTA
2. Services grid with icons and brief descriptions
3. "Why Choose Us" with 3-4 key differentiators
4. Before/After gallery or work showcase
5. Testimonials with names and photos
6. Service areas or coverage map
7. Contact form with phone number prominent
8. Footer with license numbers, insurance, guarantees

**TYPOGRAPHY**: Strong sans-serif for headlines (Montserrat, Poppins), readable body font (Inter, Open Sans)

**SPECIAL TOUCHES**:
- Animated counters for stats (years in business, jobs completed)
- Service cards that lift on hover
- Click-to-call button on mobile
- Trust badges that subtly animate in`,

  'ecommerce': `
## E-COMMERCE / PRODUCT BRAND BRIEF

**THE FEELING**: Discovering a brand that "gets" you. Products you didn't know you needed but now can't live without. The unboxing will be just as good as the product.

**HERO APPROACH**: Large product shot with floating elements or lifestyle image. Brand tagline that captures the essence. "Shop Now" that's impossible to miss.

**COLOR PSYCHOLOGY**:
- Minimal black/white lets products shine
- A single accent color for CTAs and highlights
- Soft backgrounds that don't compete with product photos
- Occasional bold color for sales/promotions

**MUST-HAVE SECTIONS**:
1. Hero with flagship product or collection
2. Featured products grid (3-4 items)
3. Brand story - why this company exists
4. Product categories with lifestyle imagery
5. Social proof (reviews, press logos, Instagram feed)
6. Newsletter signup with incentive
7. Footer with all the trust signals (shipping, returns, secure checkout)

**TYPOGRAPHY**: Modern, slightly editorial (Space Grotesk, Syne), clean body copy (DM Sans, Inter)

**SPECIAL TOUCHES**:
- Product cards with quick-view hover effect
- "Add to Cart" micro-animation
- Floating cart indicator
- Subtle product image zoom on hover`,

  'professional': `
## PROFESSIONAL SERVICES BRIEF (Law, Consulting, Finance)

**THE FEELING**: "These people are experts and I'm in good hands." Confidence without arrogance. Success is expected.

**HERO APPROACH**: Either a striking gradient/abstract background OR professional team photo. Headline that speaks to outcomes, not services. "Schedule a Consultation" CTA.

**COLOR PSYCHOLOGY**:
- Navy and dark blue = authority and trust
- Gold/amber accents = success and prestige
- Clean whites = clarity and transparency
- Subtle grays = sophistication

**MUST-HAVE SECTIONS**:
1. Hero with powerful outcome-focused headline
2. Services with clear explanations
3. About the firm/team with credentials
4. Case studies or results (numbers, outcomes)
5. Client logos if available
6. Testimonials from satisfied clients
7. Team members with professional photos
8. Contact with multiple ways to reach out

**TYPOGRAPHY**: Authoritative serif for headlines (Libre Baskerville, Source Serif Pro), professional sans-serif body (Inter, Helvetica Neue)

**SPECIAL TOUCHES**:
- Animated statistics counters
- Team cards that flip to show bio
- Subtle parallax on background elements
- Refined hover states throughout`,

  'health-beauty': `
## HEALTH & BEAUTY / SPA / WELLNESS BRIEF

**THE FEELING**: Instant calm. A visual deep breath. "I deserve this." Self-care as ritual, not routine.

**HERO APPROACH**: Soft, dreamy imagery. Gentle gradient backgrounds. Elegant script accent. "Book Your Experience" CTA that feels like an invitation.

**COLOR PSYCHOLOGY**:
- Soft greens and teals = wellness and balance
- Blush pink and rose = femininity and care
- Cream and warm whites = purity and cleanliness
- Gold accents = luxury and indulgence

**MUST-HAVE SECTIONS**:
1. Hero that transports you to the spa
2. Services/treatments with poetic descriptions
3. The philosophy/approach section
4. Team/therapists with warm photos
5. Gallery of the space and treatments
6. Pricing packages (make the mid-tier shine)
7. Booking CTA with availability hint
8. Testimonials about transformative experiences
9. Location, hours, contact

**TYPOGRAPHY**: Elegant serif or script for headlines (Cormorant, Playfair Display), soft sans-serif body (Quicksand, Nunito)

**SPECIAL TOUCHES**:
- Soft, organic shapes floating in background
- Gentle parallax effects
- Service cards with subtle glow on hover
- Imagery with slight blur/dreamy effect at edges`,

  'real-estate': `
## REAL ESTATE BRIEF

**THE FEELING**: "This is the one." Aspiration meets attainability. The dream home is closer than you think.

**HERO APPROACH**: Stunning property image or video background. Search box prominently placed. "Find Your Dream Home" or agent value proposition.

**COLOR PSYCHOLOGY**:
- Navy and dark blues = trust and stability
- Gold/champagne = luxury and aspiration
- Clean whites = space and possibility
- Warm woods and greens = home and comfort

**MUST-HAVE SECTIONS**:
1. Hero with search or featured property
2. Featured listings with beautiful cards
3. Agent/team introduction with photo
4. Why work with us (local expertise, results)
5. Neighborhoods/areas served
6. Testimonials from happy homeowners
7. Sold properties or success metrics
8. Contact with multiple options

**TYPOGRAPHY**: Strong, trustworthy sans-serif (Poppins, Montserrat), elegant serif for accents (Playfair Display)

**SPECIAL TOUCHES**:
- Property cards with image carousel dots
- Listing badges (New, Price Drop, Featured)
- Animated counters (homes sold, years experience)
- Map section with interactive feel`,

  'portfolio': `
## CREATIVE PORTFOLIO BRIEF

**THE FEELING**: "Wow, I need to hire this person." Creative confidence. Unique voice. The work speaks for itself.

**HERO APPROACH**: Bold, oversized name. Minimal distraction. Maybe a subtle animation or unique interaction. Let personality shine immediately.

**COLOR PSYCHOLOGY**:
- Dark backgrounds feel editorial and premium
- High contrast creates drama
- One accent color for personality
- Could go bold and unexpected

**MUST-HAVE SECTIONS**:
1. Hero with name/title and brief positioning
2. Selected works in a beautiful grid
3. About section with personality
4. Services or what you offer
5. Kind words from clients
6. Contact that encourages reaching out

**TYPOGRAPHY**: Distinctive headline font (Space Grotesk, Clash Display), clean body (Inter, DM Sans)

**SPECIAL TOUCHES**:
- Project thumbnails with hover effects revealing title
- Smooth page-feel scrolling
- Custom cursor (optional)
- Unique layout that breaks the grid`,

  'banking': `
## BANKING / FINTECH BRIEF

**THE FEELING**: "My money is safe and working for me." Modern trust. Innovation meets security. Finance made human.

**HERO APPROACH**: Clean gradient or abstract shapes. Mobile app mockup or card design floating. Headline about financial freedom or security. "Get Started" CTA.

**COLOR PSYCHOLOGY**:
- Deep blues and navy = trust and security
- Teal and cyan = innovation and freshness
- Green = growth and money
- White space = clarity and transparency
- Purple = modern fintech energy

**MUST-HAVE SECTIONS**:
1. Hero with app showcase or value proposition
2. Features/products with clear benefits
3. Security and trust section (encryption, FDIC, etc.)
4. How it works in 3-4 simple steps
5. Mobile app showcase with device mockup
6. Rates or product comparison
7. Customer testimonials
8. FAQ accordion
9. Download app / Open account CTAs
10. Footer with legal links and security badges

**TYPOGRAPHY**: Modern, geometric sans-serif (Inter, Plus Jakarta Sans, Satoshi), monospace for numbers (JetBrains Mono)

**SPECIAL TOUCHES**:
- Floating UI elements and cards
- Animated gradient backgrounds
- Security badges that inspire confidence
- Stats counters (users, transactions, etc.)
- Device mockups with app screenshots`
};

// Style modifiers
const STYLE_MODIFIERS: Record<string, string> = {
  'modern': `
**STYLE: MODERN**
- Clean lines and geometric shapes
- Bold, confident typography
- Strategic whitespace
- Subtle animations and micro-interactions
- Gradient accents
- Sans-serif typography
- Card-based layouts with soft shadows`,

  'elegant': `
**STYLE: ELEGANT**
- Refined serif typography
- Generous whitespace and breathing room
- Muted, sophisticated color palette
- Subtle gold or champagne accents
- Delicate hover effects
- Editorial-quality imagery
- Thin lines and borders`,

  'bold': `
**STYLE: BOLD**
- Oversized typography that demands attention
- High contrast colors
- Strong geometric shapes
- Dynamic, energetic animations
- Unexpected layout choices
- Thick borders and heavy shadows
- Maximum visual impact`,

  'minimal': `
**STYLE: MINIMAL**
- Maximum whitespace
- Limited color palette (2-3 colors max)
- Typography does the heavy lifting
- Invisible design that gets out of the way
- Subtle, almost imperceptible animations
- Focus entirely on content
- Every element must earn its place`,

  'playful': `
**STYLE: PLAYFUL**
- Rounded corners and organic shapes
- Bright, cheerful colors
- Bouncy animations
- Illustrated elements or icons
- Casual, friendly typography
- Unexpected delightful interactions
- Emoji-friendly where appropriate`,

  'corporate': `
**STYLE: CORPORATE**
- Professional and trustworthy
- Structured grid layouts
- Conservative color palette
- Clear information hierarchy
- Polished but not flashy
- Credibility-building elements
- Traditional navigation patterns`
};

// Main function to call Claude
async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
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
      temperature: 0.7, // Adds creativity
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// Clean HTML response
function cleanHtmlResponse(response: string): string {
  let html = response.trim();
  
  // Remove markdown code blocks if present
  if (html.startsWith('```html')) {
    html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  }
  if (html.startsWith('```')) {
    html = html.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  
  // Find the actual HTML start if there's preamble
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) {
    html = html.substring(doctypeIndex);
  }
  
  // Find the HTML end if there's content after
  const htmlEndIndex = html.toLowerCase().lastIndexOf('</html>');
  if (htmlEndIndex > 0) {
    html = html.substring(0, htmlEndIndex + 7);
  }
  
  return html;
}

// Generate website
async function generateWebsite(project: any): Promise<string> {
  const industryKey = (project.industry || 'local-services').toLowerCase().replace(/\s+/g, '-');
  const styleKey = (project.style || 'modern').toLowerCase();
  
  // Get industry brief, fallback to local-services
  const industryBrief = INDUSTRY_BRIEFS[industryKey] || INDUSTRY_BRIEFS['local-services'];
  const styleModifier = STYLE_MODIFIERS[styleKey] || STYLE_MODIFIERS['modern'];

  const userPrompt = `
# CREATE A MILLION-DOLLAR WEBSITE

## THE CLIENT
**Business Name**: ${project.business_name}
**Industry**: ${project.industry}
**What They Do**: ${project.description || 'A professional business serving their community with excellence'}
**Website Goal**: ${project.website_goal || 'Generate leads, build trust, and convert visitors into customers'}
${project.features?.length ? `**Requested Features**: ${project.features.join(', ')}` : ''}
${project.inspirations ? `**Design Inspiration**: ${project.inspirations}` : ''}
${project.customers?.email ? `**Contact Email**: ${project.customers.email}` : ''}
${project.customers?.phone ? `**Contact Phone**: ${project.customers.phone}` : ''}

${industryBrief}

${styleModifier}

---

## TECHNICAL EXECUTION

**IMAGES**: Use https://picsum.photos for realistic images
- Hero: https://picsum.photos/1920/1080?random=1
- Sections: https://picsum.photos/800/600?random=2 (increment the number)
- Team/People: https://picsum.photos/400/500?random=10
- Gallery: https://picsum.photos/600/400?random=20

**FONTS**: Use Google Fonts (include proper link tags)

**REQUIRED CSS FEATURES**:
\`\`\`css
:root {
  --primary: /* your choice */;
  --secondary: /* your choice */;
  --accent: /* your choice */;
  --bg: /* your choice */;
  --text: /* your choice */;
}

/* Smooth scroll */
html { scroll-behavior: smooth; }

/* Reveal animation */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
\`\`\`

**REQUIRED JAVASCRIPT**:
\`\`\`javascript
// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
\`\`\`

---

Now create a website so stunning that the client will immediately want to pay. Make it look like a $50,000 custom build.

Output ONLY the HTML. Start with <!DOCTYPE html>, end with </html>. No explanations.`;

  const response = await callClaude(ELITE_SYSTEM_PROMPT, userPrompt);
  return cleanHtmlResponse(response);
}

// Revise website
async function reviseWebsite(currentHtml: string, feedback: string, project: any): Promise<string> {
  const systemPrompt = `You are an elite web designer making revisions. Maintain the premium quality while implementing all requested changes. Output ONLY the complete HTML.`;

  const userPrompt = `
## REVISION REQUEST

**Client**: ${project.business_name}
**Feedback**: ${feedback}

Apply all requested changes while maintaining the premium design quality.

**Current Website**:
${currentHtml}

Output the COMPLETE revised HTML. Start with <!DOCTYPE html>, end with </html>.`;

  const response = await callClaude(systemPrompt, userPrompt);
  return cleanHtmlResponse(response);
}

// Quick edit
async function quickEdit(currentHtml: string, instruction: string): Promise<string> {
  const systemPrompt = `Make this specific edit while preserving everything else. Output ONLY the complete HTML.`;

  const userPrompt = `
**Edit requested**: ${instruction}

**Current HTML**:
${currentHtml}

Output the COMPLETE updated HTML. Start with <!DOCTYPE html>, end with </html>.`;

  const response = await callClaude(systemPrompt, userPrompt);
  return cleanHtmlResponse(response);
}

// API Route Handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, action } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*, customers(name, email, phone, business_name)')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (action === 'generate') {
      const html = await generateWebsite(project);
      
      await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          status: 'PREVIEW_READY',
        })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html, message: 'Website generated successfully' });
    }

    if (action === 'revise') {
      const { feedback, currentHtml } = body;
      
      if (!feedback) {
        return NextResponse.json({ error: 'Feedback required' }, { status: 400 });
      }

      const html = await reviseWebsite(currentHtml || project.generated_html, feedback, project);
      
      await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          revision_count: (project.revision_count || 0) + 1,
        })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html, message: 'Revisions applied' });
    }

    if (action === 'quick-edit') {
      const { instruction, currentHtml } = body;
      
      if (!instruction) {
        return NextResponse.json({ error: 'Instruction required' }, { status: 400 });
      }

      const html = await quickEdit(currentHtml || project.generated_html, instruction);
      
      await supabase
        .from('projects')
        .update({ generated_html: html })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html, message: 'Edit applied' });
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
