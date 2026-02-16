// lib/outreach/pipeline.ts
// ═══════════════════════════════════════════════
// MASTER PIPELINE
// ═══════════════════════════════════════════════
// Morning: Apollo → Score → Assign sequences
// Checks warmup status automatically.
// ═══════════════════════════════════════════════

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { extractLeads } from './apollo';
import { scoreNewLeads } from './scorer';
import { assignSequences } from './sequence';
import { checkWarmupStatus } from './email-sender';

export async function runMorningPipeline() {
  console.log('═══ OUTREACH MORNING PIPELINE ═══');
  const start = Date.now();

  // 0. Check if any domains finished warmup
  await checkWarmupStatus();

  // 1. Get active campaigns
  const { data: campaigns } = await supabaseAdmin
    .from('outreach_campaigns')
    .select('*')
    .eq('is_active', true);

  // 2. Import leads from each campaign
  let totalImported = 0, totalSkipped = 0, totalErrors = 0;

  if (campaigns?.length) {
    for (const c of campaigns) {
      const result = await extractLeads({
        industry: c.industry,
        city: c.city,
        country: c.country || 'United States',
        limit: c.leads_per_day || 50,
        campaign: c.name,
      });
      totalImported += result.imported;
      totalSkipped += result.skipped;
      totalErrors += result.errors;

      // Update campaign stats
      await supabaseAdmin.from('outreach_campaigns').update({
        total_leads: (c.total_leads || 0) + result.imported,
      }).eq('id', c.id);
    }
  } else {
    // No campaigns in DB yet — use env fallback
    const result = await extractLeads({
      industry: process.env.OUTREACH_DEFAULT_INDUSTRY || 'restaurant',
      city: process.env.OUTREACH_DEFAULT_CITY || 'Montreal',
      limit: 50,
      campaign: 'default',
    });
    totalImported = result.imported;
    totalSkipped = result.skipped;
    totalErrors = result.errors;
  }

  console.log(`[Pipeline] Import: ${totalImported} leads`);

  // 3. Score websites
  const scoring = await scoreNewLeads(50);
  console.log(`[Pipeline] Score: ${scoring.qualified} qualified`);

  // 4. Assign sequences (auto-detects SMS-only vs SMS+Email)
  const sequences = await assignSequences(100);
  console.log(`[Pipeline] Sequences: ${sequences.assigned} assigned (${sequences.mode})`);

  // 5. Update daily metrics
  const today = new Date().toISOString().split('T')[0];
  const { data: existing } = await supabaseAdmin
    .from('outreach_metrics').select('*').eq('date', today).maybeSingle();

  if (existing) {
    await supabaseAdmin.from('outreach_metrics').update({
      leads_imported: (existing.leads_imported || 0) + totalImported,
      leads_scored: (existing.leads_scored || 0) + scoring.scored,
      leads_qualified: (existing.leads_qualified || 0) + scoring.qualified,
    }).eq('date', today);
  } else {
    await supabaseAdmin.from('outreach_metrics').insert({
      date: today,
      leads_imported: totalImported,
      leads_scored: scoring.scored,
      leads_qualified: scoring.qualified,
    });
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`═══ PIPELINE DONE (${elapsed}s) ═══`);

  return {
    leads: { imported: totalImported, skipped: totalSkipped, errors: totalErrors },
    scoring,
    sequences,
    elapsed,
  };
}

// Update send metrics after sending batches
export async function trackSends(emailsSent: number, smsSent: number) {
  const today = new Date().toISOString().split('T')[0];
  const { data: m } = await supabaseAdmin
    .from('outreach_metrics').select('*').eq('date', today).maybeSingle();

  if (m) {
    await supabaseAdmin.from('outreach_metrics').update({
      emails_sent: (m.emails_sent || 0) + emailsSent,
      sms_sent: (m.sms_sent || 0) + smsSent,
    }).eq('date', today);
  } else {
    await supabaseAdmin.from('outreach_metrics').insert({
      date: today, emails_sent: emailsSent, sms_sent: smsSent,
    });
  }
}

// Reset daily send counts (midnight cron)
export async function resetDailyCounts() {
  await supabaseAdmin.from('outreach_domains').update({ daily_sent: 0 }).neq('id', '00000000-0000-0000-0000-000000000000');
  await supabaseAdmin.from('outreach_phones').update({ daily_sent: 0 }).neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('[Reset] Daily send counts reset');
}
