// /lib/ai/forensic-extractor.ts
// VERKTORLABS - Forensic Website Extraction Engine
// 
// This is the core competitive moat. It fetches a King's live website,
// sends it to Claude for forensic analysis, and returns a structured
// profile of EVERY design detail — nothing assumed, everything measured.

import type { KingForensicProfile, ExtractionRequest, ExtractionResponse } from './king-forensic-profile';

// =============================================================================
// FORENSIC EXTRACTION PROMPT
// =============================================================================

const FORENSIC_SYSTEM_PROMPT = `You are a forensic web design analyst. Your job is to reverse-engineer websites with SURGICAL PRECISION.

You will receive the raw HTML and CSS of a live website. You must analyze EVERY detail as if you were recreating the website pixel-for-pixel.

## YOUR ANALYSIS METHODOLOGY

### 1. COLOR EXTRACTION
- Find every color value in the CSS (hex, rgb, rgba, hsl)
- Identify which is primary (most used on CTAs/branding), secondary, accent
- Note background colors for each section
- Extract gradient definitions
- Check dark mode / light mode

### 2. TYPOGRAPHY EXTRACTION  
- Identify all font-family declarations
- Find the Google Fonts import URL
- Measure font-size for h1, h2, h3, h4, body, small, captions
- Note font-weight for each level
- Extract line-height, letter-spacing, text-transform
- Identify the section label/badge typography pattern

### 3. LAYOUT FORENSICS
- Measure container max-width
- Section padding (top and bottom, desktop and mobile)
- Grid configurations (columns, gap, breakpoints)
- Content alignment patterns
- Spacing between elements

### 4. COMPONENT DISSECTION
- Navigation: type, height, items, CTA button, behavior on scroll
- Hero: layout type, content structure, imagery approach
- Cards: padding, border-radius, border, shadow, hover effects
- Buttons: all styles (primary, secondary, ghost), sizes, hover states
- Forms: input styling, focus states
- Icons: library used, size, container style

### 5. ANIMATION CATALOG
- Scroll reveal type and settings
- Hover transitions on every interactive element
- Page load animations
- Special animations (gradient shifts, floating elements, counters)
- Transition timing function and duration

### 6. COPYWRITING PATTERNS
- Headline formula (what pattern do they use?)
- CTA text patterns
- Tone and voice
- Social proof placement and style
- Trust signals used

### 7. SITE TYPE IDENTIFICATION
First, determine what KIND of website this is:
- E-COMMERCE: Has product grids, prices, add-to-cart buttons, shopping cart icon, collection pages
- SAAS: Has feature sections, pricing tables, integration logos, signup CTAs
- AGENCY: Has case studies, portfolio, client logos
- RESTAURANT: Has menu sections, reservation buttons, food imagery
- SERVICE: Has service listings, booking CTAs, testimonials
Set meta.overallVibe to include the site type (e.g., "Modern e-commerce store with bold typography" or "Minimalist SaaS landing page")

### 8. SECTION MAPPING (CRITICAL — describe WHAT'S IN each section)
For EVERY section on the page, in exact order, extract:
- The section name and type
- Layout pattern (grid columns, split layout, etc.)
- **contentPattern** — THIS IS THE MOST IMPORTANT FIELD. Describe EXACTLY what elements are inside:
  - For product grids: "Product cards with: product image (3:4 ratio), product name, price ($XX.XX format), star rating with review count, color swatches (3-4 circles), ADD TO CART button"
  - For hero: "Full-width banner image with overlaid headline, subheadline, and CTA button" or "Split layout: text left with headline + CTA, product image right"
  - For testimonials: "Review cards with: star rating, review text, reviewer name, verified badge"
  - For collection categories: "Category image cards with overlaid category name and Shop Now link"
  - Do NOT just say "product grid" — describe every element inside each card/component
- specialElements: list specific elements like "color swatches", "quick-add overlay", "sale badge", "trust badges", "countdown timer", "size selector", "wishlist icon"
- Background color and transitions between sections

### 9. E-COMMERCE SPECIFIC (if applicable)
If this is an e-commerce site, pay special attention to:
- Product card anatomy: image aspect ratio, name position, price format, rating style, button text, hover effects
- Navigation: mega-menu structure, categories (Women/Men/Sale etc.), cart icon, search
- Trust elements: shipping info, return policy, secure checkout badges
- Promotional elements: announcement bars, sale banners, countdown timers
- Newsletter/email capture sections

## CRITICAL RULES
1. NEVER guess or assume. If you can't determine a value, say "not-detected"
2. Extract EXACT CSS values — "16px" not "small", "#1e293b" not "dark blue"  
3. For clamp() values, provide the full clamp() expression
4. Measure everything in px, rem, or the unit used in the source
5. When extracting fonts, provide the FULL Google Fonts URL
6. Note the exact hover transform (e.g., "translateY(-4px) scale(1.02)")
7. Capture the complete box-shadow values
8. For gradients, give the full CSS gradient string

## OUTPUT FORMAT
Return a single JSON object matching the KingForensicProfile schema.
Return ONLY the JSON. No markdown code blocks, no explanations, no preamble.`;

// =============================================================================
// BUILD THE EXTRACTION USER PROMPT
// =============================================================================

function buildExtractionPrompt(
  kingName: string,
  mainPageHtml: string,
  additionalPagesHtml: { url: string; html: string }[] = []
): string {
  let prompt = `## FORENSIC EXTRACTION TARGET: ${kingName}

### MAIN PAGE HTML/CSS:
<website_source>
${mainPageHtml}
</website_source>
`;

  if (additionalPagesHtml.length > 0) {
    for (const page of additionalPagesHtml) {
      prompt += `
### ADDITIONAL PAGE: ${page.url}
<additional_page>
${page.html}
</additional_page>
`;
    }
  }

  prompt += `
## EXTRACTION INSTRUCTIONS

Analyze the above website source code and extract a complete forensic profile.

For each section of the profile, examine the actual HTML structure and CSS declarations.
Do not make assumptions — extract only what you can verify from the source code.

If the website uses inline styles, extract those.
If it uses CSS classes, find the class definitions in the <style> tags.
If it uses CSS custom properties (--var), extract the root definitions AND the computed values.

Return the complete KingForensicProfile as a single JSON object.

IMPORTANT: 
- All color values should be exact hex codes
- All font sizes should include the unit (px, rem, clamp())
- All spacing should include the unit
- Google Fonts URLs should be complete and importable
- Gradient strings should be complete CSS values
- Shadow strings should be complete CSS values
- Transition strings should be complete CSS values

Return ONLY valid JSON. No markdown formatting, no code blocks, no extra text.`;

  return prompt;
}

// =============================================================================
// FETCH WEBSITE HTML
// =============================================================================

async function fetchWebsiteHtml(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();

    // Also try to fetch and inline linked stylesheets
    const cssLinks = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi);
    let inlinedCss = '';

    if (cssLinks) {
      for (const link of cssLinks.slice(0, 5)) { // max 5 stylesheets
        const hrefMatch = link.match(/href=["']([^"']+)["']/);
        if (hrefMatch) {
          let cssUrl = hrefMatch[1];
          if (cssUrl.startsWith('//')) cssUrl = 'https:' + cssUrl;
          else if (cssUrl.startsWith('/')) {
            const urlObj = new URL(url);
            cssUrl = urlObj.origin + cssUrl;
          }

          try {
            const cssResponse = await fetch(cssUrl, {
              headers: { 'User-Agent': 'Mozilla/5.0' },
            });
            if (cssResponse.ok) {
              const cssText = await cssResponse.text();
              inlinedCss += `\n/* === EXTERNAL CSS FROM: ${cssUrl} === */\n${cssText}\n`;
            }
          } catch {
            // skip failed CSS fetches
          }
        }
      }
    }

    // Combine: inject external CSS into the HTML for analysis
    if (inlinedCss) {
      const insertPoint = html.indexOf('</head>');
      if (insertPoint > -1) {
        return html.slice(0, insertPoint) + `<style>${inlinedCss}</style>` + html.slice(insertPoint);
      }
    }

    return html;
  } catch (error) {
    throw new Error(`Website fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// =============================================================================
// TRUNCATE HTML TO FIT CONTEXT
// =============================================================================

function prepareHtmlForAnalysis(html: string, maxChars: number = 120000): string {
  let prepared = html;

  // Remove script tags (except inline ones we care about)
  prepared = prepared.replace(/<script[^>]*src=["'][^"']*["'][^>]*>[\s\S]*?<\/script>/gi, '');

  // Remove tracking/analytics scripts
  prepared = prepared.replace(/<script[^>]*>[\s\S]*?(gtag|analytics|fbq|segment|hotjar|intercom)[\s\S]*?<\/script>/gi, '');

  // Remove SVG sprite sheets (huge, not useful for design analysis)
  prepared = prepared.replace(/<svg[^>]*style=["']display:\s*none["'][^>]*>[\s\S]*?<\/svg>/gi, '');

  // Remove noscript tags
  prepared = prepared.replace(/<noscript>[\s\S]*?<\/noscript>/gi, '');

  // Remove HTML comments
  prepared = prepared.replace(/<!--[\s\S]*?-->/g, '');

  // Remove data-* attributes (noise)
  prepared = prepared.replace(/\s+data-[a-z-]+=["'][^"']*["']/gi, '');

  // Collapse whitespace
  prepared = prepared.replace(/\n\s*\n\s*\n/g, '\n\n');
  prepared = prepared.replace(/\s{4,}/g, '  ');

  // Truncate if still too long
  if (prepared.length > maxChars) {
    // Keep head (CSS) and first part of body
    const headEnd = prepared.indexOf('</head>');
    const headContent = prepared.slice(0, headEnd + 7);
    const bodyStart = prepared.indexOf('<body');
    const remaining = maxChars - headContent.length - 500;
    const bodyContent = prepared.slice(bodyStart, bodyStart + remaining);

    prepared = headContent + '\n' + bodyContent + '\n<!-- [TRUNCATED] -->\n</body></html>';
  }

  return prepared;
}

// =============================================================================
// MAIN EXTRACTION FUNCTION
// =============================================================================

export async function extractKingProfile(request: ExtractionRequest): Promise<ExtractionResponse> {
  const startTime = Date.now();

  try {
    // 1. Fetch the King's website
    console.log(`[Forensic Extractor] Fetching: ${request.kingUrl}`);
    const mainHtml = await fetchWebsiteHtml(request.kingUrl);

    // 2. Fetch additional pages if specified
    const additionalPages: { url: string; html: string }[] = [];
    if (request.additionalPages) {
      for (const pageUrl of request.additionalPages.slice(0, 3)) { // max 3 extra pages
        try {
          const pageHtml = await fetchWebsiteHtml(pageUrl);
          additionalPages.push({
            url: pageUrl,
            html: prepareHtmlForAnalysis(pageHtml, 30000), // smaller limit for extra pages
          });
        } catch {
          console.log(`[Forensic Extractor] Skipping extra page: ${pageUrl}`);
        }
      }
    }

    // 3. Prepare HTML for analysis
    const preparedHtml = prepareHtmlForAnalysis(mainHtml);

    // 4. Build the extraction prompt
    const userPrompt = buildExtractionPrompt(request.kingName, preparedHtml, additionalPages);

    // 5. Send to Claude for forensic analysis
    console.log(`[Forensic Extractor] Sending to Claude for analysis (${preparedHtml.length} chars)...`);

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
        system: FORENSIC_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let resultText = data.content[0].text.trim();

    // 6. Clean and parse the JSON response
    // Remove any markdown code blocks if present
    resultText = resultText.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '');

    // Find the JSON object boundaries
    const jsonStart = resultText.indexOf('{');
    const jsonEnd = resultText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No valid JSON found in extraction response');
    }
    resultText = resultText.slice(jsonStart, jsonEnd + 1);

    const profile: KingForensicProfile = JSON.parse(resultText);

    // 7. Enrich the profile with meta data
    profile.meta = {
      ...profile.meta,
      kingName: request.kingName,
      url: request.kingUrl,
      industry: request.industry,
      extractedAt: new Date().toISOString(),
      pagesAnalyzed: [request.kingUrl, ...(request.additionalPages || [])],
    };

    const extractionTime = Date.now() - startTime;
    console.log(`[Forensic Extractor] Extraction complete in ${extractionTime}ms`);

    return {
      success: true,
      profile,
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
      extractionTime,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown extraction error';
    console.error(`[Forensic Extractor] Error: ${message}`);

    return {
      success: false,
      profile: null,
      error: message,
      extractionTime: Date.now() - startTime,
    };
  }
}

// =============================================================================
// VALIDATE EXTRACTED PROFILE
// =============================================================================

export function validateProfile(profile: KingForensicProfile): {
  isValid: boolean;
  completeness: number;
  missingFields: string[];
} {
  const missingFields: string[] = [];
  let totalFields = 0;
  let filledFields = 0;

  const checkField = (path: string, value: any) => {
    totalFields++;
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      value === 'not-detected' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      missingFields.push(path);
    } else {
      filledFields++;
    }
  };

  // Check critical fields
  checkField('colors.primary', profile.colors?.primary);
  checkField('colors.secondary', profile.colors?.secondary);
  checkField('colors.background.main', profile.colors?.background?.main);
  checkField('colors.text.primary', profile.colors?.text?.primary);
  checkField('typography.headingFont.family', profile.typography?.headingFont?.family);
  checkField('typography.bodyFont.family', profile.typography?.bodyFont?.family);
  checkField('typography.headingFont.googleFontsUrl', profile.typography?.headingFont?.googleFontsUrl);
  checkField('typography.scale.h1.size', profile.typography?.scale?.h1?.size);
  checkField('typography.scale.body.size', profile.typography?.scale?.body?.size);
  checkField('navigation.type', profile.navigation?.type);
  checkField('navigation.menuItems', profile.navigation?.menuItems);
  checkField('hero.layout', profile.hero?.layout);
  checkField('hero.headline.fontSize', profile.hero?.headline?.fontSize);
  checkField('hero.ctaButtons', profile.hero?.ctaButtons);
  checkField('sections', profile.sections);
  checkField('designSystem.containerMaxWidth', profile.designSystem?.containerMaxWidth);
  checkField('designSystem.borderRadius.buttons', profile.designSystem?.borderRadius?.buttons);
  checkField('designSystem.borderRadius.cards', profile.designSystem?.borderRadius?.cards);
  checkField('designSystem.shadows.cardDefault', profile.designSystem?.shadows?.cardDefault);
  checkField('designSystem.buttonStyles.primary', profile.designSystem?.buttonStyles?.primary);
  checkField('animations.scrollReveal.enabled', profile.animations?.scrollReveal?.enabled);
  checkField('footer.layout', profile.footer?.layout);

  const completeness = Math.round((filledFields / totalFields) * 100);

  return {
    isValid: completeness >= 60,
    completeness,
    missingFields,
  };
}

// =============================================================================
// GET PROFILE SUMMARY (for logging/debugging)
// =============================================================================

export function getProfileSummary(profile: KingForensicProfile): string {
  return `
═══════════════════════════════════════════════════
KING FORENSIC PROFILE: ${profile.meta.kingName}
URL: ${profile.meta.url}
Extracted: ${profile.meta.extractedAt}
═══════════════════════════════════════════════════

COLORS
  Primary: ${profile.colors.primary}
  Secondary: ${profile.colors.secondary}
  Accent: ${profile.colors.accent}
  Background: ${profile.colors.background.main}
  Dark theme: ${profile.colors.isDarkTheme}

TYPOGRAPHY
  Headings: ${profile.typography.headingFont.family} (${profile.typography.headingFont.style})
  Body: ${profile.typography.bodyFont.family} (${profile.typography.bodyFont.style})
  H1: ${profile.typography.scale.h1.size} / ${profile.typography.scale.h1.weight}
  Body: ${profile.typography.scale.body.size}

LAYOUT
  Container: ${profile.designSystem.containerMaxWidth}
  Section Padding: ${profile.designSystem.sectionPadding.desktop}
  Card Radius: ${profile.designSystem.borderRadius.cards}
  Button Radius: ${profile.designSystem.borderRadius.buttons}

HERO
  Layout: ${profile.hero.layout}
  Height: ${profile.hero.height}
  Alignment: ${profile.hero.contentAlignment}

SECTIONS (${profile.sections.length}):
${profile.sections.map((s, i) => `  ${i + 1}. ${s.name} (${s.type}) — ${s.layout}`).join('\n')}

NAVIGATION: ${profile.navigation.type}
FOOTER: ${profile.footer.layout} (${profile.footer.columns} columns)
ANIMATIONS: scrollReveal=${profile.animations.scrollReveal.enabled}, type=${profile.animations.scrollReveal.type}
═══════════════════════════════════════════════════`;
}
