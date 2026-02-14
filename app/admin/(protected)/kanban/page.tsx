'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Project = {
  id: string;
  business_name: string;
  status: string;
  plan: string;
  paid: boolean;
  created_at: string;
  source?: string;
  industry?: string;
  website_type?: string;
  email?: string;
  phone?: string;
  customers?: {
    name: string;
    email: string;
  } | null;
};

const COLUMNS = [
  { id: 'pending', label: 'New Leads', color: 'border-amber-400', bg: 'bg-amber-50' },
  { id: 'claimed', label: 'Claimed', color: 'border-blue-400', bg: 'bg-blue-50' },
  { id: 'QUEUED', label: 'Queued', color: 'border-neutral-400', bg: 'bg-neutral-50' },
  { id: 'generating', label: 'Generating', color: 'border-purple-400', bg: 'bg-purple-50' },
  { id: 'preview', label: 'Preview Ready', color: 'border-indigo-400', bg: 'bg-indigo-50' },
  { id: 'sent', label: 'Link Sent', color: 'border-cyan-400', bg: 'bg-cyan-50' },
  { id: 'PAID', label: 'Paid', color: 'border-emerald-400', bg: 'bg-emerald-50' },
  { id: 'DELIVERED', label: 'Delivered', color: 'border-emerald-600', bg: 'bg-emerald-100' },
];

const PLAN_PRICES: Record<string, number> = {
  starter: 299, landing: 299,
  professional: 599, service: 599,
  premium: 799,
  enterprise: 999, ecommerce: 999,
};

export default function KanbanPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*, customers(name, email)')
        .order('created_at', { ascending: false });

      if (data) setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProjectsByStatus = (status: string) => {
    if (status === 'generating') {
      return projects.filter(p => p.status === 'generating' || p.status === 'IN_PROGRESS');
    }
    if (status === 'preview') {
      return projects.filter(p => p.status === 'preview' || p.status === 'PREVIEW_READY');
    }
    if (status === 'PAID') {
      return projects.filter(p => p.status === 'PAID' || p.paid);
    }
    if (status === 'DELIVERED') {
      return projects.filter(p => p.status === 'DELIVERED' || p.status === 'delivered');
    }
    return projects.filter(p => p.status === status);
  };

  const handleDragStart = (projectId: string) => {
    setDraggedProject(projectId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (newStatus: string) => {
    if (!draggedProject) return;

    const project = projects.find(p => p.id === draggedProject);
    if (!project || project.status === newStatus) {
      setDraggedProject(null);
      return;
    }

    setSaving(true);

    setProjects(projects.map(p =>
      p.id === draggedProject ? { ...p, status: newStatus } : p
    ));

    try {
      await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', draggedProject);
    } catch (err) {
      console.error('Error updating status:', err);
      loadProjects();
    } finally {
      setDraggedProject(null);
      setSaving(false);
    }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-neutral-500">Loading kanban...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        .kanban-card { cursor: grab; transition: all 0.15s ease; }
        .kanban-card:active { cursor: grabbing; transform: rotate(2deg) scale(1.02); }
        .kanban-column { transition: background-color 0.15s ease; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-black">Kanban Board</h1>
          <p className="font-body text-neutral-500 mt-1">Drag and drop to update project status</p>
        </div>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-body text-sm rounded-full animate-pulse">
              Saving...
            </span>
          )}
          <Link
            href="/admin/projects"
            className="px-5 py-2.5 bg-white border border-neutral-200 text-black font-body text-sm font-medium rounded-full hover:bg-neutral-50 transition-all"
          >
            List View
          </Link>
        </div>
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const columnProjects = getProjectsByStatus(column.id);

          return (
            <div
              key={column.id}
              className={`kanban-column flex-shrink-0 w-72 rounded-2xl border-t-4 ${column.color} bg-white border border-neutral-200 overflow-hidden`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column Header */}
              <div className={`px-4 py-4 ${column.bg} border-b border-neutral-200`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-body font-semibold text-black text-sm">{column.label}</h3>
                  <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center font-body text-xs font-medium text-black shadow-sm">
                    {columnProjects.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="p-3 space-y-3 min-h-[400px]">
                {columnProjects.length === 0 ? (
                  <div className="p-4 border-2 border-dashed border-neutral-200 rounded-xl text-center">
                    <p className="font-body text-sm text-neutral-400">Drop projects here</p>
                  </div>
                ) : (
                  columnProjects.map((project) => (
                    <div
                      key={project.id}
                      draggable
                      onDragStart={() => handleDragStart(project.id)}
                      className={`kanban-card bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-md ${
                        draggedProject === project.id ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          project.source === 'landing_page'
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                            : 'bg-black'
                        }`}>
                          <span className="text-white font-body text-sm font-semibold">
                            {project.business_name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="font-body text-xs text-neutral-400 hover:text-black transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          View →
                        </Link>
                      </div>

                      {/* Business Name */}
                      <h4 className="font-body font-semibold text-sm text-black mb-1 truncate">{project.business_name}</h4>

                      {/* Industry + Type */}
                      {(project.industry || project.website_type) && (
                        <p className="font-body text-xs text-neutral-500 mb-2 truncate">
                          {[project.industry, project.website_type].filter(Boolean).join(' · ')}
                        </p>
                      )}

                      {/* Customer */}
                      <p className="font-body text-xs text-neutral-400 mb-3 truncate">
                        {project.customers?.name || project.email || 'No customer'}
                      </p>

                      {/* Bottom: Source + Plan + Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {project.source === 'landing_page' && (
                            <span className="font-body text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Lead
                            </span>
                          )}
                          {project.plan && (
                            <span className="font-body text-[10px] font-medium text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                              ${PLAN_PRICES[project.plan] || '—'}
                            </span>
                          )}
                          {project.paid && (
                            <span className="font-body text-[10px] font-medium text-emerald-600">✓ Paid</span>
                          )}
                        </div>
                        <span className="font-body text-[10px] text-neutral-400">{timeAgo(project.created_at)}</span>
                      </div>

                      {/* Quick contact for leads */}
                      {project.source === 'landing_page' && project.phone && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100" onClick={e => e.stopPropagation()}>
                          <a href={`sms:${project.phone}`} className="font-body text-[10px] text-emerald-600 hover:underline">💬 Text</a>
                          <a href={`mailto:${project.email}`} className="font-body text-[10px] text-neutral-500 hover:underline">✉️ Email</a>
                          <a href={`tel:${project.phone}`} className="font-body text-[10px] text-neutral-500 hover:underline">📞 Call</a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
