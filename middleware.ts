import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/auth/callback',
    '/preview',
    '/needs',
    '/create-account',
    '/free-preview',
    '/free-preview-b',
    '/about',
    '/terms',
    '/privacy',
    '/admin/login',
    '/api/login',
    '/api/leads',
    '/api/square/webhook',
    '/api/webhook',
    '/api/reports',
    '/api/track',
    '/api/preview',
    '/api/needs',
    '/api/sms',
  ];

  const isPublic =
    publicPaths.some(p => pathname === p || pathname.startsWith(p + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2)$/);

  if (isPublic) {
    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════════════════
  // FIX: Collect all cookie operations, apply to ONE response
  //
  // OLD BUG: set() created a new NextResponse each call, which
  // destroyed cookies from previous set() calls. Supabase splits
  // auth tokens into multiple chunks (token.0, token.1, etc).
  // Only the last chunk survived → broken session every time.
  // ═══════════════════════════════════════════════════════════════
  const cookiesToSet: { name: string; value: string; options: CookieOptions }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          cookiesToSet.push({ name, value, options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          cookiesToSet.push({ name, value: '', options });
        },
      },
    }
  );

  // Refresh session (may trigger multiple set() calls for token chunks)
  const { data: { user } } = await supabase.auth.getUser();

  // Build ONE response with ALL cookies
  let response = NextResponse.next({ request: { headers: request.headers } });
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set({ name, value, ...options });
  });

  // Portal routes: require logged-in user
  if (pathname.startsWith('/portal')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // Admin routes: require session + admin check
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!adminUser) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
