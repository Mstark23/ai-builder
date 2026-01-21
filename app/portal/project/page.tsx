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
  plan: string;
  paid: boolean;
  created_at: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; progress: number; description: string }> = {
  QUEUED: { label: 'Queued', color: 'bg-amber-100 text-amber-700 border-amber-200', progress: 10, description: 'Your project is in the queue' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200', progress: 40, description: 'Our team is working on your website' },
  GENERATING: { label: 'Generating', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', progress: 60, description: 'AI is generating your website' },
  PREVIEW_READY: { label: 'Preview Ready', color: 'bg-purple-100 text-purple-700 border-purple-200', progress: 80, description: 'Your preview is ready to view!' },
  REVISION_REQUESTED: { label: 'Revising', color: 'bg-orange-100 text-orange-700 border-orange-200', progress: 70, description: 'Working on your requested changes' },
  PAID: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', progress: 90, description: 'Payment received, finalizing delivery' },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', progress: 100, description: 'Your website has been delivered!' },
};

const PLAN_CONFIG: Record<string, { label: string; price: number }> = {
  starter: { label: 'Starter', price: 299 },
  landing: { label: 'Starter', price: 299 },
  professional: { label: 'Professional', price: 599 },
  service: { label: 'Professional', price: 599 },
  enterprise: { label: 'Enterprise', price: 999 },
  ecommerce: { label: 'Enterprise', price: 999 },
};

export default function CustomerProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId || customerId === 'demo') {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (!error && data) setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => STATUS_CONFIG[status] || STATUS_CONFIG.QUEUED;
  const getPlanConfig = (plan: string) => PLAN_CONFIG[plan] || { label: plan, price: 0 };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredProjects = projects.filter(p => {
    if (filter === 'active') return p.status !== 'DELIVERED';
    if (filter === 'completed') return p.status === 'DELIVERED';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-black">My Projects</h1>
          <p className="font-body text-neutral-500 mt-1">Track the progress of all your website projects</p>
        </div>
        <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Start New Project
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'All', count: projects.length },
          { key: 'active', label: 'Active', count: projects.filter(p => p.status !== 'DELIVERED').length },
          { key: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'DELIVERED').length },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-colors ${
              filter === f.key ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-medium text-black mb-2">No projects found</h3>
          <p className="font-body text-neutral-500 mb-6">
            {filter === 'all' ? "You haven't started any projects yet." : filter === 'active' ? "No active projects." : "No completed projects yet."}
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors">
            Start a Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project) => {
            const statusConfig = getStatusConfig(project.status);
            const planConfig = getPlanConfig(project.plan);

            return (
              <Link key={project.id} href={`/customer/projects/${project.id}`} className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-all group block">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-body font-bold text-xl flex-shrink-0">
                      {project.business_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-body font-semibold text-black truncate">{project.business_name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-body font-medium border ${statusConfig.color}`}>{statusConfig.label}</span>
                      </div>
                      <p className="font-body text-sm text-neutral-500">{statusConfig.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                      <p className="font-body text-sm font-medium text-black">{planConfig.label} Plan</p>
                      <p className="font-body text-xs text-neutral-500">${planConfig.price}</p>
                    </div>
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-body text-xs text-neutral-500">Progress</span>
                        <span className="font-body text-xs font-medium text-black">{statusConfig.progress}%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" style={{ width: `${statusConfig.progress}%` }} />
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-100">
                  <span className="font-body text-xs text-neutral-500">Created {formatDate(project.created_at)}</span>
                  {project.industry && (<><span className="text-neutral-300">•</span><span className="font-body text-xs text-neutral-500">{project.industry}</span></>)}
                  {!project.paid && project.status !== 'QUEUED' && (<><span className="text-neutral-300">•</span><span className="font-body text-xs text-amber-600 font-medium">Payment pending</span></>)}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
