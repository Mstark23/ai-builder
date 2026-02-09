'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Project = {
  id: string;
  business_name: string;
  status: string;
};

type Message = {
  id: string;
  project_id: string;
  content: string;
  sender_type: 'admin' | 'customer';
  created_at: string;
  read: boolean;
};

function MessagesContent() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadProjects(); }, []);

  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p.id === projectId);
      if (project) setSelectedProject(project);
    }
  }, [searchParams, projects]);

  useEffect(() => {
    if (selectedProject) loadMessages(selectedProject.id);
  }, [selectedProject]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase.from('projects').select('id, business_name, status').eq('customer_id', user.id).order('created_at', { ascending: false });
      if (data) {
        setProjects(data);
        const projectId = searchParams.get('project');
        const toSelect = projectId ? data.find(p => p.id === projectId) : data[0];
        if (toSelect) setSelectedProject(toSelect);
      }
    } catch (err) { console.error('Error:', err); }
    finally { setLoading(false); }
  };

  const loadMessages = async (projectId: string) => {
    try {
      const { data } = await supabase.from('messages').select('*').eq('project_id', projectId).order('created_at', { ascending: true });
      if (data) {
        setMessages(data);
        const unreadIds = data.filter(m => !m.read && m.sender_type === 'admin').map(m => m.id);
        if (unreadIds.length > 0) await supabase.from('messages').update({ read: true }).in('id', unreadIds);
      }
    } catch (err) { console.error('Error:', err); }
  };

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject || sending) return;
    setSending(true);
    try {
      await supabase.from('messages').insert({ project_id: selectedProject.id, content: newMessage.trim(), sender_type: 'customer', read: false });
      setNewMessage('');
      loadMessages(selectedProject.id);
    } catch (err) { console.error('Error:', err); }
    finally { setSending(false); }
  };

  const formatMessageDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return 'Today';
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-medium text-black mb-2">No Projects Yet</h2>
          <p className="font-body text-neutral-500 mb-6">Start a project to begin messaging with our team.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors">
            Start a Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* PROJECTS SIDEBAR */}
      <div className="w-80 border-r border-neutral-200 bg-white flex flex-col">
        <div className="p-4 border-b border-neutral-200">
          <h1 className="font-display text-xl font-medium text-black">Messages</h1>
          <p className="font-body text-sm text-neutral-500">Chat with VektorLabs team</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {projects.map((project) => {
            const isSelected = selectedProject?.id === project.id;
            return (
              <div key={project.id} onClick={() => setSelectedProject(project)} className={`px-4 py-3 cursor-pointer transition-colors border-l-4 ${isSelected ? 'bg-blue-50 border-blue-500' : 'hover:bg-neutral-50 border-transparent'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-body font-bold ${isSelected ? 'bg-blue-500' : 'bg-gradient-to-br from-neutral-600 to-neutral-800'}`}>
                    {project.business_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`font-body text-sm truncate block ${isSelected ? 'font-semibold text-black' : 'font-medium text-neutral-800'}`}>{project.business_name}</span>
                    <p className="font-body text-xs text-neutral-500 truncate">Project</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT AREA */}
      {selectedProject ? (
        <div className="flex-1 flex flex-col bg-neutral-50">
          <div className="p-4 bg-white border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-body font-bold">
                {selectedProject.business_name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <div className="font-body font-medium text-black">{selectedProject.business_name}</div>
                <div className="font-body text-xs text-neutral-500">VektorLabs Support</div>
              </div>
            </div>
            <Link href={`/portal/project/${selectedProject.id}`} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 font-body text-sm rounded-lg hover:bg-neutral-200 transition-colors">View Project</Link>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  <h3 className="font-body font-medium text-neutral-800 mb-1">No messages yet</h3>
                  <p className="font-body text-sm text-neutral-500">Send a message to start the conversation</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => {
                  const showDateHeader = idx === 0 || formatMessageDate(msg.created_at) !== formatMessageDate(messages[idx - 1].created_at);
                  const isCustomer = msg.sender_type === 'customer';
                  return (
                    <div key={msg.id}>
                      {showDateHeader && (
                        <div className="text-center my-4"><span className="px-3 py-1 bg-white text-neutral-500 text-xs font-body rounded-full shadow-sm">{formatMessageDate(msg.created_at)}</span></div>
                      )}
                      <div className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-md">
                          {!isCustomer && (
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-body font-bold">V</div>
                              <span className="font-body text-xs text-neutral-500">VektorLabs</span>
                            </div>
                          )}
                          <div className={`px-4 py-3 rounded-2xl ${isCustomer ? 'bg-black text-white rounded-br-sm' : 'bg-white text-black rounded-bl-sm shadow-sm'}`}>
                            <p className="font-body text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <div className={`mt-1 ${isCustomer ? 'text-right' : 'text-left'}`}>
                            <span className="font-body text-xs text-neutral-400">{new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-4 bg-white border-t border-neutral-200">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Type a message..." rows={1} className="w-full px-4 py-3 bg-neutral-100 rounded-xl font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black pr-12" />
                <button onClick={sendMessage} disabled={!newMessage.trim() || sending} className="absolute right-2 bottom-2 p-2 bg-black text-white rounded-lg hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <h3 className="font-body font-medium text-xl text-neutral-800 mb-2">Select a project</h3>
            <p className="font-body text-neutral-500">Choose a project to view messages</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MessagesLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-body text-neutral-500">Loading messages...</p>
      </div>
    </div>
  );
}

export default function CustomerMessagesPage() {
  return (
    <Suspense fallback={<MessagesLoading />}>
      <MessagesContent />
    </Suspense>
  );
}
