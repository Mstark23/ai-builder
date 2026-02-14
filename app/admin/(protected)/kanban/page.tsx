'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// ═══════════════════════════════════════
// INDUSTRY CONFIGS — pages, features, addons per industry
// ═══════════════════════════════════════
type IndustryConfig = {
  icon: string;
  pre_pages: string[];
  extra_pages: string[];
  pre_features: string[];
  extra_features: string[];
  pre_addons: string[];
  extra_addons: string[];
};

const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  'restaurant': { icon: '🍽️',
    pre_pages: ['Home', 'Menu', 'About', 'Contact'], extra_pages: ['Gallery', 'Events', 'Catering', 'Reservations', 'Reviews'],
    pre_features: ['Online Ordering', 'Reservation Widget', 'Menu Display', 'Contact Form', 'Google Maps'], extra_features: ['Delivery Tracking', 'Gift Cards', 'Loyalty Program', 'Event Booking', 'Multi-Location'],
    pre_addons: ['Google Business', 'Custom Domain'], extra_addons: ['SEO Setup', 'Hosting', 'Food Photography', 'Social Media Kit', 'Logo Design'] },
  'beauty': { icon: '💇',
    pre_pages: ['Home', 'Services', 'Gallery', 'Contact'], extra_pages: ['About', 'Team', 'Pricing', 'Reviews', 'Blog'],
    pre_features: ['Online Booking', 'Service Menu', 'Contact Form', 'Before & After Gallery', 'Reviews Widget'], extra_features: ['Gift Cards', 'Loyalty Program', 'Multi-Stylist Calendar', 'Product Sales', 'Membership'],
    pre_addons: ['Google Business', 'Custom Domain'], extra_addons: ['SEO Setup', 'Hosting', 'Photo Shoot', 'Social Media Kit', 'Logo Design'] },
  'fitness': { icon: '💪',
    pre_pages: ['Home', 'Programs', 'Schedule', 'Contact'], extra_pages: ['About', 'Trainers', 'Pricing', 'Gallery', 'Blog', 'Membership'],
    pre_features: ['Class Schedule', 'Membership Signup', 'Contact Form', 'Trainer Profiles', 'Trial Booking'], extra_features: ['Online Payments', 'Workout Videos', 'Nutrition Plans', 'Progress Tracking', 'App Integration'],
    pre_addons: ['Google Business', 'Custom Domain'], extra_addons: ['SEO Setup', 'Hosting', 'Photo Shoot', 'Social Media Kit', 'Logo Design'] },
  'home-services': { icon: '🔧',
    pre_pages: ['Home', 'Services', 'Contact', 'Free Estimate'], extra_pages: ['About', 'Gallery', 'Service Areas', 'Reviews', 'FAQ', 'Blog'],
    pre_features: ['Free Estimate Form', 'Click-to-Call', 'Service Areas Map', 'Contact Form', 'Reviews Widget'], extra_features: ['Online Booking', 'Before & After Gallery', 'Emergency Service', 'Financing Calculator', 'License Display'],
    pre_addons: ['Google Business', 'Custom Domain', 'SEO Setup'], extra_addons: ['Hosting', 'Photo Shoot', 'Vehicle Wraps Design', 'Logo Design', 'Social Media Kit'] },
  'marine': { icon: '🛥️',
    pre_pages: ['Home', 'Services', 'Before & After', 'Free Estimate', 'Contact'], extra_pages: ['About', 'Gallery', 'Reviews', 'FAQ', 'Blog'],
    pre_features: ['Before & After Slider', 'Free Estimate Form', 'Click-to-Call', 'Reviews Widget', 'Certification Badges', 'Contact Form'], extra_features: ['Online Booking', 'Service Tracker', 'Product Sales', 'Multi-Location'],
    pre_addons: ['Google Business', 'Custom Domain', 'SEO Setup'], extra_addons: ['Hosting', 'Photo Shoot', 'Logo Design', 'Social Media Kit'] },
  'real-estate': { icon: '🏠',
    pre_pages: ['Home', 'Properties', 'About', 'Contact'], extra_pages: ['Sellers', 'Buyers', 'Blog', 'Neighborhoods', 'Reviews', 'Resources'],
    pre_features: ['Property Listings', 'Search & Filter', 'Contact Form', 'Virtual Tours', 'Lead Capture'], extra_features: ['Mortgage Calculator', 'CRM Integration', 'MLS Feed', 'Agent Profiles', 'Market Reports'],
    pre_addons: ['Custom Domain', 'SEO Setup'], extra_addons: ['Google Business', 'Hosting', 'Drone Photography', 'Logo Design', 'Social Media Kit'] },
  'ecommerce': { icon: '🛍️',
    pre_pages: ['Home', 'Shop', 'About', 'Contact'], extra_pages: ['FAQ', 'Blog', 'Size Guide', 'Lookbook', 'Reviews'],
    pre_features: ['Product Catalog', 'Shopping Cart', 'Secure Checkout', 'Order Tracking', 'Contact Form'], extra_features: ['Wishlist', 'Reviews & Ratings', 'Discount Codes', 'Inventory Management', 'Email Marketing'],
    pre_addons: ['Custom Domain', 'Hosting', 'SEO Setup'], extra_addons: ['Google Business', 'Product Photography', 'Logo Design', 'Social Media Kit', 'Email Setup'] },
  'medical': { icon: '🏥',
    pre_pages: ['Home', 'Services', 'About', 'Contact'], extra_pages: ['Team', 'Patient Resources', 'FAQ', 'Insurance', 'Blog', 'Reviews'],
    pre_features: ['Appointment Booking', 'Contact Form', 'Provider Profiles', 'Insurance List', 'Patient Portal Link'], extra_features: ['Telehealth Integration', 'Forms Download', 'Multi-Location', 'HIPAA Compliance Badge', 'Reviews Widget'],
    pre_addons: ['Custom Domain', 'SEO Setup'], extra_addons: ['Google Business', 'Hosting', 'Logo Design', 'Photo Shoot', 'Social Media Kit'] },
  'legal': { icon: '⚖️',
    pre_pages: ['Home', 'Practice Areas', 'About', 'Contact'], extra_pages: ['Team', 'Case Results', 'Blog', 'FAQ', 'Reviews', 'Resources'],
    pre_features: ['Free Consultation Form', 'Click-to-Call', 'Contact Form', 'Practice Area Pages', 'Attorney Profiles'], extra_features: ['Client Portal', 'Case Results Display', 'Live Chat', 'Intake Forms', 'Reviews Widget'],
    pre_addons: ['Custom Domain', 'SEO Setup'], extra_addons: ['Google Business', 'Hosting', 'Logo Design', 'Photo Shoot', 'Social Media Kit'] },
  'education': { icon: '📚',
    pre_pages: ['Home', 'Programs', 'About', 'Contact'], extra_pages: ['Faculty', 'Admissions', 'Gallery', 'Blog', 'FAQ', 'Events'],
    pre_features: ['Program Listings', 'Enrollment Form', 'Contact Form', 'Calendar', 'Faculty Profiles'], extra_features: ['Online Courses', 'Student Portal', 'Payment Integration', 'Testimonials', 'Newsletter Signup'],
    pre_addons: ['Custom Domain'], extra_addons: ['SEO Setup', 'Google Business', 'Hosting', 'Logo Design', 'Photo Shoot'] },
  'creative': { icon: '🎨',
    pre_pages: ['Home', 'Portfolio', 'About', 'Contact'], extra_pages: ['Services', 'Blog', 'Testimonials', 'Press', 'Shop'],
    pre_features: ['Portfolio Gallery', 'Lightbox Display', 'Contact Form', 'Social Links', 'Bio Section'], extra_features: ['Client Portal', 'Booking Calendar', 'Print Shop', 'Video Reel', 'Newsletter'],
    pre_addons: ['Custom Domain'], extra_addons: ['SEO Setup', 'Hosting', 'Logo Design', 'Social Media Kit'] },
  'construction': { icon: '🏗️',
    pre_pages: ['Home', 'Services', 'Projects', 'Contact'], extra_pages: ['About', 'Team', 'Reviews', 'FAQ', 'Blog', 'Careers'],
    pre_features: ['Project Gallery', 'Free Quote Form', 'Click-to-Call', 'Service Areas', 'Contact Form'], extra_features: ['Before & After', 'License Display', 'Financing Info', 'Video Tours', 'Reviews Widget'],
    pre_addons: ['Google Business', 'Custom Domain', 'SEO Setup'], extra_addons: ['Hosting', 'Drone Photography', 'Logo Design', 'Social Media Kit'] },
  'tech': { icon: '💻',
    pre_pages: ['Home', 'Features', 'Pricing', 'Contact'], extra_pages: ['About', 'Blog', 'Docs', 'Careers', 'Case Studies', 'Integrations'],
    pre_features: ['Feature Showcase', 'Pricing Table', 'Contact Form', 'Demo Request', 'Newsletter'], extra_features: ['Live Chat', 'Knowledge Base', 'API Docs', 'Status Page', 'Changelog'],
    pre_addons: ['Custom Domain', 'Hosting'], extra_addons: ['SEO Setup', 'Google Analytics', 'Logo Design', 'Social Media Kit'] },
  'events': { icon: '🎉',
    pre_pages: ['Home', 'Services', 'Gallery', 'Contact'], extra_pages: ['About', 'Pricing', 'Reviews', 'Blog', 'FAQ'],
    pre_features: ['Event Gallery', 'Quote Request', 'Contact Form', 'Calendar', 'Package Display'], extra_features: ['Online Booking', 'Payment Integration', 'Vendor List', 'Virtual Tours', 'Reviews Widget'],
    pre_addons: ['Custom Domain'], extra_addons: ['SEO Setup', 'Google Business', 'Hosting', 'Photo Shoot', 'Logo Design'] },
  'nonprofit': { icon: '💚',
    pre_pages: ['Home', 'Mission', 'Programs', 'Contact'], extra_pages: ['Team', 'Events', 'Blog', 'Gallery', 'Volunteer', 'Impact'],
    pre_features: ['Donation Button', 'Volunteer Signup', 'Contact Form', 'Newsletter', 'Impact Counter'], extra_features: ['Event Calendar', 'Member Portal', 'Annual Report', 'Fundraising Tracker', 'Social Feed'],
    pre_addons: ['Custom Domain'], extra_addons: ['SEO Setup', 'Google Business', 'Hosting', 'Logo Design', 'Email Setup'] },
  'automotive': { icon: '🚗',
    pre_pages: ['Home', 'Services', 'Contact', 'Free Estimate'], extra_pages: ['About', 'Gallery', 'Reviews', 'FAQ', 'Blog', 'Specials'],
    pre_features: ['Service Menu', 'Online Booking', 'Click-to-Call', 'Contact Form', 'Reviews Widget'], extra_features: ['Price Calculator', 'Before & After', 'Loyalty Program', 'Multi-Location', 'Gift Cards'],
    pre_addons: ['Google Business', 'Custom Domain'], extra_addons: ['SEO Setup', 'Hosting', 'Photo Shoot', 'Logo Design', 'Social Media Kit'] },
  'pet': { icon: '🐾',
    pre_pages: ['Home', 'Services', 'About', 'Contact'], extra_pages: ['Gallery', 'Pricing', 'Reviews', 'FAQ', 'Blog', 'Team'],
    pre_features: ['Online Booking', 'Service List', 'Contact Form', 'Pet Gallery', 'Reviews Widget'], extra_features: ['Client Portal', 'Vaccination Records', 'Loyalty Program', 'Product Sales', 'Live Webcam'],
    pre_addons: ['Google Business', 'Custom Domain'], extra_addons: ['SEO Setup', 'Hosting', 'Photo Shoot', 'Logo Design', 'Social Media Kit'] },
};

// Fallback config for unknown industries
const DEFAULT_CONFIG: IndustryConfig = {
  icon: '🌐',
  pre_pages: ['Home', 'About', 'Services', 'Contact'],
  extra_pages: ['Gallery', 'Blog', 'FAQ', 'Reviews', 'Pricing'],
  pre_features: ['Contact Form', 'Click-to-Call', 'Google Maps', 'Social Links'],
  extra_features: ['Online Booking', 'Reviews Widget', 'Newsletter', 'Live Chat', 'Search'],
  pre_addons: ['Custom Domain'],
  extra_addons: ['SEO Setup', 'Google Business', 'Hosting', 'Logo Design', 'Social Media Kit'],
};

const TIMELINES = ['ASAP (Rush)', '1–2 Weeks', '2–4 Weeks', '1–2 Months', 'No Rush'];
const BUDGETS = ['Under $300', '$300–$500', '$500–$1,000', '$1,000–$2,000', '$2,000+'];

// ═══════════════════════════════════════
// NEEDS FORM COMPONENT
// ═══════════════════════════════════════
export default function NeedsFormPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => { if (projectId) loadProject(); }, [projectId]);

  const loadProject = async () => {
    try {
      const res = await fetch(`/api/preview/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
        // Auto-detect industry config and pre-select essentials
        const ind = detectIndustryKey(data.project.industry || '');
        const config = INDUSTRY_CONFIGS[ind] || DEFAULT_CONFIG;
        setSelectedPages([...config.pre_pages]);
        setSelectedFeatures([...config.pre_features]);
        setSelectedAddons([...config.pre_addons]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const detectIndustryKey = (industry: string): string => {
    const lower = industry.toLowerCase();
    if (lower.includes('restaurant') || lower.includes('food') || lower.includes('cafe') || lower.includes('bar')) return 'restaurant';
    if (lower.includes('beauty') || lower.includes('salon') || lower.includes('nail') || lower.includes('hair') || lower.includes('spa') || lower.includes('barber')) return 'beauty';
    if (lower.includes('fitness') || lower.includes('gym') || lower.includes('yoga') || lower.includes('personal train')) return 'fitness';
    if (lower.includes('plumb') || lower.includes('hvac') || lower.includes('electric') || lower.includes('clean') || lower.includes('landscap') || lower.includes('home service') || lower.includes('local service') || lower.includes('handyman') || lower.includes('roofing') || lower.includes('pest')) return 'home-services';
    if (lower.includes('marine') || lower.includes('boat') || lower.includes('gelcoat')) return 'marine';
    if (lower.includes('real estate') || lower.includes('property') || lower.includes('realtor') || lower.includes('cash home')) return 'real-estate';
    if (lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('shop') || lower.includes('retail') || lower.includes('store') || lower.includes('jewel')) return 'ecommerce';
    if (lower.includes('medical') || lower.includes('dental') || lower.includes('doctor') || lower.includes('health') || lower.includes('clinic') || lower.includes('therap')) return 'medical';
    if (lower.includes('legal') || lower.includes('law') || lower.includes('attorney') || lower.includes('lawyer')) return 'legal';
    if (lower.includes('edu') || lower.includes('school') || lower.includes('tutor') || lower.includes('academ')) return 'education';
    if (lower.includes('creative') || lower.includes('portfolio') || lower.includes('photo') || lower.includes('design') || lower.includes('art') || lower.includes('animation') || lower.includes('film')) return 'creative';
    if (lower.includes('construct') || lower.includes('reno') || lower.includes('contractor') || lower.includes('build')) return 'construction';
    if (lower.includes('tech') || lower.includes('saas') || lower.includes('software') || lower.includes('startup') || lower.includes('app') || lower.includes('it ')) return 'tech';
    if (lower.includes('event') || lower.includes('wedding') || lower.includes('catering') || lower.includes('party')) return 'events';
    if (lower.includes('nonprofit') || lower.includes('non-profit') || lower.includes('charity') || lower.includes('foundation')) return 'nonprofit';
    if (lower.includes('auto') || lower.includes('car') || lower.includes('detailing') || lower.includes('mechanic') || lower.includes('tire') || lower.includes('body shop')) return 'automotive';
    if (lower.includes('pet') || lower.includes('vet') || lower.includes('groom') || lower.includes('kennel') || lower.includes('dog') || lower.includes('cat')) return 'pet';
    return '';
  };

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/needs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, pages: selectedPages, features: selectedFeatures, addons: selectedAddons, timeline, budget, notes }),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap'); .font-display{font-family:'Playfair Display',serif} .font-body{font-family:'Inter',sans-serif}`}</style>
        <div className="w-10 h-10 border-2 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
        <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap'); .font-display{font-family:'Playfair Display',serif} .font-body{font-family:'Inter',sans-serif}`}</style>
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 max-w-md text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✅</div>
          <h1 className="font-display text-3xl font-medium text-black mb-3">You're All Set!</h1>
          <p className="font-body text-neutral-500 mb-2">We've received your preferences for <strong className="text-black">{project?.business_name}</strong>.</p>
          <p className="font-body text-neutral-400 text-sm">Our team will review your needs and send you a custom quote shortly via text.</p>
          <div className="mt-8 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <p className="font-body text-xs text-neutral-400">Summary</p>
            <p className="font-body text-sm text-black font-medium mt-1">{selectedPages.length} pages · {selectedFeatures.length} features · {selectedAddons.length} add-ons</p>
            {timeline && <p className="font-body text-xs text-neutral-500 mt-1">Timeline: {timeline}</p>}
          </div>
        </div>
      </div>
    );
  }

  const ind = detectIndustryKey(project?.industry || '');
  const config = INDUSTRY_CONFIGS[ind] || DEFAULT_CONFIG;
  const allPages = [...new Set([...config.pre_pages, ...config.extra_pages])];
  const allFeatures = [...new Set([...config.pre_features, ...config.extra_features])];
  const allAddons = [...new Set([...config.pre_addons, ...config.extra_addons])];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap'); .font-display{font-family:'Playfair Display',serif} .font-body{font-family:'Inter',sans-serif}`}</style>

      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-black text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-display font-semibold text-sm">V</span>
          </div>
          <span className="font-body text-sm text-white/60">Tell us what you need for <strong className="text-white">{project?.business_name}</strong></span>
        </div>
        <div className="font-body text-xs text-white/40">Step 2 of 2</div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">{config.icon}</div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-black mb-2">What Do You Need?</h1>
          <p className="font-body text-neutral-500">We've pre-selected the essentials for your industry. Add or remove anything.</p>
        </div>

        {/* ── PAGES ── */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-body font-semibold text-black">Pages</h2>
            <span className="font-body text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">{selectedPages.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allPages.map(page => (
              <button
                key={page}
                onClick={() => toggleItem(selectedPages, setSelectedPages, page)}
                className={`px-4 py-2 rounded-xl text-sm font-medium font-body border transition-all ${
                  selectedPages.includes(page)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-body font-semibold text-black">Features</h2>
            <span className="font-body text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">{selectedFeatures.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allFeatures.map(feat => (
              <button
                key={feat}
                onClick={() => toggleItem(selectedFeatures, setSelectedFeatures, feat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium font-body border transition-all ${
                  selectedFeatures.includes(feat)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {feat}
              </button>
            ))}
          </div>
        </div>

        {/* ── ADD-ONS ── */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-body font-semibold text-black">Add-Ons</h2>
            <span className="font-body text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">{selectedAddons.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allAddons.map(addon => (
              <button
                key={addon}
                onClick={() => toggleItem(selectedAddons, setSelectedAddons, addon)}
                className={`px-4 py-2 rounded-xl text-sm font-medium font-body border transition-all ${
                  selectedAddons.includes(addon)
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {addon}
              </button>
            ))}
          </div>
        </div>

        {/* ── TIMELINE & BUDGET ── */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h2 className="font-body font-semibold text-black mb-4">Timeline</h2>
            <div className="space-y-2">
              {TIMELINES.map(t => (
                <button
                  key={t}
                  onClick={() => setTimeline(t)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-body border transition-all ${
                    timeline === t ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h2 className="font-body font-semibold text-black mb-4">Budget</h2>
            <div className="space-y-2">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-body border transition-all ${
                    budget === b ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── NOTES ── */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
          <h2 className="font-body font-semibold text-black mb-4">Anything Else?</h2>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Tell us about any specific requirements, inspiration sites, or special requests..."
            className="w-full h-24 p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-body resize-none outline-none focus:border-black transition-colors"
          />
        </div>

        {/* ── SUBMIT ── */}
        <div className="text-center pb-12">
          <button
            onClick={handleSubmit}
            disabled={submitting || selectedPages.length === 0}
            className="px-10 py-4 bg-black text-white rounded-full text-sm font-semibold font-body hover:bg-black/80 disabled:opacity-50 transition-all shadow-lg shadow-black/20"
          >
            {submitting ? 'Submitting...' : `Submit Needs (${selectedPages.length} pages, ${selectedFeatures.length} features, ${selectedAddons.length} add-ons)`}
          </button>
          <p className="font-body text-xs text-neutral-400 mt-4">We'll send you a custom quote based on your selections</p>
        </div>
      </div>
    </div>
  );
}
