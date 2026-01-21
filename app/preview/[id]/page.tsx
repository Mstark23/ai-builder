// app/preview/[id]/page.tsx
// Customer-facing preview with section feedback

'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// =============================================================================
// TYPES
// =============================================================================

interface Project {
  id: string;
  business_name: string;
  generated_html: string | null;
  status: string;
  plan: string;
}

interface SectionFeedback {
  sectionId: string;
  sectionName: string;
  feedback: string;
  timestamp: Date;
}

const SECTIONS = [
  { id: 'hero', name: 'Hero Banner', icon: '🦸', description: 'Main headline and call-to-action' },
  { id: 'services', name: 'Services', icon: '⚡', description: 'Your offerings' },
  { id: 'about', name: 'About', icon: '📖', description: 'Your story' },
  { id: 'testimonials', name: 'Testimonials', icon: '💬', description: 'Customer reviews' },
  { id: 'stats', name: 'Statistics', icon: '📊', description: 'Key numbers' },
  { id: 'cta', name: 'Call to Action', icon: '📢', description: 'Final push' },
  { id: 'contact', name: 'Contact', icon: '✉️', description: 'Get in touch' },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CustomerPreviewPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState<typeof SECTIONS[0] | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pendingFeedback, setPendingFeedback] = useState<SectionFeedback[]>([]);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, business_name, generated_html, status, plan')
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
    if (!selectedSection || !feedback.trim()) return;
    
    setSubmitting(true);
    
    try {
      // Save feedback to messages table
      await supabase.from('messages').insert({
        project_id: projectId,
        content: `[Section Feedback: ${selectedSection.name}]\n\n${feedback.trim()}`,
        sender_type: 'customer',
        read: false,
      });

      // Add to pending feedback list
      setPendingFeedback(prev => [...prev, {
        sectionId: selectedSection.id,
        sectionName: selectedSection.name,
        feedback: feedback.trim(),
        timestamp: new Date()
      }]);

      setSubmitted(true);
      setFeedback('');
      
      setTimeout(() => {
        setSubmitted(false);
        setSelectedSection(null);
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const approveDesign = async () => {
    if (!confirm('Are you ready to approve this design? You can still request changes later.')) return;
    
    try {
      await supabase.from('messages').insert({
        project_id: projectId,
        content: '✅ Customer approved the design',
        sender_type: 'customer',
        read: false,
      });
      
      alert('Thank you! Your approval has been recorded. We\'ll be in touch soon.');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-neutral-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!project || !project.generated_html) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Preview Coming Soon</h1>
          <p className="text-neutral-600">
            Your website is being crafted. We'll notify you when it's ready for review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <div>
                <h1 className="font-semibold text-black">{project.business_name}</h1>
                <p className="text-xs text-neutral-500">Website Preview</p>
              </div>
            </div>

            {/* Viewport Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
              {[
                { id: 'desktop', icon: '🖥️', label: 'Desktop' },
                { id: 'tablet', icon: '📱', label: 'Tablet' },
                { id: 'mobile', icon: '📲', label: 'Mobile' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
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
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                  feedbackMode
                    ? 'bg-violet-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {feedbackMode ? (
                  <>✏️ Editing</>
                ) : (
                  <>💬 Request Changes</>
                )}
              </button>
              <button
                onClick={approveDesign}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                ✓ Approve Design
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Preview Area */}
        <div className="flex-1 p-4">
          <div 
            className="bg-white rounded-xl shadow-lg overflow-hidden mx-auto transition-all duration-300"
            style={{ 
              maxWidth: getViewportWidth(),
              height: 'calc(100vh - 120px)'
            }}
          >
            <iframe
              ref={iframeRef}
              srcDoc={project.generated_html}
              className="w-full h-full border-0"
              title="Website Preview"
            />
          </div>
        </div>

        {/* Feedback Panel */}
        {feedbackMode && (
          <div className="w-80 bg-white border-l border-neutral-200 p-4 overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
            <h2 className="font-semibold text-black mb-4 flex items-center gap-2">
              <span className="text-lg">💬</span>
              Request Changes
            </h2>
            
            <p className="text-sm text-neutral-600 mb-4">
              Select a section you'd like us to change, then describe what you'd like different.
            </p>

            {/* Section Grid */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    selectedSection?.id === section.id
                      ? 'bg-violet-600 text-white ring-2 ring-violet-600 ring-offset-2'
                      : 'bg-neutral-50 hover:bg-violet-50 border border-neutral-200'
                  }`}
                >
                  <span className="text-xl block mb-1">{section.icon}</span>
                  <span className="text-xs font-medium">{section.name}</span>
                </button>
              ))}
            </div>

            {/* Pending Feedback */}
            {pendingFeedback.length > 0 && (
              <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <h3 className="font-medium text-amber-800 text-sm mb-2">
                  📋 Pending Requests ({pendingFeedback.length})
                </h3>
                <ul className="space-y-1">
                  {pendingFeedback.map((fb, i) => (
                    <li key={i} className="text-xs text-amber-700">
                      • {fb.sectionName}: {fb.feedback.substring(0, 30)}...
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section Feedback Modal */}
      {selectedSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black text-lg mb-2">Feedback Sent!</h3>
                <p className="text-neutral-600">We'll update your {selectedSection.name} section soon.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-neutral-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedSection.icon}</span>
                      <div>
                        <h2 className="font-semibold text-black text-lg">
                          Change {selectedSection.name}
                        </h2>
                        <p className="text-sm text-neutral-500">
                          {selectedSection.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedSection(null)}
                      className="p-2 hover:bg-neutral-100 rounded-lg"
                    >
                      <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    What would you like changed?
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="E.g., 'Make the headline shorter and punchier' or 'Use warmer colors' or 'Add my company tagline'"
                    rows={4}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                  
                  {/* Quick suggestions */}
                  <div className="mt-3">
                    <p className="text-xs text-neutral-500 mb-2">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Make it more bold',
                        'Use friendlier tone',
                        'Add more visuals',
                        'Simplify the text',
                        'Change the colors',
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setFeedback(suggestion)}
                          className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs hover:bg-violet-100 hover:text-violet-700 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3 rounded-b-2xl">
                  <button
                    onClick={() => setSelectedSection(null)}
                    className="px-5 py-2.5 text-neutral-700 font-medium rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitFeedback}
                    disabled={submitting || !feedback.trim()}
                    className="px-5 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>Send Request</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 text-sm">
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${project.status === 'PREVIEW_READY' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {project.status === 'PREVIEW_READY' ? 'Ready for Review' : project.status}
        </span>
        <span className="text-white/40">|</span>
        <span className="text-white/70 capitalize">{project.plan} Plan</span>
      </div>
    </div>
  );
}
