// /lib/ai/king-generator.ts
// VERKTORLABS - King DNA Website Generator
//
// This is the generation engine. It takes the forensic profile extracted
// from a King's website and the customer's questionnaire, then generates
// a website that uses the EXACT design patterns from the King but with
// the customer's content.
//
// The key insight: we don't say "make it premium". We say "use exactly
// this border-radius, this shadow, this font-size, this color, this layout."

import type { KingForensicProfile, CustomerQuestionnaire } from './king-forensic-profile';

// =============================================================================
// GENERATION SYSTEM PROMPT
// =============================================================================

function buildSystemPrompt(profile: KingForensicProfile): string {
  return `You are a precision website builder. You have received the exact design DNA extracted from ${profile.meta.kingName}'s website. Your job is to BUILD a website using these EXACT specifications — do NOT deviate, do NOT assume, do NOT add your own creative interpretation.

## YOUR ROLE
You are a machine that translates design specifications into code. Every value below was forensically extracted from a successful website. Use them EXACTLY as provided.

## CRITICAL RULES
1. Use the EXACT color hex codes provided — not "similar" colors
2. Use the EXACT font families and sizes — not "close enough" alternatives
3. Replicate the EXACT layout patterns described — same grid columns, same gaps
4. Apply the EXACT border-radius values — not rounded alternatives
5. Use the EXACT shadow values — copy them character for character
6. Apply the EXACT animation and transition values
7. Follow the EXACT section order provided
8. Match the EXACT button styles (padding, radius, shadow, hover effect)
9. Match the EXACT card styles (padding, border, shadow, hover)
10. Match the EXACT spacing (section padding, container width, element gaps)

## WHAT YOU CUSTOMIZE (from the customer questionnaire):
- Business name and branding text
- Copy/headlines (follow the King's copywriting FORMULA but with customer's content)
- Contact information
- Services/products (using the King's card/layout pattern)
- Testimonials (using the King's testimonial layout)
- Images (use relevant Unsplash images for the customer's industry)

## WHAT YOU DO NOT CUSTOMIZE:
- Colors, typography, spacing, shadows, animations, border-radius, layouts
- These come DIRECTLY from the King's DNA

## OUTPUT FORMAT
- Return ONLY the complete HTML file
- Start with <!DOCTYPE html>, end with </html>
- ALL CSS in a single <style> tag in <head>
- ALL JavaScript in a single <script> tag before </body>
- NO explanations, NO markdown, NO preamble
- Must be 100% complete and functional
- Must be fully mobile responsive`;
}

// =============================================================================
// BUILD THE DESIGN DNA SPECIFICATION
// =============================================================================

function buildDesignDNA(profile: KingForensicProfile): string {
  return `
## ═══════════════════════════════════════════════════════
## DESIGN DNA — EXTRACTED FROM: ${profile.meta.kingName}
## Use these values EXACTLY. No interpretation. No deviation.
## ═══════════════════════════════════════════════════════

### GOOGLE FONTS IMPORT
${profile.typography.headingFont.googleFontsUrl}
${profile.typography.headingFont.googleFontsUrl !== profile.typography.bodyFont.googleFontsUrl ? profile.typography.bodyFont.googleFontsUrl : '(same as heading font import)'}

### CSS CUSTOM PROPERTIES (use these in :root)
\`\`\`
:root {
  /* Colors */
  --primary: ${profile.colors.primary};
  --primary-rgb: ${profile.colors.primaryRgb};
  --primary-dark: ${profile.colors.primaryDark};
  --primary-light: ${profile.colors.primaryLight};
  --secondary: ${profile.colors.secondary};
  --secondary-rgb: ${profile.colors.secondaryRgb};
  --accent: ${profile.colors.accent};
  --accent-rgb: ${profile.colors.accentRgb};
  
  /* Backgrounds */
  --bg-primary: ${profile.colors.background.main};
  --bg-secondary: ${profile.colors.background.secondary};
  --bg-tertiary: ${profile.colors.background.tertiary};
  --bg-dark: ${profile.colors.background.dark};
  --bg-card: ${profile.colors.background.card};
  
  /* Text */
  --text-primary: ${profile.colors.text.primary};
  --text-secondary: ${profile.colors.text.secondary};
  --text-muted: ${profile.colors.text.muted};
  --text-inverse: ${profile.colors.text.inverse};
  --text-link: ${profile.colors.text.link};
  
  /* Borders */
  --border-light: ${profile.colors.border.light};
  --border-dark: ${profile.colors.border.dark};
  --border-focus: ${profile.colors.border.focus};
  
  /* Typography */
  --font-display: ${profile.typography.headingFont.family};
  --font-body: ${profile.typography.bodyFont.family};
  
  /* Transitions */
  --transition-default: ${profile.animations.transition.default};
  --transition-fast: ${profile.animations.transition.fast};
  --transition-slow: ${profile.animations.transition.slow};
  
  /* Shadows */
  --shadow-sm: ${profile.designSystem.shadows.sm};
  --shadow-md: ${profile.designSystem.shadows.md};
  --shadow-lg: ${profile.designSystem.shadows.lg};
  --shadow-xl: ${profile.designSystem.shadows.xl};
  --shadow-card: ${profile.designSystem.shadows.cardDefault};
  --shadow-card-hover: ${profile.designSystem.shadows.cardHover};
  --shadow-button: ${profile.designSystem.shadows.buttonDefault};
  --shadow-button-hover: ${profile.designSystem.shadows.buttonHover};
  --shadow-glow: ${profile.designSystem.shadows.glow};
  
  /* Border Radius */
  --radius-sm: ${profile.designSystem.borderRadius.small};
  --radius-md: ${profile.designSystem.borderRadius.medium};
  --radius-lg: ${profile.designSystem.borderRadius.large};
  --radius-xl: ${profile.designSystem.borderRadius.xl};
  --radius-full: ${profile.designSystem.borderRadius.full};
  --radius-button: ${profile.designSystem.borderRadius.buttons};
  --radius-card: ${profile.designSystem.borderRadius.cards};
  --radius-image: ${profile.designSystem.borderRadius.images};
  --radius-input: ${profile.designSystem.borderRadius.inputs};
  
  /* Spacing */
  --container-max: ${profile.designSystem.containerMaxWidth};
  --container-padding: ${profile.designSystem.containerPadding};
  --section-padding: ${profile.designSystem.sectionPadding.desktop};
  --section-padding-mobile: ${profile.designSystem.sectionPadding.mobile};
}
\`\`\`

### TYPOGRAPHY SCALE (use these EXACT values)
- h1: font-size: ${profile.typography.scale.h1.size}; font-weight: ${profile.typography.scale.h1.weight}; line-height: ${profile.typography.scale.h1.lineHeight}; letter-spacing: ${profile.typography.scale.h1.letterSpacing}; text-transform: ${profile.typography.scale.h1.textTransform};
- h2: font-size: ${profile.typography.scale.h2.size}; font-weight: ${profile.typography.scale.h2.weight}; line-height: ${profile.typography.scale.h2.lineHeight}; letter-spacing: ${profile.typography.scale.h2.letterSpacing}; text-transform: ${profile.typography.scale.h2.textTransform};
- h3: font-size: ${profile.typography.scale.h3.size}; font-weight: ${profile.typography.scale.h3.weight}; line-height: ${profile.typography.scale.h3.lineHeight}; letter-spacing: ${profile.typography.scale.h3.letterSpacing};
- h4: font-size: ${profile.typography.scale.h4.size}; font-weight: ${profile.typography.scale.h4.weight}; line-height: ${profile.typography.scale.h4.lineHeight};
- body: font-size: ${profile.typography.scale.body.size}; font-weight: ${profile.typography.scale.body.weight}; line-height: ${profile.typography.scale.body.lineHeight};
- small: font-size: ${profile.typography.scale.small.size};
- Section labels: font-size: ${profile.typography.sectionLabel.fontSize}; font-weight: ${profile.typography.sectionLabel.fontWeight}; letter-spacing: ${profile.typography.sectionLabel.letterSpacing}; text-transform: ${profile.typography.sectionLabel.textTransform}; style: ${profile.typography.sectionLabel.style};

### DARK/LIGHT THEME
isDarkTheme: ${profile.colors.isDarkTheme}
${profile.colors.isDarkTheme ? 'Build with dark background and light text as the default.' : 'Build with light background and dark text as the default.'}
Selection color: ${profile.colors.selectionColor}

### GRADIENTS
- Primary gradient: ${profile.colors.gradients.primary}
- Hero gradient: ${profile.colors.gradients.hero}
- Accent gradient: ${profile.colors.gradients.accent}
- Text gradient: ${profile.colors.gradients.text}`;
}

// =============================================================================
// BUILD THE COMPONENT SPECIFICATIONS
// =============================================================================

function buildComponentSpecs(profile: KingForensicProfile): string {
  const nav = profile.navigation;
  const hero = profile.hero;
  const ds = profile.designSystem;
  const anim = profile.animations;
  const footer = profile.footer;

  return `
### ═══ NAVIGATION ═══
- Type: ${nav.type}
- Height: ${nav.height}
- Background: ${nav.backgroundColor}
- Background on scroll: ${nav.backgroundOnScroll}
- Logo: ${nav.logoPlacement} placement, style: ${nav.logoStyle}
- Menu alignment: ${nav.menuAlignment}
- Menu items: ${nav.menuItems.map(m => `"${m.label}"${m.hasDropdown ? ' (dropdown)' : ''}`).join(', ')}
- CTA button: ${nav.ctaButton ? `"${nav.ctaButton.text}" — style: ${nav.ctaButton.style}, color: ${nav.ctaButton.color}, radius: ${nav.ctaButton.borderRadius}` : 'none'}
- Has search: ${nav.hasSearch}
- Has cart icon: ${nav.hasCartIcon}
- Mobile menu: ${nav.mobileMenuType}
- Backdrop blur: ${nav.backdropBlur}
- Border bottom: ${nav.borderBottom}
- Padding: ${nav.padding}
- Font: ${nav.fontFamily}, ${nav.fontSize}, ${nav.fontWeight}
- Letter spacing: ${nav.letterSpacing}
- Text transform: ${nav.textTransform}

### ═══ HERO SECTION ═══
- Layout: ${hero.layout}
- Height: ${hero.height}
- Content alignment: ${hero.contentAlignment}
- Headline: font-size: ${hero.headline.fontSize}; font-weight: ${hero.headline.fontWeight}; font-family: ${hero.headline.fontFamily}; line-height: ${hero.headline.lineHeight}; letter-spacing: ${hero.headline.letterSpacing}; color: ${hero.headline.color}; max-width: ${hero.headline.maxWidth}; text-transform: ${hero.headline.textTransform}
- Has gradient text: ${hero.headline.hasGradient}${hero.headline.hasGradient ? ` (${hero.headline.gradientColors})` : ''}
- Subheadline: font-size: ${hero.subheadline.fontSize}; font-weight: ${hero.subheadline.fontWeight}; color: ${hero.subheadline.color}; line-height: ${hero.subheadline.lineHeight}; max-width: ${hero.subheadline.maxWidth}
- CTA buttons:
${hero.ctaButtons.map((btn, i) => `  Button ${i + 1}: "${btn.text}" — style: ${btn.style}, bg: ${btn.backgroundColor}, text: ${btn.textColor}, radius: ${btn.borderRadius}, padding: ${btn.padding}, font-size: ${btn.fontSize}, font-weight: ${btn.fontWeight}, hover: ${btn.hoverEffect}${btn.hasIcon ? `, icon: ${btn.iconPosition}` : ''}`).join('\n')}
- Overlay: ${hero.hasOverlay ? `yes — color: ${hero.overlayColor}, opacity: ${hero.overlayOpacity}` : 'no'}
- Background style: ${hero.backgroundImageStyle}
- Social proof: ${hero.socialProof ? `type: ${hero.socialProof.type}, text: "${hero.socialProof.text}", placement: ${hero.socialProof.placement}` : 'none'}
- Decorative elements: ${hero.decorativeElements.length > 0 ? hero.decorativeElements.join(', ') : 'none'}
- Padding: top: ${hero.padding.top}, bottom: ${hero.padding.bottom}
- Content gap: ${hero.contentGap}
- Headline formula: "${hero.headline.formula}"

### ═══ BUTTON STYLES ═══
PRIMARY BUTTON:
  background: ${ds.buttonStyles.primary.backgroundColor}
  color: ${ds.buttonStyles.primary.textColor}
  border: ${ds.buttonStyles.primary.border}
  border-radius: ${ds.buttonStyles.primary.borderRadius}
  padding: ${ds.buttonStyles.primary.padding}
  font-size: ${ds.buttonStyles.primary.fontSize}
  font-weight: ${ds.buttonStyles.primary.fontWeight}
  letter-spacing: ${ds.buttonStyles.primary.letterSpacing}
  text-transform: ${ds.buttonStyles.primary.textTransform}
  shadow: ${ds.buttonStyles.primary.shadow}
  hover-transform: ${ds.buttonStyles.primary.hoverTransform}
  hover-shadow: ${ds.buttonStyles.primary.hoverShadow}
  hover-bg: ${ds.buttonStyles.primary.hoverBg}
  transition: ${ds.buttonStyles.primary.transition}

SECONDARY BUTTON:
  background: ${ds.buttonStyles.secondary.backgroundColor}
  color: ${ds.buttonStyles.secondary.textColor}
  border: ${ds.buttonStyles.secondary.border}
  border-radius: ${ds.buttonStyles.secondary.borderRadius}
  padding: ${ds.buttonStyles.secondary.padding}
  hover: ${ds.buttonStyles.secondary.hoverEffect}

### ═══ CARD STYLES ═══
  background: ${ds.cardStyles.background}
  border: ${ds.cardStyles.border}
  border-radius: ${ds.cardStyles.borderRadius}
  padding: ${ds.cardStyles.padding}
  shadow: ${ds.cardStyles.shadow}
  hover-transform: ${ds.cardStyles.hoverTransform}
  hover-shadow: ${ds.cardStyles.hoverShadow}
  hover-border: ${ds.cardStyles.hoverBorder}
  transition: ${ds.cardStyles.transition}

### ═══ ICON SYSTEM ═══
  style: ${ds.iconSystem.style}
  library: ${ds.iconSystem.library}
  size: ${ds.iconSystem.size}
  color: ${ds.iconSystem.color}
  container: ${ds.iconSystem.containerStyle} (size: ${ds.iconSystem.containerSize}, color: ${ds.iconSystem.containerColor})

### ═══ IMAGE STYLES ═══
  border-radius: ${ds.imageStyles.borderRadius}
  aspect-ratio: ${ds.imageStyles.aspectRatio}
  object-fit: ${ds.imageStyles.objectFit}
  filter: ${ds.imageStyles.filter}
  hover: ${ds.imageStyles.hoverEffect}

### ═══ FORM/INPUT STYLES ═══
  background: ${ds.inputStyles.backgroundColor}
  border: ${ds.inputStyles.border}
  border-radius: ${ds.inputStyles.borderRadius}
  padding: ${ds.inputStyles.padding}
  font-size: ${ds.inputStyles.fontSize}
  focus-border: ${ds.inputStyles.focusBorder}
  focus-shadow: ${ds.inputStyles.focusShadow}
  placeholder: ${ds.inputStyles.placeholder}

### ═══ ANIMATIONS ═══
Page load: ${anim.pageLoad}
Scroll reveal: ${anim.scrollReveal.enabled ? `YES — type: ${anim.scrollReveal.type}, duration: ${anim.scrollReveal.duration}, delay: ${anim.scrollReveal.delay}, stagger: ${anim.scrollReveal.stagger}, threshold: ${anim.scrollReveal.threshold}` : 'NO'}
Hover effects:
  Cards: ${anim.hoverEffects.cards}
  Buttons: ${anim.hoverEffects.buttons}
  Links: ${anim.hoverEffects.links}
  Images: ${anim.hoverEffects.images}
Special animations: ${anim.specialAnimations.length > 0 ? anim.specialAnimations.join(', ') : 'none'}
Respects prefers-reduced-motion: ${anim.prefersReducedMotion}

### ═══ SECTION STRUCTURE (build in this EXACT order) ═══
${profile.sections.map((s, i) => `
${i + 1}. ${s.name.toUpperCase()}
   Type: ${s.type}
   Layout: ${s.layout}
   Grid: ${s.gridColumns} columns, gap: ${s.gridGap}
   Background: ${s.backgroundColor}
   Padding: top: ${s.padding.top}, bottom: ${s.padding.bottom}
   Container: ${s.containerWidth}
   Animation: ${s.hasAnimation ? s.animationType : 'none'}
   Header style: ${s.headerStyle}
   Content pattern: ${s.contentPattern}
   Special elements: ${s.specialElements.length > 0 ? s.specialElements.join(', ') : 'none'}
`).join('')}

### ═══ FOOTER ═══
  Layout: ${footer.layout}
  Columns: ${footer.columns}
  Background: ${footer.backgroundColor}
  Text color: ${footer.textColor}
  Newsletter: ${footer.hasNewsletter ? `yes — style: ${footer.newsletterStyle}` : 'no'}
  Social icons: ${footer.hasSocialIcons ? `yes — style: ${footer.socialIconStyle}` : 'no'}
  CTA section: ${footer.hasCtaSection ? `yes — "${footer.ctaText}"` : 'no'}
  Legal links: ${footer.legalLinks.join(', ')}
  Padding: ${footer.padding}
  Border top: ${footer.borderTop}
  Bottom bar: ${footer.bottomBarStyle}
  Column content: ${footer.columnContent.map(c => `"${c.heading}": [${c.links.join(', ')}]`).join(' | ')}

### ═══ MOBILE BEHAVIOR ═══
  Breakpoints: tablet: ${profile.mobile.breakpoints.tablet}, mobile: ${profile.mobile.breakpoints.mobile}
  Nav behavior: ${profile.mobile.navBehavior}
  Hero changes: ${profile.mobile.heroChanges}
  Grid behavior: ${profile.mobile.gridBehavior}
  Section padding: ${profile.mobile.sectionPaddingMobile}
  Hidden on mobile: ${profile.mobile.hiddenOnMobile.join(', ') || 'nothing'}
  Font reductions: ${Object.entries(profile.mobile.fontSizeReductions).map(([k, v]) => `${k}: ${v}`).join(', ')}

### ═══ DIVIDER/SECTION SEPARATOR ═══
  Style: ${ds.dividerStyle}

${profile.uniqueElements && profile.uniqueElements.length > 0 ? `
### ═══ UNIQUE/SPECIAL ELEMENTS ═══
${profile.uniqueElements.map(el => `
  Description: ${el.description}
  CSS: ${el.cssSnippet}
  HTML: ${el.htmlStructure}
`).join('\n')}` : ''}`;
}

// =============================================================================
// BUILD THE COPYWRITING GUIDE
// =============================================================================

function buildCopywritingGuide(profile: KingForensicProfile): string {
  const copy = profile.copywriting;

  return `
### ═══ COPYWRITING DNA ═══
Follow these EXACT patterns from ${profile.meta.kingName}:

TONE: ${copy.tone}

HEADLINE FORMULAS:
  Hero headline: "${copy.headlineFormulas.hero}"
  Section headlines: "${copy.headlineFormulas.section}"
  Card headlines: "${copy.headlineFormulas.card}"

CTA PATTERNS:
  Primary CTAs: ${copy.ctaPatterns.primary.join(', ')}
  Secondary CTAs: ${copy.ctaPatterns.secondary.join(', ')}
  CTA style: ${copy.ctaPatterns.style}

SOCIAL PROOF: ${copy.socialProofStyle}
TRUST SIGNALS: ${copy.trustSignals.join(', ')}
URGENCY TACTICS: ${copy.urgencyTactics.join(', ')}

EXAMPLE HEADLINES FROM KING (match this level/style):
${copy.exampleHeadlines.map(h => `  → "${h}"`).join('\n')}

EXAMPLE CTAs FROM KING:
${copy.exampleCTAs.map(c => `  → "${c}"`).join('\n')}

IMPORTANT: Write copy that follows these PATTERNS and FORMULAS but uses the CUSTOMER'S business details, services, and value propositions. Do not copy the King's actual text — replicate the structure and approach.`;
}

// =============================================================================
// BUILD THE CUSTOMER CONTENT SECTION
// =============================================================================

function buildCustomerContent(customer: CustomerQuestionnaire): string {
  let content = `
## ═══════════════════════════════════════════════════════
## CUSTOMER CONTENT — Use this for ALL text/content
## ═══════════════════════════════════════════════════════

### BUSINESS INFORMATION
- Business Name: ${customer.businessName}
- Industry: ${customer.industry}
- Description: ${customer.description}
- Target Audience: ${customer.targetAudience}
- Website Goal: ${customer.websiteGoal}
- Unique Selling Points: ${customer.uniqueSellingPoints.join(', ')}

### SERVICES / PRODUCTS
${customer.services.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### FEATURES TO INCLUDE
${customer.features.map(f => `- ${f}`).join('\n')}

### CONTACT INFORMATION
- Email: ${customer.contactInfo.email}
- Phone: ${customer.contactInfo.phone}
- Address: ${customer.contactInfo.address}
`;

  if (customer.socialMedia && Object.keys(customer.socialMedia).length > 0) {
    content += `\n### SOCIAL MEDIA\n${Object.entries(customer.socialMedia).map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n`;
  }

  if (customer.testimonials && customer.testimonials.length > 0) {
    content += `\n### TESTIMONIALS (use these exact testimonials)\n${customer.testimonials.map((t, i) => `${i + 1}. "${t.text}" — ${t.name}, ${t.role} (${t.rating}★)`).join('\n')}\n`;
  }

  if (customer.stats && customer.stats.length > 0) {
    content += `\n### STATS / NUMBERS\n${customer.stats.map(s => `- ${s.number}: ${s.label}`).join('\n')}\n`;
  }

  if (customer.pricing && customer.pricing.length > 0) {
    content += `\n### PRICING TIERS\n${customer.pricing.map(p => `- ${p.name}: ${p.price}${p.isPopular ? ' [POPULAR]' : ''}\n  Features: ${p.features.join(', ')}`).join('\n')}\n`;
  }

  if (customer.faqs && customer.faqs.length > 0) {
    content += `\n### FAQ\n${customer.faqs.map((f, i) => `${i + 1}. Q: ${f.question}\n   A: ${f.answer}`).join('\n')}\n`;
  }

  return content;
}

// =============================================================================
// BUILD IMAGE GUIDANCE
// =============================================================================

function buildImageGuidance(profile: KingForensicProfile, customer: CustomerQuestionnaire): string {
  return `
### ═══ IMAGE GUIDANCE ═══
Use high-quality Unsplash images that match the CUSTOMER'S industry (${customer.industry}).

Image format: https://images.unsplash.com/photo-[ID]?w=[WIDTH]&q=80

Image styling rules (from King DNA):
- Border radius: ${profile.designSystem.imageStyles.borderRadius}
- Aspect ratio: ${profile.designSystem.imageStyles.aspectRatio}
- Object fit: ${profile.designSystem.imageStyles.objectFit}
- Filter: ${profile.designSystem.imageStyles.filter}
- Hover effect: ${profile.designSystem.imageStyles.hoverEffect}

Search for images matching: ${customer.industry}, ${customer.description.split(' ').slice(0, 5).join(' ')}

For hero: use a wide, impactful image relevant to "${customer.industry}"
For sections: use images that match each section's content
For team/testimonials: use professional headshot-style images`;
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

  // Build the complete prompt
  const systemPrompt = buildSystemPrompt(profile);

  const userPrompt = `${buildDesignDNA(profile)}

${buildComponentSpecs(profile)}

${buildCopywritingGuide(profile)}

${buildCustomerContent(customer)}

${buildImageGuidance(profile, customer)}

## ═══════════════════════════════════════════════════════
## FINAL INSTRUCTIONS
## ═══════════════════════════════════════════════════════

Now generate the complete website.

1. Use EVERY design specification from the King DNA above
2. Fill with the CUSTOMER'S content above
3. Follow the EXACT section order from the King
4. Write copy using the King's copywriting FORMULAS applied to the customer's business
5. Include ALL CSS custom properties in :root
6. Include scroll reveal JavaScript
7. Include mobile responsive styles
8. Include navigation scroll behavior
9. Include form handling
10. Include smooth scrolling for anchor links

The CSS should read like a direct extraction from ${profile.meta.kingName}'s website.
The content should be 100% about ${customer.businessName}.

Output ONLY the complete HTML starting with <!DOCTYPE html>`;

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
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  let html = data.content[0].text.trim();

  // Clean markdown artifacts
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) html = html.substring(doctypeIndex);

  return html;
}

// =============================================================================
// REVISION FUNCTION (King-aware)
// =============================================================================

export async function reviseFromKingDNA(
  profile: KingForensicProfile,
  currentHtml: string,
  feedback: string,
  customer: CustomerQuestionnaire
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const systemPrompt = `You are a precision website editor. You have the design DNA from ${profile.meta.kingName}.
Apply the requested changes while STRICTLY maintaining the King's design specifications.
Do NOT deviate from the established colors, typography, spacing, shadows, or layout patterns.
Output ONLY the complete updated HTML.`;

  // Include a condensed version of the design DNA for reference
  const designRef = `
DESIGN DNA REFERENCE (${profile.meta.kingName}):
Colors: primary=${profile.colors.primary}, secondary=${profile.colors.secondary}, accent=${profile.colors.accent}, bg=${profile.colors.background.main}
Fonts: heading=${profile.typography.headingFont.family}, body=${profile.typography.bodyFont.family}
Card radius: ${profile.designSystem.borderRadius.cards}, Button radius: ${profile.designSystem.borderRadius.buttons}
Card shadow: ${profile.designSystem.shadows.cardDefault}
Button style: bg=${profile.designSystem.buttonStyles.primary.backgroundColor}, radius=${profile.designSystem.buttonStyles.primary.borderRadius}
Section padding: ${profile.designSystem.sectionPadding.desktop}
Container: ${profile.designSystem.containerMaxWidth}`;

  const userPrompt = `Apply this change: ${feedback}

${designRef}

Business: ${customer.businessName} (${customer.industry})

Current HTML:
${currentHtml.substring(0, 25000)}

Return the COMPLETE updated HTML starting with <!DOCTYPE html>.
Maintain ALL design DNA specifications from ${profile.meta.kingName}.`;

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

  if (!response.ok) throw new Error('Revision failed');

  const data = await response.json();
  let html = data.content[0].text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');

  return html;
}
