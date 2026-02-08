// /app/portal/payment-success/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Project = {
  id: string;
  business_name: string;
  industry?: string;
  plan: string;
  paid: boolean;
};

// Growth packages for upsell
const growthPackages = {
  visibility: {
    id: 'visibility',
    name: 'Get Found Package',
    problem: "People can't find you on Google",
    icon: '🔍',
    description: "Your website is useless if no one can find it. We'll make sure you show up when customers search.",
    price: 299,
    discountPrice: 199,
    monthly: 99,
    features: [
      'Google Business Profile setup',
      'List on 30+ directories',
      'Local SEO optimization',
      'Monthly ranking reports'
    ],
    urgency: "Most businesses don't show up on Google for 6+ months without this",
    color: 'blue'
  },
  trust: {
    id: 'trust',
    name: 'Trust Builder Package',
    problem: "You have zero reviews",
    icon: '⭐',
    description: "93% of customers read reviews before buying. Start collecting 5-star reviews from day one.",
    price: 199,
    discountPrice: 149,
    monthly: 79,
    features: [
      'Automated review requests',
      'Review landing page',
      'QR codes for in-person',
      'Review monitoring'
    ],
    urgency: "Businesses with 10+ reviews get 3x more customers",
    color: 'amber'
  },
  leads: {
    id: 'leads',
    name: 'Lead Machine Package',
    problem: "Visitors won't convert to customers",
    icon: '📞',
    description: "Turn website visitors into actual phone calls and inquiries with conversion optimization.",
    price: 349,
    discountPrice: 249,
    monthly: 99,
    features: [
      'Lead capture popups',
      'Optimized contact forms',
      'Click-to-call buttons',
      'Instant lead notifications'
    ],
    urgency: "The average website converts less than 2% of visitors",
    color: 'purple'
  },
  booking: {
    id: 'booking',
    name: 'Easy Booking Package',
    problem: "Scheduling is going to eat your time",
    icon: '📅',
    description: "Let customers book appointments 24/7 without calling. Reduce no-shows with automated reminders.",
    price: 249,
    discountPrice: 179,
    monthly: 49,
    features: [
      'Online booking system',
      'Calendar sync',
      'Automated reminders',
      'Deposit collection'
    ],
    urgency: "Service businesses save 5+ hours/week with online booking",
    color: 'teal'
  }
};

// Industry to package mapping
const industryRecommendations: Record<string, string[]> = {
  'restaurant': ['visibility', 'trust'],
  'salon': ['booking', 'trust'],
  'spa': ['booking', 'trust'],
  'contractor': ['visibility', 'leads'],
  'plumber': ['visibility', 'leads'],
  'electrician': ['visibility', 'leads'],
  'lawyer': ['visibility', 'trust'],
  'dentist': ['booking', 'trust'],
  'doctor': ['booking', 'trust'],
  'gym': ['leads', 'trust'],
  'retail': ['visibility', 'trust'],
  'ecommerce': ['leads', 'visibility'],
  'consulting': ['leads', 'booking'],
  'agency': ['leads', 'trust'],
  'default': ['visibility', 'trust']
};

// Starter Bundle
const starterBundle = {
  name: 'Growth Starter Bundle',
  description: 'The essential foundation for any new website',
  packages: ['visibility', 'trust'],
  originalPrice: 498,
  bundlePrice: 349,
  savings: 149,
  monthly: 99,
  color: 'emerald'
};

// Loading component
function LoadingState() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-body text-neutral-500">Loading...</p>
      </div>
    </div>
  );
}

// Main content component that uses useSearchParams
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('project');
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showBundle, setShowBundle] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [processing, setProcessing] = useState(false);

  // Recommended packages based on industry
  const recommendations = project?.industry 
    ? industryRecommendations[project.industry.toLowerCase()] || industryRecommendations.default
    : industryRecommendations.default;

  useEffect(() => {
    loadProject();
  }, [projectId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const loadProject = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (data) {
        setProject(data);
      }
    } catch (err) {
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePackage = (packageId: string) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
    setShowBundle(false);
  };

  const calculateTotal = () => {
    if (showBundle && selectedPackages.length === 0) {
      return {
        setup: starterBundle.bundlePrice,
        monthly: starterBundle.monthly,
        savings: starterBundle.savings
      };
    }
    
    const setup = selectedPackages.reduce((sum, id) => {
      const pkg = growthPackages[id as keyof typeof growthPackages];
      return sum + (pkg?.discountPrice || 0);
    }, 0);
    
    const monthly = selectedPackages.reduce((sum, id) => {
      const pkg = growthPackages[id as keyof typeof growthPackages];
      return sum + (pkg?.monthly || 0);
    }, 0);
    
    const originalSetup = selectedPackages.reduce((sum, id) => {
      const pkg = growthPackages[id as keyof typeof growthPackages];
      return sum + (pkg?.price || 0);
    }, 0);
    
    return {
      setup,
      monthly,
      savings: originalSetup - setup
    };
  };

  const handleAddToOrder = async () => {
    setProcessing(true);
    // Growth packages coming soon
    // For now, simulate and redirect
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push(`/portal/project/${projectId}?upsell=success`);
  };

  const handleSkip = () => {
    router.push(`/portal/project/${projectId}`);
  };

  if (loading) {
    return <LoadingState />;
  }

  const totals = calculateTotal();

  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-display text-sm font-semibold">V</span>
              </div>
              <span className="font-body text-black font-semibold text-sm">VERKTORLABS</span>
            </div>
            
            {/* URGENCY TIMER */}
            {timeLeft > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
                <span className="text-red-600 text-sm">🔥</span>
                <span className="font-body text-sm font-semibold text-red-600">
                  Special pricing expires in {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* SUCCESS MESSAGE */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-black mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="font-body text-lg text-neutral-600 mb-2">
            Your website for <span className="font-semibold">{project?.business_name || 'your business'}</span> is now being built.
          </p>
          <p className="font-body text-neutral-500">
            You'll receive a preview in your inbox within 72 hours.
          </p>
        </div>

        {/* THE HOOK */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h2 className="font-display text-xl font-medium text-amber-900 mb-2">
                But here's the thing...
              </h2>
              <p className="font-body text-amber-800">
                <strong>A website alone won't bring you customers.</strong> Most new websites sit invisible on Google for months, have zero reviews, and don't convert visitors into leads. 
                Don't let that happen to you.
              </p>
            </div>
          </div>
        </div>

        {/* BUNDLE OFFER - Show first */}
        {showBundle && (
          <div className="bg-black rounded-3xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            {/* BEST VALUE BADGE */}
            <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="px-4 py-2 bg-emerald-500 text-white font-body text-sm font-bold rounded-full shadow-lg">
                🎁 BEST VALUE - SAVE ${starterBundle.savings}
              </span>
            </div>

            <div className="relative z-10 pt-4">
              <div className="text-center mb-6">
                <h3 className="font-display text-2xl font-medium text-white mb-2">
                  {starterBundle.name}
                </h3>
                <p className="font-body text-white/70">
                  {starterBundle.description}
                </p>
              </div>

              {/* WHAT'S INCLUDED */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {starterBundle.packages.map(pkgId => {
                  const pkg = growthPackages[pkgId as keyof typeof growthPackages];
                  return (
                    <div key={pkgId} className="bg-white/10 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{pkg.icon}</span>
                        <div>
                          <p className="font-body font-semibold text-white">{pkg.name}</p>
                          <p className="font-body text-xs text-white/60">
                            <span className="line-through">${pkg.price}</span> → Included
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {pkg.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 font-body text-sm text-white/80">
                            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* PRICING */}
              <div className="bg-white/10 rounded-2xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                      <span className="font-body text-white/50 line-through text-lg">${starterBundle.originalPrice}</span>
                      <span className="font-display text-4xl font-bold text-white">${starterBundle.bundlePrice}</span>
                    </div>
                    <p className="font-body text-sm text-white/60">
                      One-time setup + ${starterBundle.monthly}/mo for ongoing services
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="inline-block px-3 py-1 bg-emerald-500 text-white font-body text-sm font-semibold rounded-full mb-1">
                      Save ${starterBundle.savings}
                    </span>
                    <p className="font-body text-xs text-white/50">Limited time offer</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleAddToOrder}
                disabled={processing}
                className="w-full py-4 bg-white text-black font-body font-semibold rounded-full hover:bg-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Add Bundle to My Order</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center font-body text-xs text-white/50 mt-3">
                30-day money-back guarantee • Cancel monthly services anytime
              </p>
            </div>
          </div>
        )}

        {/* OR DIVIDER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-neutral-200"></div>
          <span className="font-body text-sm text-neutral-400">or pick what you need</span>
          <div className="flex-1 h-px bg-neutral-200"></div>
        </div>

        {/* INDIVIDUAL PACKAGES */}
        <div className="space-y-4 mb-8">
          <h3 className="font-body font-semibold text-black">Select individual packages:</h3>
          
          {Object.values(growthPackages).map((pkg) => {
            const isSelected = selectedPackages.includes(pkg.id);
            const isRecommended = recommendations.includes(pkg.id);
            
            return (
              <div
                key={pkg.id}
                onClick={() => togglePackage(pkg.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-black bg-neutral-50' 
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* CHECKBOX */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                    isSelected ? 'border-black bg-black' : 'border-neutral-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* ICON */}
                  <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{pkg.icon}</span>
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-body font-semibold text-black">{pkg.name}</h4>
                      {isRecommended && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-body text-xs font-medium rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="font-body text-sm text-neutral-500 mb-2">{pkg.problem}</p>
                    <p className="font-body text-xs text-neutral-400">{pkg.description}</p>
                  </div>

                  {/* PRICE */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-baseline gap-1">
                      <span className="font-body text-xs text-neutral-400 line-through">${pkg.price}</span>
                      <span className="font-display text-xl font-bold text-black">${pkg.discountPrice}</span>
                    </div>
                    <p className="font-body text-xs text-neutral-400">+${pkg.monthly}/mo</p>
                  </div>
                </div>

                {/* EXPANDED FEATURES */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 font-body text-sm text-neutral-600">
                          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SELECTED PACKAGES SUMMARY */}
        {selectedPackages.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-black p-6 mb-8 sticky bottom-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-body text-sm text-neutral-500 mb-1">
                  {selectedPackages.length} package{selectedPackages.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-black">${totals.setup}</span>
                  <span className="font-body text-neutral-500">setup</span>
                  <span className="font-body text-neutral-400">+</span>
                  <span className="font-body font-semibold text-black">${totals.monthly}/mo</span>
                </div>
                {totals.savings > 0 && (
                  <p className="font-body text-sm text-emerald-600">
                    You're saving ${totals.savings} with today's pricing!
                  </p>
                )}
              </div>
              
              <button
                onClick={handleAddToOrder}
                disabled={processing}
                className="w-full sm:w-auto px-8 py-4 bg-black text-white font-body font-semibold rounded-full hover:bg-black/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Add to My Order</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* SKIP OPTION */}
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="font-body text-neutral-400 hover:text-neutral-600 text-sm transition-colors"
          >
            No thanks, I'll grow my business later →
          </button>
          <p className="font-body text-xs text-neutral-300 mt-2">
            You can add these services anytime from your Growth dashboard (at regular prices)
          </p>
        </div>

        {/* TRUST ELEMENTS */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-body font-semibold text-black mb-1">30-Day Guarantee</h4>
              <p className="font-body text-sm text-neutral-500">Full refund if not satisfied</p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-body font-semibold text-black mb-1">Fast Setup</h4>
              <p className="font-body text-sm text-neutral-500">Live within 7-10 days</p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="font-body font-semibold text-black mb-1">Done For You</h4>
              <p className="font-body text-sm text-neutral-500">We handle everything</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Main export with Suspense boundary
export default function PaymentSuccess() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
