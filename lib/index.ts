/**
 * VERKTORLABS - Library Exports
 * 
 * Central export point for all library utilities.
 */

// Industry Intelligence
export * from './industry-intelligence';

// Industry Options (for UI components) - explicit exports to avoid conflicts
export { default as GROUPED_INDUSTRY_OPTIONS } from './industry-options';
export {
  // Pre-computed options
  FLAT_INDUSTRY_OPTIONS,
  POPULAR_INDUSTRIES,
  // Functions
  getGroupedIndustryOptions,
  getFlatIndustryOptions,
  getIndustryOptionsByCategory,
  getIndustryDesignPreview,
  getInspirationText,
  getIndustryMetadata,
  searchIndustryOptions,
  getPopularIndustries,
  // Types
  type IndustryOption,
  type IndustryDesignPreview,
} from './industry-options';
