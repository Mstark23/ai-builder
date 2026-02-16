// app/api/cron/outreach/route.ts
// Single cron endpoint, multiple actions:
//   ?action=morning  → import + score + assign (6 AM)
//   ?action=send     → send SMS + emails (every 15 min)
//   ?action=reset    → reset daily counters (midnight)

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const action = request.nextUrl.searchParams.get('action');

  try {
    if (action === 'morning') {
      const { runMorningPipeline } = await import('@/lib/outreach/pipeline');
      const result = await runMorningPipeline();
      return NextResponse.json({ ok: true, ...result });
    }

    if (action === 'send') {
      const { sendDueSms } = await import('@/lib/outreach/sms-sender');
      const { sendDueEmails } = await import('@/lib/outreach/email-sender');
      const { trackSends } = await import('@/lib/outreach/pipeline');

      const sms = await sendDueSms(30);
      const email = await sendDueEmails(30);
      await trackSends(email.sent, sms.sent);

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
