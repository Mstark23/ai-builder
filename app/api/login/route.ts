import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    let response = NextResponse.json({ success: true });

    // Use createServerClient so cookies are set in the RESPONSE
    // This is what middleware reads — they must use the same cookie format
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message || 'Invalid credentials' }, { status: 401 });
    }

    if (!data.session) {
      return NextResponse.json({ error: 'Login failed' }, { status: 401 });
    }

    // Check admin access
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('user_id', data.user.id)
      .single();

    if (!adminUser) {
      // Sign out — not an admin
      await supabase.auth.signOut();
      return NextResponse.json({ error: 'You do not have admin access' }, { status: 403 });
    }

    // Return success — cookies are already set on the response
    return NextResponse.json({
      success: true,
      user: { id: data.user.id, email: data.user.email },
      role: adminUser.role,
    });

  } catch (err: any) {
    console.error('Login API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
