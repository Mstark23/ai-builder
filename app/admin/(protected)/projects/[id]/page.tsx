'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// ============================================
// TYPES
// ============================================

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
  created_at: string;
  email: string | null;
  customer_id: string | null;
  // New fields
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
  // Review fields
  review_score: number | null;
  review_details: any | null;
  reviewed_at: string | null;
  customers?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null;
};

type Message = {
  id: string;
  content: string;
  sender_type: 'admin' | 'customer';
  created_at: string;
};

type ReviewCategory = {
  score: number;
  status: 'pass' | 'warning' | 'fail';
  findings?: { check: string; result: string; detail: string }[];
  issues?: string[];
  missingElements?: string[];
  missingFeatures?: string[];
  foundFeatures?: string[];
  colorsFound?: string[];
  ctaText?: string;
};

type ReviewData = {
  overallScore: number;
  passesQuality: boolean;
  categories: Record<string, ReviewCategory>;
  criticalIssues: string[];
  warnings: string[];
  suggestions: string[];
  summary: string;
};

// ============================================
// CONSTANTS
// ============================================

const STATUS_OPTIONS = [
  { value: 'QUEUED', label: 'Queued', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'GENERATING', label: 'Generating', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { value: 'PREVIEW_READY', label: 'Preview Ready', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'NEEDS_REVISION', label: 'Needs Revision', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'REVISION_REQUESTED', label: 'Revision Requested', color: 'bg-orange-100 text-orange-700 border-orange-200' },
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

// ============================================
// DESIGN REVIEW COMPONENT (INLINE)
// ============================================

function DesignReview({ 
  project,
  onReviewComplete 
}: { 
  project: Project;
  onReviewComplete?: (review: ReviewData) => void;
}) {
  const [review, setReview] = useState<ReviewData | null>(project.review_details || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const runReview = async () => {
    if (!project.generated_html) {
      setError('No HTML to review');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId: project.id, 
          generatedHtml: project.generated_html 
        }),
      });

      if (!response.ok) {
        throw new Error('Review failed');
      }

      const data = await response.json();
      setReview(data.review);
      onReviewComplete?.(data.review);
    } catch (err: any) {
      setError(err.message || 'Review failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return (
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01" />
            </svg>
          </div>
        );
      case 'fail':
        return (
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const categoryLabels: Record<string, string> = {
    designDirection: 'Design Direction',
    brandVoice: 'Brand Voice',
    colorPalette: 'Color Palette',
    features: 'Requested Features',
    heroSection: 'Hero Section',
    contentQuality: 'Content Quality',
    technicalQuality: 'Technical Quality',
  };

  // No review yet - show run button
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
            className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium text-sm hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Reviewing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Run AI Review
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {!project.generated_html && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
            Generate a design first to run the quality review.
          </div>
        )}
      </div>
    );
  }

  // Show review results
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      {/* Header with Overall Score */}
      <div className={`p-6 ${review.passesQuality ? 'bg-emerald-50' : 'bg-amber-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-black text-lg">AI Design Review</h3>
            <p className="text-sm text-neutral-600 mt-1 max-w-md">{review.summary}</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(review.overallScore)}`}>
              {review.overallScore}
            </div>
            <div className="text-xs text-neutral-500 mt-1">/ 100</div>
          </div>
        </div>

        {/* Score Bar */}
        <div className="mt-4 h-2 bg-white/50 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getScoreBg(review.overallScore)} transition-all duration-500`}
            style={{ width: `${review.overallScore}%` }}
          />
        </div>

        {/* Status Badge */}
        <div className="mt-3 flex items-center justify-between">
          {review.passesQuality ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Ready for Client
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
              Needs Revisions
            </span>
          )}
          <button
            onClick={runReview}
            disabled={loading}
            className="text-sm text-neutral-600 hover:text-black flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Re-run
          </button>
        </div>
      </div>

      {/* Critical Issues */}
      {review.criticalIssues && review.criticalIssues.length > 0 && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <h4 className="font-medium text-red-800 text-sm mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Critical Issues ({review.criticalIssues.length})
          </h4>
          <ul className="space-y-1">
            {review.criticalIssues.map((issue, i) => (
              <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Category Scores */}
      <div className="p-4 border-b border-neutral-100">
        <h4 className="font-medium text-black text-sm mb-3">Category Breakdown</h4>
        <div className="space-y-2">
          {Object.entries(review.categories || {}).map(([key, category]) => {
            if (!category) return null;
            const isExpanded = expanded === key;
            
            return (
              <div key={key} className="border border-neutral-100 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : key)}
                  className="w-full p-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(category.status)}
                    <span className="font-medium text-sm text-black">
                      {categoryLabels[key] || key}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold text-sm ${getScoreColor(category.score)}`}>
                      {category.score}%
                    </span>
                    <svg 
                      className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-3 pt-0 border-t border-neutral-100 bg-neutral-50 space-y-2">
                    {category.findings && category.findings.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-neutral-500 uppercase">Checks</span>
                        <div className="mt-1 space-y-1">
                          {category.findings.map((finding, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className={finding.result === 'pass' ? 'text-emerald-500' : 'text-red-500'}>
                                {finding.result === 'pass' ? '✓' : '✗'}
                              </span>
                              <span className="text-neutral-700">{finding.check}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {category.issues && category.issues.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-amber-600">Issues:</span>
                        <ul className="mt-1 space-y-0.5">
                          {category.issues.map((issue, i) => (
                            <li key={i} className="text-xs text-neutral-600">• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {category.missingFeatures && category.missingFeatures.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-red-600">Missing:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {category.missingFeatures.map((f, i) => (
                            <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">{f}</span>
                          ))}
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

      {/* Suggestions */}
      {review.suggestions && review.suggestions.length > 0 && (
        <div className="p-4 bg-neutral-50">
          <h4 className="font-medium text-blue-700 text-sm mb-2">💡 Suggestions</h4>
          <ul className="space-y-1">
            {review.suggestions.slice(0, 3).map((suggestion, i) => (
              <li key={i} className="text-sm text-neutral-600">{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

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

  const [formData, setFormData] = useState({
    status: '',
    plan: '',
    notes: '',
    paid: false,
  });

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadMessages();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, customers(*)')
        .eq('id', projectId)
        .single();

      if (!error && data) {
        setProject(data);
        setFormData({
          status: data.status || '',
          plan: data.plan || '',
          notes: data.notes || '',
          paid: data.paid || false,
        });
      }
    } catch (err) {
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const saveProject = async () => {
    if (!project) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          status: formData.status,
          plan: formData.plan,
          notes: formData.notes,
          paid: formData.paid,
        })
        .eq('id', projectId);

      if (!error) {
        loadProject();
      }
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
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await loadProject();
        setActiveTab('preview');
        
        // Auto-run review after generation
        if (data.html) {
          setTimeout(() => setActiveTab('review'), 1000);
        }
      } else {
        console.error('Generation failed:', data.error);
        alert('Generation failed: ' + (data.details || data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error generating website:', err);
      alert('Error generating website. Please try again.');
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
        read: false,
      });

      setNewMessage('');
      loadMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const getStatusConfig = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  };

  const getPlanConfig = (plan: string) => {
    return PLAN_OPTIONS.find(p => p.value === plan) || PLAN_OPTIONS[0];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
        <h2 className="font-display text-2xl font-medium text-black mb-2">Project Not Found</h2>
        <p className="font-body text-neutral-500 mb-6">This project does not exist or has been deleted.</p>
        <Link href="/admin/projects" className="font-body text-black hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);
  const planConfig = getPlanConfig(project.plan || '');
  const previewUrl = '/preview/' + project.id;
  const designDirection = DESIGN_DIRECTIONS[project.design_direction || ''];
  const brandVoice = BRAND_VOICES[project.brand_voice || ''];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/projects" className="font-body text-sm text-neutral-500 hover:text-black mb-2 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          <h1 className="font-display text-3xl font-medium text-black">{project.business_name}</h1>
          <div className="flex items-center gap-2 mt-2">
            {designDirection && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${designDirection.color}`}>
                {designDirection.name}
              </span>
            )}
            {brandVoice && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                {brandVoice}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {project.review_score !== null && (
            <div className={`px-3 py-1.5 rounded-full font-body text-sm font-medium ${
              project.review_score >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              Score: {project.review_score}
            </div>
          )}
          <span className={'px-3 py-1.5 rounded-full font-body text-sm font-medium border ' + statusConfig.color}>
            {statusConfig.label}
          </span>
          <button
            onClick={saveProject}
            disabled={saving}
            className="px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors disabled:opacity-50"
          >
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
            className={'px-5 py-2.5 rounded-lg font-body text-sm font-medium transition-all ' +
              (activeTab === tab
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-500 hover:text-black')
            }
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'messages' && messages.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs rounded-full">
                {messages.length}
              </span>
            )}
            {tab === 'review' && project.review_score !== null && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                project.review_score >= 75 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
              }`}>
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
              <h2 className="font-body font-semibold text-black mb-6">Status and Plan</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-sm text-neutral-500 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-sm text-neutral-500 mb-2">Plan</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {PLAN_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label} (${opt.price})</option>
                    ))}
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
                  <span className="font-body text-sm text-black">Mark as Paid</span>
                </label>
              </div>
            </div>

            {/* Project Requirements */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-body font-semibold text-black mb-6">Project Requirements</h2>
              
              <div className="space-y-4">
                {/* Description */}
                {project.description && (
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="font-body text-xs text-neutral-500 mb-1">Business Description</p>
                    <p className="font-body text-sm text-black">{project.description}</p>
                  </div>
                )}

                {/* Target Customer */}
                {project.target_customer && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="font-body text-xs text-amber-700 mb-1">Target Customer</p>
                    <p className="font-body text-sm text-amber-900">{project.target_customer}</p>
                  </div>
                )}

                {/* Unique Value */}
                {project.unique_value && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <p className="font-body text-xs text-emerald-700 mb-1">Unique Value Proposition</p>
                    <p className="font-body text-sm text-emerald-900">{project.unique_value}</p>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="font-body text-xs text-neutral-500 mb-1">Industry</p>
                    <p className="font-body text-sm font-medium text-black">{project.industry || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="font-body text-xs text-neutral-500 mb-1">Website Goal</p>
                    <p className="font-body text-sm font-medium text-black capitalize">{project.website_goal?.replace('-', ' ') || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="font-body text-xs text-neutral-500 mb-1">Design Direction</p>
                    <p className="font-body text-sm font-medium text-black">{designDirection?.name || project.style || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="font-body text-xs text-neutral-500 mb-1">Hero Style</p>
                    <p className="font-body text-sm font-medium text-black capitalize">{project.hero_preference?.replace('-', ' ') || 'Auto'}</p>
                  </div>
                </div>

                {/* Primary Services */}
                {project.primary_services && project.primary_services.length > 0 && (
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="font-body text-xs text-neutral-500 mb-2">Primary Services</p>
                    <div className="flex flex-wrap gap-2">
                      {project.primary_services.map((service, i) => (
                        <span key={i} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mood Tags */}
                {project.mood_tags && project.mood_tags.length > 0 && (
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="font-body text-xs text-neutral-500 mb-2">Mood Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {project.mood_tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                {project.call_to_action && (
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="font-body text-xs text-neutral-500 mb-1">Preferred CTA</p>
                    <p className="font-body text-sm font-medium text-black">"{project.call_to_action}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Internal Notes */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-body font-semibold text-black mb-4">Internal Notes</h2>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add internal notes about this project..."
                rows={4}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-body font-semibold text-black mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={generateWebsite}
                  disabled={generating}
                  className="px-5 py-2.5 bg-purple-600 text-white font-body text-sm font-medium rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
                      {project.generated_html ? 'Regenerate Website' : 'Generate Website'}
                    </>
                  )}
                </button>
                {project.generated_html && (
                  <>
                    <a
                      href={previewUrl}
                      target="_blank"
                      className="px-5 py-2.5 bg-emerald-600 text-white font-body text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Live Preview
                    </a>
                    <button
                      onClick={() => setActiveTab('review')}
                      className="px-5 py-2.5 bg-violet-600 text-white font-body text-sm font-medium rounded-full hover:bg-violet-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Run AI Review
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-body font-semibold text-black mb-4">Customer</h2>
              {project.customers ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-neutral-600 to-neutral-800 rounded-xl flex items-center justify-center text-white font-body font-bold">
                      {project.customers.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-body font-medium text-black">{project.customers.name}</p>
                      <p className="font-body text-sm text-neutral-500">{project.customers.email}</p>
                    </div>
                  </div>
                  {project.customers.phone && (
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <p className="font-body text-xs text-neutral-500 mb-1">Phone</p>
                      <p className="font-body text-sm text-black">{project.customers.phone}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="font-body text-sm text-neutral-500">No customer assigned</p>
              )}
            </div>

            {/* Contact Info */}
            {(project.contact_email || project.contact_phone || project.address) && (
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="font-body font-semibold text-black mb-4">Website Contact Info</h2>
                <div className="space-y-3">
                  {project.contact_email && (
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <p className="font-body text-xs text-neutral-500">Email</p>
                      <p className="font-body text-sm text-black">{project.contact_email}</p>
                    </div>
                  )}
                  {project.contact_phone && (
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <p className="font-body text-xs text-neutral-500">Phone</p>
                      <p className="font-body text-sm text-black">{project.contact_phone}</p>
                    </div>
                  )}
                  {project.address && (
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <p className="font-body text-xs text-neutral-500">Address</p>
                      <p className="font-body text-sm text-black">{project.address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Project Value */}
            <div className="bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 text-white">
              <h2 className="font-body font-semibold mb-4">Project Value</h2>
              <div className="text-4xl font-display font-semibold mb-2">${planConfig.price}</div>
              <p className="font-body text-sm text-white/60">{planConfig.label} Plan</p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-white/60">Payment Status</span>
                  <span className={'font-body text-sm font-medium ' + (project.paid ? 'text-emerald-400' : 'text-amber-400')}>
                    {project.paid ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-white/60">Created</span>
                  <span className="font-body text-sm text-white/80">{formatDate(project.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW TAB */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {project.generated_html ? (
            <div className="aspect-video relative">
              <iframe
                srcDoc={project.generated_html}
                className="w-full h-full absolute inset-0"
                title="Website Preview"
              />
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-medium text-black mb-2">No Preview Available</h3>
              <p className="font-body text-neutral-500 mb-6">Generate a website to see the preview</p>
              <button
                onClick={generateWebsite}
                disabled={generating}
                className="px-5 py-2.5 bg-purple-600 text-white font-body text-sm font-medium rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate Website'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* REVIEW TAB */}
      {activeTab === 'review' && (
        <DesignReview 
          project={project}
          onReviewComplete={(review) => {
            loadProject(); // Reload to get updated review score
          }}
        />
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="font-body text-neutral-500">No messages yet</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={'flex ' + (msg.sender_type === 'admin' ? 'justify-end' : 'justify-start')}>
                  <div className={'max-w-md px-4 py-3 rounded-2xl ' +
                    (msg.sender_type === 'admin'
                      ? 'bg-black text-white rounded-br-sm'
                      : 'bg-neutral-100 text-black rounded-bl-sm')
                  }>
                    <p className="font-body text-sm">{msg.content}</p>
                    <p className={'font-body text-xs mt-1 ' + (msg.sender_type === 'admin' ? 'text-white/60' : 'text-neutral-400')}>
                      {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-neutral-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-neutral-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-5 py-3 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80 disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
