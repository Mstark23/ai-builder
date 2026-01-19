// app/api/ai/generate/route.ts
// Enhanced AI Website Generation with "WOW" Factor

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Claude API call with system prompt
async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
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
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// Enhanced industry configurations with design details
const INDUSTRY_CONFIG: Record<string, {
  sections: string[];
  features: string[];
  colorSchemes: { name: string; primary: string; secondary: string; accent: string; bg: string; text: string }[];
  designNotes: string;
  heroStyle: string;
}> = {
  restaurant: {
    sections: ['Hero with Food Imagery', 'Story/About Section', 'Featured Menu Items', 'Photo Gallery Grid', 'Customer Reviews Carousel', 'Hours & Location with Map', 'Reservation CTA', 'Footer'],
    features: ['Animated menu cards', 'Image hover effects', 'Testimonial slider', 'Sticky reservation button'],
    colorSchemes: [
      { name: 'Warm Bistro', primary: '#8B2500', secondary: '#D4A574', accent: '#FFD700', bg: '#FFF8F0', text: '#2C1810' },
      { name: 'Modern Eatery', primary: '#1A1A2E', secondary: '#16213E', accent: '#E94560', bg: '#FFFFFF', text: '#1A1A2E' },
      { name: 'Fresh & Natural', primary: '#2D5A27', secondary: '#8FBC8F', accent: '#FFB347', bg: '#F5F5DC', text: '#2D2D2D' },
    ],
    designNotes: 'Use mouth-watering food photography placeholders, warm ambient lighting effects, elegant serif fonts for headings',
    heroStyle: 'Full-screen hero with food image background, dark overlay gradient, centered text with script accent font',
  },
  'local-services': {
    sections: ['Hero with Value Proposition', 'Services Grid', 'About/Story', 'Why Choose Us (Benefits)', 'Before/After Gallery', 'Testimonials', 'Service Areas Map', 'Contact Form', 'Footer'],
    features: ['Animated service cards', 'Trust badges', 'FAQ accordion', 'Click-to-call button', 'Quote calculator'],
    colorSchemes: [
      { name: 'Professional Blue', primary: '#1E3A5F', secondary: '#3D5A80', accent: '#FF6B35', bg: '#F7F9FC', text: '#1E3A5F' },
      { name: 'Trustworthy Green', primary: '#1B4332', secondary: '#2D6A4F', accent: '#FFB703', bg: '#FFFFFF', text: '#1B4332' },
      { name: 'Bold & Reliable', primary: '#2B2D42', secondary: '#8D99AE', accent: '#EF233C', bg: '#EDF2F4', text: '#2B2D42' },
    ],
    designNotes: 'Emphasize trust, professionalism, and local presence. Use real-looking worker/service images. Clean, organized layout.',
    heroStyle: 'Split hero with image on one side, bold headline + CTA on other. Floating trust badges.',
  },
  ecommerce: {
    sections: ['Hero Banner with Featured Product', 'Category Showcase', 'Featured Products Grid', 'Brand Story', 'Customer Reviews', 'Newsletter Signup', 'Instagram Feed', 'Footer with Links'],
    features: ['Product cards with quick-view hover', 'Add to cart animations', 'Floating cart icon', 'Sale badges'],
    colorSchemes: [
      { name: 'Luxury Minimal', primary: '#000000', secondary: '#333333', accent: '#C9A962', bg: '#FFFFFF', text: '#1A1A1A' },
      { name: 'Vibrant Shop', primary: '#6C5CE7', secondary: '#A29BFE', accent: '#FD79A8', bg: '#FAFAFA', text: '#2D3436' },
      { name: 'Natural & Organic', primary: '#5D4E37', secondary: '#8B7355', accent: '#C17F59', bg: '#FAF6F1', text: '#3D3D3D' },
    ],
    designNotes: 'Focus on product showcase. Large, high-quality product images. Minimal distractions. Clear CTAs.',
    heroStyle: 'Large product hero with floating elements, animated background shapes, bold sale messaging',
  },
  professional: {
    sections: ['Hero with Headline', 'Services Overview', 'About the Firm', 'Team Members', 'Case Studies/Results', 'Client Logos', 'Testimonials', 'Contact CTA', 'Footer'],
    features: ['Animated statistics counters', 'Team member cards with hover bio', 'Client logo carousel', 'Appointment booking'],
    colorSchemes: [
      { name: 'Corporate Navy', primary: '#0A1628', secondary: '#1E3A5F', accent: '#FFB400', bg: '#FFFFFF', text: '#0A1628' },
      { name: 'Modern Teal', primary: '#006D77', secondary: '#83C5BE', accent: '#E29578', bg: '#FDFCDC', text: '#1A1A1A' },
      { name: 'Elegant Dark', primary: '#14213D', secondary: '#1D3557', accent: '#FCA311', bg: '#E5E5E5', text: '#14213D' },
    ],
    designNotes: 'Convey expertise, trust, and success. Use professional photography. Sophisticated typography.',
    heroStyle: 'Gradient mesh background with geometric accents, professional headshot or office image, strong headline',
  },
  'health-beauty': {
    sections: ['Hero with Atmosphere', 'Services Menu', 'About/Philosophy', 'Team/Specialists', 'Treatment Gallery', 'Pricing Packages', 'Booking Section', 'Testimonials', 'Contact & Hours', 'Footer'],
    features: ['Service cards with pricing', 'Before/after sliders', 'Online booking calendar', 'Gift card promotion'],
    colorSchemes: [
      { name: 'Spa Zen', primary: '#4A6741', secondary: '#8FBC8F', accent: '#D4A574', bg: '#F5F5F0', text: '#2D2D2D' },
      { name: 'Luxury Rose', primary: '#B76E79', secondary: '#E8B4BC', accent: '#C9A962', bg: '#FFF9FB', text: '#4A4A4A' },
      { name: 'Modern Wellness', primary: '#5C6BC0', secondary: '#9FA8DA', accent: '#FF8A65', bg: '#FFFFFF', text: '#37474F' },
    ],
    designNotes: 'Create a calming, luxurious atmosphere. Soft imagery, elegant fonts, plenty of whitespace. Emphasize self-care.',
    heroStyle: 'Soft gradient background with floating botanical elements, serene imagery, elegant script font accents',
  },
  'real-estate': {
    sections: ['Hero with Search', 'Featured Listings', 'Property Categories', 'About Agent/Agency', 'Success Statistics', 'Testimonials', 'Neighborhood Guide', 'Contact Form', 'Footer'],
    features: ['Property cards with image carousel', 'Search filters', 'Map integration', 'Virtual tour buttons', 'Mortgage calculator'],
    colorSchemes: [
      { name: 'Luxury Estate', primary: '#1A1A2E', secondary: '#2D3142', accent: '#C9A962', bg: '#FFFFFF', text: '#1A1A2E' },
      { name: 'Modern Realtor', primary: '#2C3E50', secondary: '#34495E', accent: '#E74C3C', bg: '#ECF0F1', text: '#2C3E50' },
      { name: 'Warm Welcome', primary: '#5D4037', secondary: '#795548', accent: '#FF7043', bg: '#FFF8E7', text: '#3E2723' },
    ],
    designNotes: 'Showcase properties beautifully. Large images, clean property cards, easy navigation. Professional agent photo.',
    heroStyle: 'Full-width property image with search overlay, gradient bottom fade, floating property stats',
  },
  portfolio: {
    sections: ['Hero with Name/Title', 'Selected Works Grid', 'About Me', 'Services/Skills', 'Testimonials', 'Contact CTA', 'Footer with Social'],
    features: ['Filterable project grid', 'Project hover previews', 'Smooth scroll navigation', 'Animated skill bars'],
    colorSchemes: [
      { name: 'Minimal Light', primary: '#1A1A1A', secondary: '#4A4A4A', accent: '#FF4444', bg: '#FFFFFF', text: '#1A1A1A' },
      { name: 'Creative Bold', primary: '#6C5CE7', secondary: '#A29BFE', accent: '#00CEC9', bg: '#2D3436', text: '#FFFFFF' },
      { name: 'Editorial', primary: '#2D2D2D', secondary: '#5C5C5C', accent: '#FF6B6B', bg: '#F8F8F8', text: '#2D2D2D' },
    ],
    designNotes: 'Let the work speak. Large project images, minimal distractions, unique layout. Show personality.',
    heroStyle: 'Bold typography hero with animated text reveal, subtle background texture, minimal layout',
  },
  banking: {
    sections: ['Hero with Value Proposition', 'Services/Products', 'Why Choose Us', 'Security & Trust', 'Mobile App Showcase', 'Rates & Calculators', 'Testimonials', 'FAQ', 'Contact & Branches', 'Footer'],
    features: ['Product comparison cards', 'Interest rate calculator', 'Security badges', 'Mobile app download CTAs', 'Branch locator'],
    colorSchemes: [
      { name: 'Trust Blue', primary: '#003366', secondary: '#0055A5', accent: '#00A86B', bg: '#F5F7FA', text: '#1A1A2E' },
      { name: 'Modern Finance', primary: '#1A1A2E', secondary: '#2D2D44', accent: '#6366F1', bg: '#FFFFFF', text: '#1A1A2E' },
      { name: 'Premium Gold', primary: '#1C2938', secondary: '#2C3E50', accent: '#D4AF37', bg: '#FAFBFC', text: '#1C2938' },
    ],
    designNotes: 'Emphasize security, trust, and innovation. Clean data visualizations, professional imagery, confidence-building elements.',
    heroStyle: 'Gradient mesh with floating UI elements, split layout with app mockup, strong headline about security',
  },
};

// Style configurations with CSS guidance
const STYLE_CONFIG: Record<string, {
  description: string;
  typography: string;
  layout: string;
  effects: string;
  fonts: { heading: string; body: string };
}> = {
  modern: {
    description: 'Clean, contemporary design with bold typography and strategic whitespace',
    typography: 'Large, bold headings (48-72px), generous line height, clear hierarchy',
    layout: 'Asymmetric grids, overlapping elements, full-width sections',
    effects: 'Subtle shadows, smooth hover transitions, scroll-triggered fade-ins',
    fonts: { heading: 'Outfit', body: 'Inter' },
  },
  elegant: {
    description: 'Sophisticated, luxurious design with refined details',
    typography: 'Serif headings, refined spacing, subtle letter-spacing',
    layout: 'Centered content, balanced proportions, generous padding',
    effects: 'Soft shadows, gold accents, gentle hover effects',
    fonts: { heading: 'Playfair Display', body: 'Lato' },
  },
  bold: {
    description: 'Eye-catching, high-energy design with strong contrasts',
    typography: 'Extra-bold headings, dramatic sizing, impactful statements',
    layout: 'Dynamic angles, overlapping layers, unexpected positioning',
    effects: 'Strong shadows, vibrant hovers, animated gradients',
    fonts: { heading: 'Space Grotesk', body: 'DM Sans' },
  },
  minimal: {
    description: 'Stripped-down, focused design emphasizing content',
    typography: 'Clean sans-serif, modest sizing, excellent readability',
    layout: 'Grid-based, maximum whitespace, content-focused',
    effects: 'Micro-interactions, subtle hovers, clean transitions',
    fonts: { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans' },
  },
  playful: {
    description: 'Fun, approachable design with personality',
    typography: 'Rounded fonts, varied sizing, emoji-friendly',
    layout: 'Organic shapes, tilted elements, bouncy spacing',
    effects: 'Bouncy animations, colorful hovers, playful micro-interactions',
    fonts: { heading: 'Nunito', body: 'Nunito' },
  },
  corporate: {
    description: 'Professional, trustworthy design inspiring confidence',
    typography: 'Professional sans-serif, clear hierarchy, readable sizing',
    layout: 'Structured grids, balanced sections, logical flow',
    effects: 'Professional transitions, subtle depth, refined hovers',
    fonts: { heading: 'Manrope', body: 'Source Sans Pro' },
  },
};

// Master system prompt for website generation
const SYSTEM_PROMPT = `You are an elite web designer and developer who creates stunning, award-winning websites. Your websites consistently win design awards and make clients say "WOW!" 

Your design philosophy:
1. VISUAL IMPACT FIRST - Every website must have a "hero moment" that stops people in their tracks
2. MODERN TECHNIQUES - Use gradients, glassmorphism, subtle animations, and contemporary layouts
3. ATTENTION TO DETAIL - Spacing, typography, and micro-interactions matter enormously
4. COHESIVE DESIGN SYSTEM - Every element feels intentional and connected
5. PREMIUM FEEL - The website should look like it cost $10,000+ to build

You MUST include these modern design elements:
- Gradient backgrounds (mesh gradients, linear gradients with multiple stops)
- Glassmorphism effects (backdrop-blur, semi-transparent backgrounds)
- Soft, layered shadows (multiple box-shadows for depth)
- Smooth animations (fade-in on scroll, hover transforms, subtle movements)
- Modern typography (variable font weights, letter-spacing, line-height)
- Strategic use of accent colors
- Floating elements and overlapping sections
- High-quality placeholder images with proper aspect ratios

CSS TECHNIQUES you must use:
- CSS Grid for complex layouts
- CSS custom properties for theming
- @keyframes for animations
- backdrop-filter for glass effects
- background: linear-gradient() and radial-gradient()
- box-shadow with multiple layers
- transform and transition for interactions
- scroll-behavior: smooth
- Intersection Observer for scroll animations (JavaScript)

CRITICAL: You output ONLY raw HTML. No markdown, no explanations, no code blocks. Start with <!DOCTYPE html> and end with </html>.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, action } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Fetch project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*, customers(name, email, phone, business_name)')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Handle different actions
    if (action === 'generate') {
      const html = await generateWebsite(project);
      
      // Save generated HTML to project
      await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          status: 'PREVIEW_READY',
        })
        .eq('id', projectId);

      return NextResponse.json({ 
        success: true, 
        html,
        message: 'Website generated successfully'
      });
    }

    if (action === 'revise') {
      const { feedback, currentHtml } = body;
      
      if (!feedback) {
        return NextResponse.json({ error: 'Feedback required for revision' }, { status: 400 });
      }

      const html = await reviseWebsite(currentHtml || project.generated_html, feedback, project);
      
      // Save revised HTML
      await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          revision_count: (project.revision_count || 0) + 1,
        })
        .eq('id', projectId);

      return NextResponse.json({ 
        success: true, 
        html,
        message: 'Revisions applied successfully'
      });
    }

    if (action === 'quick-edit') {
      const { instruction, currentHtml } = body;
      
      if (!instruction) {
        return NextResponse.json({ error: 'Instruction required' }, { status: 400 });
      }

      const html = await quickEdit(currentHtml || project.generated_html, instruction);
      
      // Save edited HTML
      await supabase
        .from('projects')
        .update({ generated_html: html })
        .eq('id', projectId);

      return NextResponse.json({ 
        success: true, 
        html,
        message: 'Edit applied successfully'
      });
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

// Generate website function - ENHANCED
async function generateWebsite(project: any): Promise<string> {
  const industryKey = (project.industry || 'local-services').toLowerCase().replace(/\s+/g, '-');
  const styleKey = (project.style || 'modern').toLowerCase();
  
  const industryConfig = INDUSTRY_CONFIG[industryKey] || INDUSTRY_CONFIG['local-services'];
  const styleConfig = STYLE_CONFIG[styleKey] || STYLE_CONFIG['modern'];
  
  // Pick a random color scheme from the industry options
  const colorScheme = industryConfig.colorSchemes[Math.floor(Math.random() * industryConfig.colorSchemes.length)];

  const userPrompt = `Create a stunning, production-ready website for this business:

═══════════════════════════════════════════════════════════════
BUSINESS INFORMATION
═══════════════════════════════════════════════════════════════
• Business Name: ${project.business_name}
• Industry: ${project.industry}
• Description: ${project.description || 'A professional business providing excellent services to customers'}
• Website Goal: ${project.website_goal || 'Generate leads, showcase services, and build trust with potential customers'}
• Requested Features: ${(project.features || []).join(', ') || 'Standard professional website features'}
${project.inspirations ? `• Design Inspirations: ${project.inspirations}` : ''}
${project.customers?.email ? `• Contact Email: ${project.customers.email}` : ''}
${project.customers?.phone ? `• Contact Phone: ${project.customers.phone}` : ''}

═══════════════════════════════════════════════════════════════
DESIGN SPECIFICATIONS
═══════════════════════════════════════════════════════════════
STYLE: ${styleKey.toUpperCase()}
${styleConfig.description}

Typography: ${styleConfig.typography}
Layout: ${styleConfig.layout}
Effects: ${styleConfig.effects}

FONTS TO USE:
- Heading: "${styleConfig.fonts.heading}" (Google Fonts)
- Body: "${styleConfig.fonts.body}" (Google Fonts)

COLOR PALETTE (${colorScheme.name}):
- Primary: ${colorScheme.primary}
- Secondary: ${colorScheme.secondary}
- Accent: ${colorScheme.accent}
- Background: ${colorScheme.bg}
- Text: ${colorScheme.text}

═══════════════════════════════════════════════════════════════
REQUIRED SECTIONS (in this order)
═══════════════════════════════════════════════════════════════
${industryConfig.sections.map((section, i) => `${i + 1}. ${section}`).join('\n')}

Hero Style: ${industryConfig.heroStyle}

═══════════════════════════════════════════════════════════════
REQUIRED FEATURES
═══════════════════════════════════════════════════════════════
${industryConfig.features.map(f => `• ${f}`).join('\n')}

═══════════════════════════════════════════════════════════════
DESIGN NOTES FOR THIS INDUSTRY
═══════════════════════════════════════════════════════════════
${industryConfig.designNotes}

═══════════════════════════════════════════════════════════════
TECHNICAL REQUIREMENTS
═══════════════════════════════════════════════════════════════
1. Single HTML file with embedded <style> and <script>
2. Mobile-first responsive design (use media queries)
3. Include Google Fonts link tags in <head>
4. CSS custom properties for all colors: --primary, --secondary, --accent, --bg, --text
5. Smooth scroll behavior
6. Intersection Observer for scroll-triggered animations
7. Semantic HTML5 elements
8. Proper meta tags including viewport
9. Use https://picsum.photos for realistic placeholder images:
   - Hero: https://picsum.photos/1920/1080?random=1
   - Gallery: https://picsum.photos/600/400?random=2 (vary the number)
   - Team: https://picsum.photos/400/400?random=3
   - Products: https://picsum.photos/500/500?random=4
10. NO external CSS frameworks
11. Sticky navigation with backdrop blur
12. Footer with social media icons (use Unicode or inline SVG)

═══════════════════════════════════════════════════════════════
CRITICAL CSS PATTERNS TO INCLUDE
═══════════════════════════════════════════════════════════════
/* Hero gradient example */
.hero {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  /* OR for image overlay: */
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('image.jpg');
}

/* Glassmorphism card */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}

/* Layered shadow */
.card {
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.05),
    0 10px 20px rgba(0, 0, 0, 0.08),
    0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Scroll animation */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Button hover */
.btn-primary {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(var(--accent-rgb), 0.3);
}

═══════════════════════════════════════════════════════════════

Generate a COMPLETE, STUNNING website that would make the client say "WOW!"
Output ONLY the HTML. Start with <!DOCTYPE html> and end with </html>.`;

  const response = await callClaude(SYSTEM_PROMPT, userPrompt);
  
  // Clean up response
  let html = response.trim();
  if (html.startsWith('```html')) {
    html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  }
  if (html.startsWith('```')) {
    html = html.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  
  // Ensure it starts with DOCTYPE
  if (!html.toLowerCase().startsWith('<!doctype')) {
    const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
    if (doctypeIndex > 0) {
      html = html.substring(doctypeIndex);
    }
  }
  
  return html;
}

// Revise website function - ENHANCED
async function reviseWebsite(currentHtml: string, feedback: string, project: any): Promise<string> {
  const systemPrompt = `You are an expert web developer making revisions to a client's website. 
Maintain the same high-quality design standards while implementing the requested changes.
Preserve all existing styling, animations, and responsive behavior unless specifically asked to change them.
Output ONLY the complete HTML. No explanations.`;

  const userPrompt = `Apply these revisions to the website:

CUSTOMER FEEDBACK:
${feedback}

BUSINESS CONTEXT:
- Business: ${project.business_name}
- Industry: ${project.industry}
- Style: ${project.style}

INSTRUCTIONS:
1. Read the feedback carefully
2. Apply ALL requested changes
3. Maintain design quality and consistency
4. Keep all animations and responsive behavior
5. If feedback is vague, make reasonable premium-quality interpretations

CURRENT WEBSITE HTML:
${currentHtml}

Output the COMPLETE updated HTML. Start with <!DOCTYPE html> and end with </html>.`;

  const response = await callClaude(systemPrompt, userPrompt);
  
  let html = response.trim();
  if (html.startsWith('```html')) {
    html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  }
  if (html.startsWith('```')) {
    html = html.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  
  return html;
}

// Quick edit function - ENHANCED
async function quickEdit(currentHtml: string, instruction: string): Promise<string> {
  const systemPrompt = `You are a web developer making a specific edit to a website.
Make ONLY the requested change while preserving everything else.
Output ONLY the complete HTML. No explanations.`;

  const userPrompt = `Make this specific change: "${instruction}"

Current website HTML:
${currentHtml}

Output the COMPLETE updated HTML. Start with <!DOCTYPE html> and end with </html>.`;

  const response = await callClaude(systemPrompt, userPrompt);
  
  let html = response.trim();
  if (html.startsWith('```html')) {
    html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  }
  if (html.startsWith('```')) {
    html = html.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  
  return html;
}
