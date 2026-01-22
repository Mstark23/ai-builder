// /app/portal/leads/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Lead = {
  id: string;
  project_id: string;
  source: 'form' | 'call' | 'chat' | 'email' | 'manual';
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  notes: string;
  created_at: string;
  updated_at: string;
  project?: {
    business_name: string;
  };
};

type Project = {
  id: string;
  business_name: string;
};

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: '🆕' },
  contacted: { label: 'Contacted', color: 'bg-amber-100 text-amber-700', icon: '📞' },
  qualified: { label: 'Qualified', color: 'bg-purple-100 text-purple-700', icon: '✅' },
  proposal: { label: 'Proposal Sent', color: 'bg-indigo-100 text-indigo-700', icon: '📄' },
  won: { label: 'Won', color: 'bg-emerald-100 text-emerald-700', icon: '🎉' },
  lost: { label: 'Lost', color: 'bg-neutral-100 text-neutral-500', icon: '❌' },
};

const sourceConfig = {
  form: { label: 'Website Form', icon: '📝', color: 'text-blue-600' },
  call: { label: 'Phone Call', icon: '📞', color: 'text-emerald-600' },
  chat: { label: 'Live Chat', icon: '💬', color: 'text-purple-600' },
  email: { label: 'Email', icon: '✉️', color: 'text-amber-600' },
  manual: { label: 'Manual Entry', icon: '✏️', color: 'text-neutral-600' },
};

export default function LeadInboxPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectFilter = searchParams.get('project');

  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>(projectFilter || 'all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    won: 0,
    conversionRate: 0,
  });

  // New lead form state
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    source: 'manual' as Lead['source'],
    project_id: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadLeads();
    }
  }, [user, selectedProject, selectedStatus]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);

    // Load projects
    const { data: projectsData } = await supabase
      .from('projects')
      .select('id, business_name')
      .eq('customer_id', user.id)
      .in('status', ['PAID', 'BUILDING', 'DELIVERED']);

    if (projectsData) {
      setProjects(projectsData);
      if (projectsData.length > 0 && !projectFilter) {
        setNewLead(prev => ({ ...prev, project_id: projectsData[0].id }));
      }
    }

    setLoading(false);
  };

  const loadLeads = async () => {
    if (!user) return;

    let query = supabase
      .from('leads')
      .select('*, project:projects(business_name)')
      .order('created_at', { ascending: false });

    // Filter by project
    if (selectedProject !== 'all') {
      query = query.eq('project_id', selectedProject);
    } else {
      // Get leads for all user's projects
      const projectIds = projects.map(p => p.id);
      if (projectIds.length > 0) {
        query = query.in('project_id', projectIds);
      }
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      query = query.eq('status', selectedStatus);
    }

    const { data, error } = await query;

    if (data) {
      setLeads(data);

      // Calculate stats
      const total = data.length;
      const newCount = data.filter(l => l.status === 'new').length;
      const contactedCount = data.filter(l => l.status === 'contacted').length;
      const wonCount = data.filter(l => l.status === 'won').length;
      const conversionRate = total > 0 ? Math.round((wonCount / total) * 100) : 0;

      setStats({
        total,
        new: newCount,
        contacted: contactedCount,
        won: wonCount,
        conversionRate,
      });
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', leadId);

    if (!error) {
      setLeads(prev =>
        prev.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const updateLeadNotes = async (leadId: string, notes: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ notes, updated_at: new Date().toISOString() })
      .eq('id', leadId);

    if (!error && selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, notes } : null);
    }
  };

  const addNewLead = async () => {
    if (!newLead.name || !newLead.project_id) return;

    const { data, error } = await supabase
      .from('leads')
      .insert({
        ...newLead,
        status: 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*, project:projects(business_name)')
      .single();

    if (data) {
      setLeads(prev => [data, ...prev]);
      setShowAddModal(false);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        message: '',
        source: 'manual',
        project_id: projects[0]?.id || '',
      });
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (!error) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      if (selectedLead?.id === leadId) {
        setSelectedLead(null);
      }
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.phone?.includes(query) ||
      lead.message?.toLowerCase().includes(query)
    );
  });

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-500">Loading leads...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-3">Lead Inbox Locked</h1>
          <p className="text-neutral-600 mb-6">
            You need a paid website to access the Lead Inbox. Get your website built first!
          </p>
          <Link
            href="/portal/new-project"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/80 transition"
          >
            Start Your Website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/portal" className="flex items-center gap-2 text-neutral-600 hover:text-black transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </Link>
              <div>
                <h1 className="font-display text-xl font-medium text-black">Lead Inbox</h1>
                <p className="font-body text-xs text-neutral-500">All your inquiries in one place</p>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium hover:bg-black/80 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Lead</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="font-body text-xs text-neutral-500 mb-1">Total Leads</p>
            <p className="font-display text-2xl font-bold text-black">{stats.total}</p>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
            <p className="font-body text-xs text-blue-600 mb-1">New</p>
            <p className="font-display text-2xl font-bold text-blue-700">{stats.new}</p>
          </div>
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <p className="font-body text-xs text-amber-600 mb-1">Contacted</p>
            <p className="font-display text-2xl font-bold text-amber-700">{stats.contacted}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <p className="font-body text-xs text-emerald-600 mb-1">Won</p>
            <p className="font-display text-2xl font-bold text-emerald-700">{stats.won}</p>
          </div>
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
            <p className="font-body text-xs text-purple-600 mb-1">Conversion Rate</p>
            <p className="font-display text-2xl font-bold text-purple-700">{stats.conversionRate}%</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.business_name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">All Statuses</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.icon} {config.label}</option>
            ))}
          </select>
        </div>

        {/* LEADS TABLE / LIST */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lead List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              {filteredLeads.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="font-display text-lg font-medium text-black mb-2">No leads yet</h3>
                  <p className="font-body text-sm text-neutral-500 mb-4">
                    When visitors contact you through your website, they'll appear here.
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add First Lead
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {filteredLeads.map(lead => {
                    const status = statusConfig[lead.status];
                    const source = sourceConfig[lead.source];
                    const isSelected = selectedLead?.id === lead.id;

                    return (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`p-4 cursor-pointer transition hover:bg-neutral-50 ${isSelected ? 'bg-neutral-50 border-l-4 border-l-black' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="font-body font-semibold text-neutral-600">
                                {lead.name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>

                            {/* Info */}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-body font-semibold text-black">{lead.name || 'Unknown'}</h4>
                                {lead.status === 'new' && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 font-body text-xs text-neutral-500">
                                {lead.email && <span>{lead.email}</span>}
                                {lead.phone && <span>{lead.phone}</span>}
                              </div>
                              {lead.message && (
                                <p className="font-body text-sm text-neutral-600 mt-1 line-clamp-1">
                                  {lead.message}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Meta */}
                          <div className="text-right flex-shrink-0">
                            <span className={`inline-block px-2 py-1 rounded-full font-body text-xs font-medium ${status.color}`}>
                              {status.icon} {status.label}
                            </span>
                            <p className="font-body text-xs text-neutral-400 mt-1">{timeAgo(lead.created_at)}</p>
                            <p className={`font-body text-xs mt-1 ${source.color}`}>
                              {source.icon} {source.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Lead Detail Panel */}
          <div className="lg:col-span-1">
            {selectedLead ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-24">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-display text-xl font-medium text-black">{selectedLead.name}</h3>
                    <p className="font-body text-sm text-neutral-500">{selectedLead.project?.business_name}</p>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="text-neutral-400 hover:text-black transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  {selectedLead.email && (
                    <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition">
                      <span className="text-lg">✉️</span>
                      <span className="font-body text-sm text-black">{selectedLead.email}</span>
                    </a>
                  )}
                  {selectedLead.phone && (
                    <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition">
                      <span className="text-lg">📞</span>
                      <span className="font-body text-sm text-black">{selectedLead.phone}</span>
                    </a>
                  )}
                </div>

                {/* Message */}
                {selectedLead.message && (
                  <div className="mb-6">
                    <p className="font-body text-xs text-neutral-500 mb-2">Message</p>
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <p className="font-body text-sm text-black">{selectedLead.message}</p>
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div className="mb-6">
                  <p className="font-body text-xs text-neutral-500 mb-2">Update Status</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => updateLeadStatus(selectedLead.id, key as Lead['status'])}
                        className={`p-2 rounded-lg font-body text-xs font-medium transition ${
                          selectedLead.status === key
                            ? config.color
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {config.icon}
                        <br />
                        {config.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <p className="font-body text-xs text-neutral-500 mb-2">Notes</p>
                  <textarea
                    value={selectedLead.notes || ''}
                    onChange={(e) => {
                      setSelectedLead(prev => prev ? { ...prev, notes: e.target.value } : null);
                    }}
                    onBlur={() => updateLeadNotes(selectedLead.id, selectedLead.notes || '')}
                    placeholder="Add notes about this lead..."
                    rows={4}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {selectedLead.email && (
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="flex-1 py-2 bg-black text-white rounded-lg font-body text-sm font-medium text-center hover:bg-black/80 transition"
                    >
                      Send Email
                    </a>
                  )}
                  {selectedLead.phone && (
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-body text-sm font-medium text-center hover:bg-emerald-700 transition"
                    >
                      Call
                    </a>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteLead(selectedLead.id)}
                  className="w-full mt-4 py-2 text-red-500 font-body text-sm hover:bg-red-50 rounded-lg transition"
                >
                  Delete Lead
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="font-body text-neutral-500">Select a lead to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-medium text-black">Add New Lead</h2>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-black">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-body text-sm text-neutral-600 mb-1 block">Name *</label>
                <input
                  type="text"
                  value={newLead.name}
                  onChange={(e) => setNewLead(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Smith"
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="font-body text-sm text-neutral-600 mb-1 block">Email</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="font-body text-sm text-neutral-600 mb-1 block">Phone</label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="font-body text-sm text-neutral-600 mb-1 block">Project</label>
                <select
                  value={newLead.project_id}
                  onChange={(e) => setNewLead(prev => ({ ...prev, project_id: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.business_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-body text-sm text-neutral-600 mb-1 block">Source</label>
                <select
                  value={newLead.source}
                  onChange={(e) => setNewLead(prev => ({ ...prev, source: e.target.value as Lead['source'] }))}
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {Object.entries(sourceConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.icon} {config.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-body text-sm text-neutral-600 mb-1 block">Message/Notes</label>
                <textarea
                  value={newLead.message}
                  onChange={(e) => setNewLead(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="What did they inquire about?"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 border border-neutral-200 rounded-full font-body text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={addNewLead}
                disabled={!newLead.name || !newLead.project_id}
                className="flex-1 py-2.5 bg-black text-white rounded-full font-body text-sm font-medium hover:bg-black/80 transition disabled:opacity-50"
              >
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
