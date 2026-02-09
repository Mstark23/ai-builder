'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const industries = [
  { id: 'restaurant', name: 'Restaurant', icon: '🍽️', tagline: 'Reservation-ready websites that fill tables' },
  { id: 'local-services', name: 'Local Services', icon: '🔧', tagline: 'Lead-generating sites for service pros' },
  { id: 'professional', name: 'Professional', icon: '💼', tagline: 'Credibility-building sites that win clients' },
  { id: 'health-beauty', name: 'Health & Beauty', icon: '💆', tagline: 'Stunning sites that book appointments' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠', tagline: 'Listings that sell properties faster' },
  { id: 'ecommerce', name: 'E-Commerce', icon: '🛒', tagline: 'Stores that turn browsers into buyers' },
  { id: 'fitness', name: 'Fitness & Gym', icon: '💪', tagline: 'High-energy sites that sell memberships' },
  { id: 'medical', name: 'Medical', icon: '⚕️', tagline: 'Trustworthy sites for healthcare providers' },
  { id: 'construction', name: 'Construction', icon: '🏗️', tagline: 'Professional sites that win contracts' },
  { id: 'tech-startup', name: 'Tech & Startup', icon: '🚀', tagline: 'Launch pages that attract investors' },
  { id: 'education', name: 'Education', icon: '📚', tagline: 'Enrollment-driving sites for educators' },
  { id: 'portfolio', name: 'Portfolio', icon: '🎨', tagline: 'Creative showcases that land clients' },
];

export default function FreePreviewPage() {
  const [selected, setSelected] = useState(industries[0]);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [scrolled, setScrolled] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const portfolioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIframeLoaded(false);
    setIframeError(false);
  }, [selected.id]);

  const scrollToPortfolio = () => {
    portfolioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const deviceWidths: Record<string, string> = {
    desktop: 'w-full',
    tablet: 'max-w-[768px] w-full',
    mobile: 'max-w-[375px] w-full',
  };

  return (
    <div className="min-h-screen antialiased" style={{ background: '#faf9f7', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        .fade-up { animation: fadeUp 0.8s ease-out forwards; opacity: 0; }
        .d1 { animation-delay: 0s; } .d2 { animation-delay: 0.12s; } .d3 { animation-delay: 0.24s; } .d4 { animation-delay: 0.36s; } .d5 { animation-delay: 0.48s; }
      `}</style>

      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${scrolled ? 'bg-[#faf9f7]/95 backdrop-blur-xl border-b border-[#ede8df]' : 'bg-transparent'}`}>
        <nav className="max-w-[1200px] mx-auto px-8 flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-2.5 no-underline text-[#0a0a0a]">
            <div className="w-9 h-9 bg-[#0a0a0a] rounded-[10px] flex items-center justify-center hover:rotate-6 transition-transform">
              <span className="text-white font-display text-[0.9rem] font-semibold">V</span>
            </div>
            <span className="font-body text-[14px] font-semibold tracking-wide hidden sm:block">VEKTORLABS</span>
          </Link>
          <Link href="/register" className="px-5 py-2.5 bg-[#0a0a0a] text-white font-body text-[13px] font-semibold rounded-lg hover:bg-[#353230] transition-colors">
            See Your Free Preview →
          </Link>
        </nav>
      </header>

      {/* HERO — Halbert personal letter style */}
      <section className="max-w-[820px] mx-auto px-6 pt-[9rem] pb-8">
        <div className="fade-up d1 inline-flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase text-[#c45d3e] mb-6">
          <span className="relative w-[7px] h-[7px]">
            <span className="absolute inset-0 rounded-full bg-[#c45d3e] opacity-60 animate-ping" />
            <span className="relative block w-[7px] h-[7px] rounded-full bg-[#c45d3e]" />
          </span>
          FREE — NO CREDIT CARD, NO COMMITMENT
        </div>

        <h1 className="fade-up d2 font-display text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.2] tracking-tight mb-6">
          What if you could see your brand-new, custom website… before spending a single dollar?
        </h1>

        <div className="fade-up d3 text-[1.05rem] leading-[1.8] text-[#5e584e] space-y-5">
          <p>Look — you came here because you need a website. Maybe you&apos;ve already talked to a few designers. Maybe they showed you a portfolio full of someone else&apos;s work and asked you to &ldquo;imagine&rdquo; what yours could look like.</p>
          <p>We do things differently.</p>
          <p><strong className="text-[#0a0a0a] font-semibold">We build your website first. You see it. Then you decide.</strong></p>
          <p>No deposit. No contract. No 47-question intake form before you even know if we&apos;re any good. Just tell us a few basics about your business, and within the hour, you&apos;ll be looking at a fully designed, custom website with your name on it.</p>
          <p>If you love it — great, it&apos;s yours. If not — you walk away. No guilt. No follow-up calls. No &ldquo;just checking in!&rdquo; emails.</p>
          <p className="font-semibold text-[#0a0a0a]">But first, let me show you what we&apos;ve already built.</p>
        </div>

        <div className="fade-up d4 mt-8">
          <button onClick={scrollToPortfolio} className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#c45d3e] text-white font-body text-[15px] font-semibold rounded-[10px] hover:bg-[#b35335] hover:shadow-lg transition-all">
            See live examples below
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </button>
          <span className="block mt-2.5 text-[13px] text-[#b5ad9e]">
            or <Link href="/register" className="text-[#c45d3e] underline">skip ahead and start your free preview →</Link>
          </span>
        </div>
      </section>

      {/* PROOF BAR */}
      <div className="fade-up d5 max-w-[820px] mx-auto px-6 mb-12">
        <div className="flex gap-8 py-6 border-t border-b border-[#ede8df] flex-wrap">
          {[
            { val: '<1hr', label: 'From signup to live preview' },
            { val: '$0', label: 'Cost to see your website' },
            { val: '12+', label: 'Industries we build for' },
            { val: '100%', label: 'Custom — not a template' },
          ].map(s => (
            <div key={s.label} className="flex-1 min-w-[140px]">
              <div className="font-display text-[1.6rem] font-semibold text-[#0a0a0a]">{s.val}</div>
              <div className="font-body text-[12px] text-[#b5ad9e] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="max-w-[820px] mx-auto px-6 py-12">
        <h2 className="font-display text-[1.6rem] font-medium mb-1">Here&apos;s exactly what happens next.</h2>
        <p className="text-[#8a8275] mb-8">No mystery. No runaround. Three steps, and you&apos;ll be holding your website.</p>
        <div className="flex flex-col gap-5">
          {[
            { num: '1', title: 'Tell us about your business', desc: 'Your business name, your industry, the vibe you want. That\'s it. Takes about 5 minutes — and we actually read every word.', time: '~5 min' },
            { num: '2', title: 'We build your custom website', desc: 'Not a template with your logo slapped on. A real, designed-from-scratch website built around your brand, your industry, and what actually converts visitors into customers.', time: '~1 hour' },
            { num: '3', title: 'You see it. You decide.', desc: 'We email you the moment it\'s ready. Click the link, see your site. Love it? It\'s yours. Don\'t love it? No charge. No awkward conversation. No strings.', time: 'Your call' },
          ].map(step => (
            <div key={step.num} className="flex gap-4 items-start p-5 bg-white rounded-xl border border-[#ede8df]">
              <div className="w-9 h-9 flex-shrink-0 bg-[#0a0a0a] text-white rounded-lg flex items-center justify-center text-[14px] font-bold">{step.num}</div>
              <div>
                <div className="text-[15px] font-semibold mb-0.5">{step.title}</div>
                <div className="text-[14px] text-[#8a8275] leading-relaxed">{step.desc}</div>
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#f7f4ef] rounded text-[11px] font-semibold text-[#2d8a4e]">{step.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section ref={portfolioRef} className="max-w-[1200px] mx-auto px-6 py-16 scroll-mt-24">
        <div className="max-w-[620px] mb-8">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium mb-2">Don&apos;t take our word for it. See the work.</h2>
          <p className="text-[#8a8275] text-[0.95rem]">Pick your industry. What you see below is the quality you&apos;ll get — built for your business, with your name on it.</p>
        </div>

        {/* Industry tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {industries.map(ind => (
            <button key={ind.id} onClick={() => {
              setSelected(ind);
              if (window.innerWidth < 768) {
                setTimeout(() => document.getElementById('preview-window')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
              }
            }} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-[13px] font-medium transition-all ${selected.id === ind.id ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]' : 'bg-white text-[#5e584e] border-[#ede8df] hover:border-[#b5ad9e]'}`}>
              <span className="text-base">{ind.icon}</span>
              {ind.name}
            </button>
          ))}
        </div>

        {/* Selected info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-4">
          <div>
            <h3 className="font-display text-2xl font-medium">{selected.icon} {selected.name}</h3>
            <p className="text-sm text-[#8a8275] mt-0.5">{selected.tagline}</p>
          </div>
          <Link href="/register" className="inline-flex items-center gap-2 px-5 py-3 bg-[#0a0a0a] text-white font-body text-[14px] font-semibold rounded-[10px] hover:shadow-lg transition-all flex-shrink-0">
            Get Mine Built Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>

        {/* Preview window */}
        <div id="preview-window" className="bg-white rounded-2xl border border-[#ede8df] shadow-xl overflow-hidden scroll-mt-24">
          {/* Browser chrome */}
          <div className="bg-[#f7f4ef] border-b border-[#ede8df] px-4 py-2.5 flex items-center gap-3">
            <div className="flex gap-[5px]">
              <div className="w-[10px] h-[10px] rounded-full bg-red-400" />
              <div className="w-[10px] h-[10px] rounded-full bg-yellow-400" />
              <div className="w-[10px] h-[10px] rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded-md px-3 py-1 text-[11px] text-[#b5ad9e] truncate">
              www.your-{selected.id}-website.com
            </div>
            <div className="hidden sm:flex gap-1">
              {(['desktop', 'tablet', 'mobile'] as const).map(d => (
                <button key={d} onClick={() => setDeviceView(d)} className={`p-1.5 rounded-md transition-all ${deviceView === d ? 'bg-white shadow text-[#0a0a0a]' : 'text-[#b5ad9e] hover:text-[#5e584e]'}`}>
                  {d === 'desktop' && <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12" /></svg>}
                  {d === 'tablet' && <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" /></svg>}
                  {d === 'mobile' && <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>}
                </button>
              ))}
            </div>
          </div>

          {/* Preview area */}
          <div className="bg-[#faf9f7] flex justify-center p-5" style={{ minHeight: 550 }}>
            <div className={`transition-all duration-500 ${deviceWidths[deviceView]}`} key={selected.id + deviceView}>
              <div className="relative bg-white rounded-xl shadow overflow-hidden" style={{ height: deviceView === 'mobile' ? 650 : 550 }}>
                <iframe
                  src={`/examples/${selected.id}.html`}
                  className="w-full h-full border-0"
                  title={`${selected.name} website example`}
                  onLoad={() => setIframeLoaded(true)}
                  onError={() => setIframeError(true)}
                />
                {!iframeLoaded && !iframeError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                    <div className="w-8 h-8 border-2 border-[#ede8df] border-t-[#0a0a0a] rounded-full animate-spin mb-3" />
                    <p className="text-sm text-[#b5ad9e]">Loading preview...</p>
                  </div>
                )}
                {iframeError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#faf9f7] to-[#f7f4ef] p-8">
                    <div className="w-16 h-16 bg-[#0a0a0a] rounded-[18px] flex items-center justify-center mb-4 text-3xl">{selected.icon}</div>
                    <h3 className="font-display text-xl font-medium mb-1">{selected.name} Website</h3>
                    <p className="text-[#8a8275] text-sm text-center max-w-xs mb-4">Full preview coming soon. Get your custom version built free!</p>
                    <Link href="/register" className="px-5 py-2.5 bg-[#c45d3e] text-white text-sm font-semibold rounded-lg hover:bg-[#b35335] transition-all">Build Mine Free →</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom CTA bar */}
          <div className="bg-[#0a0a0a] px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-white text-[14px] font-medium">This could be your {selected.name.toLowerCase()} website by tonight.</p>
              <p className="text-[#b5ad9e] text-[12px]">Custom-built. No templates. Free to preview.</p>
            </div>
            <Link href="/register" className="px-5 py-2.5 bg-white text-[#0a0a0a] text-[13px] font-semibold rounded-lg hover:bg-[#f7f4ef] transition-all flex-shrink-0">
              Get Mine Built Free →
            </Link>
          </div>
        </div>
      </section>

      {/* OBJECTIONS */}
      <section className="max-w-[820px] mx-auto px-6 py-16">
        <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium mb-6">&ldquo;Okay but what&apos;s the catch?&rdquo;</h2>
        <div className="flex flex-col gap-5">
          {[
            { q: '"Why would you build my website for free?"', a: 'Because we know that once you see it, you\'ll want it. We\'d rather spend an hour building your site than an hour trying to convince you with a sales pitch. <strong>The work sells itself.</strong>' },
            { q: '"Is this just a template with my name on it?"', a: 'No. We study the top-performing businesses in your industry — what their sites look like, what makes visitors convert — and build yours using those proven patterns. <strong>Same strategies. Your brand.</strong>' },
            { q: '"What if I don\'t like it?"', a: 'Then you don\'t pay. Simple as that. No deposit to refund. No contract to cancel. We don\'t even ask why. <strong>You just… walk away.</strong>' },
            { q: '"Will you hound me with follow-up emails?"', a: 'We\'ll email you once — when your preview is ready. That\'s it. We\'re not in the business of convincing people who don\'t want to be convinced.' },
            { q: '"How much does it cost if I DO want it?"', a: 'You\'ll see pricing after you\'ve seen your website. We want you to know exactly what you\'re getting before you see a number. That\'s how it should work — <strong>value first, price second.</strong>' },
          ].map((item, i) => (
            <div key={i} className="p-5 bg-white rounded-xl border border-[#ede8df]">
              <div className="text-[15px] font-semibold text-[#0a0a0a] mb-1.5 flex items-start gap-2">
                <span className="text-[#c45d3e] font-bold flex-shrink-0">→</span>
                {item.q}
              </div>
              <div className="text-[14px] text-[#8a8275] leading-[1.7] pl-5" dangerouslySetInnerHTML={{ __html: item.a }} />
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-[820px] mx-auto px-6 pb-20">
        <div className="bg-[#0a0a0a] rounded-2xl p-10 text-white">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium mb-4 leading-snug">
            Your competitors already have websites.<br />Customers are choosing them right now.
          </h2>
          <p className="text-[#b5ad9e] text-[0.95rem] leading-[1.7] mb-4">
            Every day without a website is a day your competitors are getting the customers that should be yours. You don&apos;t need to think about it. You don&apos;t need to &ldquo;circle back later.&rdquo; You just need to see what we can build for you.
          </p>
          <p className="text-[#b5ad9e] text-[0.95rem] mb-6">It takes 5 minutes to start. You&apos;ll have your preview within the hour.</p>
          <Link href="/register" className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#0a0a0a] text-[14px] font-semibold rounded-[10px] hover:bg-[#f7f4ef] transition-all">
            Start My Free Preview →
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
          <div className="mt-6 pt-4 border-t border-[#353230] text-[13px] text-[#b5ad9e] leading-relaxed">
            <strong className="text-[#ddd6c9]">P.S.</strong> — Still not sure? That&apos;s fine. Scroll back up and look at the examples. Click through them. That&apos;s the quality we deliver. And we build yours <em>free</em> before you decide anything. The only risk is not seeing what we can do for you.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 border-t border-[#ede8df]">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0a0a0a] rounded-lg flex items-center justify-center">
              <span className="text-white font-display text-sm font-semibold">V</span>
            </div>
            <span className="text-[13px] font-semibold text-[#8a8275]">VEKTORLABS</span>
          </div>
          <span className="text-[12px] text-[#b5ad9e]">© 2026 VektorLabs. All rights reserved.</span>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#faf9f7]/97 backdrop-blur-xl border-t border-[#ede8df] p-2.5 sm:hidden">
        <Link href="/register" className="block w-full py-3 bg-[#c45d3e] text-white text-[14px] font-semibold rounded-[10px] text-center">
          Get My Free Website Preview →
        </Link>
      </div>
    </div>
  );
}
