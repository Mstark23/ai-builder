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
  description: string;
  website_goal: string;
  features: string[];
  inspirations: string | null;
  generated_html: string | null;
  preview_url: string | null;
  status: string;
  customers?: {
    name: string;
    email: string;
  } | null;
};

export default function AIGeneratePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [revising, setRevising] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [editInstruction, setEditInstruction] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, customers(name, email)')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      
      setProject(data);
      if (data.generated_html) {
        setPreviewHtml(data.generated_html);
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!project) return;
    
    setGenerating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          action: 'generate',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate website');
      }

      setPreviewHtml(data.html);
      setSuccess('Website generated successfully!');
      
      // Reload project to get updated data
      await loadProject();

    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate website');
    } finally {
      setGenerating(false);
    }
  };

  const handleQuickEdit = async () => {
    if (!project || !editInstruction.trim()) return;
    
    setRevising(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          action: 'quick-edit',
          instruction: editInstruction,
          currentHtml: previewHtml,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply edit');
      }

      setPreviewHtml(data.html);
      setEditInstruction('');
      setSuccess('Edit applied successfully!');
      
      await loadProject();

    } catch (err: any) {
      console.error('Edit error:', err);
      setError(err.message || 'Failed to apply edit');
    } finally {
      setRevising(false);
    }
  };

  const handleApplyRevisions = async () => {
    if (!project?.feedback_notes) return;
    
    setRevising(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          action: 'revise',
          feedback: project.feedback_notes,
          currentHtml: previewHtml,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply revisions');
      }

      setPreviewHtml(data.html);
      setSuccess('Revisions applied successfully!');
      
      // Clear feedback after applying
      await supabase
        .from('projects')
        .update({ feedback_notes: null, status: 'PREVIEW_READY' })
        .eq('id', project.id);
      
      await loadProject();

    } catch (err: any) {
      console.error('Revision error:', err);
      setError(err.message || 'Failed to apply revisions');
    } finally {
      setRevising(false);
    }
  };

  const handleSaveAndContinue = async () => {
    if (!project) return;

    try {
      await supabase
        .from('projects')
        .update({ 
          generated_html: previewHtml,
          status: 'PREVIEW_READY',
        })
        .eq('id', project.id);

      setSuccess('Preview saved! Customer can now view it.');
      
      // Redirect back to project detail
      setTimeout(() => {
        router.push(`/admin/projects/${project.id}`);
      }, 1500);

    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save preview');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-red-500">Project not found</p>
          <Link href="/admin/projects" className="font-body text-blue-500 mt-4 inline-block">
            Back to Projects
          </Link>
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

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-full px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href={`/admin/projects/${project.id}`}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="font-display text-xl font-medium text-black">
                  AI Website Generator
                </h1>
                <p className="font-body text-sm text-neutral-500">
                  {project.business_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {previewHtml && (
                <button
                  onClick={handleSaveAndContinue}
                  className="px-5 py-2 bg-emerald-600 text-white font-body text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors"
                >
                  Save & Mark Preview Ready
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MESSAGES */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="font-body text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="mx-6 mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="font-body text-sm text-emerald-700">{success}</p>
        </div>
      )}

      <div className="flex h-[calc(100vh-64px)]">
        {/* LEFT SIDEBAR - PROJECT INFO */}
        <div className="w-80 bg-white border-r border-neutral-200 overflow-y-auto p-6">
          {/* PROJECT DETAILS */}
          <div className="mb-6">
            <h2 className="font-display text-lg font-medium text-black mb-4">Project Details</h2>
            <div className="space-y-3">
              <div>
                <label className="font-body text-xs text-neutral-500">Business</label>
                <p className="font-body text-sm text-black">{project.business_name}</p>
              </div>
              <div>
                <label className="font-body text-xs text-neutral-500">Industry</label>
                <p className="font-body text-sm text-black">{project.industry}</p>
              </div>
              <div>
                <label className="font-body text-xs text-neutral-500">Style</label>
                <p className="font-body text-sm text-black">{project.style}</p>
              </div>
              <div>
                <label className="font-body text-xs text-neutral-500">Description</label>
                <p className="font-body text-sm text-black">{project.description || 'No description'}</p>
              </div>
              <div>
                <label className="font-body text-xs text-neutral-500">Goal</label>
                <p className="font-body text-sm text-black">{project.website_goal || 'No goal specified'}</p>
              </div>
              {project.features && project.features.length > 0 && (
                <div>
                  <label className="font-body text-xs text-neutral-500">Features</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.features.map((f, i) => (
                      <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-600 font-body text-xs rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CUSTOMER FEEDBACK */}
          {project.feedback_notes && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <label className="font-body text-sm font-medium text-orange-800">Customer Feedback</label>
              </div>
              <p className="font-body text-sm text-orange-700 mb-3">{project.feedback_notes}</p>
              <button
                onClick={handleApplyRevisions}
                disabled={revising || !previewHtml}
                className="w-full px-4 py-2 bg-orange-600 text-white font-body text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {revising ? 'Applying...' : '🤖 Apply Revisions with AI'}
              </button>
            </div>
          )}

          {/* GENERATE BUTTON */}
          <div className="mb-6">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full px-4 py-4 bg-black text-white font-body font-medium rounded-xl hover:bg-black/80 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating Website...</span>
                </>
              ) : (
                <>
                  <span>🤖</span>
                  <span>{previewHtml ? 'Regenerate Website' : 'Generate Website'}</span>
                </>
              )}
            </button>
            <p className="font-body text-xs text-neutral-400 text-center mt-2">
              AI will create a complete website based on project details
            </p>
          </div>

          {/* QUICK EDIT */}
          {previewHtml && (
            <div className="mb-6">
              <h3 className="font-body text-sm font-medium text-black mb-2">Quick AI Edit</h3>
              <textarea
                value={editInstruction}
                onChange={(e) => setEditInstruction(e.target.value)}
                placeholder="e.g., 'Make the header blue' or 'Add a testimonials section'"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-body text-sm resize-none h-20 focus:outline-none focus:border-black"
              />
              <button
                onClick={handleQuickEdit}
                disabled={revising || !editInstruction.trim()}
                className="w-full mt-2 px-4 py-2 bg-purple-600 text-white font-body text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {revising ? 'Applying...' : '✨ Apply Edit'}
              </button>
            </div>
          )}

          {/* QUICK ACTIONS */}
          {previewHtml && (
            <div>
              <h3 className="font-body text-sm font-medium text-black mb-2">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  'Change colors to blue theme',
                  'Make fonts larger',
                  'Add more white space',
                  'Make it more minimal',
                  'Add a contact form',
                  'Add testimonials section',
                ].map((action) => (
                  <button
                    key={action}
                    onClick={() => setEditInstruction(action)}
                    className="w-full px-3 py-2 bg-neutral-100 text-neutral-700 font-body text-xs rounded-lg hover:bg-neutral-200 transition-colors text-left"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MAIN - PREVIEW */}
        <div className="flex-1 flex flex-col">
          {/* TABS */}
          <div className="bg-white border-b border-neutral-200 px-6 py-2 flex items-center gap-4">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 font-body text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'preview' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 font-body text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'code' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              HTML Code
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-hidden">
            {!previewHtml ? (
              <div className="h-full flex items-center justify-center bg-neutral-100">
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-medium text-black mb-2">No Preview Yet</h3>
                  <p className="font-body text-neutral-500 mb-4">Click "Generate Website" to create a preview</p>
                </div>
              </div>
            ) : activeTab === 'preview' ? (
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full border-0"
                title="Website Preview"
              />
            ) : (
              <div className="h-full overflow-auto bg-neutral-900 p-6">
                <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                  {previewHtml}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}