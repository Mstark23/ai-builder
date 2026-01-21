'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// ============================================
// STATUS CONFIGS
// ============================================
const statusConfig = {
  QUEUED: {
    label: 'In Queue',
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    icon: '⏳',
    progress: 10,
  },
  IN_PROGRESS: {
    label: 'Creating Preview',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    icon: '🎨',
    progress: 40,
  },
  PREVIEW_READY: {
    label: 'Preview Ready',
    color: 'text-purple-700',
    bg: 'bg-purple-100',
    icon: '👁️',
    progress: 60,
  },
  REVISION_REQUESTED: {
    label: 'Revision Requested',
    color: 'text-orange-700',
    bg: 'bg-orange-100',
    icon: '✏️',
    progress: 50,
  },
  PAID: {
    label: 'Paid - Setup Required',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
    icon: '✅',
    progress: 70,
  },
  BUILDING: {
    label: 'Building Your Website',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    icon: '🔨',
    progress: 85,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
    icon: '🚀',
    progress: 100,
  },
};

const planPrices: Record<string, number> = {
  starter: 299, landing: 299,
  professional: 599, service: 599,
  premium: 799,
  enterprise: 999, ecommerce: 999,
};

export default function DynamicProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (!projectData) {
        router.push('/portal');
        return;
      }

      setProject(projectData);

      // Load messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (messagesData) {
        setMessages(messagesData);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestRevision = async () => {
    if (!revisionNotes.trim()) return;
    setSubmitting(true);

    try {
      await supabase
        .from('projects')
        .update({ 
          status: 'REVISION_REQUESTED',
          revision_notes: revisionNotes,
        })
        .eq('id', projectId);

      await supabase.from('messages').insert({
        project_id: projectId,
        content: `📝 Revision requested: ${revisionNotes}`,
        sender_type: 'customer',
        read: false,
      });

      setShowRevisionModal(false);
      setRevisionNotes('');
      loadProject();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const approveAndPay = () => {
    // Redirect to payment page or open Stripe checkout
    router.push(`/portal/project/${projectId}/checkout`);
  };

  const getStatus = () => statusConfig[project?.status as keyof typeof statusConfig] || statusConfig.QUEUED;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-body text-neutral-500">Loading project...</p>
      </div>
    );
  }

  const status = getStatus();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* BACK LINK */}
      <Link href="/portal" className="inline-flex items-center gap-2 font-body text-neutral-500 hover:text-black transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Dashboard</span>
      </Link>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl lg:text-4xl font-medium text-black">
              {project?.business_name}
            </h1>
            <span className={`px-3 py-1 rounded-full font-body text-xs font-medium ${status.bg} ${status.color}`}>
              {status.icon} {status.label}
            </span>
          </div>
          <p className="font-body text-neutral-500">
            {project?.plan?.charAt(0).toUpperCase() + project?.plan?.slice(1)} Plan · ${planPrices[project?.plan] || 0}
          </p>
        </div>

        {/* ACTION BUTTONS - Based on Status */}
        <div className="flex items-center gap-3">
          {project?.status === 'PREVIEW_READY' && !project?.paid && (
            <>
              <button
                onClick={() => setShowRevisionModal(true)}
                className="px-5 py-2.5 border border-neutral-200 text-neutral-700 font-body text-sm font-medium rounded-full hover:bg-neutral-50 transition-colors"
              >
                Request Changes
              </button>
              <button
                onClick={approveAndPay}
                className="px-5 py-2.5 bg-emerald-600 text-white font-body text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors"
              >
                Approve & Pay ${planPrices[project?.plan] || 0}
              </button>
            </>
          )}

          {project?.status === 'PAID' && !project?.setup_completed && (
            <Link
              href={`/portal/project/${projectId}/setup`}
              className="px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors flex items-center gap-2"
            >
              Complete Setup
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}

          <Link
            href={`/portal/messages?project=${projectId}`}
            className="px-5 py-2.5 border border-neutral-200 text-neutral-700 font-body text-sm font-medium rounded-full hover:bg-neutral-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Message
          </Link>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-body text-sm font-medium text-black">Project Progress</span>
          <span className="font-body text-sm text-neutral-500">{status.progress}%</span>
        </div>
        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black rounded-full transition-all duration-500"
            style={{ width: `${status.progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {['Queued', 'Preview', 'Paid', 'Building', 'Delivered'].map((step, idx) => (
            <span key={step} className={`font-body text-xs ${status.progress >= (idx + 1) * 20 ? 'text-black' : 'text-neutral-400'}`}>
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* STATUS: QUEUED */}
      {/* ============================================ */}
      {project?.status === 'QUEUED' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⏳</span>
          </div>
          <h2 className="font-display text-2xl font-medium text-amber-900 mb-2">You're in the Queue!</h2>
          <p className="font-body text-amber-700 mb-4 max-w-md mx-auto">
            Our designers will start working on your preview soon. You'll receive an email when it's ready.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full">
            <span className="font-body text-sm text-amber-800">Estimated time:</span>
            <span className="font-body text-sm font-medium text-amber-900">24-48 hours</span>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* STATUS: IN_PROGRESS */}
      {/* ============================================ */}
      {project?.status === 'IN_PROGRESS' && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎨</span>
          </div>
          <h2 className="font-display text-2xl font-medium text-blue-900 mb-2">We're Creating Your Preview!</h2>
          <p className="font-body text-blue-700 mb-4 max-w-md mx-auto">
            Our designers are working on your website. You'll be notified when the preview is ready for review.
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* STATUS: PREVIEW_READY */}
      {/* ============================================ */}
      {project?.status === 'PREVIEW_READY' && !project?.paid && (
        <div className="space-y-6">
          {/* Preview Banner */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👁️</span>
                </div>
                <div>
                  <h3 className="font-body font-semibold text-purple-900">Your Preview is Ready!</h3>
                  <p className="font-body text-sm text-purple-700">Review your website and let us know what you think.</p>
                </div>
              </div>
              {project?.preview_url && (
                <a
                  href={project.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-purple-600 text-white font-body text-sm font-medium rounded-full hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  Open Preview
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Preview iframe */}
          {project?.preview_url && (
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <div className="bg-neutral-100 px-4 py-3 flex items-center gap-2 border-b border-neutral-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 ml-3">
                  <div className="px-3 py-1 bg-white rounded-md font-body text-xs text-neutral-500 truncate max-w-md">
                    {project.preview_url}
                  </div>
                </div>
              </div>
              <iframe
                src={project.preview_url}
                className="w-full h-[600px] border-0"
                title="Website Preview"
              />
            </div>
          )}

          {/* Action Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-body font-semibold text-black mb-2">Love it? Approve & Pay</h3>
              <p className="font-body text-sm text-neutral-500 mb-4">
                Happy with the preview? Approve it and complete payment to move forward.
              </p>
              <button
                onClick={approveAndPay}
                className="w-full px-4 py-3 bg-emerald-600 text-white font-body text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Approve & Pay ${planPrices[project?.plan] || 0}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-body font-semibold text-black mb-2">Need Changes?</h3>
              <p className="font-body text-sm text-neutral-500 mb-4">
                Not quite right? Request revisions and we'll make adjustments.
              </p>
              <button
                onClick={() => setShowRevisionModal(true)}
                className="w-full px-4 py-3 border border-neutral-200 text-neutral-700 font-body text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Request Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* STATUS: PAID (Setup Required) */}
      {/* ============================================ */}
      {project?.status === 'PAID' && !project?.setup_completed && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="font-display text-2xl font-medium text-emerald-900 mb-2">Payment Received!</h2>
          <p className="font-body text-emerald-700 mb-6 max-w-md mx-auto">
            Thank you! Now let's collect the content for your website - logo, images, and information.
          </p>
          <Link
            href={`/portal/project/${projectId}/setup`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-body font-medium rounded-full hover:bg-emerald-700 transition-colors"
          >
            Complete Website Setup
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

      {/* ============================================ */}
      {/* STATUS: BUILDING */}
      {/* ============================================ */}
      {(project?.status === 'BUILDING' || (project?.status === 'PAID' && project?.setup_completed)) && (
        <div className="space-y-6">
          {/* Building Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔨</span>
            </div>
            <h2 className="font-display text-2xl font-medium text-blue-900 mb-2">Building Your Website!</h2>
            <p className="font-body text-blue-700 mb-4 max-w-md mx-auto">
              Our team is hard at work building your website. You'll receive an email when it's ready for delivery.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full">
              <span className="font-body text-sm text-blue-800">Estimated delivery:</span>
              <span className="font-body text-sm font-medium text-blue-900">3-5 business days</span>
            </div>
          </div>

          {/* Submitted Content Summary */}
          {project?.setup_data && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h3 className="font-body font-semibold text-black mb-4">Submitted Content</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <span className="text-xl">🔗</span>
                  <div>
                    <p className="font-body text-sm font-medium text-black">Platform</p>
                    <p className="font-body text-xs text-neutral-500">{project.platform || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <span className="text-xl">🖼️</span>
                  <div>
                    <p className="font-body text-sm font-medium text-black">Logo</p>
                    <p className="font-body text-xs text-neutral-500">{project.logo_url ? 'Uploaded' : 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <span className="text-xl">📸</span>
                  <div>
                    <p className="font-body text-sm font-medium text-black">Images</p>
                    <p className="font-body text-xs text-neutral-500">{project.images?.length || 0} uploaded</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <span className="text-xl">📝</span>
                  <div>
                    <p className="font-body text-sm font-medium text-black">Content</p>
                    <p className="font-body text-xs text-neutral-500">Submitted</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* STATUS: DELIVERED */}
      {/* ============================================ */}
      {project?.status === 'DELIVERED' && (
        <div className="space-y-6">
          {/* Delivery Banner */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="font-display text-2xl font-medium mb-2">Your Website is Live!</h2>
            <p className="font-body text-white/80 mb-6 max-w-md mx-auto">
              Congratulations! Your website has been delivered and is ready to use.
            </p>
            {project?.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-body font-medium rounded-full hover:bg-white/90 transition-colors"
              >
                Visit Your Website
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="font-body font-semibold text-black mb-2">Download Files</h3>
              <p className="font-body text-xs text-neutral-500 mb-3">Get all your website files</p>
              <button className="w-full px-4 py-2 border border-neutral-200 text-neutral-700 font-body text-sm rounded-lg hover:bg-neutral-50 transition-colors">
                Download ZIP
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-body font-semibold text-black mb-2">Need Changes?</h3>
              <p className="font-body text-xs text-neutral-500 mb-3">Request minor updates</p>
              <Link
                href={`/portal/messages?project=${projectId}`}
                className="block w-full px-4 py-2 border border-neutral-200 text-neutral-700 font-body text-sm rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-body font-semibold text-black mb-2">Add-ons</h3>
              <p className="font-body text-xs text-neutral-500 mb-3">Enhance your website</p>
              <Link
                href="/portal/addons"
                className="block w-full px-4 py-2 border border-neutral-200 text-neutral-700 font-body text-sm rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Browse Add-ons
              </Link>
            </div>
          </div>

          {/* Website Details */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-body font-semibold text-black mb-4">Website Details</h3>
            <div className="space-y-3">
              {project?.live_url && (
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🌐</span>
                    <span className="font-body text-sm text-neutral-600">Live URL</span>
                  </div>
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-black font-medium hover:underline">
                    {project.live_url}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📅</span>
                  <span className="font-body text-sm text-neutral-600">Delivered On</span>
                </div>
                <span className="font-body text-sm text-black font-medium">
                  {new Date(project?.updated_at || project?.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔗</span>
                  <span className="font-body text-sm text-neutral-600">Platform</span>
                </div>
                <span className="font-body text-sm text-black font-medium capitalize">
                  {project?.platform || 'Custom'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* RECENT MESSAGES */}
      {/* ============================================ */}
      {messages.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-body font-semibold text-black">Recent Messages</h3>
            <Link href={`/portal/messages?project=${projectId}`} className="font-body text-sm text-neutral-500 hover:text-black">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {messages.slice(0, 3).map(msg => (
              <div key={msg.id} className="p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`font-body text-xs font-medium ${msg.sender_type === 'admin' ? 'text-blue-600' : 'text-neutral-500'}`}>
                      {msg.sender_type === 'admin' ? 'VektorLabs' : 'You'}
                    </span>
                    <p className="font-body text-sm text-black mt-1 line-clamp-2">{msg.content}</p>
                  </div>
                  <span className="font-body text-xs text-neutral-400 whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* REVISION MODAL */}
      {/* ============================================ */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h2 className="font-display text-2xl font-medium text-black mb-2">Request Changes</h2>
            <p className="font-body text-neutral-500 mb-6">
              Tell us what you'd like us to change or improve.
            </p>
            
            <textarea
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="Describe the changes you'd like..."
              rows={5}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black resize-none mb-6"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-5 py-2.5 text-neutral-600 font-body text-sm font-medium hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={requestRevision}
                disabled={!revisionNotes.trim() || submitting}
                className="px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
