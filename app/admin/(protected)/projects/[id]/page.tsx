'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// =============================================================================
// TYPES
// =============================================================================

type Project = {
  id: string;
  business_name: string;
  industry: string | null;
  style: string | null;
  design_direction: string | null;
  brand_voice: string | null;
  status: string;
  plan: string | null;
  paid: boolean;
  notes: string | null;
  generated_html: string | null;
  generated_pages: Record<string, string> | null;
  requested_pages: string[] | null;
  created_at: string;
  customer_id: string | null;
  description: string | null;
  website_goal: string | null;
  target_customer: string | null;
  primary_services: string[] | null;
  hero_preference: string | null;
  color_preference: string | null;
  mood_tags: string[] | null;
  unique_value: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  call_to_action: string | null;
  review_score: number | null;
  review_details: any | null;
  reviewed_at: string | null;
  customers?: { id: string; name: string; email: string; phone: string | null } | null;
};

type Message = { id: string; content: string; sender_type: 'admin' | 'customer'; created_at: string };

// =============================================================================
// CONSTANTS
// =============================================================================

const STATUS_OPTIONS = [
  { value: 'QUEUED', label: 'Queued', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'GENERATING', label: 'Generating', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { value: 'PREVIEW_READY', label: 'Preview Ready', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'NEEDS_REVISION', label: 'Needs Revision', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'PAID', label: 'Paid', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
];

const PLAN_OPTIONS = [
  { value: 'starter', label: 'Starter', price: 299 },
  { value: 'professional', label: 'Professional', price: 599 },
  { value: 'enterprise', label: 'Enterprise', price: 999 },
];

const DESIGN_DIRECTIONS: Record<string, { name: string; color: string }> = {
  luxury_minimal: { name: 'Luxury Minimal', color: 'bg-amber-100 text-amber-800' },
  bold_modern: { name: 'Bold Modern', color: 'bg-pink-100 text-pink-800' },
  warm_organic: { name: 'Warm Organic', color: 'bg-orange-100 text-orange-800' },
  dark_premium: { name: 'Dark Premium', color: 'bg-violet-100 text-violet-800' },
  editorial_classic: { name: 'Editorial Classic', color: 'bg-blue-100 text-blue-800' },
  vibrant_energy: { name: 'Vibrant Energy', color: 'bg-teal-100 text-teal-800' },
};

const BRAND_VOICES: Record<string, string> = {
  formal: 'Professional & Formal',
  conversational: 'Friendly & Conversational',
  playful: 'Playful & Fun',
  authoritative: 'Expert & Authoritative',
  luxurious: 'Refined & Luxurious',
};

const SECTIONS = [
  { id: 'nav', name: 'Navigation', description: 'Top navigation bar', icon: '🧭' },
  { id: 'hero', name: 'Hero', description: 'Main banner section', icon: '🦸' },
  { id: 'services', name: 'Services', description: 'Services/features grid', icon: '⚡' },
  { id: 'about', name: 'About', description: 'About us section', icon: '📖' },
  { id: 'stats', name: 'Stats', description: 'Statistics section', icon: '📊' },
  { id: 'testimonials', name: 'Testimonials', description: 'Customer reviews', icon: '💬' },
  { id: 'cta', name: 'CTA', description: 'Call-to-action banner', icon: '📢' },
  { id: 'contact', name: 'Contact', description: 'Contact form', icon: '✉️' },
  { id: 'footer', name: 'Footer', description: 'Page footer', icon: '📄' },
];

const FEEDBACK_PRESETS: Record<string, string[]> = {
  hero: ['Make it more bold and impactful', 'Use warmer, friendlier tone', 'More professional', 'Add more urgency', 'Simplify - less text'],
  services: ['Make cards more visual', 'Add specific benefits', 'Different icons', 'More scannable', 'Add pricing'],
  about: ['More personal and authentic', 'Focus on unique story', 'Add team info', 'More professional', 'Shorter and concise'],
  testimonials: ['More specific results', 'Different layout', 'Add company logos', 'More diverse', 'Shorter quotes'],
  cta: ['More urgency', 'Softer, less pushy', 'Add guarantee', 'Different colors', 'Add social proof'],
  contact: ['Simpler form', 'More contact options', 'Include map', 'Add business hours', 'Prominent phone'],
  default: ['More modern', 'More minimalist', 'Bolder colors', 'More whitespace', 'Different layout'],
};

const PAGE_CONFIGS = [
  { id: 'home', name: 'Home', icon: '🏠', description: 'Main landing page' },
  { id: 'about', name: 'About', icon: '📖', description: 'Company story & team' },
  { id: 'services', name: 'Services', icon: '⚡', description: 'Service details' },
  { id: 'contact', name: 'Contact', icon: '✉️', description: 'Contact form & info' },
  { id: 'pricing', name: 'Pricing', icon: '💰', description: 'Pricing plans' },
  { id: 'portfolio', name: 'Portfolio', icon: '🎨', description: 'Work showcase' },
  { id: 'blog', name: 'Blog', icon: '📝', description: 'Blog template' },
  { id: 'faq', name: 'FAQ', icon: '❓', description: 'FAQ page' },
];

const PLAN_PAGE_LIMITS: Record<string, number> = {
  starter: 1,
  professional: 5,
  enterprise: 10,
};

// =============================================================================
// MULTI-PAGE MANAGER COMPONENT
// =============================================================================

function MultiPageManager({
  projectId,
  plan,
  generatedPages,
  requestedPages,
  onUpdate,
}: {
  projectId: string;
  plan: string;
  generatedPages: Record<string, string> | null;
  requestedPages: string[] | null;
  onUpdate: () => void;
}) {
  const [selectedPages, setSelectedPages] = useState<string[]>(requestedPages || ['home']);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxPages = PLAN_PAGE_LIMITS[plan] || 1;
  const currentPages = generatedPages ? Object.keys(generatedPages) : [];
  const isStarterPlan = plan === 'starter';

  const togglePage = (pageId: string) => {
    if (pageId === 'home') return;
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
        body: JSON.stringify({ projectId, pages: selectedPages }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Generation failed');
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to generate pages');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-black text-lg">Multi-Page Website</h3>
            <p className="text-sm text-neutral-500">
              {isStarterPlan ? 'Upgrade to Professional for multi-page websites' : `${selectedPages.length} of ${maxPages} pages`}
            </p>
          </div>
          {!isStarterPlan && (
            <button
              onClick={generatePages}
              disabled={generating || selectedPages.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              {generating ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Generate {selectedPages.length} Pages</>
              )}
            </button>
          )}
        </div>
        {!isStarterPlan && (
          <div className="mt-4 h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${(selectedPages.length / maxPages) * 100}%` }} />
          </div>
        )}
      </div>

      {isStarterPlan ? (
        <div className="p-6 bg-gradient-to-r from-purple-50 to-violet-50">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-medium text-purple-900">Upgrade for More Pages</p>
              <p className="text-sm text-purple-700 mb-3">
                Professional plan includes up to 5 pages: Home, About, Services, Contact, and more.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">📖 About</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">⚡ Services</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">✉️ Contact</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">+2 more</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PAGE_CONFIGS.map((page) => {
              const isSelected = selectedPages.includes(page.id);
              const isGenerated = currentPages.includes(page.id);
              const isHome = page.id === 'home';
              const atLimit = selectedPages.length >= maxPages && !isSelected;

              return (
                <div
                  key={page.id}
                  onClick={() => !isHome && !atLimit && togglePage(page.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : atLimit
                        ? 'border-neutral-200 bg-neutral-50 opacity-50 cursor-not-allowed'
                        : 'border-neutral-200 hover:border-purple-300 bg-white'
                  }`}
                >
                  {isGenerated && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">✓</span>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded border-2 border-purple-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <span className="text-2xl block mb-2 mt-2">{page.icon}</span>
                  <span className="font-medium text-black block text-sm">{page.name}</span>
                  <span className="text-xs text-neutral-500">{page.description}</span>
                </div>
              );
            })}
          </div>
          {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        </div>
      )}

      {currentPages.length > 0 && (
        <div className="p-4 border-t border-neutral-100 bg-neutral-50">
          <p className="text-xs font-medium text-neutral-500 mb-2">Generated Pages:</p>
          <div className="flex flex-wrap gap-2">
            {currentPages.map((pageId) => {
              const page = PAGE_CONFIGS.find(p => p.id === pageId);
              return (
                <span key={pageId} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-sm">
                  {page?.icon} {page?.name || pageId}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SECTION EDITOR COMPONENT
// =============================================================================

function SectionEditor({ projectId, html, onUpdate }: { projectId: string; html: string; onUpdate: () => void }) {
  const [editMode, setEditMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState<typeof SECTIONS[0] | null>(null);
  const [feedback, setFeedback] = useState('');
  const [regenerating, setRegenerating] = useState(false);
  const [detectedSections, setDetectedSections] = useState<Record<string, boolean>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!html) return;
    const detected: Record<string, boolean> = {};
    const patterns: Record<string, RegExp> = {
      nav: /<nav[\s\S]*?<\/nav>/i,
      hero: /(?:id=["']hero["']|class=["'][^"']*hero)/i,
      services: /(?:id=["'](?:services|features)["']|class=["'][^"']*(?:services|features))/i,
      about: /(?:id=["']about["']|class=["'][^"']*about)/i,
      stats: /(?:id=["']stats["']|class=["'][^"']*stats)/i,
      testimonials: /(?:id=["']testimonials["']|class=["'][^"']*testimonial)/i,
      cta: /(?:id=["']cta["']|class=["'][^"']*cta[^"']*["'])/i,
      contact: /(?:id=["']contact["']|class=["'][^"']*contact)/i,
      footer: /<footer[\s\S]*?<\/footer>/i,
    };
    for (const [key, pattern] of Object.entries(patterns)) {
      detected[key] = pattern.test(html);
    }
    setDetectedSections(detected);
  }, [html]);

  const regenerateSection = async () => {
    if (!selectedSection) return;
    setRegenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, section: selectedSection.id, feedback: feedback.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Regeneration failed');
      setShowSuccess(true);
      setFeedback('');
      onUpdate();
      setTimeout(() => { setShowSuccess(false); setSelectedSection(null); }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to regenerate section');
    } finally {
      setRegenerating(false);
    }
  };

  const getPresets = () => selectedSection ? (FEEDBACK_PRESETS[selectedSection.id] || FEEDBACK_PRESETS.default) : FEEDBACK_PRESETS.default;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-neutral-50 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-black">Website Preview</h3>
          {editMode && <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">Edit Mode</span>}
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
            editMode ? 'bg-violet-600 text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          {editMode ? (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Exit Edit Mode</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>Edit Sections</>
          )}
        </button>
      </div>

      <div className={`${editMode ? 'ring-2 ring-violet-500 ring-offset-2' : ''} rounded-xl overflow-hidden mx-4`}>
        <iframe
          srcDoc={html}
          className="w-full bg-white border border-neutral-200 rounded-xl"
          style={{ height: '500px' }}
          title="Website Preview"
        />
      </div>

      {editMode && (
        <div className="mx-4 p-4 bg-white border border-neutral-200 rounded-xl">
          <h4 className="font-semibold text-black mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Select Section to Regenerate
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {SECTIONS.map((section) => {
              const isDetected = detectedSections[section.id];
              const isSelected = selectedSection?.id === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => isDetected && setSelectedSection(section)}
                  disabled={!isDetected}
                  className={`p-3 rounded-xl text-center transition-all ${
                    isSelected
                      ? 'bg-violet-600 text-white ring-2 ring-violet-600 ring-offset-2'
                      : isDetected
                        ? 'bg-neutral-50 hover:bg-violet-50 border border-neutral-200 hover:border-violet-300'
                        : 'bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="text-xl block mb-1">{section.icon}</span>
                  <span className="text-xs font-medium block">{section.name}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            <span className="text-amber-500">💡</span> Click a section above, then customize what you want changed
          </p>
        </div>
      )}

      {selectedSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedSection.icon}</span>
                  <div>
                    <h2 className="font-semibold text-black text-lg">Regenerate {selectedSection.name}</h2>
                    <p className="text-sm text-neutral-500">{selectedSection.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedSection(null); setFeedback(''); setError(null); }}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {showSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black text-lg mb-2">Section Updated!</h3>
                <p className="text-neutral-500">The {selectedSection.name} has been regenerated.</p>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Quick suggestions</label>
                    <div className="flex flex-wrap gap-2">
                      {getPresets().map((preset, i) => (
                        <button
                          key={i}
                          onClick={() => setFeedback(preset)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            feedback === preset ? 'bg-violet-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-violet-100'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Your feedback <span className="text-neutral-400">(optional)</span>
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us what you'd like to change..."
                      rows={3}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    />
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
                  )}
                </div>
                <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
                  <button
                    onClick={() => { setSelectedSection(null); setFeedback(''); setError(null); }}
                    className="px-5 py-2.5 text-neutral-700 font-medium rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={regenerateSection}
                    disabled={regenerating}
                    className="px-5 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {regenerating ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Regenerating...</>
                    ) : (
                      <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Regenerate</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// DESIGN REVIEW COMPONENT
// =============================================================================

type ReviewCategory = { 
  score: number; 
  status: 'pass' | 'warning' | 'fail'; 
  findings?: any[]; 
  issues?: string[]; 
  missingFeatures?: string[]; 
  foundFeatures?: string[] 
};

type ReviewData = { 
  overallScore: number; 
  passesQuality: boolean; 
  categories: Record<string, ReviewCategory>; 
  criticalIssues: string[]; 
  warnings: string[]; 
  suggestions: string[]; 
  summary: string 
};

function DesignReview({ project, onReviewComplete }: { project: Project; onReviewComplete?: (r: ReviewData) => void }) {
  const [review, setReview] = useState<ReviewData | null>(project.review_details || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const runReview = async () => {
    if (!project.generated_html) { setError('No HTML to review'); return; }
    setLoading(true); setError(null);
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, generatedHtml: project.generated_html })
      });
      if (!response.ok) throw new Error('Review failed');
      const data = await response.json();
      setReview(data.review);
      onReviewComplete?.(data.review);
    } catch (err: any) {
      setError(err.message || 'Review failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600';
  const getScoreBg = (score: number) => score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
  const getStatusIcon = (status: string) => {
    if (status === 'pass') return <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>;
    if (status === 'warning') return <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01" /></svg></div>;
    return <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></div>;
  };

  const categoryLabels: Record<string, string> = {
    designDirection: 'Design Direction',
    brandVoice: 'Brand Voice',
    colorPalette: 'Color Palette',
    features: 'Features',
    heroSection: 'Hero Section',
    contentQuality: 'Content Quality',
    technicalQuality: 'Technical Quality'
  };

  if (!review) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-black text-lg">AI Design Review</h3>
            <p className="text-sm text-neutral-500">Check if design matches requirements</p>
          </div>
          <button
            onClick={runReview}
            disabled={loading || !project.generated_html}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium text-sm hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Reviewing...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Run AI Review</>
            )}
          </button>
        </div>
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        {!project.generated_html && <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">Generate a design first to run the quality review.</div>}
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className={`p-6 ${review.passesQuality ? 'bg-emerald-50' : 'bg-amber-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-black text-lg">AI Design Review</h3>
            <p className="text-sm text-neutral-600 mt-1 max-w-md">{review.summary}</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(review.overallScore)}`}>{review.overallScore}</div>
            <div className="text-xs text-neutral-500 mt-1">/ 100</div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-white/50 rounded-full overflow-hidden">
          <div className={`h-full ${getScoreBg(review.overallScore)} transition-all duration-500`} style={{ width: `${review.overallScore}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          {review.passesQuality ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Ready for Client
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" /></svg>
              Needs Revisions
            </span>
          )}
          <button onClick={runReview} disabled={loading} className="text-sm text-neutral-600 hover:text-black flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Re-run
          </button>
        </div>
      </div>

      {(review.criticalIssues?.length ?? 0) > 0 && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <h4 className="font-medium text-red-800 text-sm mb-2">Critical Issues ({review.criticalIssues?.length ?? 0})</h4>
          <ul className="space-y-1">
            {review.criticalIssues?.map((issue, i) => <li key={i} className="text-sm text-red-700">• {issue}</li>)}
          </ul>
        </div>
      )}

      <div className="p-4 border-b border-neutral-100">
        <h4 className="font-medium text-black text-sm mb-3">Category Breakdown</h4>
        <div className="space-y-2">
          {Object.entries(review.categories || {}).map(([key, category]) => {
            if (!category) return null;
            return (
              <div key={key} className="border border-neutral-100 rounded-lg overflow-hidden">
                <button onClick={() => setExpanded(expanded === key ? null : key)} className="w-full p-3 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(category.status)}
                    <span className="font-medium text-sm text-black">{categoryLabels[key] || key}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold text-sm ${getScoreColor(category.score)}`}>{category.score}%</span>
                    <svg className={`w-4 h-4 text-neutral-400 transition-transform ${expanded === key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {expanded === key && (
                  <div className="p-3 pt-0 border-t border-neutral-100 bg-neutral-50 space-y-2">
                    {(category.issues?.length ?? 0) > 0 && (
                      <div>
                        <span className="text-xs font-medium text-amber-600">Issues:</span>
                        <ul className="mt-1">{category.issues?.map((issue, i) => <li key={i} className="text-xs text-neutral-600">• {issue}</li>)}</ul>
                      </div>
                    )}
                    {(category.missingFeatures?.length ?? 0) > 0 && (
                      <div>
                        <span className="text-xs font-medium text-red-600">Missing:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {category.missingFeatures?.map((f, i) => <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">{f}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {(review.suggestions?.length ?? 0) > 0 && (
        <div className="p-4 bg-neutral-50">
          <h4 className="font-medium text-blue-700 text-sm mb-2">💡 Suggestions</h4>
          <ul className="space-y-1">
            {review.suggestions?.slice(0, 3).map((s, i) => <li key={i} className="text-sm text-neutral-600">{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'preview' | 'review' | 'messages'>('details');
  const [newMessage, setNewMessage] = useState('');
  const [formData, setFormData] = useState({ status: '', plan: '', notes: '', paid: false });

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadMessages();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*, customers(*)').eq('id', projectId).single();
      if (!error && data) {
        setProject(data);
        setFormData({ status: data.status || '', plan: data.plan || '', notes: data.notes || '', paid: data.paid || false });
      }
    } catch (err) {
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const { data } = await supabase.from('messages').select('*').eq('project_id', projectId).order('created_at', { ascending: true });
      if (data) setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const saveProject = async () => {
    if (!project) return;
    setSaving(true);
    try {
      await supabase.from('projects').update({
        status: formData.status,
        plan: formData.plan,
        notes: formData.notes,
        paid: formData.paid
      }).eq('id', projectId);
      loadProject();
    } catch (err) {
      console.error('Error saving project:', err);
    } finally {
      setSaving(false);
    }
  };

  const generateWebsite = async () => {
    if (!project) return;
    setGenerating(true);
    try {
      await supabase.from('projects').update({ status: 'GENERATING' }).eq('id', projectId);
      setFormData(prev => ({ ...prev, status: 'GENERATING' }));

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        await loadProject();
        setActiveTab('preview');
      } else {
        alert('Generation failed: ' + (data.details || data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error generating website:', err);
      alert('Error generating website.');
    } finally {
      setGenerating(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await supabase.from('messages').insert({
        project_id: projectId,
        content: newMessage.trim(),
        sender_type: 'admin',
        read: false
      });
      setNewMessage('');
      loadMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const getStatusConfig = (status: string) => STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  const getPlanConfig = (plan: string) => PLAN_OPTIONS.find(p => p.value === plan) || PLAN_OPTIONS[0];
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium text-black mb-2">Project Not Found</h2>
        <Link href="/admin/projects" className="text-black hover:underline">Back to Projects</Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);
  const planConfig = getPlanConfig(project.plan || '');
  const designDirection = DESIGN_DIRECTIONS[project.design_direction || ''];
  const brandVoice = BRAND_VOICES[project.brand_voice || ''];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/projects" className="text-sm text-neutral-500 hover:text-black mb-2 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-3xl font-medium text-black">{project.business_name}</h1>
          <div className="flex items-center gap-2 mt-2">
            {designDirection && <span className={`px-2 py-1 rounded-full text-xs font-medium ${designDirection.color}`}>{designDirection.name}</span>}
            {brandVoice && <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">{brandVoice}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {project.review_score !== null && (
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${project.review_score >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              Score: {project.review_score}
            </div>
          )}
          <span className={'px-3 py-1.5 rounded-full text-sm font-medium border ' + statusConfig.color}>
            {statusConfig.label}
          </span>
          <button onClick={saveProject} disabled={saving} className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-black/80 transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl w-fit">
        {(['details', 'preview', 'review', 'messages'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={'px-5 py-2.5 rounded-lg text-sm font-medium transition-all ' + (activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black')}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'messages' && messages.length > 0 && <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs rounded-full">{messages.length}</span>}
            {tab === 'review' && project.review_score !== null && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${project.review_score >= 75 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                {project.review_score}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* DETAILS TAB */}
      {activeTab === 'details' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Status and Plan */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-semibold text-black mb-6">Status and Plan</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-neutral-500 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-500 mb-2">Plan</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {PLAN_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label} (${opt.price})</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.paid}
                    onChange={(e) => setFormData({ ...formData, paid: e.target.checked })}
                    className="w-5 h-5 rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span className="text-sm text-black">Mark as Paid</span>
                </label>
              </div>
            </div>

            {/* Multi-Page Manager */}
            <MultiPageManager
              projectId={project.id}
              plan={formData.plan || project.plan || 'starter'}
              generatedPages={project.generated_pages}
              requestedPages={project.requested_pages}
              onUpdate={loadProject}
            />

            {/* Project Requirements */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-semibold text-black mb-6">Project Requirements</h2>
              <div className="space-y-4">
                {project.description && (
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Business Description</p>
                    <p className="text-sm text-black">{project.description}</p>
                  </div>
                )}
                {project.target_customer && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs text-amber-700 mb-1">Target Customer</p>
                    <p className="text-sm text-amber-900">{project.target_customer}</p>
                  </div>
                )}
                {project.unique_value && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <p className="text-xs text-emerald-700 mb-1">Unique Value</p>
                    <p className="text-sm text-emerald-900">{project.unique_value}</p>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Industry</p>
                    <p className="text-sm font-medium text-black">{project.industry || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Website Goal</p>
                    <p className="text-sm font-medium text-black capitalize">{project.website_goal?.replace('-', ' ') || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Design Direction</p>
                    <p className="text-sm font-medium text-black">{designDirection?.name || project.style || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Hero Style</p>
                    <p className="text-sm font-medium text-black capitalize">{project.hero_preference?.replace('-', ' ') || 'Auto'}</p>
                  </div>
                </div>
                {project.primary_services && project.primary_services.length > 0 && (
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-2">Primary Services</p>
                    <div className="flex flex-wrap gap-2">
                      {project.primary_services.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {project.call_to_action && (
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Preferred CTA</p>
                    <p className="text-sm font-medium text-black">&quot;{project.call_to_action}&quot;</p>
                  </div>
                )}
              </div>
            </div>

            {/* Internal Notes */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-semibold text-black mb-4">Internal Notes</h2>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add internal notes..."
                rows={4}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-semibold text-black mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={generateWebsite}
                  disabled={generating}
                  className="px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {generating ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>{project.generated_html ? 'Regenerate' : 'Generate'}</>
                  )}
                </button>
                {project.generated_html && (
                  <>
                    <a
                      href={'/preview/' + project.id}
                      target="_blank"
                      className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Live Preview
                    </a>
                    <button
                      onClick={() => setActiveTab('preview')}
                      className="px-5 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-full hover:bg-violet-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Sections
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Customer */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-semibold text-black mb-4">Customer</h2>
              {project.customers ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-neutral-600 to-neutral-800 rounded-xl flex items-center justify-center text-white font-bold">
                    {project.customers.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-black">{project.customers.name}</p>
                    <p className="text-sm text-neutral-500">{project.customers.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No customer assigned</p>
              )}
            </div>

            {/* Project Value */}
            <div className="bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 text-white">
              <h2 className="font-semibold mb-4">Project Value</h2>
              <div className="text-4xl font-semibold mb-2">${planConfig.price}</div>
              <p className="text-sm text-white/60">{planConfig.label} Plan</p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm text-white/60">Payment</span>
                <span className={'text-sm font-medium ' + (project.paid ? 'text-emerald-400' : 'text-amber-400')}>
                  {project.paid ? 'Paid' : 'Pending'}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm text-white/60">Created</span>
                <span className="text-sm text-white/80">{formatDate(project.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW TAB */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {project.generated_html ? (
            <SectionEditor projectId={project.id} html={project.generated_html} onUpdate={loadProject} />
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-2">No Preview Available</h3>
              <p className="text-neutral-500 mb-6">Generate a website to see the preview</p>
              <button
                onClick={generateWebsite}
                disabled={generating}
                className="px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate Website'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* REVIEW TAB */}
      {activeTab === 'review' && <DesignReview project={project} onReviewComplete={() => loadProject()} />}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-neutral-500">No messages yet</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={'flex ' + (msg.sender_type === 'admin' ? 'justify-end' : 'justify-start')}>
                  <div className={'max-w-md px-4 py-3 rounded-2xl ' + (msg.sender_type === 'admin' ? 'bg-black text-white rounded-br-sm' : 'bg-neutral-100 text-black rounded-bl-sm')}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={'text-xs mt-1 ' + (msg.sender_type === 'admin' ? 'text-white/60' : 'text-neutral-400')}>
                      {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-neutral-200 flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-5 py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-black/80 disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
