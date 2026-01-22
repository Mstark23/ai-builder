'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Customer = {
  id: string;
  name: string;
  email: string;
  business_name: string;
};

type Project = {
  id: string;
  business_name: string;
  status: string;
  plan: string;
  industry?: string;
  paid: boolean;
  live_url?: string;
};

// Growth Services Data
const growthServices = [
  {
    id: 'seo',
    name: 'SEO & Local Search',
    description: 'Get found on Google. We optimize your site and Google Business Profile to rank higher in local searches.',
    icon: '🔍',
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
    price: '$99/mo',
    priceNote: 'or $199 one-time setup',
    features: ['Google Business Profile optimization', 'Local keyword targeting', 'Monthly ranking reports', 'Schema markup setup'],
    recommended: true,
    href: '/portal/growth/seo',
    status: 'available',
  },
  {
    id: 'reviews',
    name: 'Reviews & Reputation',
    description: 'Build trust with automated review requests and easy reputation management across all platforms.',
    icon: '⭐',
    color: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100',
    price: '$49/mo',
    features: ['Automated review requests', 'Multi-platform monitoring', 'Review response templates', 'Reputation dashboard'],
    href: '/portal/growth/reviews',
    status: 'available',
  },
  {
    id: 'ads',
    name: 'Google Ads',
    description: 'Drive targeted traffic with professionally managed Google Ads campaigns that convert.',
    icon: '📢',
    color: 'bg-red-50 border-red-200',
    iconBg: 'bg-red-100',
    price: '$199/mo',
    priceNote: '+ ad spend',
    features: ['Campaign setup & management', 'Keyword research', 'Ad copywriting', 'Monthly performance reports'],
    href: '/portal/growth/ads',
    status: 'available',
  },
  {
    id: 'email',
    name: 'Email Marketing',
    description: 'Stay connected with your customers through automated emails that drive repeat business.',
    icon: '✉️',
    color: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-100',
    price: '$79/mo',
    features: ['Email template design', 'Automated sequences', 'Newsletter campaigns', 'Performance analytics'],
    href: '/portal/growth/email',
    status: 'available',
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Professional social media setup and management to build your brand presence online.',
    icon: '🌐',
    color: 'bg-pink-50 border-pink-200',
    iconBg: 'bg-pink-100',
    price: '$149/mo',
    features: ['Profile optimization', 'Content calendar', '3 posts per week', 'Engagement management'],
    href: '/portal/growth/social',
    status: 'available',
  },
  {
    id: 'chatbot',
    name: 'AI Chatbot',
    description: '24/7 lead capture with an intelligent chatbot that answers questions and books appointments.',
    icon: '🤖',
    color: 'bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-100',
    price: '$99/mo',
    features: ['Custom trained on your business', '24/7 availability', 'Lead capture & notifications', 'Appointment booking'],
    href: '/portal/growth/chatbot',
    status: 'coming_soon',
  },
];

// Growth Bundles
const growthBundles = [
  {
    id: 'starter',
    name: 'Starter Growth',
    description: 'Essential tools to maintain your online presence',
    price: 99,
    features: [
      'Website hosting & maintenance',
      'Monthly analytics report',
      'Google Business Profile setup',
      '2 content updates/month',
      'Email support',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Growth Pro',
    description: 'Everything you need to grow your customer base',
    price: 249,
    features: [
      'Everything in Starter',
      'Local SEO management',
      'Review management system',
      'Email marketing (1,000 contacts)',
      'Monthly strategy call',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'partner',
    name: 'Growth Partner',
    description: 'Full-service digital marketing partnership',
    price: 499,
    features: [
      'Everything in Pro',
      'Google Ads management',
      'Social media management',
      'Unlimited content updates',
      'Dedicated growth manager',
      'Weekly check-ins',
    ],
    popular: false,
  },
];

export default function GrowthDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [paidProjects, setPaidProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [businessScore] = useState(45);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
    await loadData(user.id);
  };

  const loadData = async (userId: string) => {
    try {
      // Load customer
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (customerData) {
        setCustomer(customerData);
      }

      // Load projects that are PAID or DELIVERED (user has purchased)
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', userId)
        .or('paid.eq.true,status.eq.DELIVERED')
        .order('created_at', { ascending: false });

      if (projectsData && projectsData.length > 0) {
        setPaidProjects(projectsData);
        setSelectedProject(projectsData[0]);
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // LOCKED STATE - No paid projects
  // ============================================
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#fafafa] antialiased">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
          .font-display { font-family: 'Playfair Display', Georgia, serif; }
          .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        `}</style>

        {/* HEADER */}
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
                  <span className="text-white font-display text-lg font-semibold">V</span>
                </div>
                <span className="font-body text-black font-semibold tracking-wide hidden sm:block">VERKTORLABS</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                <Link href="/portal" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/portal/growth" className="px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium">
                  🚀 Growth
                </Link>
                <Link href="/portal/messages" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                  Messages
                </Link>
                <Link href="/portal/billing" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                  Billing
                </Link>
                <Link href="/portal/settings" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                  Settings
                </Link>
              </nav>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-body text-sm font-medium">
                      {customer?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* LOCKED CONTENT */}
        <main className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-medium text-black mb-4">
              Unlock Growth Tools
            </h1>
            <p className="font-body text-lg text-neutral-500 mb-4 max-w-lg mx-auto">
              Complete your website purchase to access powerful growth tools that will help you get more customers, reviews, and sales.
            </p>
            <p className="font-body text-sm text-neutral-400 mb-8">
              Growth tools become available after you approve and pay for your website preview.
            </p>

            {/* PREVIEW OF WHAT THEY'LL GET */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 mb-8 text-left max-w-2xl mx-auto">
              <h3 className="font-body font-semibold text-black mb-4">What you will unlock:</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: '🔍', name: 'SEO & Local Search', desc: 'Rank higher on Google' },
                  { icon: '⭐', name: 'Review Management', desc: 'Get more 5-star reviews' },
                  { icon: '📢', name: 'Google Ads', desc: 'Drive targeted traffic' },
                  { icon: '✉️', name: 'Email Marketing', desc: 'Stay connected with customers' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-body text-sm font-medium text-black">{item.name}</p>
                      <p className="font-body text-xs text-neutral-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/portal"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all"
            >
              <span>View Your Projects</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // UNLOCKED STATE - Has paid projects
  // ============================================
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
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
                <span className="text-white font-display text-lg font-semibold">V</span>
              </div>
              <span className="font-body text-black font-semibold tracking-wide hidden sm:block">VERKTORLABS</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/portal" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/portal/growth" className="px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium">
                🚀 Growth
              </Link>
              <Link href="/portal/messages" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                Messages
              </Link>
              <Link href="/portal/billing" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                Billing
              </Link>
              <Link href="/portal/settings" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                Settings
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-body text-sm font-medium">
                    {customer?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="font-body text-sm font-medium text-black">{customer?.name || 'User'}</p>
                  <p className="font-body text-xs text-neutral-500">{user?.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE NAV */}
      <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 sticky top-20 z-30">
        <div className="flex gap-2 overflow-x-auto">
          <Link href="/portal" className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full font-body text-sm font-medium whitespace-nowrap">
            Dashboard
          </Link>
          <Link href="/portal/growth" className="px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium whitespace-nowrap">
            🚀 Growth
          </Link>
          <Link href="/portal/messages" className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full font-body text-sm font-medium whitespace-nowrap">
            Messages
          </Link>
          <Link href="/portal/billing" className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full font-body text-sm font-medium whitespace-nowrap">
            Billing
          </Link>
          <Link href="/portal/settings" className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full font-body text-sm font-medium whitespace-nowrap">
            Settings
          </Link>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🚀</span>
            <span className="font-body text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Growth Tools
            </span>
          </div>
          <h1 className="font-display text-4xl font-medium text-black mb-2">
            Grow Your Business
          </h1>
          <p className="font-body text-neutral-500 text-lg">
            Powerful tools to get more customers, more reviews, and more sales.
          </p>
        </div>

        {/* PROJECT SELECTOR */}
        {paidProjects.length > 1 && (
          <div className="mb-8">
            <label className="font-body text-sm text-neutral-500 mb-2 block">Select Website</label>
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => setSelectedProject(paidProjects.find(p => p.id === e.target.value) || null)}
              className="px-4 py-3 bg-white border border-neutral-200 rounded-xl font-body text-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              {paidProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.business_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* BUSINESS HEALTH SCORE */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 mb-10">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* SCORE */}
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke={businessScore > 70 ? '#10b981' : businessScore > 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${businessScore * 3.02} 302`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-3xl font-semibold text-black">{businessScore}</span>
                </div>
              </div>
              <div>
                <p className="font-body text-sm text-neutral-500 mb-1">Business Health Score</p>
                <p className="font-body font-semibold text-black text-lg">
                  {businessScore > 70 ? 'Great!' : businessScore > 40 ? 'Good Start' : 'Needs Work'}
                </p>
                <p className="font-body text-sm text-neutral-400">
                  {100 - businessScore} points to improve
                </p>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="font-body text-xs font-medium">+12%</span>
                </div>
                <p className="font-display text-2xl font-semibold text-black">247</p>
                <p className="font-body text-xs text-neutral-500">Monthly Visitors</p>
              </div>
              <div className="bg-neutral-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  <span className="text-sm">⭐</span>
                  <span className="font-body text-xs font-medium">4.2</span>
                </div>
                <p className="font-display text-2xl font-semibold text-black">8</p>
                <p className="font-body text-xs text-neutral-500">Google Reviews</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center lg:text-right">
              <p className="font-body text-sm text-neutral-500 mb-3">
                Boost your score with these tools 👇
              </p>
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all"
              >
                <span>View Recommendations</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* RECOMMENDED FOR YOU */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <h2 className="font-display text-2xl font-medium text-black">Recommended for You</h2>
              <p className="font-body text-sm text-neutral-500">Based on your business type</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {growthServices.filter(s => s.status === 'available').slice(0, 3).map((service, index) => (
              <div
                key={service.id}
                className={`bg-white rounded-2xl border-2 ${service.color} p-6 card-hover relative`}
              >
                {index === 0 && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-emerald-500 text-white font-body text-xs font-medium rounded-full">
                      Top Pick
                    </span>
                  </div>
                )}
                <div className={`w-12 h-12 ${service.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <h3 className="font-body font-semibold text-black text-lg mb-2">{service.name}</h3>
                <p className="font-body text-sm text-neutral-500 mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display text-xl font-semibold text-black">{service.price}</span>
                    {service.priceNote && (
                      <p className="font-body text-xs text-neutral-400">{service.priceNote}</p>
                    )}
                  </div>
                  <Link
                    href={service.href}
                    className="px-4 py-2 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALL SERVICES */}
        <div id="services" className="mb-10">
          <h2 className="font-display text-2xl font-medium text-black mb-6">All Growth Services</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {growthServices.map((service) => (
              <div
                key={service.id}
                className={`bg-white rounded-2xl border border-neutral-200 p-6 card-hover ${
                  service.status === 'coming_soon' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${service.iconBg} rounded-xl flex items-center justify-center`}>
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  {service.status === 'coming_soon' && (
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-500 font-body text-xs font-medium rounded-full">
                      Coming Soon
                    </span>
                  )}
                  {service.recommended && service.status !== 'coming_soon' && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-body text-xs font-medium rounded-full">
                      Recommended
                    </span>
                  )}
                </div>

                <h3 className="font-body font-semibold text-black text-lg mb-2">{service.name}</h3>
                <p className="font-body text-sm text-neutral-500 mb-4">{service.description}</p>

                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 font-body text-sm text-neutral-600">
                      <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div>
                    <span className="font-display text-xl font-semibold text-black">{service.price}</span>
                    {service.priceNote && (
                      <p className="font-body text-xs text-neutral-400">{service.priceNote}</p>
                    )}
                  </div>
                  {service.status === 'coming_soon' ? (
                    <button disabled className="px-4 py-2 bg-neutral-100 text-neutral-400 font-body text-sm font-medium rounded-full cursor-not-allowed">
                      Notify Me
                    </button>
                  ) : (
                    <Link
                      href={service.href}
                      className="px-4 py-2 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-all flex items-center gap-2"
                    >
                      <span>Learn More</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BUNDLES */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-medium text-black mb-2">Save with Growth Bundles</h2>
            <p className="font-body text-neutral-500">Get everything you need at a discounted price</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {growthBundles.map((bundle) => (
              <div
                key={bundle.id}
                className={`bg-white rounded-3xl border-2 p-8 relative ${
                  bundle.popular ? 'border-black lg:scale-105 shadow-xl' : 'border-neutral-200'
                }`}
              >
                {bundle.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-black text-white font-body text-xs font-semibold rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-2xl font-medium text-black mb-2">{bundle.name}</h3>
                  <p className="font-body text-sm text-neutral-500">{bundle.description}</p>
                </div>

                <div className="mb-6">
                  <span className="font-display text-4xl font-semibold text-black">${bundle.price}</span>
                  <span className="font-body text-neutral-500">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {bundle.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 font-body text-sm text-neutral-600">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 font-body font-medium rounded-full transition-all ${
                    bundle.popular
                      ? 'bg-black text-white hover:bg-black/80'
                      : 'border-2 border-black text-black hover:bg-black hover:text-white'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="bg-black rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 max-w-2xl">
            <h2 className="font-display text-3xl lg:text-4xl font-medium mb-4">
              Not sure where to start?
            </h2>
            <p className="font-body text-white/70 text-lg mb-8">
              Book a free 15-minute strategy call with our growth experts. We will analyze your business 
              and recommend the best tools to help you grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body font-medium rounded-full hover:bg-white/90 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span>Book Free Consultation</span>
              </button>
              <Link
                href="/portal/messages"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-body font-medium rounded-full hover:bg-white/10 transition-all"
              >
                <span>Chat with Us</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-neutral-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-neutral-500">
              © 2024 Verktorlabs. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">
                Terms
              </Link>
              <a href="mailto:support@verktorlabs.com" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
