// lib/api-auth.ts
// Shared auth helpers for protecting API routes
// Usage: const auth = await requireAdmin(request); if (auth.error) return auth.error;

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Extract user from Supabase JWT in Authorization header or cookie
async function getUserFromRequest(request: Request) {
  // Try Authorization header first (Bearer token)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    if (!error && user) return user;
  }

  // Try cookie-based session (from browser requests)
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...val] = c.trim().split('=');
      return [key, val.join('=')];
    })
  );

  // Supabase stores the access token in a cookie
  const sbAccessToken =
    cookies['sb-access-token'] ||
    cookies[`sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0]}-auth-token`];

  if (sbAccessToken) {
    try {
      const parsed = JSON.parse(decodeURIComponent(sbAccessToken));
      const token = parsed?.[0]?.access_token || parsed?.access_token;
      if (token) {
        const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
        if (!error && user) return user;
      }
    } catch {
      // Not JSON, try as raw token
      const { data: { user }, error } = await supabaseAuth.auth.getUser(sbAccessToken);
      if (!error && user) return user;
    }
  }

  return null;
}

// Require any authenticated user
export async function requireAuth(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    };
  }
  return { user, error: null };
}

// Require admin user (checks admin_users table)
export async function requireAdmin(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    };
  }

  const { data: adminUser } = await supabaseAuth
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!adminUser) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }),
    };
  }

  return { user, error: null };
}

// Require user owns a specific project
export async function requireProjectOwner(request: Request, projectId: string) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    };
  }

  // Check if user is admin (admins can access all projects)
  const { data: adminUser } = await supabaseAuth
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (adminUser) {
    return { user, error: null };
  }

  // Check if user owns the project
  const { data: project } = await supabaseAuth
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('customer_id', user.id)
    .single();

  if (!project) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Access denied' }, { status: 403 }),
    };
  }

  return { user, error: null };
}
