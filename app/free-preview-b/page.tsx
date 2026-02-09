'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const industries = [
  { id: 'restaurant', name: 'Restaurant', icon: '🍽️', cta: 'Imagine this — but with your name on it.' },
  { id: 'local-services', name: 'Local Services', icon: '🔧', cta: 'This is what your next customer sees.' },
  { id: 'professional', name: 'Professional', icon: '💼', cta: 'This is how your next client finds you.' },
  { id: 'health-beauty', name: 'Health & Beauty', icon: '💆', cta: 'Your calendar could be full by next week.' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠', cta: 'This sells homes. Yours could too.' },
  { id: 'ecommerce', name: 'E-Commerce', icon: '🛒', cta: 'This store could be open for business tonight.' },
  { id: 'fitness', name: 'Fitness', icon: '💪', cta: 'Members sign up here. Even while you sleep.' },
  { id: 'medical', name: 'Medical', icon: '⚕️', cta: 'Patients find you here. And they trust what they see.' },
  { id: 'construction', name: 'Construction', icon: '🏗️', cta: 'This is how you land the next big contract.' },
  { id: 'tech-startup', name: 'Tech & Startup', icon: '🚀', cta: 'This is the launch page investors want to see.' },
  { id: 'education', name: 'Education', icon: '📚', cta: 'Enrollment starts with a page like this.' },
  { id: 'portfolio', name: 'Portfolio', icon: '🎨', cta: 'This is how your work gets discovered.' },
];

export default function FreePreviewBPage() {
  const [selected, setSelected] = useState(industries[0]);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [scrolled, setScrolled] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIframeLoaded(false);
    setIframeError(false);
  }, [selected.id]);

  const deviceWidths: Record<string, string> = {
    desktop: 'w-full',
    tablet: 'max-w-[768px] w-full',
    mobile: 'max-w-[375px] w-full',
  };

  return (
    <div className="min-h-screen antialiased" style={{ background: '#fffdf9', fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .font-story { font-family: 'Lora', Georgia, serif; }
        .font-body { font-family: 'DM Sans', -apple-system, sans-serif; }
      `}</style>

      {/* ── HEADER ── */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${scrolled ? 'bg-[#fffdf9]/96 backdrop-blur-xl border-b border-[#ede8df]' : 'bg-transparent'}`}>
        <nav className="max-w-[780px] mx-auto px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 no-underline text-[#1a1815]">
            <div className="w-8 h-8 bg-[#1a1815] rounded-lg flex items-center justify-center">
              <span className="text-[#fffdf9] font-story text-[0.9rem] font-semibold">V</span>
            </div>
            <span className="font-body text-[13px] font-semibold tracking-wider hidden sm:block">VEKTORLABS</span>
          </Link>
          <Link href="/register" className="px-5 py-2 bg-[#b8432f] text-white font-body text-[12px] font-semibold rounded-md hover:bg-[#d4604c] transition-colors">
            Get My Free Preview →
          </Link>
        </nav>
      </header>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* THE STORY — Sugarman's slippery slide.                         */}
      {/* Single column, narrow, reads like a magazine ad.               */}
      {/* Every sentence exists ONLY to get you to read the next one.    */}
      {/* ════════════════════════════════════════════════════════════════ */}

      <article className="max-w-[680px] mx-auto px-6 pt-[7.5rem] pb-8">

        {/* HEADLINE — Sugarman: curiosity + benefit, minimal words */}
        <h1 className="font-story text-[clamp(1.7rem,3.8vw,2.6rem)] font-medium leading-[1.25] tracking-tight mb-1.5">
          A website designer who only gets paid if you love the work.
        </h1>
        <p className="font-story text-base text-[#8a8275] italic mb-10">
          Sound too good to be true? Keep reading.
        </p>

        {/* THE SLIPPERY SLIDE BEGINS */}
        <div className="text-[1.05rem] leading-[1.85] text-[#3d3932] space-y-5">

          {/* Sugarman: First sentence must be SHORT. Effortless. Pulls you in. */}
          <p className="text-[1.15rem] font-medium text-[#1a1815]">
            It started with a frustration.
          </p>

          <p>
            A business owner — a lot like you — needed a website. So he did what everyone does. He searched online. He found a few designers. He emailed back and forth. He answered questions. He filled out forms. He sat through a call. He waited for a quote.
          </p>

          <p>
            And then? He waited some more. Two weeks later, he got a mockup that looked like every other website on the internet. Generic stock photos. A layout he&apos;d seen a hundred times. His business name slapped on top like an afterthought.
          </p>

          <p>
            He paid $3,000 for it.
            <span className="block font-semibold text-[#1a1815] mt-0.5">
              That&apos;s when we decided to build something different.
            </span>
          </p>

          {/* Divider */}
          <div className="w-10 h-0.5 bg-[#ddd6c9] my-8" />

          <p>
            <strong className="text-[#1a1815]">What if a website could be built for you in under an hour?</strong> Not a template. Not a drag-and-drop thing you have to figure out yourself. A real, custom-designed website — built around your specific business, your industry, your brand.
          </p>

          <p>
            And what if you could see it — the actual finished product — before you spent a single dollar?
          </p>

          <p>
            That&apos;s exactly what we do at VektorLabs.
          </p>

          <p>
            Here&apos;s how it works. You tell us a few basics about your business. Your name, your industry, the style you like. Takes about five minutes. Then our system goes to work — and within the hour, you&apos;re looking at a fully designed website with your brand on it.
          </p>

          <p>
            Not a wireframe. Not a &ldquo;concept.&rdquo; A real website. One you could launch tomorrow if you wanted to.
            <span className="block font-semibold text-[#1a1815] mt-0.5">
              But here&apos;s the part that surprises people.
            </span>
          </p>

          <p className="text-[#1a1815] font-semibold text-lg">
            You don&apos;t pay anything to see it.
          </p>

          <p>
            No deposit. No credit card. No &ldquo;hold&rdquo; on your account. We build it. We show you. And then you decide. If you love it — great, we&apos;ll talk about making it yours. If you don&apos;t — you close the tab. That&apos;s it. No charge. No follow-up. No guilt trip.
          </p>

          {/* CALLOUT — Sugarman sidebar technique. Breaks visual flow, re-engages scanners. */}
          <div className="my-8 p-6 bg-[#f7f4ef] border-l-[3px] border-[#b8432f] rounded-r-xl">
            <p className="text-[0.95rem] leading-[1.7] text-[#5e584e] mb-3">
              <strong className="text-[#1a1815]">Why would we do this?</strong>
            </p>
            <p className="text-[0.95rem] leading-[1.7] text-[#5e584e] mb-3">
              Simple. We studied the top-performing websites in every major industry — restaurants, salons, real estate, fitness, medical, construction, you name it. We know what layouts convert. We know what colors work. We know where buttons go.
            </p>
            <p className="text-[0.95rem] leading-[1.7] text-[#5e584e]">
              So when we build your site, we&apos;re not guessing. We&apos;re applying <strong className="text-[#1a1815]">proven patterns from the most successful businesses in your space.</strong> And when you see the result, you don&apos;t need convincing. The work speaks for itself.
            </p>
          </div>

          <p>
            Don&apos;t take my word for it, though. Let me show you.
          </p>
        </div>
      </article>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* PORTFOLIO — embedded mid-story. Part of the narrative.         */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="max-w-[780px] mx-auto px-6 pb-8">
        <div className="mb-5">
          <h2 className="font-story text-[1.4rem] font-medium mb-1">Pick your industry. See the proof.</h2>
          <p className="text-[0.95rem] text-[#8a8275]">Each of these was built using the same system we&apos;ll use for yours.</p>
        </div>

        {/* Industry chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {industries.map(ind => (
            <button
              key={ind.id}
              onClick={() => setSelected(ind)}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-md border text-[12.5px] font-medium transition-all ${
                selected.id === ind.id
                  ? 'bg-[#1a1815] text-white border-[#1a1815]'
                  : 'bg-[#fffdf9] text-[#5e584e] border-[#ede8df] hover:border-[#b5ad9e]'
              }`}
            >
              <span>{ind.icon}</span>
              {ind.name}
            </button>
          ))}
        </div>

        {/* Preview box */}
        <div className="rounded-xl border border-[#ede8df] overflow-hidden bg-white shadow-lg">
          {/* Chrome */}
          <div className="bg-[#f7f4ef] border-b border-[#ede8df] px-3 py-2 flex items-center gap-2.5">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded px-2.5 py-0.5 text-[10.5px] text-[#b5ad9e]">
              www.your-{selected.id}-website.com
            </div>
            <div className="hidden sm:flex gap-0.5">
              {(['desktop', 'tablet', 'mobile'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDeviceView(d)}
                  className={`p-1 rounded transition-all ${deviceView === d ? 'bg-white text-[#1a1815] shadow-sm' : 'text-[#b5ad9e]'}`}
                >
                  {d === 'desktop' && <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12" /></svg>}
                  {d === 'tablet' && <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" /></svg>}
                  {d === 'mobile' && <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>}
                </button>
              ))}
            </div>
          </div>

          {/* Preview area */}
          <div className="bg-[#f7f4ef] flex justify-center p-4" style={{ minHeight: 480 }}>
            <div className={`transition-all duration-400 ${deviceWidths[deviceView]}`} key={selected.id + deviceView}>
              <div className="relative bg-white rounded-lg shadow overflow-hidden" style={{ height: deviceView === 'mobile' ? 580 : 480 }}>
                <iframe
                  src={`/examples/${selected.id}.html`}
                  className="w-full h-full border-0"
                  title={`${selected.name} website example`}
                  onLoad={() => setIframeLoaded(true)}
                  onError={() => setIframeError(true)}
                />
                {!iframeLoaded && !iframeError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                    <div className="w-7 h-7 border-2 border-[#ede8df] border-t-[#1a1815] rounded-full animate-spin mb-2" />
                    <p className="text-sm text-[#b5ad9e]">Loading preview...</p>
                  </div>
                )}
                {iframeError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#f7f4ef] to-[#ede8df] p-6">
                    <div className="w-14 h-14 bg-[#1a1815] rounded-[14px] flex items-center justify-center mb-3 text-[1.75rem]">{selected.icon}</div>
                    <h3 className="font-story text-lg font-medium mb-0.5">{selected.name} Website</h3>
                    <p className="text-[#8a8275] text-xs text-center max-w-[18rem] mb-3">Your HTML example loads here.</p>
                    <Link href="/register" className="px-4 py-2 bg-[#b8432f] text-white text-[12px] font-semibold rounded-md hover:bg-[#d4604c] transition-all">Build Mine Free →</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-[#1a1815] px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-white text-[13px] font-medium">{selected.cta}</p>
              <p className="text-[#8a8275] text-[11px] mt-0.5">Built free. No commitment. Yours in under an hour.</p>
            </div>
            <Link href="/register" className="px-5 py-2 bg-[#b8432f] text-white text-[12px] font-semibold rounded-md hover:bg-[#d4604c] transition-all flex-shrink-0">
              Get Mine Built →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* STORY CONTINUES — post-portfolio. Sugarman never lets          */}
      {/* momentum die. The portfolio IS part of the story.              */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <article className="max-w-[680px] mx-auto px-6 pt-4 pb-20">
        <div className="text-[1.05rem] leading-[1.85] text-[#3d3932] space-y-5">
          <p>
            Now, you might be wondering something.
            <span className="block font-semibold text-[#1a1815] mt-0.5">
              &ldquo;If the website is free to preview… what&apos;s the catch?&rdquo;
            </span>
          </p>

          <p>There isn&apos;t one. Honestly.</p>

          <p>
            We make money when you decide to keep the website. That only happens if you love it. So our entire business model is built around one thing: <strong className="text-[#1a1815]">making websites so good that people don&apos;t want to walk away.</strong>
          </p>

          <p>
            Think about that for a second. Most web designers take your money first and hope you&apos;ll be happy later. We flip the entire thing upside down. We do the work first. We impress you first. And only then — if you&apos;re genuinely thrilled — do we talk about price.
          </p>

          <p>
            It&apos;s a terrible business model… unless you&apos;re actually good at building websites.
            <span className="block font-semibold text-[#1a1815] mt-0.5">
              We&apos;re actually good at building websites.
            </span>
          </p>

          {/* Divider */}
          <div className="w-10 h-0.5 bg-[#ddd6c9] my-8" />

          {/* GUARANTEE — Sugarman: the guarantee isn't a throwaway. It's a selling tool. */}
          <div className="my-8 p-6 bg-white border-2 border-[#ede8df] rounded-xl text-center">
            <h3 className="font-story text-[1.1rem] font-medium mb-2">The &ldquo;love it or leave it&rdquo; guarantee</h3>
            <p className="text-[0.9rem] text-[#8a8275] leading-[1.6] mb-2">
              We build your custom website preview at our expense. You see it. If it&apos;s not what you wanted — if it&apos;s not <strong className="text-[#1a1815]">exactly</strong> what you imagined — you owe nothing. Not a dollar. Not an explanation. You simply walk away.
            </p>
            <p className="text-[0.9rem] font-semibold text-[#1a1815]">
              We take on all the risk. You take on none.
            </p>
          </div>

          <p>
            So here&apos;s my question: Why not see what we can build for you?
          </p>

          <p>
            It takes five minutes to tell us about your business. Within the hour, you&apos;ll be looking at something that took most businesses weeks and thousands of dollars to get.
          </p>

          <p>And it won&apos;t cost you anything to look.</p>

          {/* FINAL CTA — Sugarman circles back to action at the story's emotional peak */}
          <div className="my-8 p-7 bg-[#1a1815] rounded-xl text-white text-center">
            <p className="text-[0.95rem] text-[#b5ad9e] mb-3 leading-[1.6]">
              Ready to see your website? Five minutes. No credit card. No commitment.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 px-7 py-3 bg-[#b8432f] text-white text-[14px] font-semibold rounded-lg hover:bg-[#d4604c] transition-all">
              Start My Free Preview →
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <p className="text-[12px] text-[#8a8275] mt-2">Your preview will be ready in under an hour.</p>
          </div>

          {/* PS — Sugarman's final kicker. One thought that sticks. */}
          <div className="mt-10 pt-6 border-t border-[#ede8df]">
            <p className="text-[0.95rem] text-[#5e584e] leading-[1.7] mb-4">
              <strong className="text-[#1a1815]">One more thing.</strong> Right now, somewhere in your city, a competitor with a worse product than yours is getting customers you should be getting. The only difference? They have a website that makes them look professional.
            </p>
            <p className="text-[0.95rem] text-[#5e584e] leading-[1.7]">
              You can fix that in under an hour. For free. <Link href="/register" className="text-[#b8432f] font-semibold underline">Click here to start.</Link>
            </p>
          </div>
        </div>
      </article>

      {/* FOOTER */}
      <footer className="py-6 border-t border-[#ede8df]">
        <div className="max-w-[680px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1a1815] rounded-lg flex items-center justify-center">
              <span className="text-[#fffdf9] font-story text-sm font-semibold">V</span>
            </div>
            <span className="text-[13px] font-semibold text-[#8a8275]">VEKTORLABS</span>
          </div>
          <span className="text-[12px] text-[#b5ad9e]">© 2026 VektorLabs</span>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#fffdf9]/97 backdrop-blur-xl border-t border-[#ede8df] p-2.5 sm:hidden">
        <Link href="/register" className="block w-full py-3 bg-[#b8432f] text-white text-[13px] font-semibold rounded-lg text-center">
          Get My Free Website Preview →
        </Link>
      </div>
    </div>
  );
}
