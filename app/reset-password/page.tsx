'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // No session means invalid or expired link
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('An unexpected error occurred');
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="font-display text-4xl text-white leading-tight mb-4">
              Create a new password
            </h2>
            <p className="font-body text-white/60 text-lg leading-relaxed">
              Choose a strong password to keep your account secure.
            </p>
          </div>

          {/* BOTTOM - PASSWORD TIPS */}
          <div className="space-y-3">
            <p className="font-body text-white/40 text-sm mb-3">Strong password tips:</p>
            {[
              'At least 6 characters long',
              'Mix of letters and numbers',
              'Include special characters',
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                <span className="font-body text-sm text-white/50">{tip}</span>
              </div>
            ))}
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

          {!success ? (
            <>
              {/* HEADER */}
              <div className="slide-up mb-10">
                <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-3">
                  New password
                </h1>
                <p className="font-body text-neutral-500 text-lg">
                  Enter your new password below
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
                  {error.includes('expired') && (
                    <Link href="/forgot-password" className="block mt-2 font-body text-sm text-red-700 font-medium hover:underline">
                      Request a new reset link →
                    </Link>
                  )}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* NEW PASSWORD */}
                <div className="slide-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Min. 6 characters"
                      className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="slide-up" style={{ animationDelay: '0.15s' }}>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  />
                </div>

                {/* PASSWORD MATCH INDICATOR */}
                {confirmPassword && (
                  <div className="slide-up flex items-center gap-2" style={{ animationDelay: '0.2s' }}>
                    {password === confirmPassword ? (
                      <>
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-body text-sm text-emerald-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="font-body text-sm text-red-600">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <div className="slide-up pt-2" style={{ animationDelay: '0.25s' }}>
                  <button
                    type="submit"
                    disabled={loading || password !== confirmPassword || password.length < 6}
                    className="btn-hover w-full py-4 bg-black text-white font-body font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="text-center">
              <div className="scale-in mb-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="slide-up" style={{ animationDelay: '0.1s' }}>
                <h1 className="font-display text-4xl font-medium text-black mb-4">
                  Password updated!
                </h1>
                <p className="font-body text-neutral-500 text-lg mb-8">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
              </div>

              <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                <p className="font-body text-sm text-neutral-400 mb-6">
                  Redirecting to sign in...
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all"
                >
                  <span>Sign In Now</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}