// app/api/preview/feedback/route.ts
// Public endpoint - allows customers to submit feedback without auth

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, content, sender_type } = body;

    if (!project_id || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('messages').insert({
      project_id,
      content,
      sender_type: sender_type || 'customer',
      read: false,
    });

    if (error) {
      return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
