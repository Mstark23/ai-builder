/**
 * VERKTORLABS - Master Industry Intelligence Library
 * 
 * This is the single source of truth for all industry intelligence data.
 * Consolidates 44 industries across 5 categories into one unified export.
 * 
 * Categories:
 * - Core Industries (6): jewelry, restaurant, fitness-gym, spa-beauty, law-firm, dental-clinic
 * - E-commerce (8): fashion-clothing, beauty-cosmetics, home-furniture, food-beverage-dtc, pet-products, kids-baby, sports-outdoors, electronics-gadgets
 * - Local Services (8): restaurant-fine-dining, restaurant-casual, cafe-coffee-shop, salon-hair, gym-boutique, yoga-pilates, med-spa, nail-salon
 * - Professional (10): law-firm-personal-injury, law-firm-corporate, accounting-cpa, financial-advisor, real-estate-residential, real-estate-commercial, marketing-agency, consulting-management, architecture-firm, insurance-agency
 * - Tech & Creative (12): saas-startup, ai-tech-startup, mobile-app, portfolio-designer, portfolio-developer, photography-wedding, photography-commercial, course-creator, coach-life, wedding-planner, hotel-hospitality, nonprofit-charity
 * 
 * Total: 44 Industries
 */

// Import types
export type {
  IndustryIntelligence,
  Section,
  ColorPalette,
  FontPairing,
  DesignSystem,
  IndustryRow,
  Project,
  GenerateRequest,
  GenerateResponse,
  PageType,
  IndustryCategory,
} from '../types/industry';

// Import fallback
export { fallbackIntelligence } from '../types/industry';

// Import all industry arrays from data files
import { coreIndustries } from '../data/core-industries';
import { ecommerceIndustries } from '../data/ecommerce-industries';
import { localServiceIndustries } from '../data/local-services-industries';
import { professionalIndustries } from '../data/professional-industries';
import { techCreativeIndustries } from '../data/tech-creative-industries';

import type { IndustryIntelligence } from '../types/industry';

// =============================================================================
// MAIN EXPORT: ALL INDUSTRIES
// =============================================================================

/**
 * Complete array of all 44 industries with full intelligence data
 */
export const ALL_INDUSTRIES: IndustryIntelligence[] = [
  ...coreIndustries,
  ...ecommerceIndustries,
  ...localServiceIndustries,
  ...professionalIndustries,
  ...techCreativeIndustries,
];

// =============================================================================
// INDUSTRY LOOKUP HELPERS
// =============================================================================

/**
 * Get an industry by its ID
 * @param id - The URL-friendly industry identifier (e.g., 'jewelry', 'saas-startup')
 * @returns The industry intelligence object, or undefined if not found
 */
export function getIndustry(id: string): IndustryIntelligence | undefined {
  return ALL_INDUSTRIES.find((industry) => industry.id === id);
}

/**
 * Get an industry by ID with fallback
 * @param id - The industry identifier
 * @returns The industry intelligence object, or the fallback if not found
 */
export function getIndustryWithFallback(id: string): {
  industry: IndustryIntelligence;
  usedFallback: boolean;
} {
  const industry = getIndustry(id);
  if (industry) {
    return { industry, usedFallback: false };
  }
  // Import fallback dynamically to avoid circular dependency issues
  const { fallbackIntelligence } = require('../types/industry');
  return { industry: fallbackIntelligence, usedFallback: true };
}

/**
 * Check if an industry ID exists
 */
export function industryExists(id: string): boolean {
  return ALL_INDUSTRIES.some((industry) => industry.id === id);
}

/**
 * Get all industry IDs
 */
export function getAllIndustryIds(): string[] {
  return ALL_INDUSTRIES.map((industry) => industry.id);
}

// =============================================================================
// CATEGORY HELPERS
// =============================================================================

/**
 * Industries organized by their source category
 */
export const INDUSTRIES_BY_SOURCE = {
  core: coreIndustries,
  ecommerce: ecommerceIndustries,
  'local-services': localServiceIndustries,
  professional: professionalIndustries,
  'tech-creative': techCreativeIndustries,
} as const;

/**
 * Get all unique categories from the industries
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  ALL_INDUSTRIES.forEach((industry) => categories.add(industry.category));
  return Array.from(categories).sort();
}

/**
 * Get industries by their declared category
 * Note: This uses the category field from the industry object, not the source file
 */
export function getIndustriesByCategory(category: string): IndustryIntelligence[] {
  return ALL_INDUSTRIES.filter((industry) => industry.category === category);
}

/**
 * Get industries grouped by category
 */
export function getIndustriesGroupedByCategory(): Record<string, IndustryIntelligence[]> {
  return ALL_INDUSTRIES.reduce((acc, industry) => {
    const cat = industry.category;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(industry);
    return acc;
  }, {} as Record<string, IndustryIntelligence[]>);
}

// =============================================================================
// SEARCH HELPERS
// =============================================================================

/**
 * Search industries by name or ID (case-insensitive partial match)
 */
export function searchIndustries(query: string): IndustryIntelligence[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];
  
  return ALL_INDUSTRIES.filter(
    (industry) =>
      industry.name.toLowerCase().includes(lowerQuery) ||
      industry.id.toLowerCase().includes(lowerQuery) ||
      industry.topBrands.some((brand) => brand.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Find similar industries based on category and top brands
 */
export function findSimilarIndustries(
  id: string,
  limit: number = 3
): IndustryIntelligence[] {
  const industry = getIndustry(id);
  if (!industry) return [];

  // Get industries in the same category, excluding the current one
  const sameCategory = ALL_INDUSTRIES.filter(
    (ind) => ind.category === industry.category && ind.id !== id
  );

  return sameCategory.slice(0, limit);
}

// =============================================================================
// STATISTICS
// =============================================================================

/**
 * Industry statistics
 */
export const INDUSTRY_STATS = {
  total: ALL_INDUSTRIES.length,
  bySource: {
    core: coreIndustries.length,
    ecommerce: ecommerceIndustries.length,
    'local-services': localServiceIndustries.length,
    professional: professionalIndustries.length,
    'tech-creative': techCreativeIndustries.length,
  },
  categories: getAllCategories(),
} as const;

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Type guard to check if an object is a valid IndustryIntelligence
 */
export function isValidIndustry(obj: unknown): obj is IndustryIntelligence {
  if (!obj || typeof obj !== 'object') return false;
  const industry = obj as Partial<IndustryIntelligence>;
  return (
    typeof industry.id === 'string' &&
    typeof industry.name === 'string' &&
    typeof industry.category === 'string' &&
    Array.isArray(industry.topBrands) &&
    typeof industry.psychology === 'object' &&
    Array.isArray(industry.sections) &&
    typeof industry.design === 'object' &&
    typeof industry.copywriting === 'object' &&
    typeof industry.images === 'object'
  );
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default ALL_INDUSTRIES;
