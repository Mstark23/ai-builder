import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const shop = searchParams.get('shop');
  const state = searchParams.get('state');

  // If no code, this might be the initial install redirect
  if (!code) {
    // Redirect to home or portal
    const shopParam = shop ? `?shop=${shop}` : '';
    return NextResponse.redirect(new URL(`/portal${shopParam}`, request.url));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response:', tokenData);

    if (!tokenData.access_token) {
      console.error('No access token:', tokenData);
      return NextResponse.redirect(new URL('/portal?error=no_token', request.url));
    }

    // Parse state to get projectId
    let projectId = null;
    let shopDomain = shop?.replace('.myshopify.com', '');
    
    if (state) {
      const [pid, domain] = state.split(':');
      projectId = pid;
      if (domain) shopDomain = domain;
    }

    // Get project to find customer_id
    let customerId = null;
    if (projectId) {
      const { data: project } = await supabase
        .from('projects')
        .select('customer_id')
        .eq('id', projectId)
        .single();
      customerId = project?.customer_id;
    }

    // Save or update the connection with access token
    const { error: upsertError } = await supabase
      .from('platform_connections')
      .upsert({
        project_id: projectId,
        customer_id: customerId,
        platform: 'shopify',
        shop_domain: shopDomain,
        access_token: tokenData.access_token,
        scope: tokenData.scope,
        status: 'CONNECTED',
        connected_at: new Date().toISOString(),
      }, {
        onConflict: 'project_id'
      });

    if (upsertError) {
      console.error('Upsert error:', upsertError);
    }

    // Update project with platform
    if (projectId) {
      await supabase
        .from('projects')
        .update({ platform: 'shopify' })
        .eq('id', projectId);
    }

    // Redirect back to connect page with success
    const redirectUrl = projectId 
      ? `/portal/connect/${projectId}?success=true`
      : '/portal?shopify=connected';
      
    return NextResponse.redirect(new URL(redirectUrl, request.url));
    
  } catch (error) {
    console.error('Shopify callback error:', error);
    return NextResponse.redirect(new URL('/portal?error=callback_failed', request.url));
  }
}