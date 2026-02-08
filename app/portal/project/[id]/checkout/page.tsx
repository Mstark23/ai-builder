// /app/portal/project/[id]/checkout/page.tsx
// Branded Square Checkout with Billing Info — the page approveAndPay() navigates to
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// ============================================
// TYPES
// ============================================
type CheckoutStep = 'review' | 'billing' | 'payment' | 'processing' | 'success' | 'error';

type BillingInfo = {
  fullName: string;
  email: string;
  country: 'CA' | 'US' | '';
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
};

const planPrices: Record<string, number> = {
  starter: 299, landing: 299,
  professional: 599, service: 599,
  premium: 799,
  enterprise: 999, ecommerce: 999,
};

const planNames: Record<string, string> = {
  starter: 'Starter Website',
  landing: 'Landing Page',
  professional: 'Professional Website',
  service: 'Service Business Website',
  premium: 'Premium Website',
  enterprise: 'Enterprise Website',
  ecommerce: 'E-Commerce Website',
};

const planFeatures: Record<string, string[]> = {
  starter: ['Custom AI-generated website', 'Mobile responsive', 'SEO structure', '1 revision round'],
  landing: ['Conversion-optimized landing page', 'Mobile responsive', 'SEO structure', '1 revision round'],
  professional: ['Multi-page website', 'Conversion copywriting', 'Industry intelligence', '2 revision rounds'],
  service: ['Service-focused design', 'Booking integration ready', 'Local SEO optimized', '2 revision rounds'],
  premium: ['Premium multi-page site', 'Advanced animations', 'Analytics setup', '3 revision rounds', 'Priority support'],
  enterprise: ['Enterprise website', 'Custom functionality', 'Full analytics suite', 'Unlimited revisions', 'Dedicated support'],
  ecommerce: ['E-commerce ready', 'Product catalog', 'Payment integration', 'Inventory management', '3 revision rounds'],
};

const CA_PROVINCES = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' },
];

const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
];

// ============================================
// ICONS
// ============================================
const Icons = {
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  XCircle: () => (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CreditCard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
};

// ============================================
// STEP INDICATOR
// ============================================
const StepIndicator = ({ currentStep }: { currentStep: CheckoutStep }) => {
  const steps = [
    { key: 'review', label: 'Review' },
    { key: 'billing', label: 'Billing' },
    { key: 'payment', label: 'Payment' },
  ];

  const getStepIndex = (step: CheckoutStep) => {
    if (step === 'review') return 0;
    if (step === 'billing') return 1;
    if (step === 'payment' || step === 'processing') return 2;
    return 3;
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            i < currentIndex
              ? 'bg-emerald-500 text-white'
              : i === currentIndex
              ? 'bg-black text-white'
              : 'bg-neutral-200 text-neutral-400'
          }`}>
            {i < currentIndex ? '✓' : i + 1}
          </div>
          <span className={`text-xs font-medium hidden sm:inline ${
            i <= currentIndex ? 'text-black' : 'text-neutral-400'
          }`}>{s.label}</span>
          {i < steps.length - 1 && (
            <div className={`w-8 h-px ${i < currentIndex ? 'bg-emerald-500' : 'bg-neutral-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<CheckoutStep>('review');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [squareLoaded, setSquareLoaded] = useState(false);
  const [cardInstance, setCardInstance] = useState<any>(null);
  const [billingErrors, setBillingErrors] = useState<Partial<BillingInfo>>({});

  const [billing, setBilling] = useState<BillingInfo>({
    fullName: '',
    email: '',
    country: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  });

  // ── Load project data ─────────────────────────────────
  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setCustomer(customerData);

      // Pre-fill billing from customer data
      if (customerData) {
        setBilling(prev => ({
          ...prev,
          fullName: customerData.name || '',
          email: customerData.email || '',
        }));
      }

      const { data: projectData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error || !projectData) {
        router.push('/portal');
        return;
      }

      if (projectData.paid) {
        router.push(`/portal/project/${projectId}?payment=success`);
        return;
      }

      setProject(projectData);
    } catch (err) {
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Load Square Web Payments SDK ──────────────────────
  useEffect(() => {
    if (step !== 'payment') return;

    const loadSquare = async () => {
      if (!document.getElementById('square-web-sdk')) {
        const script = document.createElement('script');
        script.id = 'square-web-sdk';
        script.src = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'production'
          ? 'https://web.squarecdn.com/v1/square.js'
          : 'https://sandbox.web.squarecdn.com/v1/square.js';
        script.async = true;
        script.onload = () => initializeSquare();
        document.head.appendChild(script);
      } else {
        initializeSquare();
      }
    };

    const initializeSquare = async () => {
      try {
        const payments = (window as any).Square.payments(
          process.env.NEXT_PUBLIC_SQUARE_APP_ID!,
          process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!
        );

        const card = await payments.card();
        await card.attach('#square-card-container');
        setCardInstance(card);
        setSquareLoaded(true);
      } catch (err) {
        console.error('Failed to initialize Square:', err);
        setErrorMessage('Failed to load payment form. Please refresh and try again.');
      }
    };

    loadSquare();

    return () => {
      if (cardInstance) {
        try { cardInstance.destroy(); } catch (e) {}
      }
    };
  }, [step]);

  // ── Validate billing ──────────────────────────────────
  const validateBilling = (): boolean => {
    const errors: Partial<BillingInfo> = {};

    if (!billing.fullName.trim()) errors.fullName = 'Full name is required';
    if (!billing.email.trim()) errors.email = 'Email is required';
    if (!billing.country) errors.country = 'Country is required';
    if (!billing.addressLine1.trim()) errors.addressLine1 = 'Address is required';
    if (!billing.city.trim()) errors.city = 'City is required';
    if (!billing.state) errors.state = billing.country === 'CA' ? 'Province is required' : 'State is required';

    if (!billing.postalCode.trim()) {
      errors.postalCode = billing.country === 'CA' ? 'Postal code is required' : 'ZIP code is required';
    } else if (billing.country === 'CA' && !/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(billing.postalCode.trim())) {
      errors.postalCode = 'Enter a valid postal code (e.g. H7T 2T1)';
    } else if (billing.country === 'US' && !/^\d{5}(-\d{4})?$/.test(billing.postalCode.trim())) {
      errors.postalCode = 'Enter a valid ZIP code (e.g. 10001)';
    }

    setBillingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBillingContinue = () => {
    if (validateBilling()) {
      setStep('payment');
    }
  };

  // ── Process payment ───────────────────────────────────
  const handlePayment = async () => {
    if (!cardInstance) return;

    setStep('processing');
    setErrorMessage('');

    try {
      const tokenResult = await cardInstance.tokenize();

      if (tokenResult.status !== 'OK') {
        throw new Error(tokenResult.errors?.[0]?.message || 'Card validation failed');
      }

      const response = await fetch('/api/square/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          plan: project.plan,
          businessName: project.business_name,
          sourceId: tokenResult.token,
          billing: {
            fullName: billing.fullName,
            email: billing.email,
            country: billing.country,
            addressLine1: billing.addressLine1,
            addressLine2: billing.addressLine2,
            city: billing.city,
            state: billing.state,
            postalCode: billing.postalCode,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Payment failed');
      }

      setPaymentResult(data);
      setStep('success');
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setStep('error');
    }
  };

  // ── Helpers ───────────────────────────────────────────
  const price = project ? planPrices[project.plan] || 299 : 0;
  const name = project ? planNames[project.plan] || 'Website' : '';
  const features = project ? planFeatures[project.plan] || planFeatures.starter : [];

  const updateBilling = (field: keyof BillingInfo, value: string) => {
    setBilling(prev => ({ ...prev, [field]: value }));
    if (billingErrors[field]) {
      setBillingErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    // Reset state when country changes
    if (field === 'country') {
      setBilling(prev => ({ ...prev, state: '', postalCode: '' }));
    }
  };

  const inputClass = (field: keyof BillingInfo) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none ${
      billingErrors[field]
        ? 'border-red-300 bg-red-50 focus:border-red-500'
        : 'border-neutral-200 bg-white focus:border-black'
    }`;

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  // ============================================
  // REVIEW STEP
  // ============================================
  if (step === 'review') {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="border-b border-neutral-200 bg-white">
          <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
            <Link href={`/portal/project/${projectId}`} className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors">
              <Icons.ArrowLeft />
              <span className="text-sm font-medium">Back to project</span>
            </Link>
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-wider">
              <Icons.Lock />
              Secure Checkout
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-6 py-10">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-black">VEKTORLABS</h1>
            <p className="text-neutral-500 text-sm mt-1">Complete your purchase</p>
          </div>

          <StepIndicator currentStep="review" />

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-black">{name}</h2>
                  <p className="text-neutral-500 text-sm mt-1">
                    Custom website for {project.business_name}
                  </p>
                </div>
                <p className="text-2xl font-bold text-black">${price}</p>
              </div>

              <div className="mt-5 space-y-2.5">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Icons.Check />
                    </div>
                    <span className="text-sm text-neutral-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-neutral-100" />

            <div className="px-6 py-4">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Customer</p>
              <p className="text-sm font-semibold text-black">{customer?.name || 'Customer'}</p>
              <p className="text-sm text-neutral-500">{customer?.email || ''}</p>
            </div>

            <div className="h-px bg-neutral-100" />

            <div className="px-6 py-5 flex items-center justify-between bg-neutral-50">
              <span className="font-semibold text-black">Total due today</span>
              <span className="text-xl font-bold text-black">${price} CAD</span>
            </div>
          </div>

          <button
            onClick={() => setStep('billing')}
            className="w-full mt-6 bg-black text-white py-4 rounded-xl font-semibold text-base hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            Continue to Billing
          </button>

          <div className="flex items-center justify-center gap-2 mt-5 text-neutral-400 text-xs">
            <Icons.Shield />
            <span>Payments processed securely by Square. Your card data never touches our servers.</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // BILLING STEP
  // ============================================
  if (step === 'billing') {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="border-b border-neutral-200 bg-white">
          <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setStep('review')} className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors">
              <Icons.ArrowLeft />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">Total</span>
              <span className="text-base font-bold text-black">${price} CAD</span>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-6 py-10">
          <div className="text-center mb-2">
            <h1 className="text-xl font-bold text-black">Billing Information</h1>
            <p className="text-neutral-500 text-sm mt-1">Enter your billing details</p>
          </div>

          <StepIndicator currentStep="billing" />

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-5">

            {/* ── Country ─────────────────────────────── */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Country</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { code: 'CA' as const, label: '🇨🇦 Canada', flag: '🇨🇦' },
                  { code: 'US' as const, label: '🇺🇸 United States', flag: '🇺🇸' },
                ].map(c => (
                  <button
                    key={c.code}
                    onClick={() => updateBilling('country', c.code)}
                    className={`py-3.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                      billing.country === c.code
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              {billingErrors.country && <p className="text-red-500 text-xs mt-1">{billingErrors.country}</p>}
            </div>

            {/* ── Full Name ───────────────────────────── */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                value={billing.fullName}
                onChange={e => updateBilling('fullName', e.target.value)}
                placeholder="John Doe"
                className={inputClass('fullName')}
              />
              {billingErrors.fullName && <p className="text-red-500 text-xs mt-1">{billingErrors.fullName}</p>}
            </div>

            {/* ── Email ───────────────────────────────── */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={billing.email}
                onChange={e => updateBilling('email', e.target.value)}
                placeholder="you@email.com"
                className={inputClass('email')}
              />
              {billingErrors.email && <p className="text-red-500 text-xs mt-1">{billingErrors.email}</p>}
            </div>

            {/* ── Address Line 1 ──────────────────────── */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Address</label>
              <input
                type="text"
                value={billing.addressLine1}
                onChange={e => updateBilling('addressLine1', e.target.value)}
                placeholder="123 Main Street"
                className={inputClass('addressLine1')}
              />
              {billingErrors.addressLine1 && <p className="text-red-500 text-xs mt-1">{billingErrors.addressLine1}</p>}
            </div>

            {/* ── Address Line 2 ──────────────────────── */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                Apartment, suite, etc. <span className="text-neutral-400 font-normal normal-case">(optional)</span>
              </label>
              <input
                type="text"
                value={billing.addressLine2}
                onChange={e => updateBilling('addressLine2', e.target.value)}
                placeholder="Apt 4B"
                className={inputClass('addressLine2')}
              />
            </div>

            {/* ── City ────────────────────────────────── */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">City</label>
              <input
                type="text"
                value={billing.city}
                onChange={e => updateBilling('city', e.target.value)}
                placeholder={billing.country === 'CA' ? 'Montreal' : 'New York'}
                className={inputClass('city')}
              />
              {billingErrors.city && <p className="text-red-500 text-xs mt-1">{billingErrors.city}</p>}
            </div>

            {/* ── State/Province + Postal/ZIP ─────────── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  {billing.country === 'US' ? 'State' : 'Province'}
                </label>
                <select
                  value={billing.state}
                  onChange={e => updateBilling('state', e.target.value)}
                  className={`${inputClass('state')} appearance-none`}
                >
                  <option value="">Select...</option>
                  {(billing.country === 'US' ? US_STATES : CA_PROVINCES).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {billingErrors.state && <p className="text-red-500 text-xs mt-1">{billingErrors.state}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  {billing.country === 'US' ? 'ZIP Code' : 'Postal Code'}
                </label>
                <input
                  type="text"
                  value={billing.postalCode}
                  onChange={e => updateBilling('postalCode', e.target.value.toUpperCase())}
                  placeholder={billing.country === 'US' ? '10001' : 'H7T 2T1'}
                  className={inputClass('postalCode')}
                />
                {billingErrors.postalCode && <p className="text-red-500 text-xs mt-1">{billingErrors.postalCode}</p>}
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleBillingContinue}
            disabled={!billing.country}
            className={`w-full mt-6 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
              billing.country
                ? 'bg-black text-white hover:bg-neutral-800 cursor-pointer'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <Icons.CreditCard />
            Continue to Payment
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // PAYMENT STEP
  // ============================================
  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="border-b border-neutral-200 bg-white">
          <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setStep('billing')} className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors">
              <Icons.ArrowLeft />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">Total</span>
              <span className="text-base font-bold text-black">${price} CAD</span>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-6 py-10">
          <div className="text-center mb-2">
            <h1 className="text-xl font-bold text-black">Payment Details</h1>
            <p className="text-neutral-500 text-sm mt-1">Enter your card information</p>
          </div>

          <StepIndicator currentStep="payment" />

          {/* Billing Summary */}
          <div className="bg-neutral-100 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Icons.MapPin />
              <span className="text-neutral-700">
                {billing.fullName} · {billing.city}, {billing.state} {billing.postalCode}
              </span>
            </div>
            <button
              onClick={() => setStep('billing')}
              className="text-xs font-semibold text-black hover:underline"
            >
              Edit
            </button>
          </div>

          {/* Card Form */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <div
              id="square-card-container"
              className="min-h-[90px]"
              style={{ minHeight: 90 }}
            />

            {!squareLoaded && (
              <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
                <span className="ml-3 text-sm text-neutral-500">Loading payment form...</span>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={!squareLoaded}
              className={`w-full mt-5 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                squareLoaded
                  ? 'bg-black text-white hover:bg-neutral-800 cursor-pointer'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <Icons.Lock />
              Pay ${price} CAD
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-neutral-400">
            <div className="flex items-center gap-1.5 text-xs">
              <Icons.Lock />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Icons.Shield />
              <span>PCI Compliant</span>
            </div>
          </div>

          <p className="text-center text-xs text-neutral-400 mt-4">
            By completing this purchase, you agree to VektorLabs&apos; terms of service.
            Your website build will begin immediately after payment.
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // PROCESSING STEP
  // ============================================
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="w-12 h-12 border-2 border-neutral-300 border-t-black rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-black">Processing payment...</h2>
          <p className="text-neutral-500 text-sm mt-2">Please don&apos;t close this window.</p>
        </div>
      </div>
    );
  }

  // ============================================
  // SUCCESS STEP
  // ============================================
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-emerald-500 flex justify-center mb-4">
            <Icons.CheckCircle />
          </div>
          <h2 className="text-2xl font-bold text-black">Payment Successful!</h2>
          <p className="text-neutral-600 mt-2">
            Your <strong>{name}</strong> for {project.business_name} is confirmed.
          </p>
          <p className="text-neutral-500 text-sm mt-1">
            A confirmation email has been sent to <strong>{billing.email}</strong>
          </p>

          {/* Receipt */}
          <div className="bg-white rounded-xl border border-neutral-200 mt-8 text-left overflow-hidden">
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Amount</span>
                <span className="font-semibold text-black">${price} CAD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Plan</span>
                <span className="font-semibold text-black">{name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Billing</span>
                <span className="font-semibold text-black">{billing.city}, {billing.state} {billing.country}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Status</span>
                <span className="text-emerald-600 font-semibold">Paid ✓</span>
              </div>
              {paymentResult?.payment?.id && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Reference</span>
                  <span className="font-mono text-xs text-neutral-600">
                    {paymentResult.payment.id.slice(0, 20)}...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 mt-5 text-left">
            <h3 className="font-semibold text-blue-900 text-sm">What happens next?</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-blue-800">
              <li>→ Your website build begins immediately</li>
              <li>→ You&apos;ll receive a preview within 72 hours</li>
              <li>→ Complete your setup to customize your site</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <Link
              href={`/portal/project/${projectId}/setup`}
              className="block w-full bg-black text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-neutral-800 transition-colors"
            >
              Complete Setup →
            </Link>
            <Link
              href={`/portal/project/${projectId}`}
              className="block w-full bg-white text-black py-3.5 rounded-xl font-semibold text-sm border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              View Project
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STEP
  // ============================================
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-6">
        <div className="text-red-500 flex justify-center mb-4">
          <Icons.XCircle />
        </div>
        <h2 className="text-xl font-bold text-black">Payment Failed</h2>
        <p className="text-red-600 text-sm mt-2">{errorMessage}</p>

        <button
          onClick={() => setStep('payment')}
          className="w-full mt-8 bg-black text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-neutral-800 transition-colors"
        >
          Try Again
        </button>
        <Link
          href={`/portal/project/${projectId}`}
          className="block w-full mt-3 text-neutral-500 text-sm hover:text-black transition-colors"
        >
          Back to project
        </Link>
      </div>
    </div>
  );
}
