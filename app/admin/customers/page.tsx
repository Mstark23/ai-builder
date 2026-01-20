'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  created_at: string;
  projects?: {
    id: string;
    business_name: string;
    status: string;
    paid: boolean;
    plan: string;
  }[];
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          projects (
            id,
            business_name,
            status,
            paid,
            plan
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setCustomers(data);
      }
    } catch (err) {
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.company?.toLowerCase().includes(searchLower)
    );
  });

  const getPlanPrice = (plan: string) => {
    const prices: Record<string, number> = {
      starter: 299, landing: 299,
      professional: 599, service: 599,
      premium: 799,
      enterprise: 999, ecommerce: 999,
    };
    return prices[plan] || 0;
  };

  const getTotalSpent = (projects: Customer['projects']) => {
    if (!projects) return 0;
    return projects.filter(p => p.paid).reduce((sum, p) => sum + getPlanPrice(p.plan), 0);
  };

  const getActiveProjects = (projects: Customer['projects']) => {
    if (!projects) return 0;
    return projects.filter(p => !['DELIVERED', 'CANCELLED'].includes(p.status)).length;
  };

  const openCustomerDrawer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setTimeout(() => setSelectedCustomer(null), 300);
  };

  // Stats
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.projects && c.projects.some(p => !['DELIVERED', 'CANCELLED'].includes(p.status))).length,
    newThisMonth: customers.filter(c => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(c.created_at) > monthAgo;
    }).length,
    totalRevenue: customers.reduce((sum, c) => sum + getTotalSpent(c.projects), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-black">Customers</h1>
          <p className="font-body text-neutral-500 mt-1">Manage your customer relationships</p>
        </div>
        <button className="px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="font-display text-3xl font-semibold text-black">{stats.total}</div>
          <div className="font-body text-sm text-neutral-500 mt-1">Total Customers</div>
        </div>
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
          <div className="font-display text-3xl font-semibold text-blue-700">{stats.active}</div>
          <div className="font-body text-sm text-blue-600 mt-1">With Active Projects</div>
        </div>
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
          <div className="font-display text-3xl font-semibold text-emerald-700">{stats.newThisMonth}</div>
          <div className="font-body text-sm text-emerald-600 mt-1">New This Month</div>
        </div>
        <div className="bg-purple-50 rounded-2xl border border-purple-200 p-5">
          <div className="font-display text-3xl font-semibold text-purple-700">${stats.totalRevenue.toLocaleString()}</div>
          <div className="font-body text-sm text-purple-600 mt-1">Total Revenue</div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-medium text-black mb-2">No customers found</h3>
          <p className="font-body text-neutral-500">
            {search ? 'Try a different search term' : 'Customers will appear here when they sign up'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Projects</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Spent</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCustomers.map((customer) => {
                  const totalSpent = getTotalSpent(customer.projects);
                  const activeCount = getActiveProjects(customer.projects);
                  const projectCount = customer.projects?.length || 0;

                  return (
                    <tr key={customer.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-body font-bold">
                            {customer.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-body font-medium text-black">{customer.name}</div>
                            {customer.company && (
                              <div className="font-body text-xs text-neutral-500">{customer.company}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-body text-sm text-neutral-600">{customer.email}</div>
                        {customer.phone && (
                          <div className="font-body text-xs text-neutral-400">{customer.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-body text-sm font-medium text-black">{projectCount}</span>
                          {activeCount > 0 && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-body font-medium rounded-full">
                              {activeCount} active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-body text-sm font-semibold text-black">
                          ${totalSpent.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-body text-sm text-neutral-500">
                          {new Date(customer.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openCustomerDrawer(customer)}
                          className="px-4 py-2 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* PAGINATION */}
          <div className="p-4 border-t border-neutral-100 flex items-center justify-between">
            <div className="font-body text-sm text-neutral-500">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-neutral-200 rounded-lg font-body text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1.5 bg-black text-white rounded-lg font-body text-sm font-medium">
                1
              </button>
              <button className="px-3 py-1.5 border border-neutral-200 rounded-lg font-body text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER DRAWER */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          showDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white z-50 overflow-y-auto transition-transform duration-300 ${
          showDrawer ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedCustomer && (
          <>
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="font-body font-semibold text-lg text-black">Customer Details</h2>
              <button onClick={closeDrawer} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Customer Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-body font-bold">
                  {selectedCustomer.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="font-body font-semibold text-xl text-black">{selectedCustomer.name}</h3>
                  <p className="font-body text-sm text-neutral-500">{selectedCustomer.email}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-6 p-4 bg-neutral-50 rounded-xl">
                <h4 className="font-body font-medium text-sm text-black mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-neutral-500">Email</span>
                    <span className="font-body text-sm text-black">{selectedCustomer.email}</span>
                  </div>
                  {selectedCustomer.phone && (
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-neutral-500">Phone</span>
                      <span className="font-body text-sm text-black">{selectedCustomer.phone}</span>
                    </div>
                  )}
                  {selectedCustomer.company && (
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-neutral-500">Company</span>
                      <span className="font-body text-sm text-black">{selectedCustomer.company}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-neutral-500">Member Since</span>
                    <span className="font-body text-sm text-black">
                      {new Date(selectedCustomer.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="font-display text-2xl font-semibold text-emerald-700">
                    ${getTotalSpent(selectedCustomer.projects).toLocaleString()}
                  </div>
                  <div className="font-body text-xs text-emerald-600">Total Spent</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="font-display text-2xl font-semibold text-blue-700">
                    {selectedCustomer.projects?.length || 0}
                  </div>
                  <div className="font-body text-xs text-blue-600">Projects</div>
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="font-body font-medium text-sm text-black mb-3">Projects</h4>
                {selectedCustomer.projects && selectedCustomer.projects.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCustomer.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/admin/projects/${project.id}`}
                        className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs font-body font-semibold">
                            {project.business_name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-body text-sm font-medium text-black">{project.business_name}</div>
                            <div className="font-body text-xs text-neutral-500">{project.plan}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {project.paid ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-body rounded-full">Paid</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-body rounded-full">Unpaid</span>
                          )}
                          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-sm text-neutral-500 text-center py-4">No projects yet</p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-neutral-200 flex gap-3">
                <button className="flex-1 px-4 py-2.5 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80 transition-colors">
                  Send Message
                </button>
                <button className="px-4 py-2.5 border border-neutral-200 text-neutral-600 font-body text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
