'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

// ── Types ──
interface LeadData {
  industry: string;
  websiteType: string;
  businessName: string;
  email: string;
  phone: string;
}

// ── Industries ──
const INDUSTRIES = [
  'Restaurants & Food', 'Real Estate', 'E-Commerce / Retail', 'Health & Wellness',
  'Construction & Trades', 'Beauty & Skincare', 'Fitness & Gym', 'Legal Services',
  'Dental & Medical', 'Photography', 'SaaS / Tech', 'Consulting',
  'Education & Coaching', 'Jewelry & Accessories', 'Home Services', 'Financial Services',
];

const TYPES = ['Business Website', 'Online Store', 'Landing Page', 'Portfolio', 'Booking Site'];

const ALL_TAGS = [
  'Restaurants', 'E-Commerce', 'Real Estate', 'Health & Wellness', 'Construction', 'Beauty',
  'Legal', 'Dental', 'SaaS', 'Photography', 'Consulting', 'Fitness', 'Education', 'Jewelry',
  'Automotive', 'Home Services', 'Pet Services', 'Travel', 'Financial', 'Non-Profit',
  'Architecture', 'Interior Design', 'Cleaning', 'Insurance', 'Landscaping', 'Plumbing',
  'HVAC', 'Roofing',
];
const HOT_TAGS = ['Restaurants', 'E-Commerce', 'Real Estate', 'Beauty', 'SaaS', 'Jewelry'];
const TAG_TO_INDUSTRY: Record<string, string> = {
  'Restaurants': 'Restaurants & Food', 'E-Commerce': 'E-Commerce / Retail', 'Real Estate': 'Real Estate',
  'Health & Wellness': 'Health & Wellness', 'Construction': 'Construction & Trades', 'Beauty': 'Beauty & Skincare',
  'Legal': 'Legal Services', 'Dental': 'Dental & Medical', 'SaaS': 'SaaS / Tech', 'Photography': 'Photography',
  'Consulting': 'Consulting', 'Fitness': 'Fitness & Gym', 'Education': 'Education & Coaching',
  'Jewelry': 'Jewelry & Accessories', 'Automotive': 'Home Services', 'Home Services': 'Home Services',
  'Pet Services': 'Home Services', 'Travel': 'Consulting', 'Financial': 'Financial Services',
  'Non-Profit': 'Consulting', 'Architecture': 'Construction & Trades', 'Interior Design': 'Home Services',
  'Cleaning': 'Home Services', 'Insurance': 'Financial Services', 'Landscaping': 'Home Services',
  'Plumbing': 'Construction & Trades', 'HVAC': 'Construction & Trades', 'Roofing': 'Construction & Trades',
};

function LandingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [lead, setLead] = useState<LeadData>({ industry: '', websiteType: '', businessName: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteFade, setQuoteFade] = useState(true);

  useEffect(() => {
    const shop = searchParams.get('shop');
    const hmac = searchParams.get('hmac');
    if (shop && hmac) { sessionStorage.setItem('shopify_shop', shop); router.push(`/portal?shopify_connected=true&shop=${encodeURIComponent(shop)}`); }
  }, [searchParams, router]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const QUOTES = [
    { text: 'Success is a decision away.', author: '' },
    { text: 'If you think you can or if you think you can\u2019t, either way you\u2019re correct.', author: 'Henry Ford' },
    { text: 'Don\u2019t let anyone steal your dream.', author: '' },
    { text: 'Believe you can succeed and you will.', author: '' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteFade(false);
      setTimeout(() => {
        setQuoteIdx(prev => (prev + 1) % QUOTES.length);
        setQuoteFade(true);
      }, 600);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToCapture = () => {
    const errs: Record<string, boolean> = {};
    if (!lead.industry) errs.industry = true;
    if (!lead.websiteType) errs.websiteType = true;
    if (!lead.businessName.trim()) errs.businessName = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStep(2); window.scrollTo(0, 0);
  };

  const submitLead = async () => {
    const errs: Record<string, boolean> = {};
    if (!lead.email.trim() || !lead.email.includes('@')) errs.email = true;
    if (!lead.phone.trim() || lead.phone.length < 7) errs.phone = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
      if (!res.ok) throw new Error('Failed');
      await res.json();
    } catch (e) { console.error('Lead submission error:', e); }
    setSubmitting(false); setStep(3); window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-d { font-family: 'Playfair Display', Georgia, serif; }
        .font-b { font-family: 'Inter', -apple-system, sans-serif; }
        .gradient-text { background: linear-gradient(135deg, #1a1a1a 0%, #666 50%, #1a1a1a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .noise { position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: 0.03; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slideUp 0.8s ease forwards; opacity: 0; transform: translateY(30px); }
        @keyframes ping { 75%, to { transform: scale(2); opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes cardIn { from { opacity: 0; transform: scale(0.97) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes checkIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        .card-in { animation: cardIn 0.4s ease; }
        .check-in { animation: checkIn 0.4s ease 0.2s both; }
        .quote-fade { transition: opacity 0.6s ease, transform 0.6s ease; }
        .quote-visible { opacity: 1; transform: translateY(0); }
        .quote-hidden { opacity: 0; transform: translateY(12px); }
        @keyframes ghostFloat { 0% { opacity: 0; transform: translateY(8px); } 15% { opacity: 0.7; transform: translateY(0); } 85% { opacity: 0.7; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-8px); } }
      `}</style>
      <div className="noise" />

      {/* ═══ STEP 1: LANDING ═══ */}
      {step === 1 && (<>
        {/* Nav */}
        <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
          <nav className="max-w-[1400px] mx-auto px-8 lg:px-12 flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11"><div className="absolute inset-0 bg-black rounded-xl transition-transform duration-300 group-hover:rotate-6" /><div className="absolute inset-0 flex items-center justify-center"><span className="text-white font-d text-xl font-semibold">V</span></div></div>
              <span className="hidden sm:block font-b text-[15px] font-semibold tracking-wide text-black">VEKTORLABS</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/login" className="font-b text-[13px] font-medium text-neutral-500 hover:text-black transition-colors hidden sm:block">Sign In</Link>
              <button onClick={() => document.getElementById('sel-industry')?.focus()} className="px-6 py-3 bg-black text-white font-b text-[13px] font-medium tracking-wide rounded-full hover:shadow-lg hover:shadow-black/20 transition-all">Get Free Preview</button>
            </div>
          </nav>
        </header>

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center pt-20">
          {/* Ghost Quote */}
          <div className="absolute top-24 left-0 right-0 z-30 flex justify-center pointer-events-none">
            <p
              key={quoteIdx}
              className="font-d text-sm sm:text-base italic text-neutral-400/70 tracking-wide"
              style={{ animation: 'ghostFloat 5s ease-in-out forwards' }}
            >
              {QUOTES[quoteIdx].text}
            </p>
          </div>
          <div className="absolute top-1/4 -right-64 w-[800px] h-[800px] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-60" style={{ animation: 'float 6s ease-in-out infinite' }} />
          <div className="absolute -bottom-32 -left-64 w-[600px] h-[600px] bg-gradient-to-tr from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-40" />
          <div className="relative max-w-[1400px] mx-auto px-8 lg:px-12 py-24 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="slide-up inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-full border border-neutral-200 shadow-sm">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" style={{ animation: 'ping 1s cubic-bezier(0,0,.2,1) infinite' }} /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
                <span className="font-b text-xs font-medium tracking-wide text-neutral-600">YOU&apos;RE ONE PREVIEW AWAY</span>
              </div>
              <h1 className="slide-up font-d text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-tight text-black mt-8" style={{ animationDelay: '0.1s' }}>
                The business<br />you keep<br /><span className="gradient-text">picturing?</span><br />Let&apos;s build it.
              </h1>
              <p className="slide-up font-b text-lg sm:text-xl text-neutral-500 max-w-lg leading-relaxed mt-6" style={{ animationDelay: '0.2s' }}>
                We studied the fastest-growing businesses in 44 industries and reverse-engineered why customers choose them. Then we built it for yours — free, in under 24&nbsp;hours.
              </p>
              <div className="slide-up mt-8" style={{ animationDelay: '0.3s' }}>
                <a href="#pain" className="inline-flex items-center gap-2 px-8 py-4 font-b text-sm font-medium text-neutral-600 hover:text-black transition-colors">
                  See Why This Works <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </a>
              </div>
              <div className="slide-up grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-neutral-200" style={{ animationDelay: '0.4s' }}>
                {[{ v: '44', l: 'Industries Studied' }, { v: '200+', l: 'Winners Mapped' }, { v: '24h', l: 'Your Preview' }].map(s => (
                  <div key={s.l}><div className="font-d text-3xl sm:text-4xl font-semibold text-black">{s.v}</div><div className="font-b text-xs text-neutral-400 mt-1 tracking-wide">{s.l}</div></div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="relative">
              <div className="slide-up relative bg-white rounded-3xl p-8 shadow-2xl shadow-neutral-200/50" style={{ animationDelay: '0.3s' }}>
                <h2 className="font-d text-2xl font-medium text-black mb-1">Get your free preview</h2>
                <p className="font-b text-sm text-neutral-500 mb-6">Tell us what you&apos;re building — we&apos;ll show you what&apos;s possible</p>
                <div className="mb-4">
                  <label className="block font-b text-xs font-semibold tracking-[0.1em] uppercase text-neutral-400 mb-2">Industry</label>
                  <select id="sel-industry" value={lead.industry} onChange={e => { setLead({ ...lead, industry: e.target.value }); setErrors({ ...errors, industry: false }); }} className={`w-full px-4 py-3.5 border rounded-xl font-b text-[15px] bg-white outline-none transition-colors appearance-none ${errors.industry ? 'border-red-500' : 'border-neutral-200 focus:border-black'}`}>
                    <option value="">Select your industry</option>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block font-b text-xs font-semibold tracking-[0.1em] uppercase text-neutral-400 mb-2">What Do You Need?</label>
                  <select value={lead.websiteType} onChange={e => { setLead({ ...lead, websiteType: e.target.value }); setErrors({ ...errors, websiteType: false }); }} className={`w-full px-4 py-3.5 border rounded-xl font-b text-[15px] bg-white outline-none transition-colors appearance-none ${errors.websiteType ? 'border-red-500' : 'border-neutral-200 focus:border-black'}`}>
                    <option value="">Select type</option>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block font-b text-xs font-semibold tracking-[0.1em] uppercase text-neutral-400 mb-2">Business or Project Name</label>
                  <input type="text" placeholder="What are you building?" value={lead.businessName} onChange={e => { setLead({ ...lead, businessName: e.target.value }); setErrors({ ...errors, businessName: false }); }} className={`w-full px-4 py-3.5 border rounded-xl font-b text-[15px] outline-none transition-colors ${errors.businessName ? 'border-red-500' : 'border-neutral-200 focus:border-black'}`} />
                </div>
                <button onClick={goToCapture} className="w-full py-4 bg-black text-white rounded-full font-b text-sm font-medium tracking-wide flex items-center justify-center gap-2.5 hover:shadow-xl hover:shadow-black/20 transition-all mt-2">
                  Get My Free Preview in 24 Hours <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
                <p className="text-center mt-3 font-b text-xs text-neutral-400">Free. Under 24 hours. No call. No credit card.</p>
              </div>
              <div className="hidden lg:flex absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-lg shadow-neutral-200/50 items-center gap-3" style={{ animation: 'float 6s ease-in-out 1s infinite' }}>
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                <div><div className="font-b text-xs font-medium text-black">Intelligence Applied</div><div className="font-b text-xs text-neutral-400">From 200+ top brands</div></div>
              </div>
              <div className="hidden lg:flex absolute -bottom-4 -left-8 bg-white rounded-2xl p-4 shadow-lg shadow-neutral-200/50 items-center gap-3" style={{ animation: 'float 6s ease-in-out 2s infinite' }}>
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                <div><div className="font-b text-xs font-medium text-black">Ready in 24 hours</div><div className="font-b text-xs text-neutral-400">Your name on it</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PAIN ── */}
        <section id="pain" className="py-24 lg:py-32 bg-black text-white overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
            <span className="font-b text-xs font-medium tracking-[0.15em] text-neutral-500 uppercase">Be honest with yourself</span>
            <h2 className="font-d text-4xl lg:text-5xl font-medium text-white mt-4 leading-tight max-w-[600px]">You know exactly where you want to go. You just can&apos;t get there.</h2>
            <div className="grid md:grid-cols-2 gap-16 mt-16">
              <div className="space-y-6">
                <p className="font-b text-neutral-400 leading-relaxed text-[16px]">Maybe it&apos;s the online store you&apos;ve been planning for 6 months that still lives in a Google Doc. Maybe it&apos;s the business you opened that should be doing $20K months by now but you&apos;re stuck at $4K and can&apos;t figure out why. Maybe things are working but you&apos;ve hit a wall — same revenue, same customers, same ceiling.</p>
                <p className="font-b text-neutral-400 leading-relaxed text-[16px]">Meanwhile, someone in your space who started after you is already there. More customers. More revenue. More momentum. And the thing that keeps you up at night isn&apos;t that they&apos;re better than you — it&apos;s that <strong className="text-white">you know they&apos;re not.</strong></p>
              </div>
              <div className="space-y-6">
                <p className="font-b text-neutral-400 leading-relaxed text-[16px]">You&apos;ve tried to fix it. The courses. The YouTube videos. The boosted posts that got 11 likes from people who&apos;ll never buy from you. The cousin who &ldquo;knows websites.&rdquo; The $200 in ads that disappeared into nothing.</p>
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mt-4">
                  <p className="font-d text-xl text-white italic leading-relaxed">&ldquo;None of it worked because you were guessing. They&apos;re not guessing. That&apos;s the only difference between you and them.&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DREAM ── */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
            <span className="font-b text-xs font-medium tracking-[0.15em] text-neutral-400 uppercase">Now picture this</span>
            <h2 className="font-d text-4xl lg:text-5xl font-medium text-black mt-4 leading-tight max-w-[600px]">What if this time next month, it&apos;s actually working?</h2>
            <div className="grid lg:grid-cols-3 gap-8 mt-14">
              {[
                { icon: '📱', title: 'Orders while you sleep', desc: "You check your phone in the morning — a new order came in at 2AM. Someone found you, trusted you, and bought from you while you were sleeping. You didn't chase them. They came to you." },
                { icon: '📈', title: 'From stuck to scaling', desc: "The barber with three empty chairs? Booked out two weeks. The skincare brand stuck at the same revenue for 8 months? First $12K week. The guy who never launched? His first 30 orders are in." },
                { icon: '✨', title: 'From invisible to undeniable', desc: "That's not fantasy. That's what happens when you stop showing up like an amateur and start showing up like the businesses that are actually winning. That shift — that's what VektorLabs creates." },
              ].map(c => (
                <div key={c.title} className="bg-neutral-50 rounded-3xl p-8 border border-transparent hover:border-neutral-200 hover:bg-white transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-sm">{c.icon}</div>
                  <h3 className="font-d text-xl font-medium text-black mb-3">{c.title}</h3>
                  <p className="font-b text-[14px] text-neutral-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROOF ── */}
        <section className="py-24 lg:py-32 bg-[#fafafa]">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
            <span className="font-b text-xs font-medium tracking-[0.15em] text-neutral-400 uppercase">Here&apos;s what we did</span>
            <h2 className="font-d text-4xl lg:text-5xl font-medium text-black mt-4 leading-tight max-w-[500px]">We found the playbook. Now it&apos;s yours.</h2>
            <div className="grid lg:grid-cols-2 gap-16 mt-14">
              <div className="space-y-4">
                {[
                  { icon: '◆', name: '44 Industries Dissected', desc: 'From e-commerce to restaurants, fitness to real estate, salons to construction — we studied the businesses that are dominating, not the ones with the biggest budgets.', pills: ['200+ brands', '44+ industries', '12 layers'] },
                  { icon: '◇', name: 'The Psychology Extracted', desc: 'We broke down exactly why a stranger lands on their page and thinks "this is the one" within 3 seconds. The trust signals, the flow, the words that convert.' },
                  { icon: '▣', name: 'Built For Your Business', desc: 'Within 24 hours we build a live preview using the exact strategies driving growth for the top performers in your space. Three custom versions. Your name.' },
                ].map(c => (
                  <div key={c.name} className="bg-white rounded-3xl p-6 border border-transparent hover:border-neutral-200 transition-all">
                    <div className="flex items-center gap-3 mb-3"><div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white text-sm">{c.icon}</div><span className="font-d text-base font-medium">{c.name}</span></div>
                    <p className="font-b text-[13px] text-neutral-500 leading-relaxed">{c.desc}</p>
                    {c.pills && <div className="flex gap-2 mt-3 flex-wrap">{c.pills.map(p => <span key={p} className="px-3 py-1 bg-neutral-100 rounded-lg text-[11px] font-medium text-neutral-500">{p}</span>)}</div>}
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-3xl p-8 border border-neutral-200">
                <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-neutral-400 mb-5">What We Reverse-Engineered</div>
                {['Why customers trust them in 3 seconds', 'The headline patterns that stop the scroll', 'CTA placement that drives action', 'Trust signals that remove doubt instantly', 'Urgency triggers that feel natural', 'Social proof that actually converts', 'Navigation that guides, not confuses', 'Mobile flows that close sales', 'Pricing psychology that justifies premium', 'Content hierarchy that tells a story', 'Emotional triggers that create connection', 'The full strategic blueprint — applied to you'].map((l, i) => (
                  <div key={l} className="py-2.5 text-[13px] text-neutral-500 flex items-center gap-3"><span className="font-d text-sm font-semibold text-black min-w-[20px]">{String(i + 1).padStart(2, '0')}</span>{l}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── URGENCY ── */}
        <section className="py-24 lg:py-32 bg-black text-white">
          <div className="max-w-[800px] mx-auto px-8 lg:px-12 text-center">
            <span className="font-b text-xs font-medium tracking-[0.15em] text-red-400 uppercase">One more thing</span>
            <h2 className="font-d text-4xl lg:text-5xl font-medium text-white mt-4 leading-tight">The business you keep picturing? Someone else is building&nbsp;it.</h2>
            <p className="font-b text-lg text-neutral-400 leading-relaxed mt-8 max-w-[600px] mx-auto">Not thinking about it. Not planning it. Building it. Right now. While you&apos;re reading this, they&apos;re getting the customers you should be getting, taking the spot in your market that should be yours.</p>
            <p className="font-b text-lg text-neutral-400 leading-relaxed mt-6 max-w-[600px] mx-auto">A year from now, one of two things will be true. Either you&apos;ll look back at this moment and think <em className="text-white italic">&ldquo;that&apos;s when everything changed.&rdquo;</em> Or you&apos;ll still be exactly where you are right now — except a year further behind.</p>
            <div className="mt-10">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => document.getElementById('sel-industry')?.focus(), 700); }} className="px-10 py-5 bg-white text-black font-b text-sm font-semibold tracking-wide rounded-full hover:shadow-xl hover:shadow-white/20 transition-all">Get My Free Preview in 24 Hours →</button>
              <p className="font-b text-sm text-neutral-500 mt-4">Free. Under 24 hours. No call. No credit card.</p>
            </div>
          </div>
        </section>

        {/* ── INDUSTRIES ── */}
        <section className="py-24 lg:py-32 bg-[#fafafa] text-center">
          <div className="max-w-[1000px] mx-auto px-8">
            <span className="font-b text-xs font-medium tracking-[0.15em] text-neutral-400 uppercase">Your Industry</span>
            <h2 className="font-d text-4xl lg:text-5xl font-medium text-black mt-4 leading-tight max-w-[500px] mx-auto">44+ industries. One playbook. Your&nbsp;name.</h2>
            <div className="flex flex-wrap justify-center gap-2 mt-10">
              {ALL_TAGS.map(t => (
                <button key={t} onClick={() => { setLead({ ...lead, industry: TAG_TO_INDUSTRY[t] || '' }); setErrors({ ...errors, industry: false }); document.getElementById('sel-industry')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className={`px-5 py-2.5 text-[13px] font-medium rounded-full border transition-all cursor-pointer hover:border-black hover:text-black hover:bg-white ${HOT_TAGS.includes(t) ? 'border-black text-black bg-white' : 'border-neutral-200 text-neutral-500'}`}>{t}</button>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-16 bg-neutral-950 text-white">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3"><div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center"><span className="text-black font-d text-xl font-semibold">V</span></div><span className="font-b text-[15px] font-semibold tracking-wide">VEKTORLABS</span></div>
            <div className="flex items-center gap-8 text-sm text-neutral-500"><Link href="/about" className="hover:text-white transition-colors">About</Link><Link href="/terms" className="hover:text-white transition-colors">Terms</Link><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></div>
            <p className="font-b text-sm text-neutral-500">© 2026 VektorLabs. All rights reserved.</p>
          </div>
        </footer>
      </>)}

      {/* ═══ STEP 2: LEAD CAPTURE ═══ */}
      {step === 2 && (
        <div className="min-h-screen flex items-center justify-center px-6 py-10 relative overflow-hidden">
          <div className="absolute top-[10%] -right-[150px] w-[600px] h-[600px] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[10%] -left-[150px] w-[500px] h-[500px] bg-gradient-to-tr from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-40" />
          <div className="card-in relative bg-white rounded-3xl p-12 max-w-[480px] w-full shadow-2xl shadow-neutral-200/50">
            <div className="flex items-center gap-2.5 mb-8"><div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center"><span className="text-white font-d text-lg font-semibold">V</span></div><span className="font-b text-sm font-semibold tracking-wide text-black">VEKTORLABS</span></div>
            <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mb-6 text-3xl">🚀</div>
            <h2 className="font-d text-[28px] font-medium text-black mb-2">Almost there.</h2>
            <p className="font-b text-[15px] text-neutral-500 leading-relaxed mb-7">We&apos;ll build your custom preview and <strong className="text-black">text you the link</strong> when it&apos;s ready — usually under 24&nbsp;hours.</p>
            <div className="flex flex-wrap gap-2 mb-6">{[lead.industry, lead.websiteType, lead.businessName].map(v => (<span key={v} className="px-3.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-600">{v}</span>))}</div>
            <div className="mb-3.5"><label className="block font-b text-xs font-semibold tracking-[0.08em] uppercase text-neutral-400 mb-1.5">Email</label><input type="email" placeholder="you@business.com" value={lead.email} onChange={e => { setLead({ ...lead, email: e.target.value }); setErrors({ ...errors, email: false }); }} className={`w-full px-4 py-3.5 border rounded-xl font-b text-[15px] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-neutral-200 focus:border-black'}`} /></div>
            <div className="mb-3.5"><label className="block font-b text-xs font-semibold tracking-[0.08em] uppercase text-neutral-400 mb-1.5">Phone Number</label><input type="tel" placeholder="(514) 555-1234" value={lead.phone} onChange={e => { setLead({ ...lead, phone: e.target.value }); setErrors({ ...errors, phone: false }); }} className={`w-full px-4 py-3.5 border rounded-xl font-b text-[15px] outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-neutral-200 focus:border-black'}`} /></div>
            <button onClick={submitLead} disabled={submitting} className="w-full py-4 bg-black text-white rounded-full font-b text-sm font-medium tracking-wide flex items-center justify-center gap-2.5 hover:shadow-xl hover:shadow-black/20 transition-all mt-2 disabled:opacity-50">
              {submitting ? 'Sending...' : 'Build My Preview'}<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
            <p className="text-center mt-4 font-b text-xs text-neutral-400">Free preview. No commitment required.</p>
            <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-neutral-100">{['Free preview', 'Under 24 hours', 'No spam'].map(t => (<span key={t} className="font-b text-[11px] text-neutral-400 flex items-center gap-1"><svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{t}</span>))}</div>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: CONFIRMATION ═══ */}
      {step === 3 && (
        <div className="min-h-screen flex items-center justify-center px-6 py-10 relative overflow-hidden">
          <div className="absolute top-[10%] -right-[150px] w-[600px] h-[600px] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[10%] -left-[150px] w-[500px] h-[500px] bg-gradient-to-tr from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-40" />
          <div className="card-in relative bg-white rounded-3xl p-14 max-w-[520px] w-full shadow-2xl shadow-neutral-200/50 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-7"><svg className="w-9 h-9 text-emerald-600 check-in" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
            <h2 className="font-d text-[32px] font-medium text-black mb-2">We&apos;re on it.</h2>
            <p className="font-b text-base text-neutral-500 leading-relaxed mb-8">Your custom preview is being built right now. We&apos;ll <strong className="text-black">text you the link</strong> when it&apos;s ready.</p>
            <div className="text-left max-w-[340px] mx-auto mb-8">
              {[{ icon: '✓', active: true, title: 'Request received', desc: 'We have your business details' }, { icon: '⚡', active: true, title: 'Building your preview', desc: 'Using intelligence from top brands in your space' }, { icon: '📱', active: false, title: 'Text you the preview link', desc: 'Usually under 24 hours' }].map((s, i) => (
                <div key={s.title} className="flex gap-4 py-3 relative">
                  {i < 2 && <div className="absolute left-[15px] top-10 bottom-0 w-[1.5px] bg-neutral-200" />}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm z-10 ${s.active ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-400'}`}>{s.icon}</div>
                  <div><h4 className="font-b text-sm font-semibold text-black mb-0.5">{s.title}</h4><p className="font-b text-xs text-neutral-400 leading-relaxed">{s.desc}</p></div>
                </div>
              ))}
            </div>
            <div className="font-d text-xl font-medium text-black mb-1">{lead.businessName}</div>
            <div className="font-b text-[13px] text-neutral-400">{lead.industry} · {lead.websiteType} · {lead.phone}</div>
            <p className="font-b text-xs text-neutral-400 mt-6 leading-relaxed">Questions? Text us anytime at <strong className="text-neutral-300">(514) XXX-XXXX</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafafa]"><div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>}>
      <LandingPage />
    </Suspense>
  );
}
