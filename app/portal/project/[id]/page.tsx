// /app/portal/project/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import GrowthUpsell from '@/components/GrowthUpsell';

// ============================================
// ICON COMPONENTS
// ============================================
const Icon = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    {children}
  </svg>
);

const Icons = {
  Clock: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>,
  Monitor: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12" /></Icon>,
  Eye: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></Icon>,
  Hammer: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></Icon>,
  CheckCircle: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>,
  Globe: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></Icon>,
  Send: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></Icon>,
  X: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>,
  Moon: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></Icon>,
  Sun: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></Icon>,
  Pin: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></Icon>,
  Smartphone: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></Icon>,
  Tablet: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" /></Icon>,
  Desktop: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12" /></Icon>,
  Gift: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></Icon>,
  ExternalLink: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></Icon>,
  Download: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></Icon>,
  Share: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></Icon>,
  ArrowLeft: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>,
  TrendingUp: () => <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></Icon>,
};

// ============================================
// CONFETTI COMPONENT
// ============================================
interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
}

const Confetti = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${p.left}%`,
            top: -20,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ============================================
// STATUS CONFIGS
// ============================================
const statusConfig = {
  QUEUED: { label: 'In Queue', color: 'text-amber-700', bg: 'bg-amber-100', icon: '⏳', progress: 10 },
  IN_PROGRESS: { label: 'Creating Preview', color: 'text-blue-700', bg: 'bg-blue-100', icon: '🎨', progress: 40 },
  PREVIEW_READY: { label: 'Preview Ready', color: 'text-purple-700', bg: 'bg-purple-100', icon: '👁️', progress: 60 },
  REVISION_REQUESTED: { label: 'Revision Requested', color: 'text-orange-700', bg: 'bg-orange-100', icon: '✏️', progress: 50 },
  PAID: { label: 'Paid - Setup Required', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '✅', progress: 70 },
  BUILDING: { label: 'Building Your Website', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: '🔨', progress: 85 },
  DELIVERED: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '🚀', progress: 100 },
};

const getStatusColors = (s: string) => {
  const colors: Record<string, { bg: string; light: string }> = {
    QUEUED: { bg: 'bg-amber-500', light: 'bg-amber-100 text-amber-700' },
    IN_PROGRESS: { bg: 'bg-blue-500', light: 'bg-blue-100 text-blue-700' },
    PREVIEW_READY: { bg: 'bg-purple-500', light: 'bg-purple-100 text-purple-700' },
    REVISION_REQUESTED: { bg: 'bg-orange-500', light: 'bg-orange-100 text-orange-700' },
    PAID: { bg: 'bg-emerald-500', light: 'bg-emerald-100 text-emerald-700' },
    BUILDING: { bg: 'bg-indigo-500', light: 'bg-indigo-100 text-indigo-700' },
    DELIVERED: { bg: 'bg-green-500', light: 'bg-green-100 text-green-700' }
  };
  return colors[s] || colors.QUEUED;
};

const planPrices: Record<string, number> = {
  starter: 299, landing: 299,
  professional: 599, service: 599,
  premium: 799,
  enterprise: 999, ecommerce: 999,
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function DynamicProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  // Data state
  const [project, setProject] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [darkMode, setDarkMode] = useState(false);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showChat, setShowChat] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotations, setAnnotations] = useState<{ id: number; x: number; y: number }[]>([]);

  // Form state
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // Growth Upsell state
  const [showUpsell, setShowUpsell] = useState(true);
  const [hasGrowthPackages, setHasGrowthPackages] = useState(false);

  // Theme
  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: darkMode ? 'text-white' : 'text-gray-900',
    muted: darkMode ? 'text-gray-400' : 'text-gray-500',
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'
  };

  // ============================================
  // DATA LOADING
  // ============================================
  useEffect(() => {
    loadProject();
  }, [projectId]);

  useEffect(() => {
    if (project?.status === 'DELIVERED') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [project?.status]);

  const loadProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (!projectData) {
        router.push('/portal');
        return;
      }

      setProject(projectData);

      // If status indicates HTML should exist but it's missing (RLS may block large columns),
      // fetch via API route which uses service role
      if (projectData.status === 'PREVIEW_READY' && !projectData.generated_html) {
        try {
          const previewRes = await fetch(`/api/preview/${projectId}`);
          if (previewRes.ok) {
            const previewData = await previewRes.json();
            if (previewData.project?.generated_html) {
              projectData.generated_html = previewData.project.generated_html;
              setProject({ ...projectData });
            }
          }
        } catch (e) {
          console.error('Fallback preview fetch failed:', e);
        }
      }

      // Check if project has growth packages
      // TODO: Replace with actual database check
      const { data: growthData } = await supabase
        .from('growth_packages')
        .select('id')
        .eq('project_id', projectId)
        .limit(1);
      
      // FIX: Ensure boolean value (not null)
      setHasGrowthPackages(!!(growthData && growthData.length > 0));

      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (messagesData) {
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ACTIONS
  // ============================================
  const requestRevision = async () => {
    if (!revisionNotes.trim()) return;
    setSubmitting(true);

    try {
      // Include annotations in the revision request
      const annotationText = annotations.length > 0 
        ? `\n\n📍 Feedback pins added: ${annotations.length} locations marked on preview.`
        : '';

      await supabase
        .from('projects')
        .update({ 
          status: 'REVISION_REQUESTED',
          revision_notes: revisionNotes + annotationText,
        })
        .eq('id', projectId);

      await supabase.from('messages').insert({
        project_id: projectId,
        content: `📝 Revision Request: ${revisionNotes}${annotationText}`,
        sender_type: 'customer',
        read: false,
      });

      setShowRevisionModal(false);
      setRevisionNotes('');
      setAnnotations([]);
      loadProject();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const approveAndPay = () => {
    router.push(`/portal/project/${projectId}/checkout`);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await supabase.from('messages').insert({
        project_id: projectId,
        content: newMessage,
        sender_type: 'customer',
        read: false,
      });

      setMessages([
        {
          id: Date.now(),
          content: newMessage,
          sender_type: 'customer',
          created_at: new Date().toISOString(),
        },
        ...messages,
      ]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const addAnnotation = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!annotationMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setAnnotations([...annotations, { id: Date.now(), x, y }]);
  };

  const handleGrowthUpsell = async (packages: string[]) => {
    // Growth packages payment - coming soon
    alert('Growth packages coming soon! Message us to learn more.');
  };

  const getStatus = () => statusConfig[project?.status as keyof typeof statusConfig] || statusConfig.QUEUED;

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={theme.muted}>Loading project...</p>
        </div>
      </div>
    );
  }

  const status = getStatus();
  const price = planPrices[project?.plan] || 0;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className={`min-h-screen ${theme.bg} transition-colors`}>
      {showConfetti && <Confetti />}

      {/* HEADER */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-black'} text-white py-3 px-4 sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/portal" className="flex items-center gap-2 hover:opacity-80 transition">
            <Icons.ArrowLeft />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden sm:block">{project?.business_name}</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              {darkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-6xl mx-auto">
        {/* TIMELINE */}
        <div className={`${theme.card} rounded-2xl border p-4 mb-6`}>
          <div className="flex items-center justify-between relative">
            <div className={`absolute top-4 left-8 right-8 h-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div 
              className="absolute top-4 left-8 h-1 bg-emerald-500 transition-all duration-500" 
              style={{ width: `${Math.min(status.progress, 100) * 0.84}%` }} 
            />
            {['Queued', 'Preview', 'Paid', 'Building', 'Delivered'].map((label, i) => {
              const stepProgress = (i + 1) * 20;
              const isComplete = status.progress >= stepProgress;
              const isCurrent = status.progress >= stepProgress - 10 && status.progress < stepProgress + 10;
              return (
                <div key={label} className="flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isComplete ? 'bg-emerald-500 text-white' : 
                    isCurrent ? 'bg-indigo-500 text-white animate-pulse' : 
                    darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isComplete ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-2 ${isComplete || isCurrent ? theme.text : theme.muted}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-3 space-y-6">
            {/* PROJECT HEADER CARD */}
            <div className={`${theme.card} rounded-2xl border overflow-hidden`}>
              <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-700 relative">
                <div className="absolute bottom-3 left-4 flex items-end gap-3">
                  <div className={`w-14 h-14 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl flex items-center justify-center shadow-lg border-2 border-white`}>
                    <span className={`font-bold text-xl ${theme.text}`}>
                      {project?.business_name?.charAt(0) || 'P'}
                    </span>
                  </div>
                  <div className="pb-1">
                    <h1 className="text-lg font-bold text-white">{project?.business_name}</h1>
                    <p className="text-white/60 text-xs capitalize">{project?.plan} Plan · ${price}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColors(project?.status).light}`}>
                    {status.icon} {status.label}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================ */}
            {/* STATUS: QUEUED */}
            {/* ============================================ */}
            {project?.status === 'QUEUED' && (
              <div className={`${theme.card} rounded-2xl border p-8 text-center`}>
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.Clock />
                </div>
                <h2 className={`text-xl font-bold ${theme.text} mb-2`}>You're in the Queue!</h2>
                <p className={`${theme.muted} text-sm mb-6`}>Our team will start your preview soon.</p>
                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                  {[{ l: 'Position', v: '#3' }, { l: 'Status', v: 'Queued' }, { l: 'On-time', v: '98%' }].map((s) => (
                    <div key={s.l} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-3`}>
                      <p className={`text-xl font-bold ${theme.text}`}>{s.v}</p>
                      <p className={`text-xs ${theme.muted}`}>{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* STATUS: IN_PROGRESS */}
            {/* ============================================ */}
            {project?.status === 'IN_PROGRESS' && (
              <div className={`${theme.card} rounded-2xl border p-8 text-center`}>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Icons.Monitor />
                </div>
                <h2 className={`text-xl font-bold ${theme.text} mb-2`}>Creating Your Preview!</h2>
                <p className={`${theme.muted} text-sm mb-6`}>Our designers are working on it.</p>
                <div className="max-w-xs mx-auto">
                  <div className="flex justify-between text-sm mb-2">
                    <span className={theme.muted}>Progress</span>
                    <span className={`font-bold ${theme.text}`}>65%</span>
                  </div>
                  <div className={`h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* STATUS: PREVIEW_READY */}
            {/* ============================================ */}
            {project?.status === 'PREVIEW_READY' && !project?.paid && (
              <div className="space-y-6">
                {/* Device Preview */}
                <div className={`${theme.card} rounded-2xl border overflow-hidden`}>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-3 flex items-center gap-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className={`flex-1 ${darkMode ? 'bg-gray-600' : 'bg-white'} rounded-lg px-3 py-1.5 text-xs ${theme.muted}`}>
                      {project?.preview_url || 'preview.vektorlabs.com/' + project?.business_name?.toLowerCase().replace(/\s+/g, '-')}
                    </div>
                    
                    {/* Device Switcher */}
                    <div className={`flex gap-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} p-1 rounded-lg`}>
                      {[
                        { id: 'desktop' as const, icon: <Icons.Desktop /> },
                        { id: 'tablet' as const, icon: <Icons.Tablet /> },
                        { id: 'mobile' as const, icon: <Icons.Smartphone /> }
                      ].map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setDeviceView(d.id)}
                          className={`p-1.5 rounded-md transition ${
                            deviceView === d.id ? (darkMode ? 'bg-gray-800 text-white' : 'bg-white shadow text-gray-900') : theme.muted
                          }`}
                        >
                          {d.icon}
                        </button>
                      ))}
                    </div>

                    {/* Annotation Toggle */}
                    <button
                      onClick={() => setAnnotationMode(!annotationMode)}
                      className={`p-1.5 rounded-lg transition ${annotationMode ? 'bg-red-500 text-white' : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}
                      title="Add feedback pins"
                    >
                      <Icons.Pin />
                    </button>
                  </div>
                  
                  {/* Preview Area */}
                  <div 
                    className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} p-6 flex items-center justify-center relative cursor-${annotationMode ? 'crosshair' : 'default'}`}
                    style={{ minHeight: '400px' }}
                    onClick={addAnnotation}
                  >
                    {project?.preview_url ? (
                      <iframe
                        src={project.preview_url}
                        className={`bg-white rounded-lg shadow-xl transition-all duration-300 ${
                          deviceView === 'desktop' ? 'w-full h-[500px]' : 
                          deviceView === 'tablet' ? 'w-[70%] h-[500px]' : 
                          'w-[375px] h-[667px]'
                        }`}
                        title="Website Preview"
                      />
                    ) : project?.generated_html ? (
                      <iframe
                        srcDoc={project.generated_html}
                        className={`bg-white rounded-lg shadow-xl transition-all duration-300 ${
                          deviceView === 'desktop' ? 'w-full h-[500px]' : 
                          deviceView === 'tablet' ? 'w-[70%] h-[500px]' : 
                          'w-[375px] h-[667px]'
                        }`}
                        title="Website Preview"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
                      />
                    ) : (
                      <div 
                        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl transition-all duration-300 flex flex-col items-center justify-center p-8`}
                        style={{
                          width: deviceView === 'desktop' ? '100%' : deviceView === 'tablet' ? '70%' : '40%',
                          minHeight: '300px'
                        }}
                      >
                        <div className={`w-20 h-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl flex items-center justify-center mb-4`}>
                          <span className={`font-bold text-3xl ${theme.text}`}>{project?.business_name?.charAt(0)}</span>
                        </div>
                        <p className={`font-semibold ${theme.text} text-lg`}>{project?.business_name}</p>
                        <p className={`text-sm ${theme.muted} mt-1`}>{deviceView} preview</p>
                      </div>
                    )}

                    {/* Annotations */}
                    {annotations.map((ann, i) => (
                      <div
                        key={ann.id}
                        className="absolute z-20 group"
                        style={{ left: `${ann.x}%`, top: `${ann.y}%`, transform: 'translate(-50%, -50%)' }}
                      >
                        <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce">
                          {i + 1}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAnnotations(annotations.filter(a => a.id !== ann.id));
                          }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                        >
                          <Icons.X />
                        </button>
                      </div>
                    ))}

                    {annotationMode && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                        Click anywhere to add feedback pin
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Card */}
                <div className={`${theme.card} rounded-2xl border p-6`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h3 className={`font-bold text-lg ${theme.text}`}>Your Preview is Ready!</h3>
                      <p className={`text-sm ${theme.muted}`}>Review and approve to proceed</p>
                      {annotations.length > 0 && (
                        <p className="text-sm text-red-500 mt-1 font-medium">{annotations.length} feedback pin(s) added</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-xs ${theme.muted}`}>Total</p>
                      <p className={`text-3xl font-bold ${theme.text}`}>${price}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={approveAndPay}
                      className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
                    >
                      ✓ Approve & Pay ${price}
                    </button>
                    <button 
                      onClick={() => setShowRevisionModal(true)}
                      className={`px-6 py-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${theme.text} rounded-xl font-medium transition`}
                    >
                      Request Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* STATUS: PAID (Setup Required) */}
            {/* ============================================ */}
            {project?.status === 'PAID' && !project?.setup_completed && (
              <div className={`${theme.card} rounded-2xl border p-8`}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.CheckCircle />
                  </div>
                  <h2 className={`text-xl font-bold ${theme.text} mb-2`}>Payment Successful!</h2>
                  <p className={`${theme.muted} text-sm max-w-md mx-auto`}>
                    Thank you! We need a few things from you before we can build and deploy your website.
                  </p>
                </div>

                {project?.platform && (
                  <div className={`flex items-center justify-center gap-2 mb-6 py-3 px-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-neutral-50'}`}>
                    <span className="text-lg">
                      {project.platform === 'shopify' ? '🛒' : project.platform === 'wordpress' ? '📝' : project.platform === 'squarespace' ? '⬛' : project.platform === 'wix' ? '✨' : project.platform === 'webflow' ? '🎨' : project.platform === 'custom' ? '🌐' : '🤔'}
                    </span>
                    <span className={`text-sm font-medium ${theme.text} capitalize`}>{project.platform === 'custom' ? 'We handle hosting' : `Deploying to ${project.platform}`}</span>
                    {project.platform !== 'custom' && project.platform !== 'undecided' && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">Credentials needed</span>
                    )}
                  </div>
                )}

                <div className={`space-y-3 mb-6 max-w-sm mx-auto text-left ${theme.text}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">1</span>
                    <span className="text-sm">Your logo & brand images</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
                    <span className="text-sm">Business content (about, services, etc.)</span>
                  </div>
                  {project?.platform && project.platform !== 'custom' && project.platform !== 'undecided' && (
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</span>
                      <span className="text-sm font-medium">Platform access credentials</span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <Link
                    href={`/portal/project/${projectId}/setup`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition"
                  >
                    Complete Setup & Send Credentials
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <p className={`${theme.muted} text-xs mt-3`}>Takes about 5 minutes</p>
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* STATUS: BUILDING */}
            {/* ============================================ */}
            {(project?.status === 'BUILDING' || (project?.status === 'PAID' && project?.setup_completed)) && (
              <div className={`${theme.card} rounded-2xl border p-8 text-center`}>
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Icons.Hammer />
                </div>
                <h2 className={`text-xl font-bold ${theme.text} mb-2`}>Building Your Website!</h2>
                <p className={`${theme.muted} text-sm mb-6`}>Track progress below.</p>
                <div className="max-w-sm mx-auto space-y-2">
                  {['Setup', 'Design', 'Development', 'Testing', 'Launch'].map((step, i) => (
                    <div key={step} className={`flex items-center gap-3 p-3 rounded-xl ${i === 2 ? (darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50') : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i < 2 ? 'bg-emerald-500 text-white' : i === 2 ? 'bg-indigo-500 text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {i < 2 ? '✓' : i + 1}
                      </div>
                      <span className={`text-sm ${i < 2 ? 'text-emerald-600 font-medium' : i === 2 ? 'text-indigo-600 font-medium' : theme.muted}`}>{step}</span>
                    </div>
                  ))}
                </div>
                <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full`}>
                  <span className={`text-sm ${theme.muted}`}>Estimated delivery:</span>
                  <span className={`text-sm font-medium ${theme.text}`}>3-5 business days</span>
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* STATUS: DELIVERED */}
            {/* ============================================ */}
            {project?.status === 'DELIVERED' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.CheckCircle />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Your Website is Live! 🎉</h2>
                  <p className="text-white/80 mb-6">Congratulations on your new website!</p>
                  {project?.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-medium rounded-xl hover:bg-white/90 transition"
                    >
                      Visit Your Website
                      <Icons.ExternalLink />
                    </a>
                  )}
                </div>

                {/* ============================================ */}
                {/* GROWTH UPSELL - POST DELIVERY */}
                {/* ============================================ */}
                {!hasGrowthPackages && showUpsell && (
                  <div className="mt-8">
                    <GrowthUpsell 
                      businessName={project.business_name}
                      projectId={project.id}
                      context="post-delivery"
                      onAddToOrder={handleGrowthUpsell}
                      onSkip={() => setShowUpsell(false)}
                    />
                  </div>
                )}

                {/* What's Included */}
                <div className={`${theme.card} rounded-2xl border p-6`}>
                  <h3 className={`font-bold ${theme.text} mb-4`}>What&apos;s Included</h3>
                  <div className="space-y-3">
                    {[
                      { icon: '✓', text: 'Complete website files (HTML, CSS, JS)' },
                      { icon: '✓', text: 'Mobile-responsive design' },
                      { icon: '✓', text: 'SEO-optimized structure' },
                      { icon: '✓', text: 'All images and assets' },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">{item.icon}</span>
                        <span className={`text-sm ${theme.muted}`}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <Link href={`/portal/messages?project=${projectId}`} className={`${theme.card} rounded-2xl border p-6 text-center hover:shadow-lg transition`}>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icons.Download />
                    </div>
                    <h4 className={`font-semibold ${theme.text} mb-1`}>Get Your Files</h4>
                    <p className={`text-xs ${theme.muted}`}>Message us for your website files</p>
                  </Link>

                  <Link href={`/portal/messages?project=${projectId}`} className={`${theme.card} rounded-2xl border p-6 text-center hover:shadow-lg transition`}>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icons.Send />
                    </div>
                    <h4 className={`font-semibold ${theme.text} mb-1`}>Need Changes?</h4>
                    <p className={`text-xs ${theme.muted}`}>Request minor updates</p>
                  </Link>

                  <button className={`${theme.card} rounded-2xl border p-6 text-center hover:shadow-lg transition`}>
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icons.Share />
                    </div>
                    <h4 className={`font-semibold ${theme.text} mb-1`}>Share</h4>
                    <p className={`text-xs ${theme.muted}`}>Show off your new site</p>
                  </button>
                </div>

                {/* Referral Card */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icons.Gift />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">Refer a Friend, Get $50!</p>
                      <p className="text-white/80 text-sm">Share your link and earn credits</p>
                    </div>
                    <button className="px-4 py-2 bg-white text-purple-600 text-sm font-medium rounded-xl hover:bg-white/90 transition">
                      Share Link
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================ */}
          {/* SIDEBAR */}
          {/* ============================================ */}
          <div className="space-y-4">
            {/* Designer Card */}
            <div className={`${theme.card} rounded-2xl border p-5`}>
              <h3 className={`font-bold ${theme.text} mb-4`}>Your Team</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                  VL
                </div>
                <div>
                  <p className={`font-semibold ${theme.text}`}>VektorLabs</p>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className="text-amber-400 text-sm">★</span>
                    ))}
                    <span className={`text-xs ${theme.muted} ml-1`}>5.0</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowChat(!showChat)}
                className="w-full py-2.5 bg-black text-white text-sm rounded-xl font-medium hover:bg-gray-800 transition"
              >
                {showChat ? 'Hide Chat' : 'Message Us'}
              </button>
            </div>

            {/* Chat Panel */}
            {showChat && (
              <div className={`${theme.card} rounded-2xl border overflow-hidden`}>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-4 py-3 flex items-center justify-between border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className={`text-sm font-medium ${theme.text}`}>Chat</span>
                  </div>
                  <button onClick={() => setShowChat(false)} className={`${theme.muted} hover:${theme.text}`}>
                    <Icons.X />
                  </button>
                </div>
                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <p className={`text-center ${theme.muted} text-sm py-8`}>No messages yet</p>
                  ) : (
                    messages.slice().reverse().map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender_type === 'customer' ? 'justify-end' : ''}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                          msg.sender_type === 'customer'
                            ? 'bg-black text-white'
                            : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender_type === 'customer' ? 'text-white/50' : theme.muted}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className={`flex-1 px-4 py-2.5 ${theme.input} rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-black`}
                    />
                    <button 
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition"
                    >
                      <Icons.Send />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Project Info */}
            <div className={`${theme.card} rounded-2xl border p-5`}>
              <h3 className={`font-bold ${theme.text} mb-4`}>Project Info</h3>
              <div className="space-y-3">
                {[
                  { l: 'Plan', v: project?.plan?.charAt(0).toUpperCase() + project?.plan?.slice(1) },
                  { l: 'Created', v: new Date(project?.created_at).toLocaleDateString() },
                  { l: 'Platform', v: project?.platform || 'Not set' }
                ].map((item) => (
                  <div key={item.l} className="flex justify-between">
                    <span className={`text-sm ${theme.muted}`}>{item.l}</span>
                    <span className={`text-sm font-medium ${theme.text} capitalize`}>{item.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credentials / Setup Button - Show for relevant statuses */}
            {['PREVIEW_READY', 'PAID', 'BUILDING'].includes(project?.status) && (
              <Link
                href={`/portal/project/${projectId}/setup`}
                className={`${theme.card} rounded-2xl border p-5 block hover:shadow-md transition group`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${project?.setup_completed ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                    <span className="text-lg">{project?.setup_completed ? '✅' : '🔑'}</span>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${theme.text}`}>
                      {project?.setup_completed ? 'Credentials Submitted' : 'Submit Credentials'}
                    </p>
                    <p className={`text-xs ${theme.muted}`}>
                      {project?.setup_completed 
                        ? 'View or update your setup details' 
                        : 'Logo, content & platform access'}
                    </p>
                  </div>
                  <svg className={`w-4 h-4 ${theme.muted} group-hover:translate-x-1 transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )}

            {/* Growth Tools Quick Access - Show for delivered projects */}
            {project?.status === 'DELIVERED' && (
              <Link 
                href="/portal/growth"
                className={`${theme.card} rounded-2xl border p-5 block hover:shadow-md transition`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Icons.TrendingUp />
                  </div>
                  <div>
                    <h3 className={`font-bold ${theme.text}`}>Growth Tools</h3>
                    <p className={`text-xs ${theme.muted}`}>SEO, Reviews & More</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme.muted}`}>Maximize your website's impact</span>
                  <svg className={`w-4 h-4 ${theme.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )}

            {/* Recent Messages */}
            {messages.length > 0 && !showChat && (
              <div className={`${theme.card} rounded-2xl border p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold ${theme.text}`}>Recent Messages</h3>
                  <button onClick={() => setShowChat(true)} className={`text-xs ${theme.muted} hover:${theme.text}`}>
                    View All
                  </button>
                </div>
                <div className="space-y-2">
                  {messages.slice(0, 3).map(msg => (
                    <div key={msg.id} className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl`}>
                      <p className={`text-xs font-medium ${msg.sender_type === 'admin' ? 'text-purple-600' : theme.muted} mb-1`}>
                        {msg.sender_type === 'admin' ? 'VektorLabs' : 'You'}
                      </p>
                      <p className={`text-sm ${theme.text} line-clamp-2`}>{msg.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* REVISION MODAL */}
      {/* ============================================ */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl max-w-lg w-full p-6`}>
            <h2 className={`text-2xl font-bold ${theme.text} mb-2`}>Request Changes</h2>
            <p className={`${theme.muted} mb-6`}>
              Tell us what you'd like us to change or improve.
              {annotations.length > 0 && (
                <span className="block text-red-500 mt-2 font-medium">
                  📍 {annotations.length} feedback pin(s) will be included with your request.
                </span>
              )}
            </p>
            
            <textarea
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="Describe the changes you'd like..."
              rows={5}
              className={`w-full px-4 py-3 ${theme.input} rounded-xl border focus:outline-none focus:ring-2 focus:ring-black resize-none mb-6`}
            />

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRevisionModal(false)}
                className={`px-5 py-2.5 ${theme.muted} hover:${theme.text} font-medium transition`}
              >
                Cancel
              </button>
              <button
                onClick={requestRevision}
                disabled={!revisionNotes.trim() || submitting}
                className="px-5 py-2.5 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
