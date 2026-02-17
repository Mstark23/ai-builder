'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hide on admin pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/portal') || pathname?.startsWith('/login')) {
    return null;
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, sessionId }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...updated, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([...updated, { role: 'assistant', content: "Sorry, I'm having trouble right now. Try again in a moment!" }]);
      }
    } catch {
      setMessages([...updated, { role: 'assistant', content: "Connection issue — please try again." }]);
    }

    setLoading(false);
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .chat-window { animation: chatSlideUp 0.3s ease; }
        .chat-bubble-pulse { animation: chatPulse 2s ease-in-out infinite; }
        .dot-1 { animation: dotBounce 1.4s ease-in-out infinite; }
        .dot-2 { animation: dotBounce 1.4s ease-in-out 0.2s infinite; }
        .dot-3 { animation: dotBounce 1.4s ease-in-out 0.4s infinite; }
      `}</style>

      {/* Chat Window */}
      {open && (
        <div
          className="chat-window"
          style={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 380,
            maxWidth: 'calc(100vw - 48px)',
            height: 520,
            maxHeight: 'calc(100vh - 140px)',
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9998,
            fontFamily: "'Inter', -apple-system, sans-serif",
          }}
        >
          {/* Header */}
          <div style={{
            padding: '18px 20px',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, background: '#fff', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#000', fontWeight: 700, fontSize: 16 }}>V</span>
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Vektor</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>VektorLabs AI Assistant</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
                width: 32, height: 32, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18,
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{
            flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {/* Welcome message */}
            {messages.length === 0 && (
              <div style={{
                background: '#f5f5f5', borderRadius: '16px 16px 16px 4px',
                padding: '12px 16px', maxWidth: '85%', fontSize: 14,
                lineHeight: 1.5, color: '#333',
              }}>
                Hey! 👋 I&apos;m Vektor, your AI assistant. I can answer questions about our services, pricing, or help you get started with a free website preview. What can I help you with?
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' ? '#000' : '#f5f5f5',
                  color: msg.role === 'user' ? '#fff' : '#333',
                  borderRadius: msg.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  padding: '10px 16px',
                  maxWidth: '85%',
                  fontSize: 14,
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                background: '#f5f5f5',
                borderRadius: '16px 16px 16px 4px',
                padding: '12px 20px',
                display: 'flex',
                gap: 4,
              }}>
                <span className="dot-1" style={{ width: 7, height: 7, borderRadius: '50%', background: '#999', display: 'block' }} />
                <span className="dot-2" style={{ width: 7, height: 7, borderRadius: '50%', background: '#999', display: 'block' }} />
                <span className="dot-3" style={{ width: 7, height: 7, borderRadius: '50%', background: '#999', display: 'block' }} />
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {messages.length === 0 && (
            <div style={{ padding: '0 16px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['What do you offer?', 'How much does it cost?', 'Get my free preview'].map(q => (
                <button
                  key={q}
                  onClick={() => {
                    const userMsg: Message = { role: 'user', content: q };
                    const updated = [...messages, userMsg];
                    setMessages(updated);
                    setLoading(true);
                    fetch('/api/chat', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ messages: updated, sessionId }),
                    })
                      .then(r => r.json())
                      .then(data => {
                        setMessages([...updated, { role: 'assistant', content: data.reply || "Sorry, try again!" }]);
                      })
                      .catch(() => {
                        setMessages([...updated, { role: 'assistant', content: "Connection issue — please try again." }]);
                      })
                      .finally(() => setLoading(false));
                  }}
                  style={{
                    padding: '8px 14px', borderRadius: 50, border: '1px solid #e5e5e5',
                    background: '#fff', fontSize: 12, fontWeight: 500, color: '#666',
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.color = '#000'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#666'; }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px 16px 16px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            gap: 8,
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 50,
                border: '1px solid #e5e5e5', outline: 'none', fontSize: 14,
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                width: 40, height: 40, borderRadius: '50%', border: 'none',
                background: input.trim() ? '#000' : '#e5e5e5',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Bubble */}
      <button
        onClick={() => setOpen(!open)}
        className={!open ? 'chat-bubble-pulse' : ''}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#000',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
        )}
      </button>
    </>
  );
}
