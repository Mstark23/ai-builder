// app/api/project-html/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();
    
    if (!projectId) {
      return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const admin = createClient(supabaseUrl, serviceKey);

    const { data, error } = await admin
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ project: data });
  } catch (err) {
    console.error('project-html error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
