'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL params (from OAuth provider)
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam) {
          console.error('OAuth error from URL:', errorParam, errorDescription);
          setError(errorDescription || errorParam);
          return;
        }

        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          return;
        }

        if (session) {
          console.log('Session found:', session.user.email);
          
          // Check if user exists in customers table
          const { data: customer } = await supabase
            .from('customers')
            .select('id')
            .eq('id', session.user.id)
            .single();

          // If customer doesn't exist, create one
          if (!customer) {
            const { error: insertError } = await supabase.from('customers').insert({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              created_at: new Date().toISOString(),
            });
            
            if (insertError) {
              console.error('Error creating customer:', insertError);
              // Don't block login for this
            }
          }

          // Redirect to portal
          router.push('/portal');
        } else {
          // No session, might need to wait for auth state change
          console.log('No session yet, setting up listener...');
          
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event);
            
            if (event === 'SIGNED_IN' && session) {
              // Check/create customer
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
              router.push('/portal');
            }
          });

          // Timeout after 10 seconds
          setTimeout(() => {
            if (!error) {
              setError('Authentication timed out. Please try again.');
            }
          }, 10000);
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('An unexpected error occurred');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
          .font-display { font-family: 'Playfair Display', Georgia, serif; }
          .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        `}</style>
        
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-black mb-3">Authentication Failed</h1>
          <p className="font-body text-neutral-500 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-black text-white font-body font-medium rounded-full hover:bg-neutral-800 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>
      
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="font-display text-2xl text-black mb-2">Signing you in...</h1>
        <p className="font-body text-neutral-500">Please wait while we complete authentication.</p>
      </div>
    </div>
  );
}
