import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    // Find project by preview token
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('preview_token', token)
      .single();

    if (error || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Return project data (excluding sensitive info)
    return NextResponse.json({
      id: project.id,
      business_name: project.business_name,
      status: project.status,
      preview_url: project.preview_url,
      generated_html: project.generated_html,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}