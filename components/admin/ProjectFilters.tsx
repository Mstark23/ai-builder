// ═══════════════════════════════════════════════════════════════
// PROJECTS LIST — FILTER BAR UPDATE
// ═══════════════════════════════════════════════════════════════
// Add this to your projects list page (app/admin/(protected)/projects/page.tsx)
// Replaces your existing filter bar with one that supports source filtering
// and the new lead workflow statuses.
//
// Usage: <ProjectFilters filters={filters} onChange={setFilters} counts={counts} />
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// ── Updated Status Config ──
// Add these to your existing STATUS_OPTIONS array
export const STATUS_OPTIONS = [
  // Landing page lead statuses
  { value: 'pending', label: 'New Lead', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  { value: 'claimed', label: 'Claimed', color: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  // Existing statuses
  { value: 'generating', label: 'Generating', color: 'bg-purple-50 text-purple-700', dot: 'bg-purple-500' },
  { value: 'preview', label: 'Preview Ready', color: 'bg-indigo-50 text-indigo-700', dot: 'bg-indigo-500' },
  { value: 'sent', label: 'Link Sent', color: 'bg-cyan-50 text-cyan-700', dot: 'bg-cyan-500' },
  { value: 'paid', label: 'Paid', color: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
  { value: 'building', label: 'Building', color: 'bg-orange-50 text-orange-700', dot: 'bg-orange-500' },
  { value: 'delivered', label: 'Delivered', color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
];

type Filters = {
  search: string;
  status: string;
  source: string;
  sort: string;
};

type Counts = {
  total: number;
  pending: number;
  inProgress: number;
  delivered: number;
};

export function ProjectFilters({
  filters,
  onChange,
  counts,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  counts: Counts;
}) {
  return (
    <div className="space-y-4">
      {/* Source Tabs */}
      <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1 w-fit">
        {[
          { key: '', label: 'All Projects', count: counts.total },
          { key: 'landing_page', label: 'Landing Page Leads', count: counts.pending },
          { key: 'admin', label: 'Admin Created', count: counts.total - counts.pending },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => onChange({ ...filters, source: tab.key })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filters.source === tab.key
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                filters.source === tab.key
                  ? 'bg-black text-white'
                  : 'bg-neutral-200 text-neutral-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + Status Filter */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by business name, email, phone..."
            value={filters.search}
            onChange={e => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Status */}
        <select
          value={filters.status}
          onChange={e => onChange({ ...filters, status: e.target.value })}
          className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm outline-none focus:border-black bg-white appearance-none pr-8"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={e => onChange({ ...filters, sort: e.target.value })}
          className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm outline-none focus:border-black bg-white appearance-none pr-8"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROJECT CARD — Updated with source badge and contact info
// ═══════════════════════════════════════════════════════════════
// Replace your existing project card component with this one

export function ProjectCard({ project }: { project: any }) {
  const status = STATUS_OPTIONS.find(s => s.value === project.status) || STATUS_OPTIONS[0];
  const isLead = project.source === 'landing_page';

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <a
      href={`/admin/projects/${project.id}`}
      className="block bg-white border border-neutral-200 rounded-2xl p-5 hover:border-neutral-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm ${
            isLead ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-neutral-600 to-neutral-800'
          }`}>
            {project.business_name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-semibold text-black text-[15px] group-hover:underline">{project.business_name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              {project.industry && <span className="text-xs text-neutral-500">{project.industry}</span>}
              {project.website_type && (
                <>
                  <span className="text-neutral-300">·</span>
                  <span className="text-xs text-neutral-500">{project.website_type}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <span className="text-xs text-neutral-400">{timeAgo(project.created_at)}</span>
      </div>

      {/* Status + Source badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
        {isLead && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
            🌐 Landing Page
          </span>
        )}
        {project.plan && (
          <span className="px-2.5 py-1 bg-neutral-100 text-neutral-500 rounded-full text-xs font-medium">
            {project.plan === 'starter' ? '$299' : project.plan === 'business' ? '$599' : project.plan === 'premium' ? '$999' : project.plan}
          </span>
        )}
      </div>

      {/* Contact info for leads */}
      {isLead && (project.phone || project.email) && (
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-neutral-100">
          {project.phone && (
            <span className="text-xs text-neutral-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {project.phone}
            </span>
          )}
          {project.email && (
            <span className="text-xs text-neutral-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {project.email}
            </span>
          )}
        </div>
      )}
    </a>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOAD PROJECTS — Updated query with source + status filtering
// ═══════════════════════════════════════════════════════════════
// Replace your existing project loading function with this one

export async function loadProjects(filters: Filters) {
  let query = supabase
    .from('projects')
    .select('*, customers(id, email, name)')
    .order('created_at', { ascending: filters.sort === 'oldest' });

  // Source filter
  if (filters.source) {
    query = query.eq('source', filters.source);
  }

  // Status filter
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  // Search
  if (filters.search) {
    query = query.or(
      `business_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
    );
  }

  // Sort by name
  if (filters.sort === 'name') {
    query = query.order('business_name', { ascending: true });
  }

  const { data, error } = await query.limit(50);

  if (error) {
    console.error('Error loading projects:', error);
    return [];
  }

  return data || [];
}
