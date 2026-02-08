'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLogoutPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Sign out from Supabase
    supabase.auth.signOut();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group mb-8">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
            <span className="text-white font-display text-2xl font-semibold">V</span>
          </div>
          <span className="font-body text-black text-xl font-semibold tracking-wide">VERKTORLABS</span>
        </Link>

        <div className="bg-white rounded-2xl border border-neutral-200 p-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="font-display text-2xl font-medium text-black mb-2">You've been signed out</h1>
          <p className="font-body text-neutral-500 mb-6">Thank you for using VerktorLabs!</p>

          <p className="font-body text-sm text-neutral-400 mb-4">
            Redirecting to homepage in {countdown}...
          </p>

          <div className="flex gap-3">
            <Link href="/admin/login" className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-700 font-body text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors">
              Sign In Again
            </Link>
            <Link href="/" className="flex-1 px-4 py-3 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80 transition-colors">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
