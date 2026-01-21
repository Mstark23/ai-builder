'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// =============================================================================
// TYPES
// =============================================================================

interface Project {
  id: string;
  business_name: string;
  generated_html: string | null;
  generated_pages: Record<string, string> | null;
  requested_pages: string[] | null;
  status: string;
  plan: string;
}

interface PageInfo {
  id: string;
  name: string;
  icon: string;
}

const PAGE_INFO: Record<string, PageInfo> = {
  home: { id: 'home', name: 'Home', icon: '🏠' },
  about: { id: 'about', name: 'About', icon: '📖' },
  services: { id: 'services', name: 'Services', icon: '⚡' },
  contact: { id: 'contact', name: 'Contact', icon: '✉️' },
  pricing: { id: 'pricing', name: 'Pricing', icon: '💰' },
  portfolio: { id: 'portfolio', name: 'Portfolio', icon: '🎨' },
  blog: { id: 'blog', name: 'Blog', icon: '📝' },
  faq: { id: 'faq', name: 'FAQ', icon: '❓' },
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function MultiPagePreview() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, business_name, generated_html, generated_pages, requested_pages, status, plan')
        .eq('id', projectId)
        .single();

      if (!error && data) {
        setProject(data);
      }
    } catch (err) {
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!feedback.trim()) return;
    setSubmitting(true);

    try {
      const pageInfo = PAGE_INFO[currentPage];
      await supabase.from('messages').insert({
        project_id: projectId,
        content: `[Page: ${pageInfo?.name || currentPage}]${selectedSection ? ` [Section: ${selectedSection}]` : ''}\n\n${feedback.trim()}`,
        sender_type: 'customer',
        read: false,
      });

      setFeedback('');
      setSelectedSection(null);
      alert('Feedback submitted! We\'ll update this section soon.');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const approveDesign = async () => {
    if (!confirm('Approve this design? You can still request changes later.')) return;

    try {
      await supabase.from('messages').insert({
        project_id: projectId,
        content: '✅ Customer approved the design (all pages)',
        sender_type: 'customer',
        read: false,
      });
      alert('Design approved! We\'ll be in touch soon.');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const getViewportWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const getCurrentHtml = () => {
    if (!project) return null;
    
    // Check if we have multi-page content
    if (project.generated_pages && project.generated_pages[currentPage]) {
      return project.generated_pages[currentPage];
    }
    
    // Fallback to single page (home)
    if (currentPage === 'home' && project.generated_html) {
      return project.generated_html;
    }
    
    return null;
  };

  const getAvailablePages = (): string[] => {
    if (!project) return ['home'];
    
    // If we have multi-page data
    if (project.generated_pages && Object.keys(project.generated_pages).length > 0) {
      return Object.keys(project.generated_pages);
    }
    
    // If we have requested pages
    if (project.requested_pages && project.requested_pages.length > 0) {
      return project.requested_pages;
    }
    
    // Default to home only
    return ['home'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
          <h1 className="text-2xl font-bold text-black mb-2">Project Not Found</h1>
          <p className="text-neutral-600">This preview link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const currentHtml = getCurrentHtml();
  const availablePages = getAvailablePages();
  const hasMultiplePages = availablePages.length > 1;

  if (!currentHtml) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Preview Coming Soon</h1>
          <p className="text-neutral-600">Your website is being generated. Check back shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <div>
                <h1 className="font-semibold text-black">{project.business_name}</h1>
                <p className="text-xs text-neutral-500">
                  {hasMultiplePages ? `${availablePages.length} Pages` : 'Website Preview'}
                </p>
              </div>
            </div>

            {/* Viewport Toggle */}
            <div className="hidden md:flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
              {[
                { id: 'desktop', icon: '🖥️' },
                { id: 'tablet', icon: '📱' },
                { id: 'mobile', icon: '📲' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as 'desktop' | 'tablet' | 'mobile')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                    viewMode === mode.id
                      ? 'bg-white shadow text-black'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {mode.icon}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFeedbackMode(!feedbackMode)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  feedbackMode
                    ? 'bg-violet-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {feedbackMode ? '✏️ Done' : '💬 Feedback'}
              </button>
              <button
                onClick={approveDesign}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700"
              >
                ✓ Approve
              </button>
            </div>
          </div>
        </div>

        {/* Page Tabs (if multiple pages) */}
        {hasMultiplePages && (
          <div className="border-t border-neutral-100 bg-neutral-50">
            <div className="max-w-screen-2xl mx-auto px-4">
              <div className="flex items-center gap-1 overflow-x-auto py-2">
                {availablePages.map((pageId) => {
                  const page = PAGE_INFO[pageId] || { id: pageId, name: pageId, icon: '📄' };
                  const isActive = currentPage === pageId;
                  const hasContent = project.generated_pages?.[pageId];

                  return (
                    <button
                      key={pageId}
                      onClick={() => hasContent && setCurrentPage(pageId)}
                      disabled={!hasContent}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-white shadow text-violet-600'
                          : hasContent
                            ? 'text-neutral-600 hover:bg-white/50 hover:text-black'
                            : 'text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      <span>{page.icon}</span>
                      <span>{page.name}</span>
                      {!hasContent && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                          Coming
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Preview */}
        <div className="flex-1 p-4">
          <div
            className="bg-white rounded-xl shadow-lg overflow-hidden mx-auto transition-all duration-300"
            style={{
              maxWidth: getViewportWidth(),
              height: 'calc(100vh - 160px)',
            }}
          >
            <iframe
              srcDoc={currentHtml}
              className="w-full h-full border-0"
              title={`${PAGE_INFO[currentPage]?.name || 'Page'} Preview`}
            />
          </div>
        </div>

        {/* Feedback Panel */}
        {feedbackMode && (
          <div className="w-80 bg-white border-l border-neutral-200 p-4 overflow-y-auto">
            <h2 className="font-semibold text-black mb-2">
              Feedback for {PAGE_INFO[currentPage]?.name || 'Page'}
            </h2>
            <p className="text-sm text-neutral-500 mb-4">
              Tell us what you'd like changed on this page.
            </p>

            {/* Section quick picks */}
            <div className="mb-4">
              <p className="text-xs text-neutral-500 mb-2">Section (optional):</p>
              <div className="flex flex-wrap gap-2">
                {['Hero', 'Content', 'Images', 'Colors', 'Text', 'Layout'].map((section) => (
                  <button
                    key={section}
                    onClick={() => setSelectedSection(selectedSection === section ? null : section)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedSection === section
                        ? 'bg-violet-600 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-violet-100'
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback textarea */}
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe what you'd like changed..."
              rows={4}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none mb-4"
            />

            {/* Quick suggestions */}
            <div className="mb-4">
              <p className="text-xs text-neutral-500 mb-2">Quick suggestions:</p>
              <div className="space-y-2">
                {[
                  'Make it more bold',
                  'Use warmer colors',
                  'Simplify the text',
                  'Add more visuals',
                  'Change the layout',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setFeedback(suggestion)}
                    className="w-full text-left px-3 py-2 bg-neutral-50 hover:bg-violet-50 rounded-lg text-sm text-neutral-700 hover:text-violet-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={submitFeedback}
              disabled={submitting || !feedback.trim()}
              className="w-full px-4 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Feedback'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 text-sm">
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${project.status === 'PREVIEW_READY' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {project.status === 'PREVIEW_READY' ? 'Ready for Review' : project.status}
        </span>
        <span className="text-white/40">|</span>
        <span className="text-white/70">
          {PAGE_INFO[currentPage]?.icon} {PAGE_INFO[currentPage]?.name}
        </span>
        {hasMultiplePages && (
          <>
            <span className="text-white/40">|</span>
            <span className="text-white/70">{availablePages.length} pages</span>
          </>
        )}
      </div>
    </div>
  );
}
