// /app/portal/reviews/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Review = {
  id: string;
  project_id: string;
  platform: 'google' | 'yelp' | 'facebook' | 'other';
  rating: number;
  author_name: string;
  content: string;
  responded: boolean;
  response?: string;
  created_at: string;
};

type Project = {
  id: string;
  business_name: string;
  google_place_id?: string;
  yelp_url?: string;
  facebook_url?: string;
};

type ReviewRequest = {
  id: string;
  project_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  sent_via: 'email' | 'sms' | 'qr';
  status: 'sent' | 'opened' | 'completed';
  created_at: string;
};

const platformConfig = {
  google: { name: 'Google', icon: '🔍', color: 'bg-blue-100 text-blue-700', url: 'https://g.page/r/' },
  yelp: { name: 'Yelp', icon: '📍', color: 'bg-red-100 text-red-700', url: 'https://yelp.com/biz/' },
  facebook: { name: 'Facebook', icon: '👤', color: 'bg-indigo-100 text-indigo-700', url: 'https://facebook.com/' },
  other: { name: 'Other', icon: '⭐', color: 'bg-neutral-100 text-neutral-700', url: '' },
};

// Email & SMS Templates
const templates = {
  happy: {
    name: 'Happy Customer',
    subject: 'Quick favor? 🙏',
    email: `Hi {customer_name},

Thank you for choosing {business_name}! We hope you had a great experience.

Would you mind taking 30 seconds to leave us a quick review? It really helps other customers find us.

👉 {review_link}

Thank you so much!
{business_name}`,
    sms: `Hi {customer_name}! Thanks for choosing {business_name}. If you had a great experience, would you leave us a quick review? It takes 30 seconds: {review_link}`,
  },
  followup: {
    name: 'Follow-up',
    subject: "How did we do?",
    email: `Hi {customer_name},

We wanted to follow up after your recent visit to {business_name}.

Your feedback matters to us! If you have a moment, we'd love to hear about your experience:

👉 {review_link}

If there's anything we could have done better, please let us know by replying to this email.

Thank you!
{business_name}`,
    sms: `Hi {customer_name}, how was your experience at {business_name}? We'd love your feedback: {review_link}`,
  },
  thank_you: {
    name: 'Post-Service Thank You',
    subject: 'Thank you for your business! 🙏',
    email: `Dear {customer_name},

Thank you for trusting {business_name} with your business. We truly appreciate you!

If you were happy with our service, a review would mean the world to us:

👉 {review_link}

Reviews help small businesses like ours grow and serve more customers like you.

With gratitude,
{business_name}`,
    sms: `Thanks for choosing {business_name}, {customer_name}! If you were happy with our service, a quick review would mean the world: {review_link}`,
  },
};

export default function ReviewsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'request' | 'reviews' | 'qr'>('overview');

  // Request form state
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('happy');
  const [requestMethod, setRequestMethod] = useState<'email' | 'sms'>('email');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [sending, setSending] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    requestsSent: 0,
    responseRate: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadData();
    }
  }, [selectedProject]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);

    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('customer_id', user.id)
      .in('status', ['PAID', 'BUILDING', 'DELIVERED']);

    if (projectsData && projectsData.length > 0) {
      setProjects(projectsData);
      setSelectedProject(projectsData[0].id);
    }

    setLoading(false);
  };

  const loadData = async () => {
    // Load reviews
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*')
      .eq('project_id', selectedProject)
      .order('created_at', { ascending: false });

    if (reviewsData) {
      setReviews(reviewsData);
      const total = reviewsData.length;
      const avgRating = total > 0
        ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
        : 0;
      setStats(prev => ({
        ...prev,
        totalReviews: total,
        averageRating: parseFloat(avgRating as string) || 0,
      }));
    }

    // Load review requests
    const { data: requestsData } = await supabase
      .from('review_requests')
      .select('*')
      .eq('project_id', selectedProject)
      .order('created_at', { ascending: false });

    if (requestsData) {
      setRequests(requestsData);
      const completed = requestsData.filter(r => r.status === 'completed').length;
      setStats(prev => ({
        ...prev,
        requestsSent: requestsData.length,
        responseRate: requestsData.length > 0 ? Math.round((completed / requestsData.length) * 100) : 0,
      }));
    }
  };

  const getReviewLink = () => {
    const project = projects.find(p => p.id === selectedProject);
    if (!project) return '';
    if (project.google_place_id) {
      return `https://search.google.com/local/writereview?placeid=${project.google_place_id}`;
    }
    if (project.yelp_url) return project.yelp_url;
    if (project.facebook_url) return project.facebook_url;
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/review/${selectedProject}`;
  };

  const getFormattedMessage = () => {
    const project = projects.find(p => p.id === selectedProject);
    const template = templates[selectedTemplate];
    const message = requestMethod === 'email' ? template.email : template.sms;
    return message
      .replace(/{customer_name}/g, customerName || '[Customer Name]')
      .replace(/{business_name}/g, project?.business_name || '[Business Name]')
      .replace(/{review_link}/g, getReviewLink());
  };

  const sendReviewRequest = async () => {
    if (!customerName || !customerContact) return;
    setSending(true);
    try {
      const { data: request } = await supabase
        .from('review_requests')
        .insert({
          project_id: selectedProject,
          customer_name: customerName,
          customer_email: requestMethod === 'email' ? customerContact : null,
          customer_phone: requestMethod === 'sms' ? customerContact : null,
          sent_via: requestMethod,
          status: 'sent',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (request) {
        setRequests(prev => [request, ...prev]);
        setCustomerName('');
        setCustomerContact('');
        alert(`Review request sent to ${customerName}!`);
      }
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setSending(false);
    }
  };

  const generateQRCode = () => {
    const reviewLink = getReviewLink();
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(reviewLink)}`;
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `review-qr-${selectedProject}.png`;
    link.href = generateQRCode();
    link.click();
  };

  const project = projects.find(p => p.id === selectedProject);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⭐</span>
          </div>
          <h1 className="text-2xl font-bold text-black mb-3">Review Tools Locked</h1>
          <p className="text-neutral-600 mb-6">You need a paid website to access review management tools.</p>
          <Link href="/portal/new-project" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/80 transition">
            Start Your Website
          </Link>
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

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/portal" className="text-neutral-600 hover:text-black transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </Link>
              <div>
                <h1 className="font-display text-xl font-medium text-black">Review Manager</h1>
                <p className="font-body text-xs text-neutral-500">Collect & manage customer reviews</p>
              </div>
            </div>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-2 bg-neutral-100 border-0 rounded-full font-body text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.business_name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⭐</span>
              <span className="font-body text-xs text-neutral-500">Average Rating</span>
            </div>
            <p className="font-display text-3xl font-bold text-black">{stats.averageRating > 0 ? stats.averageRating : '-'}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📝</span>
              <span className="font-body text-xs text-neutral-500">Total Reviews</span>
            </div>
            <p className="font-display text-3xl font-bold text-black">{stats.totalReviews}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📤</span>
              <span className="font-body text-xs text-neutral-500">Requests Sent</span>
            </div>
            <p className="font-display text-3xl font-bold text-black">{stats.requestsSent}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📈</span>
              <span className="font-body text-xs text-neutral-500">Response Rate</span>
            </div>
            <p className="font-display text-3xl font-bold text-black">{stats.responseRate}%</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'request', label: 'Request Reviews', icon: '📤' },
            { id: 'reviews', label: 'All Reviews', icon: '⭐' },
            { id: 'qr', label: 'QR Codes', icon: '📱' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.id ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-display text-lg font-medium text-black mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button onClick={() => setActiveTab('request')} className="w-full flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition text-left">
                  <span className="text-2xl">📤</span>
                  <div>
                    <p className="font-body font-semibold text-emerald-900">Send Review Request</p>
                    <p className="font-body text-sm text-emerald-700">Email or SMS a customer</p>
                  </div>
                </button>
                <button onClick={() => setActiveTab('qr')} className="w-full flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition text-left">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-body font-semibold text-blue-900">Get QR Code</p>
                    <p className="font-body text-sm text-blue-700">Print for in-store display</p>
                  </div>
                </button>
                <button onClick={() => { navigator.clipboard.writeText(getReviewLink()); alert('Review link copied!'); }} className="w-full flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition text-left">
                  <span className="text-2xl">🔗</span>
                  <div>
                    <p className="font-body font-semibold text-amber-900">Copy Review Link</p>
                    <p className="font-body text-sm text-amber-700">Share directly with customers</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-display text-lg font-medium text-black mb-4">Recent Reviews</h2>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">⭐</span>
                  <p className="font-body text-neutral-500">No reviews yet</p>
                  <p className="font-body text-sm text-neutral-400">Start requesting reviews from your customers!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 5).map(review => (
                    <div key={review.id} className="p-4 bg-neutral-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={platformConfig[review.platform].color + ' px-2 py-0.5 rounded-full text-xs font-medium'}>
                            {platformConfig[review.platform].icon} {platformConfig[review.platform].name}
                          </span>
                          <div className="flex">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} className={star <= review.rating ? 'text-amber-400' : 'text-neutral-300'}>★</span>
                            ))}
                          </div>
                        </div>
                        <span className="font-body text-xs text-neutral-400">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="font-body text-sm text-black font-medium">{review.author_name}</p>
                      {review.content && <p className="font-body text-sm text-neutral-600 mt-1 line-clamp-2">{review.content}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* REQUEST TAB */}
        {activeTab === 'request' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-display text-lg font-medium text-black mb-6">Send Review Request</h2>
              <div className="flex gap-2 mb-6">
                <button onClick={() => setRequestMethod('email')} className={`flex-1 py-3 rounded-xl font-body text-sm font-medium transition ${requestMethod === 'email' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>✉️ Email</button>
                <button onClick={() => setRequestMethod('sms')} className={`flex-1 py-3 rounded-xl font-body text-sm font-medium transition ${requestMethod === 'sms' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>📱 SMS</button>
              </div>
              <div className="mb-6">
                <label className="font-body text-sm text-neutral-600 mb-2 block">Choose Template</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(templates).map(([key, template]) => (
                    <button key={key} onClick={() => setSelectedTemplate(key as keyof typeof templates)} className={`p-3 rounded-xl font-body text-xs font-medium transition ${selectedTemplate === key ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-2 border-transparent'}`}>
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="font-body text-sm text-neutral-600 mb-1 block">Customer Name</label>
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Smith" className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="font-body text-sm text-neutral-600 mb-1 block">{requestMethod === 'email' ? 'Email Address' : 'Phone Number'}</label>
                  <input type={requestMethod === 'email' ? 'email' : 'tel'} value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} placeholder={requestMethod === 'email' ? 'john@example.com' : '(555) 123-4567'} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <button onClick={sendReviewRequest} disabled={!customerName || !customerContact || sending} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-body font-semibold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {sending ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Sending...</span></>) : (<><span>Send {requestMethod === 'email' ? 'Email' : 'SMS'}</span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></>)}
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-display text-lg font-medium text-black mb-4">Message Preview</h2>
              {requestMethod === 'email' && (
                <div className="mb-4">
                  <label className="font-body text-xs text-neutral-500">Subject Line</label>
                  <p className="font-body text-sm font-medium text-black p-3 bg-neutral-50 rounded-lg mt-1">{templates[selectedTemplate].subject}</p>
                </div>
              )}
              <div>
                <label className="font-body text-xs text-neutral-500">{requestMethod === 'email' ? 'Email Body' : 'SMS Message'}</label>
                <div className="mt-1 p-4 bg-neutral-50 rounded-xl">
                  <pre className="font-body text-sm text-black whitespace-pre-wrap">{getFormattedMessage()}</pre>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="font-body text-xs text-blue-700">💡 <strong>Tip:</strong> Personalized messages get 40% more responses.</p>
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            {reviews.length === 0 ? (
              <div className="p-12 text-center">
                <span className="text-5xl mb-4 block">⭐</span>
                <h3 className="font-display text-xl font-medium text-black mb-2">No reviews yet</h3>
                <p className="font-body text-neutral-500 mb-6">Start collecting reviews to build your online reputation!</p>
                <button onClick={() => setActiveTab('request')} className="px-6 py-3 bg-black text-white rounded-full font-body font-medium hover:bg-black/80 transition">Send First Request</button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {reviews.map(review => (
                  <div key={review.id} className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                          <span className="font-body font-semibold text-neutral-600">{review.author_name?.charAt(0)?.toUpperCase() || '?'}</span>
                        </div>
                        <div>
                          <p className="font-body font-semibold text-black">{review.author_name}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">{[1,2,3,4,5].map(star => (<span key={star} className={`text-sm ${star <= review.rating ? 'text-amber-400' : 'text-neutral-300'}`}>★</span>))}</div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${platformConfig[review.platform].color}`}>{platformConfig[review.platform].icon} {platformConfig[review.platform].name}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-body text-xs text-neutral-400">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    {review.content && <p className="font-body text-sm text-neutral-700 mb-4">{review.content}</p>}
                    {review.responded ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <p className="font-body text-xs text-emerald-600 font-medium mb-1">✅ Your Response:</p>
                        <p className="font-body text-sm text-emerald-800">{review.response}</p>
                      </div>
                    ) : (
                      <button className="font-body text-sm text-blue-600 hover:text-blue-800 transition">💬 Write a response</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QR CODE TAB */}
        {activeTab === 'qr' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
              <h2 className="font-display text-lg font-medium text-black mb-6">Your Review QR Code</h2>
              <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-neutral-300 inline-block mb-6">
                <img src={generateQRCode()} alt="Review QR Code" className="w-64 h-64 mx-auto" />
              </div>
              <p className="font-body text-sm text-neutral-600 mb-6">Customers scan this code to leave a review for <strong>{project?.business_name}</strong></p>
              <div className="flex gap-3 justify-center">
                <button onClick={downloadQRCode} className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-body font-medium hover:bg-black/80 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span>Download PNG</span>
                </button>
                <button onClick={() => { navigator.clipboard.writeText(getReviewLink()); alert('Review link copied!'); }} className="flex items-center gap-2 px-6 py-3 bg-neutral-100 text-black rounded-full font-body font-medium hover:bg-neutral-200 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-display text-lg font-medium text-black mb-4">📍 Where to Place Your QR Code</h3>
                <ul className="space-y-3">
                  {[
                    { place: 'At the checkout counter', tip: 'Capture customers right after purchase' },
                    { place: 'On receipts & invoices', tip: 'Add to your invoice template' },
                    { place: 'Business cards', tip: 'Print on the back of your cards' },
                    { place: 'Table tents (restaurants)', tip: 'Place on every table' },
                    { place: 'Thank you cards', tip: 'Include with delivered products' },
                    { place: 'Vehicle wraps', tip: 'Add to service vehicles' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                      <div>
                        <p className="font-body text-sm font-medium text-black">{item.place}</p>
                        <p className="font-body text-xs text-neutral-500">{item.tip}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="font-body font-semibold text-amber-900 mb-2">💡 Pro Tip</h3>
                <p className="font-body text-sm text-amber-800">The best time to ask for a review is right after delivering great service. Happy customers are 70% more likely to leave a review when asked in person.</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="font-body font-semibold text-blue-900 mb-2">🎯 Review Goal</h3>
                <p className="font-body text-sm text-blue-800 mb-3">Businesses with 10+ reviews get 3x more customers. You currently have:</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${Math.min((stats.totalReviews / 10) * 100, 100)}%` }} />
                  </div>
                  <span className="font-body text-sm font-bold text-blue-900">{stats.totalReviews}/10</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
