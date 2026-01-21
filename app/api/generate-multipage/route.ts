// app/api/generate-multipage/route.ts
// Generate full multi-page websites

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 300;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =============================================================================
// PAGE TYPES & CONFIGURATIONS
// =============================================================================

interface PageConfig {
  id: string;
  name: string;
  description: string;
  sections: string[];
  requiredFields: string[];
  icon: string;
}

const PAGE_CONFIGS: Record<string, PageConfig> = {
  home: {
    id: 'home',
    name: 'Home',
    description: 'Main landing page with hero, services overview, and CTA',
    sections: ['hero', 'services-preview', 'about-preview', 'testimonials', 'cta'],
    requiredFields: ['business_name', 'industry', 'description'],
    icon: '🏠',
  },
  about: {
    id: 'about',
    name: 'About Us',
    description: 'Company story, mission, values, and team',
    sections: ['about-hero', 'story', 'mission-values', 'team', 'cta'],
    requiredFields: ['business_name', 'description'],
    icon: '📖',
  },
  services: {
    id: 'services',
    name: 'Services',
    description: 'Detailed services/products with features and benefits',
    sections: ['services-hero', 'services-grid', 'process', 'pricing-preview', 'cta'],
    requiredFields: ['business_name', 'primary_services'],
    icon: '⚡',
  },
  contact: {
    id: 'contact',
    name: 'Contact',
    description: 'Contact form, location, hours, and map',
    sections: ['contact-hero', 'contact-form', 'location-info', 'faq-preview'],
    requiredFields: ['business_name', 'contact_email'],
    icon: '✉️',
  },
  pricing: {
    id: 'pricing',
    name: 'Pricing',
    description: 'Pricing plans, features comparison, and FAQ',
    sections: ['pricing-hero', 'pricing-table', 'features-comparison', 'faq', 'cta'],
    requiredFields: ['business_name'],
    icon: '💰',
  },
  portfolio: {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Work samples, case studies, and gallery',
    sections: ['portfolio-hero', 'portfolio-grid', 'case-study-preview', 'cta'],
    requiredFields: ['business_name', 'industry'],
    icon: '🎨',
  },
  blog: {
    id: 'blog',
    name: 'Blog',
    description: 'Blog listing page template',
    sections: ['blog-hero', 'featured-post', 'posts-grid', 'categories', 'newsletter'],
    requiredFields: ['business_name'],
    icon: '📝',
  },
  faq: {
    id: 'faq',
    name: 'FAQ',
    description: 'Frequently asked questions page',
    sections: ['faq-hero', 'faq-categories', 'faq-accordion', 'contact-cta'],
    requiredFields: ['business_name', 'industry'],
    icon: '❓',
  },
};

// Plan limits
const PLAN_PAGE_LIMITS: Record<string, number> = {
  starter: 1,        // Landing page only
  professional: 5,   // Home + About + Services + Contact + 1 more
  enterprise: 10,    // Unlimited (practically)
};

// =============================================================================
// DESIGN DIRECTIONS
// =============================================================================

const DESIGN_DIRECTIONS: Record<string, {
  name: string;
  fonts: { display: string; body: string; import: string };
  colors: Record<string, string>;
  characteristics: string;
}> = {
  luxury_minimal: {
    name: "Luxury Minimal",
    fonts: {
      display: "Cormorant Garamond",
      body: "Crimson Pro",
      import: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Crimson+Pro:wght@400;500;600&display=swap"
    },
    colors: {
      primary: "#1a1a1a", primaryRgb: "26, 26, 26",
      secondary: "#c9a227", secondaryRgb: "201, 162, 39",
      accent: "#8b7355",
      bgPrimary: "#faf9f7", bgSecondary: "#f5f3ef",
      textPrimary: "#1a1a1a", textSecondary: "#5c5c5c",
      border: "#e8e6e1"
    },
    characteristics: "Lots of whitespace, subtle animations, serif typography, muted earth tones"
  },
  bold_modern: {
    name: "Bold Modern",
    fonts: {
      display: "Space Grotesk",
      body: "DM Sans",
      import: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
    },
    colors: {
      primary: "#6366f1", primaryRgb: "99, 102, 241",
      secondary: "#8b5cf6", secondaryRgb: "139, 92, 246",
      accent: "#22d3ee",
      bgPrimary: "#ffffff", bgSecondary: "#f8fafc",
      textPrimary: "#0f172a", textSecondary: "#475569",
      border: "#e2e8f0"
    },
    characteristics: "Strong geometric typography, gradient accents, card-based layouts"
  },
  warm_organic: {
    name: "Warm Organic",
    fonts: {
      display: "Fraunces",
      body: "Source Serif Pro",
      import: "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Source+Serif+Pro:wght@400;600&display=swap"
    },
    colors: {
      primary: "#2d5016", primaryRgb: "45, 80, 22",
      secondary: "#b45309", secondaryRgb: "180, 83, 9",
      accent: "#dc2626",
      bgPrimary: "#fffbeb", bgSecondary: "#fef3c7",
      textPrimary: "#1c1917", textSecondary: "#57534e",
      border: "#e7e5e4"
    },
    characteristics: "Rounded corners, warm earth palette, friendly approachable vibe"
  },
  dark_premium: {
    name: "Dark Premium",
    fonts: {
      display: "Bebas Neue",
      body: "Barlow",
      import: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap"
    },
    colors: {
      primary: "#ffffff", primaryRgb: "255, 255, 255",
      secondary: "#a855f7", secondaryRgb: "168, 85, 247",
      accent: "#06b6d4",
      bgPrimary: "#09090b", bgSecondary: "#18181b",
      textPrimary: "#fafafa", textSecondary: "#a1a1aa",
      border: "rgba(255,255,255,0.1)"
    },
    characteristics: "Dark theme, glowing effects, gradient borders, glassmorphism"
  },
  editorial_classic: {
    name: "Editorial Classic",
    fonts: {
      display: "Playfair Display",
      body: "Source Sans Pro",
      import: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap"
    },
    colors: {
      primary: "#1e3a5f", primaryRgb: "30, 58, 95",
      secondary: "#b8860b", secondaryRgb: "184, 134, 11",
      accent: "#166534",
      bgPrimary: "#ffffff", bgSecondary: "#f8f6f3",
      textPrimary: "#1e293b", textSecondary: "#64748b",
      border: "#e2e8f0"
    },
    characteristics: "Classic typography, structured grid, professional trustworthy feel"
  },
  vibrant_energy: {
    name: "Vibrant Energy",
    fonts: {
      display: "Syne",
      body: "Outfit",
      import: "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap"
    },
    colors: {
      primary: "#7c3aed", primaryRgb: "124, 58, 237",
      secondary: "#ec4899", secondaryRgb: "236, 72, 153",
      accent: "#14b8a6",
      bgPrimary: "#fafafa", bgSecondary: "#f3e8ff",
      textPrimary: "#18181b", textSecondary: "#52525b",
      border: "#e4e4e7"
    },
    characteristics: "Bold gradients, playful animations, colorful accents"
  }
};

// =============================================================================
// HELPER: Call Claude
// =============================================================================

async function callClaude(systemPrompt: string, userMessage: string, maxTokens: number = 8000): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }
  return content.text.trim();
}

// =============================================================================
// SHARED CSS GENERATOR
// =============================================================================

function generateSharedCSS(direction: typeof DESIGN_DIRECTIONS[string]): string {
  return `
@import url('${direction.fonts.import}');

:root {
  --primary: ${direction.colors.primary};
  --primary-rgb: ${direction.colors.primaryRgb};
  --secondary: ${direction.colors.secondary};
  --secondary-rgb: ${direction.colors.secondaryRgb};
  --accent: ${direction.colors.accent};
  --bg-primary: ${direction.colors.bgPrimary};
  --bg-secondary: ${direction.colors.bgSecondary};
  --text-primary: ${direction.colors.textPrimary};
  --text-secondary: ${direction.colors.textSecondary};
  --border: ${direction.colors.border};
  --font-display: '${direction.fonts.display}', serif;
  --font-body: '${direction.fonts.body}', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { 
  font-family: var(--font-body); 
  background: var(--bg-primary); 
  color: var(--text-primary);
  line-height: 1.6;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
section { padding: 100px 0; }

/* Typography */
h1, h2, h3, h4, h5, h6 { font-family: var(--font-display); font-weight: 700; line-height: 1.2; }
h1 { font-size: clamp(40px, 6vw, 64px); }
h2 { font-size: clamp(32px, 4vw, 48px); }
h3 { font-size: clamp(24px, 3vw, 32px); }
p { color: var(--text-secondary); }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 14px 28px; font-weight: 600; border-radius: 10px;
  text-decoration: none; transition: all 0.3s ease; cursor: pointer;
  font-family: var(--font-body); font-size: 15px; border: none;
}
.btn-primary {
  background: var(--primary); color: white;
  box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4); }
.btn-secondary {
  background: transparent; color: var(--text-primary);
  border: 2px solid var(--border);
}
.btn-secondary:hover { border-color: var(--primary); color: var(--primary); }

/* Cards */
.card {
  background: var(--bg-secondary); border-radius: 16px; padding: 32px;
  border: 1px solid var(--border); transition: all 0.3s ease;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }

/* Section Headers */
.section-badge {
  display: inline-block; padding: 6px 14px;
  background: rgba(var(--primary-rgb), 0.1); color: var(--primary);
  border-radius: 50px; font-size: 13px; font-weight: 600;
  margin-bottom: 16px;
}
.section-title { margin-bottom: 16px; }
.section-subtitle { font-size: 18px; max-width: 600px; margin-bottom: 48px; }

/* Navigation */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  padding: 16px 0; transition: all 0.3s ease;
}
nav.scrolled {
  background: rgba(var(--bg-primary), 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0,0,0,0.08);
}
.nav-container {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
  display: flex; align-items: center; justify-content: space-between;
}
.nav-logo { font-family: var(--font-display); font-size: 24px; font-weight: 700; text-decoration: none; color: var(--text-primary); }
.nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
.nav-links a { text-decoration: none; color: var(--text-secondary); font-weight: 500; transition: color 0.3s; }
.nav-links a:hover, .nav-links a.active { color: var(--primary); }

/* Footer */
footer { background: var(--bg-secondary); padding: 80px 0 40px; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
.footer-logo { font-family: var(--font-display); font-size: 24px; font-weight: 700; margin-bottom: 16px; }
.footer-links { list-style: none; }
.footer-links li { margin-bottom: 12px; }
.footer-links a { color: var(--text-secondary); text-decoration: none; transition: color 0.3s; }
.footer-links a:hover { color: var(--primary); }
.footer-bottom { padding-top: 32px; border-top: 1px solid var(--border); text-align: center; color: var(--text-secondary); font-size: 14px; }

/* Animations */
.reveal { opacity: 0; transform: translateY(30px); transition: all 0.6s ease; }
.reveal.active { opacity: 1; transform: translateY(0); }

/* Responsive */
@media (max-width: 968px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .nav-links { display: none; }
}
@media (max-width: 640px) {
  section { padding: 60px 0; }
  .footer-grid { grid-template-columns: 1fr; }
}
`;
}

// =============================================================================
// SHARED JS GENERATOR
// =============================================================================

function generateSharedJS(): string {
  return `
document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
  
  // Nav scroll
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
  
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  
  // Counter animation
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));
});
`;
}

// =============================================================================
// NAVIGATION GENERATOR
// =============================================================================

function generateNavigation(project: any, pages: string[], currentPage: string): string {
  const navLinks = pages.map(pageId => {
    const config = PAGE_CONFIGS[pageId];
    const isActive = pageId === currentPage;
    const href = pageId === 'home' ? 'index.html' : `${pageId}.html`;
    return `<li><a href="${href}" class="${isActive ? 'active' : ''}">${config?.name || pageId}</a></li>`;
  }).join('\n              ');

  return `
  <nav>
    <div class="nav-container">
      <a href="index.html" class="nav-logo">${project.business_name}</a>
      <ul class="nav-links">
        ${navLinks}
        <li><a href="contact.html" class="btn btn-primary">Get in Touch</a></li>
      </ul>
    </div>
  </nav>`;
}

// =============================================================================
// FOOTER GENERATOR
// =============================================================================

function generateFooter(project: any, pages: string[]): string {
  const quickLinks = pages.slice(0, 4).map(pageId => {
    const config = PAGE_CONFIGS[pageId];
    const href = pageId === 'home' ? 'index.html' : `${pageId}.html`;
    return `<li><a href="${href}">${config?.name || pageId}</a></li>`;
  }).join('\n            ');

  return `
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-logo">${project.business_name}</div>
          <p style="margin-bottom: 24px; max-width: 300px;">${project.description?.substring(0, 150) || 'Your trusted partner for quality services.'}</p>
        </div>
        <div>
          <h4 style="margin-bottom: 20px; font-size: 16px;">Quick Links</h4>
          <ul class="footer-links">
            ${quickLinks}
          </ul>
        </div>
        <div>
          <h4 style="margin-bottom: 20px; font-size: 16px;">Services</h4>
          <ul class="footer-links">
            ${(project.primary_services || ['Service 1', 'Service 2', 'Service 3']).slice(0, 4).map((s: string) => `<li><a href="services.html">${s}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div>
          <h4 style="margin-bottom: 20px; font-size: 16px;">Contact</h4>
          <ul class="footer-links">
            <li>${project.contact_email || 'hello@example.com'}</li>
            <li>${project.contact_phone || '(555) 123-4567'}</li>
            <li>${project.address || ''}</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${project.business_name}. All rights reserved.</p>
      </div>
    </div>
  </footer>`;
}

// =============================================================================
// PAGE-SPECIFIC PROMPTS
// =============================================================================

function getPagePrompt(pageId: string, project: any, direction: typeof DESIGN_DIRECTIONS[string], pages: string[]): string {
  const nav = generateNavigation(project, pages, pageId);
  const footer = generateFooter(project, pages);
  
  const baseContext = `
## BUSINESS CONTEXT
Name: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description || 'A quality business'}
Target Customer: ${project.target_customer || 'Not specified'}
Unique Value: ${project.unique_value || 'Not specified'}
Primary Services: ${project.primary_services?.join(', ') || 'Various services'}
Brand Voice: ${project.brand_voice || 'professional'}
CTA: ${project.call_to_action || 'Get Started'}

## CONTACT INFO
Email: ${project.contact_email || 'hello@example.com'}
Phone: ${project.contact_phone || '(555) 123-4567'}
Address: ${project.address || ''}

## DESIGN: ${direction.name}
${direction.characteristics}
`;

  const pagePrompts: Record<string, string> = {
    home: `
${baseContext}

## PAGE: HOME (Landing Page)

Create the main landing page with these sections:
1. HERO - Powerful headline, subheadline, dual CTAs, stats, hero image
2. SERVICES PREVIEW - 3-4 service cards with "View All Services" link
3. ABOUT PREVIEW - Brief company intro with "Learn More" link
4. TESTIMONIALS - 3 customer testimonials
5. CTA SECTION - Final call-to-action before footer

Make it impactful - this is the first page visitors see.
`,

    about: `
${baseContext}

## PAGE: ABOUT US

Create an about page with these sections:
1. ABOUT HERO - "About Us" headline with brief intro
2. OUR STORY - Company history/founding story (2-3 paragraphs)
3. MISSION & VALUES - Mission statement + 3-4 core values with icons
4. TEAM - 3-4 team member cards (use https://i.pravatar.cc/200?img=X for photos)
5. CTA - "Ready to work with us?" section

Focus on building trust and showing the human side.
`,

    services: `
${baseContext}

## PAGE: SERVICES

Create a services page with these sections:
1. SERVICES HERO - "Our Services" headline
2. SERVICES GRID - 4-6 detailed service cards, each with:
   - Icon
   - Service name
   - Description (2-3 sentences)
   - Key benefits (3 bullet points)
   - "Learn More" or pricing indicator
3. PROCESS - "How We Work" - 3-4 step process
4. PRICING PREVIEW - Brief mention of pricing with link to contact
5. CTA - "Ready to get started?" section

Make each service sound valuable and differentiated.
`,

    contact: `
${baseContext}

## PAGE: CONTACT

Create a contact page with these sections:
1. CONTACT HERO - "Get in Touch" headline
2. CONTACT GRID (2 columns):
   - LEFT: Contact form (Name, Email, Phone, Service Interest dropdown, Message)
   - RIGHT: Contact info cards (Email, Phone, Address, Business Hours)
3. MAP PLACEHOLDER - Styled div for future map embed
4. FAQ PREVIEW - 3-4 common questions with answers

Make it easy to reach out. Form should look professional.
`,

    pricing: `
${baseContext}

## PAGE: PRICING

Create a pricing page with these sections:
1. PRICING HERO - "Simple, Transparent Pricing" headline
2. PRICING CARDS - 3 tiers:
   - Basic/Starter
   - Professional (highlighted as popular)
   - Enterprise/Premium
   Each with: price, features list, CTA button
3. FEATURES COMPARISON - Table comparing all plans
4. FAQ - 4-5 pricing-related questions
5. CTA - "Not sure which plan?" with contact link

Make the professional plan look like the best value.
`,

    portfolio: `
${baseContext}

## PAGE: PORTFOLIO

Create a portfolio page with these sections:
1. PORTFOLIO HERO - "Our Work" headline
2. FILTER TABS - Category filters (All, Category1, Category2, etc.)
3. PORTFOLIO GRID - 6-9 project cards with:
   - Image (use relevant Unsplash images)
   - Project title
   - Category tag
   - Hover overlay with "View Project"
4. CASE STUDY PREVIEW - Featured project with more detail
5. CTA - "Have a project in mind?" section

Make the work look impressive and professional.
`,

    blog: `
${baseContext}

## PAGE: BLOG

Create a blog listing page with these sections:
1. BLOG HERO - "Insights & Resources" headline
2. FEATURED POST - Large featured article card
3. POSTS GRID - 6 blog post cards with:
   - Image placeholder
   - Category tag
   - Title
   - Excerpt (2 lines)
   - Date and read time
4. CATEGORIES SIDEBAR - List of blog categories
5. NEWSLETTER - Email signup section

Create realistic placeholder content for a ${project.industry} business.
`,

    faq: `
${baseContext}

## PAGE: FAQ

Create an FAQ page with these sections:
1. FAQ HERO - "Frequently Asked Questions" headline
2. FAQ CATEGORIES - 3-4 category tabs
3. FAQ ACCORDION - 8-10 questions organized by category:
   - About our services
   - Pricing & payments
   - Process & timeline
   - Support & guarantees
4. STILL HAVE QUESTIONS - Contact CTA section

Write realistic FAQs for a ${project.industry} business.
`,
  };

  return pagePrompts[pageId] || pagePrompts.home;
}

// =============================================================================
// SINGLE PAGE GENERATOR
// =============================================================================

async function generateSinglePage(
  project: any,
  pageId: string,
  direction: typeof DESIGN_DIRECTIONS[string],
  pages: string[],
  sharedCSS: string
): Promise<string> {
  const nav = generateNavigation(project, pages, pageId);
  const footer = generateFooter(project, pages);
  const pagePrompt = getPagePrompt(pageId, project, direction, pages);
  
  const systemPrompt = `You are an elite frontend developer creating a professional multi-page website.
Generate ONLY the HTML content between <body> tags (not including nav and footer - those are provided).
Use the CSS classes and variables defined in the shared stylesheet.
Add class="reveal" to sections for scroll animation.
Output clean, semantic HTML only - no explanations.`;

  const userPrompt = `${pagePrompt}

## NAVIGATION (already created, for reference):
${nav}

## FOOTER (already created, for reference):
${footer}

Generate the page content (everything between nav and footer).
Use existing CSS classes: .container, .section-badge, .section-title, .btn, .btn-primary, .card, etc.
Add class="reveal" to each section.
DO NOT include <!DOCTYPE>, <html>, <head>, <body>, <nav>, or <footer> tags.
Output ONLY the main content sections.`;

  const content = await callClaude(systemPrompt, userPrompt, 6000);
  
  // Clean up content
  let cleanContent = content
    .replace(/^```html?\n?/i, '')
    .replace(/\n?```$/i, '')
    .trim();

  // Build full HTML page
  const fullPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${PAGE_CONFIGS[pageId]?.name || 'Page'} | ${project.business_name}</title>
  <style>${sharedCSS}</style>
</head>
<body>
  ${nav}
  
  <main>
    ${cleanContent}
  </main>
  
  ${footer}
  
  <script>${generateSharedJS()}</script>
</body>
</html>`;

  return fullPage;
}

// =============================================================================
// MAIN: Generate Multi-Page Website
// =============================================================================

async function generateMultiPageWebsite(project: any, requestedPages: string[]): Promise<Record<string, string>> {
  const directionKey = project.design_direction || 'bold_modern';
  const direction = DESIGN_DIRECTIONS[directionKey] || DESIGN_DIRECTIONS.bold_modern;
  
  // Always include home
  const pages = ['home', ...requestedPages.filter(p => p !== 'home')];
  
  // Generate shared CSS
  const sharedCSS = generateSharedCSS(direction);
  
  // Generate each page
  const generatedPages: Record<string, string> = {};
  
  for (const pageId of pages) {
    console.log(`📄 Generating ${pageId} page...`);
    try {
      const html = await generateSinglePage(project, pageId, direction, pages, sharedCSS);
      generatedPages[pageId] = html;
    } catch (error) {
      console.error(`Error generating ${pageId}:`, error);
      // Continue with other pages
    }
  }
  
  return generatedPages;
}

// =============================================================================
// API HANDLERS
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, pages } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Fetch project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check plan limits
    const plan = project.plan || 'starter';
    const maxPages = PLAN_PAGE_LIMITS[plan] || 1;
    const requestedPages = pages || ['home'];
    
    if (requestedPages.length > maxPages) {
      return NextResponse.json({ 
        error: `Your ${plan} plan allows ${maxPages} page(s). Upgrade to generate more.`,
        maxPages,
        requestedPages: requestedPages.length
      }, { status: 403 });
    }

    // Update status
    await supabase
      .from('projects')
      .update({ status: 'GENERATING' })
      .eq('id', projectId);

    console.log(`🚀 Generating ${requestedPages.length} pages for ${project.business_name}...`);

    // Generate pages
    const generatedPages = await generateMultiPageWebsite(project, requestedPages);

    // Save to database
    await supabase
      .from('projects')
      .update({ 
        generated_html: generatedPages.home, // Keep home as primary
        generated_pages: generatedPages,     // Store all pages
        status: 'PREVIEW_READY'
      })
      .eq('id', projectId);

    console.log(`✅ Generated ${Object.keys(generatedPages).length} pages successfully`);

    return NextResponse.json({
      success: true,
      pages: Object.keys(generatedPages),
      message: `Generated ${Object.keys(generatedPages).length} pages successfully`
    });

  } catch (error: any) {
    console.error('❌ Multi-page generation error:', error);
    
    return NextResponse.json(
      { error: 'Generation failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    availablePages: Object.entries(PAGE_CONFIGS).map(([id, config]) => ({
      id,
      name: config.name,
      description: config.description,
      icon: config.icon,
      sections: config.sections,
    })),
    planLimits: PLAN_PAGE_LIMITS,
  });
}
