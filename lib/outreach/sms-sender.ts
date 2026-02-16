// lib/outreach/sms-sender.ts
// ═══════════════════════════════════════════════
// SMS SENDER — Multi-number rotation
// ═══════════════════════════════════════════════
// Rotates across your Twilio numbers to stay under carrier limits.
// 1 number = 200/day (unregistered), 3000/day (10DLC)
// Add more numbers = more capacity. $1.15/mo per number.
//
// Falls back to TWILIO_PHONE_NUMBER env var if no numbers in DB.
// ═══════════════════════════════════════════════

import { supabaseAdmin } from '@/lib/supabaseAdmin';

function formatPhone(phone: string): string {
  let c = phone.replace(/[^\d+]/g, '');
  if (!c.startsWith('+')) {
    if (c.length === 10) c = '+1' + c;
    else if (c.length === 11 && c.startsWith('1')) c = '+' + c;
    else c = '+1' + c;
  }
  return c;
}

// Pick the next available sending number (lowest daily_sent that hasn't hit limit)
async function pickSendingNumber(): Promise<{ number: string; id: string } | null> {
  // Try DB numbers first
  const { data: numbers } = await supabaseAdmin
    .from('outreach_phones')
    .select('*')
    .eq('is_active', true)
    .order('daily_sent', { ascending: true })
    .limit(1);

  if (numbers?.length && numbers[0].daily_sent < numbers[0].daily_limit) {
    return { number: numbers[0].phone_number, id: numbers[0].id };
  }

  // Fallback to env var
  const fallback = process.env.TWILIO_PHONE_NUMBER;
  if (fallback) return { number: fallback, id: 'env' };

  return null;
}

async function twilioSend(to: string, body: string, from: string): Promise<{ ok: boolean; sid?: string; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    console.log(`[SMS] DEV: ${from} → ${to}: ${body.slice(0, 60)}...`);
    return { ok: true, sid: 'dev' };
  }

  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }),
    });

    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.message || `Twilio ${res.status}` };
    return { ok: true, sid: data.sid };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function sendDueSms(batchSize: number = 30) {
  const now = new Date();

  const { data: due } = await supabaseAdmin
    .from('outreach_messages')
    .select('*, outreach_leads!inner(status)')
    .eq('status', 'scheduled')
    .eq('channel', 'sms')
    .lte('scheduled_at', now.toISOString())
    .order('scheduled_at')
    .limit(batchSize);

  if (!due?.length) return { sent: 0, failed: 0, skipped: 0 };

  let sent = 0, failed = 0, skipped = 0;

  for (const msg of due) {
    const leadStatus = (msg as any).outreach_leads?.status;
    if (['converted', 'unsubscribed', 'bounced', 'replied'].includes(leadStatus)) {
      await supabaseAdmin.from('outreach_messages').update({ status: 'paused' }).eq('id', msg.id);
      skipped++; continue;
    }

    if (!msg.to_address) { failed++; continue; }

    // Pick sending number
    const sender = await pickSendingNumber();
    if (!sender) {
      console.log('[SMS] No available sending numbers (all at daily limit)');
      break;
    }

    const to = formatPhone(msg.to_address);
    const result = await twilioSend(to, msg.body_text || '', sender.number);

    if (result.ok) {
      await supabaseAdmin.from('outreach_messages').update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        from_address: sender.number,
        twilio_sid: result.sid,
      }).eq('id', msg.id);

      // Increment phone counter
      if (sender.id !== 'env') {
        await supabaseAdmin.rpc('increment_phone_sent', { phone_id: sender.id }).catch(() => {
          supabaseAdmin.from('outreach_phones')
            .update({ daily_sent: (due as any).daily_sent + 1 })
            .eq('id', sender.id);
        });
      }

      sent++;
    } else {
      console.error(`[SMS] Failed ${to}: ${result.error}`);
      await supabaseAdmin.from('outreach_messages').update({ status: 'failed' }).eq('id', msg.id);
      failed++;
    }

    // 1.5s between sends (Twilio rate limit)
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`[SMS] ${sent} sent, ${failed} failed, ${skipped} skipped`);
  return { sent, failed, skipped };
}
