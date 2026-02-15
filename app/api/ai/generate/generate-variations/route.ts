// app/api/ai/generate-variations/route.ts
// Generates 3 website variations (Bold, Elegant, Dynamic) using Claude
// Saves to metadata.variations and sets status to preview_sent

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // 3 parallel Claude calls

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================
// VARIATION STYLE DEFINITIONS
// ============================================

type VariationKey = 'bold' | 'elegant' | 'dynamic';

interface VariationStyle {
  key: VariationKey;
  label: string;
  systemPrompt: string;
  designDirections: string;
}

const VARIATION_STYLES: VariationStyle[] = [
  {
    key: 'bold',
    label: 'Bold & Modern',
    systemPrompt: `You are an elite creative director who designs BOLD, high-impact websites.
Your style: Dark backgrounds, large dramatic typography, high contrast, strong CTAs, confident whitespace.
Think: Apple, Nike, Tesla — commanding, minimal, powerful.`,
    designDirections: `DESIGN DIRECTIONS FOR "BOLD & MODERN":
- Use a DARK hero section (black or very dark navy) with large white text
- Typography: Massive hero headline (clamp 48px-72px), bold weights (700-900)
- Color palette: Dark primary (#0a0a0a or #111827), bright accent for CTAs (electric blue, hot pink, or neon green)
- Full-width sections with dramatic padding (120px vertical)
- Cards with subtle dark backgrounds, slight borders, hover lift animations
- CTA buttons: Solid, bold, high contrast, uppercase lettering
- Navigation: Clean, minimal, logo left, links right, transparent over hero
- Footer: Dark, 4-column, minimal
- Scroll animations: Fade up on intersect, staggered reveals
- Overall vibe: POWERFUL, CONFIDENT, PREMIUM`,
  },
  {
    key: 'elegant',
    label: 'Clean & Elegant',
    systemPrompt: `You are an elite creative director who designs ELEGANT, sophisticated websites.
Your style: Light backgrounds, refined typography, generous whitespace, understated luxury.
Think: Aesop, Mejuri, COS — timeless, refined, quiet luxury.`,
    designDirections: `DESIGN DIRECTIONS FOR "CLEAN & ELEGANT":
- Use a LIGHT hero section (white or warm off-white #faf9f7) with dark text
- Typography: Serif heading font (Playfair Display or similar), clean body (Inter)
- Color palette: Warm neutrals (#faf9f7 bg, #1a1a1a text), subtle gold/bronze accent (#c8a97e)
- Generous whitespace — let the content breathe (100px+ section padding)
- Thin borders (1px), soft shadows, rounded corners (12px)
- CTA buttons: Understated — outlined or subtle fill, lowercase or sentence case
- Navigation: Refined, centered logo option, thin bottom border
- Footer: Light, airy, well-spaced
- Scroll animations: Gentle fade-in, no dramatic movements
- Overall vibe: SOPHISTICATED, TIMELESS, LUXURY`,
  },
  {
    key: 'dynamic',
    label: 'Dynamic & Vibrant',
    systemPrompt: `You are an elite creative director who designs DYNAMIC, eye-catching websites.
Your style: Gradients, vibrant colors, energetic layouts, modern glassmorphism, bold imagery.
Think: Stripe, Linear, Vercel — tech-forward, colorful, energetic.`,
    designDirections: `DESIGN DIRECTIONS FOR "DYNAMIC & VIBRANT":
- Use a GRADIENT hero section (purple-to-blue, pink-to-orange, or similar vibrant gradient)
- Typography: Modern sans-serif (Inter 800), slightly playful, can use gradient text effects
- Color palette: Vibrant gradient primary, white cards, colorful accent elements
- Glassmorphism effects: Frosted glass cards (backdrop-blur, semi-transparent)
- Colorful badges and tags, gradient buttons, icon backgrounds with soft colors
- CTA buttons: Gradient fill, rounded (pill shape), drop shadow
- Navigation: Modern, slight glass effect, floating style
- Animated gradient backgrounds or mesh gradients
- Scroll animations: Slide-in from sides, scale-up on hover, parallax-like effects
- Overall vibe: ENERGETIC, MODERN, TECH-FORWARD`,
  },
];

// ============================================
// INDUSTRY DATA (slimmed for prompt context)
// ============================================

interface IndustryContext {
  category: string;
  topBrands: string[];
  heroImages: string[];
  productImages: string[];
  lifestyleImages: string[];
  mood: string;
}

const INDUSTRY_MAP: Record<string, IndustryContext> = {
  'restaurant': { category: 'restaurant', topBrands: ['Sweetgreen', 'Chipotle', 'Nobu'], mood: 'warm, appetizing', heroImages: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80','https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80','https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80','https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'] },
  'beauty': { category: 'ecommerce', topBrands: ['Glossier', 'Fenty Beauty', 'Drunk Elephant'], mood: 'fresh, glowing', heroImages: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80','https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80','https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80','https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800&q=80'] },
  'fitness': { category: 'service', topBrands: ['Gymshark', 'Peloton', 'Barry\'s'], mood: 'bold, energetic', heroImages: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80','https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80','https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80','https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80'] },
  'home-services': { category: 'service', topBrands: ['Mr. Rooter', 'ServiceMaster', 'Thumbtack'], mood: 'trustworthy, clean', heroImages: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80','https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'] },
  'marine': { category: 'service', topBrands: ['Sea Ray', 'Boston Whaler', 'West Marine'], mood: 'premium, coastal', heroImages: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&q=80','https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=600&q=80','https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80','https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'] },
  'real-estate': { category: 'professional', topBrands: ['Compass', 'Sotheby\'s', 'Keller Williams'], mood: 'premium, trustworthy', heroImages: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80','https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'] },
  'ecommerce': { category: 'ecommerce', topBrands: ['Everlane', 'Allbirds', 'Warby Parker'], mood: 'clean, conversion-focused', heroImages: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80','https://images.unsplash.com/photo-1434389677669-e08b4cda3485?w=600&q=80','https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80','https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80'] },
  'medical': { category: 'professional', topBrands: ['One Medical', 'ZocDoc', 'Mayo Clinic'], mood: 'clean, trustworthy', heroImages: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80','https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80','https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80','https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800&q=80'] },
  'legal': { category: 'professional', topBrands: ['LegalZoom', 'Cravath', 'Skadden'], mood: 'authoritative, refined', heroImages: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80','https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80','https://images.unsplash.com/photo-1521791055366-0d553872125f?w=600&q=80','https://images.unsplash.com/photo-1423592707957-3b212afa6733?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'] },
  'construction': { category: 'service', topBrands: ['Turner Construction', 'Bechtel', 'Skanska'], mood: 'strong, reliable', heroImages: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80','https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80','https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=600&q=80','https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'] },
  'tech': { category: 'saas', topBrands: ['Stripe', 'Linear', 'Vercel'], mood: 'innovative, clean', heroImages: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80','https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80','https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80','https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=800&q=80'] },
  'creative': { category: 'creative', topBrands: ['Awwwards Winners', 'Pentagram', 'Behance Top'], mood: 'artistic, unique', heroImages: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80','https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80','https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&q=80','https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80'] },
  'automotive': { category: 'service', topBrands: ['Carvana', 'CarMax', 'Tesla'], mood: 'sleek, performance', heroImages: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80','https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&q=80','https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80'] },
  'education': { category: 'professional', topBrands: ['Coursera', 'Khan Academy', 'Masterclass'], mood: 'inspiring, approachable', heroImages: ['https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80','https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80','https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80'] },
  'events': { category: 'service', topBrands: ['Eventbrite', 'The Knot', 'Zola'], mood: 'celebratory, elegant', heroImages: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80','https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80','https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80','https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'] },
  'nonprofit': { category: 'professional', topBrands: ['charity: water', 'WWF', 'Doctors Without Borders'], mood: 'compassionate, impactful', heroImages: ['https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80','https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80','https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80','https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80'] },
  'pet-services': { category: 'service', topBrands: ['Rover', 'BarkBox', 'Chewy'], mood: 'friendly, warm', heroImages: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=80'], productImages: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80','https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80','https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80','https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&q=80'], lifestyleImages: ['https://images.unsplash.com/photo-1450778869180-e31f7d395eb2?w=800&q=80'] },
};

const DEFAULT_INDUSTRY: IndustryContext = {
  category: 'service', topBrands: ['Squarespace', 'Wix', 'Webflow'], mood: 'professional, modern',
  heroImages: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80'],
  productImages: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80','https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80','https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80','https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80'],
  lifestyleImages: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80'],
};

function resolveIndustry(raw: string): IndustryContext {
  const key = raw.toLowerCase().replace(/[^a-z-]/g, '').replace(/\s+/g, '-');
  // Direct match
  if (INDUSTRY_MAP[key]) return INDUSTRY_MAP[key];
  // Fuzzy match
  for (const [k, v] of Object.entries(INDUSTRY_MAP)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  // Keyword match
  if (key.includes('food') || key.includes('cafe') || key.includes('bar')) return INDUSTRY_MAP['restaurant'];
  if (key.includes('hair') || key.includes('spa') || key.includes('salon') || key.includes('nail')) return INDUSTRY_MAP['beauty'];
  if (key.includes('gym') || key.includes('yoga') || key.includes('train')) return INDUSTRY_MAP['fitness'];
  if (key.includes('plumb') || key.includes('hvac') || key.includes('clean') || key.includes('landscape') || key.includes('roof')) return INDUSTRY_MAP['home-services'];
  if (key.includes('boat') || key.includes('gelcoat') || key.includes('dock')) return INDUSTRY_MAP['marine'];
  if (key.includes('house') || key.includes('property') || key.includes('realtor')) return INDUSTRY_MAP['real-estate'];
  if (key.includes('shop') || key.includes('store') || key.includes('retail') || key.includes('jewel')) return INDUSTRY_MAP['ecommerce'];
  if (key.includes('doctor') || key.includes('dental') || key.includes('health') || key.includes('clinic')) return INDUSTRY_MAP['medical'];
  if (key.includes('law') || key.includes('attorney')) return INDUSTRY_MAP['legal'];
  if (key.includes('build') || key.includes('contract') || key.includes('renovation')) return INDUSTRY_MAP['construction'];
  if (key.includes('software') || key.includes('app') || key.includes('saas') || key.includes('startup')) return INDUSTRY_MAP['tech'];
  if (key.includes('photo') || key.includes('design') || key.includes('video') || key.includes('film') || key.includes('animation')) return INDUSTRY_MAP['creative'];
  if (key.includes('car') || key.includes('auto') || key.includes('mechanic')) return INDUSTRY_MAP['automotive'];
  return DEFAULT_INDUSTRY;
}

// ============================================
// CLAUDE GENERATION
// ============================================

async function generateVariation(
  style: VariationStyle,
  project: any,
  industry: IndustryContext,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY!;

  const businessName = project.business_name || 'Business';
  const industryName = project.industry || 'Professional Services';
  const description = project.description || project.business_description || `A professional ${industryName} business`;
  const services = project.services || project.primary_services || [];
  const needs = project.metadata?.client_needs;

  const pageList = needs?.pages?.length > 0
    ? `Pages to include sections for: ${needs.pages.join(', ')}`
    : 'Standard single-page website with: hero, about, services, testimonials, contact';

  const featureList = needs?.features?.length > 0
    ? `Features: ${needs.features.join(', ')}`
    : '';

  const userPrompt = `Create a COMPLETE, production-ready website for:

BUSINESS: ${businessName}
INDUSTRY: ${industryName}
DESCRIPTION: ${description}
${services.length > 0 ? `SERVICES: ${services.join(', ')}` : ''}
${pageList}
${featureList}

INDUSTRY CONTEXT:
- Top brands in this space: ${industry.topBrands.join(', ')}
- Mood: ${industry.mood}

${style.designDirections}

IMAGES TO USE (Unsplash, already hotlinked):
- Hero: ${industry.heroImages[0]}
- Section images: ${industry.productImages.join(', ')}
- Lifestyle: ${industry.lifestyleImages[0]}

REQUIREMENTS:
1. Output ONLY complete HTML starting with <!DOCTYPE html>
2. ALL CSS must be inline in a <style> tag — no external stylesheets except Google Fonts
3. Must be fully responsive (mobile-first media queries)
4. Include scroll-reveal animations using IntersectionObserver
5. Include a sticky header/navigation
6. Must feel like a real $5,000+ website, NOT a template
7. Use the Unsplash image URLs provided above — do NOT use placeholder.com
8. Include realistic placeholder copy specific to the business
9. Include a functional mobile hamburger menu
10. Hero section should be at least 90vh
11. Include at least 5 sections
12. All sections should have proper vertical padding (80-120px)
13. Footer with columns, contact info, copyright

Output ONLY the complete HTML. No markdown, no backticks, no explanation.`;

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
      system: style.systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API ${response.status}: ${err}`);
  }

  const data = await response.json();
  let html = data.content[0].text.trim();

  // Clean output
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  const doctypeIdx = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIdx > 0) html = html.substring(doctypeIdx);

  // Inject variation label as data attribute
  html = html.replace('<html', `<html data-variation="${style.key}"`);

  return html;
}

// ============================================
// MAIN HANDLER
// ============================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const debugLog: string[] = [];

  try {
    const { projectId } = await request.json();

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

    debugLog.push(`📋 Project: ${project.business_name} | Industry: ${project.industry || 'none'}`);

    // Resolve industry
    const industry = resolveIndustry(project.industry || '');
    debugLog.push(`🏭 Industry: ${industry.category} | Brands: ${industry.topBrands.join(', ')}`);

    // Generate all 3 variations in parallel
    debugLog.push(`🚀 Generating 3 variations in parallel...`);

    const results = await Promise.allSettled(
      VARIATION_STYLES.map(async (style) => {
        const start = Date.now();
        debugLog.push(`⏳ Starting ${style.key}...`);
        const html = await generateVariation(style, project, industry);
        debugLog.push(`✅ ${style.key} done: ${(html.length / 1024).toFixed(1)}KB in ${Date.now() - start}ms`);
        return { key: style.key, html };
      })
    );

    // Process results
    const variations: Record<string, string> = {};
    let successCount = 0;
    let fallbackHtml: string | null = null;

    for (const result of results) {
      if (result.status === 'fulfilled') {
        variations[result.value.key] = result.value.html;
        successCount++;
        if (!fallbackHtml) fallbackHtml = result.value.html;
      } else {
        debugLog.push(`❌ Variation failed: ${result.reason?.message || 'Unknown error'}`);
      }
    }

    if (successCount === 0) {
      return NextResponse.json({ error: 'All 3 variations failed to generate', debugLog }, { status: 500 });
    }

    // If some failed, duplicate a successful one
    for (const style of VARIATION_STYLES) {
      if (!variations[style.key] && fallbackHtml) {
        variations[style.key] = fallbackHtml;
        debugLog.push(`⚠️ ${style.key} failed — using fallback from successful variation`);
      }
    }

    debugLog.push(`✅ ${successCount}/3 variations generated successfully`);

    // Save to Supabase
    const existingMetadata = project.metadata || {};
    const updatedMetadata = {
      ...existingMetadata,
      variations,
    };

    await supabase
      .from('projects')
      .update({
        metadata: updatedMetadata,
        generated_html: variations.bold || variations.elegant || variations.dynamic,
        status: 'preview_sent',
        generated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    debugLog.push(`💾 Saved to Supabase | Status → preview_sent`);
    debugLog.push(`⏱️ Total: ${Date.now() - startTime}ms`);

    return NextResponse.json({
      success: true,
      variations: {
        bold: !!variations.bold,
        elegant: !!variations.elegant,
        dynamic: !!variations.dynamic,
      },
      sizes: {
        bold: variations.bold ? `${(variations.bold.length / 1024).toFixed(1)}KB` : null,
        elegant: variations.elegant ? `${(variations.elegant.length / 1024).toFixed(1)}KB` : null,
        dynamic: variations.dynamic ? `${(variations.dynamic.length / 1024).toFixed(1)}KB` : null,
      },
      debugLog,
      timing: Date.now() - startTime,
    });

  } catch (error: any) {
    console.error('[Generate Variations] Error:', error);
    return NextResponse.json({
      error: 'Generation failed',
      details: error.message,
      debugLog,
    }, { status: 500 });
  }
}
