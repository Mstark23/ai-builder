/**
 * VERKTORLABS - Industry Intelligence System
 * Main Entry Point
 * 
 * This file consolidates all industry intelligence data from parallel development streams.
 * Total: 44 industries across 5 categories
 * 
 * Categories:
 * - E-commerce (8 industries)
 * - Local Services (8 industries)
 * - Professional Services (10 industries)
 * - Tech & Creative (12 industries)
 * - Core Industries (6 industries)
 */

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type { 
  IndustryIntelligence, 
  IndustryRow, 
  Project, 
  GenerateRequest, 
  GenerateResponse,
  IndustryCategory,
  Section,
  DesignSystem 
} from '../types/industry';

// ============================================================================
// E-COMMERCE INDUSTRIES (8)
// ============================================================================
export {
  ecommerceIndustries,
  fashionClothing,
  beautyCosmetics,
  homeFurniture,
  foodBeverageDtc,
  petProducts,
  kidsBaby,
  sportsOutdoors,
  electronicsGadgets,
  getEcommerceIndustry,
  getEcommerceIndustryIds,
} from './ecommerce-industries';

// ============================================================================
// LOCAL SERVICES INDUSTRIES (8)
// ============================================================================
export {
  localServiceIndustries,
  getLocalServiceIndustry,
  localServiceIndustryIds,
} from './local-services-industries';

// ============================================================================
// PROFESSIONAL SERVICES INDUSTRIES (10)
// ============================================================================
export {
  professionalIndustries,
  getIndustryById as getProfessionalIndustryById,
  getIndustriesByCategory as getProfessionalIndustriesByCategory,
  getAllIndustryIds as getAllProfessionalIndustryIds,
} from './professional-industries';

// ============================================================================
// TECH & CREATIVE INDUSTRIES (12)
// ============================================================================
export {
  techCreativeIndustries,
} from './tech-creative-industries';

// ============================================================================
// CORE INDUSTRIES (6)
// ============================================================================
export {
  coreIndustries,
  jewelryIndustry,
  restaurantIndustry,
  fitnessGymIndustry,
  spaBeautyIndustry,
  lawFirmIndustry,
  dentalClinicIndustry,
} from './core-industries';

// ============================================================================
// COMBINED EXPORTS
// ============================================================================
import { ecommerceIndustries } from './ecommerce-industries';
import { localServiceIndustries } from './local-services-industries';
import { professionalIndustries } from './professional-industries';
import { techCreativeIndustries } from './tech-creative-industries';
import { coreIndustries } from './core-industries';
import type { IndustryIntelligence } from '../types/industry';

/**
 * All industries combined into a single array
 * Total: 44 industries
 */
export const allIndustries: IndustryIntelligence[] = [
  ...coreIndustries,
  ...ecommerceIndustries,
  ...localServiceIndustries,
  ...professionalIndustries,
  ...techCreativeIndustries,
];

/**
 * Industries organized by category
 */
export const industriesByCategory = {
  core: coreIndustries,
  ecommerce: ecommerceIndustries,
  'local-services': localServiceIndustries,
  professional: professionalIndustries,
  'tech-creative': techCreativeIndustries,
} as const;

/**
 * Get any industry by ID across all categories
 */
export function getIndustryById(id: string): IndustryIntelligence | undefined {
  return allIndustries.find(industry => industry.id === id);
}

/**
 * Get all industry IDs
 */
export function getAllIndustryIds(): string[] {
  return allIndustries.map(industry => industry.id);
}

/**
 * Get industries by category
 */
export function getIndustriesByCategory(category: string): IndustryIntelligence[] {
  return allIndustries.filter(industry => industry.category === category);
}

/**
 * Search industries by name (case-insensitive partial match)
 */
export function searchIndustries(query: string): IndustryIntelligence[] {
  const lowerQuery = query.toLowerCase();
  return allIndustries.filter(
    industry =>
      industry.name.toLowerCase().includes(lowerQuery) ||
      industry.id.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Industry count by category
 */
export const industryStats = {
  total: allIndustries.length,
  byCategory: {
    core: coreIndustries.length,
    ecommerce: ecommerceIndustries.length,
    'local-services': localServiceIndustries.length,
    professional: professionalIndustries.length,
    'tech-creative': techCreativeIndustries.length,
  },
};

// Default export - all industries
export default allIndustries;
