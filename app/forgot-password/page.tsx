'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSent(true);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex antialiased">
      {/* CUSTOM STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }

        .input-focus {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-focus:focus {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .scale-in {
          animation: scaleIn 0.5s ease-out forwards;
          opacity: 0;
          transform: scale(0.9);
        }

        @keyframes scaleIn {
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none noise z-50"></div>

      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        {/* BACKGROUND PATTERN */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* GRID PATTERN */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-white rounded-xl transition-transform duration-300 group-hover:rotate-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-black font-display text-2xl font-semibold">V</span>
              </div>
            </div>
            <span className="font-body text-white text-lg font-semibold tracking-wide">VERKTORLABS</span>
          </Link>

          {/* CENTER CONTENT */}
          <div className="max-w-md">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="font-display text-4xl text-white leading-tight mb-4">
              Forgot your password?
            </h2>
            <p className="font-body text-white/60 text-lg leading-relaxed">
              No worries. Enter your email and we will send you a link to reset your password.
            </p>
          </div>

          {/* BOTTOM */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="font-body text-white/40 text-sm">
              Secure password reset via email
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* MOBILE LOGO */}
          <div className="lg:hidden mb-12 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-display text-xl font-semibold">V</span>
              </div>
              <span className="font-body text-black text-lg font-semibold tracking-wide">VERKTORLABS</span>
            </Link>
          </div>

          {!sent ? (
            <>
              {/* HEADER */}
              <div className="slide-up mb-10">
                <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-3">
                  Reset password
                </h1>
                <p className="font-body text-neutral-500 text-lg">
                  Enter your email to receive a reset link
                </p>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="slide-up mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="font-body text-sm text-red-600 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* EMAIL */}
                <div className="slide-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                    className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-hover w-full py-4 bg-black text-white font-body font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* BACK TO LOGIN */}
              <p className="slide-up text-center mt-10 font-body text-neutral-500" style={{ animationDelay: '0.3s' }}>
                Remember your password?{' '}
                <Link href="/login" className="text-black font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="text-center">
              <div className="scale-in mb-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div className="slide-up" style={{ animationDelay: '0.1s' }}>
                <h1 className="font-display text-4xl font-medium text-black mb-4">
                  Check your email
                </h1>
                <p className="font-body text-neutral-500 text-lg mb-2">
                  We sent a password reset link to
                </p>
                <p className="font-body text-black font-medium text-lg mb-8">
                  {email}
                </p>
              </div>

              <div className="slide-up space-y-4" style={{ animationDelay: '0.2s' }}>
                <p className="font-body text-sm text-neutral-400">
                  Did not receive the email? Check your spam folder or
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setEmail('');
                  }}
                  className="font-body text-black font-medium hover:underline"
                >
                  try another email address
                </button>
              </div>

              <div className="slide-up mt-10" style={{ animationDelay: '0.3s' }}>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}