'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function BookPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [businessName, setBusinessName] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/preview/${projectId}`)
      .then(r => r.json())
      .then(d => {
        if (d.business_name) setBusinessName(d.business_name);
      })
      .catch(() => {});
  }, [projectId]);

  // Load Calendly widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-d { font-family: 'Playfair Display', Georgia, serif; }
        .font-b { font-family: 'Inter', -apple-system, sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.6s ease forwards; }
      `}</style>

      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute top-[10%] -right-[200px] w-[700px] h-[700px] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[10%] -left-[200px] w-[600px] h-[600px] bg-gradient-to-tr from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-40" />

        {/* Header */}
        <header className="relative z-10 max-w-[1000px] mx-auto px-8 pt-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-d text-lg font-semibold">V</span>
            </div>
            <span className="font-b text-sm font-semibold tracking-wide text-black">VEKTORLABS</span>
          </div>
        </header>

        {/* Content */}
        <div className="relative z-10 max-w-[1000px] mx-auto px-8 py-16">
          <div className="fade-in text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200 mb-6">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-b text-xs font-semibold text-emerald-700">Your preview is ready</span>
            </div>

            <h1 className="font-d text-4xl sm:text-5xl font-medium text-black leading-tight">
              {businessName ? (
                <>Let&apos;s talk about growing<br /><span className="italic">{businessName}</span></>
              ) : (
                <>Let&apos;s talk about<br />growing your business</>
              )}
            </h1>

            <p className="font-b text-lg text-neutral-500 leading-relaxed mt-6 max-w-[500px] mx-auto">
              Pick a time for a quick 15-minute call. We&apos;ll walk through your website, your goals, and show you exactly how we can help.
            </p>
          </div>

          {/* What to expect */}
          <div className="fade-in grid sm:grid-cols-3 gap-6 mb-12" style={{ animationDelay: '0.15s' }}>
            {[
              { icon: '🎯', title: 'Your Growth Plan', desc: 'We\'ll review your answers and map out a clear path to your goals' },
              { icon: '🖥️', title: 'Your Live Website', desc: 'Walk through your preview and customize it to perfection' },
              { icon: '🚀', title: 'Your Next Steps', desc: 'A clear roadmap — no pressure, no hard sell, just a plan' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-neutral-200">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-b text-sm font-semibold text-black mb-1">{item.title}</h3>
                <p className="font-b text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Calendly Embed */}
          <div className="fade-in bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xl shadow-neutral-200/50" style={{ animationDelay: '0.3s' }}>
            {/* 
              IMPORTANT: Replace the Calendly URL below with your actual Calendly link.
              Example: https://calendly.com/your-username/15min
            */}
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/jhordanedouard/30min"
              style={{ minWidth: 320, height: 700 }}
            />
            {!loaded && (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 mt-10 mb-16">
            {['Free — no obligation', '15 minutes', 'No hard sell'].map(t => (
              <span key={t} className="font-b text-xs text-neutral-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
