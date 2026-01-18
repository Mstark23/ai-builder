'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Admin credentials (you can change these or use environment variables)
  const ADMIN_EMAIL = 'admin@verktorlabs.com';
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set admin session
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminEmail', email);
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex antialiased">
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
          box-shadow: 0 4px 20px rgba(255,255,255,0.1);
        }

        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(255,255,255,0.2);
        }

        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .glow {
          box-shadow: 0 0 100px rgba(255,255,255,0.05);
        }
      `}</style>

      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none noise z-50"></div>

      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* GRID PATTERN */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* LOGO */}
          <div className="slide-up text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 bg-white rounded-2xl transition-transform duration-300 group-hover:rotate-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-black font-display text-2xl font-semibold">V</span>
                </div>
              </div>
            </Link>
          </div>

          {/* CARD */}
          <div className="slide-up bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 glow" style={{ animationDelay: '0.1s' }}>
            {/* HEADER */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-medium text-white mb-2">
                Admin Portal
              </h1>
              <p className="font-body text-white/50">
                Sign in to manage your business
              </p>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="font-body text-sm text-red-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label className="block font-body text-sm font-medium text-white/70 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@verktorlabs.com"
                  className="input-focus w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl font-body text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block font-body text-sm font-medium text-white/70 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="input-focus w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl font-body text-white placeholder-white/30 focus:outline-none focus:border-white/30 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
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

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="btn-hover w-full py-4 bg-white text-black font-body font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* BACK LINK */}
          <p className="slide-up text-center mt-8 font-body text-white/40 text-sm" style={{ animationDelay: '0.2s' }}>
            <Link href="/" className="hover:text-white transition-colors">
              ← Back to website
            </Link>
          </p>

          {/* CREDENTIALS HINT */}
          <div className="slide-up mt-8 p-4 bg-white/5 rounded-xl border border-white/10" style={{ animationDelay: '0.3s' }}>
            <p className="font-body text-xs text-white/30 text-center">
              <span className="text-white/50">Demo:</span> admin@verktorlabs.com / admin123
            </p>
          </div>
        </div>
      </div>

      {/* SIDE INFO */}
      <div className="hidden lg:flex lg:w-1/3 items-center justify-center p-12 border-l border-white/5">
        <div className="max-w-xs">
          <div className="mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl text-white mb-3">Secure Access</h2>
            <p className="font-body text-white/50 leading-relaxed">
              This area is restricted to authorized personnel only. All actions are logged for security purposes.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Manage customer projects',
              'Track payments & revenue',
              'Assign team members',
              'Access platform connections'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                <span className="font-body text-sm text-white/40">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}