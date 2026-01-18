'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Customer = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  created_at: string;
  projects?: Project[];
  totalSpent?: number;
  projectCount?: number;
};

type Project = {
  id: string;
  business_name: string;
  status: string;
  plan: string;
  paid: boolean;
  created_at: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerProjects, setCustomerProjects] = useState<Project[]>([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const { data: customersData } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (customersData) {
        // Load projects for each customer
        const customersWithStats = await Promise.all(
          customersData.map(async (customer) => {
            const { data: projects } = await supabase
              .from('projects')
              .select('*')
              .eq('customer_id', customer.user_id);

            const planPrices: Record<string, number> = {
              starter: 299, landing: 299,
              professional: 599, service: 599,
              premium: 799,
              enterprise: 999, ecommerce: 999,
            };

            const paidProjects = projects?.filter(p => p.paid) || [];
            const totalSpent = paidProjects.reduce((sum, p) => sum + (planPrices[p.plan] || 0), 0);

            return {
              ...customer,
              projects,
              totalSpent,
              projectCount: projects?.length || 0,
            };
          })
        );

        setCustomers(customersWithStats);
      }
    } catch (err) {
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerProjects = async (customer: Customer) => {
    setSelectedCustomer(customer);
    
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('customer_id', customer.user_id)
      .order('created_at', { ascending: false });

    setCustomerProjects(projects || []);
  };

  const filteredCustomers = customers.filter(c => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(searchLower) ||
      c.email?.toLowerCase().includes(searchLower) ||
      c.business_name?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
      QUEUED: { label: 'Queued', color: 'text-amber-700', bg: 'bg-amber-100' },
      IN_PROGRESS: { label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-100' },
      PREVIEW_READY: { label: 'Preview Ready', color: 'text-purple-700', bg: 'bg-purple-100' },
      REVISION_REQUESTED: { label: 'Revision', color: 'text-orange-700', bg: 'bg-orange-100' },
      PAID: { label: 'Paid', color: 'text-emerald-700', bg: 'bg-emerald-100' },
      DELIVERED: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-100' },
    };
    return configs[status] || { label: status, color: 'text-neutral-700', bg: 'bg-neutral-100' };
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      <div className="p-8 lg:p-12">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl font-medium text-black mb-2">Customers</h1>
            <p className="font-body text-neutral-500">{customers.length} total customers</p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="font-display text-3xl font-semibold text-black">{customers.length}</p>
            <p className="font-body text-sm text-neutral-500 mt-1">Total Customers</p>
          </div>

          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-display text-3xl font-semibold text-emerald-700">
              ${customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString()}
            </p>
            <p className="font-body text-sm text-emerald-600 mt-1">Total Revenue</p>
          </div>

          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="font-display text-3xl font-semibold text-blue-700">
              {customers.reduce((sum, c) => sum + (c.projectCount || 0), 0)}
            </p>
            <p className="font-body text-sm text-blue-600 mt-1">Total Projects</p>
          </div>

          <div className="bg-purple-50 rounded-2xl border border-purple-200 p-6">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="font-display text-3xl font-semibold text-purple-700">
              ${customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length) : 0}
            </p>
            <p className="font-body text-sm text-purple-600 mt-1">Avg. per Customer</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or company..."
              className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* CUSTOMERS LIST */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100">
                <h2 className="font-display text-xl font-medium text-black">All Customers</h2>
              </div>

              {filteredCustomers.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="font-body text-neutral-500">No customers found</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => loadCustomerProjects(customer)}
                      className={`w-full p-4 text-left hover:bg-neutral-50 transition-colors ${
                        selectedCustomer?.id === customer.id ? 'bg-neutral-100' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-body font-semibold">
                            {customer.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-body font-semibold text-black truncate">{customer.name}</h3>
                            <span className="font-body text-sm font-medium text-emerald-600">
                              ${customer.totalSpent?.toLocaleString() || 0}
                            </span>
                          </div>
                          <p className="font-body text-sm text-neutral-500 truncate">{customer.email}</p>
                          <div className="flex items-center gap-3 mt-1">
                            {customer.business_name && (
                              <span className="font-body text-xs text-neutral-400">{customer.business_name}</span>
                            )}
                            <span className="font-body text-xs text-neutral-400">
                              {customer.projectCount} project{customer.projectCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CUSTOMER DETAIL */}
          <div>
            {selectedCustomer ? (
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden sticky top-8">
                <div className="p-6 bg-black text-white">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                    <span className="text-black font-display text-2xl font-semibold">
                      {selectedCustomer.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-medium">{selectedCustomer.name}</h2>
                  <p className="font-body text-white/70 mt-1">{selectedCustomer.email}</p>
                </div>

                <div className="p-6 space-y-4">
                  {selectedCustomer.phone && (
                    <div>
                      <label className="font-body text-xs text-neutral-500">Phone</label>
                      <p className="font-body text-black">{selectedCustomer.phone}</p>
                    </div>
                  )}
                  {selectedCustomer.business_name && (
                    <div>
                      <label className="font-body text-xs text-neutral-500">Company</label>
                      <p className="font-body text-black">{selectedCustomer.business_name}</p>
                    </div>
                  )}
                  <div>
                    <label className="font-body text-xs text-neutral-500">Customer Since</label>
                    <p className="font-body text-black">
                      {new Date(selectedCustomer.created_at).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                    <div className="bg-neutral-50 rounded-xl p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-black">{selectedCustomer.projectCount}</p>
                      <p className="font-body text-xs text-neutral-500">Projects</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-emerald-700">${selectedCustomer.totalSpent}</p>
                      <p className="font-body text-xs text-emerald-600">Total Spent</p>
                    </div>
                  </div>

                  {/* PROJECTS */}
                  <div className="pt-4 border-t border-neutral-100">
                    <h3 className="font-body font-semibold text-black mb-3">Projects</h3>
                    <div className="space-y-2">
                      {customerProjects.map((project) => {
                        const statusConfig = getStatusConfig(project.status);
                        return (
                          <Link
                            key={project.id}
                            href={`/admin/projects/${project.id}`}
                            className="block p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-body text-sm font-medium text-black truncate">
                                {project.business_name}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full font-body text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                                {statusConfig.label}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-body text-xs text-neutral-500 capitalize">{project.plan}</span>
                              <span className="font-body text-xs font-medium text-black">${getPlanPrice(project.plan)}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="pt-4 border-t border-neutral-100 space-y-2">
                    <a
                      href={`mailto:${selectedCustomer.email}`}
                      className="block w-full px-4 py-3 bg-black text-white font-body text-sm font-medium rounded-xl text-center hover:bg-black/80 transition-colors"
                    >
                      Send Email
                    </a>
                    <Link
                      href={`/admin/messages?customer=${selectedCustomer.id}`}
                      className="block w-full px-4 py-3 bg-neutral-100 text-black font-body text-sm font-medium rounded-xl text-center hover:bg-neutral-200 transition-colors"
                    >
                      View Messages
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="font-body text-neutral-500">Select a customer to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}