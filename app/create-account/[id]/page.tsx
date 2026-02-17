'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function CreateAccountPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9!@#$%^&*]/.test(password)) score++;
    return score;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    setError('');

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) { setError(authError.message); setLoading(false); return; }

      if (authData.user) {
        // Create customer record
        await supabase.from('customers').insert({
          id: authData.user.id,
          email,
          name: email.split('@')[0],
          source: 'website_purchase',
        });

        // Claim the project
        await fetch('/api/preview/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project_id: projectId, customer_id: authData.user.id }),
        });

        setSuccess(true);
        setTimeout(() => router.push('/portal'), 1500);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const strength = passwordStrength();
  const strengthColors = ['bg-neutral-200', 'bg-red-500', 'bg-orange-500', 'bg-emerald-400', 'bg-emerald-500'];

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap'); .font-display{font-family:'Playfair Display',serif} .font-body{font-family:'Inter',sans-serif}`}</style>

      <div className="w-full max-w-md">
        {/* Payment received banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">✅</div>
          <div>
            <p className="font-body text-sm font-semibold text-emerald-800">Payment Received</p>
            <p className="font-body text-xs text-emerald-600">Create your account to access your client portal</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-display text-lg font-semibold">V</span>
            </div>
            <h1 className="font-display text-2xl font-medium text-black mb-1">Create Your Account</h1>
            <p className="font-body text-sm text-neutral-500">Access your portal to upload content and review your website</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🎉</div>
              <h2 className="font-body font-semibold text-black mb-2">Account Created!</h2>
              <p className="font-body text-sm text-neutral-500">Redirecting to your portal...</p>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm font-body">{error}</div>
              )}

              <div>
                <label className="font-body text-sm font-medium text-black block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm outline-none focus:border-black transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium text-black block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm outline-none focus:border-black transition-colors pr-12"
                    placeholder="At least 6 characters"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-body">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {/* Strength meter */}
                {password && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-neutral-200'}`} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="font-body text-sm font-medium text-black block mb-1.5">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl font-body text-sm outline-none transition-colors ${
                    confirmPassword && confirmPassword !== password ? 'border-red-300' : 'border-neutral-200 focus:border-black'
                  }`}
                  placeholder="Confirm your password"
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="font-body text-xs text-red-500 mt-1">Passwords don't match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-black text-white rounded-full font-body text-sm font-semibold hover:bg-black/80 disabled:opacity-50 transition-all mt-2"
              >
                {loading ? 'Creating Account...' : 'Create Account & Enter Portal →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
