// /app/portal/project/[id]/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
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
  status: string;
  plan: string | null;
  paid: boolean;
  created_at: string;
  generated_html: string | null;
  generated_pages: Record<string, string> | null;
  custom_price: number | null;
  metadata: {
    selected_variation?: string;
    variations?: Record<string, string>;
    client_needs?: {
      pages?: string[];
      features?: string[];
      addons?: string[];
      timeline?: string;
      budget?: string;
      notes?: string;
    };
    page_status?: Record<string, string>;
    uploads?: Record<string, any>;
  } | null;
};

type Message = {
  id: string;
  project_id: string;
  content: string;
  sender_type: 'admin' | 'customer';
  created_at: string;
};

// ============================================
// STATUS CONFIGS (new flow)
// ============================================
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string; progress: number }> = {
  pending: { label: 'Pending', color: 'text-neutral-700', bg: 'bg-neutral-100', icon: '⏳', progress: 5 },
  interested: { label: 'Interested', color: 'text-pink-700', bg: 'bg-pink-100', icon: '💗', progress: 15 },
  preview_sent: { label: 'Preview Sent', color: 'text-purple-700', bg: 'bg-purple-100', icon: '👁️', progress: 25 },
  needs_submitted: { label: 'Needs Submitted', color: 'text-amber-700', bg: 'bg-amber-100', icon: '📋', progress: 35 },
  needs_review: { label: 'Under Review', color: 'text-amber-700', bg: 'bg-amber-100', icon: '📋', progress: 35 },
  invoice_sent: { label: 'Invoice Sent', color: 'text-orange-700', bg: 'bg-orange-100', icon: '📨', progress: 45 },
  paid: { label: 'Paid — Building', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '✅', progress: 60 },
  building: { label: 'Building Website', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: '🔨', progress: 75 },
  review: { label: 'Review & Approve', color: 'text-blue-700', bg: 'bg-blue-100', icon: '🔍', progress: 88 },
  client_review: { label: 'Review & Approve', color: 'text-blue-700', bg: 'bg-blue-100', icon: '🔍', progress: 88 },
  published: { label: 'Published!', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '🚀', progress: 100 },
  QUEUED: { label: 'In Queue', color: 'text-amber-700', bg: 'bg-amber-100', icon: '⏳', progress: 10 },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-100', icon: '🎨', progress: 40 },
  PREVIEW_READY: { label: 'Preview Ready', color: 'text-purple-700', bg: 'bg-purple-100', icon: '👁️', progress: 60 },
  PAID: { label: 'Paid', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '✅', progress: 70 },
  DELIVERED: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '🚀', progress: 100 },
};

// ============================================
// UPLOAD CONFIG
// ============================================
const UPLOAD_CARDS = [
  { key: 'logo', label: 'Logo', desc: 'Your company logo (PNG, SVG, or high-res JPG)', icon: '🎨', accept: 'image/*' },
  { key: 'photos', label: 'Photos', desc: 'Business photos, team pics, workspace images', icon: '📸', accept: 'image/*', multiple: true },
  { key: 'about', label: 'About Text', desc: 'Your story, mission statement, company bio', icon: '📝', accept: '.txt,.doc,.docx,.pdf', isText: true },
  { key: 'services', label: 'Services Info', desc: 'List of services with descriptions and pricing', icon: '⚡', accept: '.txt,.doc,.docx,.pdf,.csv', isText: true },
  { key: 'contact', label: 'Contact Info', desc: 'Phone, email, address, business hours', icon: '📞', accept: '.txt,.doc,.docx,.pdf', isText: true },
  { key: 'social', label: 'Social Links', desc: 'Instagram, Facebook, LinkedIn, TikTok URLs', icon: '🔗', accept: '.txt,.doc,.docx,.pdf', isText: true },
  { key: 'testimonials', label: 'Testimonials', desc: 'Customer reviews and quotes you want featured', icon: '💬', accept: '.txt,.doc,.docx,.pdf', isText: true },
  { key: 'other', label: 'Other Files', desc: 'Any other files, brand guidelines, inspiration', icon: '📁', accept: '*', multiple: true },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'review' | 'messages'>('overview');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'done' | 'error'>>({});
  const [textInputs, setTextInputs] = useState<Record<string, string>>({});
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [reviewPage, setReviewPage] = useState<string | null>(null);

  useEffect(() => { loadProject(); loadMessages(); }, [projectId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      let projectData = null;
      try {
        const res = await fetch('/api/project-html', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId }) });
        if (res.ok) { const json = await res.json(); projectData = json.project; }
      } catch (e) { console.error('API fallback:', e); }
      if (!projectData) {
        const { data } = await supabase.from('projects').select('*').eq('id', projectId).single();
        projectData = data;
      }
      if (!projectData) { router.push('/portal'); return; }
      setProject(projectData);
      if (projectData.metadata?.uploads) {
        const statuses: Record<string, 'idle' | 'uploading' | 'done' | 'error'> = {};
        Object.entries(projectData.metadata.uploads).forEach(([key, val]) => { statuses[key] = val ? 'done' : 'idle'; });
        setUploadStatus(statuses);
      }
    } catch (err) { console.error('Error:', err); } finally { setLoading(false); }
  };

  const loadMessages = async () => {
    const { data } = await supabase.from('messages').select('*').eq('project_id', projectId).order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const { data } = await supabase.from('messages').insert({ project_id: projectId, content: newMessage, sender_type: 'customer', read: false }).select().single();
      if (data) setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (err) { console.error('Error:', err); } finally { setSending(false); }
  };

  const handleFileUpload = async (key: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadStatus(prev => ({ ...prev, [key]: 'uploading' }));
    try {
      for (const file of Array.from(files)) {
        const filePath = `${projectId}/${key}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from('client-uploads').upload(filePath, file);
        if (error) throw error;
      }
      const { data: proj } = await supabase.from('projects').select('metadata').eq('id', projectId).single();
      await supabase.from('projects').update({ metadata: { ...(proj?.metadata || {}), uploads: { ...(proj?.metadata as any)?.uploads, [key]: files.length === 1 ? true : files.length } } }).eq('id', projectId);
      setUploadStatus(prev => ({ ...prev, [key]: 'done' }));
    } catch (err) { console.error('Upload error:', err); setUploadStatus(prev => ({ ...prev, [key]: 'error' })); }
  };

  const handleTextSubmit = async (key: string) => {
    const text = textInputs[key];
    if (!text?.trim()) return;
    setUploadStatus(prev => ({ ...prev, [key]: 'uploading' }));
    try {
      const blob = new Blob([text], { type: 'text/plain' });
      const filePath = `${projectId}/${key}/${Date.now()}-${key}.txt`;
      const { error } = await supabase.storage.from('client-uploads').upload(filePath, blob);
      if (error) throw error;
      const { data: proj } = await supabase.from('projects').select('metadata').eq('id', projectId).single();
      await supabase.from('projects').update({ metadata: { ...(proj?.metadata || {}), uploads: { ...(proj?.metadata as any)?.uploads, [key]: true } } }).eq('id', projectId);
      setUploadStatus(prev => ({ ...prev, [key]: 'done' }));
    } catch (err) { console.error('Error:', err); setUploadStatus(prev => ({ ...prev, [key]: 'error' })); }
  };

  const approvePage = async (pageName: string) => {
    const { data: proj } = await supabase.from('projects').select('metadata').eq('id', projectId).single();
    const pageStatus = { ...(proj?.metadata as any)?.page_status, [pageName]: 'approved' };
    await supabase.from('projects').update({ metadata: { ...(proj?.metadata || {}), page_status: pageStatus } }).eq('id', projectId);
    loadProject();
  };

  const requestPageChanges = async (pageName: string, feedback: string) => {
    if (!feedback.trim()) return;
    const { data: proj } = await supabase.from('projects').select('metadata').eq('id', projectId).single();
    const pageStatus = { ...(proj?.metadata as any)?.page_status, [pageName]: 'changes_requested' };
    await supabase.from('projects').update({ metadata: { ...(proj?.metadata || {}), page_status: pageStatus } }).eq('id', projectId);
    await supabase.from('messages').insert({ project_id: projectId, content: `✏️ Changes requested for "${pageName}": ${feedback}`, sender_type: 'customer', read: false });
    loadProject(); loadMessages();
  };

  const getStatus = () => STATUS_CONFIG[project?.status || 'pending'] || STATUS_CONFIG.pending;
  const getProgressSteps = () => {
    const s = project?.status || 'pending';
    return [
      { label: 'Preview', done: ['interested', 'needs_submitted', 'needs_review', 'invoice_sent', 'paid', 'building', 'review', 'client_review', 'published', 'PAID', 'DELIVERED'].includes(s) },
      { label: 'Needs', done: ['needs_submitted', 'needs_review', 'invoice_sent', 'paid', 'building', 'review', 'client_review', 'published', 'PAID', 'DELIVERED'].includes(s) },
      { label: 'Paid', done: ['paid', 'building', 'review', 'client_review', 'published', 'PAID', 'DELIVERED'].includes(s) },
      { label: 'Building', done: ['building', 'review', 'client_review', 'published', 'DELIVERED'].includes(s) },
      { label: 'Review', done: ['review', 'client_review', 'published', 'DELIVERED'].includes(s) },
      { label: 'Live', done: ['published', 'DELIVERED'].includes(s) },
    ];
  };
  const timeAgo = (date: string) => {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return 'Just now'; if (s < 3600) return `${Math.floor(s / 60)}m ago`; if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`;
  };
  const allPagesApproved = () => {
    if (!project?.metadata?.page_status) return false;
    const vals = Object.values(project.metadata.page_status);
    return vals.length > 0 && vals.every(s => s === 'approved');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-neutral-500">Loading project...</p>
      </div>
    </div>
  );
  if (!project) return null;

  const status = getStatus();
  const steps = getProgressSteps();

  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      {/* HEADER */}
      <header className="bg-black text-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/portal" className="flex items-center gap-3 hover:opacity-80 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            <span className="text-sm font-body">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-semibold text-sm">{project.business_name?.charAt(0)}</span>
            </div>
            <span className="text-sm font-body font-medium hidden sm:block">{project.business_name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* PROJECT HEADER */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden mb-6">
          <div className="h-20 bg-gradient-to-r from-black to-neutral-700 relative">
            <div className="absolute bottom-0 translate-y-1/2 left-6">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                <span className="font-display font-bold text-xl text-black">{project.business_name?.charAt(0)}</span>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold font-body ${status.bg} ${status.color}`}>{status.icon} {status.label}</span>
            </div>
          </div>
          <div className="pt-10 pb-6 px-6">
            <h1 className="font-display text-2xl font-semibold text-black">{project.business_name}</h1>
            <p className="font-body text-sm text-neutral-500 mt-1">
              {project.industry && <span className="capitalize">{project.industry} · </span>}
              {project.custom_price ? `$${project.custom_price}` : project.plan ? `${project.plan} Plan` : ''}
            </p>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-neutral-200" />
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-body transition-all ${step.done ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-400'}`}>
                  {step.done ? '✓' : i + 1}
                </div>
                <span className={`text-xs mt-2 font-body ${step.done ? 'text-black font-medium' : 'text-neutral-400'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl w-fit mb-6 overflow-x-auto">
          {(['overview', 'upload', 'review', 'messages'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-lg text-sm font-medium font-body transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'}`}>
              {tab === 'overview' ? 'Overview' : tab === 'upload' ? 'Upload Content' : tab === 'review' ? 'Review Pages' : 'Messages'}
              {tab === 'messages' && messages.length > 0 && <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs rounded-full">{messages.length}</span>}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW ═══ */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="font-display text-xl font-semibold text-black mb-4">Project Status</h2>
                <div className={`p-4 rounded-xl ${status.bg}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{status.icon}</span>
                    <div>
                      <p className={`font-body font-semibold ${status.color}`}>{status.label}</p>
                      <p className="font-body text-sm text-neutral-600 mt-0.5">
                        {project.status === 'paid' || project.status === 'building' ? 'Our team is building your website. We\'ll notify you when pages are ready to review.' :
                         project.status === 'review' || project.status === 'client_review' ? 'Your website pages are ready! Head to the Review Pages tab to approve or request changes.' :
                         project.status === 'published' ? 'Your website is live! 🎉' :
                         project.status === 'invoice_sent' ? 'An invoice has been sent to your email. Once paid, we\'ll start building.' :
                         project.status === 'needs_submitted' ? 'We\'re reviewing your needs and preparing a custom quote.' :
                         'Your project is being processed.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {(project.status === 'paid' || project.status === 'building') && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <h2 className="font-display text-xl font-semibold text-black mb-4">What We Need From You</h2>
                  <div className="space-y-3">
                    {UPLOAD_CARDS.slice(0, 5).map((card) => {
                      const uploaded = uploadStatus[card.key] === 'done';
                      return (
                        <div key={card.key} className={`flex items-center justify-between p-3 rounded-xl border ${uploaded ? 'bg-emerald-50 border-emerald-200' : 'bg-neutral-50 border-neutral-200'}`}>
                          <div className="flex items-center gap-3"><span className="text-lg">{card.icon}</span><span className="font-body text-sm text-black">{card.label}</span></div>
                          <span className={`font-body text-xs font-semibold ${uploaded ? 'text-emerald-600' : 'text-neutral-400'}`}>{uploaded ? '✓ Uploaded' : 'Pending'}</span>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => setActiveTab('upload')} className="w-full mt-4 px-4 py-3 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80 transition-colors">Upload Content →</button>
                </div>
              )}

              {project.metadata?.client_needs && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <h2 className="font-display text-xl font-semibold text-black mb-4">Your Website Includes</h2>
                  {project.metadata.client_needs.pages && project.metadata.client_needs.pages.length > 0 && (
                    <div className="mb-4">
                      <p className="font-body text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-2">Pages ({project.metadata.client_needs.pages.length})</p>
                      <div className="flex flex-wrap gap-2">{project.metadata.client_needs.pages.map((p, i) => <span key={i} className="font-body px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700">{p}</span>)}</div>
                    </div>
                  )}
                  {project.metadata.client_needs.features && project.metadata.client_needs.features.length > 0 && (
                    <div className="mb-4">
                      <p className="font-body text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-2">Features ({project.metadata.client_needs.features.length})</p>
                      <div className="flex flex-wrap gap-2">{project.metadata.client_needs.features.map((f, i) => <span key={i} className="font-body px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-medium text-blue-700">{f}</span>)}</div>
                    </div>
                  )}
                  {project.metadata.client_needs.addons && project.metadata.client_needs.addons.length > 0 && (
                    <div>
                      <p className="font-body text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-2">Add-Ons ({project.metadata.client_needs.addons.length})</p>
                      <div className="flex flex-wrap gap-2">{project.metadata.client_needs.addons.map((a, i) => <span key={i} className="font-body px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700">{a}</span>)}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-body font-semibold text-black mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button onClick={() => setActiveTab('upload')} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm text-left hover:bg-neutral-100 transition-colors flex items-center gap-3"><span>📁</span> Upload Content</button>
                  <button onClick={() => setActiveTab('review')} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm text-left hover:bg-neutral-100 transition-colors flex items-center gap-3"><span>🔍</span> Review Pages</button>
                  <button onClick={() => setActiveTab('messages')} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm text-left hover:bg-neutral-100 transition-colors flex items-center gap-3"><span>💬</span> Send Message</button>
                </div>
              </div>
              {messages.length > 0 && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <h3 className="font-body font-semibold text-black mb-4">Recent Messages</h3>
                  <div className="space-y-3">
                    {messages.slice(-3).map((msg) => (
                      <div key={msg.id} className="p-3 bg-neutral-50 rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-body text-xs font-semibold text-neutral-500">{msg.sender_type === 'admin' ? 'VektorLabs' : 'You'}</span>
                          <span className="font-body text-xs text-neutral-400">{timeAgo(msg.created_at)}</span>
                        </div>
                        <p className="font-body text-sm text-black line-clamp-2">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ UPLOAD CONTENT ═══ */}
        {activeTab === 'upload' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold text-black">Upload Your Content</h2>
              <p className="font-body text-neutral-500 mt-1">Provide the content we need to build your website. Upload files or paste text directly.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {UPLOAD_CARDS.map((card) => {
                const cs = uploadStatus[card.key] || 'idle';
                return (
                  <div key={card.key} className={`bg-white rounded-2xl border p-6 transition-all ${cs === 'done' ? 'border-emerald-300 bg-emerald-50/30' : cs === 'uploading' ? 'border-blue-300' : cs === 'error' ? 'border-red-300' : 'border-neutral-200'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{card.icon}</span>
                        <div><p className="font-body font-semibold text-black">{card.label}</p><p className="font-body text-xs text-neutral-500">{card.desc}</p></div>
                      </div>
                      {cs === 'done' && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold font-body rounded-full">✓ Done</span>}
                    </div>
                    {cs === 'uploading' ? (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl"><div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /><span className="font-body text-sm text-blue-600">Uploading...</span></div>
                    ) : cs === 'done' ? (
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                        <span className="text-emerald-600 font-body text-sm font-medium">✓ Content received</span>
                        <button onClick={() => setUploadStatus(prev => ({ ...prev, [card.key]: 'idle' }))} className="ml-auto text-xs text-neutral-500 hover:text-black font-body">Replace</button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {card.isText && (
                          <div>
                            <textarea placeholder={`Paste your ${card.label.toLowerCase()} here...`} value={textInputs[card.key] || ''} onChange={(e) => setTextInputs(prev => ({ ...prev, [card.key]: e.target.value }))} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm resize-none h-24 focus:outline-none focus:border-black" />
                            {textInputs[card.key] && <button onClick={() => handleTextSubmit(card.key)} className="mt-1 px-3 py-1.5 bg-black text-white font-body text-xs font-medium rounded-lg hover:bg-black/80">Save Text</button>}
                          </div>
                        )}
                        <label className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:border-black hover:bg-neutral-50 transition-colors ${card.isText ? '' : 'h-20'}`}>
                          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                          <span className="font-body text-sm text-neutral-500">{card.isText ? 'Or upload a file' : 'Click to upload'}</span>
                          <input type="file" accept={card.accept} multiple={card.multiple} className="hidden" onChange={(e) => handleFileUpload(card.key, e.target.files)} />
                        </label>
                      </div>
                    )}
                    {cs === 'error' && <p className="font-body text-xs text-red-600 mt-2">Upload failed. Please try again.</p>}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-body font-semibold text-black">Upload Progress</h3>
                <span className="font-body text-sm text-neutral-500">{Object.values(uploadStatus).filter(s => s === 'done').length} / {UPLOAD_CARDS.length} complete</span>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500 rounded-full" style={{ width: `${(Object.values(uploadStatus).filter(s => s === 'done').length / UPLOAD_CARDS.length) * 100}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* ═══ REVIEW PAGES ═══ */}
        {activeTab === 'review' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold text-black">Review Your Website</h2>
              <p className="font-body text-neutral-500 mt-1">Preview each page, then approve or request changes.</p>
            </div>
            {project.generated_pages && Object.keys(project.generated_pages).length > 0 ? (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(project.generated_pages).map(([pageName, html]) => {
                    const ps = project.metadata?.page_status?.[pageName] || 'pending';
                    return (
                      <div key={pageName} className={`bg-white rounded-2xl border overflow-hidden transition-all ${ps === 'approved' ? 'border-emerald-300' : ps === 'changes_requested' ? 'border-orange-300' : 'border-neutral-200'}`}>
                        <div className="h-40 bg-neutral-100 relative overflow-hidden cursor-pointer" onClick={() => setReviewPage(pageName)}>
                          <iframe srcDoc={html as string} className="w-[200%] h-[200%] origin-top-left pointer-events-none" style={{ transform: 'scale(0.5)' }} />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-body font-semibold text-black capitalize">{pageName.replace(/-/g, ' ')}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold font-body ${ps === 'approved' ? 'bg-emerald-100 text-emerald-700' : ps === 'changes_requested' ? 'bg-orange-100 text-orange-700' : ps === 'ready' ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-500'}`}>
                              {ps === 'approved' ? '✓ Approved' : ps === 'changes_requested' ? '✏️ Changes' : ps === 'ready' ? 'Ready' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setReviewPage(pageName)} className="flex-1 px-3 py-2 bg-neutral-100 text-black font-body text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors">Preview</button>
                            {ps !== 'approved' && <button onClick={() => approvePage(pageName)} className="flex-1 px-3 py-2 bg-emerald-600 text-white font-body text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">Approve ✓</button>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {allPagesApproved() && project.status !== 'published' && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="font-display text-xl font-semibold text-emerald-800 mb-2">All Pages Approved! 🎉</h3>
                    <p className="font-body text-sm text-emerald-700 mb-4">Your website is ready to go live.</p>
                    <button className="px-8 py-3 bg-emerald-600 text-white font-body font-semibold rounded-xl hover:bg-emerald-700 transition-colors">Publish Website →</button>
                  </div>
                )}
                {reviewPage && project.generated_pages[reviewPage] && (
                  <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
                    <div className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setReviewPage(null)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <h3 className="font-body font-semibold text-black capitalize">{reviewPage.replace(/-/g, ' ')}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex bg-neutral-100 rounded-lg p-1">
                          {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
                            <button key={d} onClick={() => setDeviceView(d)} className={`px-3 py-1.5 rounded-md text-xs font-body font-medium transition-all ${deviceView === d ? 'bg-white shadow-sm text-black' : 'text-neutral-500'}`}>
                              {d === 'desktop' ? '🖥️' : d === 'tablet' ? '📱' : '📲'}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => approvePage(reviewPage)} className="px-4 py-2 bg-emerald-600 text-white font-body text-sm font-medium rounded-lg hover:bg-emerald-700">Approve ✓</button>
                        <RequestChangesButton pageName={reviewPage} onSubmit={requestPageChanges} />
                      </div>
                    </div>
                    <div className="flex-1 flex items-start justify-center p-6 overflow-auto">
                      <div className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${deviceView === 'desktop' ? 'w-full max-w-5xl' : deviceView === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`} style={{ height: 'calc(100vh - 120px)' }}>
                        <iframe srcDoc={project.generated_pages[reviewPage]} className="w-full h-full border-0" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🔨</span></div>
                <h3 className="font-display text-xl font-semibold text-black mb-2">Pages Coming Soon</h3>
                <p className="font-body text-neutral-500 text-sm">Our team is building your website. We&apos;ll notify you when pages are ready to review.</p>
              </div>
            )}
          </div>
        )}

        {/* ═══ MESSAGES ═══ */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden" style={{ height: 'calc(100vh - 380px)', minHeight: 400 }}>
            <div className="p-4 border-b border-neutral-200">
              <h2 className="font-body font-semibold text-black">Messages with VektorLabs Team</h2>
              <p className="font-body text-xs text-neutral-500">We typically reply within a few hours</p>
            </div>
            <div className="overflow-y-auto p-4 space-y-3" style={{ height: 'calc(100% - 140px)' }}>
              {messages.length === 0 ? (
                <div className="text-center py-12"><span className="text-3xl">💬</span><p className="font-body text-neutral-500 text-sm mt-2">No messages yet. Say hi!</p></div>
              ) : messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${msg.sender_type === 'customer' ? 'bg-black text-white rounded-br-md' : 'bg-neutral-100 text-black rounded-bl-md'}`}>
                    <p className="font-body text-sm">{msg.content}</p>
                    <p className={`font-body text-xs mt-1 ${msg.sender_type === 'customer' ? 'text-white/50' : 'text-neutral-400'}`}>{timeAgo(msg.created_at)}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-neutral-200">
              <div className="flex gap-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" />
                <button onClick={sendMessage} disabled={!newMessage.trim() || sending} className="px-5 py-3 bg-black text-white rounded-xl font-body text-sm font-medium hover:bg-black/80 disabled:opacity-50 transition-colors">{sending ? '...' : 'Send'}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ============================================
// REQUEST CHANGES BUTTON
// ============================================
function RequestChangesButton({ pageName, onSubmit }: { pageName: string; onSubmit: (page: string, feedback: string) => void }) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-orange-100 text-orange-700 font-body text-sm font-medium rounded-lg hover:bg-orange-200">Request Changes</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-body font-semibold text-black mb-2">Request Changes — <span className="capitalize">{pageName.replace(/-/g, ' ')}</span></h3>
            <p className="font-body text-sm text-neutral-500 mb-4">Tell us what you&apos;d like changed on this page.</p>
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="e.g., Make the header text bigger, change the hero image..." className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm resize-none h-32 focus:outline-none focus:border-black mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setOpen(false)} className="flex-1 px-4 py-2.5 bg-neutral-100 text-black font-body text-sm font-medium rounded-xl">Cancel</button>
              <button onClick={() => { onSubmit(pageName, feedback); setOpen(false); setFeedback(''); }} disabled={!feedback.trim()} className="flex-1 px-4 py-2.5 bg-orange-600 text-white font-body text-sm font-medium rounded-xl hover:bg-orange-700 disabled:opacity-50">Submit Feedback</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
