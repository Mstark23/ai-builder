/**
 * VERKTORLABS - Library Exports
 * 
 * Central export point for all library utilities.
 */

// Industry Intelligence
export * from './industry-intelligence';

// Industry Options (for UI components) - explicit exports to avoid duplicate IndustryCategory
export {
  INDUSTRY_GROUPS,
  ALL_INDUSTRY_OPTIONS,
  getIndustryLabel,
  getIndustryCategory,
  searchIndustryOptions,
  type IndustryOption,
  type IndustryGroup,
} from './industry-options';
