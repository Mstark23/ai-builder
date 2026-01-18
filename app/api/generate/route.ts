import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { generateWebsiteHTML } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    // 1️⃣ Fetch project
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 2️⃣ Set status → GENERATING
    await supabaseAdmin
      .from('projects')
      .update({ status: 'GENERATING' })
      .eq('id', projectId);

    // 3️⃣ Generate HTML
    const html = await generateWebsiteHTML({
      businessName: project.business_name,
      industry: project.industry,
      style: project.style,
    });

    // 4️⃣ Save HTML + status
    await supabaseAdmin
      .from('projects')
      .update({
        generated_html: html,
        status: 'DELIVERED',
      })
      .eq('id', projectId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('GENERATE ERROR:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
