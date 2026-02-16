'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (authError) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (adminUser) {
          window.location.href = '/admin/dashboard';
        } else {
          await supabase.auth.signOut();
          setError('You do not have admin access.');
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
              <span className="text-white font-display text-2xl font-semibold">V</span>
            </div>
            <span className="font-body text-black text-xl font-semibold tracking-wide">VERKTORLABS</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-medium text-black mb-2">Admin Dashboard</h1>
            <p className="font-body text-neutral-500">Sign in to manage your business</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="font-body text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-body text-sm font-medium text-black mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-black mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="font-body text-sm text-neutral-500">
            <Link href="/" className="text-black font-medium hover:underline">← Back to website</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
