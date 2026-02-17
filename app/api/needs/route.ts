export const dynamic = "force-dynamic";

// POST /api/needs
// Saves client's needs OR growth assessment answers
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, type } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    const { data: project, error: fetchErr } = await supabaseAdmin
      .from('projects')
      .select('metadata')
      .eq('id', projectId)
      .single();

    if (fetchErr || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    let updatedMetadata = { ...(project.metadata || {}) };

    if (type === 'growth_assessment') {
      // New flow: growth/pain discovery questionnaire
      updatedMetadata.growth_assessment = {
        ...body.answers,
        submitted_at: new Date().toISOString(),
      };

      const { error: updateErr } = await supabaseAdmin
        .from('projects')
        .update({
          metadata: updatedMetadata,
          status: 'assessment_submitted',
        })
        .eq('id', projectId);

      if (updateErr) {
        console.error('Growth assessment save error:', updateErr);
        return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
      }

      console.log(`[Growth] Assessment saved for project ${projectId}`);
    } else {
      // Original flow: client needs (pages, features, addons)
      const { pages, features, addons, timeline, notes, suggestedPrice } = body;

      if (!pages || pages.length === 0) {
        return NextResponse.json({ error: 'At least one page is required' }, { status: 400 });
      }

      updatedMetadata.client_needs = {
        pages: pages || [],
        features: features || [],
        addons: addons || [],
        timeline: timeline || '',
        notes: notes || '',
        submitted_at: new Date().toISOString(),
      };
      updatedMetadata.suggested_price = suggestedPrice || 0;

      const { error: updateErr } = await supabaseAdmin
        .from('projects')
        .update({
          metadata: updatedMetadata,
          status: 'needs_submitted',
        })
        .eq('id', projectId);

      if (updateErr) {
        console.error('Needs save error:', updateErr);
        return NextResponse.json({ error: 'Failed to save needs' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Needs API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
