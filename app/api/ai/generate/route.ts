// app/api/ai/generate/route.ts
// PREMIUM AI Website Generation - $100K Quality Websites

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 300;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// MASTER SYSTEM PROMPT - The Secret Sauce for Premium Websites
// ============================================================================
const MASTER_SYSTEM_PROMPT = `You are an elite creative director who has won every Awwwards Site of the Day, FWA, and CSS Design Award. You've designed for Apple, Stripe, Linear, and Vercel. Companies pay you $100,000+ per website.

## THE 7 LAWS OF ELITE WEBSITES

**LAW 1: TYPOGRAPHY IS POWER**
- Hero headlines: clamp(48px, 7vw, 80px) - MASSIVE, CONFIDENT
- Letter-spacing: -0.02em on headlines (tighter = premium)
- Font weight contrast: 400 vs 700 creates visual tension
- Line-height: 1.1 for headlines, 1.6 for body

**LAW 2: COLOR WITH INTENTION**
- Maximum 3 colors: primary, secondary/accent, neutrals
- Dark themes feel premium (#0a0a0a, #111111)
- Light themes need warmth (#fafaf9, not pure white)
- Accent color used SURGICALLY - only for CTAs and key moments

**LAW 3: WHITESPACE IS LUXURY**
- Section padding: 100px-150px vertical
- Expensive websites have MORE space, not less
- Let single elements breathe alone

**LAW 4: MOTION CREATES EMOTION**
- Every transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Scroll-triggered reveals (staggered, elegant)
- Hover states that feel ALIVE (translateY, scale, shadows)

**LAW 5: THE "WOW" ELEMENT**
Every elite website needs ONE thing that makes people stop:
- Gradient text on hero headlines
- Animated gradient backgrounds
- Glassmorphism cards with backdrop-blur
- Floating decorative elements
- Glowing buttons with box-shadow

**LAW 6: COPY THAT CONVERTS**
- Headlines create EMOTION, not describe features
- "Transform Your Life" not "Our Services"
- Benefits over features, always
- Social proof everywhere (numbers, testimonials)

**LAW 7: DETAILS NOBODY NOTICES (BUT EVERYONE FEELS)**
- Custom selection color matching brand
- Smooth scroll-behavior
- Custom focus states
- Consistent spacing rhythm

## REQUIRED CSS STRUCTURE

Always include these CSS foundations:

\`\`\`css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');

:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --secondary: #ec4899;
  --accent: #f59e0b;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-dark: #0a0a0a;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --border: #e2e8f0;
  --font-display: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-xl: 0 25px 50px -12px rgba(0,0,0,0.25);
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { 
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
::selection { background: var(--primary); color: white; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
section { padding: 100px 0; }

/* Typography */
h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 700; line-height: 1.1; }
h1 { font-size: clamp(48px, 7vw, 80px); letter-spacing: -0.02em; }
h2 { font-size: clamp(36px, 5vw, 56px); letter-spacing: -0.02em; }
h3 { font-size: clamp(24px, 3vw, 32px); }

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: var(--transition);
}
.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
}
.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border);
}
.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Cards */
.card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid var(--border);
  transition: var(--transition);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

/* Animations */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
.stagger > *:nth-child(1) { transition-delay: 0.1s; }
.stagger > *:nth-child(2) { transition-delay: 0.2s; }
.stagger > *:nth-child(3) { transition-delay: 0.3s; }
.stagger > *:nth-child(4) { transition-delay: 0.4s; }

/* Navigation */
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 0;
  transition: var(--transition);
}
nav.scrolled {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
  padding: 12px 0;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 100px;
  position: relative;
  overflow: hidden;
}

/* Section Headers */
.section-badge {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}
.section-title { margin-bottom: 16px; }
.section-subtitle { 
  font-size: 18px; 
  color: var(--text-secondary); 
  max-width: 600px; 
}

/* Mobile Responsive */
@media (max-width: 768px) {
  section { padding: 60px 0; }
  .container { padding: 0 20px; }
  nav { padding: 16px 0; }
  .btn { padding: 14px 24px; font-size: 15px; }
}
\`\`\`

## REQUIRED JAVASCRIPT

\`\`\`javascript
document.addEventListener('DOMContentLoaded', () => {
  // Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // Navbar Scroll Effect
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  // Animated Counter
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          el.textContent = Math.floor(current);
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          }
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  // Form Handling
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = '✓ Sent!';
          form.reset();
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
          }, 2000);
        }, 1000);
      }
    });
  });
});
\`\`\`

## OUTPUT FORMAT

Return ONLY the complete HTML file:
- Start with <!DOCTYPE html>
- End with </html>
- NO explanations before or after
- NO markdown code blocks
- ALL CSS inside <style> in <head>
- ALL JavaScript inside <script> before </body>
- Must be 100% complete and functional
- Must be mobile responsive`;

// ============================================================================
// INDUSTRY-SPECIFIC DESIGN BRIEFS
// ============================================================================
const INDUSTRY_BRIEFS: Record<string, string> = {
  'restaurant': `
INDUSTRY: RESTAURANT / FOOD

COLOR PALETTE:
- Primary: Deep burgundy #7f1d1d or warm amber #b45309
- Secondary: Cream #fef3c7
- Accents: Gold #d97706
- Background: Warm off-white #fffbeb

FONTS: Playfair Display for headlines, Lato for body

IMAGERY: Use appetizing food photography from Unsplash
- https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80
- https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80
- https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80

SECTIONS NEEDED:
1. Hero - Full-screen food image with overlay, restaurant name, tagline, "Reserve Table" CTA
2. About - Chef story, restaurant history, philosophy
3. Menu Highlights - 4-6 signature dishes with photos and descriptions
4. Gallery - Masonry grid of food and ambiance photos
5. Testimonials - 3 customer reviews with ratings
6. Location & Hours - Map placeholder, address, hours, phone
7. Footer - Social links, newsletter signup

COPY STYLE: Sensual, appetizing. "Handcrafted with passion" not "We make food"`,

  'health-beauty': `
INDUSTRY: SPA / HEALTH & BEAUTY / WELLNESS

COLOR PALETTE:
- Primary: Sage green #84a98c or soft pink #f4a5a4
- Secondary: Cream #fefcf3
- Accents: Gold #d4af37
- Background: Soft white #fafaf9

FONTS: Cormorant Garamond for headlines, Quicksand for body

IMAGERY: Serene, calming spa imagery
- https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80
- https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80
- https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80

SECTIONS NEEDED:
1. Hero - Serene spa imagery, calming headline, "Book Now" CTA
2. Services - Treatment menu with prices
3. About - Philosophy, approach to wellness
4. Team - Therapists with warm photos
5. Gallery - Spa facilities and treatments
6. Testimonials - Client experiences
7. Contact - Booking info, location, hours

COPY STYLE: Soothing, indulgent. "Melt away tension" not "We offer massages"`,

  'professional': `
INDUSTRY: PROFESSIONAL SERVICES (Law, Finance, Consulting)

COLOR PALETTE:
- Primary: Navy blue #1e3a5f or deep teal #115e59
- Secondary: Gold #b8860b
- Accents: Light blue #dbeafe
- Background: Clean white #ffffff

FONTS: Inter or Libre Baskerville for headlines, Source Sans Pro for body

IMAGERY: Professional, sophisticated
- https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80
- https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80
- https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80

SECTIONS NEEDED:
1. Hero - Sophisticated design, clear value proposition, "Schedule Consultation" CTA
2. Services - Practice areas with icons
3. About - Firm credentials, experience, team
4. Team - Professional headshots with bios
5. Results/Case Studies - Success metrics, client wins
6. Testimonials - Client endorsements
7. Contact - Professional contact form

COPY STYLE: Authoritative but approachable. "$50M recovered for clients" not "We help with legal matters"`,

  'fitness': `
INDUSTRY: FITNESS / GYM / PERSONAL TRAINING

COLOR PALETTE:
- Primary: Electric blue #0ea5e9 or energetic red #dc2626
- Secondary: Dark charcoal #18181b
- Accents: Lime #84cc16
- Background: Near black #0a0a0a (dark theme)

FONTS: Oswald or Bebas Neue for headlines, Inter for body

IMAGERY: High-energy fitness shots
- https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80
- https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80
- https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80

SECTIONS NEEDED:
1. Hero - Powerful action shot, motivational headline, "Start Free Trial" CTA
2. Programs - Class types and training options
3. Transformations - Before/after testimonials
4. Trainers - Team with credentials
5. Facility - Gym photos
6. Pricing - Membership tiers
7. Contact - Free trial signup form

COPY STYLE: Motivational, challenging. "Unleash your potential" not "Join our gym"`,

  'tech-startup': `
INDUSTRY: TECH / SAAS / STARTUP

COLOR PALETTE:
- Primary: Indigo #6366f1 or purple #8b5cf6
- Secondary: Pink #ec4899
- Accents: Cyan #22d3ee
- Background: Dark #0f0f0f or light gradient

FONTS: Space Grotesk or Inter for headlines, Inter for body

IMAGERY: Abstract gradients, product mockups
- https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80

SECTIONS NEEDED:
1. Hero - Product visual, clear value prop, "Start Free" CTA, social proof (logos)
2. Features - Bento grid with icons
3. How It Works - 3 simple steps
4. Pricing - Tiers with feature comparison
5. Testimonials - User quotes with photos
6. FAQ - Common questions (accordion)
7. CTA - Final conversion section

COPY STYLE: Clear, benefit-focused. "Save 10 hours every week" not "Our software has features"`,

  'real-estate': `
INDUSTRY: REAL ESTATE

COLOR PALETTE:
- Primary: Navy #1e3a5f
- Secondary: Gold #b8860b
- Accents: Green #166534
- Background: Warm white #fafaf9

FONTS: Poppins for headlines, Inter for body

IMAGERY: Stunning property photos
- https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80
- https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80

SECTIONS NEEDED:
1. Hero - Beautiful property image, "Find Your Dream Home" headline
2. Featured Listings - Property cards with photos, price, details
3. Agent Profile - Photo, bio, credentials
4. Services - Buying, selling, consultation
5. Testimonials - Happy homeowner stories
6. Contact - Inquiry form

COPY STYLE: Aspirational yet trustworthy. "Your dream home awaits"`,

  'ecommerce': `
INDUSTRY: E-COMMERCE / ONLINE STORE

COLOR PALETTE:
- Primary: Black #000000
- Secondary: Your brand color
- Accents: Gold or silver
- Background: Clean white

FONTS: DM Sans for headlines, Inter for body

SECTIONS NEEDED:
1. Hero - Product showcase, promo banner, "Shop Now" CTA
2. Trust Badges - Free shipping, returns, secure checkout
3. Featured Products - Product cards grid
4. Categories - Visual category showcase
5. Testimonials - Customer reviews
6. Newsletter - Discount signup
7. Footer - Policies, payment icons

COPY STYLE: Concise, benefit-focused with urgency`,

  'local-services': `
INDUSTRY: LOCAL SERVICES (Plumber, Electrician, HVAC, Cleaning)

COLOR PALETTE:
- Primary: Trust blue #1e40af
- Secondary: Safety orange #ea580c
- Background: Clean white

FONTS: Poppins for headlines, Inter for body

IMAGERY:
- https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80

SECTIONS NEEDED:
1. Hero - Team photo, trust badges (Licensed, Insured), BIG phone number, "Get Free Quote" CTA
2. Services - 4-6 services with icons
3. Why Us - 24/7, Same-day, Warranty, Licensed
4. Gallery - Work photos
5. Reviews - 3+ testimonials with stars
6. Service Areas - Map or area list
7. Contact - Form + prominent phone

COPY STYLE: Confident, reassuring. "We'll be there in 60 minutes"`,
};

// ============================================================================
// STYLE MODIFIERS
// ============================================================================
const STYLE_MODIFIERS: Record<string, string> = {
  'modern': 'Clean lines, subtle gradients, card-based layouts, smooth animations, lots of whitespace',
  'elegant': 'Serif fonts, gold accents, refined typography, subtle shadows, cream backgrounds',
  'bold': 'Oversized typography, high contrast, strong colors, dramatic shadows, striking imagery',
  'minimal': 'Maximum whitespace, 2-3 colors only, simple typography, essential elements only',
  'playful': 'Rounded corners, bright colors, bouncy animations, illustrated elements, fun patterns',
  'dark': 'Dark backgrounds (#0a0a0a), light text, glowing accents, gradient borders, premium feel',
  'corporate': 'Professional blues and grays, structured layouts, trust-building elements'
};

// ============================================================================
// GENERATE WEBSITE
// ============================================================================
async function generateWithClaude(project: any): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const industry = (project.industry || 'professional').toLowerCase().replace(/[^a-z-]/g, '-');
  const style = (project.style || 'modern').toLowerCase();
  
  const industryBrief = INDUSTRY_BRIEFS[industry] || INDUSTRY_BRIEFS['professional'] || '';
  const styleGuide = STYLE_MODIFIERS[style] || STYLE_MODIFIERS['modern'];

  const userPrompt = `Create a stunning, premium website for this business:

## BUSINESS DETAILS
- Name: ${project.business_name}
- Industry: ${project.industry || 'Professional Services'}
- Description: ${project.description || 'A professional business offering quality services'}
- Goal: ${project.website_goal || 'Generate leads and build trust'}
- Style Preference: ${project.style || 'modern'} - ${styleGuide}

## CONTACT INFORMATION
- Email: ${project.contact_email || 'hello@' + (project.business_name || 'company').toLowerCase().replace(/\s+/g, '') + '.com'}
- Phone: ${project.contact_phone || '(555) 123-4567'}
- Address: ${project.address || 'New York, NY'}

## FEATURES TO INCLUDE
${(project.features || ['Contact Form', 'Testimonials', 'Services']).map((f: string) => '- ' + f).join('\n')}

${industryBrief}

## CRITICAL REQUIREMENTS
1. Make the hero section BREATHTAKING - full viewport height, stunning visuals
2. Use the EXACT color palette from the industry brief
3. Include ALL sections listed in the industry brief
4. Add scroll reveal animations to every section
5. Make buttons glow/lift on hover
6. Write compelling, specific copy for THIS business
7. Use real Unsplash images (the URLs provided in the brief)
8. Make it fully mobile responsive
9. Include working navigation with smooth scroll
10. Add a contact form that shows success message on submit

The website should look like it cost $50,000+ to design.

Output ONLY the complete HTML code starting with <!DOCTYPE html>`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: MASTER_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API: ${response.status}`);
  }

  const data = await response.json();
  let html = data.content[0].text.trim();
  
  // Clean markdown
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) html = html.substring(doctypeIndex);
  
  return html;
}

// ============================================================================
// API HANDLER
// ============================================================================
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

    if (action === 'quick-edit' || action === 'revise') {
      const { instruction, feedback, currentHtml } = body;
      const editRequest = instruction || feedback;
      const htmlToEdit = (currentHtml || project.generated_html || '').substring(0, 20000);
      
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
          system: 'You are an elite web designer. Apply the requested changes while maintaining the premium quality. Output ONLY the complete HTML.',
          messages: [{ 
            role: 'user', 
            content: `Apply this change: ${editRequest}\n\nCurrent HTML:\n${htmlToEdit}\n\nReturn the COMPLETE updated HTML starting with <!DOCTYPE html>.`
          }],
        }),
      });

      if (!response.ok) throw new Error('Edit failed');
      
      const data = await response.json();
      let html = data.content[0].text.trim();
      html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');

      await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          ...(action === 'revise' && { revision_count: (project.revision_count || 0) + 1 })
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
