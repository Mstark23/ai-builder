'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import LeadTimer from '@/components/LeadTimer';

type Lead = {
  id: string;
  business_name: string;
  industry: string;
  website_type: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  preview_url: string | null;
  created_at: string;
  metadata?: Record<string, any>;
};

const STATUS_TABS = [
  { key: '', label: 'All Leads', icon: '📋' },
  { key: 'pending', label: 'New', icon: '📩' },
  { key: 'claimed', label: 'Claimed', icon: '👋' },
  { key: 'generating', label: 'Building', icon: '⚡' },
  { key: 'preview', label: 'Preview Ready', icon: '👁️' },
  { key: 'sent', label: 'Link Sent', icon: '📱' },
  { key: 'paid', label: 'Paid', icon: '💰' },
  { key: 'delivered', label: 'Delivered', icon: '✅' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: 'New Lead', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  claimed: { label: 'Claimed', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  generating: { label: 'Building', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  preview: { label: 'Preview Ready', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', dot: 'bg-indigo-500' },
  sent: { label: 'Link Sent', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200', dot: 'bg-cyan-500' },
  paid: { label: 'Paid', color: 'text-green-700', bg: 'bg-green-50 border-green-200', dot: 'bg-green-500' },
  delivered: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  useEffect(() => {
    loadLeads();
    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: 'source=eq.landing_page',
      }, () => {
        loadLeads();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadLeads = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('source', 'landing_page')
      .order('created_at', { ascending: false });

    const all = data || [];
    setLeads(all);

    const c: Record<string, number> = { '': all.length };
    STATUS_TABS.forEach(t => {
      if (t.key) c[t.key] = all.filter(l => l.status === t.key).length;
    });
    setCounts(c);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('projects').update({ status }).eq('id', id);
    loadLeads();
  };

  const savePreview = async (id: string) => {
    if (!previewUrl.trim()) return;
    await supabase.from('projects').update({ preview_url: previewUrl.trim(), status: 'preview' }).eq('id', id);
    setPreviewUrl('');
    loadLeads();
  };

  const openSms = (lead: Lead) => {
    const url = lead.preview_url || previewUrl || `https://www.vektorlabs.ai/preview/${lead.id}`;
    const msg = smsMessage || `Hey ${lead.business_name}! Your custom ${lead.website_type.toLowerCase()} is ready. Here's your preview: ${url} — Let us know what you think!`;
    window.open(`sms:${lead.phone}?body=${encodeURIComponent(msg)}`, '_blank');
    updateStatus(lead.id, 'sent');
    setSmsMessage('');
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filtered = leads.filter(l => {
    if (activeTab && l.status !== activeTab) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        l.business_name?.toLowerCase().includes(s) ||
        l.email?.toLowerCase().includes(s) ||
        l.phone?.includes(s) ||
        l.industry?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
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

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-black">Leads</h1>
          <p className="font-body text-neutral-500 mt-1">
            {counts['pending'] || 0} new · {counts[''] || 0} total from landing page
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl font-body text-sm outline-none focus:border-black transition-colors w-64"
            />
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-6 -mx-1 px-1">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-black text-white shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-black'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {(counts[tab.key] || 0) > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
              }`}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Leads List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">{activeTab === 'pending' ? '📩' : '📋'}</div>
          <h3 className="font-body text-lg font-semibold text-black mb-2">
            {activeTab ? `No ${STATUS_CONFIG[activeTab]?.label.toLowerCase()} leads` : 'No leads yet'}
          </h3>
          <p className="font-body text-sm text-neutral-500">
            {activeTab === 'pending' ? 'New leads from your landing page will appear here.' : 'Leads from your landing page funnel will show up here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(lead => {
            const sc = STATUS_CONFIG[lead.status] || STATUS_CONFIG.pending;
            const isExpanded = expandedId === lead.id;

            return (
              <div
                key={lead.id}
                className={`bg-white border rounded-2xl transition-all ${
                  isExpanded ? 'border-black shadow-lg' : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                }`}
              >
                {/* Main Row */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-body font-bold text-lg flex-shrink-0">
                        {lead.business_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-body font-semibold text-black text-[15px] truncate">{lead.business_name}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${sc.bg} ${sc.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-body text-xs text-neutral-500">{lead.industry}</span>
                          <span className="text-neutral-300">·</span>
                          <span className="font-body text-xs text-neutral-500">{lead.website_type}</span>
                          <span className="text-neutral-300">·</span>
                          <span className="font-body text-xs text-neutral-400">{timeAgo(lead.created_at)}</span>
                          {(lead.status === 'pending' || lead.status === 'claimed' || lead.status === 'generating') && (
                            <>
                              <span className="text-neutral-300">·</span>
                              <LeadTimer createdAt={lead.created_at} previewSentAt={lead.metadata?.preview_sent_at} compact />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <a href={`sms:${lead.phone}`} className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-100 transition-colors" title="Text">
                        💬
                      </a>
                      <a href={`mailto:${lead.email}`} className="w-9 h-9 bg-neutral-100 text-neutral-600 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors" title="Email">
                        ✉️
                      </a>
                      <a href={`tel:${lead.phone}`} className="w-9 h-9 bg-neutral-100 text-neutral-600 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors" title="Call">
                        📞
                      </a>
                      {lead.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(lead.id, 'claimed')}
                          className="px-4 py-2 bg-black text-white font-body text-xs font-medium rounded-full hover:shadow-lg hover:shadow-black/20 transition-all"
                        >
                          Claim
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Contact Pills */}
                  <div className="flex items-center gap-2 mt-3 ml-16">
                    <span className="font-body text-xs text-neutral-500 bg-neutral-50 px-3 py-1 rounded-lg">{lead.phone}</span>
                    <span className="font-body text-xs text-neutral-500 bg-neutral-50 px-3 py-1 rounded-lg">{lead.email}</span>
                    {lead.preview_url && (
                      <a href={lead.preview_url} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors">
                        🔗 Preview Link
                      </a>
                    )}
                  </div>
                </div>

                {/* Expanded Actions */}
                {isExpanded && (
                  <div className="border-t border-neutral-100 p-5 bg-neutral-50/50 rounded-b-2xl" onClick={e => e.stopPropagation()}>
                    {/* Timer */}
                    {(lead.status === 'pending' || lead.status === 'claimed' || lead.status === 'generating' || lead.status === 'preview') && (
                      <div className="mb-5">
                        <LeadTimer createdAt={lead.created_at} previewSentAt={lead.metadata?.preview_sent_at} />
                      </div>
                    )}

                    {/* Status Flow */}
                    <div className="mb-5">
                      <label className="font-body text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 block">Update Status</label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                          <button
                            key={key}
                            onClick={() => updateStatus(lead.id, key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all font-body ${
                              lead.status === key
                                ? config.bg + ' ' + config.color + ' shadow-sm'
                                : 'bg-white border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-neutral-600'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${lead.status === key ? config.dot : 'bg-neutral-300'}`} />
                            {config.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preview URL */}
                    <div className="mb-5">
                      <label className="font-body text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 block">Preview Link</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://www.vektorlabs.ai/preview/..."
                          value={lead.preview_url || previewUrl}
                          onChange={e => setPreviewUrl(e.target.value)}
                          className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-xl font-body text-sm outline-none focus:border-black transition-colors"
                        />
                        <button
                          onClick={() => savePreview(lead.id)}
                          className="px-5 py-2.5 bg-black text-white rounded-xl font-body text-sm font-medium hover:shadow-lg transition-all"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    {/* SMS Composer */}
                    {(lead.status === 'preview' || lead.status === 'sent' || lead.preview_url) && (
                      <div className="mb-5">
                        <label className="font-body text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 block">Send Preview via SMS</label>
                        <textarea
                          value={smsMessage}
                          onChange={e => setSmsMessage(e.target.value)}
                          placeholder={`Hey ${lead.business_name}! Your custom ${lead.website_type.toLowerCase()} is ready...`}
                          rows={3}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl font-body text-sm outline-none focus:border-black resize-none transition-colors mb-2"
                        />
                        <button
                          onClick={() => openSms(lead)}
                          className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-body text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
                        >
                          📱 Open in Messages
                        </button>
                      </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                      <div className="flex items-center gap-2">
                        <a href={`sms:${lead.phone}`} className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-body text-xs font-medium hover:bg-emerald-600 transition-colors flex items-center gap-1.5">
                          💬 Text {lead.phone}
                        </a>
                        <a href={`mailto:${lead.email}`} className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl font-body text-xs font-medium hover:bg-neutral-200 transition-colors flex items-center gap-1.5">
                          ✉️ Email
                        </a>
                        <a href={`tel:${lead.phone}`} className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl font-body text-xs font-medium hover:bg-neutral-200 transition-colors flex items-center gap-1.5">
                          📞 Call
                        </a>
                      </div>
                      <Link
                        href={`/admin/projects/${lead.id}`}
                        className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-xl font-body text-xs font-medium hover:border-black hover:text-black transition-all"
                      >
                        Open Full Project →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
