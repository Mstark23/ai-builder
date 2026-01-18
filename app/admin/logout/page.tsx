'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogoutPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Clear admin session
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');

    // Countdown and redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/admin/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center antialiased">
      {/* CUSTOM STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
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

      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 text-center px-6">
        {/* LOGO */}
        <div className="fade-in mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-black font-display text-3xl font-semibold">V</span>
          </div>
        </div>

        {/* SUCCESS ICON */}
        <div className="scale-in mb-8" style={{ animationDelay: '0.1s' }}>
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* TEXT */}
        <div className="fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 className="font-display text-4xl font-medium text-white mb-4">
            Signed Out
          </h1>
          <p className="font-body text-white/50 mb-8 max-w-sm mx-auto">
            You have been successfully signed out of the admin portal.
          </p>
        </div>

        {/* COUNTDOWN */}
        <div className="fade-in mb-8" style={{ animationDelay: '0.3s' }}>
          <p className="font-body text-white/30 text-sm">
            Redirecting to login in{' '}
            <span className="text-white font-semibold">{countdown}</span>
            {' '}seconds...
          </p>
        </div>

        {/* MANUAL LINK */}
        <div className="fade-in space-y-4" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-body font-medium rounded-full hover:bg-white/90 transition-all"
          >
            <span>Sign In Again</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <div className="pt-4">
            <Link
              href="/"
              className="font-body text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}