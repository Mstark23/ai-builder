'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-d { font-family: 'Playfair Display', Georgia, serif; }
        .font-b { font-family: 'Inter', -apple-system, sans-serif; }
        .noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>
      <div className="noise" />

      {/* Nav */}
      <header className="bg-white border-b border-neutral-200">
        <nav className="max-w-[1400px] mx-auto px-8 lg:px-12 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 bg-black rounded-xl transition-transform duration-300 group-hover:rotate-6" />
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-white font-d text-xl font-semibold">V</span></div>
            </div>
            <span className="hidden sm:block font-b text-[15px] font-semibold tracking-wide text-black">VEKTORLABS</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="font-b text-[13px] font-medium text-neutral-500 hover:text-black transition-colors">← Back to Home</Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[800px] mx-auto px-8 lg:px-12">
          <span className="font-b text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase">About Us</span>
          <h1 className="font-d text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight mt-4 text-black">
            We build websites that<br /><span className="text-neutral-400">drive real results</span>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="pb-24 bg-white">
        <div className="max-w-[800px] mx-auto px-8 lg:px-12">
          <div className="space-y-6 font-b text-neutral-600 text-lg leading-relaxed">
            <p>
              VektorLabs was founded on a simple observation: the gap between what billion-dollar brands do online and what small businesses get from web designers is massive — and it shouldn&apos;t be.
            </p>
            <p>
              We spent months studying what makes the world&apos;s best-converting websites work. We analyzed brands like Mejuri, Gymshark, Glossier, Sweetgreen, and hundreds more across 44+ industries. Every CTA placement, every trust signal, every psychological trigger — mapped and documented.
            </p>
            <p>
              The result is our <strong className="text-black">King Profile™</strong> methodology: a 12-level competitive intelligence extraction system that captures exactly what makes top-performing websites convert. When we build your website, we don&apos;t guess. We apply proven strategies from companies that have already figured it out.
            </p>
            <p>
              Based in Montreal, we serve businesses across North America. Our promise is simple: we build your website before you pay a dime. If you love it, it&apos;s yours. If not, you owe nothing.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-[#fafafa] border-y border-neutral-200">
        <div className="max-w-[800px] mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { n: '300+', l: 'Brands Analyzed' },
              { n: '44+', l: 'Industries Covered' },
              { n: '<1hr', l: 'Average Build Time' },
              { n: '$0', l: 'Upfront Cost' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="font-d text-3xl font-semibold text-black">{s.n}</div>
                <div className="font-b text-sm text-neutral-500 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-8 lg:px-12">
          <span className="font-b text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase">Our Methodology</span>
          <h2 className="font-d text-3xl lg:text-4xl font-medium mt-4 mb-12 text-black">The King Profile™ System</h2>

          <div className="space-y-4">
            {[
              { n: '01', t: 'Brand Voice & Positioning', d: 'How top brands position themselves and communicate value instantly.' },
              { n: '02', t: 'Visual Hierarchy', d: 'Layout patterns that guide eyes exactly where they need to go.' },
              { n: '03', t: 'CTA Strategy', d: 'Button placement, copy, and design that drives action.' },
              { n: '04', t: 'Trust Architecture', d: 'Reviews, badges, guarantees — placed for maximum credibility.' },
              { n: '05', t: 'Urgency & Scarcity', d: 'Ethical urgency patterns that motivate without manipulating.' },
              { n: '06', t: 'Social Proof', d: 'How to leverage testimonials, numbers, and community.' },
              { n: '07', t: 'Navigation Flow', d: 'Menu structures that reduce friction and increase engagement.' },
              { n: '08', t: 'Mobile Conversion', d: 'Mobile-specific patterns that convert thumb-scrollers into buyers.' },
              { n: '09', t: 'Pricing Psychology', d: 'How to present pricing in a way that feels like a no-brainer.' },
              { n: '10', t: 'Content Hierarchy', d: 'What to say first, second, and last for maximum impact.' },
              { n: '11', t: 'Emotional Triggers', d: 'The feelings that drive purchase decisions in your industry.' },
              { n: '12', t: 'Full Blueprint', d: 'Everything combined into a custom strategy for your business.' },
            ].map(l => (
              <div key={l.n} className="flex gap-5 py-4 border-b border-neutral-100 last:border-0">
                <span className="font-d text-lg font-semibold text-black min-w-[32px]">{l.n}</span>
                <div>
                  <h3 className="font-b text-base font-semibold text-black mb-1">{l.t}</h3>
                  <p className="font-b text-sm text-neutral-500">{l.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white text-center">
        <div className="max-w-[600px] mx-auto px-8">
          <h2 className="font-d text-4xl lg:text-5xl font-medium leading-tight mb-6">Ready to get started?</h2>
          <p className="font-b text-lg text-neutral-400 mb-10">Your custom website, built in under 1 hour. Free preview.</p>
          <Link href="/" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-b text-sm font-medium tracking-wide rounded-full hover:shadow-xl hover:shadow-white/20 transition-all">
            Start Your Project
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-neutral-950 text-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center"><span className="text-black font-d text-xl font-semibold">V</span></div>
            <span className="font-b text-[15px] font-semibold tracking-wide">VEKTORLABS</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-neutral-500">
            <Link href="/about" className="text-white">About</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="font-b text-sm text-neutral-500">© 2026 VektorLabs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
