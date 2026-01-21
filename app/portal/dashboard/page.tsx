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
};

type Message = {
  id: string;
  project_id: string;
  content: string;
  sender_type: string;
  created_at: string;
  read: boolean;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; progress: number }> = {
  QUEUED: { label: 'Queued', color: 'bg-amber-100 text-amber-700 border-amber-200', progress: 10 },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200', progress: 40 },
  GENERATING: { label: 'Generating', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', progress: 60 },
  PREVIEW_READY: { label: 'Preview Ready', color: 'bg-purple-100 text-purple-700 border-purple-200', progress: 80 },
  REVISION_REQUESTED: { label: 'Revising', color: 'bg-orange-100 text-orange-700 border-orange-200', progress: 70 },
  PAID: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', progress: 90 },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', progress: 100 },
};

export default function CustomerDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('customerName');
    setCustomerName(name || 'there');
    loadData();
  }, []);

  const loadData = async () => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId || customerId === 'demo') {
      setLoading(false);
      return;
    }

    try {
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (projectsData) {
        setProjects(projectsData);
        
        const projectIds = projectsData.map(p => p.id);
        if (projectIds.length > 0) {
          const { data: messagesData } = await supabase
            .from('messages')
            .select('*')
            .in('project_id', projectIds)
            .eq('sender_type', 'admin')
            .eq('read', false)
            .order('created_at', { ascending: false })
            .limit(5);
          
          if (messagesData) setMessages(messagesData);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => STATUS_CONFIG[status] || STATUS_CONFIG.QUEUED;

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const activeProjects = projects.filter(p => p.status !== 'DELIVERED');
  const completedProjects = projects.filter(p => p.status === 'DELIVERED');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* WELCOME */}
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-medium text-black">
          Welcome back, {customerName}! 👋
        </h1>
        <p className="font-body text-neutral-500 mt-2">
          Here's an overview of your projects and updates.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="font-display text-3xl font-semibold text-black">{projects.length}</div>
          <div className="font-body text-sm text-neutral-500 mt-1">Total Projects</div>
        </div>
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
          <div className="font-display text-3xl font-semibold text-blue-700">{activeProjects.length}</div>
          <div className="font-body text-sm text-blue-600 mt-1">In Progress</div>
        </div>
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
          <div className="font-display text-3xl font-semibold text-emerald-700">{completedProjects.length}</div>
          <div className="font-body text-sm text-emerald-600 mt-1">Completed</div>
        </div>
        <div className="bg-purple-50 rounded-2xl border border-purple-200 p-5">
          <div className="font-display text-3xl font-semibold text-purple-700">{messages.length}</div>
          <div className="font-body text-sm text-purple-600 mt-1">New Messages</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* PROJECTS */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="font-body font-semibold text-black">Your Projects</h2>
              <Link href="/customer/projects" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">
                View all →
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-body font-medium text-black mb-2">No projects yet</h3>
                <p className="font-body text-sm text-neutral-500 mb-4">Start your first website project with us!</p>
                <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Start a Project
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {projects.slice(0, 3).map((project) => {
                  const config = getStatusConfig(project.status);
                  return (
                    <Link key={project.id} href={`/customer/projects/${project.id}`} className="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors block">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-body font-bold text-lg">
                        {project.business_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-body font-medium text-black truncate">{project.business_name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium border ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden max-w-32">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" style={{ width: `${config.progress}%` }} />
                          </div>
                          <span className="font-body text-xs text-neutral-500">{config.progress}%</span>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          {/* MESSAGES */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="font-body font-semibold text-black">Recent Messages</h2>
              {messages.length > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-body font-medium rounded-full">
                  {messages.length} new
                </span>
              )}
            </div>
            {messages.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="font-body text-sm text-neutral-500">No new messages</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {messages.slice(0, 3).map((msg) => (
                  <Link key={msg.id} href={`/customer/messages?project=${msg.project_id}`} className="p-4 block hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-sm font-medium text-black">VerktorLabs Team</span>
                      <span className="font-body text-xs text-neutral-400">{getTimeAgo(msg.created_at)}</span>
                    </div>
                    <p className="font-body text-sm text-neutral-500 truncate">{msg.content}</p>
                  </Link>
                ))}
              </div>
            )}
            <div className="p-4 border-t border-neutral-100">
              <Link href="/customer/messages" className="block text-center font-body text-sm text-neutral-500 hover:text-black transition-colors">
                View all messages →
              </Link>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 text-white">
            <h2 className="font-body font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/register" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-body text-sm font-medium">Start New Project</span>
              </Link>
              <Link href="/customer/messages" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-body text-sm font-medium">Contact Support</span>
              </Link>
              <Link href="/customer/settings" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="font-body text-sm font-medium">Account Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
