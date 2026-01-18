// lib/ai/claude.ts
// Claude AI Integration for Website Generation

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type ProjectDetails = {
  business_name: string;
  industry: string;
  style: string;
  description: string;
  website_goal: string;
  features: string[];
  inspirations?: string;
  colors?: string;
  target_audience?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
};

export type GeneratedWebsite = {
  html: string;
  css: string;
  js: string;
  fullPage: string;
  sections: {
    name: string;
    html: string;
  }[];
  suggestedImages: string[];
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
};

// Industry-specific templates and features
const INDUSTRY_CONFIG: Record<string, {
  sections: string[];
  features: string[];
  colorSchemes: string[];
  fonts: string[];
}> = {
  restaurant: {
    sections: ['Hero', 'About', 'Menu', 'Specials', 'Gallery', 'Reviews', 'Hours & Location', 'Reservation', 'Contact', 'Footer'],
    features: ['Online Menu', 'Reservation Form', 'Photo Gallery', 'Google Maps', 'Social Media Links', 'Hours Display'],
    colorSchemes: ['Warm (Red, Orange, Brown)', 'Elegant (Black, Gold)', 'Fresh (Green, White)', 'Modern (Dark Gray, Accent)'],
    fonts: ['Playfair Display + Open Sans', 'Cormorant + Montserrat', 'Lobster + Roboto'],
  },
  'local-services': {
    sections: ['Hero', 'Services', 'About', 'Why Choose Us', 'Process', 'Testimonials', 'Service Areas', 'Contact', 'Footer'],
    features: ['Service Cards', 'Quote Request Form', 'Before/After Gallery', 'Trust Badges', 'FAQ Section', 'Emergency Contact'],
    colorSchemes: ['Professional (Blue, White)', 'Trustworthy (Green, Gray)', 'Bold (Orange, Black)', 'Clean (Navy, White)'],
    fonts: ['Montserrat + Open Sans', 'Roboto + Lato', 'Poppins + Source Sans Pro'],
  },
  ecommerce: {
    sections: ['Hero', 'Featured Products', 'Categories', 'New Arrivals', 'Best Sellers', 'About Brand', 'Reviews', 'Newsletter', 'Footer'],
    features: ['Product Grid', 'Category Navigation', 'Search Bar', 'Newsletter Signup', 'Trust Badges', 'Social Proof'],
    colorSchemes: ['Minimal (White, Black)', 'Luxury (Black, Gold)', 'Vibrant (Colorful Accents)', 'Natural (Earth Tones)'],
    fonts: ['DM Sans + Inter', 'Playfair Display + Lato', 'Helvetica + Georgia'],
  },
  professional: {
    sections: ['Hero', 'Services', 'About', 'Team', 'Case Studies', 'Testimonials', 'Process', 'Contact', 'Footer'],
    features: ['Service Descriptions', 'Team Profiles', 'Client Logos', 'Contact Form', 'Credentials/Awards', 'Blog Section'],
    colorSchemes: ['Corporate (Navy, White)', 'Modern (Charcoal, Teal)', 'Elegant (Dark Blue, Gold)', 'Clean (Gray, Blue)'],
    fonts: ['Inter + Georgia', 'Libre Baskerville + Source Sans', 'Merriweather + Open Sans'],
  },
  'health-beauty': {
    sections: ['Hero', 'Services', 'Treatments', 'About', 'Team', 'Gallery', 'Pricing', 'Booking', 'Testimonials', 'Contact', 'Footer'],
    features: ['Service Menu', 'Booking System', 'Before/After Gallery', 'Team Profiles', 'Gift Cards', 'Special Offers'],
    colorSchemes: ['Spa (Soft Green, White)', 'Luxury (Rose Gold, Black)', 'Fresh (Pink, White)', 'Natural (Earth, Sage)'],
    fonts: ['Cormorant + Montserrat', 'Playfair Display + Raleway', 'Josefin Sans + Lato'],
  },
  'real-estate': {
    sections: ['Hero', 'Featured Listings', 'Search', 'Services', 'About Agent', 'Testimonials', 'Market Stats', 'Contact', 'Footer'],
    features: ['Property Search', 'Listing Cards', 'Virtual Tours', 'Agent Profile', 'Contact Form', 'Market Reports'],
    colorSchemes: ['Luxury (Navy, Gold)', 'Modern (Black, White)', 'Trustworthy (Blue, Gray)', 'Warm (Brown, Cream)'],
    fonts: ['Playfair Display + Open Sans', 'Cinzel + Raleway', 'Libre Baskerville + Montserrat'],
  },
  portfolio: {
    sections: ['Hero', 'Work/Projects', 'About', 'Services', 'Process', 'Testimonials', 'Contact', 'Footer'],
    features: ['Project Gallery', 'Filterable Portfolio', 'Case Studies', 'Client List', 'Contact Form', 'Social Links'],
    colorSchemes: ['Minimal (White, Black)', 'Creative (Bold Colors)', 'Elegant (Charcoal, Accent)', 'Dark Mode (Black, White)'],
    fonts: ['Space Grotesk + Inter', 'Archivo + DM Sans', 'Syne + Work Sans'],
  },
};

// Style configurations
const STYLE_CONFIG: Record<string, {
  characteristics: string[];
  design_elements: string[];
}> = {
  modern: {
    characteristics: ['Clean lines', 'Minimalist', 'Bold typography', 'Geometric shapes', 'Ample white space'],
    design_elements: ['Large hero sections', 'Card-based layouts', 'Subtle animations', 'Sans-serif fonts', 'High contrast'],
  },
  elegant: {
    characteristics: ['Sophisticated', 'Luxurious', 'Refined', 'Timeless', 'Premium feel'],
    design_elements: ['Serif fonts', 'Gold/metallic accents', 'Subtle gradients', 'Fine borders', 'Muted colors'],
  },
  bold: {
    characteristics: ['Eye-catching', 'Vibrant', 'Energetic', 'Dynamic', 'Memorable'],
    design_elements: ['Bright colors', 'Large typography', 'Strong contrasts', 'Unique layouts', 'Motion effects'],
  },
  minimal: {
    characteristics: ['Simple', 'Clean', 'Focused', 'Uncluttered', 'Essential'],
    design_elements: ['Maximum white space', 'Limited color palette', 'Simple typography', 'No decorations', 'Content-focused'],
  },
  playful: {
    characteristics: ['Fun', 'Friendly', 'Approachable', 'Creative', 'Unique'],
    design_elements: ['Rounded shapes', 'Bright colors', 'Illustrations', 'Casual fonts', 'Interactive elements'],
  },
  corporate: {
    characteristics: ['Professional', 'Trustworthy', 'Established', 'Reliable', 'Credible'],
    design_elements: ['Structured layouts', 'Blue color schemes', 'Professional photos', 'Grid-based design', 'Formal typography'],
  },
};

// Main generation function
export async function generateWebsite(project: ProjectDetails): Promise<GeneratedWebsite> {
  const industry = project.industry.toLowerCase().replace(/\s+/g, '-');
  const style = project.style.toLowerCase();
  
  const industryConfig = INDUSTRY_CONFIG[industry] || INDUSTRY_CONFIG['local-services'];
  const styleConfig = STYLE_CONFIG[style] || STYLE_CONFIG['modern'];

  const prompt = buildPrompt(project, industryConfig, styleConfig);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return parseGeneratedWebsite(content.text, project);
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
}

// Build the prompt for Claude
function buildPrompt(
  project: ProjectDetails, 
  industryConfig: typeof INDUSTRY_CONFIG[string],
  styleConfig: typeof STYLE_CONFIG[string]
): string {
  return `You are an expert web developer and designer. Generate a complete, production-ready, single-page website for the following business.

## BUSINESS DETAILS:
- **Business Name:** ${project.business_name}
- **Industry:** ${project.industry}
- **Style Preference:** ${project.style}
- **Description:** ${project.description}
- **Website Goal:** ${project.website_goal}
- **Requested Features:** ${project.features.join(', ')}
${project.inspirations ? `- **Inspirations:** ${project.inspirations}` : ''}
${project.colors ? `- **Color Preferences:** ${project.colors}` : ''}
${project.target_audience ? `- **Target Audience:** ${project.target_audience}` : ''}
${project.contact_email ? `- **Email:** ${project.contact_email}` : ''}
${project.contact_phone ? `- **Phone:** ${project.contact_phone}` : ''}
${project.address ? `- **Address:** ${project.address}` : ''}

## INDUSTRY-SPECIFIC REQUIREMENTS:
- **Recommended Sections:** ${industryConfig.sections.join(', ')}
- **Common Features:** ${industryConfig.features.join(', ')}
- **Suggested Color Schemes:** ${industryConfig.colorSchemes.join(', ')}
- **Recommended Fonts:** ${industryConfig.fonts.join(', ')}

## STYLE REQUIREMENTS (${project.style}):
- **Characteristics:** ${styleConfig.characteristics.join(', ')}
- **Design Elements:** ${styleConfig.design_elements.join(', ')}

## TECHNICAL REQUIREMENTS:
1. Generate a COMPLETE, single HTML file with embedded CSS and JavaScript
2. Must be fully responsive (mobile, tablet, desktop)
3. Use Google Fonts (include the link tag)
4. Include smooth scroll behavior
5. Add subtle animations (fade-in on scroll, hover effects)
6. Use semantic HTML5 elements
7. Include proper meta tags for SEO
8. Use placeholder images from https://placehold.co (e.g., https://placehold.co/600x400/000000/FFFFFF/png?text=Hero+Image)
9. Include a functional contact form (frontend only)
10. Add social media icon placeholders
11. Make it look like a premium, $5000+ website
12. NO external CSS frameworks - write custom CSS
13. Use CSS Grid and Flexbox for layouts
14. Include CSS custom properties (variables) for colors and fonts

## OUTPUT FORMAT:
Return the complete HTML file wrapped in \`\`\`html and \`\`\` tags.

After the HTML, provide a JSON block wrapped in \`\`\`json and \`\`\` tags with:
{
  "suggestedImages": ["description of hero image", "description of about section image", ...],
  "seoMeta": {
    "title": "SEO optimized title",
    "description": "Meta description for search engines",
    "keywords": ["keyword1", "keyword2", ...]
  },
  "sections": ["section1 name", "section2 name", ...]
}

Now generate the complete website:`;
}

// Parse the generated response
function parseGeneratedWebsite(response: string, project: ProjectDetails): GeneratedWebsite {
  // Extract HTML
  const htmlMatch = response.match(/```html\n([\s\S]*?)\n```/);
  const fullPage = htmlMatch ? htmlMatch[1].trim() : generateFallbackHTML(project);

  // Extract JSON metadata
  const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
  let metadata = {
    suggestedImages: [] as string[],
    seoMeta: {
      title: `${project.business_name} - ${project.industry}`,
      description: project.description,
      keywords: [project.industry, project.business_name],
    },
    sections: [] as string[],
  };

  if (jsonMatch) {
    try {
      metadata = JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error('Failed to parse metadata JSON:', e);
    }
  }

  // Extract CSS from HTML
  const cssMatch = fullPage.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  const css = cssMatch ? cssMatch[1].trim() : '';

  // Extract JS from HTML
  const jsMatch = fullPage.match(/<script[^>]*>([\s\S]*?)<\/script>/);
  const js = jsMatch ? jsMatch[1].trim() : '';

  // Extract body HTML
  const bodyMatch = fullPage.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  const html = bodyMatch ? bodyMatch[1].trim() : '';

  return {
    html,
    css,
    js,
    fullPage,
    sections: metadata.sections.map(name => ({ name, html: '' })),
    suggestedImages: metadata.suggestedImages,
    seoMeta: metadata.seoMeta,
  };
}

// Fallback HTML if generation fails
function generateFallbackHTML(project: ProjectDetails): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.business_name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #fafafa; color: #111; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; background: #000; color: #fff; }
    .hero h1 { font-family: 'Playfair Display', serif; font-size: 4rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.25rem; opacity: 0.8; max-width: 600px; margin: 0 auto; }
  </style>
</head>
<body>
  <section class="hero">
    <div class="container">
      <h1>${project.business_name}</h1>
      <p>${project.description}</p>
    </div>
  </section>
</body>
</html>`;
}

// Revision function - applies customer feedback
export async function reviseWebsite(
  currentHtml: string, 
  feedback: string,
  project: ProjectDetails
): Promise<GeneratedWebsite> {
  const prompt = `You are an expert web developer. A customer has requested changes to their website.

## CURRENT WEBSITE HTML:
\`\`\`html
${currentHtml}
\`\`\`

## CUSTOMER FEEDBACK / REQUESTED CHANGES:
${feedback}

## BUSINESS CONTEXT:
- Business Name: ${project.business_name}
- Industry: ${project.industry}
- Style: ${project.style}

## INSTRUCTIONS:
1. Carefully read and understand the customer's feedback
2. Apply ALL requested changes to the HTML
3. Maintain the existing design style and quality
4. Keep all existing features that weren't mentioned for removal
5. Ensure the site remains responsive and functional
6. If the feedback is vague, make reasonable interpretations

## OUTPUT:
Return the COMPLETE updated HTML file wrapped in \`\`\`html and \`\`\` tags.

After the HTML, include a JSON block with:
\`\`\`json
{
  "changesMade": ["change 1", "change 2", ...],
  "interpretations": ["any assumptions made about vague requests"]
}
\`\`\`

Now apply the changes:`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return parseGeneratedWebsite(content.text, project);
  } catch (error) {
    console.error('Claude API Revision Error:', error);
    throw error;
  }
}

// Quick edit function for simple changes
export async function quickEdit(
  currentHtml: string,
  instruction: string
): Promise<string> {
  const prompt = `Apply this change to the HTML: "${instruction}"

Current HTML:
\`\`\`html
${currentHtml}
\`\`\`

Return ONLY the updated HTML wrapped in \`\`\`html tags. No explanations.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const htmlMatch = content.text.match(/```html\n([\s\S]*?)\n```/);
    return htmlMatch ? htmlMatch[1].trim() : currentHtml;
  } catch (error) {
    console.error('Claude API Quick Edit Error:', error);
    throw error;
  }
}

export default {
  generateWebsite,
  reviseWebsite,
  quickEdit,
};