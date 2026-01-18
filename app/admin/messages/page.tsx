'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Project = {
  id: string;
  business_name: string;
  status: string;
  feedback_notes: string | null;
  created_at: string;
  customer_id: string;
  customers?: {
    name: string;
    email: string;
  } | null;
};

type Message = {
  id: string;
  content: string;
  sender: 'customer' | 'admin';
  created_at: string;
};

export default function AdminMessagesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState('all');

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
        if (data.length > 0 && !selectedProject) {
          selectProject(data[0]);
        }
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    
    // Generate messages from project data
    const msgs: Message[] = [
      {
        id: '1',
        content: `New project "${project.business_name}" has been created. We'll start working on it soon!`,
        sender: 'admin',
        created_at: project.created_at,
      },
    ];

    if (project.status === 'IN_PROGRESS') {
      msgs.push({
        id: '2',
        content: 'Our design team has started working on your project.',
        sender: 'admin',
        created_at: new Date(new Date(project.created_at).getTime() + 86400000).toISOString(),
      });
    }

    if (project.feedback_notes) {
      msgs.push({
        id: '3',
        content: project.feedback_notes,
        sender: 'customer',
        created_at: new Date().toISOString(),
      });
    }

    if (project.status === 'PREVIEW_READY') {
      msgs.push({
        id: '4',
        content: '🎉 Your preview is ready! Please review and let us know if you need any changes.',
        sender: 'admin',
        created_at: new Date().toISOString(),
      });
    }

    setMessages(msgs);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return;

    setSending(true);

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'admin',
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
    setSending(false);
  };

  const filteredProjects = projects.filter(p => {
    if (filter === 'needs_reply') return p.feedback_notes && p.status !== 'DELIVERED';
    if (filter === 'in_progress') return p.status === 'IN_PROGRESS';
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      QUEUED: 'bg-amber-500',
      IN_PROGRESS: 'bg-blue-500',
      PREVIEW_READY: 'bg-purple-500',
      REVISION_REQUESTED: 'bg-orange-500',
      PAID: 'bg-emerald-500',
      DELIVERED: 'bg-emerald-500',
    };
    return colors[status] || 'bg-neutral-500';
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading messages...</p>
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

      <div className="p-8 lg:p-12">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl font-medium text-black mb-2">Messages</h1>
            <p className="font-body text-neutral-500">Communicate with customers</p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'needs_reply', label: 'Needs Reply' },
              { id: 'in_progress', label: 'In Progress' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all ${
                  filter === f.id
                    ? 'bg-black text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <p className="font-body text-neutral-500">No projects yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="flex h-[600px]">
              {/* SIDEBAR */}
              <div className="w-80 border-r border-neutral-200 flex flex-col">
                <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                  <h2 className="font-body font-semibold text-black">Conversations</h2>
                  <p className="font-body text-xs text-neutral-500">{filteredProjects.length} projects</p>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {filteredProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => selectProject(project)}
                      className={`w-full p-4 text-left border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${
                        selectedProject?.id === project.id ? 'bg-neutral-100' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-body text-sm font-semibold">
                            {project.business_name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-body font-medium text-black truncate">{project.business_name}</h3>
                            <span className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></span>
                          </div>
                          <p className="font-body text-xs text-neutral-500 truncate">
                            {project.customers?.name || 'No customer'}
                          </p>
                          {project.feedback_notes && (
                            <div className="mt-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              <span className="font-body text-xs text-red-600">Has feedback</span>
                            </div>
                          )}
                          <p className="font-body text-xs text-neutral-400 mt-1">
                            {formatTime(project.created_at)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CHAT AREA */}
              <div className="flex-1 flex flex-col">
                {selectedProject ? (
                  <>
                    {/* CHAT HEADER */}
                    <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                          <span className="text-white font-body text-sm font-semibold">
                            {selectedProject.business_name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-body font-semibold text-black">{selectedProject.business_name}</h3>
                          <p className="font-body text-xs text-neutral-500">
                            {selectedProject.customers?.name} · {selectedProject.customers?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/projects/${selectedProject.id}`}
                          className="px-4 py-2 bg-white border border-neutral-200 text-black font-body text-sm font-medium rounded-full hover:bg-neutral-100 transition-colors"
                        >
                          View Project
                        </Link>
                        <a
                          href={`mailto:${selectedProject.customers?.email}`}
                          className="px-4 py-2 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors"
                        >
                          Email
                        </a>
                      </div>
                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                              msg.sender === 'admin'
                                ? 'bg-black text-white rounded-br-md'
                                : 'bg-neutral-100 text-black rounded-bl-md'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-body text-xs font-medium ${
                                msg.sender === 'admin' ? 'text-white/70' : 'text-neutral-500'
                              }`}>
                                {msg.sender === 'admin' ? 'You' : selectedProject.customers?.name || 'Customer'}
                              </span>
                            </div>
                            <p className="font-body text-sm">{msg.content}</p>
                            <p className={`font-body text-xs mt-1 ${
                              msg.sender === 'admin' ? 'text-white/50' : 'text-neutral-400'
                            }`}>
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* QUICK REPLIES */}
                    <div className="px-4 py-2 border-t border-neutral-100 flex gap-2 overflow-x-auto">
                      {[
                        'Thanks for your feedback!',
                        'Your preview is ready.',
                        'We are working on it.',
                        'Any questions?',
                      ].map((reply) => (
                        <button
                          key={reply}
                          onClick={() => setNewMessage(reply)}
                          className="px-3 py-1.5 bg-neutral-100 text-neutral-600 font-body text-xs rounded-full hover:bg-neutral-200 transition-colors whitespace-nowrap"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>

                    {/* INPUT */}
                    <div className="p-4 border-t border-neutral-100 bg-neutral-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-3 bg-white border border-neutral-200 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || sending}
                          className="p-3 bg-black text-white rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="font-body text-neutral-500">Select a conversation</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}