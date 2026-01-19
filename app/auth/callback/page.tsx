'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login?error=auth_failed');
          return;
        }

        if (session) {
          // Check if user exists in customers table
          const { data: customer } = await supabase
            .from('customers')
            .select('id')
            .eq('id', session.user.id)
            .single();

          // If customer doesn't exist, create one
          if (!customer) {
            await supabase.from('customers').insert({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              created_at: new Date().toISOString(),
            });
          }

          // Redirect to portal
          router.push('/portal');
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Callback error:', err);
        router.push('/login?error=unexpected');
      }
    };

    handleCallback();
  }, [router]);

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