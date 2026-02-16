// app/api/outreach/unsubscribe/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: msg } = await supabaseAdmin
      .from('outreach_messages').select('lead_id').eq('id', params.id).single();
    if (msg) {
      const { pauseSequence } = await import('@/lib/outreach/sequence');
      await pauseSequence(msg.lead_id);
      await supabaseAdmin.from('outreach_leads').update({
        status: 'unsubscribed', updated_at: new Date().toISOString(),
      }).eq('id', msg.lead_id);
    }
  } catch {}

  return new NextResponse(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribed</title><style>body{font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#fafafa;color:#1a1a1a}.c{text-align:center;padding:48px;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.06);max-width:400px}h1{font-size:20px;margin:0 0 12px}p{color:#666;font-size:15px;line-height:1.6;margin:0}</style></head><body><div class="c"><h1>✓ Unsubscribed</h1><p>You've been removed. No more emails or texts from us.</p></div></body></html>`, {
    headers: { 'Content-Type': 'text/html' },
  });
}

