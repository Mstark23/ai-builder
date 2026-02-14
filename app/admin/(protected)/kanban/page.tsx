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
  custom_price?: number;
  metadata?: {
    selected_variation?: string;
    client_needs?: {
      pages?: string[];
      features?: string[];
      addons?: string[];
      timeline?: string;
      budget?: string;
    };
    page_status?: Record<string, string>;
    preview_urls?: string[];
  } | null;
  customers?: { name: string; email: string } | null;
};

// ═══════════════════════════════════════
// NEW FLOW COLUMNS
// ═══════════════════════════════════════
const COLUMNS = [
  { id: 'pending', label: 'New Leads', color: 'border-red-400', bg: 'bg-red-50', dot: 'bg-red-500', match: ['pending'] },
  { id: 'preview_sent', label: 'Preview Sent', color: 'border-purple-400', bg: 'bg-purple-50', dot: 'bg-purple-500', match: ['preview_sent', 'PREVIEW_READY', 'preview', 'claimed', 'generating', 'IN_PROGRESS'] },
  { id: 'needs_submitted', label: 'Needs Submitted', color: 'border-amber-400', bg: 'bg-amber-50', dot: 'bg-amber-500', match: ['needs_submitted', 'needs_review'] },
  { id: 'paid', label: 'Paid — Building', color: 'border-emerald-400', bg: 'bg-emerald-50', dot: 'bg-emerald-500', match: ['paid', 'PAID', 'building'] },
  { id: 'review', label: 'Client Review', color: 'border-blue-400', bg: 'bg-blue-50', dot: 'bg-blue-500', match: ['review', 'client_review'] },
  { id: 'published', label: 'Published', color: 'border-cyan-500', bg: 'bg-cyan-50', dot: 'bg-cyan-500', match: ['published', 'DELIVERED', 'delivered'] },
];

const VAR_COLORS: Record<string, string> = { bold: 'bg-purple-500', elegant: 'bg-emerald-500', dynamic: 'bg-orange-500' };
const VAR_LABELS: Record<string, string> = { bold: 'Bold & Modern', elegant: 'Clean & Elegant', dynamic: 'Dynamic & Vibrant' };

export default function KanbanPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProjects(); }, []);

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

  const getProjectsByColumn = (col: typeof COLUMNS[number]) => projects.filter(p => col.match.includes(p.status));

  const handleDrop = async (newStatus: string) => {
    if (!draggedProject) return;
    const project = projects.find(p => p.id === draggedProject);
    if (!project) { setDraggedProject(null); return; }
    const targetCol = COLUMNS.find(c => c.id === newStatus);
    if (targetCol?.match.includes(project.status)) { setDraggedProject(null); return; }

    setSaving(true);
    setProjects(projects.map(p => p.id === draggedProject ? { ...p, status: newStatus } : p));
    try {
      const update: Record<string, any> = { status: newStatus };
      if (newStatus === 'paid') update.paid = true;
      await supabase.from('projects').update(update).eq('id', draggedProject);
    } catch (err) {
      console.error('Error:', err);
      loadProjects();
    } finally {
      setDraggedProject(null);
      setSaving(false);
    }
  };

  const timeAgo = (date: string) => {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return 'Just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  const pipelineValue = projects.filter(p => p.custom_price).reduce((sum, p) => sum + (p.custom_price || 0), 0);

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
    <div className="p-6 lg:p-8 h-screen flex flex-col">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        .kanban-card { cursor: grab; transition: all 0.15s ease; }
        .kanban-card:active { cursor: grabbing; transform: rotate(2deg) scale(1.02); }
      `}</style>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-black">Kanban Board</h1>
          <p className="font-body text-neutral-500 mt-1">Drag and drop to update project status</p>
        </div>
        <div className="flex items-center gap-3">
          {saving && <span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-body text-sm rounded-full animate-pulse">Saving...</span>}
          {pipelineValue > 0 && (
            <span className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-body text-sm font-semibold rounded-full">
              Pipeline: ${pipelineValue.toLocaleString()}
            </span>
          )}
          <Link href="/admin/projects" className="px-5 py-2.5 bg-white border border-neutral-200 text-black font-body text-sm font-medium rounded-full hover:bg-neutral-50 transition-all">
            List View
          </Link>
          <Link href="/admin/dashboard" className="px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-all">
            Dashboard
          </Link>
        </div>
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0">
        {COLUMNS.map((column) => {
          const colProjects = getProjectsByColumn(column);
          return (
            <div
              key={column.id}
              className={`flex-shrink-0 w-72 rounded-2xl border-t-4 ${column.color} bg-white border border-neutral-200 overflow-hidden flex flex-col`}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column Header */}
              <div className={`px-4 py-4 ${column.bg} border-b border-neutral-200 flex-shrink-0`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${column.dot}`} />
                    <h3 className="font-body font-semibold text-black text-sm">{column.label}</h3>
                  </div>
                  <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center font-body text-xs font-medium text-black shadow-sm">
                    {colProjects.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto min-h-[200px]">
                {colProjects.length === 0 ? (
                  <div className="p-4 border-2 border-dashed border-neutral-200 rounded-xl text-center">
                    <p className="font-body text-sm text-neutral-400">Drop projects here</p>
                  </div>
                ) : (
                  colProjects.map((project) => {
                    const variation = project.metadata?.selected_variation;
                    const needs = project.metadata?.client_needs;
                    const pageStatus = project.metadata?.page_status;
                    const totalPages = needs?.pages?.length || 0;
                    const approvedPages = pageStatus ? Object.values(pageStatus).filter(s => s === 'approved').length : 0;

                    return (
                      <div
                        key={project.id}
                        draggable
                        onDragStart={() => setDraggedProject(project.id)}
                        className={`kanban-card bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-md ${draggedProject === project.id ? 'opacity-50' : ''}`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            project.source === 'landing_page' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-black'
                          }`}>
                            <span className="text-white font-body text-sm font-semibold">
                              {project.business_name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <Link href={`/admin/projects/${project.id}`} className="font-body text-xs text-neutral-400 hover:text-black transition-colors" onClick={e => e.stopPropagation()}>
                            View →
                          </Link>
                        </div>

                        <h4 className="font-body font-semibold text-sm text-black mb-1 truncate">{project.business_name}</h4>

                        {(project.industry || project.website_type) && (
                          <p className="font-body text-xs text-neutral-500 mb-2 truncate">
                            {[project.industry, project.website_type].filter(Boolean).join(' · ')}
                          </p>
                        )}

                        {/* Design variation */}
                        {variation && (
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className={`w-2 h-2 rounded-full ${VAR_COLORS[variation] || 'bg-neutral-400'}`} />
                            <span className="font-body text-[10px] text-neutral-500 font-medium">{VAR_LABELS[variation] || variation}</span>
                          </div>
                        )}

                        {/* Needs chips */}
                        {needs && needs.pages && needs.pages.length > 0 && (
                          <div className="flex items-center gap-1 mb-2 flex-wrap">
                            <span className="font-body text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">{needs.pages.length} pages</span>
                            {needs.features && <span className="font-body text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-medium">{needs.features.length} feat</span>}
                            {needs.addons && <span className="font-body text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">{needs.addons.length} add-ons</span>}
                          </div>
                        )}

                        {/* Page progress */}
                        {totalPages > 0 && (column.id === 'paid' || column.id === 'review') && (
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-body text-[10px] text-neutral-400">Pages</span>
                              <span className="font-body text-[10px] text-neutral-500 font-medium">{approvedPages}/{totalPages}</span>
                            </div>
                            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all" style={{ width: `${totalPages > 0 ? (approvedPages / totalPages) * 100 : 0}%` }} />
                            </div>
                          </div>
                        )}

                        {/* Bottom */}
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 mt-1">
                          <div className="flex items-center gap-1.5">
                            {project.source === 'landing_page' && <span className="font-body text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Lead</span>}
                            {project.custom_price ? (
                              <span className="font-body text-[10px] font-semibold text-emerald-600">${project.custom_price.toLocaleString()}</span>
                            ) : project.plan ? (
                              <span className="font-body text-[10px] font-medium text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">{project.plan}</span>
                            ) : null}
                            {project.paid && <span className="font-body text-[10px] font-medium text-emerald-600">✓ Paid</span>}
                          </div>
                          <span className="font-body text-[10px] text-neutral-400">{timeAgo(project.created_at)}</span>
                        </div>

                        {/* Quick contact for new leads */}
                        {column.id === 'pending' && project.phone && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100" onClick={e => e.stopPropagation()}>
                            <a href={`sms:${project.phone}`} className="font-body text-[10px] text-emerald-600 hover:underline">💬 Text</a>
                            <a href={`mailto:${project.email}`} className="font-body text-[10px] text-neutral-500 hover:underline">✉️ Email</a>
                            <a href={`tel:${project.phone}`} className="font-body text-[10px] text-neutral-500 hover:underline">📞 Call</a>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
