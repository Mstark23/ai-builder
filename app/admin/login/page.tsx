'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (customer) {
        localStorage.setItem('customerLoggedIn', 'true');
        localStorage.setItem('customerId', customer.id);
        localStorage.setItem('customerName', customer.name || 'Customer');
        localStorage.setItem('customerEmail', customer.email);
        setSuccess(true);
        setTimeout(() => router.push('/portal'), 1500);  // ← FIXED
      } else {
        setError('No account found with this email. Please check your email or contact support.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .limit(1)
        .single();

      if (customer) {
        localStorage.setItem('customerLoggedIn', 'true');
        localStorage.setItem('customerId', customer.id);
        localStorage.setItem('customerName', customer.name || 'Demo Customer');
        localStorage.setItem('customerEmail', customer.email);
        router.push('/portal');  // ← FIXED
      } else {
        // Fallback demo login
        localStorage.setItem('customerLoggedIn', 'true');
        localStorage.setItem('customerId', 'demo-id');
        localStorage.setItem('customerName', 'Demo Customer');
        localStorage.setItem('customerEmail', 'demo@example.com');
        router.push('/portal');  // ← FIXED
      }
    } catch (err) {
      console.error('Error:', err);
      localStorage.setItem('customerLoggedIn', 'true');
      localStorage.setItem('customerId', 'demo-id');
      localStorage.setItem('customerName', 'Demo Customer');
      localStorage.setItem('customerEmail', 'demo@example.com');
      router.push('/portal');  // ← FIXED
    } finally {
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
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-medium text-black mb-2">Welcome back!</h2>
              <p className="font-body text-neutral-500 mb-4">Redirecting to your dashboard...</p>
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="font-display text-2xl font-medium text-black mb-2">Customer Portal</h1>
                <p className="font-body text-neutral-500">Sign in to view your projects</p>
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
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black transition-colors"
                    autoFocus
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
                    'Continue with Email'
                  )}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white font-body text-sm text-neutral-500">or</span>
                </div>
              </div>

              <button
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full px-4 py-3 border border-neutral-200 text-neutral-700 font-body text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Try Demo Account
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="font-body text-sm text-neutral-500">
            Don't have an account?{' '}
            <Link href="/" className="text-black font-medium hover:underline">Start a project</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
