'use client';

import { useState } from 'react';
import Link from 'next/link';

type UpsellProps = {
  businessName: string;
  industry?: string;
  projectId: string;
  context: 'payment-success' | 'project-page' | 'post-delivery';
  onAddToOrder?: (packages: string[]) => void;
  onSkip?: () => void;
};

// Mini package cards for quick upsell
const quickPackages = [
  {
    id: 'visibility',
    name: 'Get Found',
    problem: "Show up on Google",
    icon: '🔍',
    price: 299,
    discountPrice: 199,
    monthly: 99,
    highlight: "Most businesses don't appear on Google for 6+ months without this"
  },
  {
    id: 'trust',
    name: 'Get Reviews',
    problem: "Build trust fast",
    icon: '⭐',
    price: 199,
    discountPrice: 149,
    monthly: 79,
    highlight: "Businesses with 10+ reviews get 3x more customers"
  },
  {
    id: 'leads',
    name: 'Get Leads',
    problem: "Convert visitors",
    icon: '📞',
    price: 349,
    discountPrice: 249,
    monthly: 99,
    highlight: "Double your inquiries in 60 days"
  }
];

const bundle = {
  name: 'Launch Bundle',
  packages: ['visibility', 'trust'],
  originalPrice: 498,
  price: 299,
  monthly: 99,
  savings: 199
};

export default function GrowthUpsell({ 
  businessName, 
  industry, 
  projectId, 
  context,
  onAddToOrder,
  onSkip 
}: UpsellProps) {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showBundle, setShowBundle] = useState(true);
  const [processing, setProcessing] = useState(false);

  const contextMessages = {
    'payment-success': {
      hook: "Your website is being built! But a website alone won't bring customers...",
      cta: "Add to My Order",
      skip: "I'll grow my business later"
    },
    'project-page': {
      hook: "Ready to start getting customers from your new website?",
      cta: "Get Started",
      skip: "Maybe later"
    },
    'post-delivery': {
      hook: "Your website is live! Now let's get you customers...",
      cta: "Activate Now",
      skip: "I'll do it myself"
    }
  };

  const messages = contextMessages[context];

  const togglePackage = (id: string) => {
    setSelectedPackages(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    setShowBundle(false);
  };

  const calculateTotal = () => {
    if (showBundle) {
      return { setup: bundle.price, monthly: bundle.monthly, savings: bundle.savings };
    }
    
    const setup = selectedPackages.reduce((sum, id) => {
      const pkg = quickPackages.find(p => p.id === id);
      return sum + (pkg?.discountPrice || 0);
    }, 0);
    
    const monthly = selectedPackages.reduce((sum, id) => {
      const pkg = quickPackages.find(p => p.id === id);
      return sum + (pkg?.monthly || 0);
    }, 0);

    const original = selectedPackages.reduce((sum, id) => {
      const pkg = quickPackages.find(p => p.id === id);
      return sum + (pkg?.price || 0);
    }, 0);
    
    return { setup, monthly, savings: original - setup };
  };

  const handleSubmit = async () => {
    setProcessing(true);
    const packages = showBundle ? bundle.packages : selectedPackages;
    
    if (onAddToOrder) {
      await onAddToOrder(packages);
    }
    
    setProcessing(false);
  };

  const totals = calculateTotal();
  const hasSelection = showBundle || selectedPackages.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">⚠️</span>
          <span className="font-body text-sm font-semibold uppercase tracking-wide opacity-90">
            Important
          </span>
        </div>
        <p className="font-display text-xl font-medium">
          {messages.hook}
        </p>
      </div>

      <div className="p-6">
        {/* BUNDLE OFFER */}
        {showBundle && (
          <div 
            className="bg-black rounded-2xl p-5 mb-4 cursor-pointer relative overflow-hidden"
            onClick={() => {}}
          >
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 bg-emerald-500 text-white font-body text-xs font-bold rounded-full">
                SAVE ${bundle.savings}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                {bundle.packages.map(pkgId => {
                  const pkg = quickPackages.find(p => p.id === pkgId);
                  return (
                    <div key={pkgId} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-black">
                      <span>{pkg?.icon}</span>
                    </div>
                  );
                })}
              </div>
              <div>
                <h3 className="font-body font-semibold text-white">{bundle.name}</h3>
                <p className="font-body text-xs text-white/60">Get Found + Get Reviews</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-body text-white/50 line-through">${bundle.originalPrice}</span>
              <span className="font-display text-3xl font-bold text-white">${bundle.price}</span>
              <span className="font-body text-white/60">+ ${bundle.monthly}/mo</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={processing}
              className="w-full py-3 bg-white text-black font-body font-semibold rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
            >
              {processing ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{messages.cta}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* OR SEPARATOR */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-neutral-200"></div>
          <span className="font-body text-xs text-neutral-400">or choose individually</span>
          <div className="flex-1 h-px bg-neutral-200"></div>
        </div>

        {/* INDIVIDUAL PACKAGES */}
        <div className="space-y-3">
          {quickPackages.map(pkg => {
            const isSelected = selectedPackages.includes(pkg.id);
            return (
              <div
                key={pkg.id}
                onClick={() => togglePackage(pkg.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected ? 'border-black bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-black bg-black' : 'border-neutral-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  
                  <span className="text-xl">{pkg.icon}</span>
                  
                  <div className="flex-1">
                    <p className="font-body font-semibold text-black text-sm">{pkg.name}</p>
                    <p className="font-body text-xs text-neutral-500">{pkg.problem}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-body font-semibold text-black">${pkg.discountPrice}</p>
                    <p className="font-body text-xs text-neutral-400">+${pkg.monthly}/mo</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SELECTED TOTAL */}
        {selectedPackages.length > 0 && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-sm text-neutral-500">
                {selectedPackages.length} selected
              </span>
              <div className="text-right">
                <span className="font-display text-xl font-bold text-black">${totals.setup}</span>
                <span className="font-body text-neutral-500 text-sm"> + ${totals.monthly}/mo</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={processing}
              className="w-full py-3 bg-black text-white font-body font-semibold rounded-xl hover:bg-black/80 transition-all flex items-center justify-center gap-2"
            >
              {processing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{messages.cta}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* SKIP */}
        <div className="mt-4 text-center">
          <button
            onClick={onSkip}
            className="font-body text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {messages.skip} →
          </button>
        </div>

        {/* TRUST */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-body text-xs text-neutral-500">30-day guarantee</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-body text-xs text-neutral-500">Setup in 7 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// USAGE EXAMPLES
// ============================================

/*

// 1. ON PAYMENT SUCCESS PAGE
// File: /app/portal/payment-success/page.tsx

import GrowthUpsell from '@/components/GrowthUpsell';

export default function PaymentSuccess() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1>Payment Successful! 🎉</h1>
        <p>Your website is being built.</p>
      </div>
      
      <GrowthUpsell 
        businessName="Acme Corp"
        projectId="123"
        context="payment-success"
        onAddToOrder={async (packages) => {
          // Add to Stripe checkout or create new order
          console.log('Adding packages:', packages);
        }}
        onSkip={() => {
          router.push('/portal');
        }}
      />
    </div>
  );
}


// 2. ON PROJECT PAGE (After Delivery)
// File: /app/portal/project/[id]/page.tsx

{project.status === 'DELIVERED' && !hasGrowthServices && (
  <GrowthUpsell 
    businessName={project.business_name}
    projectId={project.id}
    context="post-delivery"
    onAddToOrder={async (packages) => {
      // Redirect to checkout
      router.push(`/checkout/growth?packages=${packages.join(',')}`);
    }}
    onSkip={() => setShowUpsell(false)}
  />
)}


// 3. IN EMAIL (Static version - link to page)

<a href="https://verktorlabs.com/portal/growth?ref=email-upsell">
  <img src="growth-upsell-banner.png" />
</a>

*/
