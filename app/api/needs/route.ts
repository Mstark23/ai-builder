export const dynamic = "force-dynamic";

// POST /api/needs
// Saves client's needs + calculates suggested price for admin review
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { projectId, pages, features, addons, timeline, notes, suggestedPrice } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }
    if (!pages || pages.length === 0) {
      return NextResponse.json({ error: 'At least one page is required' }, { status: 400 });
    }

    const { data: project, error: fetchErr } = await supabaseAdmin
      .from('projects')
      .select('metadata')
      .eq('id', projectId)
      .single();

    if (fetchErr || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updatedMetadata = {
      ...(project.metadata || {}),
      client_needs: {
        pages: pages || [],
        features: features || [],
        addons: addons || [],
        timeline: timeline || '',
        notes: notes || '',
        submitted_at: new Date().toISOString(),
      },
      // Suggested price is a FLOOR for admin — admin sets the real custom_price
      suggested_price: suggestedPrice || 0,
    };

    const { error: updateErr } = await supabaseAdmin
      .from('projects')
      .update({
        metadata: updatedMetadata,
        status: 'needs_submitted',
        // NOTE: custom_price is NOT set here. Admin sets it from the dashboard.
      })
      .eq('id', projectId);

    if (updateErr) {
      console.error('Needs save error:', updateErr);
      return NextResponse.json({ error: 'Failed to save needs' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Needs API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
