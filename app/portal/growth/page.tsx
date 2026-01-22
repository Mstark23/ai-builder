// /app/portal/growth/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// Quiz questions
const quizQuestions = [
  {
    id: 'traffic',
    question: "How do customers currently find you?",
    icon: '🔍',
    options: [
      { id: 'word-of-mouth', label: 'Mostly word of mouth / referrals', score: { visibility: 3, leads: 1 } },
      { id: 'social', label: 'Social media', score: { visibility: 2, leads: 1 } },
      { id: 'google', label: 'Google search', score: { visibility: 0, leads: 1 } },
      { id: 'not-sure', label: "I'm not sure", score: { visibility: 3, leads: 2 } },
    ]
  },
  {
    id: 'reviews',
    question: "How many online reviews do you have?",
    icon: '⭐',
    options: [
      { id: 'none', label: 'None yet', score: { trust: 3 } },
      { id: 'few', label: '1-5 reviews', score: { trust: 2 } },
      { id: 'some', label: '6-20 reviews', score: { trust: 1 } },
      { id: 'many', label: '20+ reviews', score: { trust: 0 } },
    ]
  },
  {
    id: 'leads',
    question: "How do you handle incoming leads?",
    icon: '📞',
    options: [
      { id: 'miss', label: 'I often miss calls or forget to follow up', score: { leads: 3 } },
      { id: 'manual', label: 'I track everything manually (notes, spreadsheet)', score: { leads: 2 } },
      { id: 'system', label: 'I have a system but it could be better', score: { leads: 1 } },
      { id: 'crm', label: 'I use a CRM and follow up consistently', score: { leads: 0 } },
    ]
  },
  {
    id: 'booking',
    question: "How do customers book appointments with you?",
    icon: '📅',
    options: [
      { id: 'call-only', label: 'They have to call me', score: { booking: 3 } },
      { id: 'message', label: 'Call, text, or message - whatever works', score: { booking: 2 } },
      { id: 'form', label: 'Contact form on my website', score: { booking: 1 } },
      { id: 'online', label: 'Online booking system', score: { booking: 0 } },
    ]
  },
  {
    id: 'goal',
    question: "What's your #1 goal right now?",
    icon: '🎯',
    options: [
      { id: 'more-customers', label: 'Get more customers', score: { visibility: 2, leads: 2 } },
      { id: 'reputation', label: 'Build my reputation online', score: { trust: 2, visibility: 1 } },
      { id: 'save-time', label: 'Save time on admin work', score: { booking: 2, leads: 1 } },
      { id: 'compete', label: 'Compete with bigger businesses', score: { visibility: 2, trust: 2 } },
    ]
  }
];

// Growth packages with solutions
const growthPackages = {
  visibility: {
    id: 'visibility',
    name: 'Get Found Package',
    tagline: 'Show up when customers search',
    problem: "You're invisible on Google",
    solution: "We'll get you ranking in local search results so customers find YOU instead of your competitors.",
    icon: '🔍',
    color: 'blue',
    price: 299,
    discountPrice: 199,
    monthly: 99,
    features: [
      'Google Business Profile optimization',
      'Listed on 30+ directories (Yelp, Facebook, etc.)',
      'Local SEO for your target keywords',
      'Monthly ranking reports',
      'Competitor tracking'
    ],
    stats: [
      { label: 'Avg. ranking improvement', value: '47 positions' },
      { label: 'More website visits', value: '+312%' },
    ],
    testimonial: {
      quote: "We went from page 5 to the top 3 in 2 months. Phone hasn't stopped ringing.",
      author: "Mike's Plumbing"
    }
  },
  trust: {
    id: 'trust',
    name: 'Trust Builder Package',
    tagline: 'Turn happy customers into 5-star reviews',
    problem: "You have no social proof",
    solution: "We'll help you collect and showcase reviews that convince new customers to choose you.",
    icon: '⭐',
    color: 'amber',
    price: 199,
    discountPrice: 149,
    monthly: 79,
    features: [
      'Automated review request system',
      'SMS & email templates',
      'QR codes for in-person requests',
      'Review monitoring & alerts',
      'Response templates (AI-powered)',
      'Negative review interception'
    ],
    stats: [
      { label: 'Avg. new reviews/month', value: '12' },
      { label: 'Average rating achieved', value: '4.8★' },
    ],
    testimonial: {
      quote: "Went from 3 reviews to 47 in just 3 months. Game changer.",
      author: "Sarah's Salon"
    }
  },
  leads: {
    id: 'leads',
    name: 'Lead Machine Package',
    tagline: 'Never miss another opportunity',
    problem: "You're losing leads",
    solution: "Capture every inquiry, get instant notifications, and follow up before they call your competitor.",
    icon: '📞',
    color: 'purple',
    price: 349,
    discountPrice: 249,
    monthly: 99,
    features: [
      'Lead inbox (all inquiries in one place)',
      'Instant SMS/email notifications',
      'Missed call text-back',
      'Follow-up reminders',
      'Simple CRM pipeline',
      'Lead source tracking'
    ],
    stats: [
      { label: 'Avg. response time', value: '< 5 min' },
      { label: 'More leads converted', value: '+67%' },
    ],
    testimonial: {
      quote: "I used to lose half my leads. Now I close 80% of inquiries.",
      author: "Johnson Electric"
    }
  },
  booking: {
    id: 'booking',
    name: 'Easy Booking Package',
    tagline: 'Let customers book 24/7',
    problem: "Scheduling is eating your time",
    solution: "Customers book online anytime. Automated reminders reduce no-shows. You get your time back.",
    icon: '📅',
    color: 'teal',
    price: 249,
    discountPrice: 179,
    monthly: 49,
    features: [
      'Online booking widget',
      'Calendar sync (Google, Outlook)',
      'Automated confirmations',
      'SMS reminder sequences',
      'Deposit/payment collection',
      'Rescheduling & cancellation handling'
    ],
    stats: [
      { label: 'Hours saved per week', value: '8+' },
      { label: 'Reduction in no-shows', value: '-73%' },
    ],
    testimonial: {
      quote: "I stopped playing phone tag. Customers book while I sleep.",
      author: "Zen Wellness Spa"
    }
  }
};

type QuizAnswers = Record<string, string>;
type Scores = Record<string, number>;

export default function GrowthQuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  
  // Quiz state
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [scores, setScores] = useState<Scores>({ visibility: 0, trust: 0, leads: 0, booking: 0 });
  const [showResults, setShowResults] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  // Check auth and load projects
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
    
    // Load user's projects
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('customer_id', user.id)
      .in('status', ['PAID', 'BUILDING', 'DELIVERED'])
      .order('created_at', { ascending: false });
    
    if (projectsData && projectsData.length > 0) {
      setProjects(projectsData);
      setSelectedProject(projectsData[0].id);
    }
    
    setLoading(false);
  };

  const handleAnswer = (questionId: string, optionId: string, optionScore: Record<string, number>) => {
    // Save answer
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    
    // Update scores
    setScores(prev => {
      const newScores = { ...prev };
      Object.entries(optionScore).forEach(([key, value]) => {
        newScores[key] = (newScores[key] || 0) + value;
      });
      return newScores;
    });
    
    // Move to next question or show results
    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const getRecommendations = () => {
    // Sort packages by score (highest need first)
    const sorted = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .filter(([, score]) => score >= 2) // Only recommend if score >= 2
      .map(([id]) => id);
    
    return sorted;
  };

  const togglePackage = (packageId: string) => {
    setSelectedPackages(prev =>
      prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  const calculateTotal = () => {
    const setup = selectedPackages.reduce((sum, id) => {
      const pkg = growthPackages[id as keyof typeof growthPackages];
      return sum + (pkg?.discountPrice || 0);
    }, 0);
    
    const monthly = selectedPackages.reduce((sum, id) => {
      const pkg = growthPackages[id as keyof typeof growthPackages];
      return sum + (pkg?.monthly || 0);
    }, 0);
    
    return { setup, monthly };
  };

  const handleCheckout = async () => {
    if (selectedPackages.length === 0) return;
    setProcessing(true);
    
    try {
      const response = await fetch('/api/checkout/growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject,
          packages: selectedPackages
        })
      });
      
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const resetQuiz = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setScores({ visibility: 0, trust: 0, leads: 0, booking: 0 });
    setShowResults(false);
    setSelectedPackages([]);
  };

  const recommendations = getRecommendations();
  const totals = calculateTotal();

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

  // No projects - need to buy a website first
  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-3">Growth Tools Locked</h1>
          <p className="text-neutral-600 mb-6">
            You need a website first before you can access growth tools. Get your custom website built in 72 hours!
          </p>
          <Link
            href="/portal/new-project"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/80 transition"
          >
            <span>Start Your Website</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
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
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/portal" className="flex items-center gap-2 text-neutral-600 hover:text-black transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="font-body text-sm">Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-display text-sm font-semibold">V</span>
              </div>
              <span className="font-body text-black font-semibold text-sm">Growth Tools</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* INTRO - Before quiz starts */}
        {!started && !showResults && (
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            
            <h1 className="font-display text-4xl font-medium text-black mb-4">
              Let's Grow Your Business
            </h1>
            <p className="font-body text-lg text-neutral-600 mb-8">
              Answer 5 quick questions and we'll show you exactly what's holding your business back — and how to fix it.
            </p>
            
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
              <p className="font-body text-sm text-neutral-500 mb-3">Select which website to analyze:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`px-4 py-2 rounded-full font-body text-sm font-medium transition ${
                      selectedProject === project.id
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {project.business_name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-body font-semibold hover:bg-black/80 transition"
            >
              <span>Start Growth Diagnostic</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            
            <p className="font-body text-xs text-neutral-400 mt-4">
              Takes less than 2 minutes • No commitment required
            </p>
          </div>
        )}

        {/* QUIZ QUESTIONS */}
        {started && !showResults && (
          <div className="max-w-xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-body text-sm text-neutral-500">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
                <span className="font-body text-sm font-medium text-black">
                  {Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-8">
              <div className="text-center mb-8">
                <span className="text-4xl mb-4 block">{quizQuestions[currentQuestion].icon}</span>
                <h2 className="font-display text-2xl font-medium text-black">
                  {quizQuestions[currentQuestion].question}
                </h2>
              </div>

              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(quizQuestions[currentQuestion].id, option.id, option.score)}
                    className={`w-full p-4 rounded-xl border-2 text-left font-body transition-all hover:border-black hover:bg-neutral-50 ${
                      answers[quizQuestions[currentQuestion].id] === option.id
                        ? 'border-black bg-neutral-50'
                        : 'border-neutral-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Back button */}
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="mt-6 flex items-center gap-2 font-body text-sm text-neutral-500 hover:text-black transition mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous question</span>
              </button>
            )}
          </div>
        )}

        {/* RESULTS */}
        {showResults && (
          <div>
            {/* Results Header */}
            <div className="text-center mb-10">
              <h1 className="font-display text-3xl font-medium text-black mb-3">
                Your Growth Diagnostic Results
              </h1>
              <p className="font-body text-neutral-600">
                Based on your answers, here's what's limiting your growth:
              </p>
            </div>

            {/* Score Summary */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
              <h3 className="font-body font-semibold text-black mb-4">Problem Areas Identified:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(scores).map(([key, score]) => {
                  const pkg = growthPackages[key as keyof typeof growthPackages];
                  const severity = score >= 3 ? 'Critical' : score >= 2 ? 'Moderate' : 'Low';
                  const severityColor = score >= 3 ? 'text-red-600 bg-red-100' : score >= 2 ? 'text-amber-600 bg-amber-100' : 'text-emerald-600 bg-emerald-100';
                  
                  return (
                    <div key={key} className="text-center p-4 bg-neutral-50 rounded-xl">
                      <span className="text-2xl mb-2 block">{pkg.icon}</span>
                      <p className="font-body text-sm font-medium text-black mb-1">{pkg.name.replace(' Package', '')}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full font-body text-xs font-medium ${severityColor}`}>
                        {severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 ? (
              <>
                <h2 className="font-display text-2xl font-medium text-black mb-6">
                  Recommended Solutions
                </h2>
                
                <div className="space-y-6 mb-8">
                  {recommendations.map((pkgId, index) => {
                    const pkg = growthPackages[pkgId as keyof typeof growthPackages];
                    const isSelected = selectedPackages.includes(pkgId);
                    const colorClasses: Record<string, string> = {
                      blue: 'border-blue-500 bg-blue-50',
                      amber: 'border-amber-500 bg-amber-50',
                      purple: 'border-purple-500 bg-purple-50',
                      teal: 'border-teal-500 bg-teal-50',
                    };
                    
                    return (
                      <div
                        key={pkgId}
                        className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
                          isSelected ? 'border-black shadow-lg' : 'border-neutral-200'
                        }`}
                      >
                        {/* Priority Badge */}
                        {index === 0 && (
                          <div className="bg-red-500 text-white text-center py-2 font-body text-sm font-semibold">
                            🔥 HIGHEST PRIORITY - Fix This First
                          </div>
                        )}
                        
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <button
                              onClick={() => togglePackage(pkgId)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                                isSelected ? 'border-black bg-black' : 'border-neutral-300 hover:border-black'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>

                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses[pkg.color] || 'bg-neutral-100'}`}>
                              <span className="text-3xl">{pkg.icon}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <h3 className="font-display text-xl font-medium text-black">{pkg.name}</h3>
                                  <p className="font-body text-sm text-neutral-500">{pkg.tagline}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="flex items-baseline gap-1">
                                    <span className="font-body text-sm text-neutral-400 line-through">${pkg.price}</span>
                                    <span className="font-display text-2xl font-bold text-black">${pkg.discountPrice}</span>
                                  </div>
                                  <p className="font-body text-xs text-neutral-400">+${pkg.monthly}/mo</p>
                                </div>
                              </div>

                              {/* Problem → Solution */}
                              <div className={`p-4 rounded-xl mb-4 ${colorClasses[pkg.color] || 'bg-neutral-50'}`}>
                                <p className="font-body text-sm">
                                  <span className="font-semibold">The Problem:</span> {pkg.problem}
                                </p>
                                <p className="font-body text-sm mt-2">
                                  <span className="font-semibold">Our Solution:</span> {pkg.solution}
                                </p>
                              </div>

                              {/* Features */}
                              <div className="grid sm:grid-cols-2 gap-2 mb-4">
                                {pkg.features.map((feature, i) => (
                                  <div key={i} className="flex items-center gap-2 font-body text-sm text-neutral-600">
                                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                  </div>
                                ))}
                              </div>

                              {/* Stats */}
                              <div className="flex gap-6 mb-4">
                                {pkg.stats.map((stat, i) => (
                                  <div key={i}>
                                    <p className="font-display text-xl font-bold text-black">{stat.value}</p>
                                    <p className="font-body text-xs text-neutral-500">{stat.label}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Testimonial */}
                              <div className="bg-neutral-50 rounded-lg p-3">
                                <p className="font-body text-sm text-neutral-600 italic">"{pkg.testimonial.quote}"</p>
                                <p className="font-body text-xs text-neutral-400 mt-1">— {pkg.testimonial.author}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Checkout Summary */}
                {selectedPackages.length > 0 && (
                  <div className="bg-black rounded-2xl p-6 text-white sticky bottom-4 shadow-2xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-body text-sm text-white/60 mb-1">
                          {selectedPackages.length} solution{selectedPackages.length > 1 ? 's' : ''} selected
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-3xl font-bold">${totals.setup}</span>
                          <span className="font-body text-white/60">setup</span>
                          <span className="text-white/40">+</span>
                          <span className="font-body font-semibold">${totals.monthly}/mo</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleCheckout}
                        disabled={processing}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-black font-body font-semibold rounded-full hover:bg-white/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {processing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Fix My Growth Issues</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-body text-xs text-white/40 mt-3 text-center sm:text-left">
                      30-day money-back guarantee • Cancel monthly services anytime
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-medium text-emerald-900 mb-2">
                  You're in Great Shape! 🎉
                </h3>
                <p className="font-body text-emerald-700">
                  Based on your answers, you're already doing well in most areas. Keep up the great work!
                </p>
              </div>
            )}

            {/* Retake Quiz */}
            <div className="text-center mt-8">
              <button
                onClick={resetQuiz}
                className="font-body text-neutral-500 hover:text-black text-sm transition"
              >
                ← Retake the diagnostic
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
