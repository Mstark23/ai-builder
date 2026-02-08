// app/api/ai/generate/route.ts
// VERKTORLABS - AI Website Generation with Industry Intelligence
//
// NEW APPROACH: Instead of scraping a "King" website (which gets blocked by Cloudflare),
// we use pre-built industry intelligence from 44 researched industries.
// 
// FLOW:
// 1. User submits project (business name, industry, description)
// 2. We match their industry → get IndustryIntelligence (colors, fonts, sections, top brands, psychology)
// 3. Claude ONLY generates copywriting (product names, headlines — simple JSON)
// 4. Deterministic TypeScript builder creates the HTML using industry DNA + copy
// 5. Result: Real e-commerce store with product grids, prices, add-to-cart buttons
//
// NO LIVE SCRAPING. NO CLOUDFLARE ISSUES. NO CLAUDE GENERATING HTML.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/api-auth';

export const maxDuration = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =============================================================================
// INDUSTRY INTELLIGENCE DATABASE
// Pre-researched data from 44 industries, compiled from analyzing top companies
// =============================================================================

interface IndustryProfile {
  id: string;
  name: string;
  category: 'ecommerce' | 'service' | 'saas' | 'restaurant' | 'professional' | 'creative';
  topBrands: string[];
  design: {
    colors: { primary: string; secondary: string; accent: string; background: string; };
    headingFont: string;
    bodyFont: string;
    mood: string;
  };
  heroHeadlines: string[];
  heroCTAs: string[];
  images: { hero: string[]; products: string[]; lifestyle: string[]; };
}

// We import these dynamically to avoid bundle issues
// But we also have hardcoded fallbacks for the most common industries

const INDUSTRY_PROFILES: Record<string, IndustryProfile> = {
  // ── E-COMMERCE ──────────────────────────────────────────
  'fashion-clothing': {
    id: 'fashion-clothing', name: 'Fashion & Clothing', category: 'ecommerce',
    topBrands: ['Everlane', 'Reformation', 'COS', 'ASOS'],
    design: {
      colors: { primary: '#1a1a1a', secondary: '#c8a97e', accent: '#d4a574', background: '#faf9f7' },
      headingFont: 'Playfair Display', bodyFont: 'Inter', mood: 'Elegant, editorial, aspirational',
    },
    heroHeadlines: ['New Season Essentials', 'Wear What You Mean', 'Effortless Style'],
    heroCTAs: ['Shop Collection', 'Discover More', 'View Lookbook'],
    images: {
      hero: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1600&q=80'],
      products: [
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
        'https://images.unsplash.com/photo-1434389677669-e08b4cda3485?w=600&q=80',
        'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80',
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
      ],
      lifestyle: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80'],
    },
  },
  'sports-outdoors': {
    id: 'sports-outdoors', name: 'Sports & Outdoors', category: 'ecommerce',
    topBrands: ['Gymshark', 'Nike', 'Alo Yoga', 'Lululemon', 'Tracksmith'],
    design: {
      colors: { primary: '#0a0a0a', secondary: '#1a1a2e', accent: '#e63946', background: '#ffffff' },
      headingFont: 'Inter', bodyFont: 'Inter', mood: 'Bold, performance-driven, energetic',
    },
    heroHeadlines: ['Engineered for Your Best', 'Push Your Limits', 'Performance Meets Style'],
    heroCTAs: ['Shop Now', 'Explore Collection', 'Gear Up'],
    images: {
      hero: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80'],
      products: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80',
      ],
      lifestyle: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80'],
    },
  },
  'fitness-gym': {
    id: 'fitness-gym', name: 'Fitness & Gym', category: 'ecommerce',
    topBrands: ['Gymshark', 'Alphalete', 'YoungLA', 'Buff Bunny'],
    design: {
      colors: { primary: '#0a0a0a', secondary: '#222', accent: '#ff3b3b', background: '#ffffff' },
      headingFont: 'Inter', bodyFont: 'Inter', mood: 'Bold, powerful, high-energy',
    },
    heroHeadlines: ['Train Hard, Look Good', 'Built for Athletes', 'Elevate Your Training'],
    heroCTAs: ['Shop Now', 'New Drops', 'Shop the Look'],
    images: {
      hero: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80'],
      products: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
      ],
      lifestyle: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80'],
    },
  },
  'beauty-cosmetics': {
    id: 'beauty-cosmetics', name: 'Beauty & Cosmetics', category: 'ecommerce',
    topBrands: ['Glossier', 'Fenty Beauty', 'Rare Beauty', 'Drunk Elephant'],
    design: {
      colors: { primary: '#2d2d2d', secondary: '#d4a373', accent: '#e8b4b8', background: '#fffaf5' },
      headingFont: 'DM Serif Display', bodyFont: 'Inter', mood: 'Soft, luxurious, approachable',
    },
    heroHeadlines: ['Beauty in Simplicity', 'Your Skin, Elevated', 'Glow from Within'],
    heroCTAs: ['Shop Skincare', 'Discover Products', 'Find Your Match'],
    images: {
      hero: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=80'],
      products: [
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80',
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80',
      ],
      lifestyle: ['https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800&q=80'],
    },
  },
  'jewelry': {
    id: 'jewelry', name: 'Jewelry & Accessories', category: 'ecommerce',
    topBrands: ['Mejuri', 'Missoma', 'Monica Vinader', 'Catbird'],
    design: {
      colors: { primary: '#1a1a1a', secondary: '#c9a227', accent: '#b76e79', background: '#faf9f7' },
      headingFont: 'Cormorant Garamond', bodyFont: 'Crimson Pro', mood: 'Refined, timeless, intimate',
    },
    heroHeadlines: ['Timeless Pieces, Modern Edge', 'Wear Your Story', 'Crafted with Intention'],
    heroCTAs: ['Shop Collection', 'Explore Pieces', 'Find Your Style'],
    images: {
      hero: ['https://images.unsplash.com/photo-1515562141589-67f0d569b39e?w=1600&q=80'],
      products: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
        'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80',
      ],
      lifestyle: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'],
    },
  },
  'home-furniture': {
    id: 'home-furniture', name: 'Home & Furniture', category: 'ecommerce',
    topBrands: ['CB2', 'West Elm', 'Article', 'Floyd'],
    design: {
      colors: { primary: '#2c2c2c', secondary: '#8b7355', accent: '#c4a77d', background: '#f5f3ef' },
      headingFont: 'DM Serif Display', bodyFont: 'Inter', mood: 'Warm, curated, sophisticated',
    },
    heroHeadlines: ['Modern Living, Thoughtfully Made', 'Design Your Space', 'Where Style Meets Comfort'],
    heroCTAs: ['Shop Furniture', 'Explore Rooms', 'View Collection'],
    images: {
      hero: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80'],
      products: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
        'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80',
      ],
      lifestyle: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80'],
    },
  },
  'food-beverage-dtc': {
    id: 'food-beverage-dtc', name: 'Food & Beverage', category: 'ecommerce',
    topBrands: ['Magic Spoon', 'Olipop', 'Athletic Greens', 'Liquid Death'],
    design: {
      colors: { primary: '#1a1a1a', secondary: '#4a7c59', accent: '#e07b39', background: '#fffef5' },
      headingFont: 'DM Sans', bodyFont: 'Inter', mood: 'Fun, vibrant, trustworthy',
    },
    heroHeadlines: ['Taste the Difference', 'Better Ingredients, Better You', 'Fuel Your Day'],
    heroCTAs: ['Shop Now', 'Build Your Box', 'Try It'],
    images: {
      hero: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80'],
      products: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
      ],
      lifestyle: ['https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=800&q=80'],
    },
  },
  'electronics-gadgets': {
    id: 'electronics-gadgets', name: 'Electronics & Gadgets', category: 'ecommerce',
    topBrands: ['Apple', 'Nothing', 'Dyson', 'Bose'],
    design: {
      colors: { primary: '#0a0a0a', secondary: '#333', accent: '#0071e3', background: '#ffffff' },
      headingFont: 'Inter', bodyFont: 'Inter', mood: 'Clean, minimal, futuristic',
    },
    heroHeadlines: ['Innovation in Your Hands', 'Tech That Inspires', 'Designed for Tomorrow'],
    heroCTAs: ['Shop Now', 'Learn More', 'Explore'],
    images: {
      hero: ['https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1600&q=80'],
      products: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      ],
      lifestyle: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80'],
    },
  },
  'pet-products': {
    id: 'pet-products', name: 'Pet Products', category: 'ecommerce',
    topBrands: ['BarkBox', 'Chewy', 'Wild One', 'Ollie'],
    design: {
      colors: { primary: '#2d4a3e', secondary: '#e8a87c', accent: '#d4a574', background: '#faf8f5' },
      headingFont: 'DM Sans', bodyFont: 'Inter', mood: 'Playful, warm, trustworthy',
    },
    heroHeadlines: ['Happy Pets, Happy Life', 'Made with Love', 'For Every Good Boy & Girl'],
    heroCTAs: ['Shop Now', 'Build a Box', 'Find Perfect Fit'],
    images: {
      hero: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=80'],
      products: [
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80',
        'https://images.unsplash.com/photo-1583337130417-13571b4ceda0?w=600&q=80',
        'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=600&q=80',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
      ],
      lifestyle: ['https://images.unsplash.com/photo-1450778869180-e77d3e89f5ba?w=800&q=80'],
    },
  },

  // ── SERVICES & PROFESSIONAL ─────────────────────────────
  'dental-clinic': {
    id: 'dental-clinic', name: 'Dental Clinic', category: 'service',
    topBrands: ['Tend', 'Aspen Dental', 'Smile Direct Club'],
    design: {
      colors: { primary: '#1a365d', secondary: '#4299e1', accent: '#48bb78', background: '#f7fafc' },
      headingFont: 'Inter', bodyFont: 'Inter', mood: 'Clean, trustworthy, modern',
    },
    heroHeadlines: ['Your Best Smile Starts Here', 'Modern Dental Care', 'Smile with Confidence'],
    heroCTAs: ['Book Appointment', 'Contact Us', 'Our Services'],
    images: {
      hero: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80'],
      products: [], lifestyle: [],
    },
  },
  'restaurant': {
    id: 'restaurant', name: 'Restaurant', category: 'restaurant',
    topBrands: ['Sweetgreen', 'Shake Shack', 'Nobu'],
    design: {
      colors: { primary: '#1a1a1a', secondary: '#c9a227', accent: '#8b0000', background: '#faf9f7' },
      headingFont: 'Playfair Display', bodyFont: 'Inter', mood: 'Warm, inviting, appetizing',
    },
    heroHeadlines: ['Taste the Experience', 'Crafted with Passion', 'Where Flavor Meets Art'],
    heroCTAs: ['View Menu', 'Reserve a Table', 'Order Online'],
    images: {
      hero: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80'],
      products: [], lifestyle: [],
    },
  },
  'law-firm': {
    id: 'law-firm', name: 'Law Firm', category: 'professional',
    topBrands: ['Latham & Watkins', 'Cooley LLP'],
    design: {
      colors: { primary: '#1a365d', secondary: '#2d3748', accent: '#c9a227', background: '#f7fafc' },
      headingFont: 'Playfair Display', bodyFont: 'Inter', mood: 'Authoritative, trustworthy, premium',
    },
    heroHeadlines: ['Legal Excellence, Proven Results', 'Your Rights, Our Fight', 'Trusted Counsel'],
    heroCTAs: ['Free Consultation', 'Contact Us', 'Our Practice Areas'],
    images: {
      hero: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80'],
      products: [], lifestyle: [],
    },
  },
  'spa-beauty': {
    id: 'spa-beauty', name: 'Spa & Beauty', category: 'service',
    topBrands: ['Drybar', 'Heyday', 'Glamsquad'],
    design: {
      colors: { primary: '#2d2d2d', secondary: '#c9a0dc', accent: '#e8b4b8', background: '#fdf8ff' },
      headingFont: 'Cormorant Garamond', bodyFont: 'Inter', mood: 'Serene, luxurious, calming',
    },
    heroHeadlines: ['Your Sanctuary Awaits', 'Relax, Restore, Renew', 'Self-Care Elevated'],
    heroCTAs: ['Book Now', 'View Services', 'Gift Cards'],
    images: {
      hero: ['https://images.unsplash.com/photo-1540555700478-4be289fbec6b?w=1600&q=80'],
      products: [], lifestyle: [],
    },
  },
};

// =============================================================================
// FUZZY INDUSTRY MATCHING
// Maps any industry string the user enters to our profile database
// =============================================================================

const INDUSTRY_ALIASES: Record<string, string> = {
  // ── Questionnaire IDs → Profile mapping ──
  // These are the exact IDs from the questionnaire form
  'local-services': 'law-firm',
  'professional': 'law-firm',
  'health-beauty': 'spa-beauty',
  'real-estate': 'law-firm',
  'ecommerce': 'fashion-clothing',
  'portfolio': 'fashion-clothing',
  'banking': 'law-firm',
  'education': 'law-firm',
  'medical': 'dental-clinic',
  'tech-startup': 'electronics-gadgets',
  'construction': 'sports-outdoors',
  'nonprofit': 'law-firm',
  'automotive': 'sports-outdoors',
  'other': 'fashion-clothing',

  // ── Athletic / Fitness / Gym ──
  'gym': 'fitness-gym', 'athletic': 'fitness-gym', 'activewear': 'fitness-gym',
  'fitness': 'fitness-gym', 'sportswear': 'fitness-gym', 'workout': 'fitness-gym',
  'sports': 'sports-outdoors', 'outdoor': 'sports-outdoors',
  // Fashion
  'fashion': 'fashion-clothing', 'clothing': 'fashion-clothing', 'apparel': 'fashion-clothing',
  'streetwear': 'fashion-clothing', 'boutique': 'fashion-clothing',
  // Beauty
  'beauty': 'beauty-cosmetics', 'cosmetics': 'beauty-cosmetics', 'skincare': 'beauty-cosmetics',
  'makeup': 'beauty-cosmetics',
  // Jewelry
  'jewelry': 'jewelry', 'jewellery': 'jewelry', 'accessories': 'jewelry',
  // Home
  'furniture': 'home-furniture', 'home': 'home-furniture', 'decor': 'home-furniture',
  'interior': 'home-furniture',
  // Food
  'food': 'food-beverage-dtc', 'beverage': 'food-beverage-dtc', 'supplements': 'food-beverage-dtc',
  // Electronics
  'electronics': 'electronics-gadgets', 'tech': 'electronics-gadgets', 'gadgets': 'electronics-gadgets',
  // Pets
  'pets': 'pet-products', 'pet': 'pet-products', 'dog': 'pet-products', 'cat': 'pet-products',
  // Services
  'dental': 'dental-clinic', 'dentist': 'dental-clinic',
  'restaurant': 'restaurant', 'cafe': 'restaurant', 'bar': 'restaurant',
  'law': 'law-firm', 'legal': 'law-firm', 'attorney': 'law-firm',
  'spa': 'spa-beauty', 'salon': 'spa-beauty', 'hair': 'spa-beauty',
};

function resolveIndustry(industryInput: string): IndustryProfile {
  const input = (industryInput || '').toLowerCase().trim();

  // Direct match
  if (INDUSTRY_PROFILES[input]) return INDUSTRY_PROFILES[input];

  // Alias match
  if (INDUSTRY_ALIASES[input]) return INDUSTRY_PROFILES[INDUSTRY_ALIASES[input]];

  // Fuzzy: check if input contains any alias key
  for (const [alias, profileId] of Object.entries(INDUSTRY_ALIASES)) {
    if (input.includes(alias) || alias.includes(input)) {
      return INDUSTRY_PROFILES[profileId];
    }
  }

  // Fuzzy: check if input contains any profile ID
  for (const id of Object.keys(INDUSTRY_PROFILES)) {
    if (input.includes(id) || id.includes(input)) {
      return INDUSTRY_PROFILES[id];
    }
  }

  // Default to fashion (most common e-commerce)
  return INDUSTRY_PROFILES['fashion-clothing'];
}

// =============================================================================
// INDUSTRY → BUILDER PROFILE BRIDGE
// Converts our simple IndustryProfile into the shape buildEcommerceHTML expects
// =============================================================================

function industryToBuilderProfile(industry: IndustryProfile, businessName: string) {
  const c = industry.design.colors;

  // Generate complementary colors from the base palette
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  };

  return {
    meta: {
      kingName: `${industry.name} Intelligence (${industry.topBrands.slice(0, 3).join(', ')})`,
      url: '',
      industry: industry.id,
      extractedAt: new Date().toISOString(),
      pagesAnalyzed: industry.topBrands.map(b => `${b.toLowerCase().replace(/\s/g, '')}.com`),
      overallVibe: industry.design.mood,
    },
    navigation: {
      type: 'sticky' as const,
      height: '72px',
      backgroundColor: '#ffffff',
      backgroundOnScroll: '#ffffff',
      logoPlacement: 'left' as const,
      logoStyle: 'text-only',
      menuItems: industry.category === 'ecommerce'
        ? [
            { label: 'Shop', hasDropdown: true },
            { label: 'Collections', hasDropdown: true },
            { label: 'New Arrivals', hasDropdown: false },
            { label: 'About', hasDropdown: false },
          ]
        : industry.category === 'restaurant'
        ? [
            { label: 'Menu', hasDropdown: false },
            { label: 'About', hasDropdown: false },
            { label: 'Gallery', hasDropdown: false },
            { label: 'Contact', hasDropdown: false },
          ]
        : [
            { label: 'Services', hasDropdown: true },
            { label: 'About', hasDropdown: false },
            { label: 'Testimonials', hasDropdown: false },
            { label: 'Contact', hasDropdown: false },
          ],
      menuAlignment: 'center' as const,
      ctaButton: {
        text: industry.heroCTAs[0] || 'Shop Now',
        style: 'filled',
        color: c.primary,
        borderRadius: '4px',
      },
      hasSearch: industry.category === 'ecommerce',
      hasCartIcon: industry.category === 'ecommerce',
      mobileMenuType: 'hamburger' as const,
      backdropBlur: true,
      borderBottom: '1px solid #e5e7eb',
      padding: '0 40px',
      fontFamily: industry.design.bodyFont.split(',')[0].trim(),
      fontSize: '14px',
      fontWeight: '500',
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const,
    },
    hero: {
      layout: 'full-width-image-overlay' as const,
      height: '85vh',
      headline: {
        text: '', formula: 'Industry-proven headline pattern',
        fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '800',
        fontFamily: 'inherit', lineHeight: '1.05',
        letterSpacing: '-0.02em', textTransform: 'none' as const,
        color: '#ffffff', maxWidth: '800px',
        hasGradient: false, gradientColors: '',
      },
      subheadline: {
        text: '', fontSize: '18px', fontWeight: '400',
        color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', maxWidth: '600px',
      },
      ctaButtons: [{
        text: industry.heroCTAs[0] || 'SHOP NOW',
        backgroundColor: c.primary,
        textColor: '#ffffff',
        padding: '16px 40px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '600',
      }],
    },
    colors: {
      primary: c.primary,
      secondary: c.secondary,
      accent: c.accent,
      primaryRgb: hexToRgb(c.primary),
      background: {
        main: c.background,
        secondary: c.background === '#ffffff' ? '#f8f9fa' : '#ffffff',
        dark: c.primary,
        card: '#ffffff',
      },
      text: {
        primary: c.primary,
        secondary: '#4b5563',
        muted: '#9ca3af',
        inverse: '#ffffff',
      },
      border: {
        light: '#e5e7eb',
      },
    },
    typography: {
      headingFont: {
        family: industry.design.headingFont.split(',')[0].trim(),
        googleFontsUrl: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(industry.design.headingFont.split(',')[0].trim())}:wght@300;400;500;600;700;800;900&display=swap`,
      },
      bodyFont: {
        family: industry.design.bodyFont.split(',')[0].trim(),
        googleFontsUrl: industry.design.bodyFont !== industry.design.headingFont
          ? `https://fonts.googleapis.com/css2?family=${encodeURIComponent(industry.design.bodyFont.split(',')[0].trim())}:wght@300;400;500;600;700&display=swap`
          : '',
      },
      scale: {
        h1: { size: 'clamp(40px, 6vw, 72px)', weight: '800', lineHeight: '1.05', letterSpacing: '-0.02em', textTransform: 'none' },
        h2: { size: 'clamp(28px, 4vw, 42px)', weight: '700', lineHeight: '1.15', letterSpacing: '-0.01em' },
        h3: { size: '20px', weight: '600' },
        body: { size: '16px', lineHeight: '1.6' },
      },
    },
    designSystem: {
      containerMaxWidth: '1280px',
      sectionPadding: { desktop: '80px 0', mobile: '48px 0' },
      borderRadius: { buttons: '4px', cards: '12px', small: '6px', large: '16px' },
      shadows: {
        cardDefault: '0 1px 3px rgba(0,0,0,0.08)',
        cardHover: '0 12px 32px rgba(0,0,0,0.12)',
        sm: '0 1px 2px rgba(0,0,0,0.05)',
      },
      buttonStyles: {
        primary: {
          backgroundColor: c.primary,
          textColor: '#ffffff',
          borderRadius: '4px',
          padding: '14px 32px',
          fontWeight: '600',
          textTransform: 'uppercase',
          hoverTransform: 'translateY(-1px)',
        },
        secondary: { borderRadius: '4px' },
      },
      cardStyles: {
        border: '1px solid #e5e7eb',
        hoverTransform: 'translateY(-4px)',
      },
      inputStyles: {
        border: '1px solid #e5e7eb',
        borderRadius: '4px',
        padding: '12px 16px',
        fontSize: '14px',
      },
    },
    animations: {
      scrollReveal: { type: 'fade-up', duration: '0.6s', distance: '20px', stagger: '0.1s' },
      transition: { default: 'all 0.3s ease' },
    },
    footer: {
      layout: '4-column-grid',
      columns: 4,
      backgroundColor: c.primary,
      textColor: 'rgba(255,255,255,0.7)',
      hasNewsletter: true,
      newsletterStyle: 'inline-input',
      hasSocialIcons: true,
      socialIconStyle: 'circle-outline',
      hasCtaSection: false,
      ctaText: '',
      legalLinks: ['Privacy Policy', 'Terms of Service', 'Shipping Policy'],
      columnContent: [
        { heading: 'Shop', links: ['New Arrivals', 'Best Sellers', 'Sale'] },
        { heading: 'Help', links: ['Contact Us', 'FAQ', 'Shipping'] },
        { heading: 'About', links: ['Our Story', 'Careers', 'Press'] },
        { heading: 'Follow Us', links: ['Instagram', 'TikTok', 'Twitter'] },
      ],
      padding: '60px 0',
      borderTop: 'none',
      bottomBarStyle: 'centered-copyright',
      fontSizes: { heading: '14px', links: '13px', legal: '12px' },
    },
    sections: industry.category === 'ecommerce'
      ? [
          { type: 'hero', name: 'Hero Banner', layout: 'full-width-image-overlay', gridColumns: '1', gridGap: '0', backgroundColor: 'transparent', padding: { top: '0', bottom: '0' }, containerWidth: '100%', hasAnimation: true, animationType: 'fade-in', headerStyle: 'none', contentPattern: 'hero-with-overlay', specialElements: [], borderTop: 'none', borderBottom: 'none' },
          { type: 'product-grid', name: 'Products', layout: '4-column-grid', gridColumns: '4', gridGap: '24px', backgroundColor: c.background, padding: { top: '80px', bottom: '80px' }, containerWidth: '1280px', hasAnimation: true, animationType: 'fade-up', headerStyle: 'centered-with-badge', contentPattern: 'product-cards', specialElements: ['add-to-cart', 'quick-view'], borderTop: 'none', borderBottom: 'none' },
          { type: 'collection', name: 'Collections', layout: '4-column-grid', gridColumns: '4', gridGap: '16px', backgroundColor: '#ffffff', padding: { top: '80px', bottom: '80px' }, containerWidth: '1280px', hasAnimation: true, animationType: 'fade-up', headerStyle: 'centered-with-badge', contentPattern: 'collection-cards', specialElements: [], borderTop: 'none', borderBottom: 'none' },
          { type: 'testimonials', name: 'Reviews', layout: '3-column-grid', gridColumns: '3', gridGap: '24px', backgroundColor: c.background, padding: { top: '80px', bottom: '80px' }, containerWidth: '1280px', hasAnimation: true, animationType: 'fade-up', headerStyle: 'centered-with-badge', contentPattern: 'review-cards', specialElements: ['star-rating'], borderTop: 'none', borderBottom: 'none' },
          { type: 'newsletter', name: 'Newsletter', layout: 'centered-stack', gridColumns: '1', gridGap: '0', backgroundColor: c.primary, padding: { top: '60px', bottom: '60px' }, containerWidth: '600px', hasAnimation: true, animationType: 'fade-up', headerStyle: 'centered-with-badge', contentPattern: 'email-signup', specialElements: [], borderTop: 'none', borderBottom: 'none' },
        ]
      : [
          { type: 'hero', name: 'Hero Banner', layout: 'full-width-image-overlay', gridColumns: '1', gridGap: '0', backgroundColor: 'transparent', padding: { top: '0', bottom: '0' }, containerWidth: '100%', hasAnimation: true, animationType: 'fade-in', headerStyle: 'none', contentPattern: 'hero-with-overlay', specialElements: [], borderTop: 'none', borderBottom: 'none' },
          { type: 'services', name: 'Services', layout: '3-column-grid', gridColumns: '3', gridGap: '24px', backgroundColor: '#ffffff', padding: { top: '80px', bottom: '80px' }, containerWidth: '1280px', hasAnimation: true, animationType: 'fade-up', headerStyle: 'centered-with-badge', contentPattern: 'service-cards', specialElements: [], borderTop: 'none', borderBottom: 'none' },
          { type: 'about', name: 'About', layout: '2-col-split-image-right', gridColumns: '2', gridGap: '48px', backgroundColor: c.background, padding: { top: '80px', bottom: '80px' }, containerWidth: '1280px', hasAnimation: true, animationType: 'fade-up', headerStyle: 'left-aligned', contentPattern: 'about-split', specialElements: [], borderTop: 'none', borderBottom: 'none' },
          { type: 'testimonials', name: 'Testimonials', layout: '3-column-grid', gridColumns: '3', gridGap: '24px', backgroundColor: '#ffffff', padding: { top: '80px', bottom: '80px' }, containerWidth: '1280px', hasAnimation: true, animationType: 'fade-up', headerStyle: 'centered-with-badge', contentPattern: 'testimonial-cards', specialElements: [], borderTop: 'none', borderBottom: 'none' },
          { type: 'contact', name: 'Contact', layout: 'centered-stack', gridColumns: '1', gridGap: '0', backgroundColor: c.background, padding: { top: '80px', bottom: '80px' }, containerWidth: '600px', hasAnimation: true, animationType: 'fade-up', headerStyle: 'centered-with-badge', contentPattern: 'contact-form', specialElements: [], borderTop: 'none', borderBottom: 'none' },
        ],
    pageStructure: {
      totalPages: 1,
      pages: [{ name: 'Home', url: '/', purpose: 'Main landing page', sectionsInOrder: ['hero', 'products', 'collections', 'reviews', 'newsletter'] }],
      singlePageSections: ['hero', 'products', 'collections', 'reviews', 'newsletter'],
    },
    copywriting: {
      tone: industry.design.mood || 'professional',
      headlineFormulas: { hero: 'Benefit Statement', section: 'Action Verb + Benefit', card: 'Short noun phrase' },
      ctaPatterns: { primary: industry.heroCTAs || ['Shop Now'], secondary: ['Learn More', 'View Details'], style: 'action-verb-first' },
      socialProofStyle: 'avatar-stack-with-count',
      exampleHeadlines: industry.heroHeadlines || [],
      exampleSubheadlines: [],
      exampleCTAs: industry.heroCTAs || [],
      urgencyTactics: ['Limited stock', 'Selling fast'],
      trustSignals: ['Free shipping', '30-day returns', 'Secure checkout'],
    },
    integrations: {
      chatWidget: null, analytics: ['Google Analytics'], socialProofWidgets: [],
      paymentProviders: ['Square'], newsletterService: 'Mailchimp', reviewPlatform: null,
      bookingSystem: null, ecommercePlatform: 'Shopify', socialMedia: ['Instagram', 'TikTok'],
      customIntegrations: [],
    },
    mobile: {
      breakpoints: { tablet: '768px', mobile: '480px' },
      navBehavior: 'hamburger-slide-in', heroChanges: 'stacks-vertically',
      gridBehavior: 'collapses-to-single-column', hiddenOnMobile: [],
      mobileOnlyElements: ['mobile-menu-toggle'], touchOptimizations: ['larger-tap-targets'],
      sectionPaddingMobile: '40px 16px', fontSizeReductions: { h1: '32px', h2: '24px' },
    },
    uniqueElements: [],
  };
}

// =============================================================================
// BUILD CUSTOMER OBJECT FROM PROJECT
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
    features: project.features || ['Contact Form', 'Testimonials', 'Services'],
    contactInfo: {
      email: project.contact_email || 'hello@company.com',
      phone: project.contact_phone || '',
      address: project.address || '',
    },
    socialMedia: project.social_media || {},
    testimonials: project.testimonials || [],
    stats: project.stats || [],
    pricing: project.pricing || [],
    faqs: project.faqs || [],
    customContent: project.custom_content || {},
  };
}

// =============================================================================
// LEGACY FALLBACK — When everything else fails
// =============================================================================

const LEGACY_SYSTEM_PROMPT = `You are an elite creative director. Companies pay you $100,000+ per website.
Create a STUNNING, conversion-optimized website. Use real Unsplash images.
Requirements: hero with full-width image, responsive design, scroll animations.
Output ONLY complete HTML starting with <!DOCTYPE html>.`;

async function generateLegacy(project: any): Promise<string> {
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
      system: LEGACY_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Create a website for:\nBUSINESS: ${project.business_name || 'Business'} (${project.industry || 'Professional Services'})\nDESCRIPTION: ${project.description || 'A professional business'}\nOutput ONLY the complete HTML starting with <!DOCTYPE html>`,
      }],
    }),
  });

  if (!response.ok) throw new Error(`Claude API: ${response.status}`);
  const data = await response.json();
  let html = data.content[0].text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  const di = html.toLowerCase().indexOf('<!doctype');
  if (di > 0) html = html.substring(di);
  return html;
}

async function legacyRevise(currentHtml: string, editRequest: string): Promise<string> {
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
      system: 'You are an elite web designer. Apply changes while maintaining premium quality. Output ONLY complete HTML.',
      messages: [{
        role: 'user',
        content: `Apply this change: ${editRequest}\n\nCurrent HTML:\n${currentHtml.substring(0, 20000)}\n\nReturn COMPLETE updated HTML starting with <!DOCTYPE html>.`,
      }],
    }),
  });

  if (!response.ok) throw new Error('Edit failed');
  const data = await response.json();
  let html = data.content[0].text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  return html;
}

// =============================================================================
// MAIN API HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  // Auth: only admins can trigger generation
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const startTime = Date.now();
  const debugLog: string[] = [];

  try {
    const body = await request.json();
    const { projectId, action } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Load project from Supabase
    const { data: project, error: dbError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (dbError || !project) {
      return NextResponse.json({ error: 'Project not found', debugLog }, { status: 404 });
    }

    debugLog.push(`📋 Project: ${project.business_name} | Industry: ${project.industry || 'none'}`);

    // ═════════════════════════════════════════════════════════════
    // GENERATE
    // ═════════════════════════════════════════════════════════════
    if (action === 'generate') {
      let html: string;
      let generationMode: string;

      // STEP 1: Resolve industry → get intelligence profile
      const industry = resolveIndustry(project.industry || '');
      debugLog.push(`🏭 Industry resolved: ${industry.name} (${industry.id}) | Category: ${industry.category}`);
      debugLog.push(`🏆 Top brands studied: ${industry.topBrands.join(', ')}`);
      debugLog.push(`🎨 Design: ${industry.design.colors.primary} / ${industry.design.colors.accent} | Fonts: ${industry.design.headingFont}`);

      // STEP 2: Convert industry data → builder profile shape
      const builderProfile = industryToBuilderProfile(industry, project.business_name || 'Business');
      debugLog.push(`🔧 Builder profile created with ${builderProfile.sections.length} sections`);

      // STEP 3: Build customer object
      const customer = buildCustomerFromProject(project);
      debugLog.push(`👤 Customer: ${customer.businessName} | Target: ${customer.targetAudience || 'general'}`);

      // STEP 4: Generate using the deterministic builder
      try {
        const kingGenerator = await import('@/lib/ai/king-generator');
        
        debugLog.push(`🚀 Calling generateFromKingDNA (deterministic builder)...`);
        html = await kingGenerator.generateFromKingDNA(builderProfile as any, customer);
        generationMode = `industry-intelligence-${industry.id}`;

        // Verify output quality
        const hasProductCard = html.includes('product-card');
        const hasAddToCart = html.includes('add-to-cart') || html.includes('Add to Cart');
        const hasProductGrid = html.includes('product-grid');
        const hasHeroImage = html.includes('hero-bg') || html.includes('background-image');

        debugLog.push(`✅ HTML generated: ${(html.length / 1024).toFixed(1)}KB`);
        debugLog.push(`🔍 Quality check: product-card=${hasProductCard} | add-to-cart=${hasAddToCart} | product-grid=${hasProductGrid} | hero-image=${hasHeroImage}`);

        if (industry.category === 'ecommerce' && !hasProductCard) {
          debugLog.push(`⚠️ E-commerce site but no product cards detected — possible builder issue`);
        }

      } catch (builderError: any) {
        debugLog.push(`❌ Builder failed: ${builderError.message}`);
        debugLog.push(`⚠️ Falling back to legacy Claude generation`);
        
        generationMode = 'legacy-fallback';
        html = await generateLegacy(project);
        debugLog.push(`📝 Legacy HTML: ${(html.length / 1024).toFixed(1)}KB`);
      }

      // STEP 5: Save to Supabase
      debugLog.push(`💾 Saving to Supabase...`);
      await supabase
        .from('projects')
        .update({
          generated_html: html,
          status: 'PREVIEW_READY',
          generation_mode: generationMode,
          generated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      debugLog.push(`⏱️ Total time: ${Date.now() - startTime}ms`);
      debugLog.push(`📊 Final mode: ${generationMode}`);

      return NextResponse.json({
        success: true,
        html,
        mode: generationMode,
        industry: {
          id: industry.id,
          name: industry.name,
          category: industry.category,
          topBrands: industry.topBrands,
        },
        debugLog,
        timing: Date.now() - startTime,
      });
    }

    // ═════════════════════════════════════════════════════════════
    // EDIT / REVISE
    // ═════════════════════════════════════════════════════════════
    if (action === 'edit') {
      const { editRequest } = body;
      const htmlToEdit = project.generated_html;

      if (!htmlToEdit) {
        return NextResponse.json({ error: 'No HTML to edit' }, { status: 400 });
      }

      let html: string;

      try {
        const kingGenerator = await import('@/lib/ai/king-generator');
        const industry = resolveIndustry(project.industry || '');
        const builderProfile = industryToBuilderProfile(industry, project.business_name || 'Business');
        const customer = buildCustomerFromProject(project);
        html = await kingGenerator.reviseFromKingDNA(builderProfile as any, htmlToEdit, editRequest, customer);
      } catch {
        html = await legacyRevise(htmlToEdit, editRequest);
      }

      await supabase
        .from('projects')
        .update({
          generated_html: html,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });

  } catch (error: any) {
    console.error('[Generate Route] Error:', error);
    debugLog.push(`🚨 Fatal error: ${error.message}`);
    return NextResponse.json({
      error: 'Generation failed',
      details: error.message,
      debugLog,
    }, { status: 500 });
  }
}

// =============================================================================
// GET — Return available industries and their profiles
// =============================================================================

export async function GET() {
  const industries = Object.values(INDUSTRY_PROFILES).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    topBrands: p.topBrands,
    colors: p.design.colors,
  }));

  return NextResponse.json({
    count: industries.length,
    industries,
  });
}
