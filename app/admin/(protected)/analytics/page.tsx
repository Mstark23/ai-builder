// app/admin/(protected)/analytics/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Visitor = {
  id: string;
  visitor_id: string;
  email: string | null;
  customer_id: string | null;
  first_seen: string;
  last_seen: string;
  current_page: string | null;
  first_page: string | null;
  first_referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  device: string | null;
  browser: string | null;
  total_visits: number;
  total_page_views: number;
  signed_up: boolean;
};

type PageViewStat = {
  page: string;
  views: number;
  avg_duration: number;
  avg_scroll: number;
};

type EmailCapture = {
  id: string;
  email: string;
  source: string;
  page: string;
  converted: boolean;
  created_at: string;
};

type TimeRange = '1h' | '24h' | '7d' | '30d' | 'all';

export default function AnalyticsPage() {
  const [liveVisitors, setLiveVisitors] = useState<Visitor[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalPageViews, setTotalPageViews] = useState(0);
  const [topPages, setTopPages] = useState<PageViewStat[]>([]);
  const [emailCaptures, setEmailCaptures] = useState<EmailCapture[]>([]);
  const [recentVisitors, setRecentVisitors] = useState<Visitor[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'realtime' | 'pages' | 'visitors' | 'emails' | 'segments'>('realtime');

  const getTimeFilter = useCallback(() => {
    const now = new Date();
    switch (timeRange) {
      case '1h': return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default: return null;
    }
  }, [timeRange]);

  const loadData = useCallback(async () => {
    try {
      // ── Live visitors (seen in last 2 minutes) ──
      const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      const { data: live } = await supabase
        .from('visitors')
        .select('*')
        .gte('last_seen', twoMinAgo)
        .not('current_page', 'is', null)
        .order('last_seen', { ascending: false });
      setLiveVisitors(live || []);

      // ── Time-filtered stats ──
      const timeFilter = getTimeFilter();

      // Total unique visitors
      let visitorQuery = supabase.from('visitors').select('id', { count: 'exact', head: true });
      if (timeFilter) visitorQuery = visitorQuery.gte('last_seen', timeFilter);
      const { count: visitorCount } = await visitorQuery;
      setTotalVisitors(visitorCount || 0);

      // Total page views
      let pvQuery = supabase.from('page_views').select('id', { count: 'exact', head: true });
      if (timeFilter) pvQuery = pvQuery.gte('created_at', timeFilter);
      const { count: pvCount } = await pvQuery;
      setTotalPageViews(pvCount || 0);

      // ── Top pages ──
      let pagesQuery = supabase.from('page_views').select('page, duration_seconds, scroll_depth');
      if (timeFilter) pagesQuery = pagesQuery.gte('created_at', timeFilter);
      const { data: pageData } = await pagesQuery;

      if (pageData) {
        const pageMap: Record<string, { views: number; totalDuration: number; totalScroll: number }> = {};
        pageData.forEach(pv => {
          if (!pageMap[pv.page]) pageMap[pv.page] = { views: 0, totalDuration: 0, totalScroll: 0 };
          pageMap[pv.page].views++;
          pageMap[pv.page].totalDuration += pv.duration_seconds || 0;
          pageMap[pv.page].totalScroll += pv.scroll_depth || 0;
        });

        const sorted = Object.entries(pageMap)
          .map(([page, stats]) => ({
            page,
            views: stats.views,
            avg_duration: Math.round(stats.totalDuration / stats.views),
            avg_scroll: Math.round(stats.totalScroll / stats.views),
          }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 20);
        setTopPages(sorted);
      }

      // ── Recent visitors ──
      let recentQuery = supabase.from('visitors').select('*').order('last_seen', { ascending: false }).limit(50);
      if (timeFilter) recentQuery = recentQuery.gte('last_seen', timeFilter);
      const { data: recent } = await recentQuery;
      setRecentVisitors(recent || []);

      // ── Email captures ──
      let emailQuery = supabase.from('email_captures').select('*').order('created_at', { ascending: false }).limit(50);
      if (timeFilter) emailQuery = emailQuery.gte('created_at', timeFilter);
      const { data: emails } = await emailQuery;
      setEmailCaptures(emails || []);

    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  }, [getTimeFilter]);

  useEffect(() => {
    loadData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // ── Computed segments ──
  const segments = {
    visitedDidntSignUp: recentVisitors.filter(v => !v.signed_up && v.total_page_views >= 2).length,
    viewedPricing: recentVisitors.filter(v => !v.signed_up && v.first_page === '/#pricing').length,
    startedRegister: recentVisitors.filter(v => !v.signed_up && v.email).length,
    returningVisitors: recentVisitors.filter(v => v.total_visits > 1).length,
    mobileVisitors: recentVisitors.filter(v => v.device === 'mobile').length,
    withEmail: emailCaptures.filter(e => !e.converted).length,
  };

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        @keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-black">Analytics</h1>
          <p className="font-body text-sm text-neutral-500 mt-1">Real-time visitor tracking & behavior insights</p>
        </div>
        
        {/* Time range filter */}
        <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
          {(['1h', '24h', '7d', '30d', 'all'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => { setTimeRange(range); setLoading(true); }}
              className={`px-3 py-1.5 rounded-md font-body text-xs font-medium transition-all ${
                timeRange === range ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
              }`}
            >
              {range === 'all' ? 'All' : range}
            </button>
          ))}
        </div>
      </div>

      {/* ── LIVE BANNER ── */}
      <div className="bg-black rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-400 rounded-full" style={{ animation: 'livePulse 2s ease-in-out infinite' }} />
            <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-30" />
          </div>
          <div>
            <p className="font-body text-white/60 text-xs uppercase tracking-wider">Right now</p>
            <p className="font-display text-3xl font-semibold text-white">{liveVisitors.length}</p>
          </div>
          <p className="font-body text-white/60 text-sm ml-2">
            {liveVisitors.length === 1 ? 'person' : 'people'} on your site
          </p>
        </div>
        {liveVisitors.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 flex-wrap">
            {liveVisitors.slice(0, 5).map(v => (
              <span key={v.visitor_id} className="px-2.5 py-1 bg-white/10 rounded-full text-white/80 font-body text-xs">
                {v.current_page}
              </span>
            ))}
            {liveVisitors.length > 5 && (
              <span className="text-white/40 font-body text-xs">+{liveVisitors.length - 5} more</span>
            )}
          </div>
        )}
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Visitors', value: totalVisitors, icon: '👥', color: 'bg-blue-50 border-blue-200' },
          { label: 'Page Views', value: totalPageViews, icon: '👁️', color: 'bg-purple-50 border-purple-200' },
          { label: 'Emails Captured', value: segments.withEmail, icon: '📧', color: 'bg-amber-50 border-amber-200' },
          { label: 'Didn\'t Sign Up', value: segments.visitedDidntSignUp, icon: '🎯', color: 'bg-red-50 border-red-200' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} border rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className="font-display text-2xl font-semibold text-black">{stat.value.toLocaleString()}</p>
            <p className="font-body text-xs text-neutral-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── TAB NAVIGATION ── */}
      <div className="flex items-center gap-1 border-b border-neutral-200">
        {[
          { key: 'realtime', label: 'Live Visitors', icon: '🟢' },
          { key: 'pages', label: 'Top Pages', icon: '📄' },
          { key: 'visitors', label: 'All Visitors', icon: '👥' },
          { key: 'emails', label: 'Email Captures', icon: '📧' },
          { key: 'segments', label: 'Segments', icon: '🎯' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-3 font-body text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        
        {/* REALTIME TAB */}
        {activeTab === 'realtime' && (
          <div>
            {liveVisitors.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">🌙</div>
                <p className="font-body text-neutral-500">No one on the site right now</p>
                <p className="font-body text-xs text-neutral-400 mt-1">Visitors appear here within seconds of arriving</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Visitor</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Current Page</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Device</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Source</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {liveVisitors.map(v => (
                    <tr key={v.visitor_id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full" style={{ animation: 'livePulse 2s ease-in-out infinite' }} />
                          <span className="font-body text-sm text-black">
                            {v.email || v.visitor_id.substring(0, 12)}
                          </span>
                          {v.signed_up && <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-medium">Registered</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-neutral-700 font-mono">{v.current_page}</td>
                      <td className="px-4 py-3 font-body text-sm text-neutral-500">{v.device || '—'}</td>
                      <td className="px-4 py-3 font-body text-sm text-neutral-500">{v.utm_source || v.first_referrer || 'Direct'}</td>
                      <td className="px-4 py-3 font-body text-xs text-neutral-400">{formatTimeAgo(v.last_seen)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TOP PAGES TAB */}
        {activeTab === 'pages' && (
          <div>
            {topPages.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-body text-neutral-500">No page views yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Page</th>
                    <th className="text-right px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Views</th>
                    <th className="text-right px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Avg Duration</th>
                    <th className="text-right px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Avg Scroll</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {topPages.map((page, i) => {
                    const maxViews = topPages[0]?.views || 1;
                    const barWidth = (page.views / maxViews) * 100;
                    return (
                      <tr key={page.page} className="hover:bg-neutral-50">
                        <td className="px-4 py-3">
                          <span className="font-body text-sm text-black font-mono">{page.page}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-body text-sm font-semibold text-black">{page.views}</td>
                        <td className="px-4 py-3 text-right font-body text-sm text-neutral-600">{formatDuration(page.avg_duration)}</td>
                        <td className="px-4 py-3 text-right font-body text-sm text-neutral-600">{page.avg_scroll}%</td>
                        <td className="px-4 py-3 w-32">
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-black rounded-full transition-all" style={{ width: `${barWidth}%` }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ALL VISITORS TAB */}
        {activeTab === 'visitors' && (
          <div>
            {recentVisitors.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-body text-neutral-500">No visitors yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Visitor</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">First Page</th>
                    <th className="text-right px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Pages</th>
                    <th className="text-right px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Visits</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Device</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Source</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentVisitors.map(v => (
                    <tr key={v.visitor_id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <span className="font-body text-sm text-black">{v.email || v.visitor_id.substring(0, 12)}</span>
                      </td>
                      <td className="px-4 py-3">
                        {v.signed_up ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-medium">Signed Up</span>
                        ) : v.email ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium">Email Captured</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full text-[10px] font-medium">Anonymous</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-neutral-600 font-mono">{v.first_page || '—'}</td>
                      <td className="px-4 py-3 text-right font-body text-sm text-neutral-700">{v.total_page_views}</td>
                      <td className="px-4 py-3 text-right font-body text-sm text-neutral-700">{v.total_visits}</td>
                      <td className="px-4 py-3 font-body text-sm text-neutral-500">{v.device || '—'}</td>
                      <td className="px-4 py-3 font-body text-sm text-neutral-500">{v.utm_source || 'Direct'}</td>
                      <td className="px-4 py-3 font-body text-xs text-neutral-400">{formatTimeAgo(v.last_seen)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* EMAIL CAPTURES TAB */}
        {activeTab === 'emails' && (
          <div>
            {emailCaptures.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">📧</div>
                <p className="font-body text-neutral-500">No emails captured yet</p>
                <p className="font-body text-xs text-neutral-400 mt-1">Emails are captured from form inputs and exit-intent popups</p>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                  <p className="font-body text-sm text-neutral-500">{emailCaptures.length} emails captured</p>
                  <button
                    onClick={() => {
                      const csv = 'Email,Source,Page,Converted,Date\n' +
                        emailCaptures.map(e => `${e.email},${e.source},${e.page},${e.converted},${e.created_at}`).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = 'email-captures.csv'; a.click();
                    }}
                    className="px-3 py-1.5 bg-black text-white rounded-lg font-body text-xs font-medium hover:bg-black/80"
                  >
                    Export CSV ↓
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Email</th>
                      <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Source</th>
                      <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Page</th>
                      <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Status</th>
                      <th className="text-left px-4 py-3 font-body text-xs font-medium text-neutral-500 uppercase">Captured</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {emailCaptures.map(e => (
                      <tr key={e.id} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 font-body text-sm font-medium text-black">{e.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            e.source === 'exit_intent' ? 'bg-purple-100 text-purple-700' :
                            e.source === 'form_input' ? 'bg-blue-100 text-blue-700' :
                            'bg-neutral-100 text-neutral-500'
                          }`}>
                            {e.source}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-neutral-600 font-mono">{e.page}</td>
                        <td className="px-4 py-3">
                          {e.converted ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-medium">Converted</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium">Lead</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-body text-xs text-neutral-400">{formatTimeAgo(e.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        {/* SEGMENTS TAB */}
        {activeTab === 'segments' && (
          <div className="p-6 space-y-4">
            <p className="font-body text-sm text-neutral-500 mb-6">Pre-built audience segments for retargeting</p>
            
            {[
              {
                name: 'Visited but didn\'t sign up',
                desc: 'Viewed 2+ pages but never created an account',
                count: segments.visitedDidntSignUp,
                icon: '🎯', color: 'border-red-200 bg-red-50',
              },
              {
                name: 'Started registration',
                desc: 'Entered email but didn\'t complete signup',
                count: segments.startedRegister,
                icon: '📝', color: 'border-amber-200 bg-amber-50',
              },
              {
                name: 'Returning visitors',
                desc: 'Came back more than once',
                count: segments.returningVisitors,
                icon: '🔄', color: 'border-blue-200 bg-blue-50',
              },
              {
                name: 'Mobile visitors',
                desc: 'Browsing from phone or tablet',
                count: segments.mobileVisitors,
                icon: '📱', color: 'border-purple-200 bg-purple-50',
              },
              {
                name: 'Email captured (not converted)',
                desc: 'Have email but didn\'t sign up — perfect for follow-up',
                count: segments.withEmail,
                icon: '📧', color: 'border-emerald-200 bg-emerald-50',
              },
            ].map(seg => (
              <div key={seg.name} className={`${seg.color} border rounded-xl p-5 flex items-center justify-between`}>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{seg.icon}</span>
                  <div>
                    <p className="font-body text-sm font-semibold text-black">{seg.name}</p>
                    <p className="font-body text-xs text-neutral-500 mt-0.5">{seg.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-semibold text-black">{seg.count}</span>
                  <button
                    onClick={() => {
                      // Export segment as CSV
                      let data: Visitor[] = [];
                      if (seg.name.includes('didn\'t sign up')) data = recentVisitors.filter(v => !v.signed_up && v.total_page_views >= 2);
                      if (seg.name.includes('Started')) data = recentVisitors.filter(v => !v.signed_up && v.email);
                      if (seg.name.includes('Returning')) data = recentVisitors.filter(v => v.total_visits > 1);
                      if (seg.name.includes('Mobile')) data = recentVisitors.filter(v => v.device === 'mobile');
                      
                      if (data.length === 0 && seg.name.includes('Email')) {
                        // Use email captures instead
                        const csv = 'Email,Source,Page,Date\n' +
                          emailCaptures.filter(e => !e.converted).map(e => `${e.email},${e.source},${e.page},${e.created_at}`).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a'); a.href = url; a.download = `segment-${seg.name.toLowerCase().replace(/\s/g, '-')}.csv`; a.click();
                        return;
                      }

                      const csv = 'Visitor ID,Email,Device,Pages Viewed,Visits,First Page,Source,Last Seen\n' +
                        data.map(v => `${v.visitor_id},${v.email || ''},${v.device || ''},${v.total_page_views},${v.total_visits},${v.first_page || ''},${v.utm_source || 'Direct'},${v.last_seen}`).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a'); a.href = url; a.download = `segment-${seg.name.toLowerCase().replace(/\s/g, '-')}.csv`; a.click();
                    }}
                    className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg font-body text-xs font-medium hover:bg-neutral-50 transition-colors"
                  >
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full font-body text-xs flex items-center gap-2 shadow-lg">
          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Refreshing...
        </div>
      )}
    </div>
  );
}
