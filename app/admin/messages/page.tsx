'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Project = {
  id: string;
  business_name: string;
  status: string;
  customers?: { name: string; email: string } | null;
};

type Message = {
  id: string;
  project_id: string;
  content: string;
  sender_type: 'admin' | 'customer';
  created_at: string;
  read: boolean;
};

export default function MessagesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadMessages(selectedProject.id);
    }
  }, [selectedProject]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, customers(name, email)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProjects(data);
        if (data.length > 0) {
          setSelectedProject(data[0]);
        }
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
        const unreadIds = data.filter(m => !m.read && m.sender_type === 'customer').map(m => m.id);
        if (unreadIds.length > 0) {
          await supabase.from('messages').update({ read: true }).in('id', unreadIds);
        }
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject || sending) return;

    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        project_id: selectedProject.id,
        content: newMessage.trim(),
        sender_type: 'admin',
        read: false,
      });

      if (!error) {
        setNewMessage('');
        loadMessages(selectedProject.id);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  const filteredProjects = projects.filter(p => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      p.business_name?.toLowerCase().includes(searchLower) ||
      p.customers?.name?.toLowerCase().includes(searchLower)
    );
  });

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

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b border-neutral-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-black">Messages</h1>
          <p className="font-body text-sm text-neutral-500">Communicate with your customers</p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-body font-medium rounded-full">
          {projects.length} conversations
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-neutral-200 bg-white flex flex-col">
          <div className="p-4 border-b border-neutral-100">
            <div className="relative">
              <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 bg-neutral-100 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredProjects.length === 0 ? (
              <div className="p-4 text-center">
                <p className="font-body text-sm text-neutral-500">No conversations found</p>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const isSelected = selectedProject?.id === project.id;
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-neutral-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-body font-bold ${
                        isSelected ? 'bg-blue-500' : 'bg-gradient-to-br from-neutral-600 to-neutral-800'
                      }`}>
                        {project.business_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`font-body text-sm truncate block ${isSelected ? 'font-semibold text-black' : 'font-medium text-neutral-800'}`}>
                          {project.business_name}
                        </span>
                        <p className="font-body text-xs text-neutral-500 truncate">
                          {project.customers?.name || 'No customer'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {selectedProject ? (
          <div className="flex-1 flex flex-col bg-neutral-50">
            <div className="p-4 bg-white border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-body font-bold">
                  {selectedProject.business_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <div className="font-body font-medium text-black">{selectedProject.business_name}</div>
                  <div className="font-body text-xs text-neutral-500">{selectedProject.customers?.email || 'No email'}</div>
                </div>
              </div>
              <a href={`/admin/projects/${selectedProject.id}`} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 font-body text-sm rounded-lg hover:bg-neutral-200 transition-colors">
                View Project
              </a>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="font-body font-medium text-neutral-800 mb-1">No messages yet</h3>
                    <p className="font-body text-sm text-neutral-500">Start the conversation</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => {
                    const showDateHeader = idx === 0 || formatMessageDate(msg.created_at) !== formatMessageDate(messages[idx - 1].created_at);
                    const isAdmin = msg.sender_type === 'admin';
                    return (
                      <div key={msg.id}>
                        {showDateHeader && (
                          <div className="text-center my-4">
                            <span className="px-3 py-1 bg-white text-neutral-500 text-xs font-body rounded-full shadow-sm">{formatMessageDate(msg.created_at)}</span>
                          </div>
                        )}
                        <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-md">
                            {!isAdmin && (
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-body font-bold">
                                  {selectedProject.business_name?.charAt(0) || '?'}
                                </div>
                                <span className="font-body text-xs text-neutral-500">{selectedProject.customers?.name || 'Customer'}</span>
                              </div>
                            )}
                            <div className={`px-4 py-3 rounded-2xl ${isAdmin ? 'bg-black text-white rounded-br-sm' : 'bg-white text-black rounded-bl-sm shadow-sm'}`}>
                              <p className="font-body text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            <div className={`mt-1 ${isAdmin ? 'text-right' : 'text-left'}`}>
                              <span className="font-body text-xs text-neutral-400">
                                {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                              </span>
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
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-3 bg-neutral-100 rounded-xl font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black pr-12"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="absolute right-2 bottom-2 p-2 bg-black text-white rounded-lg hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-neutral-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-body font-medium text-xl text-neutral-800 mb-2">Select a conversation</h3>
              <p className="font-body text-neutral-500">Choose a project from the list</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
