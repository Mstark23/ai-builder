'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { tracker } from '@/lib/tracker';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam) {
          setError(errorDescription || errorParam);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          setError(error.message);
          return;
        }

        if (session) {
          const { data: customer } = await supabase
            .from('customers')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (!customer) {
            await supabase.from('customers').insert({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              created_at: new Date().toISOString(),
            });
          }

          tracker.identify(session.user.id, session.user.email || '');
          router.push('/portal');
        } else {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              const { data: customer } = await supabase
                .from('customers')
                .select('id')
                .eq('id', session.user.id)
                .single();

              if (!customer) {
                await supabase.from('customers').insert({
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                  created_at: new Date().toISOString(),
                });
              }
              
              subscription.unsubscribe();
              tracker.identify(session.user.id, session.user.email || '');
              router.push('/portal');
            }
          });

          setTimeout(() => {
            setError('Authentication timed out. Please try again.');
          }, 10000);
        }
      } catch (err) {
        setError('An unexpected error occurred');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-black mb-3">Authentication Failed</h1>
          <p className="text-neutral-500 mb-6">{error}</p>
          <button onClick={() => router.push('/login')} className="px-6 py-3 bg-black text-white rounded-full">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold text-black mb-2">Signing you in...</h1>
        <p className="text-neutral-500">Please wait while we complete authentication.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
