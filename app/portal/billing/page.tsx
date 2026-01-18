'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Payment = {
  id: string;
  project_id: string;
  amount: number;
  status: string;
  created_at: string;
  project_name?: string;
  plan?: string;
};

export default function BillingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpent: 0,
    projectsCount: 0,
    paidCount: 0,
  });

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
    await loadBillingData(user.id);
  };

  const loadBillingData = async (userId: string) => {
    try {
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (projects) {
        const planPrices: Record<string, number> = {
          starter: 299, landing: 299,
          professional: 599, service: 599,
          premium: 799,
          enterprise: 999, ecommerce: 999,
        };

        // Generate payment records from paid projects
        const paidProjects = projects.filter(p => p.paid);
        const paymentRecords: Payment[] = paidProjects.map(p => ({
          id: p.id,
          project_id: p.id,
          amount: planPrices[p.plan] || 0,
          status: 'completed',
          created_at: p.created_at,
          project_name: p.business_name,
          plan: p.plan,
        }));

        setPayments(paymentRecords);

        const totalSpent = paidProjects.reduce((sum, p) => sum + (planPrices[p.plan] || 0), 0);

        setStats({
          totalSpent,
          projectsCount: projects.length,
          paidCount: paidProjects.length,
        });
      }
    } catch (err) {
      console.error('Error loading billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getPlanName = (plan: string) => {
    const names: Record<string, string> = {
      starter: 'Starter', landing: 'Starter',
      professional: 'Professional', service: 'Professional',
      premium: 'Premium',
      enterprise: 'Enterprise', ecommerce: 'E-Commerce',
    };
    return names[plan] || plan;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading billing...</p>
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
              <Link href="/portal/messages" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                Messages
              </Link>
              <Link href="/portal/billing" className="px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium">
                Billing
              </Link>
              <Link href="/portal/settings" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">
                Settings
              </Link>
            </nav>

            <button
              onClick={handleLogout}
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <Link href="/portal" className="inline-flex items-center gap-2 font-body text-neutral-500 hover:text-black transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-display text-4xl font-medium text-black mb-2">Billing & Payments</h1>
          <p className="font-body text-neutral-500">View your payment history and invoices</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-display text-3xl font-semibold text-black">${stats.totalSpent}</p>
            <p className="font-body text-sm text-neutral-500 mt-1">Total Spent</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="font-display text-3xl font-semibold text-black">{stats.projectsCount}</p>
            <p className="font-body text-sm text-neutral-500 mt-1">Total Projects</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-display text-3xl font-semibold text-black">{stats.paidCount}</p>
            <p className="font-body text-sm text-neutral-500 mt-1">Completed Payments</p>
          </div>
        </div>

        {/* PAYMENT HISTORY */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-display text-xl font-medium text-black">Payment History</h2>
            <span className="font-body text-sm text-neutral-500">{payments.length} payments</span>
          </div>

          {payments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-medium text-black mb-2">No payments yet</h3>
              <p className="font-body text-neutral-500 mb-6">Your payment history will appear here</p>
              <Link
                href="/portal/new-project"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all"
              >
                <span>Start a Project</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {payments.map((payment) => (
                <div key={payment.id} className="p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-body font-semibold text-black">{payment.project_name}</h3>
                      <p className="font-body text-sm text-neutral-500">
                        {getPlanName(payment.plan || '')} Plan · {new Date(payment.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-display text-xl font-semibold text-black">${payment.amount}</p>
                      <p className="font-body text-xs text-emerald-600 font-medium">Completed</p>
                    </div>
                    
                    <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAYMENT METHODS */}
        <div className="mt-8 bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-medium text-black">Payment Methods</h2>
            <button className="px-4 py-2 bg-neutral-100 text-black font-body text-sm font-medium rounded-full hover:bg-neutral-200 transition-colors">
              + Add New
            </button>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md flex items-center justify-center">
                <span className="text-white font-body text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="font-body font-medium text-black">•••• •••• •••• 4242</p>
                <p className="font-body text-sm text-neutral-500">Expires 12/25</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-body text-xs font-medium rounded-full">
              Default
            </span>
          </div>

          <p className="font-body text-xs text-neutral-400 mt-4">
            Payments are processed securely via Stripe. Your card information is never stored on our servers.
          </p>
        </div>

        {/* NEED HELP */}
        <div className="mt-8 bg-blue-50 rounded-2xl border border-blue-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="font-body font-semibold text-blue-900">Need help with billing?</h3>
            <p className="font-body text-sm text-blue-700">Our support team is here to help with any questions.</p>
          </div>
          <a
            href="mailto:billing@verktorlabs.com"
            className="px-5 py-2.5 bg-blue-600 text-white font-body text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </main>
    </div>
  );
}