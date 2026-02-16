// app/admin/(protected)/outreach/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';

// ── Types ──
interface Metrics { date: string; leads_imported: number; leads_scored: number; leads_qualified: number; emails_sent: number; sms_sent: number; emails_opened: number; link_clicks: number; preview_requests: number; conversions: number; }
interface Lead { id: string; first_name: string; last_name: string; email: string; phone: string; company_name: string; company_website: string; industry: string; site_score: number | null; site_issues: string[]; status: string; priority: string | null; created_at: string; city: string | null; campaign: string | null; }
interface Domain { id: string; domain: string; provider: string; dns_verified: boolean; warmup_done: boolean; is_active: boolean; daily_sent: number; daily_limit: number; total_sent: number; mailboxes: string[]; warmup_started_at: string | null; }
interface Phone { id: string; phone_number: string; friendly_name: string; is_active: boolean; is_10dlc: boolean; daily_sent: number; daily_limit: number; }
interface Campaign { id: string; name: string; industry: string; city: string | null; leads_per_day: number; is_active: boolean; total_leads: number; total_converted: number; }
interface Message { id: string; channel: string; to_address: string; status: string; sent_at: string; step: number; outreach_leads: { first_name: string; company_name: string; } | null; }

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-gray-100 text-gray-600', scoring: 'bg-blue-50 text-blue-600',
  qualified: 'bg-green-50 text-green-600', disqualified: 'bg-red-50 text-red-400',
  in_sequence: 'bg-purple-50 text-purple-600', engaged: 'bg-yellow-50 text-yellow-700',
  replied: 'bg-orange-50 text-orange-600', converted: 'bg-emerald-50 text-emerald-600',
  unsubscribed: 'bg-gray-50 text-gray-400', bounced: 'bg-red-50 text-red-400',
};

export default function OutreachDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'leads' | 'infrastructure' | 'campaigns'>('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [running, setRunning] = useState<string | null>(null);

  // ── Forms ──
  const [newCampaign, setNewCampaign] = useState({ name: '', industry: '', city: '', leads_per_day: 50 });
  const [newDomain, setNewDomain] = useState({ domain: '', mailboxes: '' });
  const [newPhone, setNewPhone] = useState({ phone_number: '', friendly_name: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/outreach/dashboard?status=${statusFilter}`);
      if (res.ok) setData(await res.json());
    } catch {}
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function runCron(action: string) {
    setRunning(action);
    try {
      const secret = prompt('CRON_SECRET:');
      if (!secret) { setRunning(null); return; }
      const res = await fetch(`/api/cron/outreach?action=${action}&secret=${secret}`);
      const d = await res.json();
      alert(JSON.stringify(d, null, 2));
      load();
    } catch (e: any) { alert(e.message); }
    setRunning(null);
  }

  async function postAction(action: string, payload: Record<string, any> = {}) {
    try {
      const res = await fetch('/api/outreach/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
      const d = await res.json();
      if (d.error) alert(d.error);
      else load();
    } catch (e: any) { alert(e.message); }
  }

  if (loading && !data) return <div className="p-8 text-gray-400">Loading outreach data...</div>;
  if (!data) return <div className="p-8 text-red-500">Failed to load</div>;

  const { metrics, leads, stats, domains, phones, campaigns, recentMessages } = data as {
    metrics: Metrics; leads: Lead[]; stats: Record<string, number>;
    domains: Domain[]; phones: Phone[]; campaigns: Campaign[]; recentMessages: Message[];
  };

  const warmedDomains = domains.filter((d: Domain) => d.warmup_done && d.is_active);
  const warmingDomains = domains.filter((d: Domain) => !d.warmup_done);
  const emailCapacity = warmedDomains.reduce((s: number, d: Domain) => s + d.daily_limit, 0);
  const smsCapacity = phones.reduce((s: number, p: Phone) => s + p.daily_limit, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Outreach Pipeline</h1>
          <p className="text-sm text-gray-400 mt-1">
            {emailCapacity > 0
              ? `📧 ${emailCapacity} emails/day + 📱 ${smsCapacity} SMS/day capacity`
              : `📱 SMS-only mode — ${smsCapacity} SMS/day capacity. Add domains for email.`}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => runCron('morning')} disabled={!!running}
            className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50">
            {running === 'morning' ? '⏳ Running...' : '▶ Morning Pipeline'}
          </button>
          <button onClick={() => runCron('send')} disabled={!!running}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50">
            {running === 'send' ? '⏳ Sending...' : '📤 Send Now'}
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-1 mb-6 border-b">
        {(['overview', 'leads', 'infrastructure', 'campaigns'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${tab === t ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            {t === 'overview' ? '📊 Overview' : t === 'leads' ? '👥 Leads' : t === 'infrastructure' ? '⚙️ Infrastructure' : '🎯 Campaigns'}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {[
              { l: 'Total Leads', v: stats.total, c: '' },
              { l: 'Qualified', v: stats.qualified, c: 'text-green-600' },
              { l: 'In Sequence', v: stats.in_sequence, c: 'text-purple-600' },
              { l: 'Engaged', v: stats.engaged, c: 'text-yellow-600' },
              { l: 'Replied', v: stats.replied, c: 'text-orange-600' },
              { l: 'Converted', v: stats.converted, c: 'text-emerald-600' },
            ].map(s => (
              <div key={s.l} className="bg-white rounded-xl border p-4">
                <p className="text-xs text-gray-400 font-medium">{s.l}</p>
                <p className={`text-2xl font-bold mt-1 ${s.c}`}>{s.v}</p>
              </div>
            ))}
          </div>

          {/* Today */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">TODAY — {metrics.date}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 text-center">
              {[
                { l: 'Imported', v: metrics.leads_imported },
                { l: 'Qualified', v: metrics.leads_qualified },
                { l: 'SMS Sent', v: metrics.sms_sent },
                { l: 'Emails Sent', v: metrics.emails_sent },
                { l: 'Opened', v: metrics.emails_opened },
              ].map(m => (
                <div key={m.l}><p className="text-xs text-gray-400">{m.l}</p><p className="text-xl font-bold">{m.v}</p></div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">RECENT ACTIVITY</h3>
            {recentMessages.length === 0 ? (
              <p className="text-gray-300 text-sm">No messages sent yet. Run the morning pipeline to start.</p>
            ) : (
              <div className="space-y-2">
                {recentMessages.slice(0, 10).map((m: Message) => (
                  <div key={m.id} className="flex items-center gap-3 text-sm">
                    <span className={`w-6 text-center ${m.channel === 'sms' ? '' : ''}`}>{m.channel === 'sms' ? '📱' : '📧'}</span>
                    <span className="text-gray-600 flex-1">
                      Step {m.step} → <strong>{m.outreach_leads?.company_name || m.to_address}</strong>
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLORS[m.status] || 'bg-gray-100'}`}>{m.status}</span>
                    <span className="text-xs text-gray-300">{m.sent_at ? new Date(m.sent_at).toLocaleTimeString() : '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ LEADS TAB ═══ */}
      {tab === 'leads' && (
        <div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {['all', 'new', 'qualified', 'in_sequence', 'engaged', 'replied', 'converted', 'disqualified', 'bounced', 'unsubscribed'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border ${statusFilter === s ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                {s === 'all' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Business</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Industry</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Score</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Campaign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-300">No leads. Run morning pipeline.</td></tr>
                ) : leads.map((l: Lead) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{l.company_name}</p>
                      <p className="text-xs text-gray-400">{l.first_name} · {l.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{l.industry}</td>
                    <td className="px-4 py-3">
                      {l.site_score !== null ? (
                        <span className={`font-bold ${l.site_score < 40 ? 'text-red-500' : l.site_score < 70 ? 'text-orange-500' : 'text-green-500'}`}>{l.site_score}</span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {l.priority && <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${l.priority === 'hot' ? 'bg-red-500 text-white' : l.priority === 'warm' ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600'}`}>{l.priority.toUpperCase()}</span>}
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[l.status] || 'bg-gray-100'}`}>{l.status.replace('_', ' ')}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-400">{l.phone || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{l.campaign || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ INFRASTRUCTURE TAB ═══ */}
      {tab === 'infrastructure' && (
        <div className="space-y-8">
          {/* ── Phone Numbers ── */}
          <div>
            <h3 className="text-lg font-semibold mb-3">📱 Twilio Phone Numbers</h3>
            <div className="bg-white rounded-xl border overflow-hidden mb-4">
              {phones.length === 0 ? (
                <p className="p-6 text-gray-300 text-sm">No phone numbers. Add your Twilio number below.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>
                    <th className="text-left px-4 py-2 text-xs text-gray-400">Number</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400">Name</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400">10DLC</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400">Today</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400">Limit</th>
                    <th className="px-4 py-2"></th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {phones.map((p: Phone) => (
                      <tr key={p.id}>
                        <td className="px-4 py-3 font-mono text-sm">{p.phone_number}</td>
                        <td className="px-4 py-3 text-gray-500">{p.friendly_name}</td>
                        <td className="px-4 py-3">{p.is_10dlc ? <span className="text-green-600 font-bold">✓ Yes</span> : <span className="text-orange-500">No</span>}</td>
                        <td className="px-4 py-3">{p.daily_sent}</td>
                        <td className="px-4 py-3">{p.daily_limit}/day</td>
                        <td className="px-4 py-3">{!p.is_10dlc && <button onClick={() => postAction('mark_10dlc', { id: p.id })} className="text-xs text-blue-500 hover:underline">Mark 10DLC ✓</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex gap-2">
              <input value={newPhone.phone_number} onChange={e => setNewPhone({ ...newPhone, phone_number: e.target.value })}
                placeholder="+15551234567" className="px-3 py-2 border rounded-lg text-sm flex-1" />
              <input value={newPhone.friendly_name} onChange={e => setNewPhone({ ...newPhone, friendly_name: e.target.value })}
                placeholder="Name (optional)" className="px-3 py-2 border rounded-lg text-sm w-40" />
              <button onClick={() => { postAction('add_phone', newPhone); setNewPhone({ phone_number: '', friendly_name: '' }); }}
                className="px-4 py-2 bg-black text-white text-sm rounded-lg">Add Number</button>
            </div>
          </div>

          {/* ── Email Domains ── */}
          <div>
            <h3 className="text-lg font-semibold mb-3">📧 Email Domains</h3>
            {warmedDomains.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <p className="text-green-700 text-sm font-medium">✅ {warmedDomains.length} domain{warmedDomains.length > 1 ? 's' : ''} active — email sending enabled ({emailCapacity} emails/day)</p>
              </div>
            )}
            {warmedDomains.length === 0 && domains.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <p className="text-yellow-700 text-sm font-medium">⏳ {warmingDomains.length} domain{warmingDomains.length > 1 ? 's' : ''} warming up — SMS-only mode until warmup completes</p>
              </div>
            )}
            {domains.length === 0 && (
              <div className="bg-gray-50 border rounded-xl p-4 mb-4">
                <p className="text-gray-500 text-sm">No email domains yet. SMS-only mode. Add domains below when ready.</p>
              </div>
            )}
            <div className="bg-white rounded-xl border overflow-hidden mb-4">
              {domains.length > 0 && (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>
                    <th className="text-left px-4 py-2 text-xs text-gray-400">Domain</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400">DNS</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400">Warmup</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400">Status</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400">Today</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400">Mailboxes</th>
                    <th className="px-4 py-2"></th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {domains.map((d: Domain) => {
                      const warmDays = d.warmup_started_at ? Math.floor((Date.now() - new Date(d.warmup_started_at).getTime()) / 86400000) : 0;
                      return (
                        <tr key={d.id}>
                          <td className="px-4 py-3 font-medium">{d.domain}</td>
                          <td className="px-4 py-3">{d.dns_verified ? <span className="text-green-600">✓</span> : <span className="text-red-400">✗</span>}</td>
                          <td className="px-4 py-3">
                            {d.warmup_done ? <span className="text-green-600">Done</span> : d.warmup_started_at ? <span className="text-orange-500">{warmDays}/14 days</span> : <span className="text-gray-300">Not started</span>}
                          </td>
                          <td className="px-4 py-3">
                            {d.is_active ? <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">Active</span> : <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">Inactive</span>}
                          </td>
                          <td className="px-4 py-3">{d.daily_sent}/{d.daily_limit}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{(d.mailboxes || []).length}</td>
                          <td className="px-4 py-3 space-x-2">
                            {!d.dns_verified && <button onClick={() => postAction('verify_domain', { id: d.id })} className="text-xs text-blue-500 hover:underline">Verify DNS</button>}
                            {d.dns_verified && !d.is_active && <button onClick={() => postAction('activate_domain', { id: d.id })} className="text-xs text-green-500 hover:underline">Force Activate</button>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex gap-2">
              <input value={newDomain.domain} onChange={e => setNewDomain({ ...newDomain, domain: e.target.value })}
                placeholder="getvektorlabs.com" className="px-3 py-2 border rounded-lg text-sm flex-1" />
              <input value={newDomain.mailboxes} onChange={e => setNewDomain({ ...newDomain, mailboxes: e.target.value })}
                placeholder="jhordan@, hello@, team@ (comma sep)" className="px-3 py-2 border rounded-lg text-sm flex-1" />
              <button onClick={() => {
                const mbs = newDomain.mailboxes.split(',').map(m => {
                  const trimmed = m.trim();
                  return trimmed.includes('@') ? trimmed : `${trimmed}@${newDomain.domain}`;
                }).filter(Boolean);
                postAction('add_domain', { domain: newDomain.domain, mailboxes: mbs, warmup_started: true });
                setNewDomain({ domain: '', mailboxes: '' });
              }} className="px-4 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap">Add Domain</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CAMPAIGNS TAB ═══ */}
      {tab === 'campaigns' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border overflow-hidden">
            {campaigns.length === 0 ? (
              <p className="p-6 text-gray-300 text-sm">No campaigns. Create one below to start.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  <th className="text-left px-4 py-2 text-xs text-gray-400">Campaign</th>
                  <th className="text-left px-4 py-2 text-xs text-gray-400">Industry</th>
                  <th className="text-left px-4 py-2 text-xs text-gray-400">City</th>
                  <th className="text-left px-4 py-2 text-xs text-gray-400">Leads/Day</th>
                  <th className="text-left px-4 py-2 text-xs text-gray-400">Total Leads</th>
                  <th className="text-left px-4 py-2 text-xs text-gray-400">Status</th>
                  <th className="px-4 py-2"></th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {campaigns.map((c: Campaign) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-gray-500">{c.industry}</td>
                      <td className="px-4 py-3 text-gray-500">{c.city || 'Any'}</td>
                      <td className="px-4 py-3">{c.leads_per_day}</td>
                      <td className="px-4 py-3">{c.total_leads}</td>
                      <td className="px-4 py-3">
                        {c.is_active ? <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">Active</span> : <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">Paused</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => postAction('toggle_campaign', { id: c.id })} className="text-xs text-blue-500 hover:underline">
                          {c.is_active ? 'Pause' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white rounded-xl border p-5">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">NEW CAMPAIGN</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <input value={newCampaign.name} onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                placeholder="restaurants-montreal" className="px-3 py-2 border rounded-lg text-sm" />
              <input value={newCampaign.industry} onChange={e => setNewCampaign({ ...newCampaign, industry: e.target.value })}
                placeholder="restaurant" className="px-3 py-2 border rounded-lg text-sm" />
              <input value={newCampaign.city} onChange={e => setNewCampaign({ ...newCampaign, city: e.target.value })}
                placeholder="Montreal (optional)" className="px-3 py-2 border rounded-lg text-sm" />
              <div className="flex gap-2">
                <input type="number" value={newCampaign.leads_per_day} onChange={e => setNewCampaign({ ...newCampaign, leads_per_day: +e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm w-20" />
                <button onClick={() => {
                  if (!newCampaign.name || !newCampaign.industry) { alert('Name and industry required'); return; }
                  postAction('add_campaign', newCampaign);
                  setNewCampaign({ name: '', industry: '', city: '', leads_per_day: 50 });
                }} className="px-4 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
