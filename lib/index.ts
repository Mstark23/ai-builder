/**
 * VERKTORLABS - Library Exports
 * 
 * Central export point for all library utilities.
 */

// Industry Intelligence
export * from './industry-intelligence';

// Industry Options (for UI components)
export { default as INDUSTRY_GROUPS } from './industry-options';
export {
  FLAT_INDUSTRY_OPTIONS,
  getIndustryLabel,
  getIndustryCategory,
  searchIndustryOptions,
  type IndustryOption,
  type IndustryGroup,
} from './industry-options';
