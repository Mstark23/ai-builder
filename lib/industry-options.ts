/**
 * VERKTORLABS - Industry Dropdown Options
 * 
 * Provides grouped industry options for use in dropdown/select components.
 * Industries are grouped by user-friendly categories with icons and metadata.
 */

import { ALL_INDUSTRIES, getIndustry } from './industry-intelligence';
import type { IndustryIntelligence } from '../types/industry';

// =============================================================================
// TYPES
// =============================================================================

export interface IndustryOption {
  id: string;
  name: string;
  icon: string;
  topBrands: string[];
}

export interface IndustryCategory {
  category: string;
  label: string;
  icon: string;
  description: string;
  industries: IndustryOption[];
}

export interface IndustryDesignPreview {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  mood: string;
  topBrands: string[];
}

// =============================================================================
// CATEGORY CONFIGURATIONS
// =============================================================================

/**
 * Category metadata for display purposes
 */
const CATEGORY_CONFIG: Record<string, { label: string; icon: string; description: string; order: number }> = {
  'e-commerce': {
    label: 'E-commerce & Retail',
    icon: '🛍️',
    description: 'Online stores, DTC brands, and retail businesses',
    order: 1,
  },
  'ecommerce': {
    label: 'E-commerce & Retail',
    icon: '🛍️',
    description: 'Online stores, DTC brands, and retail businesses',
    order: 1,
  },
  'local-services': {
    label: 'Local Services',
    icon: '📍',
    description: 'Restaurants, salons, fitness studios, and local businesses',
    order: 2,
  },
  'hospitality': {
    label: 'Hospitality & Travel',
    icon: '🏨',
    description: 'Hotels, resorts, travel, and tourism',
    order: 3,
  },
  'professional': {
    label: 'Professional Services',
    icon: '💼',
    description: 'Consulting, marketing, accounting, and business services',
    order: 4,
  },
  'legal': {
    label: 'Legal Services',
    icon: '⚖️',
    description: 'Law firms, attorneys, and legal professionals',
    order: 5,
  },
  'healthcare': {
    label: 'Healthcare',
    icon: '🏥',
    description: 'Medical practices, dental clinics, and healthcare providers',
    order: 6,
  },
  'financial': {
    label: 'Financial Services',
    icon: '💰',
    description: 'Financial advisors, insurance, and investment services',
    order: 7,
  },
  'tech': {
    label: 'Tech & SaaS',
    icon: '💻',
    description: 'Software companies, apps, and technology startups',
    order: 8,
  },
  'creative': {
    label: 'Creative & Portfolio',
    icon: '🎨',
    description: 'Designers, photographers, artists, and creatives',
    order: 9,
  },
  'education': {
    label: 'Education & Coaching',
    icon: '📚',
    description: 'Course creators, coaches, and educational businesses',
    order: 10,
  },
  'nonprofit': {
    label: 'Nonprofit & Charity',
    icon: '💝',
    description: 'Nonprofits, charities, and social impact organizations',
    order: 11,
  },
  'general': {
    label: 'General Business',
    icon: '🏢',
    description: 'General and multi-purpose business websites',
    order: 99,
  },
};

/**
 * Industry-specific icons
 */
const INDUSTRY_ICONS: Record<string, string> = {
  // E-commerce
  'jewelry': '💎',
  'fashion-clothing': '👗',
  'beauty-cosmetics': '💄',
  'home-furniture': '🛋️',
  'food-beverage-dtc': '🍽️',
  'pet-products': '🐾',
  'kids-baby': '👶',
  'sports-outdoors': '⚽',
  'electronics-gadgets': '📱',
  
  // Local Services
  'restaurant': '🍽️',
  'restaurant-fine-dining': '🥂',
  'restaurant-casual': '🍔',
  'cafe-coffee-shop': '☕',
  'salon-hair': '💇',
  'gym-boutique': '🏋️',
  'fitness-gym': '💪',
  'yoga-pilates': '🧘',
  'med-spa': '✨',
  'nail-salon': '💅',
  'spa-beauty': '🧖',
  
  // Professional
  'law-firm': '⚖️',
  'law-firm-personal-injury': '🏥',
  'law-firm-corporate': '📋',
  'accounting-cpa': '📊',
  'financial-advisor': '📈',
  'real-estate-residential': '🏠',
  'real-estate-commercial': '🏢',
  'marketing-agency': '📣',
  'consulting-management': '🎯',
  'architecture-firm': '🏗️',
  'insurance-agency': '🛡️',
  
  // Healthcare
  'dental-clinic': '🦷',
  
  // Tech & Creative
  'saas-startup': '🚀',
  'ai-tech-startup': '🤖',
  'mobile-app': '📲',
  'portfolio-designer': '🎨',
  'portfolio-developer': '👨‍💻',
  'photography-wedding': '📸',
  'photography-commercial': '📷',
  'course-creator': '🎓',
  'coach-life': '🌟',
  'wedding-planner': '💒',
  'hotel-hospitality': '🏨',
  'nonprofit-charity': '💝',
};

// =============================================================================
// GROUPED INDUSTRY OPTIONS
// =============================================================================

/**
 * Get industry options grouped by category for dropdown menus
 * This is the main export for use in form components
 */
export function getGroupedIndustryOptions(): IndustryCategory[] {
  // Group industries by their category
  const grouped = ALL_INDUSTRIES.reduce((acc, industry) => {
    const cat = industry.category;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(industry);
    return acc;
  }, {} as Record<string, IndustryIntelligence[]>);

  // Transform into structured format
  const categories: IndustryCategory[] = Object.entries(grouped)
    .map(([categoryKey, industries]) => {
      const config = CATEGORY_CONFIG[categoryKey] || {
        label: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1).replace(/-/g, ' '),
        icon: '📁',
        description: `${categoryKey} businesses`,
        order: 50,
      };

      return {
        category: categoryKey,
        label: config.label,
        icon: config.icon,
        description: config.description,
        industries: industries.map((ind) => ({
          id: ind.id,
          name: ind.name,
          icon: INDUSTRY_ICONS[ind.id] || '🏢',
          topBrands: ind.topBrands.slice(0, 3),
        })),
        _order: config.order,
      };
    })
    .sort((a, b) => (a as any)._order - (b as any)._order)
    .map(({ _order, ...rest }) => rest as IndustryCategory);

  return categories;
}

/**
 * Flat list of all industry options (for simple dropdowns)
 */
export function getFlatIndustryOptions(): IndustryOption[] {
  return ALL_INDUSTRIES.map((ind) => ({
    id: ind.id,
    name: ind.name,
    icon: INDUSTRY_ICONS[ind.id] || '🏢',
    topBrands: ind.topBrands.slice(0, 3),
  })).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get industry options for a specific category
 */
export function getIndustryOptionsByCategory(category: string): IndustryOption[] {
  const industries = ALL_INDUSTRIES.filter((ind) => ind.category === category);
  return industries.map((ind) => ({
    id: ind.id,
    name: ind.name,
    icon: INDUSTRY_ICONS[ind.id] || '🏢',
    topBrands: ind.topBrands.slice(0, 3),
  }));
}

// =============================================================================
// DESIGN PREVIEW HELPERS
// =============================================================================

/**
 * Get design preview for an industry (for showing in the form)
 */
export function getIndustryDesignPreview(industryId: string): IndustryDesignPreview | null {
  const industry = getIndustry(industryId);
  if (!industry) return null;

  return {
    colors: industry.design.colors,
    fonts: industry.design.fonts,
    mood: industry.design.mood,
    topBrands: industry.topBrands,
  };
}

/**
 * Get "inspired by" text for an industry
 */
export function getInspirationText(industryId: string): string {
  const industry = getIndustry(industryId);
  if (!industry) return '';

  const brands = industry.topBrands.slice(0, 3);
  if (brands.length === 0) return '';
  if (brands.length === 1) return `Inspired by: ${brands[0]}`;
  if (brands.length === 2) return `Inspired by: ${brands[0]} & ${brands[1]}`;
  return `Inspired by: ${brands.slice(0, -1).join(', ')} & ${brands[brands.length - 1]}`;
}

/**
 * Get full industry metadata for form display
 */
export function getIndustryMetadata(industryId: string): {
  id: string;
  name: string;
  icon: string;
  category: string;
  categoryLabel: string;
  topBrands: string[];
  inspirationText: string;
  design: IndustryDesignPreview;
} | null {
  const industry = getIndustry(industryId);
  if (!industry) return null;

  const config = CATEGORY_CONFIG[industry.category];

  return {
    id: industry.id,
    name: industry.name,
    icon: INDUSTRY_ICONS[industry.id] || '🏢',
    category: industry.category,
    categoryLabel: config?.label || industry.category,
    topBrands: industry.topBrands,
    inspirationText: getInspirationText(industryId),
    design: {
      colors: industry.design.colors,
      fonts: industry.design.fonts,
      mood: industry.design.mood,
      topBrands: industry.topBrands,
    },
  };
}

// =============================================================================
// SEARCH & FILTER HELPERS
// =============================================================================

/**
 * Search industry options by query
 */
export function searchIndustryOptions(query: string): IndustryOption[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return getFlatIndustryOptions();

  return ALL_INDUSTRIES
    .filter((ind) =>
      ind.name.toLowerCase().includes(lowerQuery) ||
      ind.id.toLowerCase().includes(lowerQuery) ||
      ind.topBrands.some((brand) => brand.toLowerCase().includes(lowerQuery))
    )
    .map((ind) => ({
      id: ind.id,
      name: ind.name,
      icon: INDUSTRY_ICONS[ind.id] || '🏢',
      topBrands: ind.topBrands.slice(0, 3),
    }));
}

/**
 * Get popular/featured industries (for quick selection)
 */
export function getPopularIndustries(): IndustryOption[] {
  const popularIds = [
    'saas-startup',
    'restaurant',
    'jewelry',
    'law-firm',
    'real-estate-residential',
    'salon-hair',
    'photography-wedding',
    'marketing-agency',
  ];

  return popularIds
    .map((id) => {
      const ind = getIndustry(id);
      if (!ind) return null;
      return {
        id: ind.id,
        name: ind.name,
        icon: INDUSTRY_ICONS[ind.id] || '🏢',
        topBrands: ind.topBrands.slice(0, 3),
      };
    })
    .filter((opt): opt is IndustryOption => opt !== null);
}

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Pre-computed grouped options for immediate use
 */
export const GROUPED_INDUSTRY_OPTIONS = getGroupedIndustryOptions();

/**
 * Pre-computed flat options for immediate use
 */
export const FLAT_INDUSTRY_OPTIONS = getFlatIndustryOptions();

/**
 * Pre-computed popular industries for immediate use
 */
export const POPULAR_INDUSTRIES = getPopularIndustries();

// Default export
export default GROUPED_INDUSTRY_OPTIONS;
