'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type FormData = {
  businessName: string;
  industry: string;
  description: string;
  websiteGoal: string;
  style: string;
  plan: string;
  inspirations: string;
  features: string[];
};

const industries = [
  'Technology', 'E-commerce', 'Healthcare', 'Finance', 'Education',
  'Real Estate', 'Restaurant', 'Fitness', 'Beauty', 'Legal',
  'Marketing', 'Consulting', 'Photography', 'Construction', 'Other'
];

const styles = [
  { id: 'minimal', name: 'Minimal', desc: 'Clean, simple, lots of whitespace', icon: '◻️' },
  { id: 'bold', name: 'Bold', desc: 'Strong colors, big typography', icon: '🔥' },
  { id: 'elegant', name: 'Elegant', desc: 'Sophisticated, refined details', icon: '✨' },
  { id: 'playful', name: 'Playful', desc: 'Fun, colorful, energetic', icon: '🎨' },
  { id: 'corporate', name: 'Corporate', desc: 'Professional, trustworthy', icon: '🏢' },
  { id: 'creative', name: 'Creative', desc: 'Unique, artistic, experimental', icon: '💡' },
];

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 299,
    desc: 'Perfect for landing pages',
    features: ['1 page design', 'Mobile responsive', '2 revisions', '72h delivery'],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 599,
    desc: 'Best for service businesses',
    features: ['Up to 5 pages', 'Mobile responsive', 'Unlimited revisions', '48h delivery', 'Contact form'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    desc: 'Full website experience',
    features: ['Up to 10 pages', 'Mobile responsive', 'Unlimited revisions', '24h delivery', 'Advanced features', 'Priority support'],
  },
];

const featureOptions = [
  'Contact Form', 'Newsletter Signup', 'Social Media Links', 'Blog Section',
  'Testimonials', 'Team Section', 'FAQ Section', 'Pricing Table',
  'Image Gallery', 'Video Background', 'Live Chat Widget', 'Booking System'
];

export default function NewProjectPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    industry: '',
    description: '',
    websiteGoal: '',
    style: '',
    plan: 'professional',
    inspirations: '',
    features: [],
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
  };

  const totalSteps = 4;

  const updateForm = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.businessName.trim() && formData.industry;
      case 2: return formData.style;
      case 3: return formData.plan;
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Build project data - only include fields that exist in your table
      const projectData: any = {
        customer_id: user.id,
        business_name: formData.businessName.trim(),
        industry: formData.industry,
        style: formData.style,
        plan: formData.plan,
        status: 'QUEUED',
        paid: false,
      };

      // Add optional fields if they have values
      if (formData.description.trim()) {
        projectData.description = formData.description.trim();
      }
      if (formData.websiteGoal.trim()) {
        projectData.website_goal = formData.websiteGoal.trim();
      }
      if (formData.inspirations.trim()) {
        projectData.inspirations = formData.inspirations.trim();
      }
      if (formData.features.length > 0) {
        projectData.features = formData.features;
      }

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        alert(`Error: ${error.message}\n\nDetails: ${error.details || 'None'}\n\nHint: ${error.hint || 'Check if all columns exist in your projects table'}`);
        return;
      }

      router.push(`/portal/project/${data.id}`);
    } catch (err: any) {
      console.error('Error creating project:', err);
      alert(`Failed to create project: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      {/* CUSTOM STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        }

        .slide-up {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .input-focus {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-focus:focus {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none noise z-50"></div>

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/portal" className="flex items-center gap-2 font-body text-neutral-500 hover:text-black transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </Link>
            
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-display text-lg font-semibold">V</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-sm text-neutral-500">Step {step} of {totalSteps}</span>
            <span className="font-body text-sm font-medium text-black">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* STEP 1: BUSINESS INFO */}
        {step === 1 && (
          <div className="slide-up">
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-3">
                Tell us about your business
              </h1>
              <p className="font-body text-lg text-neutral-500">
                This helps us understand your needs better
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
              {/* BUSINESS NAME */}
              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateForm('businessName', e.target.value)}
                  placeholder="Acme Inc."
                  className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                />
              </div>

              {/* INDUSTRY */}
              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  Industry *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {industries.map(ind => (
                    <button
                      key={ind}
                      onClick={() => updateForm('industry', ind)}
                      className={`px-4 py-3 rounded-xl font-body text-sm font-medium transition-all ${
                        formData.industry === ind
                          ? 'bg-black text-white'
                          : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  What does your business do?
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  placeholder="Tell us about your products or services..."
                  rows={3}
                  className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
                />
              </div>

              {/* WEBSITE GOAL */}
              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  What is the main goal of your website?
                </label>
                <textarea
                  value={formData.websiteGoal}
                  onChange={(e) => updateForm('websiteGoal', e.target.value)}
                  placeholder="e.g., Generate leads, sell products, showcase portfolio..."
                  rows={2}
                  className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: STYLE */}
        {step === 2 && (
          <div className="slide-up">
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-3">
                Choose your style
              </h1>
              <p className="font-body text-lg text-neutral-500">
                What vibe do you want for your website?
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {styles.map(style => (
                <button
                  key={style.id}
                  onClick={() => updateForm('style', style.id)}
                  className={`card-hover p-6 rounded-2xl text-left transition-all ${
                    formData.style === style.id
                      ? 'bg-black text-white'
                      : 'bg-white border border-neutral-200 hover:border-black'
                  }`}
                >
                  <div className="text-3xl mb-3">{style.icon}</div>
                  <h3 className="font-body font-semibold text-lg mb-1">{style.name}</h3>
                  <p className={`font-body text-sm ${formData.style === style.id ? 'text-white/70' : 'text-neutral-500'}`}>
                    {style.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* INSPIRATIONS */}
            <div className="max-w-xl mx-auto mt-10">
              <label className="block font-body text-sm font-medium text-black mb-2">
                Any websites you love? (optional)
              </label>
              <textarea
                value={formData.inspirations}
                onChange={(e) => updateForm('inspirations', e.target.value)}
                placeholder="Share links to websites that inspire you..."
                rows={2}
                className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: PLAN */}
        {step === 3 && (
          <div className="slide-up">
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-3">
                Select your plan
              </h1>
              <p className="font-body text-lg text-neutral-500">
                Pay only when you love your design
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {plans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => updateForm('plan', plan.id)}
                  className={`card-hover p-6 rounded-3xl text-left transition-all relative ${
                    formData.plan === plan.id
                      ? 'bg-black text-white ring-2 ring-black ring-offset-2'
                      : 'bg-white border border-neutral-200'
                  } ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                >
                  {plan.popular && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-body font-medium ${
                      formData.plan === plan.id ? 'bg-white text-black' : 'bg-black text-white'
                    }`}>
                      Most Popular
                    </div>
                  )}
                  
                  <h3 className="font-display text-xl font-medium mb-1">{plan.name}</h3>
                  <p className={`font-body text-sm mb-4 ${formData.plan === plan.id ? 'text-white/70' : 'text-neutral-500'}`}>
                    {plan.desc}
                  </p>
                  
                  <div className="mb-6">
                    <span className="font-display text-4xl font-semibold">${plan.price}</span>
                    <span className={`font-body text-sm ml-1 ${formData.plan === plan.id ? 'text-white/70' : 'text-neutral-500'}`}>
                      one-time
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 font-body text-sm">
                        <svg className={`w-4 h-4 ${formData.plan === plan.id ? 'text-white' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={formData.plan === plan.id ? 'text-white/90' : 'text-neutral-600'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {/* GUARANTEE */}
            <div className="max-w-xl mx-auto mt-10 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-body font-semibold text-emerald-900 mb-1">100% Risk-Free Guarantee</h3>
              <p className="font-body text-sm text-emerald-700">
                We will design your website first. You only pay if you love it.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: FEATURES */}
        {step === 4 && (
          <div className="slide-up">
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-3">
                Select features
              </h1>
              <p className="font-body text-lg text-neutral-500">
                What would you like included? (optional)
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {featureOptions.map(feature => (
                  <button
                    key={feature}
                    onClick={() => toggleFeature(feature)}
                    className={`p-4 rounded-xl font-body text-sm font-medium transition-all ${
                      formData.features.includes(feature)
                        ? 'bg-black text-white'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {formData.features.includes(feature) && (
                      <span className="mr-2">✓</span>
                    )}
                    {feature}
                  </button>
                ))}
              </div>

              {/* SUMMARY */}
              <div className="mt-12 p-6 bg-white border border-neutral-200 rounded-3xl">
                <h3 className="font-display text-xl font-medium text-black mb-6">Project Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="font-body text-neutral-500">Business</span>
                    <span className="font-body font-medium text-black">{formData.businessName || '—'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="font-body text-neutral-500">Industry</span>
                    <span className="font-body font-medium text-black">{formData.industry || '—'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="font-body text-neutral-500">Style</span>
                    <span className="font-body font-medium text-black capitalize">{formData.style || '—'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="font-body text-neutral-500">Plan</span>
                    <span className="font-body font-medium text-black">
                      {plans.find(p => p.id === formData.plan)?.name} (${plans.find(p => p.id === formData.plan)?.price})
                    </span>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="py-3">
                      <span className="font-body text-neutral-500 block mb-2">Features</span>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map(f => (
                          <span key={f} className="px-3 py-1 bg-neutral-100 rounded-full font-body text-xs text-neutral-600">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div className="max-w-xl mx-auto mt-12 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-neutral-200 text-black font-body font-medium rounded-full hover:bg-neutral-50 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="px-8 py-3 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>Continue</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create Project</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}