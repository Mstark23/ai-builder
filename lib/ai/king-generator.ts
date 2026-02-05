// /lib/ai/king-generator.ts
// VERKTORLABS - King DNA Website Generator v2
//
// THE CORE INSIGHT:
// v1 said "use these colors and fonts" → Claude built generic landing pages
// v2 says "build THIS EXACT page structure with THESE elements in EACH section"
//
// For an e-commerce King: "Build a 4-column product grid where each card
// has image → name → price → rating → add-to-cart button"
// NOT: "Build a 4-column grid section"

import type { KingForensicProfile, CustomerQuestionnaire } from './king-forensic-profile';

// =============================================================================
// SITE TYPE DETECTION
// Determines what KIND of website this King is — changes everything
// =============================================================================

function detectSiteType(profile: KingForensicProfile): 
  'ecommerce' | 'saas' | 'agency' | 'portfolio' | 'restaurant' | 'service' | 'generic' {
  
  const industry = (profile.meta.industry || '').toLowerCase();
  const vibe = (profile.meta.overallVibe || '').toLowerCase();
  const hasCart = profile.navigation.hasCartIcon;
  const hasSearch = profile.navigation.hasSearch;
  const navLabels = profile.navigation.menuItems.map(m => m.label.toLowerCase()).join(' ');
  const sectionTypes = profile.sections.map(s => s.type.toLowerCase()).join(' ');
  const sectionNames = profile.sections.map(s => s.name.toLowerCase()).join(' ');

  // E-commerce signals
  if (hasCart || 
      navLabels.match(/shop|collection|product|sale|new arrival|men|women|accessories/) ||
      sectionTypes.match(/product|catalog|collection/) ||
      sectionNames.match(/product|shop|collection|bestseller|new arrival/) ||
      industry.match(/fashion|jewelry|beauty|skincare|clothing|activewear|footwear|pet|food|beverage|supplement|home|furniture|bedding/)) {
    return 'ecommerce';
  }

  // SaaS signals
  if (navLabels.match(/pricing|docs|documentation|api|developer|changelog|blog/) ||
      sectionTypes.match(/pricing|feature|integration/) ||
      industry.match(/saas|tech|software|fintech/)) {
    return 'saas';
  }

  // Restaurant signals
  if (navLabels.match(/menu|reservation|order|dine/) ||
      industry.match(/restaurant|food service|cafe|bar/)) {
    return 'restaurant';
  }

  // Agency/portfolio signals
  if (navLabels.match(/work|case stud|portfolio|client/) ||
      sectionTypes.match(/portfolio|case.study|client/)) {
    return 'agency';
  }

  // Service business signals
  if (navLabels.match(/service|appointment|book|consult/) ||
      industry.match(/salon|spa|dental|medical|legal|accounting/)) {
    return 'service';
  }

  return 'generic';
}

// =============================================================================
// SECTION BLUEPRINTS — The EXACT content skeleton for each section type
// This is what v1 was missing. Not "4-column grid" but "product card with
// image, name, price, rating, add-to-cart button"
// =============================================================================

function getSectionBlueprint(
  section: any,
  siteType: string,
  profile: KingForensicProfile,
  customer: CustomerQuestionnaire,
  sectionIndex: number
): string {
  const type = (section.type || section.name || '').toLowerCase();
  const layout = (section.layout || '').toLowerCase();
  const content = (section.contentPattern || '').toLowerCase();

  // ═══════════════════════════════════════════════════════════
  // E-COMMERCE BLUEPRINTS
  // ═══════════════════════════════════════════════════════════
  if (siteType === 'ecommerce') {

    // HERO — Full-width banner, not a text hero
    if (type.includes('hero') || sectionIndex === 0) {
      return `
## SECTION ${sectionIndex + 1}: HERO — E-COMMERCE BANNER
Build this as a FULL-WIDTH e-commerce hero banner, NOT a generic text hero.

REQUIRED STRUCTURE:
- Full viewport-width banner image (or split layout if King uses that)
- Collection/seasonal announcement text overlaid on image
- Primary CTA button: "${profile.hero.ctaButtons[0]?.text || 'SHOP NOW'}" 
- Optional: secondary CTA or collection link
- Optional: announcement bar above nav with promo text

WHAT THIS LOOKS LIKE ON A REAL E-COMMERCE SITE:
- Think of the big banner you see when you land on Gymshark/Zara/H&M
- It's a lifestyle photo with overlaid text, NOT a SaaS-style hero with bullet points
- The CTA takes you to a collection, not "learn more"

KING'S HERO SPECS:
- Layout: ${profile.hero.layout}
- Height: ${profile.hero.height}
- Headline style: font-size: ${profile.hero.headline.fontSize}; font-weight: ${profile.hero.headline.fontWeight}; text-transform: ${profile.hero.headline.textTransform}
- CTA style: bg: ${profile.hero.ctaButtons[0]?.backgroundColor || 'var(--primary)'}; text: ${profile.hero.ctaButtons[0]?.textColor || '#fff'}; radius: ${profile.hero.ctaButtons[0]?.borderRadius || '0'}; padding: ${profile.hero.ctaButtons[0]?.padding || '16px 32px'}

CUSTOMER CONTENT:
- Business: ${customer.businessName}
- Hero text should announce their main collection or value proposition
- Use a relevant Unsplash image (${customer.industry} lifestyle/product photography)`;
    }

    // PRODUCT GRID — The most critical section for e-commerce
    if (type.includes('product') || type.includes('catalog') || type.includes('collection') || 
        type.includes('bestseller') || type.includes('featured') || type.includes('shop') ||
        type.includes('new arrival') || content.includes('product')) {
      const cols = section.gridColumns || '4';
      return `
## SECTION ${sectionIndex + 1}: PRODUCT GRID — E-COMMERCE PRODUCT LISTING
This is the CORE of an e-commerce website. Build it exactly like a real online store.

REQUIRED PRODUCT CARD STRUCTURE (each card MUST contain ALL of these in this order):
1. PRODUCT IMAGE — full card width, aspect-ratio 3:4 or 4:5, object-fit: cover
2. PRODUCT NAME — left-aligned, ${profile.typography.scale.h4?.size || '16px'} font-size
3. PRICE — format: "$XX.XX", bold, ${profile.colors.text?.primary || '#000'}
4. STAR RATING — ★★★★★ with count "(XXX reviews)" in smaller text
5. COLOR SWATCHES — 3-4 small circles (12-16px) showing color options
6. ADD TO CART BUTTON — "${section.specialElements?.find((e: string) => e.toLowerCase().includes('button'))?.replace(/button:?\s*/i, '') || 'ADD TO CART'}"
   - Full card width or auto width depending on King's style
   - Style: bg ${profile.designSystem.buttonStyles.primary.backgroundColor}; color ${profile.designSystem.buttonStyles.primary.textColor}; radius ${profile.designSystem.buttonStyles.primary.borderRadius}

GRID LAYOUT:
- Desktop: ${cols} columns, gap: ${section.gridGap || '16px'}
- Tablet: 2 columns
- Mobile: 2 columns (smaller gap)

CARD STYLING (from King DNA):
- Background: ${profile.designSystem.cardStyles.background}
- Border: ${profile.designSystem.cardStyles.border}
- Border-radius: ${profile.designSystem.cardStyles.borderRadius}
- Shadow: ${profile.designSystem.cardStyles.shadow}
- Hover: ${profile.designSystem.cardStyles.hoverTransform}

SHOW 8 PRODUCTS with realistic:
- Names related to ${customer.industry} (e.g., "${customer.businessName} Essential Tee", "${customer.businessName} Pro Shorts")
- Prices between $29-$89 (or appropriate for ${customer.industry})
- Ratings between 4.2-4.9 stars
- Review counts between 50-500

THIS MUST LOOK LIKE A REAL ONLINE STORE. Not generic cards with descriptions.`;
    }

    // COLLECTION CATEGORIES
    if (type.includes('categor') || type.includes('collection') || content.includes('category')) {
      return `
## SECTION ${sectionIndex + 1}: COLLECTION CATEGORIES
Show product categories as clickable visual cards.

REQUIRED STRUCTURE:
- ${section.gridColumns || '3-4'} category cards
- Each card: full-bleed lifestyle image + category name overlay + "Shop Now" link
- Categories relevant to ${customer.businessName}: e.g., "New Arrivals", "Best Sellers", "Sale", specific product types
- Image hover: slight zoom (scale 1.05), overlay darkens
- Text: white, overlaid on bottom of image with dark gradient overlay

STYLING: background: ${section.backgroundColor || 'var(--bg-main)'}; padding: ${section.padding?.top || '80px'} 0 ${section.padding?.bottom || '80px'};`;
    }

    // SOCIAL PROOF / UGC
    if (type.includes('social') || type.includes('ugc') || type.includes('review') || 
        type.includes('testimonial') || content.includes('review')) {
      return `
## SECTION ${sectionIndex + 1}: SOCIAL PROOF / REVIEWS
Build as a review/UGC section for an e-commerce store.

REQUIRED ELEMENTS:
- Section heading: "What Our Customers Say" or similar
- 3-4 customer review cards, each containing:
  a. Star rating (★★★★★)
  b. Review text (1-2 sentences about the product)
  c. Reviewer name
  d. "Verified Purchase" badge
  e. Product they reviewed (optional)
- Overall rating summary: "4.8/5 based on 2,000+ reviews"
- Trust badges: "Free Shipping", "Easy Returns", "Secure Checkout"

STYLING: ${section.backgroundColor ? `background: ${section.backgroundColor}` : 'alternate background from previous section'};`;
    }

    // TRUST BAR / FEATURES STRIP
    if (type.includes('trust') || type.includes('feature') || type.includes('benefit') ||
        content.includes('trust') || content.includes('shipping')) {
      return `
## SECTION ${sectionIndex + 1}: TRUST BAR / FEATURES
Horizontal strip of e-commerce trust signals.

REQUIRED (4 items in a row):
- 🚚 Free Shipping (over $XX)
- 🔄 Easy Returns (XX-day return policy)
- 🔒 Secure Checkout
- ⭐ XX,000+ Happy Customers
Each with an icon + short text. Icons from ${profile.designSystem.iconSystem.library || 'inline SVG'}.`;
    }

    // NEWSLETTER
    if (type.includes('newsletter') || type.includes('email') || type.includes('subscribe') || 
        content.includes('newsletter')) {
      return `
## SECTION ${sectionIndex + 1}: NEWSLETTER SIGNUP
E-commerce email capture section.

REQUIRED:
- Compelling headline: "Get 10% Off Your First Order" or similar
- Subtext: "Join XX,000+ subscribers for exclusive deals"
- Email input + "Subscribe" button (inline, side by side)
- Small privacy text below
- Input style: ${profile.designSystem.inputStyles.border}; radius: ${profile.designSystem.inputStyles.borderRadius}`;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // SAAS BLUEPRINTS
  // ═══════════════════════════════════════════════════════════
  if (siteType === 'saas') {

    if (type.includes('hero') || sectionIndex === 0) {
      return `
## SECTION ${sectionIndex + 1}: HERO — SAAS LANDING
- Big headline: benefit-driven, ${profile.hero.headline.fontSize}
- Subheadline: 1-2 sentences explaining the product
- Primary CTA: "${profile.hero.ctaButtons[0]?.text || 'Get Started'}" + secondary CTA
- Below: product screenshot or demo video
- Optional: social proof bar ("Trusted by 10,000+ teams")`;
    }

    if (type.includes('feature') || type.includes('benefit')) {
      return `
## SECTION ${sectionIndex + 1}: FEATURES
- Section heading + subtitle
- ${section.gridColumns || '3'} feature cards, each with: icon + title + description
- Layout: ${section.layout || 'grid'}
- Optional: bento grid layout for visual variety`;
    }

    if (type.includes('pricing')) {
      return `
## SECTION ${sectionIndex + 1}: PRICING
- 2-3 pricing tiers in columns
- Each tier: name, price, feature list with checkmarks, CTA button
- Highlight popular plan with border/badge
- Toggle: Monthly/Annual`;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // GENERIC SECTION BLUEPRINT (fallback)
  // ═══════════════════════════════════════════════════════════
  return `
## SECTION ${sectionIndex + 1}: ${section.name.toUpperCase()}
Type: ${section.type}
Layout: ${section.layout}
Grid: ${section.gridColumns} columns, gap: ${section.gridGap}
Background: ${section.backgroundColor}
Padding: top: ${section.padding?.top || '80px'}, bottom: ${section.padding?.bottom || '80px'}
Content: ${section.contentPattern || 'Build appropriate content for this section type'}
Special elements: ${section.specialElements?.length > 0 ? section.specialElements.join(', ') : 'none'}`;
}

// =============================================================================
// SYSTEM PROMPT — Now site-type aware
// =============================================================================

function buildSystemPrompt(profile: KingForensicProfile, siteType: string): string {
  const siteTypeInstructions: Record<string, string> = {
    ecommerce: `You are building an E-COMMERCE WEBSITE — an online store.
This means PRODUCT GRIDS with images, prices, ratings, and add-to-cart buttons.
This means COLLECTION BANNERS and CATEGORY CARDS.
This means TRUST BADGES (free shipping, secure checkout, easy returns).
This means the hero is a PROMOTIONAL BANNER, not a SaaS-style headline.

DO NOT build a landing page. DO NOT build a portfolio. DO NOT build a blog.
BUILD A REAL ONLINE STORE that looks like ${profile.meta.kingName}.`,
    
    saas: `You are building a SAAS LANDING PAGE — a software product website.
This means FEATURE SECTIONS, PRICING TABLES, INTEGRATION LOGOS, and DEMO/SCREENSHOT sections.
The hero should have a product description with a signup CTA and product screenshot below.`,
    
    agency: `You are building an AGENCY/PORTFOLIO website.
This means CASE STUDIES, CLIENT LOGOS, WORK GALLERY, and TEAM sections.`,
    
    restaurant: `You are building a RESTAURANT website.
This means MENU SECTIONS, RESERVATION CTA, FOOD PHOTOGRAPHY, LOCATION/HOURS, and REVIEWS.`,
    
    service: `You are building a SERVICE BUSINESS website.
This means SERVICE LISTINGS, BOOKING/CONTACT CTA, TESTIMONIALS, and TRUST SIGNALS.`,
    
    generic: `Build a professional website matching the King's structure exactly.`,
  };

  return `You are a precision website builder. You have the EXACT design DNA extracted from ${profile.meta.kingName}'s REAL website source code.

## SITE TYPE
${siteTypeInstructions[siteType] || siteTypeInstructions.generic}

## YOUR JOB
1. Build the EXACT page structure from ${profile.meta.kingName} — same sections, same order, same layout
2. Use the EXACT design specs (colors, fonts, spacing, shadows, radius) — these were measured from real CSS
3. Fill with the CUSTOMER'S content (name, products, copy) — not the King's content
4. The result should look like ${profile.meta.kingName}'s website but for the customer's brand

## CRITICAL RULES
- Use EXACT hex codes: ${profile.colors.primary}, ${profile.colors.secondary}
- Use EXACT fonts: ${profile.typography.headingFont.family}, ${profile.typography.bodyFont.family}
- Use EXACT radius: ${profile.designSystem.borderRadius.buttons} for buttons, ${profile.designSystem.borderRadius.cards} for cards
- Use EXACT shadows: ${profile.designSystem.shadows.cardDefault}
- Match the EXACT section order from the blueprints below
- Match the EXACT card/button/input styles
${siteType === 'ecommerce' ? `
## E-COMMERCE SPECIFIC RULES
- Every product card MUST have: image, name, price, rating, add-to-cart button
- Prices must look real ($29.99 - $89.99 range)
- Use real-looking product names for ${profile.meta.industry}
- Include color swatches on product cards
- Hero must be a promotional banner, not a text-heavy SaaS hero
- Include trust badges: free shipping, secure checkout, easy returns
- Footer must have: Shop, Support, About columns + payment icons + social links
` : ''}
## OUTPUT FORMAT
- Return ONLY complete HTML: <!DOCTYPE html> to </html>
- ALL CSS in a single <style> tag in <head>
- ALL JavaScript in a single <script> tag before </body>
- NO markdown, NO explanations, NO preamble
- Must be 100% mobile responsive`;
}

// =============================================================================
// BUILD DESIGN DNA — Same as before but cleaner
// =============================================================================

function buildDesignDNA(profile: KingForensicProfile): string {
  return `
## ═══ DESIGN DNA FROM: ${profile.meta.kingName} ═══

### GOOGLE FONTS
${profile.typography.headingFont.googleFontsUrl || 'Use system fonts'}
${profile.typography.bodyFont.googleFontsUrl !== profile.typography.headingFont.googleFontsUrl ? profile.typography.bodyFont.googleFontsUrl : ''}

### CSS CUSTOM PROPERTIES
:root {
  --primary: ${profile.colors.primary};
  --primary-rgb: ${profile.colors.primaryRgb || '0,0,0'};
  --secondary: ${profile.colors.secondary};
  --accent: ${profile.colors.accent};
  --bg-main: ${profile.colors.backgrounds.main};
  --bg-secondary: ${profile.colors.backgrounds.secondary};
  --bg-dark: ${profile.colors.backgrounds.dark};
  --bg-card: ${profile.colors.backgrounds.card};
  --text-primary: ${profile.colors.text.primary};
  --text-secondary: ${profile.colors.text.secondary};
  --text-muted: ${profile.colors.text.muted};
  --border-default: ${profile.colors.borders.default};
  --font-heading: '${profile.typography.headingFont.family}', sans-serif;
  --font-body: '${profile.typography.bodyFont.family}', sans-serif;
  --shadow-sm: ${profile.designSystem.shadows.sm};
  --shadow-md: ${profile.designSystem.shadows.md};
  --shadow-card: ${profile.designSystem.shadows.cardDefault};
  --shadow-card-hover: ${profile.designSystem.shadows.cardHover};
  --radius-sm: ${profile.designSystem.borderRadius.small};
  --radius-md: ${profile.designSystem.borderRadius.medium};
  --radius-lg: ${profile.designSystem.borderRadius.large};
  --radius-button: ${profile.designSystem.borderRadius.buttons};
  --radius-card: ${profile.designSystem.borderRadius.cards};
  --container-max: ${profile.designSystem.containerMaxWidth};
  --section-padding: ${profile.designSystem.sectionPadding.desktop};
  --transition: ${profile.animations.transition.default};
}

### TYPOGRAPHY SCALE
- h1: ${profile.typography.scale.h1.size}; weight: ${profile.typography.scale.h1.weight}; line-height: ${profile.typography.scale.h1.lineHeight}; letter-spacing: ${profile.typography.scale.h1.letterSpacing}; text-transform: ${profile.typography.scale.h1.textTransform}
- h2: ${profile.typography.scale.h2.size}; weight: ${profile.typography.scale.h2.weight}; line-height: ${profile.typography.scale.h2.lineHeight}
- h3: ${profile.typography.scale.h3.size}; weight: ${profile.typography.scale.h3.weight}
- h4: ${profile.typography.scale.h4.size}; weight: ${profile.typography.scale.h4.weight}
- body: ${profile.typography.scale.body.size}; weight: ${profile.typography.scale.body.weight}; line-height: ${profile.typography.scale.body.lineHeight}

### BUTTON STYLES
PRIMARY: bg ${profile.designSystem.buttonStyles.primary.backgroundColor}; color ${profile.designSystem.buttonStyles.primary.textColor}; radius ${profile.designSystem.buttonStyles.primary.borderRadius}; padding ${profile.designSystem.buttonStyles.primary.padding}; font-weight ${profile.designSystem.buttonStyles.primary.fontWeight}; text-transform ${profile.designSystem.buttonStyles.primary.textTransform}; hover: ${profile.designSystem.buttonStyles.primary.hoverTransform}
SECONDARY: bg ${profile.designSystem.buttonStyles.secondary.backgroundColor}; color ${profile.designSystem.buttonStyles.secondary.textColor}; border ${profile.designSystem.buttonStyles.secondary.border}; radius ${profile.designSystem.buttonStyles.secondary.borderRadius}

### CARD STYLES
bg ${profile.designSystem.cardStyles.background}; border ${profile.designSystem.cardStyles.border}; radius ${profile.designSystem.cardStyles.borderRadius}; shadow ${profile.designSystem.cardStyles.shadow}; hover: ${profile.designSystem.cardStyles.hoverTransform}, shadow: ${profile.designSystem.cardStyles.hoverShadow}

### NAVIGATION
Type: ${profile.navigation.type}; Height: ${profile.navigation.height}; BG: ${profile.navigation.backgroundColor}; Cart icon: ${profile.navigation.hasCartIcon}; Search: ${profile.navigation.hasSearch}; Font: ${profile.navigation.fontFamily} ${profile.navigation.fontSize} ${profile.navigation.fontWeight}; Text-transform: ${profile.navigation.textTransform}
${profile.navigation.ctaButton ? `Nav CTA: "${profile.navigation.ctaButton.text}" — ${profile.navigation.ctaButton.style}, color: ${profile.navigation.ctaButton.color}, radius: ${profile.navigation.ctaButton.borderRadius}` : ''}

### FOOTER
Layout: ${profile.footer.layout}; Columns: ${profile.footer.columns}; BG: ${profile.footer.backgroundColor}; Text: ${profile.footer.textColor}; Newsletter: ${profile.footer.hasNewsletter}; Social: ${profile.footer.hasSocialIcons}
${profile.footer.columnContent?.map((c: any) => `  "${c.heading}": [${c.links.join(', ')}]`).join('\n') || ''}

### ANIMATIONS
Scroll reveal: ${profile.animations.scrollReveal.enabled ? `${profile.animations.scrollReveal.type}, ${profile.animations.scrollReveal.duration}` : 'none'}
Card hover: ${profile.animations.hoverEffects.cards}
Button hover: ${profile.animations.hoverEffects.buttons}
Transition: ${profile.animations.transition.default}

### THEME
${profile.colors.isDarkTheme ? 'DARK THEME — dark backgrounds, light text' : 'LIGHT THEME — light backgrounds, dark text'}`;
}

// =============================================================================
// BUILD PAGE BLUEPRINT — Section-by-section with content skeletons
// =============================================================================

function buildPageBlueprint(
  profile: KingForensicProfile,
  customer: CustomerQuestionnaire,
  siteType: string
): string {
  let blueprint = `
## ═══ PAGE BLUEPRINT ═══
## Build these sections IN THIS EXACT ORDER.
## Each section describes EXACTLY what elements to include.
## Do NOT skip sections. Do NOT add sections not listed here.
## Do NOT simplify sections into generic cards.

`;

  // Build blueprint for each extracted section
  profile.sections.forEach((section, i) => {
    blueprint += getSectionBlueprint(section, siteType, profile, customer, i);
    blueprint += '\n\n';
  });

  // If e-commerce and no product section was found, force one
  if (siteType === 'ecommerce') {
    const hasProductSection = profile.sections.some(s => {
      const t = (s.type + s.name + s.contentPattern).toLowerCase();
      return t.includes('product') || t.includes('shop') || t.includes('collection') || t.includes('catalog');
    });
    
    if (!hasProductSection) {
      blueprint += `
## SECTION: PRODUCT GRID (REQUIRED FOR E-COMMERCE — was not detected in King but MUST be included)
This is an E-COMMERCE site. You MUST include a product grid section.

REQUIRED PRODUCT CARD STRUCTURE:
1. Product image (aspect-ratio 3:4, object-fit: cover)
2. Product name
3. Price ("$XX.XX")
4. Star rating ★★★★★ + review count
5. ADD TO CART button

Grid: 4 columns desktop, 2 mobile. Show 8 products.
Use realistic product names and prices for ${customer.industry}.

`;
    }
  }

  return blueprint;
}

// =============================================================================
// BUILD CUSTOMER CONTENT
// =============================================================================

function buildCustomerContent(customer: CustomerQuestionnaire): string {
  return `
## ═══ CUSTOMER CONTENT (use this for ALL text content) ═══

Business Name: ${customer.businessName}
Industry: ${customer.industry}
Description: ${customer.description}
Target Audience: ${customer.targetAudience}
Website Goal: ${customer.websiteGoal}

Services/Products: ${customer.services.length > 0 ? customer.services.join(', ') : customer.uniqueSellingPoints.join(', ') || 'Professional services'}
Key Differentiators: ${customer.uniqueSellingPoints.join(', ') || 'Quality, expertise, customer satisfaction'}

Contact:
- Email: ${customer.contactInfo.email}
- Phone: ${customer.contactInfo.phone}
- Address: ${customer.contactInfo.address}

${customer.testimonials && customer.testimonials.length > 0 ? `
Testimonials:
${customer.testimonials.map(t => `- "${t.text}" — ${t.name}, ${t.role}`).join('\n')}
` : `Generate 3 realistic testimonials for a ${customer.industry} business.`}

${customer.pricing && customer.pricing.length > 0 ? `
Pricing:
${customer.pricing.map(p => `- ${p.name}: ${p.price} (${p.features.join(', ')})`).join('\n')}
` : ''}

${customer.faqs && customer.faqs.length > 0 ? `
FAQs:
${customer.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}
` : ''}

IMAGES: Use high-quality Unsplash images relevant to ${customer.industry}.
Format: https://images.unsplash.com/photo-XXXX?w=800&q=80
Search terms: ${customer.industry}, ${customer.businessName.toLowerCase()}, professional`;
}

// =============================================================================
// MAIN GENERATION FUNCTION
// =============================================================================

export async function generateFromKingDNA(
  profile: KingForensicProfile,
  customer: CustomerQuestionnaire
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  // Detect what KIND of site this King is
  const siteType = detectSiteType(profile);
  console.log(`[KingGenerator] Site type detected: ${siteType}`);
  console.log(`[KingGenerator] Sections: ${profile.sections.length}`);
  console.log(`[KingGenerator] King: ${profile.meta.kingName}`);

  // Build the complete prompt
  const systemPrompt = buildSystemPrompt(profile, siteType);

  const userPrompt = `${buildDesignDNA(profile)}

${buildPageBlueprint(profile, customer, siteType)}

${buildCustomerContent(customer)}

## ═══ FINAL INSTRUCTIONS ═══

1. Build EVERY section from the blueprint above — same order, same structure
2. Use EVERY design spec from the DNA above — exact colors, fonts, spacing, shadows
3. Fill with the CUSTOMER'S content — not the King's content
4. Make it look like you went to ${profile.meta.kingName}'s website and rebuilt it for ${customer.businessName}
${siteType === 'ecommerce' ? `
5. THIS IS AN ONLINE STORE. Include product grids with real prices and add-to-cart buttons.
6. Do NOT make this look like a landing page or portfolio. It must look like a SHOP.
7. Product cards MUST have: image, name, price, rating, add-to-cart button.
8. Include trust badges and newsletter signup.
` : ''}
Output ONLY the complete HTML starting with <!DOCTYPE html>.`;

  // Call Claude
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
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error.substring(0, 200)}`);
  }

  const data = await response.json();
  let html = data.content[0].text.trim();

  // Clean markdown artifacts
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) html = html.substring(doctypeIndex);

  console.log(`[KingGenerator] Generated ${(html.length / 1024).toFixed(1)}KB HTML`);
  return html;
}

// =============================================================================
// REVISION FUNCTION (King-aware)
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
      system: `You are editing a ${siteType} website built from ${profile.meta.kingName}'s design DNA.

MAINTAIN these design specs while editing:
- Colors: ${profile.colors.primary}, ${profile.colors.secondary}, ${profile.colors.accent}
- Fonts: ${profile.typography.headingFont.family}, ${profile.typography.bodyFont.family}
- Button style: bg ${profile.designSystem.buttonStyles.primary.backgroundColor}, radius ${profile.designSystem.buttonStyles.primary.borderRadius}
- Card style: radius ${profile.designSystem.cardStyles.borderRadius}, shadow ${profile.designSystem.cardStyles.shadow}
${siteType === 'ecommerce' ? '\nThis is an E-COMMERCE site. Keep product grids, prices, add-to-cart buttons, and trust badges.' : ''}

Apply the requested change while keeping the ${profile.meta.kingName} design DNA intact.
Output ONLY the complete updated HTML.`,
      messages: [{
        role: 'user',
        content: `Apply this change: ${editRequest}

Current HTML (first 20KB):
${currentHtml.substring(0, 20000)}

Return the COMPLETE updated HTML starting with <!DOCTYPE html>.`,
      }],
    }),
  });

  if (!response.ok) throw new Error('Revision failed');

  const data = await response.json();
  let html = data.content[0].text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  return html;
}
