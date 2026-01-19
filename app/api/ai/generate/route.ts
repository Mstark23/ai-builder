'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type FormData = {
  // Step 1: Business Basics
  businessName: string;
  industry: string;
  description: string;
  websiteGoal: string;
  targetCustomer: string;
  
  // Step 2: Style & Vibe
  style: string;
  colorPreference: string;
  moodTags: string[];
  inspirations: string;
  
  // Step 3: Plan
  plan: string;
  
  // Step 4: Features & Contact
  features: string[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  uniqueValue: string;
};

// Enhanced industries with icons and better categorization
const industries = [
  { id: 'restaurant', name: 'Restaurant / Food', icon: '🍽️' },
  { id: 'local-services', name: 'Local Services', icon: '🔧' },
  { id: 'professional', name: 'Professional Services', icon: '💼' },
  { id: 'health-beauty', name: 'Health & Beauty', icon: '💆' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'portfolio', name: 'Portfolio / Creative', icon: '🎨' },
  { id: 'banking', name: 'Finance / Banking', icon: '🏦' },
  { id: 'fitness', name: 'Fitness / Gym', icon: '💪' },
  { id: 'education', name: 'Education / Coaching', icon: '📚' },
  { id: 'medical', name: 'Medical / Healthcare', icon: '⚕️' },
  { id: 'tech-startup', name: 'Tech / Startup', icon: '🚀' },
  { id: 'construction', name: 'Construction', icon: '🏗️' },
  { id: 'nonprofit', name: 'Nonprofit / Charity', icon: '❤️' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
  { id: 'other', name: 'Other', icon: '✨' },
];

// Website goals with descriptions
const websiteGoals = [
  { id: 'leads', name: 'Generate Leads', desc: 'Get inquiries & contact form submissions', icon: '📩' },
  { id: 'bookings', name: 'Get Bookings', desc: 'Let customers schedule appointments', icon: '📅' },
  { id: 'sales', name: 'Sell Products', desc: 'Showcase products & drive purchases', icon: '💰' },
  { id: 'showcase', name: 'Showcase Work', desc: 'Display portfolio & attract clients', icon: '🖼️' },
  { id: 'inform', name: 'Inform & Educate', desc: 'Share information about services', icon: '📖' },
  { id: 'brand', name: 'Build Brand', desc: 'Establish online presence', icon: '⭐' },
];

// Enhanced styles with visual preview colors
const styles = [
  { id: 'modern', name: 'Modern & Clean', desc: 'Bold typography, clean lines, whitespace', icon: '◻️', gradient: 'from-blue-500 to-cyan-400' },
  { id: 'elegant', name: 'Elegant & Luxurious', desc: 'Refined, sophisticated, premium feel', icon: '✨', gradient: 'from-amber-500 to-yellow-400' },
  { id: 'bold', name: 'Bold & Dynamic', desc: 'High contrast, oversized text, energetic', icon: '🔥', gradient: 'from-red-500 to-orange-400' },
  { id: 'minimal', name: 'Minimal & Simple', desc: 'Maximum whitespace, essential only', icon: '○', gradient: 'from-gray-400 to-gray-500' },
  { id: 'playful', name: 'Playful & Fun', desc: 'Bright colors, rounded shapes, friendly', icon: '🎨', gradient: 'from-pink-500 to-purple-400' },
  { id: 'corporate', name: 'Corporate & Professional', desc: 'Traditional, trustworthy, structured', icon: '🏢', gradient: 'from-slate-600 to-slate-700' },
  { id: 'dark', name: 'Dark & Premium', desc: 'Dark backgrounds, glowing accents', icon: '🌙', gradient: 'from-violet-600 to-indigo-800' },
];

// Color palettes
const colorOptions = [
  { id: 'auto', name: 'AI Picks Best', desc: 'Based on your industry', colors: ['#6366F1', '#8B5CF6', '#A855F7'] },
  { id: 'blue', name: 'Professional Blues', desc: 'Trust & reliability', colors: ['#1E3A5F', '#3B82F6', '#60A5FA'] },
  { id: 'green', name: 'Natural Greens', desc: 'Growth & wellness', colors: ['#1B4332', '#22C55E', '#4ADE80'] },
  { id: 'red', name: 'Bold Reds', desc: 'Energy & passion', colors: ['#991B1B', '#EF4444', '#FCA5A5'] },
  { id: 'purple', name: 'Creative Purples', desc: 'Luxury & creativity', colors: ['#581C87', '#A855F7', '#D8B4FE'] },
  { id: 'orange', name: 'Warm Oranges', desc: 'Friendly & energetic', colors: ['#9A3412', '#F97316', '#FDBA74'] },
  { id: 'neutral', name: 'Elegant Neutrals', desc: 'Minimal & timeless', colors: ['#1F2937', '#6B7280', '#D1D5DB'] },
  { id: 'gold', name: 'Luxury Gold', desc: 'Premium & exclusive', colors: ['#78350F', '#D97706', '#FCD34D'] },
];

// Mood tags
const moodTags = [
  'Trustworthy', 'Innovative', 'Friendly', 'Luxurious', 
  'Professional', 'Creative', 'Warm', 'Bold', 'Calm',
  'Energetic', 'Sophisticated', 'Approachable', 'Modern',
  'Traditional', 'Fun', 'Serious', 'Inspiring', 'Edgy'
];

// Dynamic features based on industry
const featuresByIndustry: Record<string, string[]> = {
  'restaurant': ['Online Menu', 'Reservation Form', 'Photo Gallery', 'Customer Reviews', 'Location Map', 'Social Media Feed', 'Special Offers', 'Hours Display'],
  'local-services': ['Quote Request Form', 'Service Area Map', 'Before/After Gallery', 'Testimonials', 'FAQ Section', 'Emergency Contact', 'Trust Badges', 'Pricing Table'],
  'professional': ['Team Profiles', 'Case Studies', 'Client Logos', 'Testimonials', 'Contact Form', 'Blog Section', 'Service Descriptions', 'Credentials'],
  'health-beauty': ['Service Menu', 'Online Booking', 'Photo Gallery', 'Team Profiles', 'Testimonials', 'Gift Cards', 'Pricing Packages', 'Special Offers'],
  'real-estate': ['Property Listings', 'Search Filters', 'Agent Profile', 'Testimonials', 'Neighborhood Guide', 'Contact Form', 'Virtual Tour', 'Market Stats'],
  'ecommerce': ['Product Grid', 'Categories', 'Newsletter Signup', 'Customer Reviews', 'Instagram Feed', 'Sale Banner', 'Featured Products', 'Trust Badges'],
  'portfolio': ['Project Gallery', 'About Section', 'Services List', 'Testimonials', 'Contact Form', 'Resume/CV', 'Client List', 'Process Section'],
  'banking': ['Product Features', 'Security Badges', 'How It Works', 'FAQ Section', 'App Download', 'Calculator', 'Testimonials', 'Contact Form'],
  'fitness': ['Class Schedule', 'Membership Plans', 'Trainer Profiles', 'Testimonials', 'Photo Gallery', 'Contact Form', 'Free Trial CTA', 'Results Showcase'],
  'education': ['Course Catalog', 'Instructor Profiles', 'Testimonials', 'FAQ Section', 'Enrollment Form', 'Blog', 'Success Stories', 'Pricing'],
  'medical': ['Services List', 'Doctor Profiles', 'Patient Testimonials', 'Insurance Info', 'Appointment Booking', 'Contact', 'Location Map', 'FAQ'],
  'tech-startup': ['Feature Showcase', 'Pricing Table', 'Testimonials', 'FAQ Section', 'Newsletter', 'Demo Request', 'Integration Logos', 'Stats Counter'],
  'construction': ['Project Gallery', 'Services List', 'Testimonials', 'Contact Form', 'Quote Request', 'Team Section', 'Certifications', 'Service Areas'],
  'nonprofit': ['Mission Statement', 'Impact Stats', 'Donation Form', 'Volunteer Signup', 'Event Calendar', 'Success Stories', 'Team Section', 'Newsletter'],
  'automotive': ['Inventory Display', 'Service Menu', 'Contact Form', 'Testimonials', 'Financing Info', 'Location Map', 'Special Offers', 'About Section'],
  'other': ['Contact Form', 'About Section', 'Services', 'Testimonials', 'FAQ', 'Social Links', 'Newsletter', 'Gallery'],
};

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
    targetCustomer: '',
    style: '',
    colorPreference: 'auto',
    moodTags: [],
    inspirations: '',
    plan: 'professional',
    features: [],
    contactEmail: '',
    contactPhone: '',
    address: '',
    uniqueValue: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

  // Auto-select common features when industry changes
  useEffect(() => {
    if (formData.industry && formData.features.length === 0) {
      const industryFeatures = featuresByIndustry[formData.industry] || featuresByIndustry['other'];
      // Pre-select first 4 common features
      setFormData(prev => ({
        ...prev,
        features: industryFeatures.slice(0, 4)
      }));
    }
  }, [formData.industry]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
    // Pre-fill email if available
    if (user.email) {
      setFormData(prev => ({ ...prev, contactEmail: user.email || '' }));
    }
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

  const toggleMoodTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      moodTags: prev.moodTags.includes(tag)
        ? prev.moodTags.filter(t => t !== tag)
        : prev.moodTags.length < 3 
          ? [...prev.moodTags, tag]
          : prev.moodTags
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.businessName.trim() && formData.industry && formData.description.trim();
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
      const projectData: any = {
        customer_id: user.id,
        business_name: formData.businessName.trim(),
        industry: formData.industry,
        style: formData.style,
        plan: formData.plan,
        status: 'QUEUED',
        paid: false,
      };

      // Add all the enhanced fields
      if (formData.description.trim()) {
        projectData.description = formData.description.trim();
      }
      if (formData.websiteGoal) {
        projectData.website_goal = formData.websiteGoal;
      }
      if (formData.targetCustomer.trim()) {
        projectData.target_customer = formData.targetCustomer.trim();
      }
      if (formData.colorPreference) {
        projectData.color_preference = formData.colorPreference;
      }
      if (formData.moodTags.length > 0) {
        projectData.mood_tags = formData.moodTags;
      }
      if (formData.inspirations.trim()) {
        projectData.inspirations = formData.inspirations.trim();
      }
      if (formData.features.length > 0) {
        projectData.features = formData.features;
      }
      if (formData.contactEmail.trim()) {
        projectData.contact_email = formData.contactEmail.trim();
      }
      if (formData.contactPhone.trim()) {
        projectData.contact_phone = formData.contactPhone.trim();
      }
      if (formData.address.trim()) {
        projectData.address = formData.address.trim();
      }
      if (formData.uniqueValue.trim()) {
        projectData.unique_value = formData.uniqueValue.trim();
      }

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        alert(`Error: ${error.message}\n\nHint: You may need to add new columns to your projects table.`);
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

  // Get features for current industry
  const currentFeatures = featuresByIndustry[formData.industry] || featuresByIndustry['other'];

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
        
        .gradient-border {
          position: relative;
        }
        
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
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
          {/* Step Labels */}
          <div className="flex justify-between mt-3">
            {['Business', 'Style', 'Plan', 'Details'].map((label, i) => (
              <span 
                key={label} 
                className={`font-body text-xs ${step > i ? 'text-black font-medium' : step === i + 1 ? 'text-black' : 'text-neutral-400'}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* ============================================ */}
        {/* STEP 1: BUSINESS INFO */}
        {/* ============================================ */}
        {step === 1 && (
          <div className="slide-up">
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-3">
                Tell us about your business
              </h1>
              <p className="font-body text-lg text-neutral-500">
                This helps our AI create the perfect website for you
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
                  placeholder="e.g., Sunrise Bakery"
                  className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                />
              </div>

              {/* INDUSTRY - Visual Grid */}
              <div>
                <label className="block font-body text-sm font-medium text-black mb-3">
                  What industry are you in? *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {industries.map(ind => (
                    <button
                      key={ind.id}
                      onClick={() => updateForm('industry', ind.id)}
                      className={`p-3 rounded-xl font-body text-sm font-medium transition-all text-left ${
                        formData.industry === ind.id
                          ? 'bg-black text-white'
                          : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'
                      }`}
                    >
                      <span className="text-lg block mb-1">{ind.icon}</span>
                      <span className="text-xs leading-tight block">{ind.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  What does your business do? *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  placeholder="Tell us about your products, services, and what makes your business special..."
                  rows={3}
                  className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
                />
              </div>

              {/* WEBSITE GOAL */}
              <div>
                <label className="block font-body text-sm font-medium text-black mb-3">
                  What's the main goal of your website?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {websiteGoals.map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => updateForm('websiteGoal', goal.id)}
                      className={`p-3 rounded-xl font-body text-left transition-all ${
                        formData.websiteGoal === goal.id
                          ? 'bg-black text-white'
                          : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="text-lg block mb-1">{goal.icon}</span>
                      <span className="text-sm font-medium block">{goal.name}</span>
                      <span className={`text-xs block mt-0.5 ${formData.websiteGoal === goal.id ? 'text-white/70' : 'text-neutral-400'}`}>
                        {goal.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* TARGET CUSTOMER - THE MAGIC QUESTION */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <label className="block font-body text-sm font-medium text-amber-900 mb-2">
                  ✨ Describe your ideal customer in one sentence
                </label>
                <input
                  type="text"
                  value={formData.targetCustomer}
                  onChange={(e) => updateForm('targetCustomer', e.target.value)}
                  placeholder="e.g., Busy professionals who want healthy meals without cooking"
                  className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
                <p className="font-body text-xs text-amber-700 mt-2">
                  This helps us write copy that speaks directly to your audience
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 2: STYLE & VIBE */}
        {/* ============================================ */}
        {step === 2 && (
          <div className="slide-up">
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-3">
                Choose your style
              </h1>
              <p className="font-body text-lg text-neutral-500">
                What vibe should your website have?
              </p>
            </div>

            {/* STYLE SELECTION */}
            <div className="mb-10">
              <label className="block font-body text-sm font-medium text-black mb-4 text-center">
                Website Style *
              </label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {styles.map(style => (
                  <button
                    key={style.id}
                    onClick={() => updateForm('style', style.id)}
                    className={`card-hover rounded-2xl text-left transition-all overflow-hidden ${
                      formData.style === style.id
                        ? 'ring-2 ring-black ring-offset-2'
                        : 'border border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {/* Gradient Preview */}
                    <div className={`h-16 bg-gradient-to-br ${style.gradient}`}></div>
                    <div className="p-4 bg-white">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{style.icon}</span>
                        <h3 className="font-body font-semibold text-sm text-black">{style.name}</h3>
                      </div>
                      <p className="font-body text-xs text-neutral-500">{style.desc}</p>
                    </div>
                    {formData.style === style.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR PREFERENCE */}
            <div className="max-w-3xl mx-auto mb-10">
              <label className="block font-body text-sm font-medium text-black mb-4 text-center">
                Color Palette
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {colorOptions.map(color => (
                  <button
                    key={color.id}
                    onClick={() => updateForm('colorPreference', color.id)}
                    className={`p-3 rounded-xl transition-all ${
                      formData.colorPreference === color.id
                        ? 'bg-black text-white'
                        : 'bg-white border border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex gap-1 mb-2 justify-center">
                      {color.colors.map((c, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="font-body text-xs font-medium block">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* MOOD TAGS */}
            <div className="max-w-2xl mx-auto mb-10">
              <label className="block font-body text-sm font-medium text-black mb-2 text-center">
                How should your website feel? <span className="text-neutral-400 font-normal">(pick up to 3)</span>
              </label>
              <div className="flex flex-wrap gap-2 justify-center">
                {moodTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleMoodTag(tag)}
                    className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
                      formData.moodTags.includes(tag)
                        ? 'bg-black text-white'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {formData.moodTags.includes(tag) && '✓ '}{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* INSPIRATIONS */}
            <div className="max-w-xl mx-auto">
              <label className="block font-body text-sm font-medium text-black mb-2">
                Any websites you love? <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={formData.inspirations}
                onChange={(e) => updateForm('inspirations', e.target.value)}
                placeholder="Share links to websites that inspire you, e.g., apple.com, airbnb.com"
                rows={2}
                className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
              />
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 3: PLAN */}
        {/* ============================================ */}
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
                        <svg className={`w-4 h-4 flex-shrink-0 ${formData.plan === plan.id ? 'text-white' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                We'll design your website first. You only pay if you love it.
              </p>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 4: FEATURES & CONTACT */}
        {/* ============================================ */}
        {step === 4 && (
          <div className="slide-up">
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-3">
                Final details
              </h1>
              <p className="font-body text-lg text-neutral-500">
                Help us make your website perfect
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
              {/* FEATURES */}
              <div>
                <label className="block font-body text-sm font-medium text-black mb-3">
                  Select features for your website
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {currentFeatures.map(feature => (
                    <button
                      key={feature}
                      onClick={() => toggleFeature(feature)}
                      className={`p-3 rounded-xl font-body text-sm transition-all ${
                        formData.features.includes(feature)
                          ? 'bg-black text-white'
                          : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {formData.features.includes(feature) && (
                        <span className="mr-1">✓</span>
                      )}
                      {feature}
                    </button>
                  ))}
                </div>
              </div>

              {/* UNIQUE VALUE */}
              <div>
                <label className="block font-body text-sm font-medium text-black mb-2">
                  What makes you different from competitors?
                </label>
                <textarea
                  value={formData.uniqueValue}
                  onChange={(e) => updateForm('uniqueValue', e.target.value)}
                  placeholder="e.g., 20 years experience, family-owned, eco-friendly materials, fastest delivery..."
                  rows={2}
                  className="input-focus w-full px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
                />
              </div>

              {/* CONTACT INFORMATION */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
                <h3 className="font-body font-semibold text-black mb-4">Contact Information</h3>
                <p className="font-body text-sm text-neutral-500 mb-4">This will appear on your website</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block font-body text-sm text-neutral-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => updateForm('contactEmail', e.target.value)}
                      placeholder="hello@yourbusiness.com"
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-sm text-neutral-600 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => updateForm('contactPhone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm text-neutral-600 mb-1">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => updateForm('address', e.target.value)}
                        placeholder="City, State"
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="p-6 bg-white border border-neutral-200 rounded-3xl">
                <h3 className="font-display text-xl font-medium text-black mb-6">Project Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="font-body text-neutral-500">Business</span>
                    <span className="font-body font-medium text-black">{formData.businessName || '—'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="font-body text-neutral-500">Industry</span>
                    <span className="font-body font-medium text-black">
                      {industries.find(i => i.id === formData.industry)?.name || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="font-body text-neutral-500">Style</span>
                    <span className="font-body font-medium text-black">
                      {styles.find(s => s.id === formData.style)?.name || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="font-body text-neutral-500">Colors</span>
                    <span className="font-body font-medium text-black">
                      {colorOptions.find(c => c.id === formData.colorPreference)?.name || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="font-body text-neutral-500">Plan</span>
                    <span className="font-body font-medium text-black">
                      {plans.find(p => p.id === formData.plan)?.name} — ${plans.find(p => p.id === formData.plan)?.price}
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
