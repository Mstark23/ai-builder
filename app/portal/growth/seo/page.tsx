'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// Pricing Plans
const pricingPlans = [
  {
    id: 'one-time',
    name: 'One-Time Setup',
    description: 'Get your foundation right',
    price: 199,
    period: 'one-time',
    features: [
      'Google Business Profile setup & optimization',
      'Local keyword research (20 keywords)',
      'On-page SEO optimization',
      'Schema markup implementation',
      'XML sitemap creation',
      'Google Search Console setup',
      'Competitor analysis report',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'monthly',
    name: 'Monthly Management',
    description: 'Ongoing optimization & growth',
    price: 99,
    period: '/month',
    features: [
      'Everything in One-Time Setup',
      'Monthly ranking reports',
      'Ongoing keyword optimization',
      'Google Business Profile management',
      '2 blog posts/month (SEO optimized)',
      'Backlink monitoring',
      'Monthly strategy call',
      'Priority support',
    ],
    cta: 'Start Growing',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium SEO',
    description: 'Dominate local search',
    price: 249,
    period: '/month',
    features: [
      'Everything in Monthly',
      'Advanced keyword targeting (50+ keywords)',
      '4 blog posts/month',
      'Link building campaign',
      'Local citation building',
      'Review generation strategy',
      'Bi-weekly strategy calls',
      'Dedicated SEO specialist',
    ],
    cta: 'Go Premium',
    popular: false,
  },
];

export default function SEOServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user has any paid projects
    const { data: projects } = await supabase
      .from('projects')
      .select('id')
      .eq('customer_id', user.id)
      .or('paid.eq.true,status.eq.DELIVERED')
      .limit(1);

    if (!projects || projects.length === 0) {
      router.push('/portal/growth');
      return;
    }

    setHasAccess(true);
    setLoading(false);
  };

  const handleSelectPlan = (planId: string) => {
    // In production, this would go to checkout
    router.push(`/portal/growth/seo/checkout?plan=${planId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasAccess) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        .card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
      `}</style>

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/portal/growth" className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="font-body text-sm font-medium">Back to Growth</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-display text-sm font-semibold">V</span>
              </div>
              <span className="font-body text-black font-semibold text-sm hidden sm:block">VERKTORLABS</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <span className="text-xl">🔍</span>
              <span className="font-body text-sm font-medium">SEO & Local Search</span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-medium mb-6 leading-tight">
              Get Found on Google by Local Customers
            </h1>
            <p className="font-body text-lg text-white/80 mb-8 leading-relaxed">
              97% of consumers search online for local businesses. We help you show up when 
              they are looking for services like yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-body font-medium rounded-full hover:bg-white/90 transition-all">
                View Pricing
              </a>
              <a href="#results" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-body font-medium rounded-full hover:bg-white/10 transition-all">
                See Results
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-medium text-black mb-4">What is Included</h2>
            <p className="font-body text-neutral-500 max-w-2xl mx-auto">Everything you need to dominate local search results</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🌐', title: 'Google Business Profile', description: 'Complete setup and optimization of your GBP listing for maximum visibility.' },
              { icon: '📍', title: 'Local Keywords', description: 'Target the exact search terms your customers use to find businesses like yours.' },
              { icon: '⚙️', title: 'Technical SEO', description: 'Schema markup, site speed, mobile optimization, and more.' },
              { icon: '📊', title: 'Monthly Reports', description: 'Clear, easy-to-understand reports showing your rankings and traffic growth.' },
            ].map((item, i) => (
              <div key={i} className="bg-neutral-50 rounded-2xl p-6 card-hover">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-body font-semibold text-black mb-2">{item.title}</h3>
                <p className="font-body text-sm text-neutral-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" className="py-16 lg:py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-medium text-black mb-4">Real Results</h2>
            <p className="font-body text-neutral-500">Average results our clients see</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { value: '+15', label: 'Ranking positions', note: 'in 3 months' },
              { value: '+127%', label: 'Organic traffic', note: 'in 6 months' },
              { value: '+340%', label: 'Google Business views', note: 'in 3 months' },
              { value: '+89%', label: 'Phone calls from search', note: 'in 6 months' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-6 text-center">
                <p className="font-display text-4xl font-semibold text-blue-600 mb-2">{stat.value}</p>
                <p className="font-body font-medium text-black mb-1">{stat.label}</p>
                <p className="font-body text-sm text-neutral-500">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-medium text-black mb-4">Simple, Transparent Pricing</h2>
            <p className="font-body text-neutral-500">Choose the plan that fits your goals</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl border-2 p-8 relative ${
                  plan.popular ? 'border-blue-500 shadow-xl lg:scale-105' : 'border-neutral-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-blue-600 text-white font-body text-xs font-semibold rounded-full">
                      RECOMMENDED
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-xl font-medium text-black mb-2">{plan.name}</h3>
                  <p className="font-body text-sm text-neutral-500">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="font-display text-4xl font-semibold text-black">${plan.price}</span>
                  <span className="font-body text-neutral-500">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-body text-sm text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-4 font-body font-medium rounded-full transition-all ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border-2 border-black text-black hover:bg-black hover:text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-[#fafafa]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl font-medium text-black mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              { q: 'How long does it take to see results?', a: 'SEO is a long-term strategy. Most clients see initial improvements within 4-6 weeks, with significant results in 3-6 months.' },
              { q: 'Do I need a website to use SEO services?', a: 'Yes, you need a live website. Good news - if you built your site with Verktorlabs, you are already set up!' },
              { q: 'What is Google Business Profile?', a: 'Google Business Profile (formerly Google My Business) is your free business listing on Google. It helps you appear in Google Maps and local search results.' },
              { q: 'Can I cancel anytime?', a: 'Yes! Monthly plans can be cancelled anytime. We recommend at least 3 months to see meaningful results.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-body font-semibold text-black mb-2">{faq.q}</h3>
                <p className="font-body text-sm text-neutral-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-medium mb-4">Ready to Get Found?</h2>
          <p className="font-body text-lg text-white/80 mb-8">Start ranking higher in local search results today.</p>
          <a href="#pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-body font-medium rounded-full hover:bg-white/90 transition-all">
            🚀 Get Started Now
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-neutral-500">© 2024 Verktorlabs</p>
            <Link href="/portal/growth" className="font-body text-sm text-neutral-500 hover:text-black">Back to Growth</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
