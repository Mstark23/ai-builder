// /components/GrowthUpsell.tsx
'use client';

import { useState } from 'react';

type GrowthPackage = {
  id: string;
  name: string;
  problem: string;
  icon: string;
  description: string;
  price: number;
  discountPrice: number;
  monthly: number;
  features: string[];
  color: string;
};

type GrowthUpsellProps = {
  businessName: string;
  projectId: string;
  context: 'post-delivery' | 'post-purchase' | 'dashboard';
  onAddToOrder: (packages: string[]) => Promise<void>;
  onSkip?: () => void;
  recommendations?: string[];
};

// Growth packages
const growthPackages: Record<string, GrowthPackage> = {
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
    color: 'teal'
  }
};

export default function GrowthUpsell({ 
  businessName, 
  projectId, 
  context,
  onAddToOrder, 
  onSkip,
  recommendations = ['visibility', 'trust']
}: GrowthUpsellProps) {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [expanded, setExpanded] = useState(context === 'post-delivery');

  const togglePackage = (packageId: string) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  const calculateTotal = () => {
    const setup = selectedPackages.reduce((sum, id) => {
      const pkg = growthPackages[id];
      return sum + (pkg?.discountPrice || 0);
    }, 0);
    
    const monthly = selectedPackages.reduce((sum, id) => {
      const pkg = growthPackages[id];
      return sum + (pkg?.monthly || 0);
    }, 0);
    
    const originalSetup = selectedPackages.reduce((sum, id) => {
      const pkg = growthPackages[id];
      return sum + (pkg?.price || 0);
    }, 0);
    
    return { setup, monthly, savings: originalSetup - setup };
  };

  const handleAddToOrder = async () => {
    if (selectedPackages.length === 0) return;
    setProcessing(true);
    try {
      await onAddToOrder(selectedPackages);
    } catch (error) {
      console.error('Error adding to order:', error);
    } finally {
      setProcessing(false);
    }
  };

  const totals = calculateTotal();

  // Compact view for dashboard
  if (context === 'dashboard' && !expanded) {
    return (
      <div 
        onClick={() => setExpanded(true)}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-body text-sm font-semibold uppercase tracking-wide text-white/90">Grow Your Business</span>
            </div>
            <h3 className="font-display text-xl font-medium mb-1">Maximize {businessName}'s Impact</h3>
            <p className="font-body text-sm text-white/80">SEO, Reviews, Leads & more — starting at $149</p>
          </div>
          <div className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-body text-sm font-semibold uppercase tracking-wide">Growth Tools</span>
            </div>
            <h2 className="font-display text-2xl font-medium mb-1">
              {context === 'post-delivery' 
                ? `Your website is live! Now let's grow ${businessName}.`
                : `Supercharge ${businessName}'s Growth`
              }
            </h2>
            <p className="font-body text-white/80 text-sm">
              {context === 'post-delivery'
                ? "A website alone won't bring customers. Add these tools to start getting results."
                : "Choose the tools you need to attract more customers and grow your business."
              }
            </p>
          </div>
          {onSkip && (
            <button 
              onClick={onSkip}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Packages */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          {Object.values(growthPackages).map((pkg) => {
            const isSelected = selectedPackages.includes(pkg.id);
            const isRecommended = recommendations.includes(pkg.id);
            
            return (
              <div
                key={pkg.id}
                onClick={() => togglePackage(pkg.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{pkg.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-body font-semibold text-black text-sm">{pkg.name}</h4>
                      {isRecommended && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-body text-xs font-medium rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-neutral-500">{pkg.problem}</p>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-baseline gap-1">
                      <span className="font-body text-xs text-neutral-400 line-through">${pkg.price}</span>
                      <span className="font-body text-lg font-bold text-black">${pkg.discountPrice}</span>
                    </div>
                    <p className="font-body text-xs text-neutral-400">+${pkg.monthly}/mo</p>
                  </div>
                </div>

                {/* Expanded features */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-neutral-200 ml-8">
                    <ul className="grid grid-cols-2 gap-1">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-1.5 font-body text-xs text-neutral-600">
                          <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Summary & CTA */}
        {selectedPackages.length > 0 ? (
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-body text-xs text-neutral-500 mb-0.5">
                  {selectedPackages.length} package{selectedPackages.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-black">${totals.setup}</span>
                  <span className="font-body text-sm text-neutral-500">setup</span>
                  <span className="font-body text-neutral-400">+</span>
                  <span className="font-body font-semibold text-black">${totals.monthly}/mo</span>
                </div>
                {totals.savings > 0 && (
                  <p className="font-body text-xs text-emerald-600 mt-0.5">
                    Saving ${totals.savings} today!
                  </p>
                )}
              </div>
              
              <button
                onClick={handleAddToOrder}
                disabled={processing}
                className="w-full sm:w-auto px-6 py-3 bg-black text-white font-body font-semibold rounded-full hover:bg-black/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Add to Order</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="font-body text-sm text-neutral-500">
              Select packages above to continue
            </p>
          </div>
        )}

        {/* Skip option */}
        {onSkip && (
          <div className="text-center mt-4">
            <button
              onClick={onSkip}
              className="font-body text-neutral-400 hover:text-neutral-600 text-xs transition-colors"
            >
              Maybe later →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
