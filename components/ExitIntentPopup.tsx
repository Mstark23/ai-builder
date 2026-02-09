// components/ExitIntentPopup.tsx
'use client';

import { useState, useEffect } from 'react';
import { tracker } from '@/lib/tracker';

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed or on non-landing pages
    if (typeof window === 'undefined') return;
    
    const alreadySeen = sessionStorage.getItem('vl_exit_seen');
    if (alreadySeen) return;

    // Only show on landing page and register page
    const page = window.location.pathname;
    if (page !== '/' && page !== '/register') return;

    // Desktop: track mouse leaving viewport (heading to close/back)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setShow(true);
        sessionStorage.setItem('vl_exit_seen', 'true');
        tracker.trackEvent('exit_intent_shown', { page });
      }
    };

    // Mobile: track back button / tab switch after 10s on page
    const timer = setTimeout(() => {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && !dismissed) {
          // Can't show popup when hidden, but flag for next visit
          sessionStorage.setItem('vl_show_on_return', 'true');
        }
      });
    }, 10000);

    // Check if we should show on return
    if (sessionStorage.getItem('vl_show_on_return')) {
      sessionStorage.removeItem('vl_show_on_return');
      setShow(true);
      sessionStorage.setItem('vl_exit_seen', 'true');
    }

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [dismissed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    tracker.trackEmailCapture(email, 'exit_intent');
    tracker.trackEvent('exit_intent_submitted', { email });
    setSubmitted(true);
    
    setTimeout(() => {
      setShow(false);
    }, 2000);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
    tracker.trackEvent('exit_intent_dismissed');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        <style jsx>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        
        {/* Close button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Top accent bar */}
        <div className="h-1 bg-black" />

        <div className="p-8">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-black mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                You&apos;re on the list!
              </h3>
              <p className="text-neutral-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                We&apos;ll send you something special soon.
              </p>
            </div>
          ) : (
            <>
              {/* Emoji + heading */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-display text-2xl font-semibold text-black mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Wait — before you go
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Get a <span className="font-semibold text-black">free website mockup</span> for your business. 
                  No commitment, just drop your email.
                </p>
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full px-4 py-3.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-black/90 transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Get My Free Mockup →
                </button>
              </form>

              {/* Trust signals */}
              <p className="text-center text-xs text-neutral-400 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                No spam, ever. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
