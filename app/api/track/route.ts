// app/api/track/route.ts
// Receives tracking events from the client-side tracker
// No auth required — this is a public endpoint (like a pixel)

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role to bypass RLS
);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { type, visitor_id } = data;

    if (!visitor_id || !type) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // ── HEARTBEAT: update real-time presence ──
    if (type === 'heartbeat') {
      await supabase
        .from('visitors')
        .update({ last_seen: new Date().toISOString(), current_page: data.page })
        .eq('visitor_id', visitor_id);

      return NextResponse.json({ ok: true });
    }

    // ── PAGEVIEW: upsert visitor + insert page view ──
    if (type === 'pageview') {
      // Upsert visitor record
      const { data: existing } = await supabase
        .from('visitors')
        .select('id, total_page_views, total_visits')
        .eq('visitor_id', visitor_id)
        .single();

      if (existing) {
        await supabase
          .from('visitors')
          .update({
            last_seen: new Date().toISOString(),
            current_page: data.page,
            total_page_views: (existing.total_page_views || 0) + 1,
          })
          .eq('visitor_id', visitor_id);
      } else {
        await supabase.from('visitors').insert({
          visitor_id,
          first_page: data.page,
          first_referrer: data.referrer || null,
          current_page: data.page,
          device: data.device,
          browser: data.browser,
          utm_source: data.utm_source || null,
          utm_medium: data.utm_medium || null,
          utm_campaign: data.utm_campaign || null,
          total_page_views: 1,
          total_visits: 1,
        });
      }

      // Insert page view
      await supabase.from('page_views').insert({
        visitor_id,
        page: data.page,
        referrer: data.referrer || null,
      });

      return NextResponse.json({ ok: true });
    }

    // ── PAGE LEAVE: update duration and scroll depth ──
    if (type === 'page_leave') {
      // Update the most recent page view for this visitor
      const { data: recentView } = await supabase
        .from('page_views')
        .select('id')
        .eq('visitor_id', visitor_id)
        .eq('page', data.page)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (recentView) {
        await supabase
          .from('page_views')
          .update({
            duration_seconds: data.duration_seconds || 0,
            scroll_depth: data.scroll_depth || 0,
          })
          .eq('id', recentView.id);
      }

      // Clear current page on visitor
      await supabase
        .from('visitors')
        .update({ current_page: null, last_seen: new Date().toISOString() })
        .eq('visitor_id', visitor_id);

      return NextResponse.json({ ok: true });
    }

    // ── SCROLL: update scroll depth on latest page view ──
    if (type === 'scroll') {
      const { data: recentView } = await supabase
        .from('page_views')
        .select('id, scroll_depth')
        .eq('visitor_id', visitor_id)
        .eq('page', data.page)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (recentView && (data.scroll_depth || 0) > (recentView.scroll_depth || 0)) {
        await supabase
          .from('page_views')
          .update({ scroll_depth: data.scroll_depth })
          .eq('id', recentView.id);
      }

      return NextResponse.json({ ok: true });
    }

    // ── EMAIL CAPTURE: save partial/full email ──
    if (type === 'email_capture') {
      if (data.email && data.email.includes('@')) {
        // Update visitor record
        await supabase
          .from('visitors')
          .update({ email: data.email })
          .eq('visitor_id', visitor_id);

        // Insert email capture record
        await supabase.from('email_captures').insert({
          visitor_id,
          email: data.email,
          source: data.source || 'form',
          page: data.page,
        });
      }

      return NextResponse.json({ ok: true });
    }

    // ── CLICK: track CTA clicks ──
    if (type === 'click') {
      await supabase.from('tracking_events').insert({
        visitor_id,
        event_type: 'click',
        event_name: data.event_name,
        page: data.page,
        metadata: data.metadata || {},
      });

      return NextResponse.json({ ok: true });
    }

    // ── IDENTIFY: link anonymous visitor to customer ──
    if (type === 'identify') {
      await supabase
        .from('visitors')
        .update({
          customer_id: data.customer_id,
          email: data.email,
          signed_up: true,
        })
        .eq('visitor_id', visitor_id);

      // Mark email capture as converted
      if (data.email) {
        await supabase
          .from('email_captures')
          .update({ converted: true })
          .eq('email', data.email);
      }

      return NextResponse.json({ ok: true });
    }

    // ── CUSTOM EVENT ──
    if (type === 'custom') {
      await supabase.from('tracking_events').insert({
        visitor_id,
        event_type: 'custom',
        event_name: data.event_name,
        page: data.page,
        metadata: data.metadata || {},
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Never crash on tracking — silent fail
    console.error('[Tracker] Error:', error);
    return NextResponse.json({ ok: false }, { status: 200 }); // Return 200 anyway
  }
}

// Also support GET for simple pixel-style tracking
export async function GET() {
  return NextResponse.json({ status: 'tracking active' });
}
