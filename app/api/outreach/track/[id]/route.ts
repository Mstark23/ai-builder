// app/api/outreach/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get('status') || 'all';

  try {
    const today = new Date().toISOString().split('T')[0];

    // Today's metrics
    const { data: metrics } = await supabaseAdmin
      .from('outreach_metrics').select('*').eq('date', today).maybeSingle();

    // Leads
    let q = supabaseAdmin.from('outreach_leads').select('*').order('created_at', { ascending: false }).limit(100);
    if (status !== 'all') q = q.eq('status', status);
    const { data: leads } = await q;

    // Stats
    const statuses = ['', 'qualified', 'in_sequence', 'engaged', 'replied', 'converted'];
    const counts = await Promise.all(
      statuses.map(s => {
        let q2 = supabaseAdmin.from('outreach_leads').select('*', { count: 'exact', head: true });
        if (s) q2 = q2.eq('status', s);
        return q2;
      })
    );

    // Domains
    const { data: domains } = await supabaseAdmin
      .from('outreach_domains').select('*').order('created_at');

    // Phones
    const { data: phones } = await supabaseAdmin
      .from('outreach_phones').select('*').order('created_at');

    // Campaigns
    const { data: campaigns } = await supabaseAdmin
      .from('outreach_campaigns').select('*').order('created_at');

    // Recent messages
    const { data: recentMessages } = await supabaseAdmin
      .from('outreach_messages')
      .select('*, outreach_leads(first_name, company_name)')
      .in('status', ['sent', 'opened', 'clicked'])
      .order('sent_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      metrics: metrics || { date: today, leads_imported: 0, leads_scored: 0, leads_qualified: 0, emails_sent: 0, sms_sent: 0, emails_opened: 0, link_clicks: 0, preview_requests: 0, conversions: 0 },
      leads: leads || [],
      stats: {
        total: counts[0].count || 0,
        qualified: counts[1].count || 0,
        in_sequence: counts[2].count || 0,
        engaged: counts[3].count || 0,
        replied: counts[4].count || 0,
        converted: counts[5].count || 0,
      },
      domains: domains || [],
      phones: phones || [],
      campaigns: campaigns || [],
      recentMessages: recentMessages || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: manage campaigns, domains, phones from admin UI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Add campaign
    if (action === 'add_campaign') {
      const { error } = await supabaseAdmin.from('outreach_campaigns').insert({
        name: body.name,
        industry: body.industry,
        city: body.city || null,
        state: body.state || null,
        country: body.country || 'United States',
        leads_per_day: body.leads_per_day || 50,
        is_active: true,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    // Toggle campaign active/inactive
    if (action === 'toggle_campaign') {
      const { data: c } = await supabaseAdmin.from('outreach_campaigns').select('is_active').eq('id', body.id).single();
      if (c) await supabaseAdmin.from('outreach_campaigns').update({ is_active: !c.is_active }).eq('id', body.id);
      return NextResponse.json({ ok: true });
    }

    // Add domain
    if (action === 'add_domain') {
      const { error } = await supabaseAdmin.from('outreach_domains').insert({
        domain: body.domain,
        provider: body.provider || 'zoho',
        mailboxes: body.mailboxes || [],
        dns_verified: body.dns_verified || false,
        warmup_started_at: body.warmup_started ? new Date().toISOString() : null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    // Mark domain DNS verified + start warmup
    if (action === 'verify_domain') {
      await supabaseAdmin.from('outreach_domains').update({
        dns_verified: true, spf_set: true, dkim_set: true, dmarc_set: true,
        warmup_started_at: new Date().toISOString(),
      }).eq('id', body.id);
      return NextResponse.json({ ok: true });
    }

    // Force-activate domain (skip warmup — for already-aged domains)
    if (action === 'activate_domain') {
      await supabaseAdmin.from('outreach_domains').update({
        warmup_done: true, is_active: true, daily_limit: body.daily_limit || 50,
      }).eq('id', body.id);
      return NextResponse.json({ ok: true });
    }

    // Add phone number
    if (action === 'add_phone') {
      const { error } = await supabaseAdmin.from('outreach_phones').insert({
        phone_number: body.phone_number,
        friendly_name: body.friendly_name || 'Outreach',
        is_active: true,
        is_10dlc: body.is_10dlc || false,
        daily_limit: body.is_10dlc ? 3000 : 200,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    // Mark phone as 10DLC registered
    if (action === 'mark_10dlc') {
      await supabaseAdmin.from('outreach_phones').update({
        is_10dlc: true, daily_limit: 3000,
      }).eq('id', body.id);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
