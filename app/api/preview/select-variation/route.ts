export const dynamic = "force-dynamic";

// POST /api/preview/select-variation
// Saves client's chosen design variation and updates status to 'interested'
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { projectId, variation } = await request.json();

    if (!projectId || !variation) {
      return NextResponse.json({ error: 'Missing projectId or variation' }, { status: 400 });
    }

    // Fetch current metadata
    const { data: project, error: fetchErr } = await supabaseAdmin
      .from('projects')
      .select('metadata')
      .eq('id', projectId)
      .single();

    if (fetchErr || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Merge selected_variation into existing metadata
    const updatedMetadata = {
      ...(project.metadata || {}),
      selected_variation: variation,
      variation_selected_at: new Date().toISOString(),
    };

    const { error: updateErr } = await supabaseAdmin
      .from('projects')
      .update({
        metadata: updatedMetadata,
        status: 'interested',
      })
      .eq('id', projectId);

    if (updateErr) {
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Select variation error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
