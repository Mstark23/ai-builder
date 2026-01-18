'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Project = {
  id: string;
  business_name: string;
  industry: string;
  style: string;
  plan: string;
  description: string;
  status: string;
  paid: boolean;
  generated_html: string | null;
  preview_url: string | null;
  feedback_notes: string | null;
  revision_count: number;
  created_at: string;
  customer_id: string;
};

export default function CustomerProjectDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = params.id as string;
  const paymentStatus = searchParams.get('payment');

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [processingPayment, setProcessingPayment] = useState(false);

  const MAX_FREE_REVISIONS = 2;

  useEffect(() => {
    checkAuth();
  }, []);

  // Handle payment status from URL
  useEffect(() => {
    if (paymentStatus === 'success') {
      setMessage({ type: 'success', text: '🎉 Payment successful! Your website is now ready.' });
      // Reload project to get updated paid status
      setTimeout(() => checkAuth(), 1000);
    } else if (paymentStatus === 'cancelled') {
      setMessage({ type: 'error', text: 'Payment was cancelled. You can try again anytime.' });
    }
  }, [paymentStatus]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    await loadProject(user.id);
  };

  const loadProject = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('customer_id', userId)
        .single();

      if (error || !data) {
        console.error('Project load error:', error);
        router.push('/portal');
        return;
      }

      console.log('Project loaded:', data); // Debug log
      console.log('Generated HTML exists:', !!data.generated_html); // Debug log
      
      setProject(data);
    } catch (err) {
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!project || !revisionNotes.trim()) return;

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          feedback_notes: revisionNotes,
          status: 'REVISION_REQUESTED',
          revision_count: (project.revision_count || 0) + 1,
        })
        .eq('id', project.id);

      if (error) throw error;

      setProject({
        ...project,
        feedback_notes: revisionNotes,
        status: 'REVISION_REQUESTED',
        revision_count: (project.revision_count || 0) + 1,
      });

      setShowRevisionModal(false);
      setRevisionNotes('');
      setMessage({ type: 'success', text: 'Revision request submitted! We\'ll update your preview soon.' });

    } catch (err) {
      console.error('Error submitting revision:', err);
      setMessage({ type: 'error', text: 'Failed to submit revision request' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!project) return;

    setProcessingPayment(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          plan: project.plan,
          businessName: project.business_name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (err: any) {
      console.error('Payment error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to process payment' });
      setProcessingPayment(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string; icon: string }> = {
      QUEUED: { label: 'In Queue', color: 'text-amber-700', bg: 'bg-amber-100', icon: '⏳' },
      IN_PROGRESS: { label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-100', icon: '🎨' },
      PREVIEW_READY: { label: 'Preview Ready', color: 'text-purple-700', bg: 'bg-purple-100', icon: '👁️' },
      REVISION_REQUESTED: { label: 'Revision in Progress', color: 'text-orange-700', bg: 'bg-orange-100', icon: '✏️' },
      PAID: { label: 'Paid', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '✓' },
      DELIVERED: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '🚀' },
    };
    return configs[status] || { label: status, color: 'text-neutral-700', bg: 'bg-neutral-100', icon: '📋' };
  };

  const getPlanPrice = (plan: string) => {
    const prices: Record<string, number> = {
      starter: 299, landing: 299,
      professional: 599, service: 599,
      premium: 799,
      enterprise: 999, ecommerce: 999,
    };
    return prices[plan] || 0;
  };

  const getProgressPercent = (status: string) => {
    const progress: Record<string, number> = {
      QUEUED: 20,
      IN_PROGRESS: 40,
      PREVIEW_READY: 60,
      REVISION_REQUESTED: 50,
      PAID: 80,
      DELIVERED: 100,
    };
    return progress[status] || 0;
  };

  // Add watermark to HTML
  const getWatermarkedHtml = (html: string) => {
    if (!html) return '';
    
    const watermarkStyles = `
      <style>
        .verktor-watermark {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            rgba(0,0,0,0.02) 100px,
            rgba(0,0,0,0.02) 200px
          );
        }
        .verktor-watermark-text {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-family: Arial, sans-serif;
          font-size: 48px;
          font-weight: bold;
          color: rgba(0,0,0,0.08);
          white-space: nowrap;
          pointer-events: none;
          z-index: 99998;
        }
        .verktor-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
          color: white;
          padding: 12px 20px;
          text-align: center;
          font-family: Arial, sans-serif;
          font-size: 14px;
          z-index: 100000;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
        }
      </style>
      <div class="verktor-watermark"></div>
      <div class="verktor-watermark-text">PREVIEW</div>
      <div class="verktor-banner">
        🔒 This is a preview. Pay to remove watermark and get your website.
      </div>
    `;

    // Insert before closing body tag
    if (html.includes('</body>')) {
      return html.replace('</body>', `${watermarkStyles}</body>`);
    }
    return html + watermarkStyles;
  };

  // Payment Success Screen
  if (paymentStatus === 'success' && project?.paid) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
          .font-display { font-family: 'Playfair Display', Georgia, serif; }
          .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        `}</style>

        <div className="max-w-lg w-full bg-white rounded-3xl border border-neutral-200 p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="font-display text-3xl font-medium text-black mb-3">
            Payment Successful! 🎉
          </h1>
          
          <p className="font-body text-neutral-500 mb-6">
            Your website is now ready without watermarks!
          </p>

          <div className="space-y-3">
            <Link
              href={`/portal/project/${projectId}`}
              className="block w-full py-4 bg-black text-white font-body font-semibold rounded-xl hover:bg-black/80 transition-all"
              onClick={() => window.location.href = `/portal/project/${projectId}`}
            >
              View Your Website
            </Link>
            <Link
              href="/portal"
              className="block w-full py-4 bg-neutral-100 text-black font-body font-medium rounded-xl hover:bg-neutral-200 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <p className="font-body text-neutral-500">Project not found</p>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);
  const canRequestRevision = !project.paid && (project.revision_count || 0) < MAX_FREE_REVISIONS;
  const hasPreview = !!(project.generated_html || project.preview_url);
  const showPayButton = hasPreview && !project.paid && project.status !== 'REVISION_REQUESTED';

  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/portal" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
                <span className="text-white font-display text-lg font-semibold">V</span>
              </div>
              <span className="font-body text-black font-semibold tracking-wide hidden sm:block">VERKTORLABS</span>
            </Link>

            <Link href="/portal" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* MESSAGE */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`font-body text-sm ${message.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>
              {message.text}
            </p>
          </div>
        )}

        {/* PROJECT HEADER */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-display text-xl font-semibold">
                  {project.business_name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="font-display text-2xl font-medium text-black">{project.business_name}</h1>
                <p className="font-body text-sm text-neutral-500">
                  {project.plan?.charAt(0).toUpperCase() + project.plan?.slice(1)} Plan · ${getPlanPrice(project.plan)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full font-body text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                {statusConfig.icon} {statusConfig.label}
              </span>
              {project.paid && (
                <span className="px-4 py-2 rounded-full font-body text-sm font-medium bg-emerald-100 text-emerald-700">
                  ✓ Paid
                </span>
              )}
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm text-neutral-500">Progress</span>
              <span className="font-body text-sm font-medium text-black">{getProgressPercent(project.status)}%</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercent(project.status)}%` }}
              />
            </div>
          </div>
        </div>

        {/* DEBUG INFO - Remove in production */}
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs font-mono">
          <p>Debug: hasPreview = {hasPreview ? 'true' : 'false'}</p>
          <p>Debug: generated_html = {project.generated_html ? `${project.generated_html.length} chars` : 'null'}</p>
          <p>Debug: preview_url = {project.preview_url || 'null'}</p>
          <p>Debug: paid = {project.paid ? 'true' : 'false'}</p>
          <p>Debug: showPayButton = {showPayButton ? 'true' : 'false'}</p>
        </div>

        {/* PREVIEW OR STATUS */}
        {hasPreview ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* PREVIEW */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                <div className="bg-neutral-100 px-4 py-3 flex items-center justify-between border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="ml-4 font-body text-sm text-neutral-500">Preview</span>
                  </div>
                  {!project.paid && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 font-body text-xs font-medium rounded-full">
                      🔒 Watermarked
                    </span>
                  )}
                  {project.paid && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-body text-xs font-medium rounded-full">
                      ✓ Full Access
                    </span>
                  )}
                </div>
                
                {project.generated_html ? (
                  <iframe
                    srcDoc={project.paid ? project.generated_html : getWatermarkedHtml(project.generated_html)}
                    className="w-full h-[500px] border-0"
                    title="Website Preview"
                  />
                ) : project.preview_url ? (
                  <iframe
                    src={project.preview_url}
                    className="w-full h-[500px] border-0"
                    title="Website Preview"
                  />
                ) : null}
              </div>
            </div>

            {/* ACTIONS SIDEBAR */}
            <div className="space-y-4">
              {/* PAYMENT CARD */}
              {showPayButton && (
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <h2 className="font-display text-xl font-medium mb-2">Love your preview?</h2>
                  <p className="font-body text-white/80 text-sm mb-4">
                    Pay now to remove the watermark and get your website delivered.
                  </p>
                  <div className="bg-white/20 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-white/80">Total</span>
                      <span className="font-display text-3xl font-semibold">${getPlanPrice(project.plan)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={processingPayment}
                    className="w-full py-4 bg-white text-emerald-600 font-body font-semibold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingPayment ? (
                      <>
                        <div className="w-5 h-5 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay & Get Website</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>
                  <p className="font-body text-xs text-white/60 text-center mt-3">
                    🔒 Secure payment via Stripe
                  </p>
                </div>
              )}

              {/* PAID SUCCESS */}
              {project.paid && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-display text-xl font-medium text-emerald-900 text-center mb-2">Payment Complete!</h2>
                  <p className="font-body text-sm text-emerald-700 text-center mb-4">
                    Your website is ready. No watermarks!
                  </p>
                </div>
              )}

              {/* REVISION REQUEST */}
              {!project.paid && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <h2 className="font-display text-lg font-medium text-black mb-2">Need Changes?</h2>
                  <p className="font-body text-sm text-neutral-500 mb-4">
                    {canRequestRevision 
                      ? `You have ${MAX_FREE_REVISIONS - (project.revision_count || 0)} free revision(s) remaining.`
                      : 'You have used all free revisions.'
                    }
                  </p>
                  
                  {project.status === 'REVISION_REQUESTED' ? (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <p className="font-body text-sm text-orange-700">
                        ✏️ Your revision request is being processed!
                      </p>
                    </div>
                  ) : canRequestRevision ? (
                    <button
                      onClick={() => setShowRevisionModal(true)}
                      className="w-full py-3 bg-neutral-100 text-black font-body font-medium rounded-xl hover:bg-neutral-200 transition-colors"
                    >
                      Request Revision
                    </button>
                  ) : null}
                </div>
              )}

              {/* PROJECT INFO */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="font-display text-lg font-medium text-black mb-4">Project Details</h2>
                <div className="space-y-3">
                  <div>
                    <label className="font-body text-xs text-neutral-500">Industry</label>
                    <p className="font-body text-sm text-black">{project.industry}</p>
                  </div>
                  <div>
                    <label className="font-body text-xs text-neutral-500">Style</label>
                    <p className="font-body text-sm text-black">{project.style}</p>
                  </div>
                  <div>
                    <label className="font-body text-xs text-neutral-500">Created</label>
                    <p className="font-body text-sm text-black">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* NO PREVIEW YET */
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">{statusConfig.icon}</span>
            </div>
            <h2 className="font-display text-2xl font-medium text-black mb-3">
              {project.status === 'QUEUED' && 'Your Project is in Queue'}
              {project.status === 'IN_PROGRESS' && 'We\'re Building Your Website'}
              {project.status === 'PREVIEW_READY' && 'Preview Coming Soon'}
              {project.status === 'REVISION_REQUESTED' && 'Working on Your Revisions'}
            </h2>
            <p className="font-body text-neutral-500 max-w-md mx-auto mb-6">
              {project.status === 'QUEUED' && 'Our team will start working on your website soon.'}
              {project.status === 'IN_PROGRESS' && 'Our designers are crafting your perfect website.'}
              {project.status === 'PREVIEW_READY' && 'Your preview is almost ready!'}
              {project.status === 'REVISION_REQUESTED' && 'We\'re applying your requested changes.'}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-body text-sm text-neutral-600">In Progress</span>
            </div>
          </div>
        )}
      </main>

      {/* REVISION MODAL */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <h2 className="font-display text-xl font-medium text-black mb-2">Request Revision</h2>
            <p className="font-body text-sm text-neutral-500 mb-4">
              Tell us what changes you'd like.
            </p>
            
            <textarea
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="e.g., Change the header color to blue..."
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 resize-none h-32 focus:outline-none focus:border-black"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="flex-1 px-4 py-3 bg-neutral-100 text-neutral-700 font-body font-medium rounded-xl hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestRevision}
                disabled={submitting || !revisionNotes.trim()}
                className="flex-1 px-4 py-3 bg-black text-white font-body font-medium rounded-xl hover:bg-black/80 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}