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
    '/needs',           // ← NEW: needs form is public (no auth required)
    '/create-account',  // ← NEW: post-payment account creation
    '/terms',
    '/privacy',
    '/api/square/webhook',
    '/api/webhook',
    '/api/reports',
    '/api/track',
    '/api/preview',     // ← preview API is public
    '/api/needs',       // ← needs API is public
    '/admin/login',     // ← admin login must be public
    '/api/login',       // ← login API must be public
  ];

  const isPublic =
    publicPaths.some(p => pathname === p || pathname.startsWith(p + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2)$/);

  if (isPublic) {
    return NextResponse.next();
  }

  // Create Supabase client with cookie handling
  let response = NextResponse.next({ request: { headers: request.headers } });

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
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser();

  // Portal routes: require logged-in user
  if (pathname.startsWith('/portal')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // Admin routes (except /admin/login): require session + admin check
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
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
