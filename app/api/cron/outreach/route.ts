// app/api/cron/outreach/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const action = request.nextUrl.searchParams.get('action');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    if (action === 'morning') {
      console.log('═══ OUTREACH MORNING PIPELINE ═══');
      const start = Date.now();

      // 1. Apollo import (skip errors gracefully)
      let totalImported = 0, totalErrors = 0;
      if (process.env.APOLLO_API_KEY) {
        try {
          const { extractLeads } = await import('@/lib/outreach/apollo');
          const { data: campaigns } = await supabase
            .from('outreach_campaigns')
            .select('*')
            .eq('is_active', true);

          if (campaigns?.length) {
            for (const c of campaigns) {
              console.log(`[Pipeline] Source: Apollo for ${c.name}`);
              const result = await extractLeads({
                industry: c.industry,
                city: c.city,
                country: c.country || 'United States',
                limit: c.leads_per_day || 50,
                campaign: c.name,
              });
              totalImported += result.imported;
              totalErrors += result.errors;
            }
          }
        } catch (e: any) {
          console.error(`[Apollo] Error: ${e.message}`);
          totalErrors++;
        }
      }
      console.log(`[Pipeline] Import: ${totalImported} leads`);

      // 2. Score — directly in handler
      const { data: newLeads, error: scoreErr } = await supabase
        .from('outreach_leads')
        .select('id, company_website, company_name')
        .eq('status', 'new')
        .order('created_at')
        .limit(50);

      console.log(`[Scorer] Found ${newLeads?.length || 0} new leads${scoreErr ? `, error: ${scoreErr.message}` : ''}`);

      let scored = 0, qualified = 0, disqualified = 0;

      if (newLeads?.length) {
        for (const lead of newLeads) {
          await supabase.from('outreach_leads').update({ status: 'scoring' }).eq('id', lead.id);

          let perf = 0;
          const issues: string[] = [];
          try {
            const params = new URLSearchParams({ url: lead.company_website, strategy: 'mobile', category: 'performance' });
            const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`, { signal: AbortSignal.timeout(25000) });
            if (res.ok) {
              const data = await res.json();
              const lh = data.lighthouseResult;
              perf = Math.round((lh?.categories?.performance?.score || 0) * 100);
              if (perf < 30) issues.push(`Extremely slow — ${perf}/100`);
              else if (perf < 50) issues.push(`Slow — ${perf}/100`);
              else if (perf < 70) issues.push(`Below average — ${perf}/100`);
            } else {
              issues.push('Site unreachable');
            }
          } catch {
            issues.push('Site timed out');
          }

          let priority: string, status: string;
          if (perf < 40) { priority = 'hot'; status = 'qualified'; qualified++; }
          else if (perf < 70) { priority = 'warm'; status = 'qualified'; qualified++; }
          else { priority = 'low'; status = 'disqualified'; disqualified++; }

          await supabase.from('outreach_leads').update({
            site_score: perf, site_issues: issues.length ? issues : ['Could use a refresh'], priority, status,
            updated_at: new Date().toISOString(),
          }).eq('id', lead.id);

          scored++;
          console.log(`[Scorer] ${lead.company_name}: ${perf}/100 → ${priority}`);
          await new Promise(r => setTimeout(r, 1500));
        }
      }

      console.log(`[Pipeline] Score: ${qualified} qualified`);

      // 3. Assign sequences
      const { data: qualifiedLeads } = await supabase
        .from('outreach_leads')
        .select('id, first_name, company_name, email, phone, site_score, industry')
        .eq('status', 'qualified')
        .is('sequence_step', null)
        .limit(100);

      console.log(`[Sequence] ${qualifiedLeads?.length || 0} qualified leads need sequences`);

      let assigned = 0;
      if (qualifiedLeads?.length) {
        const now = new Date();
        for (const lead of qualifiedLeads) {
          if (!lead.phone && !lead.email) continue;

          const steps = [
            { step: 1, channel: 'sms', delay_days: 0 },
            { step: 2, channel: 'sms', delay_days: 2 },
            { step: 3, channel: 'sms', delay_days: 5 },
            { step: 4, channel: 'sms', delay_days: 8 },
          ];

          for (const s of steps) {
            const sendAt = new Date(now);
            sendAt.setDate(sendAt.getDate() + s.delay_days);
            sendAt.setHours(9 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0, 0);

            await supabase.from('outreach_messages').insert({
              lead_id: lead.id,
              channel: s.channel,
              step: s.step,
              status: 'pending',
              scheduled_at: sendAt.toISOString(),
            });
          }

          await supabase.from('outreach_leads').update({
            status: 'sequenced',
            sequence_step: 1,
          }).eq('id', lead.id);

          assigned++;
        }
      }

      console.log(`[Pipeline] Sequences: ${assigned} assigned`);

      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`═══ PIPELINE DONE (${elapsed}s) ═══`);

      return NextResponse.json({
        ok: true,
        leads: { imported: totalImported, errors: totalErrors },
        scoring: { scored, qualified, disqualified },
        sequences: { assigned, mode: 'sms-only' },
        elapsed,
      });
    }

    if (action === 'send') {
      const { sendDueSms } = await import('@/lib/outreach/sms-sender');
      const { sendDueEmails } = await import('@/lib/outreach/email-sender');
      const sms = await sendDueSms(30);
      const email = await sendDueEmails(30);
      return NextResponse.json({ ok: true, sms, email });
    }

    if (action === 'reset') {
      const { resetDailyCounts } = await import('@/lib/outreach/pipeline');
      await resetDailyCounts();
      return NextResponse.json({ ok: true, action: 'reset' });
    }

    return NextResponse.json({ error: 'Unknown action. Use: morning, send, reset' }, { status: 400 });
  } catch (err: any) {
    console.error(`[Cron] ${action} failed:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
