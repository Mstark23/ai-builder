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

const QUOTES = [
  'Success is a decision away.',
  'If you think you can or if you think you can\u2019t, either way you\u2019re correct.',
  'Don\u2019t let anyone steal your dream.',
  'Believe you can succeed and you will.',
];

const PAIN_CARDS = [
  { title: 'You\u2019re the one doing everything', desc: 'Answering messages. Sending quotes. Following up. Posting on social media. Chasing reviews. Running the actual business on top of all that. There\u2019s one of you and a hundred things that need doing.', icon: 'people' },
  { title: 'Customers are falling through the cracks', desc: 'Someone reaches out on a Friday night. You don\u2019t see it until Monday. By then they already booked with someone else. You didn\u2019t lose them because you\u2019re bad \u2014 you lost them because you were busy.', icon: 'face' },
  { title: 'You know you should be doing more', desc: 'Better website. More reviews. Faster responses. Follow-up emails. You\u2019ve known this for months. But when are you supposed to do it? Between the 6am start and the 9pm finish?', icon: 'clock' },
  { title: 'Growth means more work \u2014 not more freedom', desc: 'Every new customer means more for YOU to handle. More messages. More follow-ups. More to manage. You didn\u2019t start a business to work 80-hour weeks \u2014 but that\u2019s where you\u2019re headed.', icon: 'trend' },
];

const RESULT_CARDS = [
  { title: 'You wake up to new customers', desc: 'Someone found you at 11pm. Their questions got answered. They saw your reviews. They booked. You slept through the whole thing and woke up with money on the way.', icon: 'moon' },
  { title: 'Nobody slips through the cracks', desc: 'Every person who reaches out \u2014 website, phone, after hours \u2014 gets a response within seconds. Not minutes. Not tomorrow. Seconds. You become the business that always answers.', icon: 'shield' },
  { title: 'You finally get your time back', desc: 'Take a weekend off. Take a week off. Your business keeps answering, keeps booking, keeps collecting reviews. You work on growing \u2014 not surviving.', icon: 'sun' },
];

// ── SVG Icons ──
function PainIcon({ type }: { type: string }) {
  const cls = "w-6 h-6";
  if (type === 'people') return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
  if (type === 'face') return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><path d="M8 12h.01M16 12h.01M9 16s1.5 1 3 1 3-1 3-1"/></svg>;
  if (type === 'clock') return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
}

function ResultIcon({ type }: { type: string }) {
  const cls = "w-6 h-6";
  if (type === 'moon') return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>;
  if (type === 'shield') return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>;
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
}

function LandingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [lead, setLead] = useState<LeadData>({ industry: '', websiteType: '', businessName: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [spots] = useState(() => 4 + Math.floor(Math.random() * 5));

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

  useEffect(() => {
    const timer = setInterval(() => setQuoteIdx(prev => (prev + 1) % QUOTES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // Step 1 → 2: just need business name
  const goToCapture = () => {
    if (!lead.businessName.trim()) { setErrors({ businessName: true }); return; }
    setErrors({});
    setStep(2);
    window.scrollTo(0, 0);
  };

  // Step 2 → 3: need industry, type, email, phone
  const submitLead = async () => {
    const errs: Record<string, boolean> = {};
    if (!lead.industry) errs.industry = true;
    if (!lead.websiteType) errs.websiteType = true;
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-d { font-family: 'Playfair Display', Georgia, serif; }
        .font-b { font-family: 'Inter', -apple-system, sans-serif; }
        .gradient-text { background: linear-gradient(135deg, #1a1a1a 0%, #666 50%, #1a1a1a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .noise { position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: 0.03; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slideUp 0.8s ease forwards; opacity: 0; transform: translateY(30px); }
        @keyframes ping { 75%, to { transform: scale(2); opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        @keyframes ghostFloat { 0% { opacity: 0; transform: translateY(8px); } 15% { opacity: 0.65; } 85% { opacity: 0.65; } 100% { opacity: 0; transform: translateY(-8px); } }
        @keyframes cardIn { from { opacity: 0; transform: scale(0.97) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes checkIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        .card-in { animation: cardIn 0.4s ease; }
        .check-in { animation: checkIn 0.4s ease 0.2s both; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>
      <div className="noise" />

      {/* ═══ STEP 1: LANDING ═══ */}
      {step === 1 && (<>
        {/* Nav */}
        <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-white/90 backdrop-blur-xl border-b border-black/[0.04]'}`}>
          <nav className="max-w-[1400px] mx-auto px-8 lg:px-12 flex items-center justify-between h-[76px]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-[42px] h-[42px]"><div className="absolute inset-0 bg-black rounded-xl transition-transform duration-300 group-hover:rotate-6" /><div className="absolute inset-0 flex items-center justify-center"><span className="text-white font-d text-[19px] font-semibold">V</span></div></div>
              <span className="hidden sm:block font-b text-[15px] font-semibold tracking-wide text-black">VEKTORLABS</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/login" className="font-b text-[13px] font-medium text-neutral-400 hover:text-black transition-colors hidden sm:block">Sign In</Link>
              <button onClick={() => document.getElementById('biz-name')?.focus()} className="px-6 py-[11px] bg-black text-white font-b text-[13px] font-medium tracking-wide rounded-full hover:shadow-lg hover:shadow-black/15 transition-all">Get Your Free Website</button>
            </div>
          </nav>
        </header>

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center pt-[76px]">
          <div className="absolute top-24 left-0 right-0 z-30 flex justify-center pointer-events-none">
            <p key={quoteIdx} className="font-d text-lg sm:text-2xl italic text-black/50" style={{ animation: 'ghostFloat 5s ease-in-out forwards' }}>&ldquo;{QUOTES[quoteIdx]}&rdquo;</p>
          </div>
          <div className="absolute top-[20%] -right-64 w-[800px] h-[800px] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full blur-[60px] opacity-60" style={{ animation: 'float 6s ease-in-out infinite' }} />
          <div className="absolute -bottom-32 -left-64 w-[600px] h-[600px] bg-gradient-to-tr from-neutral-100 to-neutral-200 rounded-full blur-[60px] opacity-40" />

          <div className="relative max-w-[1400px] mx-auto px-8 lg:px-12 py-20 lg:py-[60px] grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="slide-up inline-flex items-center gap-[10px] px-[18px] py-2 bg-red-50 border border-red-200 rounded-full">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" style={{ animation: 'ping 1s cubic-bezier(0,0,.2,1) infinite' }} /><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" /></span>
                <span className="font-b text-[11px] font-bold tracking-[0.06em] text-red-600">YOUR COMPETITOR FIGURED THIS OUT ALREADY</span>
              </div>

              <h1 className="slide-up font-d text-[clamp(42px,5.2vw,68px)] font-medium leading-[1.08] text-black mt-7" style={{ animationDelay: '0.1s' }}>
                What if your<br />business ran<br /><span className="gradient-text">without</span> you<br />for a week?
              </h1>

              <p className="slide-up font-b text-[clamp(16px,1.3vw,19px)] text-neutral-500 max-w-[500px] leading-relaxed mt-5" style={{ animationDelay: '0.2s' }}>
                Right now, if you step away &mdash; things break. Customers don&apos;t get answered. Follow-ups don&apos;t happen. Money gets left on the table. Your competitor doesn&apos;t have that problem. We&apos;ll show you&nbsp;why.
              </p>

              <div className="slide-up flex flex-wrap gap-[10px] mt-7" style={{ animationDelay: '0.3s' }}>
                {['Customers get answered instantly', 'No lead falls through the cracks', 'New customers while you sleep', '5-star reviews without asking'].map(r => (
                  <div key={r} className="flex items-center gap-[7px] px-4 py-2 bg-white border border-neutral-200 rounded-full font-b text-[13px] text-neutral-600 font-medium">
                    <span className="w-[7px] h-[7px] rounded-full bg-emerald-500" />{r}
                  </div>
                ))}
              </div>

              <div className="slide-up grid grid-cols-3 gap-6 mt-9 pt-9 border-t border-neutral-200" style={{ animationDelay: '0.4s' }}>
                {[{ v: '78%', l: 'of customers hire whoever responds first' }, { v: '62%', l: 'of small business calls go unanswered after hours' }, { v: '5×', l: 'more customers for businesses with 50+ reviews' }].map(s => (
                  <div key={s.v}><div className="font-d text-[clamp(26px,2.8vw,38px)] font-semibold text-black">{s.v}</div><div className="font-b text-[11px] text-neutral-400 mt-1 leading-snug">{s.l}</div></div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div className="relative">
              <div className="slide-up relative bg-white rounded-3xl p-8 shadow-2xl shadow-neutral-200/50" style={{ animationDelay: '0.3s' }}>
                <h2 className="font-d text-[26px] font-medium text-black mb-1">We&apos;ll build your website &mdash; free</h2>
                <p className="font-b text-sm text-neutral-500 mb-1.5">A premium, working website for your business. Ready in 24 hours. Yours to keep.</p>
                <div className="flex items-center gap-2 font-b text-sm font-semibold text-black mb-5">
                  <span className="w-[18px] h-[18px] bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0"><svg className="w-[10px] h-[10px] text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></span>
                  Includes website + customer follow-ups + review collection
                </div>

                {/* Browser mockup */}
                <div className="mx-[-32px] mb-6 overflow-hidden">
                  <div className="px-3.5 py-2.5 bg-[#1e1e1e] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f57]" /><span className="w-2 h-2 rounded-full bg-[#febc2e]" /><span className="w-2 h-2 rounded-full bg-[#28c840]" />
                    <span className="flex-1 ml-2.5 px-3.5 py-[5px] bg-white/[0.08] rounded-md font-b text-[11px] text-white/30">yourbusiness.com</span>
                  </div>
                  <div className="bg-[#0f0f0f] relative">
                    <div className="px-6 pt-6 pb-5 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]">
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-d text-[13px] font-bold text-white tracking-wide">YOUR BUSINESS</span>
                        <div className="flex gap-3">{['About', 'Services', 'Reviews', 'Contact'].map(l => <span key={l} className="font-b text-[9px] text-white/30">{l}</span>)}</div>
                      </div>
                      <div className="font-d text-[22px] font-semibold text-white leading-tight mb-1.5">We bring the quality.<br />You see the results.</div>
                      <div className="font-b text-[10px] text-white/35 leading-relaxed max-w-[260px] mb-3.5">Trusted by hundreds of customers in your area. Book a free consultation today.</div>
                      <span className="inline-block px-4 py-1.5 bg-[#c8a97e] rounded-full font-b text-[10px] font-semibold text-black">Book a Free Consultation →</span>
                      <div className="flex gap-2 mt-3">
                        {[{ n: '24/7', l: 'Always Answering' }, { n: '4.9', l: 'Google Rating' }, { n: '93+', l: '5-Star Reviews' }].map(c => (
                          <div key={c.n} className="flex-1 bg-white/5 border border-white/[0.08] rounded-lg px-2.5 py-2 text-center">
                            <div className="font-d text-base font-bold text-emerald-500">{c.n}</div>
                            <div className="font-b text-[8px] text-white/30 mt-0.5">{c.l}</div>
                          </div>
                        ))}
                      </div>
                      {/* Chat bubble */}
                      <div className="absolute bottom-3 right-3 bg-white rounded-xl rounded-br-sm p-2 px-3 max-w-[160px] shadow-lg shadow-black/30 hidden sm:block">
                        <div className="font-b text-[8px] font-bold text-black mb-0.5 flex items-center gap-1"><span className="w-[5px] h-[5px] rounded-full bg-emerald-500" />Live Chat</div>
                        <div className="font-b text-[9px] text-neutral-500 leading-snug">Hi! How can we help you today? We can book you in as early as tomorrow.</div>
                      </div>
                      {/* Reviews badge */}
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                        <span className="text-[10px] text-amber-400 tracking-wider">★★★★★</span>
                        <span className="font-b text-[9px] text-white/50">93 reviews</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single field */}
                <div className="mb-4">
                  <label className="block font-b text-[11px] font-semibold tracking-[0.1em] uppercase text-neutral-400 mb-2">Your Business Name</label>
                  <input id="biz-name" type="text" placeholder="e.g. Bright Smile Dental" value={lead.businessName} onChange={e => { setLead({ ...lead, businessName: e.target.value }); setErrors({ ...errors, businessName: false }); }} className={`w-full px-[18px] py-4 border-[1.5px] rounded-[14px] font-b text-base outline-none transition-colors ${errors.businessName ? 'border-red-500' : 'border-neutral-200 focus:border-black'}`} />
                </div>

                <button onClick={goToCapture} className="w-full py-[18px] bg-black text-white rounded-full font-b text-[15px] font-semibold flex items-center justify-center gap-2.5 hover:shadow-xl hover:shadow-black/20 transition-all mt-2">
                  Build My Free Website →
                </button>

                <div className="flex items-center justify-center gap-4 mt-4">
                  {['100% free', 'Ready in 24h', 'No credit card'].map(t => (
                    <span key={t} className="font-b text-[11px] text-neutral-400 flex items-center gap-[5px]"><svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{t}</span>
                  ))}
                </div>

                {/* Urgency */}
                <div className="mt-3.5 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-[10px] flex items-center gap-2 font-b text-[12px] text-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                  We build each site by hand &mdash; currently accepting <strong className="ml-0.5">{spots}</strong>&nbsp;more this week
                </div>
              </div>

              {/* Float cards */}
              <div className="hidden lg:flex absolute -top-5 -right-5 bg-white rounded-2xl p-3.5 shadow-lg shadow-neutral-200/50 items-center gap-2.5" style={{ animation: 'float 6s ease-in-out 1s infinite' }}>
                <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center"><span className="text-white font-b text-[15px] font-bold">!</span></div>
                <div><div className="font-b text-[12px] font-semibold text-black">Customers are slipping away</div><div className="font-b text-[11px] text-neutral-400">We&apos;ll show you how to stop it</div></div>
              </div>
              <div className="hidden lg:flex absolute -bottom-3 -left-7 bg-white rounded-2xl p-3.5 shadow-lg shadow-neutral-200/50 items-center gap-2.5" style={{ animation: 'float 6s ease-in-out 2s infinite' }}>
                <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center"><svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                <div><div className="font-b text-[12px] font-semibold text-black">Ready in 24 hours</div><div className="font-b text-[11px] text-neutral-400">Your name on it</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE TRUTH ── */}
        <section className="py-24 lg:py-32 bg-black text-white overflow-hidden">
          <div className="max-w-[1100px] mx-auto px-8 lg:px-12">
            <span className="font-b text-xs font-semibold tracking-[0.15em] text-neutral-600 uppercase">This is what nobody tells you</span>
            <h2 className="font-d text-4xl lg:text-5xl font-medium text-white mt-4 leading-tight max-w-[620px]">Your business can&apos;t grow past&nbsp;you.</h2>
            <p className="font-d text-[clamp(22px,2.5vw,30px)] italic text-neutral-600 leading-snug mt-12 text-center max-w-[600px] mx-auto">&ldquo;If I disappeared for a week, would my business still bring in new customers?&rdquo;</p>

            <div className="grid md:grid-cols-2 gap-5 mt-12">
              {PAIN_CARDS.map(c => (
                <div key={c.title} className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-11 h-11 bg-white/5 border border-white/[0.08] rounded-xl flex items-center justify-center text-neutral-500 mb-3"><PainIcon type={c.icon} /></div>
                  <h4 className="font-b text-base font-semibold text-white mb-2">{c.title}</h4>
                  <p className="font-b text-sm text-neutral-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-14 pt-12 border-t border-white/[0.06]">
              <h3 className="font-d text-[clamp(28px,3.5vw,44px)] font-medium text-white leading-tight">The businesses growing faster than you figured out one thing: <em className="italic text-[#c8a97e]">stop being the&nbsp;bottleneck.</em></h3>
              <p className="font-b text-[17px] text-neutral-500 leading-relaxed mt-4 max-w-[540px] mx-auto">They didn&apos;t hire ten people. They didn&apos;t become marketing experts. They set up something that handles the parts they can&apos;t get to &mdash; so nothing falls through the cracks and every customer gets taken care of, whether they&apos;re there or&nbsp;not.</p>
            </div>
          </div>
        </section>

        {/* ── WHAT CHANGES ── */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
            <span className="font-b text-xs font-semibold tracking-[0.15em] text-neutral-400 uppercase">What your business looks like after</span>
            <h2 className="font-d text-4xl lg:text-5xl font-medium text-black mt-4 leading-tight max-w-[600px]">You stop doing everything. Your business keeps&nbsp;growing.</h2>
            <div className="grid lg:grid-cols-3 gap-6 mt-14">
              {RESULT_CARDS.map(c => (
                <div key={c.title} className="bg-neutral-50 rounded-3xl p-8 border border-transparent hover:border-neutral-200 hover:bg-white transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-sm text-neutral-700"><ResultIcon type={c.icon} /></div>
                  <h3 className="font-d text-xl font-medium text-black mb-3">{c.title}</h3>
                  <p className="font-b text-sm text-neutral-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BEFORE / AFTER ── */}
        <section className="py-24 lg:py-32 bg-[#fafafa]">
          <div className="max-w-[1000px] mx-auto px-8 lg:px-12">
            <span className="font-b text-xs font-semibold tracking-[0.15em] text-neutral-400 uppercase">The gap</span>
            <h2 className="font-d text-4xl lg:text-5xl font-medium text-black mt-4 leading-tight max-w-[550px]">This is the difference between you and the business that&apos;s&nbsp;winning.</h2>
            <p className="font-b text-base text-neutral-500 mt-3 max-w-[500px] leading-relaxed">Same industry. Same city. Same skills. One has something handling the things they can&apos;t get to. The other doesn&apos;t.</p>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_60px_1fr] gap-0 mt-12">
              <div className="p-9 rounded-[20px] bg-[#f0eded] border-2 border-[#e0dada]">
                <div className="font-b text-[11px] font-bold tracking-[0.12em] uppercase text-red-500 mb-4">RIGHT NOW</div>
                {['You answer every message yourself — eventually', 'After hours? Nobody\u2019s home. Customers leave.', 'A few Google reviews. Not enough to stand out.', 'Leads come in and you forget to follow up', 'You can\u2019t take a day off without things slipping', 'No idea which customers came from where'].map(l => (
                  <div key={l} className="py-2.5 text-sm text-neutral-500 flex items-start gap-2.5 border-b border-black/[0.04] leading-snug"><span className="text-red-500 font-bold flex-shrink-0">✗</span>{l}</div>
                ))}
              </div>
              <div className="hidden md:flex items-center justify-center font-d text-[17px] font-bold text-neutral-300">VS</div>
              <div className="p-9 rounded-[20px] bg-black border-2 border-[#c8a97e]/25 mt-4 md:mt-0">
                <div className="font-b text-[11px] font-bold tracking-[0.12em] uppercase text-[#c8a97e] mb-4">AFTER VEKTORLABS</div>
                {['Every customer gets answered — instantly, 24/7', 'After hours? Still running. Still booking.', '60+ reviews in 90 days. Google sends you customers.', 'Every lead gets followed up — without you thinking about it', 'Take a week off. Nothing breaks.', 'See every lead, every booking, every dollar — one place'].map(l => (
                  <div key={l} className="py-2.5 text-sm text-white/50 flex items-start gap-2.5 border-b border-white/[0.05] leading-snug"><span className="text-emerald-500 font-bold flex-shrink-0">✓</span>{l}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CLOSE ── */}
        <section className="py-24 lg:py-32 bg-black text-white">
          <div className="max-w-[800px] mx-auto px-8 lg:px-12 text-center">
            <span className="font-b text-xs font-semibold tracking-[0.15em] text-red-400 uppercase">You&apos;ve seen the difference</span>
            <h2 className="font-d text-4xl lg:text-5xl font-medium text-white mt-4 leading-tight">Now see what it looks like with your name on&nbsp;it.</h2>
            <p className="font-b text-[17px] text-neutral-500 leading-relaxed mt-7 max-w-[580px] mx-auto">We&apos;ll build a real, working website for your business &mdash; your name, your industry, everything set up &mdash; and send it to you in 24 hours. Free. If you don&apos;t love it, delete our number.</p>
            <p className="font-b text-[17px] text-neutral-500 leading-relaxed mt-6 max-w-[580px] mx-auto">A year from now, either your business runs without you &mdash; or you&apos;re still doing everything alone, wondering where the time&nbsp;went.</p>
            <div className="mt-10">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => document.getElementById('biz-name')?.focus(), 700); }} className="px-12 py-[18px] bg-white text-black font-b text-[15px] font-semibold tracking-wide rounded-full hover:shadow-xl hover:shadow-white/10 transition-all">Build My Free Website →</button>
              <p className="font-b text-[13px] text-neutral-600 mt-3.5">Free. Under 24 hours. No call. No credit card.</p>
            </div>
            <div className="mt-12 pt-8 border-t border-white/[0.08] max-w-[480px] mx-auto">
              <p className="font-d text-lg italic text-neutral-600">&ldquo;Why would you build this for free?&rdquo;</p>
              <p className="font-b text-sm text-neutral-600 mt-3 leading-relaxed">Because once you see your business running like this, you won&apos;t want to go back to doing it all yourself. That&apos;s the only pitch. No tricks. No fine print.</p>
            </div>
          </div>
        </section>

        {/* ── INDUSTRIES ── */}
        <section className="py-24 lg:py-32 bg-[#fafafa] text-center">
          <div className="max-w-[1000px] mx-auto px-8">
            <span className="font-b text-xs font-semibold tracking-[0.15em] text-neutral-400 uppercase">Works for businesses like yours</span>
            <h2 className="font-d text-4xl lg:text-[44px] font-medium text-black mt-4 leading-tight max-w-[500px] mx-auto">44+ industries. Same problem. Handled.</h2>
            <div className="flex flex-wrap justify-center gap-2 mt-9">
              {ALL_TAGS.map(t => (
                <button key={t} onClick={() => { setLead({ ...lead, industry: TAG_TO_INDUSTRY[t] || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => document.getElementById('biz-name')?.focus(), 500); }} className={`px-5 py-2.5 text-[13px] font-medium rounded-full border transition-all cursor-pointer hover:border-black hover:text-black hover:bg-white ${HOT_TAGS.includes(t) ? 'border-black text-black bg-white' : 'border-neutral-200 text-neutral-500'}`}>{t}</button>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-14 bg-[#050505] text-white">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3"><div className="w-[42px] h-[42px] bg-white rounded-xl flex items-center justify-center"><span className="text-black font-d text-[19px] font-semibold">V</span></div><span className="font-b text-[15px] font-semibold tracking-wide">VEKTORLABS</span></div>
            <div className="flex items-center gap-7 text-sm text-neutral-600"><Link href="/about" className="hover:text-white transition-colors">About</Link><Link href="/terms" className="hover:text-white transition-colors">Terms</Link><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></div>
            <p className="font-b text-sm text-neutral-600">&copy; 2026 VektorLabs. All rights reserved.</p>
          </div>
        </footer>
      </>)}

      {/* ═══ STEP 2: DETAILS + CAPTURE ═══ */}
      {step === 2 && (
        <div className="min-h-screen flex items-center justify-center px-6 py-10 relative overflow-hidden">
          <div className="absolute top-[10%] -right-[150px] w-[600px] h-[600px] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[10%] -left-[150px] w-[500px] h-[500px] bg-gradient-to-tr from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-40" />
          <div className="card-in relative bg-white rounded-3xl p-12 max-w-[480px] w-full shadow-2xl shadow-neutral-200/50">
            <div className="flex items-center gap-2.5 mb-8"><div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center"><span className="text-white font-d text-lg font-semibold">V</span></div><span className="font-b text-sm font-semibold tracking-wide text-black">VEKTORLABS</span></div>
            <h2 className="font-d text-[28px] font-medium text-black mb-2">Almost there, {lead.businessName}.</h2>
            <p className="font-b text-[15px] text-neutral-500 leading-relaxed mb-6">Tell us a bit more so we can build the right site. We&apos;ll <strong className="text-black">text you the link</strong> when it&apos;s ready &mdash; usually under 24&nbsp;hours.</p>

            <div className="mb-3.5">
              <label className="block font-b text-[11px] font-semibold tracking-[0.08em] uppercase text-neutral-400 mb-1.5">Industry</label>
              <select value={lead.industry} onChange={e => { setLead({ ...lead, industry: e.target.value }); setErrors({ ...errors, industry: false }); }} className={`w-full px-4 py-3.5 border rounded-xl font-b text-[15px] bg-white outline-none transition-colors appearance-none ${errors.industry ? 'border-red-500' : 'border-neutral-200 focus:border-black'}`}>
                <option value="">Select your industry</option>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="mb-3.5">
              <label className="block font-b text-[11px] font-semibold tracking-[0.08em] uppercase text-neutral-400 mb-1.5">What Do You Need?</label>
              <select value={lead.websiteType} onChange={e => { setLead({ ...lead, websiteType: e.target.value }); setErrors({ ...errors, websiteType: false }); }} className={`w-full px-4 py-3.5 border rounded-xl font-b text-[15px] bg-white outline-none transition-colors appearance-none ${errors.websiteType ? 'border-red-500' : 'border-neutral-200 focus:border-black'}`}>
                <option value="">Select type</option>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="mb-3.5"><label className="block font-b text-[11px] font-semibold tracking-[0.08em] uppercase text-neutral-400 mb-1.5">Email</label><input type="email" placeholder="you@business.com" value={lead.email} onChange={e => { setLead({ ...lead, email: e.target.value }); setErrors({ ...errors, email: false }); }} className={`w-full px-4 py-3.5 border rounded-xl font-b text-[15px] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-neutral-200 focus:border-black'}`} /></div>
            <div className="mb-3.5"><label className="block font-b text-[11px] font-semibold tracking-[0.08em] uppercase text-neutral-400 mb-1.5">Phone Number</label><input type="tel" placeholder="(514) 555-1234" value={lead.phone} onChange={e => { setLead({ ...lead, phone: e.target.value }); setErrors({ ...errors, phone: false }); }} className={`w-full px-4 py-3.5 border rounded-xl font-b text-[15px] outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-neutral-200 focus:border-black'}`} /></div>

            <button onClick={submitLead} disabled={submitting} className="w-full py-4 bg-black text-white rounded-full font-b text-sm font-medium tracking-wide flex items-center justify-center gap-2.5 hover:shadow-xl hover:shadow-black/20 transition-all mt-2 disabled:opacity-50">
              {submitting ? 'Building...' : 'Build My Free Website'}<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
            <p className="text-center mt-4 font-b text-xs text-neutral-400">Free. No commitment. No credit card.</p>
            <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-neutral-100">{['Free forever', 'Under 24 hours', 'No spam'].map(t => (<span key={t} className="font-b text-[11px] text-neutral-400 flex items-center gap-1"><svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{t}</span>))}</div>
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
            <h2 className="font-d text-[32px] font-medium text-black mb-2">We&apos;re building it.</h2>
            <p className="font-b text-base text-neutral-500 leading-relaxed mb-8">Your website is being built right now. We&apos;ll <strong className="text-black">text you the link</strong> when it&apos;s ready.</p>
            <div className="text-left max-w-[340px] mx-auto mb-8">
              {[{ icon: '✓', active: true, title: 'Request received', desc: 'We have your business details' }, { icon: '⚡', active: true, title: 'Building your website', desc: 'Custom site + follow-ups + review collection' }, { icon: '→', active: false, title: 'Text you the link', desc: 'Usually under 24 hours' }].map((s, i) => (
                <div key={s.title} className="flex gap-4 py-3 relative">
                  {i < 2 && <div className="absolute left-[15px] top-10 bottom-0 w-[1.5px] bg-neutral-200" />}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm z-10 font-b font-semibold ${s.active ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-400'}`}>{s.icon}</div>
                  <div><h4 className="font-b text-sm font-semibold text-black mb-0.5">{s.title}</h4><p className="font-b text-xs text-neutral-400 leading-relaxed">{s.desc}</p></div>
                </div>
              ))}
            </div>
            <div className="font-d text-xl font-medium text-black mb-1">{lead.businessName}</div>
            <div className="font-b text-[13px] text-neutral-400">{lead.industry} &middot; {lead.websiteType} &middot; {lead.phone}</div>
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
