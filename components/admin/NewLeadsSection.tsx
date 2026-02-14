// ═══════════════════════════════════════════════════════════════
// ADMIN DASHBOARD — NEW LEADS SECTION
// ═══════════════════════════════════════════════════════════════
// Add this component to your admin dashboard page (app/admin/(protected)/dashboard/page.tsx)
// Place it at the TOP of the dashboard, before your existing stats cards.
//
// Usage: <NewLeadsSection />
// ═══════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

type Lead = {
  id: string;
  business_name: string;
  industry: string;
  website_type: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  created_at: string;
  metadata?: Record<string, any>;
};

export function NewLeadsSection() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
    // Realtime subscription for new leads
    const channel = supabase
      .channel('new-leads')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'projects',
        filter: 'source=eq.landing_page',
      }, (payload) => {
        setLeads(prev => [payload.new as Lead, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadLeads = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('source', 'landing_page')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(10);
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
    await supabase
      .from('projects')
      .update({ status: 'claimed' })
      .eq('id', id);
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  if (loading) return null;
  if (leads.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75" />
          </div>
          <h2 className="text-lg font-semibold text-black">
            New Leads
            <span className="ml-2 text-sm font-normal text-neutral-500">
              ({leads.length} waiting)
            </span>
          </h2>
        </div>
        <Link
          href="/admin/projects?source=landing_page&status=pending"
          className="text-sm text-neutral-500 hover:text-black transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Lead Cards */}
      <div className="grid gap-3">
        {leads.map(lead => (
          <div
            key={lead.id}
            className="bg-white border border-neutral-200 rounded-2xl p-5 hover:border-neutral-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: Lead Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {lead.business_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-black text-[15px] truncate">{lead.business_name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-neutral-500">{lead.industry}</span>
                      <span className="text-neutral-300">·</span>
                      <span className="text-xs text-neutral-500">{lead.website_type}</span>
                    </div>
                  </div>
                </div>

                {/* Contact pills */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <a
                    href={`sms:${lead.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    {lead.phone}
                  </a>
                  <a
                    href={`mailto:${lead.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-medium hover:bg-neutral-200 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {lead.email}
                  </a>
                  <span className="text-[11px] text-neutral-400">{timeAgo(lead.created_at)}</span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => claimLead(lead.id)}
                  className="px-4 py-2 bg-black text-white text-xs font-medium rounded-full hover:shadow-lg hover:shadow-black/20 transition-all"
                >
                  Claim & Build
                </button>
                <Link
                  href={`/admin/projects/${lead.id}`}
                  className="px-3 py-2 border border-neutral-200 text-neutral-600 text-xs font-medium rounded-full hover:border-black hover:text-black transition-all"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD STATS — Updated to include landing page metrics
// ═══════════════════════════════════════════════════════════════
// Replace your existing stats loading function with this one
// to include new lead counts.

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingLeads: 0,
    inProgress: 0,
    delivered: 0,
    revenue: 0,
    pendingRevenue: 0,
    todayLeads: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // All projects
    const { data: projects } = await supabase
      .from('projects')
      .select('id, status, plan, paid, source, created_at');

    if (!projects) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingLeads = projects.filter(p => p.source === 'landing_page' && p.status === 'pending').length;
    const todayLeads = projects.filter(p =>
      p.source === 'landing_page' && new Date(p.created_at) >= today
    ).length;
    const inProgress = projects.filter(p => ['claimed', 'generating', 'preview', 'building'].includes(p.status)).length;
    const delivered = projects.filter(p => p.status === 'delivered').length;
    const paid = projects.filter(p => p.paid);
    const totalPaid = paid.filter(p => p.source === 'landing_page').length;
    const totalLandingLeads = projects.filter(p => p.source === 'landing_page').length;

    const planPrices: Record<string, number> = {
      starter: 299,
      business: 599,
      premium: 999,
      custom: 1500,
    };

    const revenue = paid.reduce((sum, p) => sum + (planPrices[p.plan] || 299), 0);
    const pendingRevenue = projects
      .filter(p => !p.paid && ['preview', 'delivered'].includes(p.status))
      .reduce((sum, p) => sum + (planPrices[p.plan] || 299), 0);

    setStats({
      totalProjects: projects.length,
      pendingLeads,
      inProgress,
      delivered,
      revenue,
      pendingRevenue,
      todayLeads,
      conversionRate: totalLandingLeads > 0 ? Math.round((totalPaid / totalLandingLeads) * 100) : 0,
    });
  };

  return stats;
}
