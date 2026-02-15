// app/api/generate-multipage/route.ts
// Generate multi-page website based on client's selected variation + needs
// Uses the style of their chosen variation (bold/elegant/dynamic) for consistency

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for multiple pages

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================
// PAGE DEFINITIONS
// ============================================

const PAGE_CONFIGS: Record<string, { name: string; desc: string; sections: string[] }> = {
  'home':           { name: 'Home', desc: 'Hero, overview, trust signals, CTA', sections: ['hero', 'services-preview', 'about-preview', 'testimonials', 'cta'] },
  'about':          { name: 'About Us', desc: 'Story, mission, values, team', sections: ['about-hero', 'story', 'mission-values', 'team', 'cta'] },
  'about-us':       { name: 'About Us', desc: 'Story, mission, values, team', sections: ['about-hero', 'story', 'mission-values', 'team', 'cta'] },
  'services':       { name: 'Services', desc: 'Service cards, process, benefits', sections: ['services-hero', 'services-grid', 'process', 'benefits', 'cta'] },
  'contact':        { name: 'Contact', desc: 'Form, map, hours, info', sections: ['contact-hero', 'contact-form', 'location-info', 'faq-preview'] },
  'contact-us':     { name: 'Contact', desc: 'Form, map, hours, info', sections: ['contact-hero', 'contact-form', 'location-info', 'faq-preview'] },
  'pricing':        { name: 'Pricing', desc: 'Plans, comparison, FAQ', sections: ['pricing-hero', 'pricing-table', 'features-comparison', 'faq', 'cta'] },
  'portfolio':      { name: 'Portfolio', desc: 'Work gallery, case studies', sections: ['portfolio-hero', 'portfolio-grid', 'case-study', 'cta'] },
  'gallery':        { name: 'Gallery', desc: 'Photo gallery, lightbox', sections: ['gallery-hero', 'gallery-grid', 'cta'] },
  'blog':           { name: 'Blog', desc: 'Blog listing, categories', sections: ['blog-hero', 'featured-post', 'posts-grid', 'newsletter'] },
  'faq':            { name: 'FAQ', desc: 'Accordion FAQ, categories', sections: ['faq-hero', 'faq-accordion', 'contact-cta'] },
  'testimonials':   { name: 'Testimonials', desc: 'Reviews, ratings, case studies', sections: ['testimonials-hero', 'reviews-grid', 'stats', 'cta'] },
  'menu':           { name: 'Menu', desc: 'Restaurant menu with categories', sections: ['menu-hero', 'menu-categories', 'specials', 'reservation-cta'] },
  'booking':        { name: 'Booking', desc: 'Appointment scheduling, calendar', sections: ['booking-hero', 'booking-form', 'services-list', 'policies'] },
  'team':           { name: 'Team', desc: 'Team members, bios', sections: ['team-hero', 'team-grid', 'values', 'join-cta'] },
  'reviews':        { name: 'Reviews', desc: 'Customer reviews and ratings', sections: ['reviews-hero', 'reviews-grid', 'stats', 'cta'] },
  'before-after':   { name: 'Before & After', desc: 'Transformation gallery', sections: ['ba-hero', 'ba-gallery', 'process', 'cta'] },
  'locations':      { name: 'Locations', desc: 'Multiple locations, maps', sections: ['locations-hero', 'locations-grid', 'contact-cta'] },
  'careers':        { name: 'Careers', desc: 'Job listings, culture', sections: ['careers-hero', 'culture', 'openings-grid', 'apply-cta'] },
  'shop':           { name: 'Shop', desc: 'Product grid, filters', sections: ['shop-hero', 'product-grid', 'categories', 'newsletter'] },
};

function resolvePageId(raw: string): string {
  const normalized = raw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
  if (PAGE_CONFIGS[normalized]) return normalized;
  // Fuzzy match
  for (const [key] of Object.entries(PAGE_CONFIGS)) {
    if (normalized.includes(key) || key.includes(normalized)) return key;
  }
  // Keyword matching
  if (normalized.includes('about')) return 'about';
  if (normalized.includes('service')) return 'services';
  if (normalized.includes('contact')) return 'contact';
  if (normalized.includes('price') || normalized.includes('pricing')) return 'pricing';
  if (normalized.includes('portfolio') || normalized.includes('work') || normalized.includes('project')) return 'portfolio';
  if (normalized.includes('gallery') || normalized.includes('photo')) return 'gallery';
  if (normalized.includes('blog') || normalized.includes('news') || normalized.includes('article')) return 'blog';
  if (normalized.includes('faq') || normalized.includes('question')) return 'faq';
  if (normalized.includes('testimonial') || normalized.includes('review')) return 'testimonials';
  if (normalized.includes('menu') || normalized.includes('food')) return 'menu';
  if (normalized.includes('book') || normalized.includes('appointment') || normalized.includes('reserv')) return 'booking';
  if (normalized.includes('team') || normalized.includes('staff')) return 'team';
  if (normalized.includes('before') || normalized.includes('after') || normalized.includes('transform')) return 'before-after';
  if (normalized.includes('location') || normalized.includes('branch')) return 'locations';
  if (normalized.includes('career') || normalized.includes('job') || normalized.includes('hiring')) return 'careers';
  if (normalized.includes('shop') || normalized.includes('store') || normalized.includes('product')) return 'shop';
  return normalized; // Return as-is, Claude will figure it out
}

// ============================================
// VARIATION STYLE EXTRACTION
// ============================================

function detectVariationStyle(html: string): 'bold' | 'elegant' | 'dynamic' {
  if (!html) return 'bold';
  const lower = html.toLowerCase();
  if (html.includes('data-variation="elegant"') || lower.includes('playfair') || lower.includes('#faf9f7') || lower.includes('#c8a97e')) return 'elegant';
  if (html.includes('data-variation="dynamic"') || lower.includes('gradient') && lower.includes('backdrop-blur') || lower.includes('glassmorphism')) return 'dynamic';
  return 'bold';
}

function getStyleDirections(style: 'bold' | 'elegant' | 'dynamic'): string {
  const styles = {
    bold: `STYLE: Bold & Modern
- Dark backgrounds (#0a0a0a, #111827), white text, high contrast
- Large dramatic typography (48-72px hero), bold weights (700-900)
- Bright accent CTAs (electric blue or hot pink)
- Full-width sections, dramatic padding (120px)
- Cards with dark backgrounds, hover lift animations
- Uppercase CTA buttons, strong presence`,

    elegant: `STYLE: Clean & Elegant
- Light backgrounds (#faf9f7, white), dark text (#1a1a1a)
- Serif headings (Playfair Display), clean body (Inter)
- Warm neutral palette, subtle gold accent (#c8a97e)
- Generous whitespace (100px+ padding)
- Thin borders, soft shadows, rounded corners
- Understated CTAs, sentence case, refined feel`,

    dynamic: `STYLE: Dynamic & Vibrant
- Gradient hero sections (purple-to-blue or pink-to-orange)
- Modern sans-serif (Inter 800), gradient text effects
- Vibrant colors, glassmorphism cards (backdrop-blur)
- Colorful badges, gradient buttons (pill shape)
- Floating glass navigation
- Animated backgrounds, scale-up hover effects`,
  };
  return styles[style];
}

// ============================================
// NAVIGATION GENERATOR
// ============================================

function generateNav(businessName: string, pages: string[], currentPage: string, style: 'bold' | 'elegant' | 'dynamic'): string {
  const navLinks = pages.map(p => {
    const config = PAGE_CONFIGS[resolvePageId(p)] || { name: p };
    const isActive = resolvePageId(p) === currentPage;
    const pageName = config.name || p;
    const href = resolvePageId(p) === 'home' ? 'index.html' : `${resolvePageId(p)}.html`;
    return `<a href="${href}" class="nav-link${isActive ? ' active' : ''}">${pageName}</a>`;
  }).join('\n              ');

  if (style === 'bold') {
    return `<nav style="position:sticky;top:0;z-index:100;background:#0a0a0a;padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.1)">
    <div style="max-width:1280px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between">
      <a href="index.html" style="color:white;font-size:22px;font-weight:800;text-decoration:none;letter-spacing:-0.5px">${businessName}</a>
      <div style="display:flex;gap:32px;align-items:center">
        ${navLinks.replace(/class="nav-link"/g, 'style="color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px;font-weight:500;transition:color 0.3s"').replace(/class="nav-link active"/g, 'style="color:white;text-decoration:none;font-size:14px;font-weight:600"')}
      </div>
    </div>
  </nav>`;
  } else if (style === 'elegant') {
    return `<nav style="position:sticky;top:0;z-index:100;background:white;padding:24px 0;border-bottom:1px solid #e8e6e1">
    <div style="max-width:1280px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between">
      <a href="index.html" style="color:#1a1a1a;font-family:'Playfair Display',serif;font-size:24px;font-weight:600;text-decoration:none">${businessName}</a>
      <div style="display:flex;gap:36px;align-items:center">
        ${navLinks.replace(/class="nav-link"/g, 'style="color:#5c5c5c;text-decoration:none;font-size:14px;font-weight:400;letter-spacing:0.5px;transition:color 0.3s"').replace(/class="nav-link active"/g, 'style="color:#1a1a1a;text-decoration:none;font-size:14px;font-weight:500;letter-spacing:0.5px"')}
      </div>
    </div>
  </nav>`;
  } else {
    return `<nav style="position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.8);backdrop-filter:blur(20px);padding:16px 0;border-bottom:1px solid rgba(0,0,0,0.05)">
    <div style="max-width:1280px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between">
      <a href="index.html" style="background:linear-gradient(135deg,#7c3aed,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:22px;font-weight:800;text-decoration:none">${businessName}</a>
      <div style="display:flex;gap:32px;align-items:center">
        ${navLinks.replace(/class="nav-link"/g, 'style="color:#52525b;text-decoration:none;font-size:14px;font-weight:500;transition:color 0.3s"').replace(/class="nav-link active"/g, 'style="color:#7c3aed;text-decoration:none;font-size:14px;font-weight:600"')}
      </div>
    </div>
  </nav>`;
  }
}

// ============================================
// GENERATE A SINGLE PAGE
// ============================================

async function generatePage(
  project: any,
  pageId: string,
  style: 'bold' | 'elegant' | 'dynamic',
  allPages: string[],
  referenceHtml: string | null,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY!;
  const config = PAGE_CONFIGS[pageId] || { name: pageId, desc: 'Custom page', sections: [] };
  const businessName = project.business_name || 'Business';
  const industry = project.industry || 'Professional Services';
  const description = project.description || project.business_description || '';
  const needs = project.metadata?.client_needs;
  const features = needs?.features || [];

  // Extract CSS from reference HTML if available
  let referenceCSS = '';
  if (referenceHtml) {
    const styleMatch = referenceHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (styleMatch) referenceCSS = styleMatch[1].substring(0, 3000); // First 3KB of CSS
  }

  const nav = generateNav(businessName, allPages, pageId, style);

  const systemPrompt = `You are an elite web designer creating a ${config.name} page for a multi-page website.
The design MUST match the overall website style perfectly — same colors, fonts, spacing, and vibe.
Output ONLY complete HTML starting with <!DOCTYPE html>. No markdown, no backticks.`;

  const userPrompt = `Create the "${config.name}" page for:

BUSINESS: ${businessName}
INDUSTRY: ${industry}
DESCRIPTION: ${description}
${features.length > 0 ? `FEATURES: ${features.join(', ')}` : ''}

PAGE PURPOSE: ${config.desc}
SECTIONS TO INCLUDE: ${config.sections.join(', ')}

${getStyleDirections(style)}

NAVIGATION TO USE (copy exactly):
${nav}

${referenceCSS ? `REFERENCE CSS (use these same styles/colors/fonts):
${referenceCSS}` : ''}

OTHER PAGES IN THIS SITE: ${allPages.map(p => PAGE_CONFIGS[resolvePageId(p)]?.name || p).join(', ')}
Each nav link should point to: [pagename].html (home = index.html)

REQUIREMENTS:
1. Output ONLY complete HTML starting with <!DOCTYPE html>
2. ALL CSS in a <style> tag — no external stylesheets except Google Fonts
3. Fully responsive (mobile-first media queries)
4. Include scroll-reveal animations (IntersectionObserver)
5. Must feel like the SAME website as the home page — consistent design system
6. Use real Unsplash images relevant to ${industry}
7. Include realistic placeholder copy specific to this ${industry} business
8. Include mobile hamburger menu
9. Include a matching footer with columns, links, and copyright
10. Sections should have proper padding (80-120px)

Output ONLY the complete HTML.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 12000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API ${response.status}: ${err.substring(0, 200)}`);
  }

  const data = await response.json();
  let html = data.content[0].text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  const di = html.toLowerCase().indexOf('<!doctype');
  if (di > 0) html = html.substring(di);

  return html;
}

// ============================================
// MAIN HANDLER
// ============================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const debugLog: string[] = [];

  try {
    const { projectId, pages: requestedPages } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    // Load project
    const { data: project, error: dbError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (dbError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    debugLog.push(`📋 Project: ${project.business_name}`);

    // Determine pages to generate
    let pages: string[] = requestedPages || project.metadata?.client_needs?.pages || ['Home'];
    // Ensure Home is first
    const homeVariants = ['home', 'Home', 'Homepage', 'homepage'];
    if (!pages.some(p => homeVariants.includes(p))) {
      pages = ['Home', ...pages];
    }
    debugLog.push(`📄 Pages to generate: ${pages.join(', ')}`);

    // Determine style from selected variation or reference HTML
    const selectedVariation = project.metadata?.selected_variation;
    let style: 'bold' | 'elegant' | 'dynamic' = 'bold';
    if (selectedVariation && ['bold', 'elegant', 'dynamic'].includes(selectedVariation)) {
      style = selectedVariation as any;
    } else if (project.generated_html) {
      style = detectVariationStyle(project.generated_html);
    }
    debugLog.push(`🎨 Style: ${style} (from ${selectedVariation ? 'selected variation' : 'detection'})`);

    // Get reference HTML (the selected variation)
    let referenceHtml: string | null = null;
    if (project.metadata?.variations?.[style]) {
      referenceHtml = project.metadata.variations[style];
    } else if (project.generated_html) {
      referenceHtml = project.generated_html;
    }

    // Update status
    await supabase.from('projects').update({ status: 'building' }).eq('id', projectId);

    // Generate pages — 2 at a time (parallel but throttled)
    const generatedPages: Record<string, string> = {};
    const resolvedPages = pages.map(p => resolvePageId(p));
    const batchSize = 2;

    for (let i = 0; i < resolvedPages.length; i += batchSize) {
      const batch = resolvedPages.slice(i, i + batchSize);
      debugLog.push(`⏳ Generating batch ${Math.floor(i / batchSize) + 1}: ${batch.join(', ')}`);

      const results = await Promise.allSettled(
        batch.map(pageId => generatePage(project, pageId, style, pages, referenceHtml))
      );

      results.forEach((result, idx) => {
        const pageId = batch[idx];
        if (result.status === 'fulfilled') {
          generatedPages[pageId] = result.value;
          debugLog.push(`✅ ${pageId}: ${(result.value.length / 1024).toFixed(1)}KB`);
          // Use first generated page as reference for consistency
          if (!referenceHtml) referenceHtml = result.value;
        } else {
          debugLog.push(`❌ ${pageId} failed: ${result.reason?.message || 'Unknown'}`);
        }
      });
    }

    if (Object.keys(generatedPages).length === 0) {
      await supabase.from('projects').update({ status: 'paid' }).eq('id', projectId);
      return NextResponse.json({ error: 'All pages failed to generate', debugLog }, { status: 500 });
    }

    // Initialize page_status for review
    const pageStatus: Record<string, string> = {};
    Object.keys(generatedPages).forEach(p => { pageStatus[p] = 'ready'; });

    // Save to Supabase
    const existingMetadata = project.metadata || {};
    await supabase
      .from('projects')
      .update({
        generated_pages: generatedPages,
        generated_html: generatedPages.home || Object.values(generatedPages)[0],
        status: 'review',
        metadata: {
          ...existingMetadata,
          page_status: pageStatus,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    debugLog.push(`💾 Saved ${Object.keys(generatedPages).length} pages | Status → review`);
    debugLog.push(`⏱️ Total: ${Date.now() - startTime}ms`);

    return NextResponse.json({
      success: true,
      pages: Object.keys(generatedPages),
      sizes: Object.fromEntries(
        Object.entries(generatedPages).map(([k, v]) => [k, `${(v.length / 1024).toFixed(1)}KB`])
      ),
      style,
      debugLog,
      timing: Date.now() - startTime,
    });

  } catch (error: any) {
    console.error('[Multi-page] Error:', error);
    return NextResponse.json({ error: error.message, debugLog }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    availablePages: Object.entries(PAGE_CONFIGS).map(([id, config]) => ({
      id, name: config.name, description: config.desc, sections: config.sections,
    })),
  });
}
