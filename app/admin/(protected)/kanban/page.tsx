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
  customers?: {
    name: string;
    email: string;
  } | null;
};

const COLUMNS = [
  { id: 'QUEUED', label: 'Queued', color: 'border-amber-400', bg: 'bg-amber-50' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-400', bg: 'bg-blue-50' },
  { id: 'PREVIEW_READY', label: 'Preview Ready', color: 'border-purple-400', bg: 'bg-purple-50' },
  { id: 'PAID', label: 'Paid', color: 'border-emerald-400', bg: 'bg-emerald-50' },
  { id: 'DELIVERED', label: 'Delivered', color: 'border-emerald-600', bg: 'bg-emerald-100' },
];

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

      if (data) {
        setProjects(data);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
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

    // Optimistic update
    setProjects(projects.map(p => 
      p.id === draggedProject ? { ...p, status: newStatus } : p
    ));

    // Update in database
    const updateData: any = { status: newStatus };
    if (newStatus === 'PAID') {
      updateData.paid = true;
    }

    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', draggedProject);

    if (error) {
      console.error('Error updating project:', error);
      // Revert on error
      loadProjects();
    }

    setDraggedProject(null);
    setSaving(false);
  };

  const getProjectsByStatus = (status: string) => {
    return projects.filter(p => p.status === status);
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

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading kanban...</p>
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
        
        .kanban-card {
          cursor: grab;
          transition: all 0.2s ease;
        }
        
        .kanban-card:active {
          cursor: grabbing;
          transform: rotate(2deg) scale(1.02);
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }
        
        .kanban-column.drag-over {
          background: rgba(0,0,0,0.03);
        }
      `}</style>

      <div className="p-8 lg:p-12">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 font-body text-neutral-500 hover:text-black transition-colors mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="font-display text-4xl font-medium text-black">Kanban Board</h1>
            <p className="font-body text-neutral-500 mt-1">Drag and drop to update project status</p>
          </div>
          <div className="flex items-center gap-3">
            {saving && (
              <span className="px-4 py-2 bg-blue-100 text-blue-700 font-body text-sm rounded-full">
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

        {/* KANBAN BOARD */}
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
                {/* COLUMN HEADER */}
                <div className={`px-4 py-4 ${column.bg} border-b border-neutral-200`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-body font-semibold text-black">{column.label}</h3>
                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center font-body text-sm font-medium text-black shadow-sm">
                      {columnProjects.length}
                    </span>
                  </div>
                </div>

                {/* CARDS */}
                <div className="p-3 space-y-3 min-h-[400px]">
                  {columnProjects.length === 0 ? (
                    <div className="p-4 border-2 border-dashed border-neutral-200 rounded-xl text-center">
                      <p className="font-body text-sm text-neutral-400">
                        Drop projects here
                      </p>
                    </div>
                  ) : (
                    columnProjects.map((project) => (
                      <div
                        key={project.id}
                        draggable
                        onDragStart={() => handleDragStart(project.id)}
                        className={`kanban-card bg-white rounded-xl border border-neutral-200 p-4 ${
                          draggedProject === project.id ? 'opacity-50' : ''
                        }`}
                      >
                        {/* PROJECT HEADER */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-body text-sm font-semibold">
                              {project.business_name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <span className="font-body text-xs text-neutral-400">
                            {timeAgo(project.created_at)}
                          </span>
                        </div>

                        {/* PROJECT NAME */}
                        <h4 className="font-body font-semibold text-black text-sm mb-1 line-clamp-1">
                          {project.business_name}
                        </h4>
                        <p className="font-body text-xs text-neutral-500 mb-3">
                          {project.customers?.name || 'No customer'}
                        </p>

                        {/* FOOTER */}
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                          <span className="font-body text-xs font-medium text-neutral-600 capitalize">
                            {project.plan}
                          </span>
                          <div className="flex items-center gap-2">
                            {project.paid ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-body text-xs font-medium">
                                Paid
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-body text-xs font-medium">
                                Unpaid
                              </span>
                            )}
                            <span className="font-body text-xs font-semibold text-black">
                              ${getPlanPrice(project.plan)}
                            </span>
                          </div>
                        </div>

                        {/* QUICK LINK */}
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="mt-3 block w-full px-3 py-2 bg-neutral-100 text-black font-body text-xs font-medium rounded-lg text-center hover:bg-neutral-200 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* LEGEND */}
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <p className="font-body text-sm text-neutral-500">Status:</p>
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${col.color.replace('border-', 'bg-')}`}></div>
              <span className="font-body text-sm text-neutral-600">{col.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
