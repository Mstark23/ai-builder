'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Message = {
  id: string;
  content: string;
  sender: 'customer' | 'admin';
  created_at: string;
  project_id: string;
};

type Conversation = {
  project_id: string;
  project_name: string;
  last_message: string;
  last_message_time: string;
  unread: number;
  status: string;
};

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
    await loadConversations(user.id);
  };

  const loadConversations = async (userId: string) => {
    try {
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (projects) {
        const convos: Conversation[] = projects.map(p => ({
          project_id: p.id,
          project_name: p.business_name,
          last_message: p.feedback_notes || 'No messages yet',
          last_message_time: p.created_at,
          unread: 0,
          status: p.status,
        }));
        setConversations(convos);

        if (convos.length > 0 && !selectedConvo) {
          setSelectedConvo(convos[0].project_id);
          loadMessages(convos[0].project_id, convos[0].project_name, convos[0].status);
        }
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (projectId: string, projectName: string, status: string) => {
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (project) {
      const sampleMessages: Message[] = [
        {
          id: '1',
          content: `Thank you for starting your project "${project.business_name}"! Our team is reviewing your requirements and will begin working on your design shortly.`,
          sender: 'admin',
          created_at: project.created_at,
          project_id: projectId,
        },
      ];

      if (project.status === 'IN_PROGRESS') {
        sampleMessages.push({
          id: '2',
          content: 'Our designers have started working on your website. You will receive your preview soon!',
          sender: 'admin',
          created_at: new Date(new Date(project.created_at).getTime() + 86400000).toISOString(),
          project_id: projectId,
        });
      }

      if (project.feedback_notes) {
        sampleMessages.push({
          id: '3',
          content: project.feedback_notes,
          sender: 'customer',
          created_at: new Date().toISOString(),
          project_id: projectId,
        });
      }

      if (project.status === 'PREVIEW_READY') {
        sampleMessages.push({
          id: '4',
          content: '🎉 Great news! Your preview is ready. Please check it out and let us know if you need any changes.',
          sender: 'admin',
          created_at: new Date().toISOString(),
          project_id: projectId,
        });
      }

      if (project.status === 'DELIVERED') {
        sampleMessages.push({
          id: '5',
          content: '🚀 Your website has been delivered! Thank you for choosing Verktorlabs. We hope you love it!',
          sender: 'admin',
          created_at: new Date().toISOString(),
          project_id: projectId,
        });
      }

      setMessages(sampleMessages);
    }
  };

  const handleSelectConvo = (convo: Conversation) => {
    setSelectedConvo(convo.project_id);
    loadMessages(convo.project_id, convo.project_name, convo.status);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConvo) return;

    setSending(true);

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'customer',
      created_at: new Date().toISOString(),
      project_id: selectedConvo,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    await supabase
      .from('projects')
      .update({ feedback_notes: newMessage })
      .eq('id', selectedConvo);

    setSending(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

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

  const selectedConversation = conversations.find(c => c.project_id === selectedConvo);

  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', -apple-system, sans-serif; }
      `}</style>

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
                <span className="text-white font-display text-lg font-semibold">V</span>
              </div>
              <span className="font-body text-black font-semibold tracking-wide hidden sm:block">VERKTORLABS</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/portal" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">Dashboard</Link>
              <Link href="/portal/messages" className="px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium">Messages</Link>
              <Link href="/portal/billing" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">Billing</Link>
              <Link href="/portal/settings" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">Settings</Link>
            </nav>

            <button onClick={handleLogout} className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <Link href="/portal" className="inline-flex items-center gap-2 font-body text-neutral-500 hover:text-black transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-display text-4xl font-medium text-black">Messages</h1>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-medium text-black mb-2">No conversations yet</h3>
            <p className="font-body text-neutral-500 mb-6">Start a project to begin chatting with our team</p>
            <Link href="/portal/new-project" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all">
              <span>Start a Project</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="flex h-[600px]">
              {/* SIDEBAR */}
              <div className="w-80 border-r border-neutral-200 flex flex-col">
                <div className="p-4 border-b border-neutral-100">
                  <h2 className="font-body font-semibold text-black">Conversations</h2>
                  <p className="font-body text-xs text-neutral-500">{conversations.length} projects</p>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {conversations.map((convo) => (
                    <button
                      key={convo.project_id}
                      onClick={() => handleSelectConvo(convo)}
                      className={`w-full p-4 text-left border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${
                        selectedConvo === convo.project_id ? 'bg-neutral-100' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-body text-sm font-semibold">
                            {convo.project_name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-body font-medium text-black truncate">{convo.project_name}</h3>
                            <span className={`w-2 h-2 rounded-full ${getStatusColor(convo.status)}`}></span>
                          </div>
                          <p className="font-body text-xs text-neutral-500 truncate mt-0.5">
                            {convo.last_message.substring(0, 40)}...
                          </p>
                          <p className="font-body text-xs text-neutral-400 mt-1">
                            {formatTime(convo.last_message_time)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CHAT AREA */}
              <div className="flex-1 flex flex-col">
                {/* CHAT HEADER */}
                {selectedConversation && (
                  <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                        <span className="text-white font-body text-sm font-semibold">
                          {selectedConversation.project_name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-body font-semibold text-black">{selectedConversation.project_name}</h3>
                        <p className="font-body text-xs text-neutral-500">Project conversation</p>
                      </div>
                    </div>
                    <Link
                      href={`/portal/project/${selectedConvo}`}
                      className="px-4 py-2 bg-neutral-100 text-black font-body text-sm font-medium rounded-full hover:bg-neutral-200 transition-colors"
                    >
                      View Project
                    </Link>
                  </div>
                )}

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                          msg.sender === 'customer'
                            ? 'bg-black text-white rounded-br-md'
                            : 'bg-neutral-100 text-black rounded-bl-md'
                        }`}
                      >
                        <p className="font-body text-sm">{msg.content}</p>
                        <p className={`font-body text-xs mt-1 ${
                          msg.sender === 'customer' ? 'text-white/60' : 'text-neutral-400'
                        }`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* INPUT */}
                <div className="p-4 border-t border-neutral-100">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-neutral-100 rounded-xl font-body text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="p-3 bg-black text-white rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}