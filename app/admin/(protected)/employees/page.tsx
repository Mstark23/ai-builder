'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Project = {
  id: string;
  business_name: string;
  industry: string | null;
  style: string | null;
  status: string;
  plan: string | null;
  paid: boolean;
  created_at: string;
  customers?: {
    name: string;
    email: string;
  };
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        customers (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'queued' && project.status !== 'QUEUED') return false;
    if (filter === 'preview' && project.status !== 'PREVIEW_READY') return false;
    if (filter === 'paid' && !project.paid) return false;
    if (filter === 'unpaid' && project.paid) return false;
    if (filter === 'delivered' && project.status !== 'DELIVERED') return false;

    if (search) {
      const searchLower = search.toLowerCase();
      const matchBusiness = project.business_name?.toLowerCase().includes(searchLower);
      const matchCustomer = project.customers?.name?.toLowerCase().includes(searchLower);
      const matchEmail = project.customers?.email?.toLowerCase().includes(searchLower);
      if (!matchBusiness && !matchCustomer && !matchEmail) return false;
    }

    return true;
  });

  const stats = {
    total: projects.length,
    queued: projects.filter(p => p.status === 'QUEUED').length,
    preview: projects.filter(p => p.status === 'PREVIEW_READY').length,
    paid: projects.filter(p => p.paid).length,
    delivered: projects.filter(p => p.status === 'DELIVERED').length,
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
      QUEUED: { label: 'Queued', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
      IN_PROGRESS: { label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
      PREVIEW_READY: { label: 'Preview Ready', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
      REVISION_REQUESTED: { label: 'Revision', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
      PAID: { label: 'Paid', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
      DELIVERED: { label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    };
    return configs[status] || { label: status, color: 'text-neutral-600', bg: 'bg-neutral-50 border-neutral-200' };
  };

  const getPlanConfig = (plan: string) => {
    const configs: Record<string, { name: string; price: number }> = {
      starter: { name: 'Starter', price: 299 },
      landing: { name: 'Starter', price: 299 },
      professional: { name: 'Professional', price: 599 },
      service: { name: 'Professional', price: 599 },
      enterprise: { name: 'Enterprise', price: 999 },
      ecommerce: { name: 'Enterprise', price: 999 },
    };
    return configs[plan] || { name: plan || 'Unknown', price: 0 };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl font-medium text-black mb-2">Projects</h1>
          <p className="font-body text-neutral-500">Manage all customer projects</p>
        </div>
      </div>

      {/* STATS TABS */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { key: 'all', label: 'All', count: stats.total },
          { key: 'queued', label: 'Queued', count: stats.queued },
          { key: 'preview', label: 'Preview Ready', count: stats.preview },
          { key: 'paid', label: 'Paid', count: stats.paid },
          { key: 'delivered', label: 'Delivered', count: stats.delivered },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-black text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
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
            placeholder="Search by business, customer, or email..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* PROJECTS LIST */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="font-body text-neutral-500">
            {search ? 'No projects match your search' : 'No projects found'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Project</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Plan</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Payment</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProjects.map((project) => {
                  const statusConfig = getStatusConfig(project.status);
                  const planConfig = getPlanConfig(project.plan || '');
                  
                  return (
                    <tr key={project.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-display font-semibold">
                              {project.business_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-body font-medium text-black">{project.business_name}</p>
                            <p className="font-body text-xs text-neutral-500">
                              {project.industry} · {project.style}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-body text-sm text-black">{project.customers?.name || '—'}</p>
                        <p className="font-body text-xs text-neutral-500">{project.customers?.email || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-body text-sm text-black">{planConfig.name}</p>
                        <p className="font-body text-xs text-neutral-500">${planConfig.price}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex px-3 py-1 rounded-full border ${statusConfig.bg}`}>
                          <span className={`font-body text-xs font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {project.paid ? (
                          <div className="inline-flex px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                            <span className="font-body text-xs font-medium text-emerald-600">✓ Paid</span>
                          </div>
                        ) : (
                          <div className="inline-flex px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
                            <span className="font-body text-xs font-medium text-amber-600">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-body text-sm text-neutral-500">
                          {new Date(project.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="px-4 py-2 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}