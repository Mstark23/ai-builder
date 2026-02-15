export const dynamic = "force-dynamic";

// app/api/preview/[id]/route.ts
// Public endpoint - serves preview data without auth
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  if (!projectId) {
    return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
  }

  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .select('id, business_name, industry, generated_html, generated_pages, requested_pages, status, plan, metadata')
    .eq('id', projectId)
    .single();

  if (error || !project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json({ project });
}
