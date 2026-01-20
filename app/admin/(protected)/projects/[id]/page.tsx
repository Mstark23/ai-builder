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
  plan: string | null;
  paid: boolean;
  notes: string | null;
  generated_html: string | null;
  created_at: string;
  email: string | null;
  customer_id: string | null;
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

const STATUS_OPTIONS = [
  { value: 'QUEUED', label: 'Queued', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'PREVIEW_READY', label: 'Preview Ready', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'REVISION_REQUESTED', label: 'Revision Requested', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'PAID', label: 'Paid', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'GENERATING', label: 'Generating', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
];

const PLAN_OPTIONS = [
  { value: 'starter', label: 'Starter', price: 299 },
  { value: 'professional', label: 'Professional', price: 599 },
  { value: 'enterprise', label: 'Enterprise', price: 999 },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'preview' | 'messages'>('details');
  const [newMessage, setNewMessage] = useState('');

  // Form state
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
      // First update status to GENERATING
      await supabase.from('projects').update({ status: 'GENERATING' }).eq('id', projectId);

      // Call the generate API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      if (response.ok) {
        loadProject();
      } else {
        console.error('Generation failed');
      }
    } catch (err) {
      console.error('Error generating website:', err);
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
      hour: 'numeric',
      minute: '2-digit',
    });
  };

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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-black mb-2">Project Not Found</h1>
          <Link href="/admin/projects" className="font-body text-blue-600 hover:underline">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);
  const planConfig = getPlanConfig(project.plan || '');

  return (
    <div className="p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 font-body text-neutral-500 hover:text-black transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Projects</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-body font-bold">
              {project.business_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="font-display text-3xl font-medium text-black">{project.business_name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-body font-medium border ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                {project.paid ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-body font-medium border border-emerald-200">
                    ✓ Paid
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-body font-medium border border-amber-200">
                    Unpaid
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={saveProject}
              disabled={saving}
              className="px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 border-b border-neutral-200 mb-6">
        {[
          { key: 'details', label: 'Details' },
          { key: 'preview', label: 'Preview' },
          { key: 'messages', label: `Messages (${messages.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-3 font-body text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-black text-black'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'details' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* MAIN FORM */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-body font-semibold text-black mb-6">Project Information</h2>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black transition-colors"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-black mb-2">Plan</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black transition-colors"
                  >
                    {PLAN_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label} (${opt.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-body text-sm font-medium text-black mb-2">Internal Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  placeholder="Add internal notes about this project..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm resize-none focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="paid"
                  checked={formData.paid}
                  onChange={(e) => setFormData({ ...formData, paid: e.target.checked })}
                  className="w-5 h-5 rounded border-neutral-300 text-black focus:ring-black"
                />
                <label htmlFor="paid" className="font-body text-sm text-black">Mark as Paid</label>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-body font-semibold text-black mb-6">Project Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="font-body text-xs text-neutral-500 mb-1">Industry</p>
                  <p className="font-body text-sm font-medium text-black">{project.industry || 'Not specified'}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="font-body text-xs text-neutral-500 mb-1">Style</p>
                  <p className="font-body text-sm font-medium text-black">{project.style || 'Not specified'}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="font-body text-xs text-neutral-500 mb-1">Created</p>
                  <p className="font-body text-sm font-medium text-black">{formatDate(project.created_at)}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="font-body text-xs text-neutral-500 mb-1">Price</p>
                  <p className="font-body text-sm font-medium text-black">${planConfig.price}</p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-body font-semibold text-black mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={generateWebsite}
                  disabled={generating || project.status !== 'GENERATING'}
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
                      Generate Website
                    </>
                  )}
                </button>
                {project.generated_html && (
                  <a
                    href={`/preview/${project.id}`}
                    target="_blank"
                    className="px-5 py-2.5 bg-emerald-600 text-white font-body text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Live Preview
                  </a>
                )}
                <Link
                  href={`/admin/messages?project=${project.id}`}
                  className="px-5 py-2.5 border border-neutral-200 text-neutral-700 font-body text-sm font-medium rounded-full hover:bg-neutral-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Message Customer
                </Link>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* Customer Info */}
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

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 text-white">
              <h2 className="font-body font-semibold mb-4">Project Value</h2>
              <div className="text-4xl font-display font-semibold mb-2">${planConfig.price}</div>
              <p className="font-body text-sm text-white/60">{planConfig.label} Plan</p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-white/60">Payment Status</span>
                  <span className={`font-body text-sm font-medium ${project.paid ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {project.paid ? '✓ Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                onClick={() => { setFormData({ ...formData, status: 'GENERATING' }); saveProject(); }}
                className="px-5 py-2.5 bg-purple-600 text-white font-body text-sm font-medium rounded-full hover:bg-purple-700 transition-colors"
              >
                Start Generation
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="font-body text-neutral-500">No messages yet</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md px-4 py-3 rounded-2xl ${
                    msg.sender_type === 'admin'
                      ? 'bg-black text-white rounded-br-sm'
                      : 'bg-neutral-100 text-black rounded-bl-sm'
                  }`}>
                    <p className="font-body text-sm">{msg.content}</p>
                    <p className={`font-body text-xs mt-1 ${msg.sender_type === 'admin' ? 'text-white/60' : 'text-neutral-400'}`}>
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
