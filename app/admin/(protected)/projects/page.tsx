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
  } | null;
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
    try {
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

      if (error) {
        console.error('Error loading projects:', error);
      }

      if (data) {
        setProjects(data);
      }
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'queued' && project.status !== 'QUEUED') return false;
    if (filter === 'in_progress' && project.status !== 'IN_PROGRESS') return false;
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
    inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
    preview: projects.filter(p => p.status === 'PREVIEW_READY').length,
    paid: projects.filter(p => p.paid).length,
    unpaid: projects.filter(p => !p.paid).length,
    delivered: projects.filter(p => p.status === 'DELIVERED').length,
  };

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

  const getPlanConfig = (plan: string | null) => {
    const configs: Record<string, { name: string; price: number }> = {
      starter: { name: 'Starter', price: 299 },
      landing: { name: 'Starter', price: 299 },
      professional: { name: 'Professional', price: 599 },
      service: { name: 'Professional', price: 599 },
      premium: { name: 'Premium', price: 799 },
      enterprise: { name: 'Enterprise', price: 999 },
      ecommerce: { name: 'E-Commerce', price: 999 },
    };
    return configs[plan || ''] || { name: plan || 'Unknown', price: 0 };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* CUSTOM STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      <div className="p-8 lg:p-12">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-4xl font-medium text-black mb-2">Projects</h1>
            <p className="font-body text-neutral-500">Manage all customer projects</p>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <div 
            onClick={() => setFilter('all')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              filter === 'all' 
                ? 'bg-black text-white border-black' 
                : 'bg-white border-neutral-200 hover:border-black'
            }`}
          >
            <p className={`font-display text-3xl font-semibold ${filter === 'all' ? 'text-white' : 'text-black'}`}>
              {stats.total}
            </p>
            <p className={`font-body text-sm mt-1 ${filter === 'all' ? 'text-white/70' : 'text-neutral-500'}`}>
              Total
            </p>
          </div>

          <div 
            onClick={() => setFilter('queued')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              filter === 'queued' 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-amber-50 border-amber-200 hover:border-amber-400'
            }`}
          >
            <p className={`font-display text-3xl font-semibold ${filter === 'queued' ? 'text-white' : 'text-amber-700'}`}>
              {stats.queued}
            </p>
            <p className={`font-body text-sm mt-1 ${filter === 'queued' ? 'text-white/70' : 'text-amber-600'}`}>
              Queued
            </p>
          </div>

          <div 
            onClick={() => setFilter('preview')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              filter === 'preview' 
                ? 'bg-purple-500 text-white border-purple-500' 
                : 'bg-purple-50 border-purple-200 hover:border-purple-400'
            }`}
          >
            <p className={`font-display text-3xl font-semibold ${filter === 'preview' ? 'text-white' : 'text-purple-700'}`}>
              {stats.preview}
            </p>
            <p className={`font-body text-sm mt-1 ${filter === 'preview' ? 'text-white/70' : 'text-purple-600'}`}>
              Preview Ready
            </p>
          </div>

          <div 
            onClick={() => setFilter('paid')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              filter === 'paid' 
                ? 'bg-emerald-500 text-white border-emerald-500' 
                : 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
            }`}
          >
            <p className={`font-display text-3xl font-semibold ${filter === 'paid' ? 'text-white' : 'text-emerald-700'}`}>
              {stats.paid}
            </p>
            <p className={`font-body text-sm mt-1 ${filter === 'paid' ? 'text-white/70' : 'text-emerald-600'}`}>
              Paid
            </p>
          </div>

          <div 
            onClick={() => setFilter('unpaid')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              filter === 'unpaid' 
                ? 'bg-red-500 text-white border-red-500' 
                : 'bg-red-50 border-red-200 hover:border-red-400'
            }`}
          >
            <p className={`font-display text-3xl font-semibold ${filter === 'unpaid' ? 'text-white' : 'text-red-700'}`}>
              {stats.unpaid}
            </p>
            <p className={`font-body text-sm mt-1 ${filter === 'unpaid' ? 'text-white/70' : 'text-red-600'}`}>
              Unpaid
            </p>
          </div>

          <div 
            onClick={() => setFilter('delivered')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              filter === 'delivered' 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-blue-50 border-blue-200 hover:border-blue-400'
            }`}
          >
            <p className={`font-display text-3xl font-semibold ${filter === 'delivered' ? 'text-white' : 'text-blue-700'}`}>
              {stats.delivered}
            </p>
            <p className={`font-body text-sm mt-1 ${filter === 'delivered' ? 'text-white/70' : 'text-blue-600'}`}>
              Delivered
            </p>
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
              placeholder="Search by business name, customer name or email..."
              className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* PROJECTS TABLE */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-16 text-center">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-medium text-black mb-2">No projects found</h3>
            <p className="font-body text-neutral-500">
              {search ? 'Try a different search term' : 'Projects will appear here when customers create them'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Project</th>
                    <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Plan</th>
                    <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Payment</th>
                    <th className="text-left px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-6 py-4 font-body text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredProjects.map((project) => {
                    const statusConfig = getStatusConfig(project.status);
                    const planConfig = getPlanConfig(project.plan);
                    
                    return (
                      <tr key={project.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-display text-lg font-semibold">
                                {project.business_name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <p className="font-body font-semibold text-black">{project.business_name || 'Unnamed'}</p>
                              <p className="font-body text-sm text-neutral-500">
                                {project.industry || '—'} · {project.style || '—'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-body font-medium text-black">{project.customers?.name || 'N/A'}</p>
                          <p className="font-body text-sm text-neutral-500">{project.customers?.email || '—'}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-body font-medium text-black">{planConfig.name}</p>
                          <p className="font-body text-sm text-neutral-500">${planConfig.price}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex px-3 py-1.5 rounded-lg font-body text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {project.paid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 font-body text-xs font-semibold text-emerald-700">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 font-body text-xs font-semibold text-red-700">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              Unpaid
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-body text-sm text-neutral-600">
                            {new Date(project.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
                          >
                            <span>Manage</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
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
    </div>
  );
}