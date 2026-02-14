// ═══════════════════════════════════════════════════════════════
// LEAD WORKFLOW PANEL
// ═══════════════════════════════════════════════════════════════
// Add this to your project detail page (app/admin/(protected)/projects/[id]/page.tsx)
// This replaces/extends the top section when the project source is 'landing_page'
//
// Usage: <LeadWorkflowPanel project={project} onUpdate={reloadProject} />
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Project = {
  id: string;
  business_name: string;
  industry: string;
  website_type: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  plan: string;
  paid: boolean;
  generated_html: string | null;
  preview_url: string | null;
  created_at: string;
  metadata?: Record<string, any>;
  customer_id?: string;
};

const STATUS_FLOW = [
  { key: 'pending', label: 'New Lead', icon: '📩', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'claimed', label: 'Claimed', icon: '👋', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'generating', label: 'Generating', icon: '⚡', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'preview', label: 'Preview Ready', icon: '👁️', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { key: 'sent', label: 'Link Sent', icon: '📱', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { key: 'paid', label: 'Paid', icon: '💰', color: 'bg-green-50 text-green-700 border-green-200' },
  { key: 'delivered', label: 'Delivered', icon: '✅', color: 'bg-neutral-50 text-neutral-700 border-neutral-200' },
];

export function LeadWorkflowPanel({
  project,
  onUpdate,
}: {
  project: Project;
  onUpdate: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(project.preview_url || '');
  const [showSmsComposer, setShowSmsComposer] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');

  const currentStepIndex = STATUS_FLOW.findIndex(s => s.key === project.status);

  // ── Update project status ──
  const updateStatus = async (status: string) => {
    setUpdating(true);
    await supabase.from('projects').update({ status }).eq('id', project.id);
    setUpdating(false);
    onUpdate();
  };

  // ── Save preview URL ──
  const savePreviewUrl = async () => {
    if (!previewUrl.trim()) return;
    setUpdating(true);
    await supabase
      .from('projects')
      .update({ preview_url: previewUrl.trim(), status: 'preview' })
      .eq('id', project.id);
    setUpdating(false);
    onUpdate();
  };

  // ── Generate default SMS ──
  const getDefaultSms = () => {
    const url = previewUrl || `https://www.vektorlabs.ai/preview/${project.id}`;
    return `Hey ${project.business_name}! 👋 Your custom ${project.website_type.toLowerCase()} is ready. Here's your preview: ${url} — Let us know what you think!`;
  };

  // ── Open SMS app with pre-filled message ──
  const openSms = () => {
    const msg = smsMessage || getDefaultSms();
    const encoded = encodeURIComponent(msg);
    window.open(`sms:${project.phone}?body=${encoded}`, '_blank');
    // Mark as sent
    updateStatus('sent');
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });

  return (
    <div className="space-y-6">
      {/* ── Source Badge ── */}
      {project.source === 'landing_page' && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-sm font-medium text-emerald-700">Landing Page Lead</span>
          <span className="text-xs text-emerald-500 ml-auto">{formatDate(project.created_at)}</span>
        </div>
      )}

      {/* ── Status Timeline ── */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Workflow</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {STATUS_FLOW.map((step, i) => {
            const isActive = step.key === project.status;
            const isDone = i < currentStepIndex;
            return (
              <div key={step.key} className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => updateStatus(step.key)}
                  disabled={updating}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                    isActive
                      ? step.color + ' border shadow-sm'
                      : isDone
                      ? 'bg-neutral-50 text-neutral-500 border-neutral-100'
                      : 'bg-white text-neutral-300 border-neutral-100 hover:border-neutral-300 hover:text-neutral-500'
                  }`}
                >
                  <span>{isDone ? '✓' : step.icon}</span>
                  {step.label}
                </button>
                {i < STATUS_FLOW.length - 1 && (
                  <svg className="w-4 h-4 text-neutral-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Lead Info Card ── */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Lead Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-neutral-400 font-medium">Business Name</label>
            <p className="text-sm font-semibold text-black mt-0.5">{project.business_name}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-400 font-medium">Industry</label>
            <p className="text-sm font-medium text-black mt-0.5">{project.industry}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-400 font-medium">Website Type</label>
            <p className="text-sm font-medium text-black mt-0.5">{project.website_type}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-400 font-medium">Submitted</label>
            <p className="text-sm font-medium text-black mt-0.5">{formatDate(project.created_at)}</p>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-neutral-100">
          <a
            href={`sms:${project.phone}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Text {project.phone}
          </a>
          <a
            href={`mailto:${project.email}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Email
          </a>
          <a
            href={`tel:${project.phone}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call
          </a>
        </div>
      </div>

      {/* ── Action Cards (contextual based on status) ── */}

      {/* STEP 1: Claim the lead */}
      {project.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h3 className="font-semibold text-black mb-2">New lead waiting</h3>
          <p className="text-sm text-neutral-600 mb-4">
            {project.business_name} submitted a {project.website_type.toLowerCase()} request for the {project.industry} industry. Claim this lead to start building.
          </p>
          <button
            onClick={() => updateStatus('claimed')}
            disabled={updating}
            className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-black/20 transition-all disabled:opacity-50"
          >
            {updating ? 'Claiming...' : 'Claim This Lead'}
          </button>
        </div>
      )}

      {/* STEP 2: Generate the website */}
      {(project.status === 'claimed' || project.status === 'generating') && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-black mb-2">Build the website</h3>
          <p className="text-sm text-neutral-600 mb-4">
            Use the AI generator or build manually. When ready, paste the preview URL below.
          </p>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => {
                updateStatus('generating');
                // Trigger your existing AI generation
                window.location.href = `/admin/projects/${project.id}#generate`;
              }}
              className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
            >
              ⚡ Generate with AI
            </button>
            <button
              onClick={() => updateStatus('generating')}
              className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-sm font-medium hover:border-black transition-all"
            >
              Build Manually
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview URL + Send link */}
      {['generating', 'preview', 'claimed'].includes(project.status) && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Preview Link</h3>
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="https://www.vektorlabs.ai/preview/..."
              value={previewUrl}
              onChange={e => setPreviewUrl(e.target.value)}
              className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-black transition-colors"
            />
            <button
              onClick={savePreviewUrl}
              disabled={updating || !previewUrl.trim()}
              className="px-5 py-3 bg-black text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Send preview via SMS */}
      {['preview', 'sent'].includes(project.status) && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-black">
              {project.status === 'sent' ? '✅ Preview link sent' : 'Send preview to client'}
            </h3>
            {project.status === 'sent' && (
              <span className="text-xs text-emerald-600 font-medium">Sent — waiting for response</span>
            )}
          </div>

          {!showSmsComposer ? (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSmsMessage(getDefaultSms());
                  setShowSmsComposer(true);
                }}
                className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                {project.status === 'sent' ? 'Send Again' : 'Text Preview Link'}
              </button>
              {previewUrl && (
                <button
                  onClick={() => { navigator.clipboard.writeText(previewUrl); }}
                  className="px-4 py-2.5 bg-white border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
                >
                  Copy Link
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>To:</span>
                <span className="font-medium text-black">{project.phone}</span>
              </div>
              <textarea
                value={smsMessage}
                onChange={e => setSmsMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-black resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={openSms}
                  className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
                >
                  Open in Messages →
                </button>
                <button
                  onClick={() => setShowSmsComposer(false)}
                  className="px-4 py-2.5 text-neutral-500 text-sm hover:text-black transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
