/**
 * VERKTORLABS - New Project Form Component
 * 
 * A comprehensive form for creating new website projects with:
 * - Grouped industry dropdown with search
 * - Auto-suggested design direction based on industry
 * - "Inspired by" brand display
 * - Design preview (colors, fonts, mood)
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  GROUPED_INDUSTRY_OPTIONS,
  getIndustryMetadata,
  getIndustryDesignPreview,
  searchIndustryOptions,
  POPULAR_INDUSTRIES,
  type IndustryCategory,
  type IndustryOption,
  type IndustryDesignPreview,
} from '@/lib/industry-options';

// =============================================================================
// TYPES
// =============================================================================

export interface ProjectFormData {
  businessName: string;
  industry: string;
  businessDescription: string;
  targetAudience: string;
  uniqueSellingPoints: string[];
  location: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}

interface NewProjectFormProps {
  onSubmit: (data: ProjectFormData) => void | Promise<void>;
  isLoading?: boolean;
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

/**
 * Industry Search Input
 */
function IndustrySearch({
  value,
  onChange,
  placeholder = 'Search industries...',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                   text-sm placeholder-gray-400"
      />
    </div>
  );
}

/**
 * Industry Option Card
 */
function IndustryOptionCard({
  option,
  isSelected,
  onSelect,
}: {
  option: IndustryOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`w-full text-left p-3 rounded-lg border-2 transition-all
        ${
          isSelected
            ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{option.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">{option.name}</div>
          <div className="text-xs text-gray-500 truncate">
            {option.topBrands.join(' • ')}
          </div>
        </div>
        {isSelected && (
          <svg
            className="w-5 h-5 text-indigo-500 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </button>
  );
}

/**
 * Color Swatch Display
 */
function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div className="text-xs">
        <div className="text-gray-500">{label}</div>
        <div className="font-mono text-gray-700">{color}</div>
      </div>
    </div>
  );
}

/**
 * Design Preview Panel
 */
function DesignPreview({
  preview,
  inspirationText,
}: {
  preview: IndustryDesignPreview;
  inspirationText: string;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-lg">✨</span>
        Design Direction
      </h4>

      {/* Inspiration */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
        <div className="text-sm font-medium text-indigo-600">{inspirationText}</div>
        <div className="text-xs text-gray-500 mt-1">
          We&apos;ll use design patterns proven by these top brands
        </div>
      </div>

      {/* Colors */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Color Palette
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ColorSwatch color={preview.colors.primary} label="Primary" />
          <ColorSwatch color={preview.colors.secondary} label="Secondary" />
          <ColorSwatch color={preview.colors.accent} label="Accent" />
          <ColorSwatch color={preview.colors.background} label="Background" />
        </div>
      </div>

      {/* Typography */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Typography
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Headings:</span>
            <span className="font-medium">{preview.fonts.heading}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">Body:</span>
            <span className="font-medium">{preview.fonts.body}</span>
          </div>
        </div>
      </div>

      {/* Mood */}
      <div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Overall Mood
        </div>
        <p className="text-sm text-gray-700 italic">&quot;{preview.mood}&quot;</p>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function NewProjectForm({ onSubmit, isLoading = false }: NewProjectFormProps) {
  // Form state
  const [formData, setFormData] = useState<ProjectFormData>({
    businessName: '',
    industry: '',
    businessDescription: '',
    targetAudience: '',
    uniqueSellingPoints: [''],
    location: '',
    contactInfo: {
      phone: '',
      email: '',
      address: '',
    },
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Derived state
  const selectedIndustryMetadata = useMemo(
    () => (formData.industry ? getIndustryMetadata(formData.industry) : null),
    [formData.industry]
  );

  const designPreview = useMemo(
    () => (formData.industry ? getIndustryDesignPreview(formData.industry) : null),
    [formData.industry]
  );

  // Filtered industries based on search
  const filteredIndustries = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchIndustryOptions(searchQuery);
  }, [searchQuery]);

  // Handlers
  const handleFieldChange = useCallback(
    (field: keyof ProjectFormData, value: string | string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleContactChange = useCallback(
    (field: keyof ProjectFormData['contactInfo'], value: string) => {
      setFormData((prev) => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [field]: value },
      }));
    },
    []
  );

  const handleUSPChange = useCallback((index: number, value: string) => {
    setFormData((prev) => {
      const newUSPs = [...prev.uniqueSellingPoints];
      newUSPs[index] = value;
      return { ...prev, uniqueSellingPoints: newUSPs };
    });
  }, []);

  const addUSP = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      uniqueSellingPoints: [...prev.uniqueSellingPoints, ''],
    }));
  }, []);

  const removeUSP = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      uniqueSellingPoints: prev.uniqueSellingPoints.filter((_, i) => i !== index),
    }));
  }, []);

  const handleIndustrySelect = useCallback((industryId: string) => {
    setFormData((prev) => ({ ...prev, industry: industryId }));
    setSearchQuery('');
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    },
    [formData, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ===== BASIC INFO ===== */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleFieldChange('businessName', e.target.value)}
              placeholder="e.g., Lumière Jewelry"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Business Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Description
            </label>
            <textarea
              value={formData.businessDescription}
              onChange={(e) => handleFieldChange('businessDescription', e.target.value)}
              placeholder="Tell us about your business, what makes it special..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* ===== INDUSTRY SELECTION ===== */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Industry <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Select your industry to unlock design patterns from top brands in your space.
        </p>

        {/* Search */}
        <IndustrySearch value={searchQuery} onChange={setSearchQuery} />

        {/* Search Results */}
        {filteredIndustries && filteredIndustries.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Search Results ({filteredIndustries.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredIndustries.map((option) => (
                <IndustryOptionCard
                  key={option.id}
                  option={option}
                  isSelected={formData.industry === option.id}
                  onSelect={handleIndustrySelect}
                />
              ))}
            </div>
          </div>
        )}

        {filteredIndustries && filteredIndustries.length === 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
            No industries found matching &quot;{searchQuery}&quot;
          </div>
        )}

        {/* Popular Industries (when not searching) */}
        {!searchQuery && (
          <>
            <div className="mt-6">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Popular Industries
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {POPULAR_INDUSTRIES.map((option) => (
                  <IndustryOptionCard
                    key={option.id}
                    option={option}
                    isSelected={formData.industry === option.id}
                    onSelect={handleIndustrySelect}
                  />
                ))}
              </div>
            </div>

            {/* Browse All Industries */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowAllIndustries(!showAllIndustries)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                {showAllIndustries ? 'Hide' : 'Browse'} All Industries
                <svg
                  className={`w-4 h-4 transition-transform ${showAllIndustries ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showAllIndustries && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  {/* Category Tabs */}
                  <div className="flex overflow-x-auto bg-gray-50 border-b border-gray-200">
                    {GROUPED_INDUSTRY_OPTIONS.map((category) => (
                      <button
                        key={category.category}
                        type="button"
                        onClick={() =>
                          setActiveCategory(
                            activeCategory === category.category ? null : category.category
                          )
                        }
                        className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap
                          ${
                            activeCategory === category.category
                              ? 'text-indigo-600 bg-white border-b-2 border-indigo-500'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.label}
                        <span className="ml-2 text-xs text-gray-400">
                          ({category.industries.length})
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Category Content */}
                  <div className="p-4 max-h-80 overflow-y-auto">
                    {activeCategory ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {GROUPED_INDUSTRY_OPTIONS.find(
                          (c) => c.category === activeCategory
                        )?.industries.map((option) => (
                          <IndustryOptionCard
                            key={option.id}
                            option={option}
                            isSelected={formData.industry === option.id}
                            onSelect={handleIndustrySelect}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        Select a category above to browse industries
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Selected Industry + Design Preview */}
        {selectedIndustryMetadata && designPreview && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Selected Industry Card */}
            <div className="bg-white rounded-xl p-5 border-2 border-indigo-500 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{selectedIndustryMetadata.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {selectedIndustryMetadata.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {selectedIndustryMetadata.categoryLabel}
                  </p>
                </div>
              </div>
              <div className="text-sm text-indigo-600 font-medium">
                {selectedIndustryMetadata.inspirationText}
              </div>
              <button
                type="button"
                onClick={() => handleFieldChange('industry', '')}
                className="mt-3 text-sm text-gray-500 hover:text-gray-700"
              >
                Change industry
              </button>
            </div>

            {/* Design Preview */}
            <DesignPreview
              preview={designPreview}
              inspirationText={selectedIndustryMetadata.inspirationText}
            />
          </div>
        )}
      </section>

      {/* ===== TARGET AUDIENCE ===== */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Audience</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Who is your ideal customer?
          </label>
          <textarea
            value={formData.targetAudience}
            onChange={(e) => handleFieldChange('targetAudience', e.target.value)}
            placeholder="e.g., Fashion-forward women aged 25-40 who value quality craftsmanship and sustainable practices..."
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </section>

      {/* ===== UNIQUE SELLING POINTS ===== */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What Makes You Different?
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          List your unique selling points - these will be highlighted on your website.
        </p>
        <div className="space-y-3">
          {formData.uniqueSellingPoints.map((usp, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={usp}
                onChange={(e) => handleUSPChange(index, e.target.value)}
                placeholder={`Selling point ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {formData.uniqueSellingPoints.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUSP(index)}
                  className="px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addUSP}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add another point
          </button>
        </div>
      </section>

      {/* ===== CONTACT INFO ===== */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              placeholder="e.g., New York, NY"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.contactInfo.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.contactInfo.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              placeholder="hello@yourcompany.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.contactInfo.address}
              onChange={(e) => handleContactChange('address', e.target.value)}
              placeholder="123 Main Street, Suite 100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* ===== SUBMIT ===== */}
      <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={!formData.businessName || !formData.industry || isLoading}
          className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg
                     hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Generating Your Website...
            </>
          ) : (
            <>
              Generate Website
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
        <p className="mt-3 text-xs text-center text-gray-500">
          Your website will be generated using AI with design patterns from top{' '}
          {selectedIndustryMetadata?.name || 'industry'} brands.
        </p>
      </div>
    </form>
  );
}

export default NewProjectForm;
