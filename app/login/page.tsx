'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.user) { router.push('/portal'); }
    } catch (err) { setError('An unexpected error occurred'); setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    console.log('🔵 Google login clicked');
    setGoogleLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      console.log('🔵 OAuth response:', data, error);
      if (error) { setError(error.message); setGoogleLoading(false); }
    } catch (err) { console.error('🔴 Error:', err); setError('Failed to sign in with Google'); setGoogleLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex antialiased">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        .slide-up { animation: slideUp 0.6s ease-out forwards; opacity: 0; transform: translateY(20px); }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-white rounded-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-black font-display text-2xl font-semibold">V</span>
              </div>
            </div>
            <span className="font-body text-white text-lg font-semibold tracking-wide">VERKTORLABS</span>
          </Link>
          <div className="max-w-md">
            <p className="font-display text-3xl text-white leading-relaxed mb-8">Verktorlabs transformed our online presence. The results exceeded all expectations.</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <span className="font-body text-white font-semibold">JD</span>
              </div>
              <div>
                <p className="font-body text-white font-medium">James Davidson</p>
                <p className="font-body text-white/50 text-sm">CEO, TechStart Inc.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <div><p className="font-display text-4xl text-white font-semibold">200+</p><p className="font-body text-white/50 text-sm mt-1">Projects Delivered</p></div>
            <div className="w-px h-12 bg-white/20"></div>
            <div><p className="font-display text-4xl text-white font-semibold">98%</p><p className="font-body text-white/50 text-sm mt-1">Client Satisfaction</p></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-display text-xl font-semibold">V</span>
              </div>
              <span className="font-body text-black text-lg font-semibold tracking-wide">VERKTORLABS</span>
            </Link>
          </div>

          <div className="slide-up mb-10">
            <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-3">Welcome back</h1>
            <p className="font-body text-neutral-500 text-lg">Sign in to access your projects</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="font-body text-sm text-red-600">{error}</p>
            </div>
          )}

          <button type="button" onClick={handleGoogleLogin} disabled={googleLoading}
            className="w-full py-4 bg-white border border-neutral-200 rounded-full font-body font-medium text-black hover:bg-neutral-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mb-8">
            {googleLoading ? <span>Connecting...</span> : (
              <><svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg><span>Continue with Google</span></>
            )}
          </button>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-neutral-200"></div>
            <span className="font-body text-sm text-neutral-400">or sign in with email</span>
            <div className="flex-1 h-px bg-neutral-200"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-body text-sm font-medium text-black mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com"
                className="w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"/>
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-black mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password"
                  className="w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black pr-12"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="font-body text-sm text-neutral-500 hover:text-black">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-black text-white font-body font-medium rounded-full disabled:opacity-50 flex items-center justify-center gap-3">
              {loading ? 'Signing in...' : <><span>Sign In</span><span>→</span></>}
            </button>
          </form>

          <p className="text-center mt-10 font-body text-neutral-500">
            Don&apos;t have an account? <Link href="/register" className="text-black font-medium hover:underline">Get started</Link>
          </p>
          <p className="text-center mt-4 font-body text-neutral-400 text-sm">
            <Link href="/admin/login" className="hover:text-black">Admin access →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
