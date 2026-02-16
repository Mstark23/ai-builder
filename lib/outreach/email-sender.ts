// lib/outreach/email-sender.ts
// ═══════════════════════════════════════════════
// EMAIL SENDER — Domain rotation + warmup awareness
// ═══════════════════════════════════════════════
// Only sends if warmed domains exist. Otherwise does nothing.
// Rotates across domains, respects daily limits per domain.
//
// START: Resend (you have it)
// UPGRADE: Set OUTREACH_USE_SES=true in .env → switches to SES
// ═══════════════════════════════════════════════

import { supabaseAdmin } from '@/lib/supabaseAdmin';

const RESEND_KEY = process.env.RESEND_API_KEY;
const USE_SES = process.env.OUTREACH_USE_SES === 'true';
const REPLY_TO = process.env.OUTREACH_REPLY_TO || 'jhordan@vektorlabs.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://vektorlabs.com';

// Pick next available sending mailbox from warmed domains
async function pickMailbox(): Promise<{ email: string; domainId: string } | null> {
  const { data: domains } = await supabaseAdmin
    .from('outreach_domains')
    .select('*')
    .eq('warmup_done', true)
    .eq('is_active', true)
    .order('daily_sent', { ascending: true });

  if (!domains?.length) return null;

  // Find first domain under daily limit with mailboxes
  for (const d of domains) {
    if (d.daily_sent >= d.daily_limit) continue;
    const mailboxes = d.mailboxes as string[];
    if (!mailboxes?.length) continue;
    // Rotate through mailboxes using total_sent as index
    const idx = (d.total_sent || 0) % mailboxes.length;
    return { email: mailboxes[idx], domainId: d.id };
  }

  return null; // All domains at daily limit
}

async function sendResend(to: string, from: string, subject: string, html: string, text: string, emailId: string) {
  if (!RESEND_KEY) {
    console.log(`[Email] DEV: ${from} → ${to}: ${subject}`);
    return { ok: true };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({
        from, to: [to], reply_to: REPLY_TO, subject, html, text,
        headers: { 'List-Unsubscribe': `<${APP_URL}/api/outreach/unsubscribe/${emailId}>` },
      }),
    });
    if (!res.ok) return { ok: false, error: await res.text() };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

async function sendSES(to: string, from: string, subject: string, html: string, text: string, _emailId: string) {
  try {
    const { SESv2Client, SendEmailCommand } = await import('@aws-sdk/client-sesv2');
    const ses = new SESv2Client({ region: process.env.AWS_SES_REGION || 'us-east-1' });
    await ses.send(new SendEmailCommand({
      FromEmailAddress: from,
      ReplyToAddresses: [REPLY_TO],
      Destination: { ToAddresses: [to] },
      Content: { Simple: { Subject: { Data: subject }, Body: { Html: { Data: html }, Text: { Data: text } } } },
    }));
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function sendDueEmails(batchSize: number = 30) {
  // Business hours only (8AM-6PM Eastern)
  const now = new Date();
  const eastern = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const hour = eastern.getHours();
  if (hour < 8 || hour >= 18) return { sent: 0, failed: 0, skipped: 0 };

  const { data: due } = await supabaseAdmin
    .from('outreach_messages')
    .select('*, outreach_leads!inner(status)')
    .eq('status', 'scheduled')
    .eq('channel', 'email')
    .lte('scheduled_at', now.toISOString())
    .order('scheduled_at')
    .limit(batchSize);

  if (!due?.length) return { sent: 0, failed: 0, skipped: 0 };

  let sent = 0, failed = 0, skipped = 0;
  const send = USE_SES ? sendSES : sendResend;

  for (const msg of due) {
    const leadStatus = (msg as any).outreach_leads?.status;
    if (['converted', 'unsubscribed', 'bounced', 'replied'].includes(leadStatus)) {
      await supabaseAdmin.from('outreach_messages').update({ status: 'paused' }).eq('id', msg.id);
      skipped++; continue;
    }

    const mailbox = await pickMailbox();
    if (!mailbox) {
      console.log('[Email] No available mailboxes (all at daily limit or no warmed domains)');
      break;
    }

    const fromAddress = `Jhordan <${mailbox.email}>`;
    const result = await send(
      msg.to_address, fromAddress,
      msg.subject || '', msg.body_html || '', msg.body_text || '', msg.id
    );

    if (result.ok) {
      await supabaseAdmin.from('outreach_messages').update({
        status: 'sent', sent_at: new Date().toISOString(), from_address: mailbox.email,
      }).eq('id', msg.id);

      // Increment domain counters
      const { data: dom } = await supabaseAdmin.from('outreach_domains').select('daily_sent, total_sent').eq('id', mailbox.domainId).single();
      if (dom) {
        await supabaseAdmin.from('outreach_domains').update({
          daily_sent: (dom.daily_sent || 0) + 1,
          total_sent: (dom.total_sent || 0) + 1,
        }).eq('id', mailbox.domainId);
      }

      sent++;
    } else {
      const isBounce = result.error?.toLowerCase().includes('bounce') || result.error?.toLowerCase().includes('reject');
      if (isBounce) {
        await supabaseAdmin.from('outreach_messages').update({ status: 'bounced' }).eq('id', msg.id);
        await supabaseAdmin.from('outreach_leads').update({ status: 'bounced' }).eq('id', msg.lead_id);
      } else {
        await supabaseAdmin.from('outreach_messages').update({ status: 'failed' }).eq('id', msg.id);
      }
      failed++;
    }

    // Delay between sends
    await new Promise(r => setTimeout(r, USE_SES ? 2000 : 10000));
  }

  console.log(`[Email] ${sent} sent, ${failed} failed, ${skipped} skipped`);
  return { sent, failed, skipped };
}

// Auto-check warmup: flip domains to active after 14 days
export async function checkWarmupStatus() {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString();

  const { data: ready } = await supabaseAdmin
    .from('outreach_domains')
    .select('id, domain')
    .eq('warmup_done', false)
    .eq('dns_verified', true)
    .lte('warmup_started_at', fourteenDaysAgo);

  if (!ready?.length) return;

  for (const d of ready) {
    await supabaseAdmin.from('outreach_domains').update({
      warmup_done: true,
      is_active: true,
      daily_limit: 50,
    }).eq('id', d.id);
    console.log(`[Warmup] ✅ ${d.domain} is NOW ACTIVE — 50 emails/day`);
  }
}
