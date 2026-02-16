// app/api/outreach/click/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://vektorlabs.com';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const dest = req.nextUrl.searchParams.get('url') || `${APP_URL}/free-preview`;

  try {
    const { data: msg } = await supabaseAdmin
      .from('outreach_messages').select('id, clicks, lead_id').eq('id', params.id).single();
    if (msg) {
      await supabaseAdmin.from('outreach_messages').update({
        status: 'clicked', clicks: (msg.clicks || 0) + 1,
      }).eq('id', msg.id);
      await supabaseAdmin.from('outreach_leads').update({
        status: 'engaged', updated_at: new Date().toISOString(),
      }).eq('id', msg.lead_id);
    }
  } catch {}

  return NextResponse.redirect(dest);
}
