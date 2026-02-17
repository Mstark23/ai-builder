'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Project {
  id: string;
  business_name: string;
  industry: string;
  generated_html: string | null;
  status: string;
  metadata?: {
    variations?: {
      bold?: string;
      elegant?: string;
      dynamic?: string;
    };
    selected_variation?: string;
  } | null;
}

type Variation = 'bold' | 'elegant' | 'dynamic';

const VARIATION_META: Record<Variation, { label: string; desc: string; color: string; dot: string }> = {
  bold:    { label: 'Bold & Modern',    desc: 'High contrast, strong typography, commanding presence', color: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  elegant: { label: 'Clean & Elegant',  desc: 'Refined spacing, sophisticated feel, timeless design', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  dynamic: { label: 'Dynamic & Vibrant', desc: 'Eye-catching gradients, energetic layout, modern edge', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
};

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVariation, setActiveVariation] = useState<Variation>('bold');
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId]);

  // Block right-click
  useEffect(() => {
    const handler = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handler);
    return () => document.removeEventListener('contextmenu', handler);
  }, []);

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/preview/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      }
    } catch (err) {
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMaxWidth = () => {
    switch (viewMode) {
      case 'mobile': return '390px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const selectVariation = async () => {
    setSelecting(true);
    try {
      const res = await fetch('/api/preview/select-variation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, variation: activeVariation }),
      });
      if (res.ok) {
        // Redirect to needs form
        router.push(`/growth/${projectId}`);
      }
    } catch (err) {
      console.error('Error selecting variation:', err);
    } finally {
      setSelecting(false);
    }
  };

  // ── Loading / Error states ──
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #e5e5e5', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#999', fontSize: 14 }}>Loading preview...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 48, maxWidth: 400, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Project Not Found</h1>
          <p style={{ color: '#999' }}>This preview link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  // Get variation HTML — fallback to generated_html if no variations exist
  const variations = project.metadata?.variations;
  const hasVariations = variations && (variations.bold || variations.elegant || variations.dynamic);
  const currentHtml = hasVariations
    ? (variations[activeVariation] || '')
    : project.generated_html || '';
  const availableVariations = hasVariations
    ? (Object.keys(variations).filter(k => variations[k as Variation]) as Variation[])
    : [];

  if (!currentHtml && !hasVariations) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 48, maxWidth: 400, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ width: 64, height: 64, background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>⏳</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Preview Coming Soon</h1>
          <p style={{ color: '#999' }}>Your website is being built. Check back shortly.</p>
        </div>
      </div>
    );
  }

  const domain = 'www.' + project.business_name.toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com';

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f5f5f5; overflow-x: hidden; }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: '#000', padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontWeight: 700, fontSize: 16, fontFamily: "'Playfair Display', serif" }}>V</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
            Preview for <strong style={{ color: '#fff' }}>{project.business_name}</strong>
          </span>
        </div>

        {/* Variation Tabs */}
        {hasVariations && availableVariations.length > 1 && (
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 3 }}>
            {availableVariations.map((v) => {
              const meta = VARIATION_META[v];
              return (
                <button
                  key={v}
                  onClick={() => setActiveVariation(v)}
                  style={{
                    padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                    background: activeVariation === v ? '#fff' : 'transparent',
                    color: activeVariation === v ? '#000' : 'rgba(255,255,255,0.6)',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.dot.replace('bg-', '').replace('purple-500', '#8b5cf6').replace('emerald-500', '#10b981').replace('orange-500', '#f97316') }} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={selectVariation}
          disabled={selecting}
          style={{
            background: '#fff', color: '#000', padding: '9px 24px', borderRadius: 50,
            fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
            fontFamily: "'Inter', sans-serif", opacity: selecting ? 0.7 : 1,
          }}
        >
          {selecting ? 'Selecting...' : "Want This Live? Let's Talk →"}
        </button>
      </div>

      {/* ── BROWSER MOCKUP ── */}
      <div style={{ marginTop: 72, marginBottom: 100, maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto', padding: '0 24px' }}>
        {/* Browser chrome */}
        <div style={{
          background: '#e8e8e8', borderRadius: '12px 12px 0 0',
          padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div style={{
            flex: 1, background: '#fff', borderRadius: 6, padding: '5px 14px',
            fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13, flexShrink: 0 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>{domain}</span>
          </div>
          {/* Device Toggle */}
          <div style={{ display: 'flex', gap: 3, marginLeft: 8 }}>
            {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  background: viewMode === mode ? '#fff' : 'transparent',
                  border: `1px solid ${viewMode === mode ? '#999' : '#ccc'}`,
                  borderRadius: 6, padding: '3px 10px', cursor: 'pointer',
                  fontSize: 11, color: viewMode === mode ? '#000' : '#666',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {mode === 'desktop' ? '🖥' : mode === 'tablet' ? '📱' : '📲'}
              </button>
            ))}
          </div>
        </div>

        {/* Content iframe */}
        <div style={{
          background: '#fff', borderRadius: '0 0 12px 12px', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          transition: 'max-width 0.4s ease', margin: '0 auto',
          maxWidth: getMaxWidth(),
        }}>
          <iframe
            key={activeVariation}
            srcDoc={currentHtml}
            sandbox="allow-same-origin allow-scripts allow-popups"
            style={{ width: '100%', border: 0, display: 'block', height: '78vh' }}
            title={`${project.business_name} Preview - ${activeVariation}`}
          />
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div style={{
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '14px 28px', borderRadius: 50,
        display: 'flex', alignItems: 'center', gap: 16,
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        animation: 'fadeIn 0.5s ease',
      }}>
        {hasVariations && (
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500 }}>
            Viewing: <strong style={{ color: '#fff' }}>{VARIATION_META[activeVariation].label}</strong>
          </span>
        )}
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Love this design?</span>
        <button
          onClick={selectVariation}
          disabled={selecting}
          style={{
            background: '#fff', color: '#000', padding: '9px 24px', borderRadius: 50,
            fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {selecting ? 'Selecting...' : 'Want This Live? Book a Call →'}
        </button>
      </div>
    </>
  );
}
