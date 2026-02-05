// app/api/regenerate-section/route.ts
// Regenerate individual sections using King DNA v4 system
// E-commerce sections are rebuilt deterministically from King DNA tokens
// Non-ecommerce sections use Claude with King DNA context

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 120;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =============================================================================
// SECTION DEFINITIONS — Updated for e-commerce awareness
// =============================================================================

const SECTIONS: Record<string, {
  name: string;
  selector: RegExp;
  fallbackSelector?: RegExp;
  description: string;
  ecommerceKey?: string; // Maps to deterministic builder
}> = {
  nav: {
    name: 'Navigation',
    selector: /<nav[\s\S]*?<\/nav>/i,
    description: 'Top navigation bar',
    ecommerceKey: 'nav',
  },
  announce: {
    name: 'Announcement Bar',
    selector: /<div[^>]*class=["'][^"']*announce[^"']*["'][\s\S]*?<\/div>/i,
    description: 'Top announcement/promo bar',
    ecommerceKey: 'announce',
  },
  hero: {
    name: 'Hero Section',
    selector: /<section[^>]*(?:class=["'][^"']*hero[^"']*["'])[\s\S]*?<\/section>/i,
    fallbackSelector: /<!-- HERO[\s\S]*?<\/section>/i,
    description: 'Main hero banner',
    ecommerceKey: 'hero',
  },
  'trust-bar': {
    name: 'Trust Bar',
    selector: /<div[^>]*class=["'][^"']*trust-bar[^"']*["'][\s\S]*?<\/div>\s*<\/div>/i,
    fallbackSelector: /<div[^>]*class=["'][^"']*trust[^"']*["'][\s\S]*?<\/div>/i,
    description: 'Trust signals strip',
    ecommerceKey: 'trust',
  },
  products: {
    name: 'Products Section',
    selector: /<section[^>]*(?:id=["']products["']|class=["'][^"']*product[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Product grid with cards',
    ecommerceKey: 'products',
  },
  collections: {
    name: 'Collections Section',
    selector: /<section[^>]*(?:id=["']collections["']|class=["'][^"']*collection[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Collection categories',
    ecommerceKey: 'collections',
  },
  reviews: {
    name: 'Reviews Section',
    selector: /<section[^>]*(?:class=["'][^"']*review[^"']*["'])[\s\S]*?<\/section>/i,
    fallbackSelector: /<section[^>]*(?:id=["']testimonials["']|class=["'][^"']*testimonial[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Customer reviews and testimonials',
    ecommerceKey: 'reviews',
  },
  newsletter: {
    name: 'Newsletter Section',
    selector: /<section[^>]*class=["'][^"']*newsletter[^"']*["'][\s\S]*?<\/section>/i,
    description: 'Email signup section',
    ecommerceKey: 'newsletter',
  },
  services: {
    name: 'Services Section',
    selector: /<section[^>]*(?:id=["'](?:services|features)["']|class=["'][^"']*(?:services|features)[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Services or features grid',
  },
  about: {
    name: 'About Section',
    selector: /<section[^>]*(?:id=["']about["']|class=["'][^"']*about[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'About us section',
  },
  testimonials: {
    name: 'Testimonials Section',
    selector: /<section[^>]*(?:id=["']testimonials["']|class=["'][^"']*testimonial[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Customer testimonials',
  },
  stats: {
    name: 'Stats Section',
    selector: /<section[^>]*(?:id=["']stats["']|class=["'][^"']*stats[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Statistics section',
  },
  cta: {
    name: 'CTA Section',
    selector: /<section[^>]*(?:id=["']cta["']|class=["'][^"']*cta[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Call-to-action section',
  },
  contact: {
    name: 'Contact Section',
    selector: /<section[^>]*(?:id=["']contact["']|class=["'][^"']*contact[^"']*["'])[\s\S]*?<\/section>/i,
    description: 'Contact form section',
  },
  footer: {
    name: 'Footer',
    selector: /<footer[\s\S]*?<\/footer>/i,
    description: 'Page footer',
    ecommerceKey: 'footer',
  },
};

type SectionKey = keyof typeof SECTIONS;

// =============================================================================
// SITE TYPE DETECTION (mirrors king-generator v4)
// =============================================================================

function detectSiteType(profile: any): string {
  if (!profile) return 'generic';
  
  const industry = (profile.meta?.industry || '').toLowerCase();
  const hasCart = profile.navigation?.hasCartIcon;
  const navLabels = (profile.navigation?.menuItems || []).map((m: any) => m.label.toLowerCase()).join(' ');
  const sectionTypes = (profile.sections || []).map((s: any) => s.type.toLowerCase()).join(' ');

  if (hasCart ||
      navLabels.match(/shop|collection|product|sale|men|women|accessories/) ||
      sectionTypes.match(/product|catalog|collection/) ||
      industry.match(/fashion|jewelry|beauty|skincare|clothing|activewear|footwear|pet|food|beverage|supplement|home|furniture|bedding/)) {
    return 'ecommerce';
  }
  return 'generic';
}

// =============================================================================
// CUSTOMER BUILDER (mirrors generate route)
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
    contactInfo: {
      email: project.contact_email || 'hello@company.com',
      phone: project.contact_phone || '',
      address: project.address || '',
    },
  };
}

// =============================================================================
// ECOMMERCE SECTION BUILDERS — Deterministic, King DNA-powered
// These build the exact same HTML as king-generator v4 but per-section
// =============================================================================

function buildEcommerceSection(
  sectionKey: string,
  profile: any,
  customer: any,
  feedback: string
): string | null {
  const brand = customer.businessName;
  const industry = customer.industry || 'fashion';
  const c = profile.colors || {};
  const t = profile.typography || {};
  const ds = profile.designSystem || {};
  const nav = profile.navigation || {};
  const hero = profile.hero || {};
  const footer = profile.footer || {};

  switch (sectionKey) {
    case 'announce':
      return `<div class="announce">
    🚚 Free Shipping on Orders Over $75 &nbsp;|&nbsp; ${feedback || 'New Arrivals Just Dropped'}
  </div>`;

    case 'nav': {
      const navItems = (nav.menuItems || []).slice(0, 5);
      const navCta = nav.ctaButton?.text || 'Shop Now';
      const navLinks = navItems.map((item: any) => `<li><a href="#">${item.label}</a></li>`).join('\n            ');
      return `<nav class="nav">
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
  </nav>`;
    }

    case 'hero': {
      const heroImage = getHeroImage(industry);
      const ctaText = hero.ctaButtons?.[0]?.text || 'SHOP NOW';
      const tag = getHeroTag(industry);
      const headline = feedback || getHeroHeadline(industry, brand);
      const sub = customer.description || `Premium ${industry} products designed for those who demand excellence.`;
      return `<section class="hero">
    <img src="${heroImage}" alt="${brand}" class="hero-bg" />
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <span class="hero-tag">${tag}</span>
      <h1>${headline}</h1>
      <p class="hero-sub">${sub}</p>
      <div class="hero-ctas">
        <a href="#products" class="btn-primary">${ctaText}</a>
        <a href="#collections" class="btn-secondary">View Collections</a>
      </div>
    </div>
  </section>`;
    }

    case 'trust':
      return `<div class="trust-bar">
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
  </div>`;

    case 'products': {
      const productImages = getProductImages(industry);
      const productColors = getProductColors(industry);
      const products = getDefaultProducts(brand, industry);
      const ratings = [
        { rating: 4.8, reviews: 342 }, { rating: 4.7, reviews: 256 },
        { rating: 4.9, reviews: 489 }, { rating: 4.8, reviews: 378 },
        { rating: 4.6, reviews: 198 }, { rating: 4.7, reviews: 312 },
        { rating: 4.8, reviews: 423 }, { rating: 4.9, reviews: 567 },
      ];

      const cards = products.map((p: any, i: number) => {
        const img = productImages[i % productImages.length];
        const colors = productColors[i % productColors.length];
        const r = ratings[i];
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
                ${colors.map((clr: string) => `<span class="swatch" style="background:${clr}"></span>`).join('')}
              </div>
              <button class="add-to-cart">ADD TO CART</button>
            </div>
          </div>`;
      }).join('\n');

      return `<section class="section" id="products">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">${feedback || 'Best Sellers'}</h2>
        <a href="#" class="view-all">View All →</a>
      </div>
      <div class="product-grid">
${cards}
      </div>
    </div>
  </section>`;
    }

    case 'collections': {
      const collectionImages = getCollectionImages(industry);
      const collections = getCollections(industry);
      const cards = collections.map((name: string, i: number) => {
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

      return `<section class="section" id="collections" style="background: var(--bg-alt);">
    <div class="container">
      <h2 class="section-title" style="margin-bottom:40px;">Shop by Collection</h2>
      <div class="collection-grid">
${cards}
      </div>
    </div>
  </section>`;
    }

    case 'reviews': {
      const quotes = [
        { text: 'Absolutely love the quality. Fits perfectly and the material is premium. Will definitely order again!', name: 'Sarah M.' },
        { text: `Best ${industry} purchase I've made. The attention to detail is incredible. Shipped fast too!`, name: 'James K.' },
        { text: `I've tried many brands but ${brand} stands out. The quality-to-price ratio is unmatched.`, name: 'Maria L.' },
      ];
      const reviewCards = quotes.map(q => `
          <div class="review-card">
            <div class="review-stars">★★★★★</div>
            <p class="review-text">&ldquo;${q.text}&rdquo;</p>
            <div class="review-author">
              <strong>${q.name}</strong>
              <span class="verified">✓ Verified Purchase</span>
            </div>
          </div>`).join('\n');

      return `<section class="section reviews-section">
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
  </section>`;
    }

    case 'newsletter':
      return `<section class="newsletter">
    <h2>${feedback || 'Get 10% Off Your First Order'}</h2>
    <p class="newsletter-sub">Join 15,000+ subscribers for exclusive deals and new arrivals.</p>
    <div class="newsletter-form">
      <input type="email" placeholder="Enter your email" />
      <button>SUBSCRIBE</button>
    </div>
    <p class="newsletter-privacy">We respect your privacy. Unsubscribe anytime.</p>
  </section>`;

    case 'footer': {
      const aboutBlurb = customer.description || `${brand} — premium products delivered to your door.`;
      return `<footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>${brand}</h4>
          <p class="footer-about">${aboutBlurb}</p>
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
  </footer>`;
    }

    default:
      return null; // Not an e-commerce section — fall through to Claude
  }
}

// =============================================================================
// INDUSTRY DATA HELPERS (mirrors king-generator v4)
// =============================================================================

function getHeroImage(industry: string): string {
  const ind = industry.toLowerCase();
  if (ind.match(/gym|athletic|activewear|fitness/)) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80';
  if (ind.match(/jewel/)) return 'https://images.unsplash.com/photo-1515562141207-82f56648e57c?w=1600&q=80';
  if (ind.match(/beauty|skincare/)) return 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=80';
  return 'https://images.unsplash.com/photo-1441984904996-e0b6ba687f04?w=1600&q=80';
}

function getHeroTag(industry: string): string {
  const ind = industry.toLowerCase();
  if (ind.match(/gym|athletic|fitness/)) return 'New Season Collection';
  if (ind.match(/jewel/)) return 'Handcrafted Luxury';
  if (ind.match(/beauty|skincare/)) return 'Clean Beauty Essentials';
  return 'New Collection';
}

function getHeroHeadline(industry: string, brand: string): string {
  const ind = industry.toLowerCase();
  if (ind.match(/gym|athletic|fitness/)) return 'Engineered for Your Best';
  if (ind.match(/jewel/)) return 'Timeless Pieces, Modern Edge';
  if (ind.match(/beauty|skincare/)) return 'Your Skin Deserves the Best';
  return `Discover ${brand}`;
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

function getProductColors(industry: string): string[][] {
  const ind = industry.toLowerCase();
  if (ind.match(/gym|athletic|activewear|fitness/)) return [
    ['#1a1a1a', '#2d3748', '#c53030'], ['#1a1a1a', '#2b6cb0', '#38a169'],
    ['#1a1a1a', '#553c9a', '#d53f8c'], ['#4a5568', '#1a1a1a', '#2d3748'],
    ['#fff', '#1a1a1a', '#e53e3e'], ['#4a5568', '#1a1a1a', '#2b6cb0'],
    ['#1a1a1a', '#d53f8c', '#553c9a'], ['#1a1a1a', '#718096', '#d53f8c'],
  ];
  if (ind.match(/jewel/)) return [
    ['#d4af37', '#c0c0c0', '#e5c890'], ['#d4af37', '#c0c0c0', '#e5c890'],
    ['#d4af37', '#c0c0c0', '#b76e79'], ['#d4af37', '#c0c0c0', '#e5c890'],
    ['#d4af37', '#c0c0c0', '#e5c890'], ['#d4af37', '#c0c0c0', '#b76e79'],
    ['#d4af37', '#c0c0c0', '#e5c890'], ['#d4af37', '#c0c0c0', '#b76e79'],
  ];
  return [
    ['#1a1a1a', '#4a5568', '#718096'], ['#1a1a1a', '#2d3748', '#a0aec0'],
    ['#1a1a1a', '#4a5568', '#e53e3e'], ['#1a1a1a', '#2b6cb0', '#4a5568'],
    ['#1a1a1a', '#38a169', '#4a5568'], ['#1a1a1a', '#4a5568', '#d69e2e'],
    ['#1a1a1a', '#553c9a', '#4a5568'], ['#1a1a1a', '#4a5568', '#dd6b20'],
  ];
}

function getCollections(industry: string): string[] {
  const ind = industry.toLowerCase();
  if (ind.match(/gym|athletic|activewear|fitness/)) return ['New Arrivals', "Men's Training", "Women's Training", 'Accessories'];
  if (ind.match(/jewel/)) return ['Necklaces', 'Earrings', 'Rings', 'Bracelets'];
  if (ind.match(/beauty|skincare/)) return ['Skincare', 'Body Care', 'Gift Sets', 'Best Sellers'];
  return ['New Arrivals', 'Best Sellers', 'Collections', 'Sale'];
}

function getDefaultProducts(brand: string, industry: string): { name: string; price: string }[] {
  const ind = industry.toLowerCase();
  if (ind.match(/gym|athletic|activewear|fitness/)) return [
    { name: `${brand} Performance Tee`, price: '39.99' },
    { name: `${brand} Flex Shorts`, price: '44.99' },
    { name: `${brand} Pro Leggings`, price: '54.99' },
    { name: `${brand} Essential Hoodie`, price: '64.99' },
    { name: `${brand} Training Tank`, price: '29.99' },
    { name: `${brand} Joggers`, price: '49.99' },
    { name: `${brand} Sports Bra`, price: '34.99' },
    { name: `${brand} Seamless Set`, price: '74.99' },
  ];
  if (ind.match(/jewel/)) return [
    { name: `${brand} Classic Chain`, price: '28.99' },
    { name: `${brand} Pearl Drops`, price: '22.99' },
    { name: `${brand} Signet Ring`, price: '34.99' },
    { name: `${brand} Tennis Bracelet`, price: '45.99' },
    { name: `${brand} Layered Necklace`, price: '32.99' },
    { name: `${brand} Gold Hoops`, price: '19.99' },
    { name: `${brand} Pendant Charm`, price: '26.99' },
    { name: `${brand} Cuff Bracelet`, price: '38.99' },
  ];
  return [
    { name: `${brand} Essential`, price: '39.99' },
    { name: `${brand} Classic`, price: '44.99' },
    { name: `${brand} Premium`, price: '54.99' },
    { name: `${brand} Signature`, price: '64.99' },
    { name: `${brand} Core`, price: '29.99' },
    { name: `${brand} Select`, price: '49.99' },
    { name: `${brand} Original`, price: '34.99' },
    { name: `${brand} Complete Set`, price: '74.99' },
  ];
}

// =============================================================================
// CLAUDE FALLBACK — For non-ecommerce or unrecognized sections
// =============================================================================

async function regenerateWithClaude(
  sectionKey: string,
  project: any,
  profile: any,
  feedback: string,
  existingSection: string | null,
  cssVariables: string
): Promise<string> {
  const section = SECTIONS[sectionKey];
  const brand = project.business_name || 'My Business';

  // Build King DNA context if available
  let kingContext = '';
  if (profile) {
    const c = profile.colors || {};
    const t = profile.typography || {};
    const ds = profile.designSystem || {};
    kingContext = `
## KING DNA DESIGN SPECS
- Primary: ${c.primary}; Secondary: ${c.secondary}; Accent: ${c.accent}
- Fonts: ${t.headingFont?.family || 'sans-serif'} (headings), ${t.bodyFont?.family || 'sans-serif'} (body)
- Button: bg ${ds.buttonStyles?.primary?.backgroundColor}; radius ${ds.buttonStyles?.primary?.borderRadius}
- Card: radius ${ds.cardStyles?.borderRadius}; shadow ${ds.cardStyles?.shadow}
- Use CSS variables: var(--primary), var(--secondary), var(--font-heading), var(--font-body), etc.
`;
  }

  const prompt = `You are an elite frontend developer. Generate ONLY the HTML for the ${section.name}.

## BUSINESS
Name: ${brand}
Industry: ${project.industry || ''}
Description: ${project.description || ''}
CTA: ${project.call_to_action || 'Get Started'}

${kingContext}

## CSS VARIABLES IN USE
${cssVariables}

${feedback ? `## CUSTOMER FEEDBACK\n"${feedback}"\nAddress this directly.\n` : ''}

${existingSection ? `## EXISTING SECTION\n${existingSection.substring(0, 2000)}\nImprove upon this.\n` : ''}

## RULES
1. Output ONLY the section HTML (<section>, <nav>, or <footer>)
2. Use CSS variables (var(--primary), var(--bg-main), var(--font-heading))
3. Mobile responsive
4. NO <style> or <script> tags
5. NO markdown, NO explanation

HTML:`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  let html = content.text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');

  // Extract valid HTML tag
  const validTags = ['<section', '<nav', '<footer', '<header', '<div'];
  const hasValidTag = validTags.some(tag => html.toLowerCase().startsWith(tag));
  if (!hasValidTag) {
    const match = html.match(/<(?:section|nav|footer|header|div)[\s\S]*<\/(?:section|nav|footer|header|div)>/i);
    if (match) html = match[0];
    else throw new Error('Invalid section HTML from Claude');
  }

  return html;
}

// =============================================================================
// SECTION REPLACEMENT
// =============================================================================

function replaceSection(html: string, sectionKey: string, newSection: string): string {
  const section = SECTIONS[sectionKey];
  if (!section) return html;

  if (section.selector.test(html)) {
    return html.replace(section.selector, newSection);
  }

  if (section.fallbackSelector && section.fallbackSelector.test(html)) {
    return html.replace(section.fallbackSelector, newSection);
  }

  return html;
}

function extractCSSVariables(html: string): string {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!styleMatch) return '';
  const rootMatch = styleMatch[1].match(/:root\s*{([^}]*)}/i);
  return rootMatch ? rootMatch[1] : '';
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, section, feedback } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    if (!section || !SECTIONS[section]) {
      return NextResponse.json({
        error: 'Invalid section',
        validSections: Object.keys(SECTIONS)
      }, { status: 400 });
    }

    const sectionKey = section as string;

    // Fetch project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.generated_html) {
      return NextResponse.json({ error: 'No generated HTML to modify' }, { status: 400 });
    }

    // Load King DNA profile if available
    let kingProfile: any = null;
    if (project.king_url) {
      const { data: cached } = await supabase
        .from('king_profiles')
        .select('profile_data')
        .eq('king_url', project.king_url)
        .eq('is_active', true)
        .single();

      if (cached?.profile_data) {
        kingProfile = cached.profile_data;
        console.log(`👑 Loaded King profile for regeneration: ${kingProfile.meta?.kingName || project.king_name}`);
      }
    }

    // Detect site type
    const siteType = detectSiteType(kingProfile);
    const customer = buildCustomerFromProject(project);
    const sectionDef = SECTIONS[sectionKey];

    console.log(`🔄 Regenerating ${sectionKey} | Site type: ${siteType} | King: ${project.king_name || 'none'}`);

    let newSection: string;

    // E-COMMERCE: Use deterministic builder if section has ecommerceKey
    if (siteType === 'ecommerce' && sectionDef.ecommerceKey) {
      console.log(`🏪 Using deterministic e-commerce builder for ${sectionKey}`);
      const built = buildEcommerceSection(
        sectionDef.ecommerceKey,
        kingProfile,
        customer,
        feedback || ''
      );

      if (built) {
        newSection = built;
      } else {
        // Fallback to Claude if builder doesn't handle this section
        const cssVars = extractCSSVariables(project.generated_html);
        const existing = project.generated_html.match(sectionDef.selector)?.[0] || null;
        newSection = await regenerateWithClaude(sectionKey, project, kingProfile, feedback || '', existing, cssVars);
      }
    } else {
      // NON-ECOMMERCE: Use Claude with King DNA context
      console.log(`🤖 Using Claude for ${sectionKey} regeneration`);
      const cssVars = extractCSSVariables(project.generated_html);
      const existing = project.generated_html.match(sectionDef.selector)?.[0] || null;
      newSection = await regenerateWithClaude(sectionKey, project, kingProfile, feedback || '', existing, cssVars);
    }

    // Replace section in full HTML
    const updatedHtml = replaceSection(project.generated_html, sectionKey, newSection);

    if (updatedHtml === project.generated_html) {
      console.warn(`⚠️ Section replacement may have failed for ${sectionKey}`);
    }

    // Save
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        generated_html: updatedHtml,
        status: 'PREVIEW_READY',
      })
      .eq('id', projectId);

    if (updateError) throw updateError;

    console.log(`✅ ${sectionKey} regenerated (${siteType === 'ecommerce' && sectionDef.ecommerceKey ? 'deterministic' : 'Claude'})`);

    return NextResponse.json({
      success: true,
      section: sectionKey,
      mode: siteType === 'ecommerce' && sectionDef.ecommerceKey ? 'deterministic' : 'claude',
      message: `${sectionDef.name} regenerated successfully`,
    });

  } catch (error: any) {
    console.error('❌ Section regeneration error:', error);
    return NextResponse.json(
      { error: 'Regeneration failed', details: error.message },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET: List available sections (with e-commerce awareness)
// =============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (projectId) {
    const { data: project } = await supabase
      .from('projects')
      .select('generated_html, king_url')
      .eq('id', projectId)
      .single();

    if (!project?.generated_html) {
      return NextResponse.json({ error: 'Project not found or no HTML' }, { status: 404 });
    }

    // Load King profile for site type detection
    let kingProfile: any = null;
    if (project.king_url) {
      const { data: cached } = await supabase
        .from('king_profiles')
        .select('profile_data')
        .eq('king_url', project.king_url)
        .eq('is_active', true)
        .single();
      if (cached?.profile_data) kingProfile = cached.profile_data;
    }

    const siteType = detectSiteType(kingProfile);
    const detectedSections: Record<string, boolean> = {};

    for (const [key, section] of Object.entries(SECTIONS)) {
      detectedSections[key] = section.selector.test(project.generated_html);
    }

    return NextResponse.json({
      sections: detectedSections,
      siteType,
      available: Object.keys(SECTIONS),
    });
  }

  return NextResponse.json({
    sections: Object.entries(SECTIONS).map(([key, value]) => ({
      id: key,
      name: value.name,
      description: value.description,
      ecommerce: !!value.ecommerceKey,
    })),
  });
}
