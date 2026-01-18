import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { shop, projectId } = await request.json();

    if (!shop || !projectId) {
      return NextResponse.json({ error: 'Missing shop or projectId' }, { status: 400 });
    }

    // For custom distribution apps, we need to get the access token
    // using the offline access token from the installation
    
    // Check if we already have a connection for this shop
    const { data: existing } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('shop_domain', shop.replace('.myshopify.com', ''))
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, connection: existing });
    }

    // Create a new connection record (we'll update with token later)
    const { data: project } = await supabase
      .from('projects')
      .select('customer_id')
      .eq('id', projectId)
      .single();

    const { data: connection, error } = await supabase
      .from('platform_connections')
      .insert({
        project_id: projectId,
        customer_id: project?.customer_id,
        platform: 'shopify',
        shop_domain: shop.replace('.myshopify.com', ''),
        status: 'PENDING',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, connection });
  } catch (error) {
    console.error('Token error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}