'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// ── Types ──
type Project = {
  id: string;
  business_name: string;
  status: string;
  plan: string;
  paid: boolean;
  created_at: string;
  source?: string;
  industry?: string;
  website_type?: string;
  email?: string;
  phone?: string;
  custom_price?: number;
  metadata?: {
    selected_variation?: string;
    client_needs?: {
      pages?: string[];
      features?: string[];
      addons?: string[];
      timeline?: string;
      budget?: string;
    };
    page_status?: Record<string, string>;
  } | null;
  customers?: { name: string; email: string } | null;
};

type Customer = { id: string; name: string; email: string; created_at: string };
type Message = { id: string; content: string; created_at: string; project_id: string; sender_type: string; projects?: { business_name: string } | null };

// ═══════════════════════════════════════
// NEW LEADS SECTION (live feed)
// ═══════════════════════════════════════
function NewLeadsSection() {
  const [leads, setLeads] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
    const channel = supabase
      .channel('new-leads')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'projects', filter: 'source=eq.landing_page' }, (payload) => {
        setLeads(prev => [payload.new as Project, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadLeads = async () => {
    const { data } = await supabase.from('projects').select('*').eq('source', 'landing_page').eq('status', 'pending').order('created_at', { ascending: false }).limit(10);
    setLeads(data || []);
    setLoading(false);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const claimLead = async (id: string) => {
    await supabase.from('projects').update({ status: 'preview_sent' }).eq('id', id);
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  if (loading || leads.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75" />
          </div>
          <h2 className="font-body text-lg font-semibold text-black">
            New Leads <span className="ml-2 text-sm font-normal text-neutral-500">({leads.length} waiting)</span>
          </h2>
        </div>
        <Link href="/admin/leads" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">View all →</Link>
      </div>
      <div className="grid gap-3">
        {leads.map(lead => (
          <div key={lead.id} className="bg-white border border-neutral-200 rounded-2xl p-5 hover:border-neutral-300 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {lead.business_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-body font-semibold text-black text-[15px] truncate">{lead.business_name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-body text-xs text-neutral-500">{lead.industry}</span>
                      <span className="text-neutral-300">·</span>
                      <span className="font-body text-xs text-neutral-500">{lead.website_type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <a href={`sms:${lead.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors font-body">💬 {lead.phone}</a>
                  <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-medium hover:bg-neutral-200 transition-colors font-body">✉️ {lead.email}</a>
                  <span className="font-body text-[11px] text-neutral-400">{timeAgo(lead.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => claimLead(lead.id)} className="px-4 py-2 bg-black text-white text-xs font-medium rounded-full hover:shadow-lg hover:shadow-black/20 transition-all font-body">
                  Generate Preview
                </button>
                <Link href={`/admin/projects/${lead.id}`} className="px-3 py-2 border border-neutral-200 text-neutral-600 text-xs font-medium rounded-full hover:border-black hover:text-black transition-all font-body">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════
export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    try {
      const [projectsRes, customersRes, messagesRes] = await Promise.all([
        supabase.from('projects').select('*, customers(name, email)').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*, projects(business_name)').order('created_at', { ascending: false }).limit(10),
      ]);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (customersRes.data) setCustomers(customersRes.data);
      if (messagesRes.data) setMessages(messagesRes.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Stats (custom pricing) ──
  const stats = {
    totalRevenue: projects.filter(p => p.paid).reduce((sum, p) => sum + (p.custom_price || 0), 0),
    pipelineValue: projects.filter(p => p.custom_price && !p.paid).reduce((sum, p) => sum + (p.custom_price || 0), 0),
    activeProjects: projects.filter(p => !['published', 'DELIVERED', 'delivered'].includes(p.status)).length,
    totalCustomers: customers.length,
    pendingLeads: projects.filter(p => p.status === 'pending').length,
    todayLeads: projects.filter(p => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      return p.source === 'landing_page' && new Date(p.created_at) >= today;
    }).length,
    conversionRate: projects.length > 0 ? Math.round((projects.filter(p => p.paid).length / projects.length) * 100) : 0,
    newThisWeek: projects.filter(p => {
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(p.created_at) > weekAgo;
    }).length,
  };

  // ── Pipeline counts (NEW FLOW) ──
  const pipelineCounts = [
    { status: 'pending', label: 'New Leads', color: 'text-red-600', bg: 'bg-red-50 border-red-200', count: projects.filter(p => p.status === 'pending').length },
    { status: 'preview_sent', label: 'Preview Sent', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', count: projects.filter(p => ['preview_sent', 'PREVIEW_READY', 'preview', 'claimed', 'generating', 'IN_PROGRESS'].includes(p.status)).length },
    { status: 'needs_submitted', label: 'Needs Submitted', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', count: projects.filter(p => ['needs_submitted', 'needs_review'].includes(p.status)).length },
    { status: 'paid', label: 'Paid — Building', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', count: projects.filter(p => ['paid', 'PAID', 'building'].includes(p.status)).length },
    { status: 'review', label: 'Client Review', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', count: projects.filter(p => ['review', 'client_review'].includes(p.status)).length },
    { status: 'published', label: 'Published', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200', count: projects.filter(p => ['published', 'DELIVERED', 'delivered'].includes(p.status)).length },
  ];
  const maxCount = Math.max(...pipelineCounts.map(p => p.count), 1);

  const recentProjects = projects.slice(0, 8);
  const unreadMessages = messages.filter(m => m.sender_type === 'customer').length;

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
      pending: { label: 'New Lead', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
      preview_sent: { label: 'Preview Sent', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
      claimed: { label: 'Preview Sent', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
      generating: { label: 'Generating', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
      IN_PROGRESS: { label: 'Generating', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
      PREVIEW_READY: { label: 'Preview Sent', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
      preview: { label: 'Preview Sent', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
      needs_submitted: { label: 'Needs Submitted', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
      needs_review: { label: 'Needs Review', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
      paid: { label: 'Paid — Building', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
      PAID: { label: 'Paid', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
      building: { label: 'Building', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
      review: { label: 'Client Review', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
      client_review: { label: 'Client Review', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
      published: { label: 'Published', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200' },
      DELIVERED: { label: 'Published', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200' },
      delivered: { label: 'Published', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200' },
      sent: { label: 'Link Sent', color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200' },
      QUEUED: { label: 'Queued', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    };
    return configs[status] || { label: status, color: 'text-neutral-600', bg: 'bg-neutral-50 border-neutral-200' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-neutral-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-black">Dashboard</h1>
          <p className="font-body text-neutral-500 mt-1">Welcome back!</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/kanban" className="px-5 py-2.5 bg-white border border-neutral-200 text-black font-body text-sm font-medium rounded-full hover:bg-neutral-50 transition-all">
            📋 Kanban Board
          </Link>
          <Link href="/admin/projects" className="px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-all">
            + New Project
          </Link>
        </div>
      </div>

      {/* NEW LEADS */}
      <NewLeadsSection />

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Revenue */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {stats.pipelineValue > 0 && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-body text-xs font-medium">
                +${stats.pipelineValue.toLocaleString()} pipeline
              </span>
            )}
          </div>
          <p className="font-body text-2xl font-semibold text-black">${stats.totalRevenue.toLocaleString()}</p>
          <p className="font-body text-sm text-neutral-500 mt-1">Total Revenue</p>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            {stats.newThisWeek > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-body text-xs font-medium">+{stats.newThisWeek} this week</span>
            )}
          </div>
          <p className="font-body text-2xl font-semibold text-black">{stats.activeProjects}</p>
          <p className="font-body text-sm text-neutral-500 mt-1">Active Projects</p>
        </div>

        {/* Pending Leads */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            {stats.todayLeads > 0 && (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-body text-xs font-medium">+{stats.todayLeads} today</span>
            )}
          </div>
          <p className="font-body text-2xl font-semibold text-black">{stats.pendingLeads}</p>
          <p className="font-body text-sm text-neutral-500 mt-1">Pending Leads</p>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-body text-xs font-medium">{stats.conversionRate}% conv.</span>
          </div>
          <p className="font-body text-2xl font-semibold text-black">{stats.totalCustomers}</p>
          <p className="font-body text-sm text-neutral-500 mt-1">Total Customers</p>
        </div>
      </div>

      {/* PIPELINE + MESSAGES */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Pipeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="font-body font-semibold text-black mb-6">Pipeline Overview</h3>
          <div className="space-y-3">
            {pipelineCounts
              .filter(p => p.count > 0)
              .map(p => (
                <div key={p.status} className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${p.bg} ${p.color} min-w-[130px] text-center font-body`}>
                    {p.label}
                  </span>
                  <div className="flex-1 bg-neutral-100 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${(p.count / maxCount) * 100}%` }} />
                  </div>
                  <span className="font-body text-sm font-semibold text-black min-w-[24px] text-right">{p.count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-body font-semibold text-black">Messages</h3>
            {unreadMessages > 0 && (
              <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-body font-medium">{unreadMessages}</span>
            )}
          </div>
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="font-body text-sm text-neutral-400 text-center py-8">No messages yet</p>
            ) : (
              messages.slice(0, 5).map(msg => (
                <Link key={msg.id} href={`/admin/projects/${msg.project_id}`} className="block p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${msg.sender_type === 'customer' ? 'bg-blue-500' : 'bg-neutral-300'}`} />
                    <span className="font-body text-xs font-medium text-black truncate">{msg.projects?.business_name || 'Unknown'}</span>
                    <span className="font-body text-[10px] text-neutral-400 ml-auto">{timeAgo(msg.created_at)}</span>
                  </div>
                  <p className="font-body text-xs text-neutral-500 truncate pl-4">{msg.content}</p>
                </Link>
              ))
            )}
          </div>
          <Link href="/admin/messages" className="block text-center mt-4 font-body text-sm text-neutral-500 hover:text-black transition-colors">View all messages →</Link>
        </div>
      </div>

      {/* RECENT PROJECTS */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-body font-semibold text-black">Recent Projects</h3>
          <Link href="/admin/projects" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-2 font-body text-xs font-semibold text-neutral-400 uppercase tracking-wider">Business</th>
                <th className="text-left py-3 px-2 font-body text-xs font-semibold text-neutral-400 uppercase tracking-wider">Industry</th>
                <th className="text-left py-3 px-2 font-body text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-2 font-body text-xs font-semibold text-neutral-400 uppercase tracking-wider">Design</th>
                <th className="text-left py-3 px-2 font-body text-xs font-semibold text-neutral-400 uppercase tracking-wider">Price</th>
                <th className="text-left py-3 px-2 font-body text-xs font-semibold text-neutral-400 uppercase tracking-wider">Payment</th>
                <th className="text-right py-3 px-2 font-body text-xs font-semibold text-neutral-400 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map(project => {
                const sc = getStatusConfig(project.status);
                const variation = project.metadata?.selected_variation;
                return (
                  <tr key={project.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-2">
                      <Link href={`/admin/projects/${project.id}`} className="flex items-center gap-3 group">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-body font-bold text-xs ${
                          project.source === 'landing_page' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-neutral-600 to-neutral-800'
                        }`}>
                          {project.business_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <span className="font-body text-sm font-medium text-black group-hover:underline">{project.business_name}</span>
                          <p className="font-body text-xs text-neutral-400">{project.customers?.email || project.email || ''}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-body text-xs text-neutral-500">{project.industry || '—'}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${sc.bg} ${sc.color} font-body`}>{sc.label}</span>
                    </td>
                    <td className="py-3 px-2">
                      {variation ? (
                        <span className="font-body text-xs text-neutral-600">
                          {variation === 'bold' ? 'Bold & Modern' : variation === 'elegant' ? 'Clean & Elegant' : variation === 'dynamic' ? 'Dynamic & Vibrant' : variation}
                        </span>
                      ) : (
                        <span className="font-body text-xs text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {project.custom_price ? (
                        <span className="font-body text-sm font-semibold text-emerald-600">${project.custom_price.toLocaleString()}</span>
                      ) : (
                        <span className="font-body text-xs text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {project.paid ? (
                        <span className="font-body text-xs font-medium text-emerald-600">✅ Paid</span>
                      ) : (
                        <span className="font-body text-xs text-neutral-400">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-body text-xs text-neutral-400">{timeAgo(project.created_at)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
