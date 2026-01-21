// app/api/generate/route.ts
// VERKTORLABS - High-Quality Website Generation
// Produces clean, professional single-page websites

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 180;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =============================================================================
// DESIGN SYSTEM
// =============================================================================

const DESIGN_DIRECTIONS: Record<string, {
  name: string;
  fonts: { display: string; body: string; import: string };
  colors: {
    primary: string;
    primaryRgb: string;
    secondary: string;
    secondaryRgb: string;
    accent: string;
    bgPrimary: string;
    bgSecondary: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
  style: string;
}> = {
  luxury_minimal: {
    name: "Luxury Minimal",
    fonts: {
      display: "Cormorant Garamond",
      body: "Crimson Pro",
      import: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Crimson+Pro:wght@400;500;600&display=swap"
    },
    colors: {
      primary: "#1a1a1a",
      primaryRgb: "26, 26, 26",
      secondary: "#c9a227",
      secondaryRgb: "201, 162, 39",
      accent: "#8b7355",
      bgPrimary: "#faf9f7",
      bgSecondary: "#f5f3ef",
      textPrimary: "#1a1a1a",
      textSecondary: "#5c5c5c",
      border: "#e8e6e1"
    },
    style: "Elegant serif typography, generous whitespace, subtle gold accents, refined and sophisticated"
  },
  bold_modern: {
    name: "Bold Modern",
    fonts: {
      display: "Space Grotesk",
      body: "DM Sans",
      import: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
    },
    colors: {
      primary: "#6366f1",
      primaryRgb: "99, 102, 241",
      secondary: "#8b5cf6",
      secondaryRgb: "139, 92, 246",
      accent: "#22d3ee",
      bgPrimary: "#ffffff",
      bgSecondary: "#f8fafc",
      textPrimary: "#0f172a",
      textSecondary: "#475569",
      border: "#e2e8f0"
    },
    style: "Strong geometric sans-serif, vibrant gradients, card-based layouts, tech-forward feel"
  },
  warm_organic: {
    name: "Warm Organic",
    fonts: {
      display: "Fraunces",
      body: "Source Serif Pro",
      import: "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Source+Serif+Pro:wght@400;600&display=swap"
    },
    colors: {
      primary: "#2d5016",
      primaryRgb: "45, 80, 22",
      secondary: "#b45309",
      secondaryRgb: "180, 83, 9",
      accent: "#dc2626",
      bgPrimary: "#fffbeb",
      bgSecondary: "#fef3c7",
      textPrimary: "#1c1917",
      textSecondary: "#57534e",
      border: "#e7e5e4"
    },
    style: "Friendly rounded corners, warm earth tones, approachable and natural feeling"
  },
  dark_premium: {
    name: "Dark Premium",
    fonts: {
      display: "Bebas Neue",
      body: "Barlow",
      import: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap"
    },
    colors: {
      primary: "#ffffff",
      primaryRgb: "255, 255, 255",
      secondary: "#a855f7",
      secondaryRgb: "168, 85, 247",
      accent: "#06b6d4",
      bgPrimary: "#09090b",
      bgSecondary: "#18181b",
      textPrimary: "#fafafa",
      textSecondary: "#a1a1aa",
      border: "rgba(255,255,255,0.1)"
    },
    style: "Dark theme, glowing accents, gradient borders, modern and edgy"
  },
  editorial_classic: {
    name: "Editorial Classic",
    fonts: {
      display: "Playfair Display",
      body: "Source Sans Pro",
      import: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap"
    },
    colors: {
      primary: "#1e3a5f",
      primaryRgb: "30, 58, 95",
      secondary: "#b8860b",
      secondaryRgb: "184, 134, 11",
      accent: "#166534",
      bgPrimary: "#ffffff",
      bgSecondary: "#f8f6f3",
      textPrimary: "#1e293b",
      textSecondary: "#64748b",
      border: "#e2e8f0"
    },
    style: "Classic editorial feel, structured grid, professional and trustworthy"
  },
  vibrant_energy: {
    name: "Vibrant Energy",
    fonts: {
      display: "Syne",
      body: "Outfit",
      import: "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap"
    },
    colors: {
      primary: "#7c3aed",
      primaryRgb: "124, 58, 237",
      secondary: "#ec4899",
      secondaryRgb: "236, 72, 153",
      accent: "#14b8a6",
      bgPrimary: "#fafafa",
      bgSecondary: "#f3e8ff",
      textPrimary: "#18181b",
      textSecondary: "#52525b",
      border: "#e4e4e7"
    },
    style: "Bold gradients, playful animations, energetic and youthful"
  }
};

// Industry-specific image keywords for Unsplash
const INDUSTRY_IMAGES: Record<string, string[]> = {
  'jewelry': ['jewelry', 'gold jewelry', 'diamond ring', 'necklace elegant', 'jewelry display'],
  'restaurant': ['restaurant interior', 'fine dining', 'chef cooking', 'food plating', 'restaurant ambiance'],
  'health-beauty': ['spa interior', 'beauty salon', 'skincare', 'wellness', 'massage therapy'],
  'fitness': ['gym interior', 'fitness training', 'workout', 'personal trainer', 'fitness equipment'],
  'real-estate': ['modern home', 'luxury apartment', 'house interior', 'real estate', 'architecture'],
  'tech-startup': ['modern office', 'tech workspace', 'startup team', 'coding', 'technology'],
  'professional': ['business meeting', 'corporate office', 'professional team', 'consulting', 'business'],
  'local-services': ['home service', 'handyman', 'cleaning service', 'local business', 'service professional'],
  'medical': ['medical clinic', 'healthcare', 'doctor office', 'medical professional', 'clinic interior'],
  'education': ['classroom', 'education', 'learning', 'students studying', 'library'],
  'construction': ['construction site', 'building', 'architecture', 'contractor', 'renovation'],
  'ecommerce': ['shopping', 'product display', 'retail', 'online shopping', 'store'],
  'portfolio': ['creative work', 'design studio', 'artist workspace', 'portfolio', 'creative'],
};

function getIndustryImage(industry: string, index: number = 0): string {
  const keywords = INDUSTRY_IMAGES[industry] || INDUSTRY_IMAGES['professional'];
  const keyword = keywords[index % keywords.length];
  // Use different image IDs based on index to get variety
  const imageId = 1000 + (index * 100);
  return `https://images.unsplash.com/photo-${imageId}?w=800&h=600&fit=crop&q=80`;
}

// =============================================================================
// CSS GENERATOR
// =============================================================================

function generateCSS(direction: typeof DESIGN_DIRECTIONS[string]): string {
  return `
@import url('${direction.fonts.import}');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

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
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
}

h1 { font-size: clamp(2.5rem, 5vw, 4rem); }
h2 { font-size: clamp(2rem, 4vw, 3rem); }
h3 { font-size: clamp(1.25rem, 2vw, 1.5rem); }

p {
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 0;
  background: transparent;
  transition: all 0.3s ease;
}

.nav.scrolled {
  background: var(--bg-primary);
  box-shadow: var(--shadow-md);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 14px rgba(var(--primary-rgb), 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border);
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Sections */
section {
  padding: 100px 0;
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 60px;
}

.section-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.section-title {
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* Hero */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 80px;
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(var(--secondary-rgb), 0.15);
  color: var(--secondary);
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 24px;
}

.hero h1 {
  margin-bottom: 24px;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 32px;
  max-width: 500px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-image {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.hero-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;
}

/* Stats */
.stats-row {
  display: flex;
  gap: 48px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
}

.stat-item {
  text-align: left;
}

.stat-number {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* Cards */
.card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 32px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-icon {
  width: 56px;
  height: 56px;
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.card h3 {
  margin-bottom: 12px;
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Testimonials */
.testimonials {
  background: var(--bg-secondary);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.testimonial-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 32px;
  border: 1px solid var(--border);
}

.testimonial-stars {
  color: #fbbf24;
  font-size: 1.1rem;
  margin-bottom: 16px;
}

.testimonial-text {
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 24px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testimonial-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.testimonial-name {
  font-weight: 600;
  color: var(--text-primary);
}

.testimonial-role {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* CTA */
.cta {
  background: var(--primary);
  color: white;
  text-align: center;
  padding: 80px 0;
}

.cta h2 {
  color: white;
  margin-bottom: 16px;
}

.cta p {
  color: rgba(255,255,255,0.8);
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.cta .btn-primary {
  background: white;
  color: var(--primary);
}

/* Contact */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 14px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 1rem;
  background: var(--bg-secondary);
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.contact-icon {
  width: 48px;
  height: 48px;
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.2rem;
}

.contact-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.contact-value {
  font-weight: 600;
  color: var(--text-primary);
}

/* Footer */
.footer {
  background: var(--bg-secondary);
  padding: 60px 0 30px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

.footer-logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.footer-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  max-width: 300px;
}

.footer-title {
  font-weight: 600;
  margin-bottom: 20px;
  font-size: 1rem;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--primary);
}

.footer-bottom {
  padding-top: 30px;
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 968px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero p {
    margin-left: auto;
    margin-right: auto;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .hero-image {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .stats-row {
    justify-content: center;
  }
  
  .services-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .nav-links {
    display: none;
  }
}

@media (max-width: 640px) {
  section {
    padding: 60px 0;
  }
  
  .hero {
    padding-top: 100px;
  }
  
  .hero-image img {
    height: 300px;
  }
  
  .stats-row {
    flex-direction: column;
    gap: 24px;
    align-items: center;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeInUp 0.6s ease forwards;
}
`;
}

// =============================================================================
// GENERATE HTML
// =============================================================================

async function generateWebsite(project: any): Promise<string> {
  const directionKey = project.design_direction || 'bold_modern';
  const direction = DESIGN_DIRECTIONS[directionKey] || DESIGN_DIRECTIONS.bold_modern;
  const css = generateCSS(direction);
  
  // Get industry-appropriate images
  const industry = project.industry || 'professional';
  
  const systemPrompt = `You are an expert web developer creating a high-quality, professional landing page.

CRITICAL RULES:
1. Output ONLY valid HTML - no markdown, no code blocks, no explanations
2. Use semantic HTML5 elements
3. All content must be realistic and specific to the business
4. Use the exact CSS classes provided - do not invent new ones
5. Include proper alt text for images
6. Make sure all sections flow naturally

BUSINESS CONTEXT:
- Name: ${project.business_name}
- Industry: ${project.industry || 'professional services'}
- Description: ${project.description || 'A quality business'}
- Target Customer: ${project.target_customer || 'discerning customers'}
- Unique Value: ${project.unique_value || 'exceptional quality and service'}
- Services: ${project.primary_services?.join(', ') || 'various professional services'}
- CTA: ${project.call_to_action || 'Get Started'}
- Email: ${project.contact_email || 'hello@example.com'}
- Phone: ${project.contact_phone || '(555) 123-4567'}
- Address: ${project.address || '123 Main Street'}

DESIGN STYLE: ${direction.name}
${direction.style}

IMAGE URLS TO USE:
- Hero: https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop (for jewelry)
- Use placeholder images from: https://images.unsplash.com/ with appropriate search terms for ${industry}
- Avatar images: https://i.pravatar.cc/100?img=1, ?img=2, ?img=3, etc.

REQUIRED SECTIONS (use these exact class names):
1. nav - Fixed navigation with logo and links
2. hero - Full height hero with headline, subheadline, CTA buttons, image, and stats
3. services - Services grid with 3 cards
4. testimonials - 3 testimonial cards
5. cta - Call-to-action banner
6. contact - Contact form and info
7. footer - Footer with links`;

  const userPrompt = `Create a complete landing page HTML for "${project.business_name}".

The page must include ALL these sections with the EXACT structure shown:

1. NAVIGATION (class="nav"):
<nav class="nav" id="nav">
  <div class="container nav-inner">
    <a href="#" class="nav-logo">[Business Name]</a>
    <ul class="nav-links">
      <li><a href="#services">Services</a></li>
      <li><a href="#testimonials">Reviews</a></li>
      <li><a href="#contact">Contact</a></li>
      <li><a href="#contact" class="btn btn-primary">[CTA]</a></li>
    </ul>
  </div>
</nav>

2. HERO (class="hero", id="hero"):
- hero-grid with hero-content and hero-image
- Include hero-badge, h1, p, hero-buttons, and stats-row

3. SERVICES (id="services"):
- section-header with badge, title, subtitle
- services-grid with 3 cards, each having card-icon, h3, p

4. TESTIMONIALS (class="testimonials", id="testimonials"):
- section-header
- testimonials-grid with 3 testimonial-card elements

5. CTA (class="cta"):
- Centered h2, p, and button

6. CONTACT (id="contact"):
- contact-grid with contact-form and contact-info

7. FOOTER (class="footer"):
- footer-grid and footer-bottom

Use realistic, compelling copy that matches the ${project.industry || 'professional'} industry.
For images, use Unsplash URLs with relevant search terms.
For avatars, use https://i.pravatar.cc/100?img=N

Output ONLY the HTML starting with <!DOCTYPE html>. No other text.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      { role: 'user', content: userPrompt }
    ],
    system: systemPrompt,
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  let html = content.text.trim();
  
  // Clean up any markdown artifacts
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim();
  
  // Inject our CSS
  if (html.includes('</head>')) {
    html = html.replace('</head>', `<style>${css}</style></head>`);
  } else if (html.includes('<head>')) {
    html = html.replace('<head>', `<head><style>${css}</style>`);
  }
  
  // Add navigation scroll script
  const script = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Nav scroll effect
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
</script>`;
  
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${script}</body>`);
  }
  
  return html;
}

// =============================================================================
// API HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  console.log('🚀 Starting website generation...');
  
  try {
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Fetch project data
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      console.error('Project fetch error:', fetchError);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    console.log(`📋 Generating for: ${project.business_name}`);
    console.log(`🎨 Design: ${project.design_direction || 'bold_modern'}`);

    // Generate the website
    const html = await generateWebsite(project);

    // Validate HTML
    if (!html || html.length < 1000) {
      throw new Error('Generated HTML is too short or empty');
    }

    if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
      throw new Error('Generated content is not valid HTML');
    }

    // Save to database
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        generated_html: html,
        status: 'PREVIEW_READY',
        review_score: null, // Clear previous review
        review_details: null,
      })
      .eq('id', projectId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error('Failed to save generated website');
    }

    console.log('✅ Generation complete!');

    return NextResponse.json({
      success: true,
      message: 'Website generated successfully',
      htmlLength: html.length,
    });

  } catch (error: any) {
    console.error('❌ Generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Generation failed', 
        details: error.message || 'Unknown error',
        success: false 
      },
      { status: 500 }
    );
  }
}
