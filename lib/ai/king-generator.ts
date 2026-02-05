// /lib/ai/king-generator.ts
// VERKTORLABS - King DNA Website Generator v4
//
// THE INSIGHT v1-v3 MISSED:
// Telling Claude "build an e-commerce site" or "only write CSS" doesn't work.
// Claude ALWAYS rewrites the HTML into a generic centered-text landing page.
//
// v4 SOLUTION: Build the ENTIRE e-commerce HTML+CSS in TypeScript.
// Use King DNA tokens directly as CSS values. Zero ambiguity.
// Claude is ONLY called for copywriting (headlines, descriptions).
// The page structure is 100% deterministic.

import type { KingForensicProfile, CustomerQuestionnaire } from './king-forensic-profile';

// =============================================================================
// SITE TYPE DETECTION
// =============================================================================

function detectSiteType(profile: KingForensicProfile):
  'ecommerce' | 'saas' | 'agency' | 'portfolio' | 'restaurant' | 'service' | 'generic' {

  const industry = (profile.meta.industry || '').toLowerCase();
  const hasCart = profile.navigation.hasCartIcon;
  const navLabels = profile.navigation.menuItems.map((m: any) => m.label.toLowerCase()).join(' ');
  const sectionTypes = profile.sections.map((s: any) => s.type.toLowerCase()).join(' ');
  const sectionNames = profile.sections.map((s: any) => s.name.toLowerCase()).join(' ');

  if (hasCart ||
      navLabels.match(/shop|collection|product|sale|new arrival|men|women|accessories/) ||
      sectionTypes.match(/product|catalog|collection/) ||
      sectionNames.match(/product|shop|collection|bestseller|new arrival/) ||
      industry.match(/fashion|jewelry|beauty|skincare|clothing|activewear|footwear|pet|food|beverage|supplement|home|furniture|bedding/)) {
    return 'ecommerce';
  }
  if (navLabels.match(/pricing|docs|documentation|api|developer/) ||
      sectionTypes.match(/pricing|feature|integration/) ||
      industry.match(/saas|tech|software|fintech/)) return 'saas';
  if (navLabels.match(/menu|reservation|order|dine/) ||
      industry.match(/restaurant|food service|cafe|bar/)) return 'restaurant';
  if (navLabels.match(/work|case stud|portfolio|client/) ||
      sectionTypes.match(/portfolio|case.study|client/)) return 'agency';
  if (navLabels.match(/service|appointment|book|consult/) ||
      industry.match(/salon|spa|dental|medical|legal|accounting/)) return 'service';
  return 'generic';
}

// =============================================================================
// COPY GENERATOR — The ONLY thing Claude does
// =============================================================================

interface GeneratedCopy {
  heroTag: string;
  heroHeadline: string;
  heroSub: string;
  products: { name: string; price: string; }[];
  collections: string[];
  reviewQuotes: string[];
  newsletterHeadline: string;
  aboutBlurb: string;
}

async function generateCopy(
  profile: KingForensicProfile,
  customer: CustomerQuestionnaire
): Promise<GeneratedCopy> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Fallback copy if no API key
    return getDefaultCopy(customer);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: `You are a conversion copywriter for ${customer.industry} e-commerce brands. Output ONLY valid JSON, no markdown, no explanation.`,
        messages: [{
          role: 'user',
          content: `Generate e-commerce copy for "${customer.businessName}" (${customer.industry}).
Description: ${customer.description || 'Premium quality products'}
Target: ${customer.targetAudience || 'style-conscious consumers'}

Return this EXACT JSON structure:
{
  "heroTag": "short 2-3 word category tag",
  "heroHeadline": "bold 4-6 word headline",
  "heroSub": "one compelling sentence about the brand",
  "products": [
    {"name": "Product Name 1", "price": "39.99"},
    {"name": "Product Name 2", "price": "44.99"},
    {"name": "Product Name 3", "price": "54.99"},
    {"name": "Product Name 4", "price": "64.99"},
    {"name": "Product Name 5", "price": "29.99"},
    {"name": "Product Name 6", "price": "49.99"},
    {"name": "Product Name 7", "price": "34.99"},
    {"name": "Product Name 8", "price": "74.99"}
  ],
  "collections": ["Collection 1", "Collection 2", "Collection 3", "Collection 4"],
  "reviewQuotes": [
    "Short customer review 1",
    "Short customer review 2",
    "Short customer review 3"
  ],
  "newsletterHeadline": "Get X% Off Your First Order",
  "aboutBlurb": "One sentence brand description for footer"
}

Make product names specific to ${customer.industry}. Prices should be realistic.
JSON ONLY — no backticks, no markdown, no explanation.`
        }],
      }),
    });

    if (!response.ok) return getDefaultCopy(customer);

    const data = await response.json();
    let text = data.content[0].text.trim();
    // Strip any markdown wrapper
    text = text.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '');
    const parsed = JSON.parse(text);
    return parsed as GeneratedCopy;
  } catch (e) {
    console.error('[KingGenerator v4] Copy generation failed, using defaults:', e);
    return getDefaultCopy(customer);
  }
}

function getDefaultCopy(customer: CustomerQuestionnaire): GeneratedCopy {
  const brand = customer.businessName;
  const ind = (customer.industry || '').toLowerCase();

  if (ind.match(/gym|athletic|activewear|fitness|sport/)) {
    return {
      heroTag: 'Performance Wear',
      heroHeadline: 'Engineered for Your Best',
      heroSub: `${brand} delivers premium athletic wear built for those who push limits.`,
      products: [
        { name: `${brand} Performance Tee`, price: '39.99' },
        { name: `${brand} Flex Shorts`, price: '44.99' },
        { name: `${brand} Pro Leggings`, price: '54.99' },
        { name: `${brand} Essential Hoodie`, price: '64.99' },
        { name: `${brand} Training Tank`, price: '29.99' },
        { name: `${brand} Joggers`, price: '49.99' },
        { name: `${brand} Sports Bra`, price: '34.99' },
        { name: `${brand} Seamless Set`, price: '74.99' },
      ],
      collections: ['New Arrivals', "Men's Training", "Women's Training", 'Accessories'],
      reviewQuotes: [
        'Best gym wear I\'ve ever owned. Fits perfectly and breathes amazingly.',
        'The quality blew me away. Feels premium without the premium price.',
        'Ordered three more after trying one. That\'s how good these are.',
      ],
      newsletterHeadline: 'Get 15% Off Your First Order',
      aboutBlurb: customer.description || `${brand} — premium athletic wear for serious athletes.`,
    };
  }

  if (ind.match(/jewel/)) {
    return {
      heroTag: 'Fine Jewelry',
      heroHeadline: 'Timeless Pieces, Modern Edge',
      heroSub: `${brand} creates jewelry that tells your story. Crafted with intention.`,
      products: [
        { name: `${brand} Classic Chain`, price: '28.99' },
        { name: `${brand} Pearl Drops`, price: '22.99' },
        { name: `${brand} Signet Ring`, price: '34.99' },
        { name: `${brand} Tennis Bracelet`, price: '45.99' },
        { name: `${brand} Layered Necklace`, price: '32.99' },
        { name: `${brand} Gold Hoops`, price: '19.99' },
        { name: `${brand} Pendant Charm`, price: '26.99' },
        { name: `${brand} Cuff Bracelet`, price: '38.99' },
      ],
      collections: ['Necklaces', 'Earrings', 'Rings', 'Bracelets'],
      reviewQuotes: [
        'The quality for the price is unreal. Gets me compliments daily.',
        'Hasn\'t tarnished after months of daily wear. Truly impressed.',
        'My go-to for layering. Clean, minimal, and so elegant.',
      ],
      newsletterHeadline: 'Get 10% Off Your First Order',
      aboutBlurb: customer.description || `${brand} — modern jewelry for everyday elegance.`,
    };
  }

  // Generic fallback
  return {
    heroTag: 'New Collection',
    heroHeadline: `Discover ${brand}`,
    heroSub: customer.description || `Premium products from ${brand}. Quality you can feel.`,
    products: [
      { name: `${brand} Essential`, price: '39.99' },
      { name: `${brand} Classic`, price: '44.99' },
      { name: `${brand} Premium`, price: '54.99' },
      { name: `${brand} Signature`, price: '64.99' },
      { name: `${brand} Core`, price: '29.99' },
      { name: `${brand} Select`, price: '49.99' },
      { name: `${brand} Original`, price: '34.99' },
      { name: `${brand} Complete Set`, price: '74.99' },
    ],
    collections: ['New Arrivals', 'Best Sellers', 'Collections', 'Sale'],
    reviewQuotes: [
      'Exceeded all my expectations. Will definitely order again.',
      'The quality-to-price ratio is incredible. Highly recommend.',
      'Fast shipping and the product is exactly as described. Love it.',
    ],
    newsletterHeadline: 'Get 10% Off Your First Order',
    aboutBlurb: customer.description || `${brand} — quality products delivered to your door.`,
  };
}

// =============================================================================
// UNSPLASH IMAGE HELPERS
// =============================================================================

function getHeroImage(industry: string): string {
  const ind = industry.toLowerCase();
  if (ind.match(/gym|athletic|activewear|fitness/)) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80';
  if (ind.match(/jewel/)) return 'https://images.unsplash.com/photo-1515562141207-82f56648e57c?w=1600&q=80';
  if (ind.match(/beauty|skincare/)) return 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=80';
  return 'https://images.unsplash.com/photo-1441984904996-e0b6ba687f04?w=1600&q=80';
}

function getProductImages(industry: string): string[] {
  const ind = industry.toLowerCase();
  if (ind.match(/gym|athletic|activewear|fitness|sport/)) return [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80',
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
  ];
  if (ind.match(/jewel/)) return [
    'https://images.unsplash.com/photo-1515562141207-82f56648e57c?w=600&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80',
    'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
  ];
  if (ind.match(/beauty|skincare/)) return [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    'https://images.unsplash.com/photo-1570194065650-d99fb4a38648?w=600&q=80',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fba98?w=600&q=80',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80',
  ];
  return [
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687f04?w=600&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  ];
}

function getCollectionImages(industry: string): string[] {
  const ind = industry.toLowerCase();
  if (ind.match(/gym|athletic|activewear|fitness/)) return [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80',
  ];
  if (ind.match(/jewel/)) return [
    'https://images.unsplash.com/photo-1515562141207-82f56648e57c?w=800&q=80',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
  ];
  return [
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687f04?w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
  ];
}

// =============================================================================
// COLOR HELPERS
// =============================================================================

function getProductColors(industry: string): string[][] {
  const ind = industry.toLowerCase();
  if (ind.match(/gym|athletic|activewear|fitness/)) return [
    ['#1a1a1a', '#2d3748', '#c53030'],
    ['#1a1a1a', '#2b6cb0', '#38a169'],
    ['#1a1a1a', '#553c9a', '#d53f8c'],
    ['#4a5568', '#1a1a1a', '#2d3748'],
    ['#fff', '#1a1a1a', '#e53e3e'],
    ['#4a5568', '#1a1a1a', '#2b6cb0'],
    ['#1a1a1a', '#d53f8c', '#553c9a'],
    ['#1a1a1a', '#718096', '#d53f8c'],
  ];
  if (ind.match(/jewel/)) return [
    ['#d4af37', '#c0c0c0', '#e5c890'],
    ['#d4af37', '#c0c0c0', '#e5c890'],
    ['#d4af37', '#c0c0c0', '#b76e79'],
    ['#d4af37', '#c0c0c0', '#e5c890'],
    ['#d4af37', '#c0c0c0', '#e5c890'],
    ['#d4af37', '#c0c0c0', '#b76e79'],
    ['#d4af37', '#c0c0c0', '#e5c890'],
    ['#d4af37', '#c0c0c0', '#b76e79'],
  ];
  return [
    ['#1a1a1a', '#4a5568', '#718096'],
    ['#1a1a1a', '#2d3748', '#a0aec0'],
    ['#1a1a1a', '#4a5568', '#e53e3e'],
    ['#1a1a1a', '#2b6cb0', '#4a5568'],
    ['#1a1a1a', '#38a169', '#4a5568'],
    ['#1a1a1a', '#4a5568', '#d69e2e'],
    ['#1a1a1a', '#553c9a', '#4a5568'],
    ['#1a1a1a', '#4a5568', '#dd6b20'],
  ];
}

function getProductRatings(): { rating: number; reviews: number }[] {
  return [
    { rating: 4.8, reviews: 342 },
    { rating: 4.7, reviews: 256 },
    { rating: 4.9, reviews: 489 },
    { rating: 4.8, reviews: 378 },
    { rating: 4.6, reviews: 198 },
    { rating: 4.7, reviews: 312 },
    { rating: 4.8, reviews: 423 },
    { rating: 4.9, reviews: 567 },
  ];
}

// =============================================================================
// E-COMMERCE HTML BUILDER — 100% deterministic, no Claude involvement
// =============================================================================

function buildEcommerceHTML(
  profile: KingForensicProfile,
  customer: CustomerQuestionnaire,
  copy: GeneratedCopy
): string {
  const brand = customer.businessName;
  const industry = customer.industry || 'fashion';
  const heroImage = getHeroImage(industry);
  const productImages = getProductImages(industry);
  const collectionImages = getCollectionImages(industry);
  const productColors = getProductColors(industry);
  const ratings = getProductRatings();

  // Extract King DNA tokens
  const c = profile.colors;
  const t = profile.typography;
  const ds = profile.designSystem;
  const nav = profile.navigation;
  const hero = profile.hero;
  const footer = profile.footer;
  const anim = profile.animations;

  // Determine font imports
  const fontImports: string[] = [];
  if (t.headingFont.googleFontsUrl) fontImports.push(t.headingFont.googleFontsUrl);
  if (t.bodyFont.googleFontsUrl && t.bodyFont.googleFontsUrl !== t.headingFont.googleFontsUrl) {
    fontImports.push(t.bodyFont.googleFontsUrl);
  }
  const fontLinks = fontImports.map(url => `<link href="${url}" rel="stylesheet" />`).join('\n  ');

  // Build product cards HTML
  const productCards = copy.products.map((p, i) => {
    const img = productImages[i % productImages.length];
    const colors = productColors[i % productColors.length];
    const r = ratings[i % ratings.length];
    const stars = '★'.repeat(Math.floor(r.rating)) + (r.rating % 1 >= 0.5 ? '☆' : '');
    const badge = i < 2 ? '<span class="product-badge">NEW</span>' : '';

    return `
          <div class="product-card">
            <div class="product-img-wrap">
              <img src="${img}" alt="${p.name}" loading="lazy" />
              ${badge}
            </div>
            <div class="product-info">
              <h3 class="product-name">${p.name}</h3>
              <div class="product-price">$${p.price}</div>
              <div class="product-rating">
                <span class="stars">${stars}</span>
                <span class="review-count">(${r.reviews})</span>
              </div>
              <div class="color-swatches">
                ${colors.map(clr => `<span class="swatch" style="background:${clr}"></span>`).join('')}
              </div>
              <button class="add-to-cart">ADD TO CART</button>
            </div>
          </div>`;
  }).join('\n');

  // Build collection cards
  const collectionCards = copy.collections.map((name, i) => {
    const img = collectionImages[i % collectionImages.length];
    return `
          <div class="collection-card">
            <img src="${img}" alt="${name}" loading="lazy" />
            <div class="collection-overlay">
              <h3>${name}</h3>
              <span class="shop-link">Shop Now &rarr;</span>
            </div>
          </div>`;
  }).join('\n');

  // Build review cards
  const reviewNames = ['Sarah M.', 'James K.', 'Maria L.'];
  const reviewCards = copy.reviewQuotes.map((quote, i) => `
          <div class="review-card">
            <div class="review-stars">★★★★★</div>
            <p class="review-text">&ldquo;${quote}&rdquo;</p>
            <div class="review-author">
              <strong>${reviewNames[i]}</strong>
              <span class="verified">✓ Verified Purchase</span>
            </div>
          </div>`).join('\n');

  // Nav items from King profile
  const navItems = nav.menuItems.slice(0, 5);
  const navLinks = navItems.map((item: any) => `<li><a href="#">${item.label}</a></li>`).join('\n            ');
  const navCta = nav.ctaButton ? nav.ctaButton.text : 'Shop Now';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brand} — Official Store</title>
  ${fontLinks}
  <style>
    /* ═══ RESET ═══ */
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    
    /* ═══ KING DNA TOKENS ═══ */
    :root {
      --primary: ${c.primary};
      --primary-rgb: ${c.primaryRgb || '0,0,0'};
      --secondary: ${c.secondary};
      --accent: ${c.accent};
      --bg-main: ${c.background.main};
      --bg-alt: ${c.background.secondary};
      --bg-dark: ${c.background.dark};
      --bg-card: ${c.background.card};
      --text-primary: ${c.text.primary};
      --text-secondary: ${c.text.secondary};
      --text-muted: ${c.text.muted};
      --border: ${c.border.light};
      --font-heading: '${t.headingFont.family}', sans-serif;
      --font-body: '${t.bodyFont.family}', sans-serif;
      --shadow-card: ${ds.shadows.cardDefault};
      --shadow-card-hover: ${ds.shadows.cardHover};
      --shadow-sm: ${ds.shadows.sm};
      --radius-btn: ${ds.borderRadius.buttons};
      --radius-card: ${ds.borderRadius.cards};
      --radius-sm: ${ds.borderRadius.small};
      --radius-lg: ${ds.borderRadius.large};
      --container: ${ds.containerMaxWidth};
      --transition: ${anim.transition.default};
    }

    body {
      font-family: var(--font-body);
      color: var(--text-primary);
      background: var(--bg-main);
      line-height: ${t.scale.body.lineHeight};
      font-size: ${t.scale.body.size};
      -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4 { font-family: var(--font-heading); }
    img { display: block; max-width: 100%; }
    a { text-decoration: none; color: inherit; }
    ul { list-style: none; }
    button { cursor: pointer; border: none; font-family: var(--font-body); }

    .container {
      max-width: var(--container);
      margin: 0 auto;
      padding: 0 24px;
    }

    /* ═══ ANNOUNCEMENT BAR ═══ */
    .announce {
      background: var(--bg-dark);
      color: ${c.text.inverse || '#fff'};
      text-align: center;
      padding: 10px 16px;
      font-size: 13px;
      letter-spacing: 0.5px;
    }

    /* ═══ NAVIGATION ═══ */
    .nav {
      background: ${nav.backgroundColor};
      height: ${nav.height || '72px'};
      display: flex;
      align-items: center;
      padding: 0 32px;
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      max-width: var(--container);
      margin: 0 auto;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-logo {
      font-family: var(--font-heading);
      font-size: ${t.scale.h3?.size || '24px'};
      font-weight: ${t.scale.h3?.weight || '700'};
      color: var(--text-primary);
    }
    .nav-links {
      display: flex;
      gap: 32px;
    }
    .nav-links a {
      font-family: ${nav.fontFamily || 'var(--font-body)'};
      font-size: ${nav.fontSize || '14px'};
      font-weight: ${nav.fontWeight || '500'};
      text-transform: ${nav.textTransform || 'none'};
      color: var(--text-secondary);
      transition: var(--transition);
    }
    .nav-links a:hover { color: var(--text-primary); }
    .nav-actions { display: flex; align-items: center; gap: 16px; }
    .nav-actions button {
      background: none;
      color: var(--text-primary);
      position: relative;
    }
    .nav-cta {
      background: ${ds.buttonStyles.primary.backgroundColor};
      color: ${ds.buttonStyles.primary.textColor};
      padding: ${ds.buttonStyles.primary.padding || '12px 24px'};
      border-radius: ${ds.buttonStyles.primary.borderRadius};
      font-weight: ${ds.buttonStyles.primary.fontWeight || '600'};
      font-size: 14px;
      text-transform: ${ds.buttonStyles.primary.textTransform || 'none'};
      transition: var(--transition);
    }
    .nav-cta:hover { opacity: 0.9; transform: ${ds.buttonStyles.primary.hoverTransform || 'translateY(-1px)'}; }
    .cart-count {
      position: absolute;
      top: -6px; right: -8px;
      background: var(--accent);
      color: #fff;
      font-size: 10px;
      width: 18px; height: 18px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .mobile-toggle { display: none; background: none; }
    .mobile-toggle span { display: block; width: 22px; height: 2px; background: var(--text-primary); margin: 5px 0; }

    /* ═══ HERO BANNER ═══ */
    .hero {
      position: relative;
      min-height: ${hero.height || '80vh'};
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 100%);
    }
    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      color: #fff;
      padding: 40px 24px;
      max-width: 700px;
    }
    .hero-tag {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      padding: 8px 20px;
      border-radius: 100px;
      font-size: 13px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 24px;
    }
    .hero h1 {
      font-size: ${hero.headline.fontSize || t.scale.h1.size};
      font-weight: ${hero.headline.fontWeight || t.scale.h1.weight};
      line-height: ${t.scale.h1.lineHeight};
      letter-spacing: ${t.scale.h1.letterSpacing};
      text-transform: ${hero.headline.textTransform || t.scale.h1.textTransform || 'none'};
      margin-bottom: 16px;
    }
    .hero-sub {
      font-size: 18px;
      opacity: 0.9;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .hero-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .btn-primary {
      display: inline-block;
      background: ${hero.ctaButtons[0]?.backgroundColor || ds.buttonStyles.primary.backgroundColor};
      color: ${hero.ctaButtons[0]?.textColor || ds.buttonStyles.primary.textColor};
      padding: ${hero.ctaButtons[0]?.padding || ds.buttonStyles.primary.padding || '16px 36px'};
      border-radius: ${hero.ctaButtons[0]?.borderRadius || ds.buttonStyles.primary.borderRadius};
      font-weight: 600;
      font-size: 15px;
      transition: var(--transition);
    }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
    .btn-secondary {
      display: inline-block;
      background: transparent;
      color: #fff;
      padding: 16px 36px;
      border-radius: ${ds.buttonStyles.secondary.borderRadius || ds.buttonStyles.primary.borderRadius};
      font-weight: 600;
      font-size: 15px;
      border: 2px solid rgba(255,255,255,0.4);
      transition: var(--transition);
    }
    .btn-secondary:hover { border-color: #fff; background: rgba(255,255,255,0.1); }

    /* ═══ TRUST BAR ═══ */
    .trust-bar {
      background: var(--bg-alt);
      border-bottom: 1px solid var(--border);
      padding: 20px 0;
    }
    .trust-bar .container {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .trust-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .trust-item svg { flex-shrink: 0; }

    /* ═══ SECTION HEADERS ═══ */
    .section { padding: ${ds.sectionPadding?.desktop || '80px 0'}; }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }
    .section-title {
      font-size: ${t.scale.h2.size};
      font-weight: ${t.scale.h2.weight};
      line-height: ${t.scale.h2.lineHeight};
    }
    .view-all {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      transition: var(--transition);
    }
    .view-all:hover { color: var(--primary); }

    /* ═══ PRODUCT GRID ═══ */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: ${ds.sectionPadding?.desktop ? '24px' : '20px'};
    }
    .product-card {
      background: var(--bg-card);
      border: ${ds.cardStyles.border || '1px solid var(--border)'};
      border-radius: var(--radius-card);
      overflow: hidden;
      transition: var(--transition);
      box-shadow: var(--shadow-card);
    }
    .product-card:hover {
      transform: ${ds.cardStyles.hoverTransform || 'translateY(-4px)'};
      box-shadow: var(--shadow-card-hover);
    }
    .product-img-wrap {
      position: relative;
      aspect-ratio: 3/4;
      overflow: hidden;
      background: var(--bg-alt);
    }
    .product-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .product-card:hover .product-img-wrap img { transform: scale(1.05); }
    .product-badge {
      position: absolute;
      top: 12px; left: 12px;
      background: var(--accent);
      color: #fff;
      padding: 4px 12px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .product-info { padding: 16px; }
    .product-name {
      font-size: ${t.scale.h4?.size || '15px'};
      font-weight: ${t.scale.h4?.weight || '600'};
      margin-bottom: 6px;
      line-height: 1.3;
    }
    .product-price {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 8px;
    }
    .product-rating {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 10px;
    }
    .stars { color: #f59e0b; font-size: 13px; }
    .review-count { font-size: 12px; color: var(--text-muted); }
    .color-swatches {
      display: flex;
      gap: 6px;
      margin-bottom: 12px;
    }
    .swatch {
      width: 14px; height: 14px;
      border-radius: 50%;
      border: 2px solid var(--border);
      cursor: pointer;
      transition: var(--transition);
    }
    .swatch:hover { transform: scale(1.2); }
    .add-to-cart {
      width: 100%;
      padding: 12px;
      background: ${ds.buttonStyles.primary.backgroundColor};
      color: ${ds.buttonStyles.primary.textColor};
      border-radius: ${ds.buttonStyles.primary.borderRadius};
      font-weight: ${ds.buttonStyles.primary.fontWeight || '600'};
      font-size: 13px;
      text-transform: ${ds.buttonStyles.primary.textTransform || 'uppercase'};
      letter-spacing: 0.5px;
      transition: var(--transition);
    }
    .add-to-cart:hover { opacity: 0.9; }

    /* ═══ COLLECTIONS ═══ */
    .collection-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    .collection-card {
      position: relative;
      border-radius: var(--radius-card);
      overflow: hidden;
      aspect-ratio: 3/4;
      cursor: pointer;
    }
    .collection-card img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }
    .collection-card:hover img { transform: scale(1.08); }
    .collection-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(transparent 40%, rgba(0,0,0,0.7));
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 24px;
      color: #fff;
    }
    .collection-overlay h3 {
      font-size: ${t.scale.h3?.size || '20px'};
      font-weight: ${t.scale.h3?.weight || '600'};
      margin-bottom: 4px;
    }
    .shop-link {
      font-size: 14px;
      opacity: 0.8;
      transition: var(--transition);
    }
    .collection-card:hover .shop-link { opacity: 1; }

    /* ═══ REVIEWS ═══ */
    .reviews-section { background: var(--bg-alt); }
    .reviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .overall-rating {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .big-rating {
      font-size: 48px;
      font-weight: 800;
      font-family: var(--font-heading);
    }
    .rating-stars { color: #f59e0b; font-size: 20px; }
    .rating-count { font-size: 14px; color: var(--text-muted); }
    .reviews-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    .review-card {
      background: var(--bg-card);
      border: ${ds.cardStyles.border || '1px solid var(--border)'};
      border-radius: var(--radius-card);
      padding: 28px;
      box-shadow: var(--shadow-card);
    }
    .review-stars { color: #f59e0b; margin-bottom: 16px; font-size: 16px; }
    .review-text {
      font-size: 15px;
      line-height: 1.7;
      color: var(--text-secondary);
      margin-bottom: 20px;
    }
    .review-author { display: flex; align-items: center; gap: 8px; }
    .verified {
      font-size: 12px;
      color: #22c55e;
      font-weight: 500;
    }

    /* ═══ NEWSLETTER ═══ */
    .newsletter {
      background: var(--bg-dark);
      color: ${c.text.inverse || '#fff'};
      text-align: center;
      padding: 80px 24px;
    }
    .newsletter h2 {
      font-size: ${t.scale.h2.size};
      font-weight: ${t.scale.h2.weight};
      margin-bottom: 12px;
    }
    .newsletter-sub {
      font-size: 16px;
      opacity: 0.8;
      margin-bottom: 32px;
    }
    .newsletter-form {
      display: flex;
      max-width: 480px;
      margin: 0 auto;
      gap: 0;
    }
    .newsletter-form input {
      flex: 1;
      padding: 16px 20px;
      border: ${ds.inputStyles?.border || '1px solid rgba(255,255,255,0.2)'};
      border-radius: ${ds.inputStyles?.borderRadius || 'var(--radius-btn)'} 0 0 ${ds.inputStyles?.borderRadius || 'var(--radius-btn)'};
      background: rgba(255,255,255,0.1);
      color: #fff;
      font-size: 15px;
      outline: none;
    }
    .newsletter-form input::placeholder { color: rgba(255,255,255,0.5); }
    .newsletter-form button {
      padding: 16px 28px;
      background: ${c.accent || '#fff'};
      color: ${c.background.dark || '#000'};
      font-weight: 700;
      font-size: 14px;
      border-radius: 0 ${ds.inputStyles?.borderRadius || 'var(--radius-btn)'} ${ds.inputStyles?.borderRadius || 'var(--radius-btn)'} 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: var(--transition);
    }
    .newsletter-form button:hover { opacity: 0.9; }
    .newsletter-privacy {
      font-size: 12px;
      opacity: 0.5;
      margin-top: 16px;
    }

    /* ═══ FOOTER ═══ */
    .footer {
      background: ${footer.backgroundColor || 'var(--bg-dark)'};
      color: ${footer.textColor || 'rgba(255,255,255,0.8)'};
      padding: 60px 0 24px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 48px;
    }
    .footer h4 {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #fff;
    }
    .footer-about {
      font-size: 14px;
      line-height: 1.7;
      opacity: 0.7;
      margin-bottom: 20px;
    }
    .footer-social { display: flex; gap: 12px; }
    .footer-social a {
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px;
      transition: var(--transition);
    }
    .footer-social a:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); }
    .footer ul li { margin-bottom: 12px; }
    .footer ul a {
      font-size: 14px;
      opacity: 0.7;
      transition: var(--transition);
    }
    .footer ul a:hover { opacity: 1; }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .footer-bottom p { font-size: 13px; opacity: 0.5; }
    .payment-icons {
      display: flex;
      gap: 12px;
    }
    .payment-icons span {
      padding: 4px 12px;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 4px;
      font-size: 11px;
      opacity: 0.6;
    }

    /* ═══ RESPONSIVE ═══ */
    @media (max-width: 1024px) {
      .product-grid { grid-template-columns: repeat(3, 1fr); }
      .collection-grid { grid-template-columns: repeat(2, 1fr); }
      .reviews-grid { grid-template-columns: repeat(2, 1fr); }
      .footer-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0; right: 0;
        background: ${nav.backgroundColor};
        padding: 24px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
      }
      .mobile-toggle { display: block; }
      .nav-cta { display: none; }
      .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .collection-grid { grid-template-columns: repeat(2, 1fr); }
      .reviews-grid { grid-template-columns: 1fr; }
      .hero { min-height: 60vh; }
      .hero h1 { font-size: clamp(28px, 7vw, ${hero.headline.fontSize || t.scale.h1.size}); }
      .section { padding: 48px 0; }
      .section-header { flex-direction: column; align-items: flex-start; gap: 8px; }
      .reviews-header { flex-direction: column; align-items: flex-start; }
      .newsletter-form { flex-direction: column; gap: 12px; }
      .newsletter-form input { border-radius: var(--radius-btn); }
      .newsletter-form button { border-radius: var(--radius-btn); }
      .footer-grid { grid-template-columns: 1fr; gap: 32px; }
      .footer-bottom { flex-direction: column; text-align: center; }
    }
    @media (max-width: 480px) {
      .product-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .product-info { padding: 10px; }
      .product-name { font-size: 13px; }
      .add-to-cart { padding: 10px; font-size: 11px; }
    }

    /* ═══ ANIMATIONS ═══ */
    ${anim.scrollReveal?.enabled ? `
    .fade-up {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-up.visible { opacity: 1; transform: translateY(0); }
    ` : ''}
  </style>
</head>
<body>

  <!-- ANNOUNCEMENT BAR -->
  <div class="announce">
    🚚 Free Shipping on Orders Over $75 &nbsp;|&nbsp; New Arrivals Just Dropped
  </div>

  <!-- NAVIGATION -->
  <nav class="nav">
    <div class="nav-inner">
      <a href="#" class="nav-logo">${brand}</a>
      <ul class="nav-links">
        ${navLinks}
      </ul>
      <div class="nav-actions">
        <button aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <button aria-label="Cart" style="position:relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span class="cart-count">0</span>
        </button>
        <a href="#" class="nav-cta">${navCta}</a>
      </div>
      <button class="mobile-toggle" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- HERO BANNER -->
  <section class="hero">
    <img src="${heroImage}" alt="${brand}" class="hero-bg" />
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <span class="hero-tag">${copy.heroTag}</span>
      <h1>${copy.heroHeadline}</h1>
      <p class="hero-sub">${copy.heroSub}</p>
      <div class="hero-ctas">
        <a href="#products" class="btn-primary">${hero.ctaButtons[0]?.text || 'SHOP NOW'}</a>
        <a href="#collections" class="btn-secondary">View Collections</a>
      </div>
    </div>
  </section>

  <!-- TRUST BAR -->
  <div class="trust-bar">
    <div class="container">
      <div class="trust-item">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        <span>Free Shipping Over $75</span>
      </div>
      <div class="trust-item">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        <span>30-Day Returns</span>
      </div>
      <div class="trust-item">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        <span>Secure Checkout</span>
      </div>
      <div class="trust-item">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <span>12,000+ Happy Customers</span>
      </div>
    </div>
  </div>

  <!-- PRODUCTS -->
  <section class="section" id="products">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Best Sellers</h2>
        <a href="#" class="view-all">View All →</a>
      </div>
      <div class="product-grid">
${productCards}
      </div>
    </div>
  </section>

  <!-- COLLECTIONS -->
  <section class="section" id="collections" style="background: var(--bg-alt);">
    <div class="container">
      <h2 class="section-title" style="margin-bottom:40px;">Shop by Collection</h2>
      <div class="collection-grid">
${collectionCards}
      </div>
    </div>
  </section>

  <!-- REVIEWS -->
  <section class="section reviews-section">
    <div class="container">
      <div class="reviews-header">
        <h2 class="section-title">What Our Customers Say</h2>
        <div class="overall-rating">
          <span class="big-rating">4.8</span>
          <div>
            <div class="rating-stars">★★★★★</div>
            <div class="rating-count">Based on 2,400+ reviews</div>
          </div>
        </div>
      </div>
      <div class="reviews-grid">
${reviewCards}
      </div>
    </div>
  </section>

  <!-- NEWSLETTER -->
  <section class="newsletter">
    <h2>${copy.newsletterHeadline}</h2>
    <p class="newsletter-sub">Join 15,000+ subscribers for exclusive deals and new arrivals.</p>
    <div class="newsletter-form">
      <input type="email" placeholder="Enter your email" />
      <button>SUBSCRIBE</button>
    </div>
    <p class="newsletter-privacy">We respect your privacy. Unsubscribe anytime.</p>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>${brand}</h4>
          <p class="footer-about">${copy.aboutBlurb}</p>
          <div class="footer-social">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="TikTok">TK</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Twitter">X</a>
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><a href="#">New Arrivals</a></li>
            <li><a href="#">Best Sellers</a></li>
            <li><a href="#">Sale</a></li>
            <li><a href="#">Gift Cards</a></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 ${brand}. All rights reserved.</p>
        <div class="payment-icons">
          <span>Visa</span><span>Mastercard</span><span>Amex</span><span>PayPal</span><span>Apple Pay</span>
        </div>
      </div>
    </div>
  </footer>

  <script>
    // Mobile nav
    document.querySelector('.mobile-toggle')?.addEventListener('click', function() {
      document.querySelector('.nav-links')?.classList.toggle('active');
    });
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        var t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      });
    });
    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var orig = this.textContent;
        this.textContent = '✓ ADDED';
        this.style.background = '#22c55e';
        var b = this;
        setTimeout(function() { b.textContent = orig; b.style.background = ''; }, 1500);
      });
    });
    ${anim.scrollReveal?.enabled ? `
    // Scroll reveal
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(function(el) { obs.observe(el); });
    ` : ''}
  </script>

</body>
</html>`;
}

// =============================================================================
// NON-ECOMMERCE: Still uses Claude for full generation (v2 approach)
// =============================================================================

async function generateWithClaude(
  profile: KingForensicProfile,
  customer: CustomerQuestionnaire,
  siteType: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const c = profile.colors;
  const t = profile.typography;
  const ds = profile.designSystem;

  const systemPrompt = `You are a precision website builder with the exact design DNA from ${profile.meta.kingName}.
Build a ${siteType.toUpperCase()} website using these exact specs:
- Colors: ${c.primary}, ${c.secondary}, ${c.accent}
- Fonts: ${t.headingFont.family}, ${t.bodyFont.family}
- Button radius: ${ds.borderRadius.buttons}; Card radius: ${ds.borderRadius.cards}
- Shadows: ${ds.shadows.cardDefault}
Output ONLY complete HTML. <!DOCTYPE html> to </html>. No markdown.`;

  let blueprint = '';
  profile.sections.forEach((section: any, i: number) => {
    blueprint += `Section ${i+1}: ${section.name} (${section.type}) — ${section.contentPattern || section.layout || 'standard'}\n`;
  });

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
      system: systemPrompt,
      messages: [{ role: 'user', content: `Build a ${siteType} website for "${customer.businessName}" (${customer.industry}).
${customer.description}

Sections:\n${blueprint}

Use all design DNA specs. Full HTML output only.` }],
    }),
  });

  if (!response.ok) throw new Error(`Claude API error: ${response.status}`);
  const data = await response.json();
  let html = data.content[0].text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  const idx = html.toLowerCase().indexOf('<!doctype');
  if (idx > 0) html = html.substring(idx);
  return html;
}

// =============================================================================
// MAIN EXPORT
// =============================================================================

export async function generateFromKingDNA(
  profile: KingForensicProfile,
  customer: CustomerQuestionnaire
): Promise<string> {
  const siteType = detectSiteType(profile);
  console.log(`[KingGenerator v4] Site type: ${siteType} | King: ${profile.meta.kingName} | Customer: ${customer.businessName}`);

  if (siteType === 'ecommerce') {
    // v4: Build HTML programmatically, Claude only does copywriting
    const copy = await generateCopy(profile, customer);
    console.log(`[KingGenerator v4] Copy generated, building HTML...`);
    const html = buildEcommerceHTML(profile, customer, copy);
    console.log(`[KingGenerator v4] Built ${(html.length / 1024).toFixed(1)}KB HTML (deterministic)`);
    return html;
  }

  // Non-ecommerce: Claude generates full page
  const html = await generateWithClaude(profile, customer, siteType);
  console.log(`[KingGenerator v4] Generated ${(html.length / 1024).toFixed(1)}KB HTML (Claude)`);
  return html;
}

// =============================================================================
// REVISION — Claude edits the existing HTML
// =============================================================================

export async function reviseFromKingDNA(
  profile: KingForensicProfile,
  currentHtml: string,
  editRequest: string,
  customer: CustomerQuestionnaire
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const siteType = detectSiteType(profile);

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
      system: `You are editing a ${siteType} website styled with ${profile.meta.kingName}'s design DNA.
Maintain: colors (${profile.colors.primary}, ${profile.colors.secondary}), fonts, button/card styles.
${siteType === 'ecommerce' ? 'Keep product grids, prices, add-to-cart buttons, trust badges, reviews.' : ''}
Apply the requested change. Output ONLY complete HTML.`,
      messages: [{
        role: 'user',
        content: `Change: ${editRequest}\n\nCurrent HTML:\n${currentHtml.substring(0, 20000)}\n\nReturn COMPLETE updated HTML.`,
      }],
    }),
  });

  if (!response.ok) throw new Error('Revision failed');
  const data = await response.json();
  let html = data.content[0].text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  return html;
}
