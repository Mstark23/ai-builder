// lib/outreach/sequence.ts
// ═══════════════════════════════════════════════
// SEQUENCE MANAGER
// ═══════════════════════════════════════════════
// Creates sequences based on what's available:
//   - No warmed domains? SMS-only sequence (4 texts over 8 days)
//   - Warmed domains? SMS + Email sequence (4 SMS + 4 emails over 10 days)
//
// The system auto-detects. No manual switch needed.
// ═══════════════════════════════════════════════

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sms1, sms2, sms3, sms4, email1, email2, email3, email4, type LeadInfo } from './templates';

// Check if any email domains are warmed and ready
async function hasWarmedDomains(): Promise<boolean> {
  const { count } = await supabaseAdmin
    .from('outreach_domains')
    .select('*', { count: 'exact', head: true })
    .eq('warmup_done', true)
    .eq('is_active', true);
  return (count || 0) > 0;
}

// SMS-ONLY sequence (Days 1-14 of your system, or forever if no email domains)
const SMS_ONLY_STEPS = [
  { step: 1, days: 0, channel: 'sms', smsGen: sms1 },
  { step: 2, days: 2, channel: 'sms', smsGen: sms2 },
  { step: 3, days: 5, channel: 'sms', smsGen: sms3 },
  { step: 4, days: 8, channel: 'sms', smsGen: sms4 },
];

// SMS + EMAIL sequence (after domains are warm)
const FULL_STEPS = [
  { step: 1, days: 0,  channel: 'sms',   smsGen: sms1, emailGen: null },
  { step: 2, days: 1,  channel: 'email', smsGen: null,  emailGen: email1 },
  { step: 3, days: 2,  channel: 'sms',   smsGen: sms2, emailGen: null },
  { step: 4, days: 3,  channel: 'email', smsGen: null,  emailGen: email2 },
  { step: 5, days: 5,  channel: 'sms',   smsGen: sms3, emailGen: null },
  { step: 6, days: 7,  channel: 'email', smsGen: null,  emailGen: email3 },
  { step: 7, days: 8,  channel: 'sms',   smsGen: sms4, emailGen: null },
  { step: 8, days: 10, channel: 'email', smsGen: null,  emailGen: email4 },
];

export async function assignSequences(batchSize: number = 100) {
  const emailReady = await hasWarmedDomains();
  const steps = emailReady ? FULL_STEPS : SMS_ONLY_STEPS;
  const mode = emailReady ? 'sms+email' : 'sms-only';

  console.log(`[Sequence] Mode: ${mode}`);

  const { data: leads } = await supabaseAdmin
    .from('outreach_leads')
    .select('*')
    .eq('status', 'qualified')
    .order('priority')
    .order('created_at')
    .limit(batchSize);

  if (!leads?.length) return { assigned: 0, skipped: 0, mode };

  let assigned = 0, skipped = 0;

  for (const lead of leads) {
    // Skip if already has messages
    const { count } = await supabaseAdmin
      .from('outreach_messages')
      .select('*', { count: 'exact', head: true })
      .eq('lead_id', lead.id);
    if (count && count > 0) { skipped++; continue; }

    // Need phone for SMS
    if (!lead.phone) { skipped++; continue; }

    const info: LeadInfo = {
      first_name: lead.first_name,
      company_name: lead.company_name,
      industry: lead.industry,
      site_score: lead.site_score || 0,
      site_issues: lead.site_issues || [],
      city: lead.city,
    };

    const now = new Date();
    const rows: any[] = [];

    for (const s of steps) {
      const sendAt = new Date(now.getTime() + s.days * 86400000);
      // Randomize time: 9-11 AM
      sendAt.setHours(9 + Math.floor(Math.random() * 2));
      sendAt.setMinutes(Math.floor(Math.random() * 60));

      if (s.channel === 'sms' && s.smsGen) {
        rows.push({
          lead_id: lead.id,
          step: s.step,
          channel: 'sms',
          to_address: lead.phone,
          body_text: s.smsGen(info),
          scheduled_at: sendAt.toISOString(),
          status: 'scheduled',
        });
      }

      if (s.channel === 'email' && s.emailGen) {
        const tempId = `temp_${lead.id}_${s.step}`;
        const rendered = s.emailGen(info, tempId);
        rows.push({
          lead_id: lead.id,
          step: s.step,
          channel: 'email',
          to_address: lead.email,
          subject: rendered.subject,
          body_html: rendered.html,
          body_text: rendered.text,
          scheduled_at: sendAt.toISOString(),
          status: 'scheduled',
        });
      }
    }

    if (!rows.length) { skipped++; continue; }

    const { data: inserted, error } = await supabaseAdmin
      .from('outreach_messages')
      .insert(rows)
      .select('id, step, body_html');

    if (error) { console.error('[Sequence]', error); skipped++; continue; }

    // Fix tracking IDs in email HTML
    if (inserted) {
      for (const row of inserted) {
        if (row.body_html) {
          const fixed = row.body_html.replace(/temp_[a-f0-9-]+_\d+/g, row.id);
          await supabaseAdmin.from('outreach_messages').update({ body_html: fixed }).eq('id', row.id);
        }
      }
    }

    await supabaseAdmin.from('outreach_leads')
      .update({ status: 'in_sequence', updated_at: new Date().toISOString() })
      .eq('id', lead.id);

    assigned++;
    console.log(`[Sequence] ${lead.company_name} → ${rows.length} steps (${mode})`);
  }

  return { assigned, skipped, mode };
}

export async function pauseSequence(leadId: string): Promise<void> {
  await supabaseAdmin
    .from('outreach_messages')
    .update({ status: 'paused' })
    .eq('lead_id', leadId)
    .eq('status', 'scheduled');
}
