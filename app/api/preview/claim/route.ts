// app/api/preview/claim/route.ts
// Links a project to a customer after they sign up from a preview link

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, customer_id } = body;

    if (!project_id || !customer_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Link the project to the customer
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ customer_id })
      .eq('id', project_id)
      .is('customer_id', null); // Only claim if not already claimed

    if (error) {
      return NextResponse.json({ error: 'Failed to claim project' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
