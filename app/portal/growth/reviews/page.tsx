'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// Pricing Plans
const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Start collecting reviews',
    price: 49,
    period: '/month',
    features: [
      'Automated review requests (email)',
      'Google & Facebook monitoring',
      'Review dashboard',
      'Monthly summary report',
      'Up to 100 requests/month',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Full reputation management',
    price: 99,
    period: '/month',
    features: [
      'Everything in Basic',
      'SMS review requests',
      'All major platforms monitored',
      'AI response suggestions',
      'Negative review alerts',
      'Unlimited requests',
      'Widget for your website',
    ],
    cta: 'Start Growing',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For multi-location businesses',
    price: 199,
    period: '/month',
    features: [
      'Everything in Professional',
      'Multi-location support',
      'Custom branded requests',
      'Competitor monitoring',
      'Advanced analytics',
      'Dedicated account manager',
      'API access',
    ],
    cta: 'Contact Us',
    popular: false,
  },
];

export default function ReviewsServicePage() {
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
    router.push(`/portal/growth/reviews/checkout?plan=${planId}`);
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
      <section className="bg-gradient-to-br from-amber-500 to-orange-600 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <span className="text-xl">⭐</span>
              <span className="font-body text-sm font-medium">Reviews & Reputation</span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-medium mb-6 leading-tight">
              Turn Happy Customers Into 5-Star Reviews
            </h1>
            <p className="font-body text-lg text-white/80 mb-8 leading-relaxed">
              88% of consumers trust online reviews as much as personal recommendations. 
              We make it easy to collect, manage, and showcase your best reviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-amber-600 font-body font-medium rounded-full hover:bg-white/90 transition-all">
                View Pricing
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-body font-medium rounded-full hover:bg-white/10 transition-all">
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-medium text-black mb-4">How It Works</h2>
            <p className="font-body text-neutral-500">Simple, automated review collection</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, icon: '✉️', title: 'We Send Requests', description: 'After each service, we automatically send a friendly review request via email or SMS.' },
              { step: 2, icon: '📱', title: 'Customer Reviews', description: 'Happy customers are directed to leave reviews on Google, Facebook, or Yelp.' },
              { step: 3, icon: '🛡️', title: 'You Stay Protected', description: 'Unhappy customers are directed to you first, giving you a chance to make it right.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mx-auto mb-4 -mt-6 relative z-10">
                  <span className="font-body text-white text-sm font-bold">{item.step}</span>
                </div>
                <h3 className="font-body font-semibold text-black text-lg mb-2">{item.title}</h3>
                <p className="font-body text-sm text-neutral-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { value: '+312%', label: 'Average review increase' },
              { value: '4.7★', label: 'Average client rating' },
              { value: '68%', label: 'Response rate' },
              { value: '24hrs', label: 'Average response time' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-6 text-center">
                <p className="font-display text-3xl font-semibold text-amber-600 mb-1">{stat.value}</p>
                <p className="font-body text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-medium text-black mb-4">Simple Pricing</h2>
            <p className="font-body text-neutral-500">Start building your reputation today</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl border-2 p-8 relative ${
                  plan.popular ? 'border-amber-500 shadow-xl lg:scale-105' : 'border-neutral-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-amber-500 text-white font-body text-xs font-semibold rounded-full">
                      MOST POPULAR
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
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
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
              { q: 'How do you send review requests?', a: 'We send requests via email and/or SMS after you mark a job as complete. You can also send manual requests anytime.' },
              { q: 'What platforms do you support?', a: 'We support Google, Facebook, Yelp, TripAdvisor, and many industry-specific platforms.' },
              { q: 'How does the negative review filter work?', a: 'Before directing customers to leave a public review, we ask them to rate their experience. Low ratings are sent to you privately so you can address concerns first.' },
              { q: 'Can I respond to reviews from the dashboard?', a: 'Yes! You can view and respond to Google and Facebook reviews directly from your Verktorlabs dashboard.' },
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
      <section className="py-16 bg-amber-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-medium mb-4">Ready to Build Your Reputation?</h2>
          <p className="font-body text-lg text-white/80 mb-8">Start collecting 5-star reviews on autopilot.</p>
          <a href="#pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-body font-medium rounded-full hover:bg-white/90 transition-all">
            ⭐ Get Started Now
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
