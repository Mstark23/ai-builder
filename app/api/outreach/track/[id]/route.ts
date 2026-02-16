// app/api/outreach/track/[id]/route.ts
// Email open tracking — returns 1x1 transparent GIF

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: msg } = await supabaseAdmin
      .from('outreach_messages').select('id, status, opens, lead_id').eq('id', params.id).single();
    if (msg) {
      await supabaseAdmin.from('outreach_messages').update({
        status: msg.status === 'sent' ? 'opened' : msg.status,
        opens: (msg.opens || 0) + 1,
      }).eq('id', msg.id);
    }
  } catch {}

  return new NextResponse(PIXEL, {
    headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'no-store' },
  });
}
