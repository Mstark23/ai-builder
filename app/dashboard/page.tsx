'use client';

export default function DashboardPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '40px', background: '#0F172A', color: '#ffffff' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>
        Dashboard
      </h1>

      <p style={{ opacity: 0.7, marginBottom: '32px' }}>
        Welcome. This is where your website projects will appear.
      </p>

      <div
        style={{
          border: '1px dashed rgba(255,255,255,0.2)',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '600px'
        }}
      >
        <h2 style={{ marginBottom: '12px' }}>No projects yet</h2>
        <p style={{ opacity: 0.6 }}>
          Once a client submits their requirements, their project will appear here.
        </p>
      </div>
    </div>
  );
}
