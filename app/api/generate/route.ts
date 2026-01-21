// app/api/generate/route.ts
// VERKTORLABS - Professional Website Generation v3
// High-quality, multi-page capable generation

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 300;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =============================================================================
// CURATED IMAGE LIBRARY - Real working Unsplash URLs
// =============================================================================

const CURATED_IMAGES = {
  jewelry: {
    hero: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=600&fit=crop',
    ],
    products: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=400&fit=crop',
    ],
    about: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&h=500&fit=crop',
    lifestyle: [
      'https://images.unsplash.com/photo-1509941943102-10c232fc06e0?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581952976147-5a2d15560349?w=600&h=400&fit=crop',
    ],
  },
  restaurant: {
    hero: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
    ],
    products: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
    ],
    about: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=500&fit=crop',
  },
  'health-beauty': {
    hero: [
      'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
    ],
    products: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop',
    ],
    about: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop',
  },
  fitness: {
    hero: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
    ],
    products: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=400&fit=crop',
    ],
    about: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop',
  },
  professional: {
    hero: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop',
    ],
    products: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop',
    ],
    about: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=500&fit=crop',
  },
  ecommerce: {
    hero: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    ],
    products: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
    ],
    about: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
  },
};

function getImages(industry: string) {
  const key = industry?.toLowerCase().replace(/[^a-z]/g, '') || 'professional';
  return CURATED_IMAGES[key as keyof typeof CURATED_IMAGES] || CURATED_IMAGES.professional;
}

// =============================================================================
// DESIGN SYSTEM
// =============================================================================

const DESIGNS: Record<string, {
  name: string;
  fonts: string;
  colors: Record<string, string>;
  style: string;
}> = {
  luxury_minimal: {
    name: "Luxury Minimal",
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600&display=swap');
    :root { --font-display: 'Cormorant Garamond', serif; --font-body: 'Montserrat', sans-serif; }`,
    colors: {
      '--primary': '#1a1a1a',
      '--primary-rgb': '26, 26, 26',
      '--secondary': '#c4a052',
      '--secondary-rgb': '196, 160, 82',
      '--accent': '#8b7355',
      '--bg': '#fdfcfa',
      '--bg-alt': '#f7f5f0',
      '--text': '#1a1a1a',
      '--text-muted': '#6b6b6b',
      '--border': '#e8e4dc',
    },
    style: "Elegant, refined, lots of whitespace, gold accents"
  },
  bold_modern: {
    name: "Bold Modern",
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
    :root { --font-display: 'Space Grotesk', sans-serif; --font-body: 'Inter', sans-serif; }`,
    colors: {
      '--primary': '#6366f1',
      '--primary-rgb': '99, 102, 241',
      '--secondary': '#8b5cf6',
      '--secondary-rgb': '139, 92, 246',
      '--accent': '#06b6d4',
      '--bg': '#ffffff',
      '--bg-alt': '#f8fafc',
      '--text': '#0f172a',
      '--text-muted': '#64748b',
      '--border': '#e2e8f0',
    },
    style: "Tech-forward, vibrant, gradient accents"
  },
  warm_organic: {
    name: "Warm Organic",
    fonts: `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');
    :root { --font-display: 'DM Serif Display', serif; --font-body: 'DM Sans', sans-serif; }`,
    colors: {
      '--primary': '#b45309',
      '--primary-rgb': '180, 83, 9',
      '--secondary': '#15803d',
      '--secondary-rgb': '21, 128, 61',
      '--accent': '#dc2626',
      '--bg': '#fffbeb',
      '--bg-alt': '#fef3c7',
      '--text': '#1c1917',
      '--text-muted': '#78716c',
      '--border': '#e7e5e4',
    },
    style: "Warm, friendly, natural feel"
  },
  dark_premium: {
    name: "Dark Premium",
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
    :root { --font-display: 'Outfit', sans-serif; --font-body: 'Outfit', sans-serif; }`,
    colors: {
      '--primary': '#ffffff',
      '--primary-rgb': '255, 255, 255',
      '--secondary': '#a855f7',
      '--secondary-rgb': '168, 85, 247',
      '--accent': '#22d3ee',
      '--bg': '#0a0a0a',
      '--bg-alt': '#171717',
      '--text': '#fafafa',
      '--text-muted': '#a1a1aa',
      '--border': 'rgba(255,255,255,0.1)',
    },
    style: "Dark, sleek, glowing accents"
  },
  editorial_classic: {
    name: "Editorial Classic",
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600&display=swap');
    :root { --font-display: 'Playfair Display', serif; --font-body: 'Source Sans Pro', sans-serif; }`,
    colors: {
      '--primary': '#1e3a5f',
      '--primary-rgb': '30, 58, 95',
      '--secondary': '#b8860b',
      '--secondary-rgb': '184, 134, 11',
      '--accent': '#166534',
      '--bg': '#ffffff',
      '--bg-alt': '#f8f6f3',
      '--text': '#1e293b',
      '--text-muted': '#64748b',
      '--border': '#e2e8f0',
    },
    style: "Professional, trustworthy, classic"
  },
  vibrant_energy: {
    name: "Vibrant Energy",
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&display=swap');
    :root { --font-display: 'Syne', sans-serif; --font-body: 'Work Sans', sans-serif; }`,
    colors: {
      '--primary': '#7c3aed',
      '--primary-rgb': '124, 58, 237',
      '--secondary': '#ec4899',
      '--secondary-rgb': '236, 72, 153',
      '--accent': '#14b8a6',
      '--bg': '#fafafa',
      '--bg-alt': '#f5f3ff',
      '--text': '#18181b',
      '--text-muted': '#71717a',
      '--border': '#e4e4e7',
    },
    style: "Energetic, playful, bold gradients"
  },
};

// =============================================================================
// CSS TEMPLATE
// =============================================================================

function generateCSS(design: typeof DESIGNS[string]): string {
  const colorVars = Object.entries(design.colors).map(([k, v]) => `${k}: ${v};`).join('\n  ');
  
  return `
${design.fonts}

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  ${colorVars}
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

/* Layout */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
section { padding: 100px 0; }

/* Typography */
h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 600; line-height: 1.2; }
h1 { font-size: clamp(2.5rem, 5vw, 4rem); letter-spacing: -0.02em; }
h2 { font-size: clamp(2rem, 4vw, 3rem); letter-spacing: -0.01em; }
h3 { font-size: 1.25rem; }
p { color: var(--text-muted); }

/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 0;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 40px;
  list-style: none;
}

.nav-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover { color: var(--text); }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--text);
  color: var(--bg);
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: var(--text);
  border: 2px solid var(--border);
}

.btn-outline:hover {
  border-color: var(--text);
}

/* Hero */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 80px;
  background: var(--bg-alt);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-badge {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(var(--secondary-rgb), 0.15);
  color: var(--secondary);
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 24px;
}

.hero h1 { margin-bottom: 24px; }

.hero-text {
  font-size: 1.15rem;
  margin-bottom: 40px;
  max-width: 480px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
}

.hero-image {
  position: relative;
}

.hero-image img {
  width: 100%;
  height: 550px;
  object-fit: cover;
  border-radius: 16px;
}

.hero-stats {
  display: flex;
  gap: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
}

.stat { text-align: left; }

.stat-number {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* Section Header */
.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 60px;
}

.section-badge {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--text);
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.section-title { margin-bottom: 16px; }
.section-desc { font-size: 1.1rem; }

/* Products/Services Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.product-card {
  background: var(--bg);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.product-image {
  position: relative;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 12px;
  background: var(--bg);
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.product-info {
  padding: 24px;
}

.product-title {
  margin-bottom: 8px;
}

.product-price {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
}

/* Features */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.feature {
  text-align: center;
  padding: 32px 24px;
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: var(--bg-alt);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 1.5rem;
}

.feature h3 { margin-bottom: 8px; }

/* Testimonials */
.testimonials { background: var(--bg-alt); }

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.testimonial {
  background: var(--bg);
  border-radius: 16px;
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

.testimonial-name { font-weight: 600; }
.testimonial-role { font-size: 0.85rem; color: var(--text-muted); }

/* CTA */
.cta {
  background: var(--text);
  color: var(--bg);
  text-align: center;
  padding: 80px 0;
}

.cta h2 { color: var(--bg); margin-bottom: 16px; }
.cta p { color: rgba(255,255,255,0.7); margin-bottom: 32px; max-width: 500px; margin-left: auto; margin-right: auto; }
.cta .btn-primary { background: var(--bg); color: var(--text); }

/* Contact */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 1rem;
  background: var(--bg-alt);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--text);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.contact-item {
  display: flex;
  gap: 16px;
}

.contact-icon {
  width: 56px;
  height: 56px;
  background: var(--bg-alt);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.contact-label { font-size: 0.9rem; color: var(--text-muted); }
.contact-value { font-weight: 600; font-size: 1.1rem; }

/* Footer */
.footer {
  background: var(--bg-alt);
  padding: 80px 0 40px;
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
  font-weight: 600;
  margin-bottom: 16px;
}

.footer-desc {
  color: var(--text-muted);
  max-width: 280px;
}

.footer-title {
  font-weight: 600;
  margin-bottom: 20px;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: var(--text-muted);
  text-decoration: none;
}

.footer-links a:hover { color: var(--text); }

.footer-bottom {
  padding-top: 32px;
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; text-align: center; }
  .hero-text { margin-left: auto; margin-right: auto; }
  .hero-buttons { justify-content: center; }
  .hero-stats { justify-content: center; }
  .hero-image { max-width: 500px; margin: 40px auto 0; }
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .testimonials-grid { grid-template-columns: 1fr; max-width: 500px; margin: 0 auto; }
  .contact-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 640px) {
  section { padding: 60px 0; }
  .nav-links { display: none; }
  .products-grid { grid-template-columns: 1fr; }
  .features-grid { grid-template-columns: 1fr; }
  .hero-stats { flex-direction: column; gap: 24px; }
  .footer-grid { grid-template-columns: 1fr; }
}
`;
}

// =============================================================================
// HTML GENERATION
// =============================================================================

async function generateHTML(project: any): Promise<string> {
  const designKey = project.design_direction || 'luxury_minimal';
  const design = DESIGNS[designKey] || DESIGNS.luxury_minimal;
  const images = getImages(project.industry);
  const css = generateCSS(design);

  const systemPrompt = `You are an expert web developer. Create a beautiful, professional landing page.

CRITICAL RULES:
1. Output ONLY valid HTML - NO markdown, NO code blocks, NO explanations
2. Start with <!DOCTYPE html> and end with </html>
3. Use ONLY the CSS classes provided - they are already styled
4. Use the EXACT image URLs provided
5. Create realistic, compelling content for this specific business
6. DO NOT add any inline styles - use only the provided classes`;

  const userPrompt = `Create a landing page for:

BUSINESS: ${project.business_name}
INDUSTRY: ${project.industry || 'jewelry'}
DESCRIPTION: ${project.description || 'Premium quality products and services'}
TARGET CUSTOMER: ${project.target_customer || 'style-conscious customers'}
UNIQUE VALUE: ${project.unique_value || 'exceptional quality'}
SERVICES/PRODUCTS: ${project.primary_services?.join(', ') || 'Premium products'}
CTA TEXT: ${project.call_to_action || 'Shop Now'}
EMAIL: ${project.contact_email || 'hello@example.com'}
PHONE: ${project.contact_phone || '(555) 123-4567'}

IMAGE URLS TO USE:
- Hero image: ${images.hero[0]}
- Product 1: ${images.products[0]}
- Product 2: ${images.products[1]}
- Product 3: ${images.products[2]}
- Avatars: https://i.pravatar.cc/100?img=1, ?img=5, ?img=8

REQUIRED SECTIONS (in order):

1. NAVIGATION:
<nav class="nav">
  <div class="container nav-inner">
    <a href="#" class="logo">${project.business_name}</a>
    <ul class="nav-links">
      <li><a href="#products">Shop</a></li>
      <li><a href="#features">Why Us</a></li>
      <li><a href="#reviews">Reviews</a></li>
      <li><a href="#contact">Contact</a></li>
      <li><a href="#contact" class="btn btn-primary">${project.call_to_action || 'Shop Now'}</a></li>
    </ul>
  </div>
</nav>

2. HERO with hero-grid, hero-badge, h1, hero-text, hero-buttons, hero-image, hero-stats

3. PRODUCTS section (id="products") with products-grid and 3 product-card items

4. FEATURES section with features-grid and 4 feature items with icons (use emojis like ✨ 🔒 💎 🚚)

5. TESTIMONIALS section (id="reviews", class="testimonials") with testimonials-grid and 3 testimonial items

6. CTA section (class="cta")

7. CONTACT section (id="contact") with contact-grid

8. FOOTER (class="footer") with footer-grid

Make the content specific and compelling for a ${project.industry || 'jewelry'} business. 
Use realistic product names and prices.
Output ONLY the complete HTML document.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  });

  let html = (response.content[0] as any).text.trim();
  
  // Clean markdown artifacts
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim();
  
  // Inject CSS
  if (html.includes('</head>')) {
    html = html.replace('</head>', `<style>${css}</style></head>`);
  }
  
  // Add scroll behavior script
  const script = `<script>
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
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
  console.log('🚀 Starting generation...');
  
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Fetch project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    console.log(`📋 Generating for: ${project.business_name}`);

    // Generate HTML
    const html = await generateHTML(project);

    // Validate
    if (!html || html.length < 500 || !html.includes('<!DOCTYPE')) {
      throw new Error('Invalid HTML generated');
    }

    // Save
    await supabase
      .from('projects')
      .update({
        generated_html: html,
        status: 'PREVIEW_READY',
        review_score: null,
        review_details: null,
      })
      .eq('id', projectId);

    console.log('✅ Generation complete!');

    return NextResponse.json({ success: true, htmlLength: html.length });

  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Generation failed', details: error.message },
      { status: 500 }
    );
  }
}
