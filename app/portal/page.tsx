// /app/portal/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Project = {
  id: string;
  business_name: string;
  status: string;
  plan: string;
  paid: boolean;
  created_at: string;
  preview_url: string | null;
};

type Activity = {
  id: string;
  type: string;
  message: string;
  created_at: string;
  project_name?: string;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  business_name: string;
  phone: string;
};

export default function PortalDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    totalSpent: 0,
  });

  // Check if user has any paid/delivered project (unlocks Growth)
  const hasGrowthAccess = projects.some(p => p.paid || p.status === 'DELIVERED');
  
  // Check if user has delivered projects but no growth packages
  const hasDeliveredProject = projects.some(p => p.status === 'DELIVERED' || p.paid);
  const [hasGrowthPackages, setHasGrowthPackages] = useState(false);

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

      // Load projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (projectsData) {
        setProjects(projectsData);

        // Calculate stats
        const planPrices: Record<string, number> = {
          starter: 299, landing: 299,
          professional: 599, service: 599,
          premium: 799,
          enterprise: 999, ecommerce: 999,
        };

        const totalSpent = projectsData
          .filter(p => p.paid)
          .reduce((sum, p) => sum + (planPrices[p.plan] || 0), 0);

        setStats({
          total: projectsData.length,
          inProgress: projectsData.filter(p => !['DELIVERED'].includes(p.status)).length,
          completed: projectsData.filter(p => p.status === 'DELIVERED').length,
          totalSpent,
        });

        // Generate activities from projects
        const generatedActivities: Activity[] = projectsData.slice(0, 5).map(p => ({
          id: p.id,
          type: getActivityType(p.status),
          message: getActivityMessage(p.status, p.business_name),
          created_at: p.created_at,
          project_name: p.business_name,
        }));
        setActivities(generatedActivities);

        // Check if user has growth packages
        // TODO: Replace with actual database check when growth_packages table exists
        const { data: growthData } = await supabase
          .from('growth_packages')
          .select('id')
          .eq('customer_id', userId)
          .limit(1);
        
        // FIX: Ensure boolean value (not null)
        setHasGrowthPackages(!!(growthData && growthData.length > 0));
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityType = (status: string) => {
    const types: Record<string, string> = {
      QUEUED: 'queued',
      IN_PROGRESS: 'progress',
      PREVIEW_READY: 'preview',
      REVISION_REQUESTED: 'revision',
      PAID: 'paid',
      DELIVERED: 'delivered',
    };
    return types[status] || 'update';
  };

  const getActivityMessage = (status: string, name: string) => {
    const messages: Record<string, string> = {
      QUEUED: `${name} is in the queue`,
      IN_PROGRESS: `Designer started working on ${name}`,
      PREVIEW_READY: `Preview ready for ${name}`,
      REVISION_REQUESTED: `Revision requested for ${name}`,
      PAID: `Payment received for ${name}`,
      DELIVERED: `${name} has been delivered`,
    };
    return messages[status] || `Update for ${name}`;
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, { icon: string; bg: string }> = {
      queued: { icon: '⏳', bg: 'bg-amber-100' },
      progress: { icon: '🎨', bg: 'bg-blue-100' },
      preview: { icon: '👁️', bg: 'bg-purple-100' },
      revision: { icon: '✏️', bg: 'bg-orange-100' },
      paid: { icon: '💰', bg: 'bg-emerald-100' },
      delivered: { icon: '🚀', bg: 'bg-emerald-100' },
      update: { icon: '📌', bg: 'bg-neutral-100' },
    };
    return icons[type] || icons.update;
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string; progress: number }> = {
      QUEUED: { label: 'In Queue', color: 'text-amber-700', bg: 'bg-amber-100', progress: 20 },
      IN_PROGRESS: { label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-100', progress: 50 },
      PREVIEW_READY: { label: 'Preview Ready', color: 'text-purple-700', bg: 'bg-purple-100', progress: 75 },
      REVISION_REQUESTED: { label: 'Revising', color: 'text-orange-700', bg: 'bg-orange-100', progress: 60 },
      PAID: { label: 'Paid', color: 'text-emerald-700', bg: 'bg-emerald-100', progress: 90 },
      DELIVERED: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-100', progress: 100 },
    };
    return configs[status] || { label: status, color: 'text-neutral-700', bg: 'bg-neutral-100', progress: 0 };
  };

  const getPlanPrice = (plan: string) => {
    const prices: Record<string, number> = {
      starter: 299, landing: 299,
      professional: 599, service: 599,
      premium: 799,
      enterprise: 999, ecommerce: 999,
    };
    return prices[plan] || 0;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading your portal...</p>
        </div>
      </div>
    );
  }

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
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none noise z-50"></div>

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
                <span className="text-white font-display text-lg font-semibold">V</span>
              </div>
              <span className="font-body text-black font-semibold tracking-wide hidden sm:block">VEKTORLABS</span>
            </Link>

            {/* NAV - DESKTOP */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/portal" className="px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/portal/messages" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                Messages
              </Link>
              <Link href="/portal/billing" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                Billing
              </Link>
              {/* GROWTH NAV LINK */}
              <Link 
                href="/portal/growth" 
                className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  hasGrowthAccess 
                    ? 'text-neutral-600 hover:bg-neutral-100' 
                    : 'text-neutral-400 hover:bg-neutral-100'
                }`}
              >
                {!hasGrowthAccess && (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                <span>Growth</span>
                {hasGrowthAccess && (
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                )}
              </Link>
              <Link href="/portal/settings" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                Settings
              </Link>
            </nav>

            {/* USER */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
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

              <button
                onClick={handleLogout}
                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors"
                title="Sign out"
              >
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
          <Link href="/portal" className="px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium whitespace-nowrap">
            Dashboard
          </Link>
          <Link href="/portal/messages" className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full font-body text-sm font-medium whitespace-nowrap">
            Messages
          </Link>
          <Link href="/portal/billing" className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full font-body text-sm font-medium whitespace-nowrap">
            Billing
          </Link>
          {/* GROWTH NAV LINK - MOBILE */}
          <Link 
            href="/portal/growth" 
            className={`px-4 py-2 rounded-full font-body text-sm font-medium whitespace-nowrap flex items-center gap-1.5 ${
              hasGrowthAccess 
                ? 'bg-neutral-100 text-neutral-600' 
                : 'bg-neutral-100 text-neutral-400'
            }`}
          >
            {!hasGrowthAccess && (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
            <span>Growth</span>
          </Link>
          <Link href="/portal/settings" className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full font-body text-sm font-medium whitespace-nowrap">
            Settings
          </Link>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* WELCOME */}
        <div className="mb-10">
          <h1 className="font-display text-4xl font-medium text-black mb-2">
            Welcome back, {customer?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="font-body text-neutral-500 text-lg">
            Here is what is happening with your projects.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="font-display text-3xl font-semibold text-black">{stats.total}</p>
            <p className="font-body text-sm text-neutral-500 mt-1">Total Projects</p>
          </div>

          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-display text-3xl font-semibold text-blue-700">{stats.inProgress}</p>
            <p className="font-body text-sm text-blue-600 mt-1">In Progress</p>
          </div>

          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-display text-3xl font-semibold text-emerald-700">{stats.completed}</p>
            <p className="font-body text-sm text-emerald-600 mt-1">Completed</p>
          </div>

          <div className="bg-purple-50 rounded-2xl border border-purple-200 p-6">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-display text-3xl font-semibold text-purple-700">${stats.totalSpent}</p>
            <p className="font-body text-sm text-purple-600 mt-1">Total Invested</p>
          </div>
        </div>

        {/* ============================================ */}
        {/* GROWTH BANNER - ACTION NEEDED */}
        {/* Shows for users with delivered/paid projects who don't have growth packages */}
        {/* ============================================ */}
        {hasDeliveredProject && !hasGrowthPackages && (
          <Link href="/portal/growth" className="block mb-8">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">⚠️</span>
                    <span className="font-body text-sm font-semibold uppercase tracking-wide text-white/90">Action Needed</span>
                  </div>
                  <h3 className="font-display text-xl font-medium mb-1">Your website needs customers</h3>
                  <p className="font-body text-sm text-white/80">Find out what's blocking your growth →</p>
                </div>
                <div className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT - PROJECTS */}
          <div className="lg:col-span-2 space-y-6">
            {/* NEW PROJECT CTA */}
            <div className="bg-black rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <h2 className="font-display text-2xl font-medium mb-2">Ready for a new website?</h2>
                <p className="font-body text-white/70 mb-6">Get your custom website designed by our team.</p>
                <Link
                  href="/portal/new-project"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-body font-medium rounded-full hover:bg-white/90 transition-all"
                >
                  <span>Start New Project</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* GROWTH UPSELL BANNER - Shows when user has paid projects */}
            {hasGrowthAccess && !hasGrowthPackages && (
              <Link href="/portal/growth" className="block">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden group hover:shadow-lg transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="font-body text-sm font-semibold uppercase tracking-wide text-white/90">New</span>
                      </div>
                      <h3 className="font-display text-xl font-medium mb-1">Grow Your Business</h3>
                      <p className="font-body text-sm text-white/80">SEO, Reviews, Ads & more — all in one place</p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* PROJECTS */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                <h2 className="font-display text-xl font-medium text-black">Your Projects</h2>
                <span className="font-body text-sm text-neutral-500">{projects.length} total</span>
              </div>

              {projects.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-medium text-black mb-2">No projects yet</h3>
                  <p className="font-body text-neutral-500 mb-6">Create your first project to get started!</p>
                  <Link
                    href="/portal/new-project"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all"
                  >
                    <span>Create First Project</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {projects.map((project) => {
                    const statusConfig = getStatusConfig(project.status);
                    
                    return (
                      <Link
                        key={project.id}
                        href={`/portal/project/${project.id}`}
                        className="block p-6 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-display text-lg font-semibold">
                                {project.business_name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-body font-semibold text-black">{project.business_name}</h3>
                              <p className="font-body text-sm text-neutral-500">
                                {project.plan?.charAt(0).toUpperCase() + project.plan?.slice(1)} · ${getPlanPrice(project.plan)}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full font-body text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* PROGRESS BAR */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-body text-xs text-neutral-500">Progress</span>
                            <span className="font-body text-xs font-medium text-black">{statusConfig.progress}%</span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-black rounded-full transition-all duration-500"
                              style={{ width: `${statusConfig.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center justify-between">
                          <span className="font-body text-xs text-neutral-400">
                            Created {new Date(project.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-2">
                            {project.status === 'PREVIEW_READY' && !project.paid && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-body text-xs font-medium">
                                Preview Available
                              </span>
                            )}
                            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - SIDEBAR */}
          <div className="space-y-6">
            {/* ACTIVITY FEED */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-100">
                <h2 className="font-display text-xl font-medium text-black">Recent Activity</h2>
              </div>

              {activities.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-body text-neutral-500">No activity yet</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {activities.map((activity) => {
                    const iconConfig = getActivityIcon(activity.type);
                    
                    return (
                      <div key={activity.id} className="p-4 flex items-start gap-3">
                        <div className={`w-8 h-8 ${iconConfig.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className="text-sm">{iconConfig.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm text-black">{activity.message}</p>
                          <p className="font-body text-xs text-neutral-400 mt-1">{timeAgo(activity.created_at)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* QUICK LINKS */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-display text-lg font-medium text-black mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link href="/portal/new-project" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="font-body text-sm font-medium text-black">New Project</span>
                </Link>
                <Link href="/portal/messages" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="font-body text-sm font-medium text-black">Messages</span>
                </Link>
                {/* GROWTH QUICK LINK */}
                <Link href="/portal/growth" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasGrowthAccess ? 'bg-emerald-500' : 'bg-neutral-300'}`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm font-medium text-black">Growth Tools</span>
                    {!hasGrowthAccess && (
                      <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                </Link>
                <Link href="/portal/settings" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                  <div className="w-8 h-8 bg-neutral-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-body text-sm font-medium text-black">Settings</span>
                </Link>
              </div>
            </div>

            {/* HELP */}
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-body font-semibold text-emerald-900 mb-1">Need Help?</h3>
              <p className="font-body text-sm text-emerald-700 mb-4">Our team is here to assist you.</p>
              <a
                href="mailto:support@vektorlabs.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-body text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors"
              >
                <span>Contact Support</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-neutral-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-neutral-500">
              © 2024 Vektorlabs. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">
                Terms
              </Link>
              <a href="mailto:support@vektorlabs.com" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
