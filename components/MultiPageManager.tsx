'use client';

import { useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface PageConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface MultiPageManagerProps {
  projectId: string;
  plan: string;
  generatedPages: Record<string, string> | null;
  requestedPages: string[] | null;
  onUpdate: () => void;
}

// =============================================================================
// PAGE CONFIGS
// =============================================================================

const PAGE_CONFIGS: PageConfig[] = [
  { id: 'home', name: 'Home', icon: '🏠', description: 'Main landing page' },
  { id: 'about', name: 'About', icon: '📖', description: 'Company story & team' },
  { id: 'services', name: 'Services', icon: '⚡', description: 'Service details' },
  { id: 'contact', name: 'Contact', icon: '✉️', description: 'Contact form & info' },
  { id: 'pricing', name: 'Pricing', icon: '💰', description: 'Pricing plans' },
  { id: 'portfolio', name: 'Portfolio', icon: '🎨', description: 'Work showcase' },
  { id: 'blog', name: 'Blog', icon: '📝', description: 'Blog template' },
  { id: 'faq', name: 'FAQ', icon: '❓', description: 'FAQ page' },
];

const PLAN_LIMITS: Record<string, number> = {
  starter: 1,
  professional: 5,
  enterprise: 10,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function MultiPageManager({
  projectId,
  plan,
  generatedPages,
  requestedPages,
  onUpdate,
}: MultiPageManagerProps) {
  const [selectedPages, setSelectedPages] = useState<string[]>(requestedPages || ['home']);
  const [generating, setGenerating] = useState(false);
  const [generatingPage, setGeneratingPage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const maxPages = PLAN_LIMITS[plan] || 1;
  const currentPages = generatedPages ? Object.keys(generatedPages) : [];

  const togglePage = (pageId: string) => {
    if (pageId === 'home') return; // Home is always required

    if (selectedPages.includes(pageId)) {
      setSelectedPages(selectedPages.filter(p => p !== pageId));
    } else if (selectedPages.length < maxPages) {
      setSelectedPages([...selectedPages, pageId]);
    }
  };

  const generatePages = async () => {
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-multipage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          pages: selectedPages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to generate pages');
    } finally {
      setGenerating(false);
    }
  };

  const regenerateSinglePage = async (pageId: string) => {
    setGeneratingPage(pageId);
    setError(null);

    try {
      const response = await fetch('/api/generate-multipage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          pages: [pageId],
          regenerateSingle: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Regeneration failed');
      }

      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to regenerate page');
    } finally {
      setGeneratingPage(null);
    }
  };

  const isStarterPlan = plan === 'starter';

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-black text-lg">Multi-Page Website</h3>
            <p className="text-sm text-neutral-500">
              {isStarterPlan
                ? 'Upgrade to Professional for multi-page websites'
                : `${selectedPages.length} of ${maxPages} pages`}
            </p>
          </div>
          {!isStarterPlan && (
            <button
              onClick={generatePages}
              disabled={generating || selectedPages.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate {selectedPages.length} Pages
                </>
              )}
            </button>
          )}
        </div>

        {/* Progress bar */}
        {!isStarterPlan && (
          <div className="mt-4 h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${(selectedPages.length / maxPages) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Upgrade prompt for starter */}
      {isStarterPlan && (
        <div className="p-6 bg-gradient-to-r from-purple-50 to-violet-50">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-medium text-purple-900">Upgrade for More Pages</p>
              <p className="text-sm text-purple-700 mb-3">
                Professional plan includes up to 5 pages: Home, About, Services, Contact, and more.
              </p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Grid */}
      {!isStarterPlan && (
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PAGE_CONFIGS.map((page) => {
              const isSelected = selectedPages.includes(page.id);
              const isGenerated = currentPages.includes(page.id);
              const isHome = page.id === 'home';
              const atLimit = selectedPages.length >= maxPages && !isSelected;
              const isRegenerating = generatingPage === page.id;

              return (
                <div
                  key={page.id}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : atLimit
                        ? 'border-neutral-200 bg-neutral-50 opacity-50'
                        : 'border-neutral-200 hover:border-purple-300 bg-white'
                  }`}
                >
                  {/* Selection checkbox */}
                  <button
                    onClick={() => togglePage(page.id)}
                    disabled={isHome || atLimit}
                    className={`absolute top-3 right-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-neutral-300 hover:border-purple-400'
                    } ${isHome ? 'cursor-not-allowed' : ''}`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Generated badge */}
                  {isGenerated && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      ✓ Ready
                    </span>
                  )}

                  {/* Page info */}
                  <span className="text-2xl block mb-2 mt-4">{page.icon}</span>
                  <span className="font-medium text-black block">{page.name}</span>
                  <span className="text-xs text-neutral-500">{page.description}</span>

                  {/* Regenerate button */}
                  {isGenerated && (
                    <button
                      onClick={() => regenerateSinglePage(page.id)}
                      disabled={isRegenerating}
                      className="mt-3 w-full px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {isRegenerating ? (
                        <>
                          <div className="w-3 h-3 border-2 border-neutral-400 border-t-neutral-700 rounded-full animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Regenerate
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Generated pages list */}
      {currentPages.length > 0 && (
        <div className="p-6 border-t border-neutral-100 bg-neutral-50">
          <h4 className="font-medium text-black text-sm mb-3">Generated Pages</h4>
          <div className="flex flex-wrap gap-2">
            {currentPages.map((pageId) => {
              const page = PAGE_CONFIGS.find(p => p.id === pageId);
              return (
                <span
                  key={pageId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-sm"
                >
                  {page?.icon} {page?.name || pageId}
                  <a
                    href={`/preview/${projectId}?page=${pageId}`}
                    target="_blank"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
