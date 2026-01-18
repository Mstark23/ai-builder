'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Project = {
  id: string;
  business_name: string;
  industry: string;
  style: string;
  plan: string;
  description: string;
  website_goal: string;
  features: string[];
  inspirations: string | null;
  generated_html: string | null;
  preview_url: string | null;
  status: string;
  paid: boolean;
  feedback_notes: string | null;
  revision_count: number;
  created_at: string;
  customer_id: string;
  customers?: {
    name: string;
    email: string;
    phone: string;
    business_name: string;
  } | null;
};

type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadProject();
    loadEmployees();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, customers(name, email, phone, business_name)')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
      setPreviewUrl(data.preview_url || '');
    } catch (err) {
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const { data } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active');
      setEmployees(data || []);
    } catch (err) {
      console.log('Employees table may not exist');
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!project) return;
    setSaving(true);
    
    const updateData: any = { status: newStatus };
    if (newStatus === 'PAID') {
      updateData.paid = true;
    }
    
    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', project.id);

    if (!error) {
      setProject({ ...project, status: newStatus, paid: newStatus === 'PAID' ? true : project.paid });
      setMessage({ type: 'success', text: `Status updated to ${newStatus}` });
    }
    setSaving(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const markAsPaid = async () => {
    if (!project) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('projects')
      .update({ paid: true, status: 'PAID' })
      .eq('id', project.id);

    if (!error) {
      setProject({ ...project, paid: true, status: 'PAID' });
      setMessage({ type: 'success', text: 'Marked as paid!' });
    }
    setSaving(false);
  };

  const markAsDelivered = async () => {
    if (!project) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('projects')
      .update({ status: 'DELIVERED' })
      .eq('id', project.id);

    if (!error) {
      setProject({ ...project, status: 'DELIVERED' });
      setMessage({ type: 'success', text: 'Marked as delivered!' });
    }
    setSaving(false);
  };

  const savePreviewUrl = async () => {
    if (!project) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('projects')
      .update({ preview_url: previewUrl, status: 'PREVIEW_READY' })
      .eq('id', project.id);

    if (!error) {
      setProject({ ...project, preview_url: previewUrl, status: 'PREVIEW_READY' });
      setMessage({ type: 'success', text: 'Preview URL saved!' });
    }
    setSaving(false);
  };

  const deleteProject = async () => {
    if (!project) return;
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id);

    if (!error) {
      router.push('/admin/projects');
    }
  };

  const assignEmployee = async (employeeId: string) => {
    if (!project) return;
    
    try {
      await supabase
        .from('project_assignments')
        .insert({
          project_id: project.id,
          employee_id: employeeId,
        });
      
      setMessage({ type: 'success', text: 'Employee assigned!' });
      setShowAssignModal(false);
    } catch (err) {
      console.error('Error assigning employee:', err);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
      QUEUED: { label: 'Queued', color: 'text-amber-700', bg: 'bg-amber-100' },
      IN_PROGRESS: { label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-100' },
      PREVIEW_READY: { label: 'Preview Ready', color: 'text-purple-700', bg: 'bg-purple-100' },
      REVISION_REQUESTED: { label: 'Revision Requested', color: 'text-orange-700', bg: 'bg-orange-100' },
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
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <p className="font-body text-neutral-500">Project not found</p>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      <div className="p-8 lg:p-12">
        {/* HEADER */}
        <div className="mb-8">
          <Link href="/admin/projects" className="inline-flex items-center gap-2 font-body text-neutral-500 hover:text-black transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Projects</span>
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                <span className="text-white font-display text-2xl font-semibold">
                  {project.business_name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="font-display text-3xl font-medium text-black">{project.business_name}</h1>
                <p className="font-body text-neutral-500">{project.customers?.name || 'No customer'}</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full font-body text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* MESSAGE */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-body text-sm ${message.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>
              {message.text}
            </p>
          </div>
        )}

        {/* 🤖 AI GENERATION CTA */}
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🤖</span>
                <h2 className="font-display text-2xl font-medium">AI Website Generator</h2>
              </div>
              <p className="font-body text-white/80 max-w-lg">
                {project.generated_html 
                  ? 'Website generated! Click to view, edit, or regenerate with AI.'
                  : 'Generate a complete, professional website in seconds using AI. No coding required.'
                }
              </p>
            </div>
            <Link
              href={`/admin/projects/${project.id}/generate`}
              className="px-6 py-3 bg-white text-purple-600 font-body font-semibold rounded-xl hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>{project.generated_html ? 'Open AI Editor' : 'Generate Website'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* CUSTOMER FEEDBACK ALERT */}
        {project.feedback_notes && project.status === 'REVISION_REQUESTED' && (
          <div className="mb-8 bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-body font-semibold text-orange-900 mb-1">Customer Requested Revisions</h3>
                <p className="font-body text-orange-800">{project.feedback_notes}</p>
                <p className="font-body text-sm text-orange-600 mt-2">Revision #{project.revision_count || 1}</p>
              </div>
              <Link
                href={`/admin/projects/${project.id}/generate`}
                className="px-4 py-2 bg-orange-600 text-white font-body text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                🤖 Apply with AI
              </Link>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* STATUS UPDATE */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-display text-xl font-medium text-black mb-4">Update Status</h2>
              <div className="flex flex-wrap gap-2">
                {['QUEUED', 'IN_PROGRESS', 'PREVIEW_READY', 'REVISION_REQUESTED', 'PAID', 'DELIVERED'].map((status) => {
                  const config = getStatusConfig(status);
                  const isActive = project.status === status;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => updateStatus(status)}
                      disabled={saving || isActive}
                      className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-all ${
                        isActive 
                          ? `${config.bg} ${config.color} ring-2 ring-offset-2 ring-neutral-300`
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PREVIEW */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-display text-xl font-medium text-black mb-4">Website Preview</h2>
              
              {project.generated_html ? (
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <div className="bg-neutral-100 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/projects/${project.id}/generate`}
                        className="px-3 py-1 bg-purple-100 text-purple-700 font-body text-xs font-medium rounded-full hover:bg-purple-200"
                      >
                        ✨ Edit with AI
                      </Link>
                    </div>
                  </div>
                  <iframe
                    srcDoc={project.generated_html}
                    className="w-full h-[400px] border-0"
                    title="Website Preview"
                  />
                </div>
              ) : project.preview_url ? (
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <div className="bg-neutral-100 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <a href={project.preview_url} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-blue-600 hover:underline">
                      Open in new tab ↗
                    </a>
                  </div>
                  <iframe
                    src={project.preview_url}
                    className="w-full h-[400px] border-0"
                    title="Website Preview"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-neutral-200 rounded-xl p-12 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-body font-semibold text-black mb-2">No Preview Yet</h3>
                  <p className="font-body text-sm text-neutral-500 mb-4">Generate a website with AI or add a preview URL</p>
                  <Link
                    href={`/admin/projects/${project.id}/generate`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-body text-sm font-medium rounded-lg hover:bg-purple-700"
                  >
                    <span>🤖 Generate with AI</span>
                  </Link>
                </div>
              )}

              {/* Manual Preview URL */}
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <label className="font-body text-sm font-medium text-neutral-600 mb-2 block">Or add manual preview URL:</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    placeholder="https://preview.example.com"
                    className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-body text-sm focus:outline-none focus:border-black"
                  />
                  <button
                    onClick={savePreviewUrl}
                    disabled={saving}
                    className="px-4 py-2 bg-black text-white font-body text-sm font-medium rounded-lg hover:bg-black/80 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* PROJECT DETAILS */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-display text-xl font-medium text-black mb-4">Project Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-body text-xs text-neutral-500">Industry</label>
                  <p className="font-body text-black">{project.industry}</p>
                </div>
                <div>
                  <label className="font-body text-xs text-neutral-500">Style</label>
                  <p className="font-body text-black">{project.style}</p>
                </div>
                <div>
                  <label className="font-body text-xs text-neutral-500">Plan</label>
                  <p className="font-body text-black capitalize">{project.plan}</p>
                </div>
                <div>
                  <label className="font-body text-xs text-neutral-500">Created</label>
                  <p className="font-body text-black">
                    {new Date(project.created_at).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}
                  </p>
                </div>
                {project.description && (
                  <div className="md:col-span-2">
                    <label className="font-body text-xs text-neutral-500">Description</label>
                    <p className="font-body text-black">{project.description}</p>
                  </div>
                )}
                {project.website_goal && (
                  <div className="md:col-span-2">
                    <label className="font-body text-xs text-neutral-500">Website Goal</label>
                    <p className="font-body text-black">{project.website_goal}</p>
                  </div>
                )}
                {project.features && project.features.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="font-body text-xs text-neutral-500">Requested Features</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.features.map((f, i) => (
                        <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-700 font-body text-sm rounded-full">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.inspirations && (
                  <div className="md:col-span-2">
                    <label className="font-body text-xs text-neutral-500">Inspirations</label>
                    <p className="font-body text-black">{project.inspirations}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-display text-lg font-medium text-black mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href={`/admin/projects/${project.id}/generate`}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-purple-100 text-purple-700 font-body text-sm font-medium rounded-xl hover:bg-purple-200 transition-colors"
                >
                  <span>🤖</span>
                  <span>AI Website Generator</span>
                </Link>
                
                {!project.paid && (
                  <button
                    onClick={markAsPaid}
                    disabled={saving}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-100 text-emerald-700 font-body text-sm font-medium rounded-xl hover:bg-emerald-200 transition-colors disabled:opacity-50"
                  >
                    <span>💰</span>
                    <span>Mark as Paid</span>
                  </button>
                )}
                
                {project.paid && project.status !== 'DELIVERED' && (
                  <button
                    onClick={markAsDelivered}
                    disabled={saving}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-100 text-blue-700 font-body text-sm font-medium rounded-xl hover:bg-blue-200 transition-colors disabled:opacity-50"
                  >
                    <span>🚀</span>
                    <span>Mark as Delivered</span>
                  </button>
                )}

                <button
                  onClick={() => setShowAssignModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-100 text-neutral-700 font-body text-sm font-medium rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  <span>👤</span>
                  <span>Assign Team Member</span>
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 font-body text-sm font-medium rounded-xl hover:bg-red-100 transition-colors"
                >
                  <span>🗑️</span>
                  <span>Delete Project</span>
                </button>
              </div>
            </div>

            {/* CUSTOMER INFO */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-display text-lg font-medium text-black mb-4">Customer</h2>
              {project.customers ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white font-body font-semibold">
                        {project.customers.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-body font-medium text-black">{project.customers.name}</p>
                      <p className="font-body text-sm text-neutral-500">{project.customers.email}</p>
                    </div>
                  </div>
                  {project.customers.phone && (
                    <div>
                      <label className="font-body text-xs text-neutral-500">Phone</label>
                      <p className="font-body text-black">{project.customers.phone}</p>
                    </div>
                  )}
                  <a
                    href={`mailto:${project.customers.email}`}
                    className="block w-full px-4 py-2 bg-black text-white font-body text-sm font-medium rounded-xl text-center hover:bg-black/80 transition-colors"
                  >
                    Contact Customer
                  </a>
                </div>
              ) : (
                <p className="font-body text-neutral-500">No customer assigned</p>
              )}
            </div>

            {/* PAYMENT INFO */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-display text-lg font-medium text-black mb-4">Payment</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-neutral-500">Plan</span>
                  <span className="font-body font-medium text-black capitalize">{project.plan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-neutral-500">Price</span>
                  <span className="font-display text-xl font-semibold text-black">${getPlanPrice(project.plan)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-neutral-500">Status</span>
                  <span className={`px-3 py-1 rounded-full font-body text-sm font-medium ${
                    project.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {project.paid ? '✓ Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ASSIGN MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="font-display text-xl font-medium text-black mb-4">Assign Team Member</h2>
            {employees.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-body text-neutral-500 mb-4">No team members available</p>
                <Link href="/admin/employees" className="font-body text-blue-600 hover:underline">
                  Add employees first
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {employees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => assignEmployee(emp.id)}
                    className="w-full flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white font-body text-sm font-semibold">
                        {emp.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-body font-medium text-black">{emp.name}</p>
                      <p className="font-body text-xs text-neutral-500">{emp.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowAssignModal(false)}
              className="w-full mt-4 px-4 py-2 bg-neutral-100 text-neutral-700 font-body text-sm font-medium rounded-xl hover:bg-neutral-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="font-display text-xl font-medium text-black mb-2">Delete Project?</h2>
            <p className="font-body text-neutral-500 mb-6">
              This will permanently delete "{project.business_name}" and all associated data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-neutral-100 text-neutral-700 font-body text-sm font-medium rounded-xl hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={deleteProject}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-body text-sm font-medium rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}