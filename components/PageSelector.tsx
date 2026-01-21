'use client';

import { useState, useEffect } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface PageOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  sections: string[];
  recommended?: boolean;
}

interface PageSelectorProps {
  selectedPages: string[];
  onChange: (pages: string[]) => void;
  plan: 'starter' | 'professional' | 'enterprise';
  industry?: string;
}

// =============================================================================
// PAGE OPTIONS
// =============================================================================

const PAGE_OPTIONS: PageOption[] = [
  {
    id: 'home',
    name: 'Home',
    description: 'Main landing page with hero, services preview, and testimonials',
    icon: '🏠',
    sections: ['Hero', 'Services Preview', 'About Preview', 'Testimonials', 'CTA'],
    recommended: true,
  },
  {
    id: 'about',
    name: 'About Us',
    description: 'Your company story, mission, values, and team',
    icon: '📖',
    sections: ['Story', 'Mission & Values', 'Team Members', 'CTA'],
    recommended: true,
  },
  {
    id: 'services',
    name: 'Services',
    description: 'Detailed breakdown of all your services with features',
    icon: '⚡',
    sections: ['Services Grid', 'Process Steps', 'Pricing Preview', 'CTA'],
    recommended: true,
  },
  {
    id: 'contact',
    name: 'Contact',
    description: 'Contact form, location info, and business hours',
    icon: '✉️',
    sections: ['Contact Form', 'Contact Info', 'Map', 'FAQ Preview'],
    recommended: true,
  },
  {
    id: 'pricing',
    name: 'Pricing',
    description: 'Pricing plans, feature comparison, and FAQ',
    icon: '💰',
    sections: ['Pricing Cards', 'Features Table', 'FAQ', 'CTA'],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your work with filterable gallery',
    icon: '🎨',
    sections: ['Portfolio Grid', 'Case Study', 'Testimonials', 'CTA'],
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Blog listing template with categories',
    icon: '📝',
    sections: ['Featured Post', 'Posts Grid', 'Categories', 'Newsletter'],
  },
  {
    id: 'faq',
    name: 'FAQ',
    description: 'Frequently asked questions organized by category',
    icon: '❓',
    sections: ['FAQ Categories', 'Accordion', 'Contact CTA'],
  },
];

// Plan limits
const PLAN_LIMITS = {
  starter: 1,
  professional: 5,
  enterprise: 10,
};

// Industry recommendations
const INDUSTRY_RECOMMENDATIONS: Record<string, string[]> = {
  'restaurant': ['home', 'about', 'contact', 'gallery'],
  'health-beauty': ['home', 'services', 'about', 'contact', 'pricing'],
  'fitness': ['home', 'services', 'about', 'contact', 'pricing'],
  'professional': ['home', 'services', 'about', 'contact', 'portfolio'],
  'tech-startup': ['home', 'services', 'about', 'contact', 'pricing', 'blog'],
  'real-estate': ['home', 'services', 'about', 'contact', 'portfolio'],
  'local-services': ['home', 'services', 'about', 'contact', 'faq'],
  'ecommerce': ['home', 'about', 'contact', 'faq'],
  'medical': ['home', 'services', 'about', 'contact', 'faq'],
  'education': ['home', 'services', 'about', 'contact', 'blog', 'faq'],
  'construction': ['home', 'services', 'about', 'contact', 'portfolio'],
  'portfolio': ['home', 'about', 'portfolio', 'contact'],
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PageSelector({ selectedPages, onChange, plan, industry }: PageSelectorProps) {
  const maxPages = PLAN_LIMITS[plan] || 1;
  const recommendedPages = industry ? (INDUSTRY_RECOMMENDATIONS[industry] || ['home', 'about', 'services', 'contact']) : ['home', 'about', 'services', 'contact'];
  
  const [showAll, setShowAll] = useState(false);

  // Ensure home is always selected
  useEffect(() => {
    if (!selectedPages.includes('home')) {
      onChange(['home', ...selectedPages]);
    }
  }, []);

  const togglePage = (pageId: string) => {
    // Home is always required
    if (pageId === 'home') return;

    if (selectedPages.includes(pageId)) {
      // Remove page
      onChange(selectedPages.filter(p => p !== pageId));
    } else {
      // Add page (if under limit)
      if (selectedPages.length < maxPages) {
        onChange([...selectedPages, pageId]);
      }
    }
  };

  const selectRecommended = () => {
    const recommended = recommendedPages.slice(0, maxPages);
    onChange(recommended);
  };

  const atLimit = selectedPages.length >= maxPages;
  const visiblePages = showAll ? PAGE_OPTIONS : PAGE_OPTIONS.filter(p => p.recommended || recommendedPages.includes(p.id));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-black">Select Pages to Generate</h3>
          <p className="text-sm text-neutral-500">
            {plan === 'starter' ? (
              'Starter plan includes 1 page (landing page)'
            ) : (
              `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan: ${selectedPages.length} of ${maxPages} pages selected`
            )}
          </p>
        </div>
        {plan !== 'starter' && (
          <button
            onClick={selectRecommended}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
          >
            Select Recommended
          </button>
        )}
      </div>

      {/* Progress bar */}
      {plan !== 'starter' && (
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-violet-600 transition-all duration-300"
            style={{ width: `${(selectedPages.length / maxPages) * 100}%` }}
          />
        </div>
      )}

      {/* Starter plan upgrade prompt */}
      {plan === 'starter' && (
        <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-medium text-violet-900">Want a full website?</p>
              <p className="text-sm text-violet-700 mb-2">
                Upgrade to Professional to get up to 5 pages including About, Services, and Contact.
              </p>
              <button className="text-sm font-medium text-violet-600 hover:text-violet-700">
                View Plans →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {visiblePages.map((page) => {
          const isSelected = selectedPages.includes(page.id);
          const isHome = page.id === 'home';
          const isRecommended = recommendedPages.includes(page.id);
          const isDisabled = (plan === 'starter' && page.id !== 'home') || (atLimit && !isSelected);

          return (
            <button
              key={page.id}
              onClick={() => !isDisabled && togglePage(page.id)}
              disabled={isDisabled}
              className={`relative p-4 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-violet-600 text-white ring-2 ring-violet-600 ring-offset-2'
                  : isDisabled
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    : 'bg-neutral-50 hover:bg-violet-50 border border-neutral-200 hover:border-violet-300'
              }`}
            >
              {/* Recommended badge */}
              {isRecommended && !isSelected && !isDisabled && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-medium rounded-full">
                  Recommended
                </span>
              )}

              {/* Home badge */}
              {isHome && (
                <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                  isSelected ? 'bg-white text-violet-600' : 'bg-violet-100 text-violet-700'
                }`}>
                  Required
                </span>
              )}

              {/* Icon */}
              <span className="text-2xl block mb-2">{page.icon}</span>
              
              {/* Name */}
              <span className={`font-medium block ${isSelected ? 'text-white' : 'text-black'}`}>
                {page.name}
              </span>
              
              {/* Description */}
              <span className={`text-xs block mt-1 ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                {page.description.substring(0, 50)}...
              </span>

              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Show more toggle */}
      {!showAll && PAGE_OPTIONS.length > visiblePages.length && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 text-center text-sm text-neutral-600 hover:text-black bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          Show {PAGE_OPTIONS.length - visiblePages.length} more page types
        </button>
      )}

      {/* Selected pages summary */}
      {selectedPages.length > 1 && (
        <div className="p-4 bg-neutral-50 rounded-xl">
          <p className="text-sm font-medium text-neutral-700 mb-2">Your website will include:</p>
          <div className="flex flex-wrap gap-2">
            {selectedPages.map(pageId => {
              const page = PAGE_OPTIONS.find(p => p.id === pageId);
              return (
                <span 
                  key={pageId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-neutral-200 rounded-full text-sm"
                >
                  {page?.icon} {page?.name}
                  {pageId !== 'home' && (
                    <button
                      onClick={() => togglePage(pageId)}
                      className="ml-1 text-neutral-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* At limit warning */}
      {atLimit && plan !== 'starter' && (
        <p className="text-sm text-amber-600 flex items-center gap-2">
          <span>⚠️</span>
          You've reached your plan limit. Remove a page to add a different one.
        </p>
      )}
    </div>
  );
}
