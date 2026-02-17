// lib/outreach/pipeline.ts
// ═══════════════════════════════════════════════
// MINIMAL PIPELINE — scoring & sequences now handled inline in route.ts
// This file only exports trackSends and resetDailyCounts for backwards compat
// ═══════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Update send metrics after sending batches
export async function trackSends(emailsSent: number, smsSent: number) {
  const supabase = getSupabase();
  const today = new Date().toISOString().split('T')[0];
  const { data: m } = await supabase
    .from('outreach_metrics').select('*').eq('date', today).maybeSingle();

  if (m) {
    await supabase.from('outreach_metrics').update({
      emails_sent: (m.emails_sent || 0) + emailsSent,
      sms_sent: (m.sms_sent || 0) + smsSent,
    }).eq('date', today);
  } else {
    await supabase.from('outreach_metrics').insert({
      date: today, emails_sent: emailsSent, sms_sent: smsSent,
    });
  }
}

// Reset daily send counts (midnight cron)
export async function resetDailyCounts() {
  const supabase = getSupabase();
  await supabase.from('outreach_domains').update({ daily_sent: 0 }).neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('outreach_phones').update({ daily_sent: 0 }).neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('[Reset] Daily send counts reset');
}
