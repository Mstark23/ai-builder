'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const shop = searchParams.get('shop');
    const hmac = searchParams.get('hmac');
    if (shop && hmac) {
      sessionStorage.setItem('shopify_shop', shop);
      router.push('/portal?shopify_connected=true&shop=' + encodeURIComponent(shop));
    }
  }, [searchParams, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      {/* CUSTOM STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        
        .gradient-text {
          background: linear-gradient(135deg, #1a1a1a 0%, #666 50%, #1a1a1a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .slide-up {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        
        .glow {
          box-shadow: 0 0 60px rgba(0,0,0,0.1);
        }
        
        .card-hover {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
        }
        
        .line-reveal {
          position: relative;
          overflow: hidden;
        }
        
        .line-reveal::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: #000;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.5s ease;
        }
        
        .line-reveal:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }
      `}</style>

      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none noise z-50"></div>

      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
        <nav className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11">
                <div className="absolute inset-0 bg-black rounded-xl transition-transform duration-300 group-hover:rotate-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-display text-xl font-semibold">V</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-body text-[15px] font-semibold tracking-wide text-black">VERKTORLABS</span>
              </div>
            </Link>

            {/* NAV LINKS */}
            <div className="hidden lg:flex items-center gap-12">
              {['Services', 'Process', 'Pricing', 'About'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="font-body text-[13px] font-medium tracking-wide text-neutral-500 hover:text-black transition-colors duration-300 line-reveal pb-1"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-6">
              <Link href="/login" className="font-body text-[13px] font-medium text-neutral-500 hover:text-black transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link href="/register" className="group relative px-6 py-3 bg-black text-white font-body text-[13px] font-medium tracking-wide rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
                <span className="relative z-10">Start Project</span>
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* BACKGROUND ELEMENTS */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-64 w-[800px] h-[800px] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-60 float"></div>
          <div className="absolute -bottom-32 -left-64 w-[600px] h-[600px] bg-gradient-to-tr from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-8 lg:px-12 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT: TEXT */}
            <div className="space-y-8">
              {/* BADGE */}
              <div className="slide-up inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-full border border-neutral-200 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-body text-xs font-medium tracking-wide text-neutral-600">ACCEPTING NEW CLIENTS</span>
              </div>

              {/* HEADLINE */}
              <h1 className="slide-up font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-tight text-black" style={{ animationDelay: '0.1s' }}>
                We craft digital
                <br />
                <span className="gradient-text">experiences</span>
                <br />
                that perform
              </h1>

              {/* SUBHEADLINE */}
              <p className="slide-up font-body text-lg sm:text-xl text-neutral-500 max-w-lg leading-relaxed" style={{ animationDelay: '0.2s' }}>
                Premium web design for visionary brands. We transform your vision into 
                high-converting digital experiences that captivate and convert.
              </p>

              {/* CTA BUTTONS */}
              <div className="slide-up flex flex-col sm:flex-row gap-4 pt-4" style={{ animationDelay: '0.3s' }}>
                <Link href="/register" className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-black text-white font-body text-sm font-medium tracking-wide rounded-full transition-all duration-300 hover:gap-5 hover:shadow-xl hover:shadow-black/20">
                  <span>Start Your Project</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a href="#process" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-body text-sm font-medium text-neutral-600 hover:text-black transition-colors">
                  <span>See How It Works</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </a>
              </div>

              {/* STATS */}
              <div className="slide-up grid grid-cols-3 gap-8 pt-12 border-t border-neutral-200" style={{ animationDelay: '0.4s' }}>
                {[
                  { value: '200+', label: 'Projects Delivered' },
                  { value: '98%', label: 'Client Satisfaction' },
                  { value: '72h', label: 'Average Turnaround' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-3xl sm:text-4xl font-semibold text-black">{stat.value}</div>
                    <div className="font-body text-xs text-neutral-400 mt-1 tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: VISUAL */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* MAIN CARD */}
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-neutral-200/50 glow">
                  <div className="aspect-[4/3] bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl flex items-center justify-center overflow-hidden">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="font-body text-sm text-neutral-400">Your website preview</p>
                    </div>
                  </div>
                  
                  {/* CARD FOOTER */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-full"></div>
                      <div>
                        <div className="font-body text-sm font-medium text-black">Project Preview</div>
                        <div className="font-body text-xs text-neutral-400">In Progress</div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-emerald-50 rounded-full">
                      <span className="font-body text-xs font-medium text-emerald-600">Active</span>
                    </div>
                  </div>
                </div>

                {/* FLOATING ELEMENTS */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-lg shadow-neutral-200/50 float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-body text-xs font-medium text-black">Payment Received</div>
                      <div className="font-body text-xs text-neutral-400">Just now</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-8 bg-white rounded-2xl p-4 shadow-lg shadow-neutral-200/50 float" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-body text-xs font-medium text-black">Site Live!</div>
                      <div className="font-body text-xs text-neutral-400">72h delivery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-16 border-y border-neutral-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <p className="font-body text-sm text-neutral-400 tracking-wide">TRUSTED BY INDUSTRY LEADERS</p>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-16">
              {['ACME', 'QUANTUM', 'NEXUS', 'VERTEX', 'PRISM'].map((brand) => (
                <span key={brand} className="font-body text-xl font-semibold text-neutral-300 hover:text-neutral-400 transition-colors cursor-default tracking-wide">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          {/* SECTION HEADER */}
          <div className="max-w-2xl mb-16 lg:mb-24">
            <span className="font-body text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase">Services</span>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-black mt-4 leading-tight">
              Everything you need to dominate online
            </h2>
          </div>

          {/* SERVICES GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Web Design',
                description: 'Bespoke designs that capture your brand essence and create lasting impressions on every visitor.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
                title: 'Development',
                description: 'Clean, performant code built on modern frameworks. Fast, secure, and infinitely scalable.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Performance',
                description: 'Lightning-fast load times and Core Web Vitals optimization for maximum search visibility.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Responsive',
                description: 'Flawless experiences across all devices. Desktop, tablet, and mobile perfection.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Analytics',
                description: 'Integrated tracking and insights to measure performance and optimize conversion.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: 'Support',
                description: 'Dedicated support and maintenance to keep your digital presence running smoothly.',
              },
            ].map((service, i) => (
              <div 
                key={i} 
                className="group p-8 lg:p-10 bg-neutral-50 rounded-3xl card-hover border border-transparent hover:border-neutral-200 hover:bg-white"
              >
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {service.icon}
                </div>
                <h3 className="font-display text-xl font-medium text-black mb-3">{service.title}</h3>
                <p className="font-body text-neutral-500 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section id="process" className="py-24 lg:py-32 bg-black text-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          {/* SECTION HEADER */}
          <div className="max-w-2xl mb-16 lg:mb-24">
            <span className="font-body text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">Process</span>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-white mt-4 leading-tight">
              From vision to reality in four simple steps
            </h2>
          </div>

          {/* PROCESS STEPS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {[
              { step: '01', title: 'Discovery', desc: 'Share your vision, goals, and brand identity through our streamlined questionnaire.' },
              { step: '02', title: 'Design', desc: 'Our team crafts a custom design tailored to your unique business needs.' },
              { step: '03', title: 'Refine', desc: 'Preview your site and request refinements until it is perfect.' },
              { step: '04', title: 'Launch', desc: 'Go live with a stunning website ready to convert visitors into customers.' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="font-display text-8xl lg:text-9xl font-bold text-white/5 leading-none">{item.step}</div>
                <div className="mt-[-40px] lg:mt-[-50px] relative z-10">
                  <h3 className="font-display text-2xl font-medium text-white mb-3">{item.title}</h3>
                  <p className="font-body text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-white/20 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 lg:py-32 bg-[#fafafa]">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          {/* SECTION HEADER */}
          <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
            <span className="font-body text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase">Pricing</span>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-black mt-4 leading-tight">
              Investment in your success
            </h2>
            <p className="font-body text-lg text-neutral-500 mt-6">
              Transparent pricing. No hidden fees. Pay only when you are completely satisfied.
            </p>
          </div>

          {/* PRICING CARDS */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* STARTER */}
            <div className="bg-white rounded-3xl p-8 lg:p-10 border border-neutral-200 card-hover">
              <div className="mb-8">
                <span className="font-body text-xs font-medium tracking-[0.15em] text-neutral-400 uppercase">Starter</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-semibold text-black">$299</span>
                </div>
                <p className="font-body text-neutral-400 mt-3">Perfect for landing pages and MVPs</p>
              </div>
              
              <ul className="space-y-4 mb-10">
                {['Single page website', 'Mobile responsive design', 'Contact form integration', '2 rounds of revisions', '48-hour turnaround'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-body text-neutral-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/register" className="block w-full py-4 text-center border-2 border-black text-black font-body text-sm font-medium rounded-full hover:bg-black hover:text-white transition-all duration-300">
                Get Started
              </Link>
            </div>

            {/* PROFESSIONAL */}
            <div className="relative bg-black rounded-3xl p-8 lg:p-10 text-white lg:scale-105 shadow-2xl shadow-black/20">
              <div className="absolute top-6 right-6">
                <span className="px-3 py-1.5 bg-white text-black font-body text-xs font-semibold rounded-full">POPULAR</span>
              </div>
              
              <div className="mb-8">
                <span className="font-body text-xs font-medium tracking-[0.15em] text-neutral-400 uppercase">Professional</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-semibold text-white">$599</span>
                </div>
                <p className="font-body text-neutral-400 mt-3">For growing businesses ready to scale</p>
              </div>
              
              <ul className="space-y-4 mb-10">
                {['Up to 5 pages', 'Custom UI/UX design', 'SEO optimization', 'Analytics integration', '72-hour delivery'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-body text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/register" className="block w-full py-4 text-center bg-white text-black font-body text-sm font-medium rounded-full hover:bg-neutral-100 transition-all duration-300">
                Get Started
              </Link>
            </div>

            {/* ENTERPRISE */}
            <div className="bg-white rounded-3xl p-8 lg:p-10 border border-neutral-200 card-hover">
              <div className="mb-8">
                <span className="font-body text-xs font-medium tracking-[0.15em] text-neutral-400 uppercase">Enterprise</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-semibold text-black">$999</span>
                </div>
                <p className="font-body text-neutral-400 mt-3">Complete e-commerce solution</p>
              </div>
              
              <ul className="space-y-4 mb-10">
                {['Unlimited pages', 'E-commerce integration', 'Payment processing', 'Unlimited revisions', 'Priority support'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-body text-neutral-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/register" className="block w-full py-4 text-center border-2 border-black text-black font-body text-sm font-medium rounded-full hover:bg-black hover:text-white transition-all duration-300">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEE SECTION */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-8">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            
            <h2 className="font-display text-4xl lg:text-6xl font-medium text-black leading-tight mb-6">
              Love it, or do not pay
            </h2>
            
            <p className="font-body text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              We build your website before you pay a dime. Only invest when you are 100% satisfied 
              with the design. Zero risk. Zero commitment. Just results.
            </p>
            
            <Link href="/register" className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-body text-sm font-medium tracking-wide rounded-full transition-all duration-300 hover:gap-5 hover:shadow-xl hover:shadow-black/20">
              <span>Start Your Risk-Free Project</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 lg:py-32 bg-black text-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-medium leading-tight mb-8">
              Ready to transform
              <br />
              <span className="text-neutral-500">your digital presence?</span>
            </h2>
            
            <p className="font-body text-xl text-neutral-400 max-w-xl mx-auto mb-12">
              Join hundreds of ambitious brands that have elevated their online presence with Verktorlabs.
            </p>
            
            <Link href="/register" className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-body text-sm font-medium tracking-wide rounded-full transition-all duration-300 hover:gap-5 hover:shadow-xl hover:shadow-white/20">
              <span>Get Started Today</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 bg-neutral-950 text-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="grid lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            {/* BRAND */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-black font-display text-xl font-semibold">V</span>
                </div>
                <span className="font-body text-[15px] font-semibold tracking-wide">VERKTORLABS</span>
              </div>
              <p className="font-body text-neutral-400 max-w-md leading-relaxed">
                Premium web design agency crafting high-converting digital experiences for ambitious brands worldwide.
              </p>
            </div>

            {/* LINKS */}
            <div>
              <h4 className="font-body text-xs font-semibold tracking-[0.15em] text-neutral-500 uppercase mb-6">Company</h4>
              <ul className="space-y-4">
                {['About', 'Services', 'Pricing', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="font-body text-neutral-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h4 className="font-body text-xs font-semibold tracking-[0.15em] text-neutral-500 uppercase mb-6">Legal</h4>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                  <li key={link}>
                    <a href="#" className="font-body text-neutral-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-neutral-500">© 2024 Verktorlabs. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <a key={social} href="#" className="font-body text-sm text-neutral-500 hover:text-white transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}