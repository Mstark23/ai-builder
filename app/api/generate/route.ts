// app/api/ai/generate/route.ts
// VERKTORLABS - AI Website Generation with REAL Forensic Extraction
//
// THIS IS THE COMPETITIVE MOAT:
// Every other AI builder asks Claude to IMAGINE what Gymshark looks like.
// We actually GO TO gymshark.com, download the HTML+CSS, and extract
// every single design decision from the REAL source code.
//
// FLOW:
// 1. Load project from Supabase (has king_url or king_name from questionnaire)
// 2. Resolve King → get the actual website URL
// 3. FETCH the live website HTML + external CSS stylesheets
// 4. Send real source code to Claude for forensic extraction
// 5. Merge extracted DNA with user's content/preferences
// 6. Generate website using EXACT measured specs (not assumptions)
// 7. Validate output against extracted specs
// 8. Save to Supabase

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 300;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =============================================================================
// KINGS REGISTRY — Maps King names to their REAL website URLs
// When the questionnaire says "Gymshark", we know to fetch https://gymshark.com
// =============================================================================

const KINGS_REGISTRY: Record<string, { url: string; industry: string; category: string }> = {
  // Fashion & Apparel
  'gymshark':       { url: 'https://www.gymshark.com', industry: 'fitness-apparel', category: 'fashion' },
  'alo yoga':       { url: 'https://www.aloyoga.com', industry: 'activewear', category: 'fashion' },
  'skims':          { url: 'https://skims.com', industry: 'fashion', category: 'fashion' },
  'everlane':       { url: 'https://www.everlane.com', industry: 'fashion', category: 'fashion' },
  'aritzia':        { url: 'https://www.aritzia.com', industry: 'fashion', category: 'fashion' },
  'allbirds':       { url: 'https://www.allbirds.com', industry: 'footwear', category: 'fashion' },
  'fashion nova':   { url: 'https://www.fashionnova.com', industry: 'fashion', category: 'fashion' },
  'princess polly': { url: 'https://www.princesspolly.com', industry: 'fashion', category: 'fashion' },
  'oh polly':       { url: 'https://www.ohpolly.com', industry: 'fashion', category: 'fashion' },
  'revolve':        { url: 'https://www.revolve.com', industry: 'fashion', category: 'fashion' },

  // Jewelry & Accessories
  'mejuri':         { url: 'https://www.mejuri.com', industry: 'jewelry', category: 'jewelry' },
  'ana luisa':      { url: 'https://www.analuisa.com', industry: 'jewelry', category: 'jewelry' },
  'missoma':        { url: 'https://www.missoma.com', industry: 'jewelry', category: 'jewelry' },
  'gorjana':        { url: 'https://www.gorjana.com', industry: 'jewelry', category: 'jewelry' },
  'vitaly':         { url: 'https://www.vitalydesign.com', industry: 'jewelry', category: 'jewelry' },
  'evryjewels':     { url: 'https://evryjewels.com', industry: 'jewelry', category: 'jewelry' },
  'stone and strand': { url: 'https://www.stoneandstrand.com', industry: 'jewelry', category: 'jewelry' },

  // Beauty & Skincare
  'glossier':       { url: 'https://www.glossier.com', industry: 'beauty', category: 'beauty' },
  'the ordinary':   { url: 'https://theordinary.com', industry: 'skincare', category: 'beauty' },
  'drunk elephant':  { url: 'https://www.drunkelephant.com', industry: 'skincare', category: 'beauty' },
  'fenty beauty':   { url: 'https://fentybeauty.com', industry: 'beauty', category: 'beauty' },
  'rare beauty':    { url: 'https://www.rarebeauty.com', industry: 'beauty', category: 'beauty' },
  'tatcha':         { url: 'https://www.tatcha.com', industry: 'skincare', category: 'beauty' },
  'cerave':         { url: 'https://www.cerave.com', industry: 'skincare', category: 'beauty' },
  'kylie cosmetics': { url: 'https://kyliecosmetics.com', industry: 'beauty', category: 'beauty' },

  // Home & Lifestyle
  'cb2':            { url: 'https://www.cb2.com', industry: 'furniture', category: 'home' },
  'article':        { url: 'https://www.article.com', industry: 'furniture', category: 'home' },
  'brooklinen':     { url: 'https://www.brooklinen.com', industry: 'bedding', category: 'home' },
  'parachute':      { url: 'https://www.parachutehome.com', industry: 'home', category: 'home' },
  'floyd':          { url: 'https://floydhome.com', industry: 'furniture', category: 'home' },

  // Tech & SaaS
  'notion':         { url: 'https://www.notion.so', industry: 'saas', category: 'tech' },
  'linear':         { url: 'https://linear.app', industry: 'saas', category: 'tech' },
  'vercel':         { url: 'https://vercel.com', industry: 'saas', category: 'tech' },
  'stripe':         { url: 'https://stripe.com', industry: 'fintech', category: 'tech' },
  'figma':          { url: 'https://www.figma.com', industry: 'saas', category: 'tech' },
  'framer':         { url: 'https://www.framer.com', industry: 'saas', category: 'tech' },

  // Food & Beverage
  'magic spoon':    { url: 'https://www.magicspoon.com', industry: 'food', category: 'food' },
  'liquid death':   { url: 'https://liquiddeath.com', industry: 'beverage', category: 'food' },
  'olipop':         { url: 'https://drinkolipop.com', industry: 'beverage', category: 'food' },
  'graza':          { url: 'https://www.grfraza.co', industry: 'food', category: 'food' },

  // Fitness & Wellness
  'peloton':        { url: 'https://www.onepeloton.com', industry: 'fitness', category: 'fitness' },
  'whoop':          { url: 'https://www.whoop.com', industry: 'fitness-tech', category: 'fitness' },
  'lululemon':      { url: 'https://shop.lululemon.com', industry: 'activewear', category: 'fitness' },
  'athletic greens': { url: 'https://www.drinkag1.com', industry: 'supplements', category: 'fitness' },

  // Pet
  'bark':           { url: 'https://www.bark.co', industry: 'pet', category: 'pet' },
  'chewy':          { url: 'https://www.chewy.com', industry: 'pet', category: 'pet' },
};

// Industry → King mapping (for auto-matching when no specific King is selected)
const INDUSTRY_KING_DEFAULTS: Record<string, string> = {
  'jewelry': 'mejuri',
  'fashion': 'gymshark',
  'activewear': 'alo yoga',
  'beauty': 'glossier',
  'skincare': 'the ordinary',
  'fitness': 'gymshark',
  'fitness-apparel': 'gymshark',
  'supplements': 'athletic greens',
  'food': 'magic spoon',
  'beverage': 'liquid death',
  'furniture': 'cb2',
  'home': 'brooklinen',
  'saas': 'linear',
  'tech': 'vercel',
  'fintech': 'stripe',
  'pet': 'bark',
  'ecommerce': 'gymshark',
  'clothing': 'everlane',
  'footwear': 'allbirds',
  'sports-outdoors': 'gymshark',
  'sports': 'gymshark',
  'fitness-gym': 'gymshark',
  'fashion-clothing': 'gymshark',
  'beauty-cosmetics': 'glossier',
  'home-furniture': 'cb2',
  'food-beverage-dtc': 'magic spoon',
  'pet-products': 'bark',
  'kids-baby': 'primary',
  'electronics-gadgets': 'apple',
  'spa-beauty': 'glossier',
  'athletic': 'gymshark',
  'gym': 'gymshark',
  'sportswear': 'gymshark',
};

// =============================================================================
// RESOLVE KING — Find the actual URL to fetch
// =============================================================================

function resolveKing(
  kingName?: string,
  kingUrl?: string,
  industry?: string,
  referenceWebsite?: string
): { name: string; url: string; source: string } | null {

  // Priority 1: Direct URL provided (user pasted a URL in questionnaire)
  if (kingUrl && kingUrl.startsWith('http')) {
    const name = kingName || new URL(kingUrl).hostname.replace('www.', '').split('.')[0];
    return { name, url: kingUrl, source: 'direct-url' };
  }

  // Priority 2: Reference website from questionnaire
  if (referenceWebsite && referenceWebsite.startsWith('http')) {
    const name = kingName || new URL(referenceWebsite).hostname.replace('www.', '').split('.')[0];
    return { name, url: referenceWebsite, source: 'reference-website' };
  }

  // Priority 3: King name from registry
  if (kingName) {
    const normalized = kingName.toLowerCase().trim();
    const registered = KINGS_REGISTRY[normalized];
    if (registered) {
      return { name: kingName, url: registered.url, source: 'registry' };
    }

    // Fuzzy match: check if any registry key contains the king name or vice versa
    for (const [key, data] of Object.entries(KINGS_REGISTRY)) {
      if (key.includes(normalized) || normalized.includes(key)) {
        return { name: key, url: data.url, source: 'registry-fuzzy' };
      }
    }
  }

  // Priority 4: Match by industry
  if (industry) {
    const normalizedIndustry = industry.toLowerCase().trim();

    // Direct match
    const defaultKing = INDUSTRY_KING_DEFAULTS[normalizedIndustry];
    if (defaultKing && KINGS_REGISTRY[defaultKing]) {
      return { name: defaultKing, url: KINGS_REGISTRY[defaultKing].url, source: 'industry-match' };
    }

    // Fuzzy industry match
    for (const [ind, kingKey] of Object.entries(INDUSTRY_KING_DEFAULTS)) {
      if (normalizedIndustry.includes(ind) || ind.includes(normalizedIndustry)) {
        const king = KINGS_REGISTRY[kingKey];
        if (king) {
          return { name: kingKey, url: king.url, source: 'industry-fuzzy' };
        }
      }
    }

    // Last resort: search KINGS_REGISTRY by industry field
    for (const [key, data] of Object.entries(KINGS_REGISTRY)) {
      if (data.industry.includes(normalizedIndustry) || normalizedIndustry.includes(data.industry)) {
        return { name: key, url: data.url, source: 'registry-industry' };
      }
    }
  }

  return null;
}

// =============================================================================
// MERGE USER PREFERENCES WITH EXTRACTED KING DNA
// =============================================================================

function mergeUserPreferences(kingProfile: any, project: any): any {
  const merged = JSON.parse(JSON.stringify(kingProfile)); // deep clone

  console.log('\n🔀 Merging user preferences with King DNA...');

  // OVERRIDE: User's colors replace King's colors
  if (project.primary_color || project.secondary_color) {
    merged.colors = merged.colors || {};
    if (project.primary_color) {
      merged.colors.primary = project.primary_color;
      console.log(`   ✅ Primary color → ${project.primary_color}`);
    }
    if (project.secondary_color) {
      merged.colors.secondary = project.secondary_color;
      console.log(`   ✅ Secondary color → ${project.secondary_color}`);
    }
  }

  // OVERRIDE: Navigation links
  if (project.navigation_links && project.navigation_links.length > 0) {
    merged.navigation = merged.navigation || {};
    merged.navigation.items = project.navigation_links;
    console.log(`   ✅ Navigation → ${project.navigation_links.join(', ')}`);
  }

  // OVERRIDE: Product grid columns
  if (project.grid_columns) {
    merged.pageStructure = merged.pageStructure || {};
    merged.pageStructure.gridColumns = project.grid_columns;
    console.log(`   ✅ Grid columns → ${project.grid_columns}`);
  }

  // OVERRIDE: Product button text
  if (project.button_text) {
    merged.designSystem = merged.designSystem || {};
    merged.designSystem.buttonStyles = merged.designSystem.buttonStyles || {};
    merged.designSystem.buttonStyles.primaryText = project.button_text;
    console.log(`   ✅ Button text → "${project.button_text}"`);
  }

  // OVERRIDE: Header style
  if (project.header_style) {
    merged.navigation = merged.navigation || {};
    if (project.header_style.includes('Black') || project.header_style.includes('Dark')) {
      merged.navigation.backgroundColor = '#000000';
      merged.navigation.textColor = '#FFFFFF';
    } else if (project.header_style.includes('White') || project.header_style.includes('Light')) {
      merged.navigation.backgroundColor = '#FFFFFF';
      merged.navigation.textColor = '#000000';
    } else if (project.header_style.includes('Transparent')) {
      merged.navigation.backgroundColor = 'transparent';
      merged.navigation.textColor = '#FFFFFF';
    }
    console.log(`   ✅ Header style → ${project.header_style}`);
  }

  // ADD: User's selected tactics
  merged.userTactics = [];

  if (project.bundle_pricing && project.bundle_text) {
    merged.userTactics.push({
      name: 'Bundle Pricing',
      type: 'pricing',
      text: project.bundle_text,
      placement: project.bundle_placement || 'hero',
    });
    console.log(`   ✅ Bundle pricing → "${project.bundle_text}"`);
  }

  if (project.scarcity_tactics && project.scarcity_tactics.length > 0) {
    project.scarcity_tactics.forEach((t: string) => {
      if (t !== 'None') merged.userTactics.push({ name: t, type: 'scarcity' });
    });
    console.log(`   ✅ Scarcity tactics → ${project.scarcity_tactics.length}`);
  }

  if (project.social_proof_types && project.social_proof_types.length > 0) {
    project.social_proof_types.forEach((t: string) => {
      if (t !== 'None') merged.userTactics.push({ name: t, type: 'social-proof' });
    });
    console.log(`   ✅ Social proof → ${project.social_proof_types.length}`);
  }

  return merged;
}

// =============================================================================
// BUILD CUSTOMER QUESTIONNAIRE FOR KING GENERATOR
// =============================================================================

function buildCustomerFromProject(project: any) {
  return {
    businessName: project.business_name || project.brand_name || 'My Business',
    industry: project.industry || 'Professional Services',
    description: project.description || project.business_description || '',
    targetAudience: project.target_audience || project.ideal_customer || '',
    websiteGoal: project.website_goal || 'Generate leads and build trust',
    uniqueSellingPoints: project.unique_selling_points || project.usps || project.primary_services || [],
    services: project.services || project.primary_services || [],
    features: project.features || ['Contact Form', 'Testimonials', 'Services'],
    contactInfo: {
      email: project.contact_email || 'hello@company.com',
      phone: project.contact_phone || '',
      address: project.address || '',
    },
    socialMedia: project.social_media || {},
    testimonials: project.testimonials || [],
    stats: project.stats || [],
    pricing: project.pricing || [],
    faqs: project.faqs || [],
    customContent: project.custom_content || {},
  };
}

// =============================================================================
// VALIDATION — Check generated HTML against King DNA
// =============================================================================

function validateOutput(html: string, kingProfile: any, project: any): {
  score: number;
  passed: boolean;
  checks: string[];
} {
  const checks: string[] = [];
  let score = 0;
  const total = 7;

  // 1. Has proper HTML structure
  if (html.includes('<!DOCTYPE') || html.includes('<!doctype')) {
    score++;
    checks.push('✅ Valid HTML document');
  } else {
    checks.push('❌ Missing DOCTYPE');
  }

  // 2. Uses King's primary color
  const primaryColor = kingProfile.colors?.primary;
  if (primaryColor && html.toLowerCase().includes(primaryColor.toLowerCase())) {
    score++;
    checks.push(`✅ Primary color ${primaryColor} found`);
  } else if (primaryColor) {
    checks.push(`❌ Primary color ${primaryColor} missing`);
  } else {
    score++; // no color to check
  }

  // 3. Uses King's fonts
  const headingFont = kingProfile.typography?.headingFont?.family;
  if (headingFont && html.includes(headingFont)) {
    score++;
    checks.push(`✅ Heading font "${headingFont}" found`);
  } else if (headingFont) {
    checks.push(`❌ Heading font "${headingFont}" missing`);
  } else {
    score++;
  }

  // 4. Has navigation
  if (html.match(/<nav/i) || html.match(/<header/i)) {
    score++;
    checks.push('✅ Navigation present');
  } else {
    checks.push('❌ No navigation found');
  }

  // 5. Has hero section
  if (html.match(/hero|banner|jumbotron/i)) {
    score++;
    checks.push('✅ Hero section present');
  } else {
    checks.push('❌ No hero section found');
  }

  // 6. Has footer
  if (html.match(/<footer/i)) {
    score++;
    checks.push('✅ Footer present');
  } else {
    checks.push('❌ No footer found');
  }

  // 7. Business name appears
  const businessName = project.business_name || project.brand_name;
  if (businessName && html.includes(businessName)) {
    score++;
    checks.push(`✅ Business name "${businessName}" found`);
  } else if (businessName) {
    checks.push(`❌ Business name "${businessName}" missing`);
  } else {
    score++;
  }

  const percentage = Math.round((score / total) * 100);
  console.log(`\n📊 Validation: ${score}/${total} (${percentage}%)`);
  checks.forEach(c => console.log(`   ${c}`));

  return {
    score: percentage,
    passed: percentage >= 70,
    checks,
  };
}


// =============================================================================
// DEFAULT KING DNA PROFILES — Used when live extraction fails
// =============================================================================

function getDefaultKingProfile(industry: string, kingName: string = 'Default'): any {
  const ind = (industry || '').toLowerCase();
  
  const colorSchemes: Record<string, any> = {
    athletic: {
      primary: '#0a0a0a', secondary: '#1a1a2e', accent: '#e63946',
      primaryRgb: '10,10,10',
      background: { main: '#ffffff', secondary: '#f8f9fa', dark: '#0a0a0a', card: '#ffffff' },
      text: { primary: '#0a0a0a', secondary: '#4a5568', muted: '#9ca3af', inverse: '#ffffff' },
      border: { light: '#e5e7eb' },
    },
    jewelry: {
      primary: '#1a1a1a', secondary: '#c9a227', accent: '#b76e79',
      primaryRgb: '26,26,26',
      background: { main: '#faf9f7', secondary: '#f5f3ef', dark: '#1a1a1a', card: '#ffffff' },
      text: { primary: '#1a1a1a', secondary: '#5c5c5c', muted: '#9ca3af', inverse: '#ffffff' },
      border: { light: '#e8e5e0' },
    },
    beauty: {
      primary: '#2d2d2d', secondary: '#d4a373', accent: '#e8b4b8',
      primaryRgb: '45,45,45',
      background: { main: '#fffaf5', secondary: '#fef3e7', dark: '#2d2d2d', card: '#ffffff' },
      text: { primary: '#2d2d2d', secondary: '#6b5b4f', muted: '#a89890', inverse: '#ffffff' },
      border: { light: '#ede4dc' },
    },
    default: {
      primary: '#111827', secondary: '#4f46e5', accent: '#6366f1',
      primaryRgb: '17,24,39',
      background: { main: '#ffffff', secondary: '#f9fafb', dark: '#111827', card: '#ffffff' },
      text: { primary: '#111827', secondary: '#4b5563', muted: '#9ca3af', inverse: '#ffffff' },
      border: { light: '#e5e7eb' },
    },
  };

  let scheme = 'default';
  if (ind.match(/gym|athletic|fitness|sport|activewear/)) scheme = 'athletic';
  else if (ind.match(/jewel/)) scheme = 'jewelry';
  else if (ind.match(/beauty|skincare|cosmetic/)) scheme = 'beauty';

  const colors = colorSchemes[scheme];

  return {
    meta: { kingName, url: '', industry, extractedAt: new Date().toISOString(), pagesAnalyzed: [], overallVibe: 'Premium e-commerce' },
    navigation: {
      type: 'sticky', height: '72px', backgroundColor: '#ffffff', backgroundOnScroll: '#ffffff',
      logoPlacement: 'left', logoStyle: 'text-only',
      menuItems: [
        { label: 'Shop', hasDropdown: true }, { label: 'Collections', hasDropdown: true },
        { label: 'New Arrivals', hasDropdown: false }, { label: 'Sale', hasDropdown: false },
      ],
      menuAlignment: 'center',
      ctaButton: { text: 'Shop Now', style: 'filled', color: colors.primary, borderRadius: '4px' },
      hasSearch: true, hasCartIcon: true, mobileMenuType: 'hamburger', backdropBlur: true,
      borderBottom: '1px solid ' + colors.border.light, padding: '0 40px',
      fontFamily: 'Inter', fontSize: '14px', fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase',
    },
    hero: {
      layout: 'full-width-image-overlay', height: '85vh',
      headline: {
        text: '', formula: 'Benefit + Emotional Trigger',
        fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '800', fontFamily: 'inherit',
        lineHeight: '1.05', letterSpacing: '-0.02em', textTransform: 'none',
        color: '#ffffff', maxWidth: '800px', hasGradient: false, gradientColors: '',
      },
      subheadline: { text: '', fontSize: '18px', fontWeight: '400', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', maxWidth: '600px' },
      ctaButtons: [
        { text: 'SHOP NOW', backgroundColor: colors.primary, textColor: '#ffffff', padding: '16px 40px', borderRadius: '4px', fontSize: '14px', fontWeight: '600' },
      ],
    },
    colors,
    typography: {
      headingFont: {
        family: scheme === 'jewelry' ? 'Cormorant Garamond' : 'Inter',
        googleFontsUrl: scheme === 'jewelry'
          ? 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap'
          : 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
      },
      bodyFont: {
        family: scheme === 'jewelry' ? 'Crimson Pro' : 'Inter',
        googleFontsUrl: scheme === 'jewelry'
          ? 'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600&display=swap' : '',
      },
      scale: {
        h1: { size: 'clamp(40px, 6vw, 72px)', weight: '800', lineHeight: '1.05', letterSpacing: '-0.02em', textTransform: 'none' },
        h2: { size: 'clamp(28px, 4vw, 42px)', weight: '700', lineHeight: '1.15', letterSpacing: '-0.01em' },
        h3: { size: '20px', weight: '600' },
        body: { size: '16px', lineHeight: '1.6' },
      },
    },
    designSystem: {
      containerMaxWidth: '1280px',
      sectionPadding: { desktop: '80px 0', mobile: '48px 0' },
      borderRadius: { buttons: '4px', cards: '12px', small: '6px', large: '16px' },
      shadows: { cardDefault: '0 1px 3px rgba(0,0,0,0.08)', cardHover: '0 12px 32px rgba(0,0,0,0.12)', sm: '0 1px 2px rgba(0,0,0,0.05)' },
      buttonStyles: {
        primary: { backgroundColor: colors.primary, textColor: '#ffffff', borderRadius: '4px', padding: '14px 32px', fontWeight: '600', textTransform: 'uppercase', hoverTransform: 'translateY(-1px)' },
        secondary: { borderRadius: '4px' },
      },
      cardStyles: { border: '1px solid ' + colors.border.light, hoverTransform: 'translateY(-4px)' },
      inputStyles: { border: '1px solid ' + colors.border.light, borderRadius: '4px', padding: '12px 16px', fontSize: '14px' },
    },
    animations: {
      scrollReveal: { type: 'fade-up', duration: '0.6s', distance: '20px', stagger: '0.1s' },
      transition: { default: 'all 0.3s ease' },
    },
    footer: { backgroundColor: colors.background.dark, textColor: 'rgba(255,255,255,0.7)' },
    sections: [
      { type: 'hero', name: 'Hero Banner' }, { type: 'product-grid', name: 'Products' },
      { type: 'collection', name: 'Collections' }, { type: 'reviews', name: 'Reviews' },
    ],
  };
}

// =============================================================================
// LEGACY FALLBACK — When no King can be resolved
// =============================================================================

const LEGACY_SYSTEM_PROMPT = `You are an elite creative director. Companies pay you $100,000+ per website.

DESIGN RULES:
1. TYPOGRAPHY: Hero headlines clamp(48px, 7vw, 80px), letter-spacing -0.02em
2. COLOR: Maximum 3 colors + neutrals. Dark themes feel premium.
3. WHITESPACE: Section padding 100px-150px vertical.
4. MOTION: transition 0.3s cubic-bezier(0.4, 0, 0.2, 1). Scroll reveals. Hover states.
5. COPY: Headlines create emotion. Benefits over features. Social proof everywhere.

OUTPUT: Return ONLY complete HTML. Start with <!DOCTYPE html>. End with </html>.
ALL CSS in <style>, ALL JS in <script>. No markdown. No explanations.`;

async function generateLegacy(project: any): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

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
      system: LEGACY_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Create a stunning website for:
BUSINESS: ${project.business_name || 'Business'} (${project.industry || 'Professional Services'})
DESCRIPTION: ${project.description || 'A professional business'}
EMAIL: ${project.contact_email || 'hello@company.com'}
PHONE: ${project.contact_phone || ''}
FEATURES: ${(project.features || ['Contact Form', 'Testimonials']).join(', ')}

Use real Unsplash images, add scroll animations, make it mobile responsive.
Output ONLY the complete HTML starting with <!DOCTYPE html>`,
      }],
    }),
  });

  if (!response.ok) throw new Error(`Claude API: ${response.status}`);

  const data = await response.json();
  let html = data.content[0].text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  const di = html.toLowerCase().indexOf('<!doctype');
  if (di > 0) html = html.substring(di);
  return html;
}

async function legacyRevise(currentHtml: string, editRequest: string): Promise<string> {
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
      system: 'You are an elite web designer. Apply changes while maintaining premium quality. Output ONLY complete HTML.',
      messages: [{
        role: 'user',
        content: `Apply this change: ${editRequest}\n\nCurrent HTML:\n${currentHtml.substring(0, 20000)}\n\nReturn COMPLETE updated HTML starting with <!DOCTYPE html>.`,
      }],
    }),
  });

  if (!response.ok) throw new Error('Edit failed');

  const data = await response.json();
  let html = data.content[0].text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  return html;
}

// =============================================================================
// MAIN API HANDLER
// =============================================================================

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

    // Load project from Supabase
    const { data: project, error: dbError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (dbError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // ═════════════════════════════════════════════════════════════
    // GENERATE
    // ═════════════════════════════════════════════════════════════
    if (action === 'generate') {
      let html: string;
      let generationMode: string;
      let kingResolution: any = null;
      let extractedProfile: any = null;
      let validation: any = null;

      // STEP 1: Resolve which King to extract from
      kingResolution = resolveKing(
        project.king_name || body.kingName,
        project.king_url || body.kingUrl,
        project.industry,
        project.reference_website || body.referenceWebsite
      );

      if (kingResolution) {
        // ═══════════════════════════════════════════════════════
        // KING DNA MODE — The Real Deal
        // ═══════════════════════════════════════════════════════
        console.log('\n' + '═'.repeat(60));
        console.log(`👑 KING DNA MODE`);
        console.log(`   King: ${kingResolution.name}`);
        console.log(`   URL: ${kingResolution.url}`);
        console.log(`   Source: ${kingResolution.source}`);
        console.log('═'.repeat(60));

        try {
          // Dynamic imports to avoid Next.js route export issues
          const forensicExtractor = await import('@/lib/ai/forensic-extractor');
          const kingGenerator = await import('@/lib/ai/king-generator');

          // STEP 2: Check for cached profile (< 30 days old)
          let kingProfile = null;
          const { data: cached } = await supabase
            .from('king_profiles')
            .select('profile_data, extracted_at')
            .eq('king_url', kingResolution.url)
            .eq('is_active', true)
            .single();

          if (cached?.profile_data) {
            const age = Date.now() - new Date(cached.extracted_at).getTime();
            const thirtyDays = 30 * 24 * 60 * 60 * 1000;
            if (age < thirtyDays) {
              kingProfile = cached.profile_data;
              console.log(`📦 Using cached profile (${Math.round(age / 86400000)}d old)`);
            }
          }

          // STEP 3: If no cache, do LIVE forensic extraction
          if (!kingProfile) {
            console.log(`\n🔬 LIVE FORENSIC EXTRACTION: ${kingResolution.url}`);
            console.log(`   This fetches the REAL website HTML + CSS`);
            console.log(`   No guessing. No assumptions. Real source code.`);

            const extractionResult = await forensicExtractor.extractKingProfile({
              kingUrl: kingResolution.url,
              kingName: kingResolution.name,
              industry: project.industry || 'general',
            });

            if (!extractionResult.success || !extractionResult.profile) {
              throw new Error(`Extraction failed: ${extractionResult.error}`);
            }

            kingProfile = extractionResult.profile;
            extractedProfile = extractionResult;

            console.log(`✅ Extracted in ${extractionResult.extractionTime}ms`);
            console.log(`   Tokens used: ${extractionResult.tokensUsed}`);

            // Validate extraction completeness
            const profileValidation = forensicExtractor.validateProfile(kingProfile);
            console.log(`   Completeness: ${(profileValidation.completeness * 100).toFixed(0)}%`);

            // Cache the extracted profile for future use
            await supabase
              .from('king_profiles')
              .upsert({
                king_name: kingResolution.name,
                king_url: kingResolution.url,
                industry: project.industry || 'general',
                profile_data: kingProfile,
                extracted_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                extraction_version: '2.0',
                is_active: true,
                completeness_score: profileValidation.completeness,
              }, { onConflict: 'king_url' });

            console.log(`💾 Profile cached for future generations`);
          }

          // STEP 4: Merge user preferences with extracted King DNA
          const mergedProfile = mergeUserPreferences(kingProfile, project);

          // STEP 5: Generate website from REAL King DNA + user content
          console.log(`\n🚀 Generating website from ${kingResolution.name}'s REAL DNA...`);
          const customer = buildCustomerFromProject(project);
          html = await kingGenerator.generateFromKingDNA(mergedProfile, customer);
          generationMode = 'king-dna';

          // STEP 6: Validate output
          validation = validateOutput(html, mergedProfile, project);

          if (!validation.passed) {
            console.log(`\n🔄 Validation failed (${validation.score}%). Retrying...`);
            html = await kingGenerator.generateFromKingDNA(mergedProfile, customer);
            validation = validateOutput(html, mergedProfile, project);
          }

          console.log(`\n🎉 Generation complete!`);
          console.log(`   Mode: King DNA (${kingResolution.name})`);
          console.log(`   Validation: ${validation.score}%`);

        } catch (kingError) {
          console.error(`\n❌ King DNA extraction failed:`, kingError);
          console.log(`   Using DEFAULT King profile + deterministic builder...`);
          
          try {
            const kingGenerator = await import('@/lib/ai/king-generator');
            const defaultProfile = getDefaultKingProfile(project.industry || 'fashion', kingResolution?.name || 'Default');
            const customer = buildCustomerFromProject(project);
            html = await kingGenerator.generateFromKingDNA(defaultProfile, customer);
            generationMode = 'king-dna-default';
            validation = validateOutput(html, defaultProfile, project);
            console.log(`✅ Generated with default King profile`);
          } catch (defaultError) {
            console.error(`❌ Default profile also failed:`, defaultError);
            generationMode = 'legacy-fallback';
            html = await generateLegacy(project);
            validation = validateOutput(html, {}, project);
          }
        }
      } else {
        // ═══════════════════════════════════════════════════════
        // NO KING MATCHED — Use default profile + deterministic builder
        // ═══════════════════════════════════════════════════════
        console.log('\n⚠️ No King matched. Using DEFAULT profile.');
        console.log(`   Industry: ${project.industry || 'none'}`);
        
        try {
          const kingGenerator = await import('@/lib/ai/king-generator');
          const defaultProfile = getDefaultKingProfile(project.industry || 'fashion', 'Industry Default');
          const customer = buildCustomerFromProject(project);
          html = await kingGenerator.generateFromKingDNA(defaultProfile, customer);
          generationMode = 'king-dna-default';
          validation = validateOutput(html, defaultProfile, project);
          console.log('✅ Generated with default profile');
        } catch (defaultError) {
          console.error('❌ Default failed:', defaultError);
          generationMode = 'legacy';
          html = await generateLegacy(project);
          validation = validateOutput(html, {}, project);
        }
      }

      // Save to Supabase
      await supabase
        .from('projects')
        .update({
          generated_html: html,
          status: 'PREVIEW_READY',
          generation_mode: generationMode,
          generated_at: new Date().toISOString(),
          ...(kingResolution && { king_url: kingResolution.url, king_name: kingResolution.name }),
        })
        .eq('id', projectId);

      return NextResponse.json({
        success: true,
        html,
        mode: generationMode,
        king: kingResolution ? {
          name: kingResolution.name,
          url: kingResolution.url,
          source: kingResolution.source,
        } : null,
        validation: validation ? {
          score: validation.score,
          passed: validation.passed,
          checks: validation.checks,
        } : null,
        extraction: extractedProfile ? {
          time: extractedProfile.extractionTime,
          tokens: extractedProfile.tokensUsed,
        } : null,
      });
    }

    // ═════════════════════════════════════════════════════════════
    // QUICK-EDIT / REVISE
    // ═════════════════════════════════════════════════════════════
    if (action === 'quick-edit' || action === 'revise') {
      const { instruction, feedback, currentHtml } = body;
      const editRequest = instruction || feedback;
      const htmlToEdit = currentHtml || project.generated_html || '';

      let html: string;
      const kingUrl = project.king_url;

      if (kingUrl) {
        try {
          const kingGenerator = await import('@/lib/ai/king-generator');

          const { data: cached } = await supabase
            .from('king_profiles')
            .select('profile_data')
            .eq('king_url', kingUrl)
            .eq('is_active', true)
            .single();

          if (cached?.profile_data) {
            const customer = buildCustomerFromProject(project);
            html = await kingGenerator.reviseFromKingDNA(
              cached.profile_data, htmlToEdit, editRequest, customer
            );
          } else {
            html = await legacyRevise(htmlToEdit, editRequest);
          }
        } catch {
          html = await legacyRevise(htmlToEdit, editRequest);
        }
      } else {
        html = await legacyRevise(htmlToEdit, editRequest);
      }

      await supabase
        .from('projects')
        .update({
          generated_html: html,
          ...(action === 'revise' && { revision_count: (project.revision_count || 0) + 1 }),
        })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Generate] Error: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
