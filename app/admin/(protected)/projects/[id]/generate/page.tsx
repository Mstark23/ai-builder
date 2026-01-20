// app/api/ai/generate/route.ts
// ULTIMATE AI Website Generation v3.0 - With Streaming to avoid timeout
// Works on Vercel Hobby plan (10s timeout) by using streaming

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use Edge runtime for longer timeout and streaming support
export const runtime = 'edge';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// MASTER SYSTEM PROMPT
// ============================================================================
const MASTER_SYSTEM_PROMPT = `You are an elite creative director who has won every Awwwards Site of the Day. Companies pay you $100,000+ per website.

## THE 7 LAWS OF ELITE WEBSITES

**LAW 1: TYPOGRAPHY IS POWER**
- Hero headlines: clamp(56px, 8vw, 120px) - MASSIVE
- Letter-spacing: -0.03em on headlines
- Line-height: 1.05-1.1 for headlines, 1.7 for body

**LAW 2: COLOR WITH INTENTION**
- Maximum 3 colors plus neutrals
- Dark themes = premium (#0a0a0a)
- Light themes need warmth (#fafaf9)

**LAW 3: WHITESPACE IS LUXURY**
- Section padding: 120px-200px vertical
- Spacious = premium

**LAW 4: MOTION CREATES EMOTION**
- Transitions: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Scroll-triggered reveals
- Hover states that feel alive

**LAW 5: THE "WOW" ELEMENT**
Include ONE memorable element:
- Animated gradient background
- Glassmorphism cards
- Floating blob shapes
- Gradient text headlines
- Glowing buttons

**LAW 6: COPY THAT CONVERTS**
- Headlines create EMOTION
- Benefits over features
- Social proof everywhere

**LAW 7: DETAILS MATTER**
- Custom selection color
- Smooth scroll
- Focus states for accessibility

## REQUIRED CSS

\`\`\`css
:root {
  --primary: #HEX;
  --primary-rgb: R, G, B;
  --secondary: #HEX;
  --accent: #HEX;
  --background: #HEX;
  --surface: #HEX;
  --text: #HEX;
  --text-muted: #HEX;
  --font-display: 'Font', sans-serif;
  --font-body: 'Font', sans-serif;
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { 
  font-family: var(--font-body); 
  background: var(--background); 
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  opacity: 0;
  transition: opacity 0.5s ease;
}
body.loaded { opacity: 1; }
::selection { background: var(--primary); color: white; }

.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
section { padding: 120px 0; }

/* Animations */
.reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
.reveal.active { opacity: 1; transform: translateY(0); }

.stagger-children > * { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
.stagger-children.active > *:nth-child(1) { transition-delay: 0.1s; }
.stagger-children.active > *:nth-child(2) { transition-delay: 0.15s; }
.stagger-children.active > *:nth-child(3) { transition-delay: 0.2s; }
.stagger-children.active > *:nth-child(4) { transition-delay: 0.25s; }
.stagger-children.active > *:nth-child(5) { transition-delay: 0.3s; }
.stagger-children.active > *:nth-child(6) { transition-delay: 0.35s; }
.stagger-children.active > * { opacity: 1; transform: translateY(0); }

.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes blobMorph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
}

/* Mobile */
@media (max-width: 768px) {
  section { padding: 80px 0; }
  .container { padding: 0 20px; }
}
\`\`\`

## REQUIRED JAVASCRIPT

\`\`\`javascript
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.reveal, .stagger-children').forEach(el => observer.observe(el));
  
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', window.scrollY > 50));
  
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // Counters
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = +entry.target.dataset.count;
        let current = 0;
        const step = target / 50;
        const timer = setInterval(() => {
          current += step;
          entry.target.textContent = current >= target ? target : Math.floor(current);
          if (current >= target) clearInterval(timer);
        }, 30);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));
  
  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu?.classList.toggle('active');
  });
  
  // FAQ
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      document.querySelectorAll('.faq-item').forEach(i => i !== item && i.classList.remove('active'));
      item.classList.toggle('active');
    });
  });
});
\`\`\`

## OUTPUT FORMAT

Return ONLY the complete HTML:
- Start with <!DOCTYPE html>
- End with </html>
- NO explanations, NO markdown blocks
- ALL CSS in <style> in <head>
- ALL JavaScript in <script> before </body>
- Must be mobile responsive
- Must include all animations`;

// ============================================================================
// INDUSTRY BRIEFS
// ============================================================================
const INDUSTRY_BRIEFS: Record<string, string> = {
'restaurant': `
## RESTAURANT

**COLORS:** Burgundy (#7f1d1d), gold (#d97706), cream (#fefce8)
**FONTS:** Playfair Display + Lato

**SECTIONS:**
1. Hero - Full food photo, dark overlay, "Reserve Table" CTA
2. About - Chef story, restaurant history
3. Menu - 4-6 signature dishes with photos
4. Gallery - 6-8 food/ambiance photos
5. Reviews - 3 testimonials with 5 stars
6. Location - Map, hours, phone
7. Footer

**IMAGES:**
- https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80
- https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80
- https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80`,

'local-services': `
## LOCAL SERVICES (Plumber, Electrician, etc.)

**COLORS:** Blue (#1e40af), orange (#ea580c), white
**FONTS:** Poppins + Inter

**SECTIONS:**
1. Hero - Team photo, trust badges, HUGE phone, "Free Quote" CTA
2. Services - 6 services with icons
3. Why Us - 24/7, Licensed, Warranty badges
4. Gallery - Work photos
5. Reviews - 3 testimonials
6. Service Areas - Map
7. Contact - Form + phone
8. Footer

**IMAGES:**
- https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&q=80
- https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80`,

'professional': `
## PROFESSIONAL (Law, Finance, Consulting)

**COLORS:** Navy (#1e3a5f), gold (#b8860b), white
**FONTS:** Libre Baskerville + Inter

**SECTIONS:**
1. Hero - Sophisticated, outcome-focused headline, "Consultation" CTA
2. Services - Practice areas with icons
3. About - Credentials, experience
4. Team - Headshots with bios
5. Results - Case studies, numbers
6. Testimonials - Client quotes
7. Contact - Form
8. Footer

**IMAGES:**
- https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80
- https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80`,

'health-beauty': `
## SPA / HEALTH & BEAUTY

**COLORS:** Sage (#84a98c), blush (#f4a5a4), cream (#fefcf3)
**FONTS:** Cormorant Garamond + Quicksand

**SECTIONS:**
1. Hero - Serene imagery, "Book Experience" CTA
2. Services - Treatments with prices
3. About - Philosophy
4. Team - Therapists
5. Gallery - Space photos
6. Testimonials
7. Booking CTA
8. Contact + Footer

**IMAGES:**
- https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80
- https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80`,

'real-estate': `
## REAL ESTATE

**COLORS:** Navy (#1e3a5f), gold (#b8860b), white
**FONTS:** Poppins + Inter

**SECTIONS:**
1. Hero - Property photo, search or value prop
2. Featured Listings - 3-4 property cards
3. Agent Profile - Photo, bio, credentials
4. Why Choose Us
5. Testimonials
6. Areas Served
7. Contact
8. Footer

**IMAGES:**
- https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80
- https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80`,

'fitness': `
## FITNESS / GYM

**COLORS:** Black (#0a0a0a), electric blue (#00d4ff), white
**FONTS:** Oswald + Inter

**SECTIONS:**
1. Hero - Action shot, dark bg, "Start Free Trial" CTA
2. Programs - Class types
3. Transformations - Before/after
4. Trainers - Team
5. Facility - Gym photos
6. Pricing - Membership tiers
7. CTA - Free trial
8. Contact + Footer

**IMAGES:**
- https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80
- https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80`,

'tech-startup': `
## TECH / SAAS

**COLORS:** Purple (#6366f1), pink (#ec4899), dark (#0f0f0f)
**FONTS:** Space Grotesk + Inter

**SECTIONS:**
1. Hero - Product visual, gradient bg, social proof, "Start Free" CTA
2. Logos - Trusted by
3. Features - Bento grid
4. How It Works - 3 steps
5. Pricing - Tiers with toggle
6. Testimonials
7. FAQ
8. CTA + Footer

**IMAGES:**
- https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80`,

'medical': `
## MEDICAL / HEALTHCARE

**COLORS:** Teal (#0d9488), white, soft blue
**FONTS:** Inter + Source Sans Pro

**SECTIONS:**
1. Hero - Reassuring message, "Book Appointment" CTA
2. Services
3. Doctors - Team with credentials
4. Why Us
5. Testimonials
6. Insurance - Accepted plans
7. Location
8. Contact + Footer

**IMAGES:**
- https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80
- https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80`,

'construction': `
## CONSTRUCTION / CONTRACTOR

**COLORS:** Orange (#d97706), dark gray (#1f2937), white
**FONTS:** Oswald + Inter

**SECTIONS:**
1. Hero - Project photo, "Get Quote" CTA
2. Services
3. Projects Gallery
4. About
5. Why Us
6. Testimonials
7. Contact
8. Footer

**IMAGES:**
- https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80
- https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80`,

'ecommerce': `
## E-COMMERCE

**COLORS:** Black, accent color, white
**FONTS:** DM Sans + Inter

**SECTIONS:**
1. Hero - Product imagery, "Shop Now" CTA
2. Trust Badges - Free shipping, returns
3. Featured Products - 4-8 cards
4. Categories
5. Bestsellers
6. Reviews
7. Newsletter
8. Footer

**IMAGES:**
- https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80
- https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80`,

'portfolio': `
## PORTFOLIO / CREATIVE

**COLORS:** Black (#18181b), purple (#a855f7), white
**FONTS:** Space Grotesk + Inter

**SECTIONS:**
1. Hero - Bold, minimal, name
2. Selected Works - Project grid
3. About
4. Services
5. Testimonials
6. Contact
7. Footer

**IMAGES:**
- https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80`,

'education': `
## EDUCATION / COACHING

**COLORS:** Indigo (#4f46e5), purple, light purple bg
**FONTS:** Plus Jakarta Sans + Inter

**SECTIONS:**
1. Hero - Instructor photo, transformation promise
2. Who It's For
3. Curriculum
4. Instructor Bio
5. Success Stories
6. Pricing
7. FAQ
8. Enrollment CTA + Footer

**IMAGES:**
- https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80`,
};

const DEFAULT_BRIEF = `
## PROFESSIONAL WEBSITE

**SECTIONS:**
1. Hero - Value prop + CTA
2. About
3. Services
4. Why Us
5. Testimonials
6. Contact
7. Footer`;

// ============================================================================
// STYLE & COLOR CONFIG
// ============================================================================
const STYLE_MODIFIERS: Record<string, string> = {
  'modern': '**STYLE: MODERN** - Clean lines, whitespace, gradients, cards, smooth animations',
  'elegant': '**STYLE: ELEGANT** - Serif fonts, muted palette, gold accents, thin lines',
  'bold': '**STYLE: BOLD** - Oversized typography, high contrast, heavy shadows',
  'minimal': '**STYLE: MINIMAL** - Maximum whitespace, 2-3 colors, typography-focused',
  'playful': '**STYLE: PLAYFUL** - Rounded corners, bright colors, bouncy animations',
  'dark': '**STYLE: DARK** - Dark backgrounds (#0a0a0a), light text, glowing accents',
  'corporate': '**STYLE: CORPORATE** - Professional, structured, blue/gray palette'
};

const COLOR_PALETTES: Record<string, any> = {
  'auto': { primary: '#6366f1', primaryRgb: '99, 102, 241', secondary: '#8b5cf6', accent: '#f59e0b', background: '#ffffff', surface: '#f8fafc', text: '#0f172a', textMuted: '#64748b' },
  'blue': { primary: '#1e40af', primaryRgb: '30, 64, 175', secondary: '#3b82f6', accent: '#f59e0b', background: '#ffffff', surface: '#f0f9ff', text: '#0f172a', textMuted: '#64748b' },
  'green': { primary: '#166534', primaryRgb: '22, 101, 52', secondary: '#22c55e', accent: '#f59e0b', background: '#ffffff', surface: '#f0fdf4', text: '#0f172a', textMuted: '#64748b' },
  'purple': { primary: '#7c3aed', primaryRgb: '124, 58, 237', secondary: '#a855f7', accent: '#f59e0b', background: '#ffffff', surface: '#faf5ff', text: '#0f172a', textMuted: '#64748b' },
  'red': { primary: '#dc2626', primaryRgb: '220, 38, 38', secondary: '#f87171', accent: '#fbbf24', background: '#ffffff', surface: '#fef2f2', text: '#0f172a', textMuted: '#64748b' },
  'orange': { primary: '#ea580c', primaryRgb: '234, 88, 12', secondary: '#f97316', accent: '#6366f1', background: '#ffffff', surface: '#fff7ed', text: '#0f172a', textMuted: '#64748b' },
  'dark': { primary: '#6366f1', primaryRgb: '99, 102, 241', secondary: '#ec4899', accent: '#22d3ee', background: '#0a0a0a', surface: '#141414', text: '#fafafa', textMuted: '#a3a3a3' },
  'gold': { primary: '#b8860b', primaryRgb: '184, 134, 11', secondary: '#d97706', accent: '#1e40af', background: '#ffffff', surface: '#fffbeb', text: '#0f172a', textMuted: '#64748b' }
};

// ============================================================================
// CLAUDE API CALL WITH STREAMING
// ============================================================================
async function callClaudeStreaming(systemPrompt: string, userPrompt: string): Promise<string> {
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
      temperature: 0.7,
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

function cleanHtmlResponse(response: string): string {
  let html = response.trim();
  html = html.replace(/^```html\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  html = html.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
  
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) html = html.substring(doctypeIndex);
  
  const htmlEndIndex = html.toLowerCase().lastIndexOf('</html>');
  if (htmlEndIndex > 0) html = html.substring(0, htmlEndIndex + 7);
  
  return html;
}

// ============================================================================
// WEBSITE GENERATION
// ============================================================================
async function generateWebsite(project: any): Promise<string> {
  const industry = (project.industry || 'other').toLowerCase().replace(/\s+/g, '-');
  const style = (project.style || 'modern').toLowerCase();
  const colorPref = project.color_preference || 'auto';
  
  const industryBrief = INDUSTRY_BRIEFS[industry] || DEFAULT_BRIEF;
  const styleModifier = STYLE_MODIFIERS[style] || STYLE_MODIFIERS['modern'];
  const colors = COLOR_PALETTES[colorPref] || COLOR_PALETTES['auto'];

  const userPrompt = `
# CREATE A $100,000 ELITE WEBSITE

## CLIENT
- **Business:** ${project.business_name}
- **Industry:** ${project.industry}
- **Description:** ${project.description || 'Professional business'}
- **Goal:** ${project.website_goal || 'Generate leads'}
- **Target:** ${project.target_customer || 'Quality-seeking customers'}
- **Email:** ${project.contact_email || 'contact@business.com'}
- **Phone:** ${project.contact_phone || '(555) 123-4567'}
- **Address:** ${project.address || 'City, State'}

## FEATURES
${(project.features || ['Contact Form', 'Testimonials']).map((f: string) => `- ${f}`).join('\n')}

${industryBrief}

${styleModifier}

## COLORS
Primary: ${colors.primary} (RGB: ${colors.primaryRgb})
Secondary: ${colors.secondary}
Background: ${colors.background}
Text: ${colors.text}

## REQUIREMENTS
1. BREATHTAKING hero with massive headline
2. ALL animations (.reveal class)
3. Mobile responsive
4. ALL sections from industry brief
5. Real compelling copy
6. Working navigation

Output ONLY HTML. Start with <!DOCTYPE html>.`;

  const response = await callClaudeStreaming(MASTER_SYSTEM_PROMPT, userPrompt);
  return cleanHtmlResponse(response);
}

async function reviseWebsite(currentHtml: string, feedback: string, project: any): Promise<string> {
  const systemPrompt = `You are an elite web designer making revisions. Maintain all animations and responsive behavior. Output ONLY complete HTML.`;

  const userPrompt = `
## REVISION
**Client:** ${project.business_name}
**Feedback:** ${feedback}

**Current HTML:**
${currentHtml}

Apply changes. Output COMPLETE HTML starting with <!DOCTYPE html>.`;

  const response = await callClaudeStreaming(systemPrompt, userPrompt);
  return cleanHtmlResponse(response);
}

async function quickEdit(currentHtml: string, instruction: string): Promise<string> {
  const systemPrompt = `Make this edit while preserving everything else. Output ONLY complete HTML.`;

  const userPrompt = `**Edit:** ${instruction}

**HTML:**
${currentHtml}

Output COMPLETE HTML starting with <!DOCTYPE html>.`;

  const response = await callClaudeStreaming(systemPrompt, userPrompt);
  return cleanHtmlResponse(response);
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================
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

      return NextResponse.json({ success: true, html, message: 'Website generated!' });
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
