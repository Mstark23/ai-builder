'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Project = {
  id: string;
  business_name: string;
  industry: string | null;
  style: string | null;
  status: string;
  plan: string;
  paid: boolean;
  notes: string | null;
  generated_html: string | null;
  created_at: string;
};

type Message = {
  id: string;
  content: string;
  sender_type: 'admin' | 'customer';
  created_at: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; progress: number; description: string }> = {
  QUEUED: { label: 'Queued', color: 'bg-amber-100 text-amber-700 border-amber-200', progress: 10, description: 'Your project is in the queue.' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200', progress: 40, description: 'Our team is working on your website.' },
  GENERATING: { label: 'Generating', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', progress: 60, description: 'AI is generating your website.' },
  PREVIEW_READY: { label: 'Preview Ready', color: 'bg-purple-100 text-purple-700 border-purple-200', progress: 80, description: 'Your preview is ready! Review and approve.' },
  REVISION_REQUESTED: { label: 'Revising', color: 'bg-orange-100 text-orange-700 border-orange-200', progress: 70, description: 'Working on your requested changes.' },
  PAID: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', progress: 90, description: 'Payment received! Finalizing delivery.' },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', progress: 100, description: 'Your website has been delivered!' },
};

const PLAN_CONFIG: Record<string, { label: string; price: number; features: string[] }> = {
  starter: { label: 'Starter', price: 299, features: ['Single page website', 'Mobile responsive', '2 revisions'] },
  landing: { label: 'Starter', price: 299, features: ['Single page website', 'Mobile responsive', '2 revisions'] },
  professional: { label: 'Professional', price: 599, features: ['5-7 page website', 'Mobile responsive', 'Contact form', '5 revisions'] },
  service: { label: 'Professional', price: 599, features: ['5-7 page website', 'Mobile responsive', 'Contact form', '5 revisions'] },
  enterprise: { label: 'Enterprise', price: 999, features: ['Full e-commerce', 'Unlimited pages', 'Priority support', 'Unlimited revisions'] },
  ecommerce: { label: 'Enterprise', price: 999, features: ['Full e-commerce', 'Unlimited pages', 'Priority support', 'Unlimited revisions'] },
};

export default function CustomerProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'preview' | 'messages'>('overview');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionRequest, setRevisionRequest] = useState('');

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadMessages();
    }
  }, [projectId]);

  const loadProject = async () => {
    const customerId = localStorage.getItem('customerId');
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (!error && data) {
        // Verify ownership
        if (data.customer_id !== customerId && customerId !== 'demo') {
          router.push('/customer/projects');
          return;
        }
        setProject(data);
        if (data.generated_html && data.status === 'PREVIEW_READY') {
          setActiveTab('preview');
        }
      } else {
        router.push('/customer/projects');
      }
    } catch (err) {
      console.error('Error:', err);
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
      console.error('Error:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);

    try {
      await supabase.from('messages').insert({
        project_id: projectId,
        content: newMessage.trim(),
        sender_type: 'customer',
        read: false,
      });
      setNewMessage('');
      loadMessages();
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setSending(false);
    }
  };

  const requestRevision = async () => {
    if (!revisionRequest.trim()) return;

    try {
      await supabase.from('messages').insert({
        project_id: projectId,
        content: `📝 Revision Request:\n\n${revisionRequest.trim()}`,
        sender_type: 'customer',
        read: false,
      });

      await supabase.from('projects').update({ status: 'REVISION_REQUESTED' }).eq('id', projectId);

      setRevisionRequest('');
      setShowRevisionModal(false);
      loadProject();
      loadMessages();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const approveAndPay = () => {
    // In production, redirect to Stripe
    alert('This would redirect to Stripe payment.');
  };

  const getStatusConfig = (status: string) => STATUS_CONFIG[status] || STATUS_CONFIG.QUEUED;
  const getPlanConfig = (plan: string) => PLAN_CONFIG[plan] || PLAN_CONFIG.starter;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const statusConfig = getStatusConfig(project.status);
  const planConfig = getPlanConfig(project.plan);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <Link href="/customer/projects" className="inline-flex items-center gap-2 font-body text-sm text-neutral-500 hover:text-black transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Projects
      </Link>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-body font-bold text-2xl">
            {project.business_name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="font-display text-3xl font-medium text-black mb-2">{project.business_name}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-body font-medium border ${statusConfig.color}`}>{statusConfig.label}</span>
              <span className="font-body text-sm text-neutral-500">{planConfig.label} Plan</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {project.status === 'PREVIEW_READY' && (
            <>
              <button onClick={() => setShowRevisionModal(true)} className="px-5 py-2.5 border border-neutral-200 text-neutral-700 font-body text-sm font-medium rounded-full hover:bg-neutral-50 transition-colors">
                Request Changes
              </button>
              <button onClick={approveAndPay} className="px-5 py-2.5 bg-emerald-600 text-white font-body text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Approve & Pay ${planConfig.price}
              </button>
            </>
          )}
        </div>
      </div>

      {/* PROGRESS */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-body text-sm font-medium text-black">Project Progress</span>
          <span className="font-body text-sm text-neutral-500">{statusConfig.progress}%</span>
        </div>
        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" style={{ width: `${statusConfig.progress}%` }} />
        </div>
        <p className="font-body text-sm text-neutral-500">{statusConfig.description}</p>
      </div>

      {/* TABS */}
      <div className="flex gap-1 border-b border-neutral-200 mb-6">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'preview', label: 'Preview', disabled: !project.generated_html },
          { key: 'messages', label: `Messages (${messages.length})` },
        ].map((tab) => (
          <button key={tab.key} onClick={() => !tab.disabled && setActiveTab(tab.key as any)} disabled={tab.disabled}
            className={`px-4 py-3 font-body text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-black text-black' : tab.disabled ? 'border-transparent text-neutral-300 cursor-not-allowed' : 'border-transparent text-neutral-500 hover:text-black'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-body font-semibold text-black mb-4">Project Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-xl"><p className="font-body text-xs text-neutral-500 mb-1">Business Name</p><p className="font-body text-sm font-medium text-black">{project.business_name}</p></div>
                <div className="p-4 bg-neutral-50 rounded-xl"><p className="font-body text-xs text-neutral-500 mb-1">Industry</p><p className="font-body text-sm font-medium text-black">{project.industry || 'Not specified'}</p></div>
                <div className="p-4 bg-neutral-50 rounded-xl"><p className="font-body text-xs text-neutral-500 mb-1">Style</p><p className="font-body text-sm font-medium text-black">{project.style || 'Not specified'}</p></div>
                <div className="p-4 bg-neutral-50 rounded-xl"><p className="font-body text-xs text-neutral-500 mb-1">Created</p><p className="font-body text-sm font-medium text-black">{new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-body font-semibold text-black mb-4">Project Timeline</h2>
              <div className="space-y-4">
                {['QUEUED', 'IN_PROGRESS', 'PREVIEW_READY', 'PAID', 'DELIVERED'].map((step, idx) => {
                  const stepConfig = STATUS_CONFIG[step];
                  const isComplete = Object.keys(STATUS_CONFIG).indexOf(project.status) >= Object.keys(STATUS_CONFIG).indexOf(step);
                  const isCurrent = project.status === step;
                  return (
                    <div key={step} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-400'}`}>
                        {isComplete ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <span className="font-body text-xs font-medium">{idx + 1}</span>}
                      </div>
                      <div className="flex-1 pb-4 border-b border-neutral-100 last:border-0">
                        <p className={`font-body text-sm font-medium ${isCurrent ? 'text-black' : isComplete ? 'text-emerald-700' : 'text-neutral-400'}`}>{stepConfig.label}</p>
                        {isCurrent && <p className="font-body text-xs text-neutral-500 mt-1">{stepConfig.description}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="font-body text-sm text-white/60">Your Plan</span>
                <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-body font-medium rounded-full">{planConfig.label}</span>
              </div>
              <div className="text-4xl font-display font-semibold mb-4">${planConfig.price}</div>
              <div className="space-y-2">
                {planConfig.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="font-body text-sm text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-white/60">Payment</span>
                  <span className={`font-body text-sm font-medium ${project.paid ? 'text-emerald-400' : 'text-amber-400'}`}>{project.paid ? '✓ Paid' : 'Pending'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h3 className="font-body font-semibold text-black mb-3">Need Help?</h3>
              <p className="font-body text-sm text-neutral-500 mb-4">Have questions? Send us a message.</p>
              <button onClick={() => setActiveTab('messages')} className="w-full px-4 py-2.5 bg-neutral-100 text-neutral-700 font-body text-sm font-medium rounded-xl hover:bg-neutral-200 transition-colors">
                Send a Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW TAB */}
      {activeTab === 'preview' && project.generated_html && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="font-body font-semibold text-black">Website Preview</h2>
            <a href={`/preview/${project.id}`} target="_blank" className="px-4 py-2 bg-black text-white font-body text-sm font-medium rounded-lg hover:bg-black/80 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              Open Full Screen
            </a>
          </div>
          <div className="aspect-video relative bg-neutral-100">
            <iframe srcDoc={project.generated_html} className="w-full h-full absolute inset-0" title="Website Preview" />
          </div>
          {project.status === 'PREVIEW_READY' && (
            <div className="p-4 bg-purple-50 border-t border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-body text-sm text-purple-700"><strong>Ready to go live?</strong> Approve this preview to proceed.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowRevisionModal(true)} className="px-4 py-2 border border-purple-300 text-purple-700 font-body text-sm font-medium rounded-lg hover:bg-purple-100 transition-colors">Request Changes</button>
                <button onClick={approveAndPay} className="px-4 py-2 bg-emerald-600 text-white font-body text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">Approve & Pay ${planConfig.price}</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  <p className="font-body text-sm text-neutral-500">No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md px-4 py-3 rounded-2xl ${msg.sender_type === 'customer' ? 'bg-black text-white rounded-br-sm' : 'bg-neutral-100 text-black rounded-bl-sm'}`}>
                    <p className="font-body text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className={`font-body text-xs mt-1 ${msg.sender_type === 'customer' ? 'text-white/60' : 'text-neutral-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-neutral-200">
            <div className="flex gap-3">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 px-4 py-3 bg-neutral-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              <button onClick={sendMessage} disabled={!newMessage.trim() || sending} className="px-5 py-3 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80 disabled:opacity-50 transition-colors">
                {sending ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVISION MODAL */}
      {showRevisionModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowRevisionModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl p-6 z-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-medium text-black">Request Changes</h2>
              <button onClick={() => setShowRevisionModal(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="font-body text-sm text-neutral-500 mb-4">Describe the changes you'd like us to make.</p>
            <textarea value={revisionRequest} onChange={(e) => setRevisionRequest(e.target.value)} placeholder="e.g., Please change the hero image..." rows={5} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm resize-none focus:outline-none focus:border-black mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowRevisionModal(false)} className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-600 font-body text-sm font-medium rounded-xl hover:bg-neutral-50">Cancel</button>
              <button onClick={requestRevision} disabled={!revisionRequest.trim()} className="flex-1 px-4 py-3 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80 disabled:opacity-50">Submit Request</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
