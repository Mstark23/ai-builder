'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Project {
  id: string;
  business_name: string;
  generated_html: string | null;
  generated_pages: Record<string, string> | null;
  requested_pages: string[] | null;
  status: string;
  plan: string;
}

export default function CustomerPreview() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId]);

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

  // Block right-click
  useEffect(() => {
    const handler = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handler);
    return () => document.removeEventListener('contextmenu', handler);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
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
      <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 48, maxWidth: 400, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Project Not Found</h1>
          <p style={{ color: '#999' }}>This preview link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const html = project.generated_html;

  if (!html) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 48, maxWidth: 400, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ width: 64, height: 64, background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>&#9202;</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Preview Coming Soon</h1>
          <p style={{ color: '#999' }}>Your website is being built. Check back shortly.</p>
        </div>
      </div>
    );
  }

  // Build domain from business name
  const domain = 'www.' + project.business_name.toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com';

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f5f5f5; overflow-x: hidden; }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* TOP BAR */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: '#000', padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, background: '#fff', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#000', fontWeight: 700, fontSize: 18 }}>V</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
            Preview by <strong style={{ color: '#fff' }}>VektorLabs</strong>
          </span>
        </div>
        <a
          href={`/register?project=${projectId}`}
          style={{
            background: '#fff', color: '#000', padding: '10px 28px', borderRadius: 50,
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}
        >
          I Want This Website →
        </a>
      </div>

      {/* BROWSER MOCKUP */}
      <div style={{ marginTop: 80, marginBottom: 100, maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto', padding: '0 24px' }}>
        <div style={{
          background: '#e8e8e8', borderRadius: '12px 12px 0 0',
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          {/* Dots */}
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
          </div>

          {/* URL Bar */}
          <div style={{
            flex: 1, background: '#fff', borderRadius: 6, padding: '6px 14px',
            fontSize: 13, color: '#999', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14, flexShrink: 0 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>{domain}</span>
          </div>

          {/* Device Toggle */}
          <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
            {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  background: viewMode === mode ? '#fff' : 'transparent',
                  border: `1px solid ${viewMode === mode ? '#999' : '#ccc'}`,
                  borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
                  fontSize: 12, color: viewMode === mode ? '#000' : '#666',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Frame */}
        <div style={{
          background: '#fff', borderRadius: '0 0 12px 12px', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          transition: 'max-width 0.4s ease', margin: '0 auto',
          maxWidth: getMaxWidth(),
        }}>
          <iframe
            srcDoc={html}
            sandbox="allow-same-origin allow-scripts allow-popups"
            style={{ width: '100%', border: 0, display: 'block', height: '75vh' }}
            title="Website Preview"
          />
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
        background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 32px', borderRadius: 50,
        display: 'flex', alignItems: 'center', gap: 20,
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500 }}>
          Love this design?
        </span>
        <a
          href={`/register?project=${projectId}`}
          style={{
            background: '#fff', color: '#000', padding: '10px 28px', borderRadius: 50,
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}
        >
          Get This Website →
        </a>
      </div>
    </>
  );
}
