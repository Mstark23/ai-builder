'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { tracker } from '@/lib/tracker';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimProjectId = searchParams.get('project');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) { setError(error.message); setGoogleLoading(false); }
    } catch (err) {
      console.error('Google signup error:', err);
      setError('Failed to sign in with Google');
      setGoogleLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Create customer record
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
            phone: formData.phone || null,
            business_name: formData.businessName || null,
          });

        if (customerError) {
          console.error('Customer creation error:', customerError);
        }

        // Link anonymous visitor to new account
        tracker.identify(authData.user.id, formData.email);
        
        // If coming from a preview link, claim the project
        if (claimProjectId) {
          await fetch('/api/preview/claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project_id: claimProjectId,
              customer_id: authData.user.id,
            }),
          });
          router.push('/portal');
        } else {
          router.push('/portal/new-project');
        }
      }
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

        .float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none noise z-50"></div>

      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        {/* BACKGROUND PATTERN */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-32 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
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
            <span className="font-body text-white text-lg font-semibold tracking-wide">VEKTORLABS</span>
          </Link>

          {/* CENTER CONTENT */}
          <div className="max-w-lg">
            <h2 className="font-display text-5xl text-white leading-tight mb-6">
              Build your dream website today
            </h2>
            <p className="font-body text-white/60 text-lg leading-relaxed mb-12">
              Join hundreds of businesses that have transformed their digital presence. 
              No risk, pay only when you love it.
            </p>

            {/* FEATURES */}
            <div className="space-y-6">
              {[
                { icon: '⚡', title: 'Fast Delivery', desc: 'Quick turnaround on your project' },
                { icon: '🎨', title: 'Custom Design', desc: 'No templates, 100% unique' },
                { icon: '🛡️', title: 'Risk Free', desc: 'Pay only if you love it' },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4 float" style={{ animationDelay: `${i * 0.5}s` }}>
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="font-body text-white font-medium">{feature.title}</p>
                    <p className="font-body text-white/50 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex items-center gap-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 bg-white/20 rounded-full border-2 border-black flex items-center justify-center">
                  <span className="font-body text-white text-xs font-medium">{String.fromCharCode(64 + i)}</span>
                </div>
              ))}
            </div>
            <p className="font-body text-white/60 text-sm">
              <span className="text-white font-medium">500+</span> happy clients
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* MOBILE LOGO */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-display text-xl font-semibold">V</span>
              </div>
              <span className="font-body text-black text-lg font-semibold tracking-wide">VEKTORLABS</span>
            </Link>
          </div>

          {/* PROGRESS INDICATOR */}
          <div className="slide-up mb-8">
            <div className="flex items-center gap-2">
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-black' : 'bg-neutral-200'}`}></div>
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-black' : 'bg-neutral-200'}`}></div>
            </div>
            <p className="font-body text-sm text-neutral-400 mt-2">Step {step} of 2</p>
          </div>

          {/* CLAIM BANNER */}
          {claimProjectId && (
            <div className="slide-up mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <p className="font-body text-sm text-emerald-700 flex items-center gap-2">
                <span className="text-lg">🎉</span>
                <span><strong>Your website preview is ready!</strong> Create an account to claim it.</span>
              </p>
            </div>
          )}

          {/* HEADER */}
          <div className="slide-up mb-8">
            <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-3">
              {step === 1 ? (claimProjectId ? 'Claim your website' : 'Get started') : 'Almost there'}
            </h1>
            <p className="font-body text-neutral-500 text-lg">
              {step === 1 ? (claimProjectId ? 'Create an account to access your preview' : 'Create your account in seconds') : 'Tell us about your business'}
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
          <form onSubmit={handleRegister} className="space-y-5">
            {step === 1 && (
              <>
                {/* NAME */}
                <div className="slide-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Smith"
                    className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  />
                </div>

                {/* EMAIL */}
                <div className="slide-up" style={{ animationDelay: '0.15s' }}>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@company.com"
                    className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  />
                </div>

                {/* PASSWORD */}
                <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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
                <div className="slide-up" style={{ animationDelay: '0.25s' }}>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  />
                </div>

                {/* NEXT BUTTON */}
                <div className="slide-up pt-2" style={{ animationDelay: '0.3s' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
                        setError('Please fill in all fields');
                        return;
                      }
                      if (formData.password !== formData.confirmPassword) {
                        setError('Passwords do not match');
                        return;
                      }
                      setError('');
                      setStep(2);
                    }}
                    className="btn-hover w-full py-4 bg-black text-white font-body font-medium rounded-full flex items-center justify-center gap-3"
                  >
                    <span>Continue</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* BUSINESS NAME */}
                <div className="slide-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your company name"
                    className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  />
                </div>

                {/* PHONE */}
                <div className="slide-up" style={{ animationDelay: '0.15s' }}>
                  <label className="block font-body text-sm font-medium text-black mb-2">
                    Phone Number <span className="text-neutral-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  />
                </div>

                {/* BUTTONS */}
                <div className="slide-up flex gap-3 pt-2" style={{ animationDelay: '0.2s' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-white border border-neutral-200 text-black font-body font-medium rounded-full hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-hover flex-1 py-4 bg-black text-white font-body font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* DIVIDER */}
          {step === 1 && (
            <>
              <div className="slide-up my-8 flex items-center gap-4" style={{ animationDelay: '0.35s' }}>
                <div className="flex-1 h-px bg-neutral-200"></div>
                <span className="font-body text-sm text-neutral-400">or</span>
                <div className="flex-1 h-px bg-neutral-200"></div>
              </div>

              {/* SOCIAL SIGNUP */}
              <div className="slide-up space-y-3" style={{ animationDelay: '0.4s' }}>
                <button
                  onClick={handleGoogleSignup}
                  disabled={googleLoading}
                  className="w-full py-4 bg-white border border-neutral-200 rounded-full font-body font-medium text-black hover:bg-neutral-50 hover:border-neutral-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                </button>
              </div>
            </>
          )}

          {/* LOGIN LINK */}
          <p className="slide-up text-center mt-8 font-body text-neutral-500" style={{ animationDelay: '0.45s' }}>
            Already have an account?{' '}
            <Link href="/login" className="text-black font-medium hover:underline">
              Sign in
            </Link>
          </p>

          {/* TERMS */}
          <p className="slide-up text-center mt-6 font-body text-neutral-400 text-xs leading-relaxed" style={{ animationDelay: '0.5s' }}>
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-black hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-black hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
