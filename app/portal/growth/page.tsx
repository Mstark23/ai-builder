'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Customer = {
  id: string;
  name: string;
  email: string;
  business_name: string;
};

type Project = {
  id: string;
  business_name: string;
  status: string;
  plan: string;
  paid: boolean;
};

// All 10 Business Problems & Solutions
const businessProblems = [
  {
    id: 'visibility',
    question: "People can't find my business online",
    icon: '👻',
    title: "You're Invisible Online",
    subtitle: "Customers search, but you don't show up",
    description: "When someone searches for your type of business in your area, you don't appear. Every day, potential customers find your competitors instead of you.",
    symptoms: [
      "Website exists but gets no traffic",
      "Not showing up in Google searches", 
      "Competitors appear above you",
      "Customers say 'I couldn't find you online'"
    ],
    color: 'red',
    severity: 'critical',
    solution: {
      name: 'Get Found Package',
      tagline: 'Show up when customers search for businesses like yours',
      price: 299,
      monthly: 99,
      monthlyLabel: 'ongoing management',
      timeline: '7-10 days',
      features: [
        'Google Business Profile setup & verification',
        'Local SEO optimization for your website',
        'Submit to 30+ directories (Yelp, Apple Maps, etc.)',
        'Google Maps optimization',
        'NAP consistency across all platforms',
        'Monthly ranking report'
      ],
      guarantee: "Show up on Google in 30 days or full refund",
      result: 'Appear in Google search results'
    }
  },
  {
    id: 'trust',
    question: "I don't have enough reviews or social proof",
    icon: '⭐',
    title: "Customers Don't Trust You Yet",
    subtitle: "Few reviews = lost sales to competitors",
    description: "93% of customers read reviews before buying. With few or no reviews, potential customers are choosing competitors who have more social proof.",
    symptoms: [
      "Few or no online reviews",
      "Prospects call but choose competitors",
      "People think you're 'new' (even if you're not)",
      "Lost deals to businesses with more reviews"
    ],
    color: 'amber',
    severity: 'critical',
    solution: {
      name: 'Trust Builder Package',
      tagline: 'Get the reviews that turn browsers into buyers',
      price: 199,
      monthly: 79,
      monthlyLabel: '30 reviews/month goal',
      timeline: '7 days to first reviews',
      features: [
        'Review strategy session',
        'Automated SMS + email review requests',
        'Review landing page with 1-click links',
        'QR code cards for in-person requests',
        'Professional response templates',
        'Review monitoring + alerts',
        'Website review widget'
      ],
      guarantee: "Get 10+ new 5-star reviews in 60 days or money back",
      result: '15-25 new reviews in 60 days'
    }
  },
  {
    id: 'leads',
    question: "My phone isn't ringing with new customers",
    icon: '📞',
    title: "Your Website Isn't Generating Leads",
    subtitle: "Traffic without conversions = wasted opportunity",
    description: "People are visiting your website, but they're leaving without contacting you. Every visitor who leaves is money walking out the door.",
    symptoms: [
      "Website gets traffic but no inquiries",
      "Contact form submissions are rare",
      "Relying 100% on word-of-mouth",
      "No idea where leads come from"
    ],
    color: 'blue',
    severity: 'high',
    solution: {
      name: 'Lead Machine Package',
      tagline: 'Turn website visitors into phone calls and inquiries',
      price: 349,
      monthly: 99,
      monthlyLabel: 'ongoing optimization',
      timeline: '5-7 days',
      features: [
        'Conversion audit of your website',
        'Lead capture popup (exit-intent + timed)',
        'Optimized, mobile-friendly contact forms',
        'Click-to-call buttons',
        'Lead magnet creation (free guide/discount)',
        'Instant lead notifications (SMS + email)',
        'Lead tracking dashboard',
        'Monthly conversion report'
      ],
      guarantee: "Double your leads in 60 days or we work free until you do",
      result: '2-3x more leads within 60 days'
    }
  },
  {
    id: 'retention',
    question: "Customers buy once and never come back",
    icon: '🚪',
    title: "You're Losing Repeat Business",
    subtitle: "Always chasing new customers is exhausting",
    description: "It costs 5x more to acquire a new customer than keep an existing one. Without a retention system, you're working harder than you need to.",
    symptoms: [
      "Always chasing new customers",
      "One-time buyers disappear",
      "No repeat business",
      "High customer acquisition costs"
    ],
    color: 'purple',
    severity: 'high',
    solution: {
      name: 'Customer Loyalty Package',
      tagline: 'Turn one-time buyers into lifelong customers',
      price: 299,
      monthly: 99,
      monthlyLabel: 'ongoing management',
      timeline: '10-14 days',
      features: [
        'Customer database setup & organization',
        'Automated post-purchase follow-ups',
        'Birthday & anniversary emails',
        'Loyalty program (points/punch cards/tiers)',
        'Referral program setup',
        'Win-back campaigns for inactive customers',
        'VIP customer identification',
        'Monthly retention report'
      ],
      guarantee: "25% more repeat customers in 90 days or 2 months free",
      result: '25% increase in repeat customers'
    }
  },
  {
    id: 'time',
    question: "I don't have time for marketing",
    icon: '⏰',
    title: "Marketing Falls Through the Cracks",
    subtitle: "Too busy running your business to promote it",
    description: "You know you should be posting on social media, updating your website, and sending emails. But there's never enough time. So it doesn't happen.",
    symptoms: [
      "Too busy working IN the business",
      "Social media is dead or outdated",
      "Website content is stale",
      "Marketing feels overwhelming"
    ],
    color: 'orange',
    severity: 'medium',
    solution: {
      name: 'Marketing Autopilot Package',
      tagline: 'We handle your marketing so you can run your business',
      price: null,
      monthly: 349,
      monthlyLabel: 'done-for-you',
      timeline: 'First content in 7 days',
      features: [
        '3-month content strategy & calendar',
        '3 social media posts per week (2 platforms)',
        '2 SEO blog articles per month',
        '2 email newsletters per month',
        'Up to 4 website content updates/month',
        'Holiday & seasonal content',
        'Monthly content calendar preview',
        'Performance report'
      ],
      guarantee: "Cancel anytime after 3 months if not satisfied",
      result: 'Consistent online presence, zero effort'
    }
  },
  {
    id: 'ads',
    question: "I've wasted money on ads that didn't work",
    icon: '💸',
    title: "Your Ads Aren't Profitable",
    subtitle: "Spent money but got nothing in return",
    description: "You tried Facebook or Google ads, but got clicks without customers. It felt like throwing money away. The problem wasn't ads—it was how they were set up.",
    symptoms: [
      "Tried ads, didn't work",
      "Spent money but got no customers",
      "Don't know if ads are profitable",
      "Feel like ads are a scam"
    ],
    color: 'red',
    severity: 'high',
    solution: {
      name: 'Smart Ads Package',
      tagline: 'Ads that actually bring in customers, not just clicks',
      price: 399,
      monthly: 299,
      monthlyLabel: 'management (ad spend separate)',
      timeline: 'Ads live in 10 days',
      features: [
        'Ad strategy session (goals, budget, targeting)',
        'Google Ads setup (Search, Maps, Display)',
        'Facebook/Instagram ads (optional)',
        'Landing page optimization',
        'Conversion tracking setup',
        'A/B testing & optimization',
        'Negative keyword management',
        'Weekly performance reports',
        'Monthly strategy calls'
      ],
      guarantee: "Get leads in 30 days or next month management is free",
      result: 'Positive ROI within 60 days'
    }
  },
  {
    id: 'scheduling',
    question: "Scheduling appointments is eating my time",
    icon: '📅',
    title: "Scheduling Chaos is Costing You",
    subtitle: "Phone tag, double-bookings, and no-shows",
    description: "You're spending hours playing phone tag, dealing with double-bookings, and losing money to no-shows. There's a better way.",
    symptoms: [
      "Constant phone tag with customers",
      "Double bookings happen",
      "No-shows cost you money",
      "Hours spent on calendar management"
    ],
    color: 'teal',
    severity: 'medium',
    solution: {
      name: 'Easy Booking Package',
      tagline: 'Let customers book 24/7 without calling you',
      price: 249,
      monthly: 49,
      monthlyLabel: 'booking software',
      timeline: '3-5 days',
      features: [
        'Online booking system setup',
        'Website booking button integration',
        'Google Calendar sync',
        'Automated confirmation emails + SMS',
        'Reminder sequences (24hr + 2hr before)',
        'Deposit/prepayment collection',
        'Easy rescheduling for customers',
        'Buffer time between appointments',
        'Staff calendar management',
        'Monthly booking analytics'
      ],
      guarantee: "Save 5+ hours/week or we refund setup",
      result: '50% fewer no-shows, hours saved weekly'
    }
  },
  {
    id: 'competition',
    question: "I can't compete with bigger brands",
    icon: '🏢',
    title: "Big Brands Are Stealing Your Customers",
    subtitle: "Feeling invisible next to franchises",
    description: "Big chains have bigger budgets and more brand recognition. But they can't be local, personal, and authentic like you. That's your advantage.",
    symptoms: [
      "Big chains have bigger budgets",
      "Feel invisible next to franchises",
      "Competing on price (race to bottom)",
      "Losing customers to 'known' brands"
    ],
    color: 'indigo',
    severity: 'medium',
    solution: {
      name: 'Stand Out Package',
      tagline: "Compete by being what big brands can't—local, personal, real",
      price: 599,
      monthly: 79,
      monthlyLabel: 'competitor monitoring',
      timeline: '14-21 days',
      features: [
        'Competitive analysis (top 5 competitors)',
        'Differentiation strategy session',
        'Brand story development',
        'Website messaging refresh',
        'Local authority content',
        '"Why Choose Us" page creation',
        'Customer testimonial collection',
        'Local partnership strategy',
        'Review response personality guide',
        'Monthly competitor monitoring'
      ],
      guarantee: "Satisfaction guarantee with revision rounds",
      result: 'Clear differentiation customers notice'
    }
  },
  {
    id: 'revenue',
    question: "My monthly revenue is unpredictable",
    icon: '📉',
    title: "Feast or Famine Revenue",
    subtitle: "Great months, then terrible months",
    description: "Some months are amazing, others are scary. Without predictable revenue, it's hard to plan, hire, or sleep well. You need recurring income you can count on.",
    symptoms: [
      "Feast or famine cycles",
      "Great months followed by terrible ones",
      "Seasonal dips hurt badly",
      "Hard to plan or hire"
    ],
    color: 'emerald',
    severity: 'high',
    solution: {
      name: 'Predictable Revenue Package',
      tagline: 'Build steady monthly income you can count on',
      price: 499,
      monthly: 149,
      monthlyLabel: 'ongoing optimization',
      timeline: '21-30 days',
      features: [
        'Revenue model strategy session',
        'Membership/subscription design',
        'Prepaid package creation',
        'Recurring payment system setup',
        'Member portal (if applicable)',
        'Retention email sequences',
        'Upgrade/upsell campaigns',
        'Churn prevention system',
        'Revenue dashboard',
        'Monthly strategy call'
      ],
      guarantee: "5+ recurring customers in 90 days or we extend free",
      result: 'Predictable recurring revenue'
    }
  },
  {
    id: 'data',
    question: "I don't know what marketing is actually working",
    icon: '🎯',
    title: "You're Flying Blind",
    subtitle: "No data = decisions based on gut feeling",
    description: "You're spending money and time on marketing but have no idea what's actually working. Without data, you can't improve. You're guessing.",
    symptoms: [
      "Making decisions on gut feeling",
      "No idea where customers come from",
      "Don't know your best marketing channel",
      "Can't measure ROI on anything"
    ],
    color: 'cyan',
    severity: 'medium',
    solution: {
      name: 'Business Clarity Package',
      tagline: "Finally see what's working (and what's not)",
      price: 299,
      monthly: 79,
      monthlyLabel: 'reporting + dashboard',
      timeline: '7-10 days setup',
      features: [
        'Google Analytics 4 setup',
        'Google Search Console setup',
        'Call tracking (know which ads drive calls)',
        'Form tracking (every submission tracked)',
        'Lead source attribution',
        'Custom all-in-one dashboard',
        'Conversion goal setup',
        'UTM tracking system',
        'Competitor benchmarking',
        'Monthly analytics report (plain English)',
        'Quarterly strategy review'
      ],
      guarantee: "If data doesn't help decisions, 2 months free",
      result: 'Clear understanding of marketing ROI'
    }
  }
];

// Color mapping for Tailwind classes
const colorMap: Record<string, { bg: string; border: string; text: string; light: string }> = {
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', light: 'bg-red-100' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', light: 'bg-amber-100' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', light: 'bg-blue-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', light: 'bg-purple-100' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', light: 'bg-orange-100' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', light: 'bg-teal-100' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', light: 'bg-indigo-100' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', light: 'bg-emerald-100' },
  cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600', light: 'bg-cyan-100' },
};

export default function GrowthDiagnosis() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  
  // Quiz state
  const [step, setStep] = useState<'quiz' | 'result' | 'all'>('quiz');
  const [selectedProblem, setSelectedProblem] = useState<typeof businessProblems[0] | null>(null);

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
    await loadData(user.id);
  };

  const loadData = async (userId: string) => {
    try {
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (customerData) {
        setCustomer(customerData);
      }

      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', userId)
        .or('paid.eq.true,status.eq.DELIVERED');

      if (projectsData && projectsData.length > 0) {
        setProjects(projectsData);
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProblem = (problem: typeof businessProblems[0]) => {
    setSelectedProblem(problem);
    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToQuiz = () => {
    setSelectedProblem(null);
    setStep('quiz');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  // LOCKED STATE
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#fafafa] antialiased">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
          .font-display { font-family: 'Playfair Display', Georgia, serif; }
          .font-body { font-family: 'Inter', -apple-system, sans-serif; }
        `}</style>

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
                <Link href="/portal/growth" className="px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium">Growth</Link>
                <Link href="/portal/messages" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">Messages</Link>
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

        <main className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="font-display text-4xl font-medium text-black mb-4">Unlock Business Growth</h1>
            <p className="font-body text-lg text-neutral-500 mb-8 max-w-lg mx-auto">
              Complete your website purchase to get personalized solutions for growing your business.
            </p>
            <Link href="/portal" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-all">
              <span>View Your Projects</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const colors = selectedProblem ? colorMap[selectedProblem.color] : null;

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
              <Link href="/portal/growth" className="px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium">Growth</Link>
              <Link href="/portal/messages" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">Messages</Link>
              <Link href="/portal/billing" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">Billing</Link>
              <Link href="/portal/settings" className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-full font-body text-sm font-medium transition-colors">Settings</Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-body text-sm font-medium">{customer?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
                <div className="hidden lg:block">
                  <p className="font-body text-sm font-medium text-black">{customer?.name || 'User'}</p>
                  <p className="font-body text-xs text-neutral-500">{user?.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE NAV */}
      <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 sticky top-20 z-30">
        <div className="flex gap-2 overflow-x-auto">
          <Link href="/portal" className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full font-body text-sm font-medium whitespace-nowrap">Dashboard</Link>
          <Link href="/portal/growth" className="px-4 py-2 bg-black text-white rounded-full font-body text-sm font-medium whitespace-nowrap">Growth</Link>
          <Link href="/portal/messages" className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full font-body text-sm font-medium whitespace-nowrap">Messages</Link>
          <Link href="/portal/billing" className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full font-body text-sm font-medium whitespace-nowrap">Billing</Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        
        {/* QUIZ STEP */}
        {step === 'quiz' && (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full mb-4">
                <span className="text-sm">🎯</span>
                <span className="font-body text-sm font-medium">Business Growth Diagnosis</span>
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-medium text-black mb-3">
                What's your biggest challenge?
              </h1>
              <p className="font-body text-neutral-500 text-lg">
                Select the issue that's blocking your growth. We'll show you exactly how to fix it.
              </p>
            </div>

            {/* PROBLEM CARDS */}
            <div className="space-y-3 mb-10">
              {businessProblems.map((problem) => {
                const pColors = colorMap[problem.color];
                return (
                  <button
                    key={problem.id}
                    onClick={() => handleSelectProblem(problem)}
                    className={`w-full text-left p-5 rounded-2xl border-2 ${pColors.border} ${pColors.bg} hover:shadow-lg transition-all group`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${pColors.light} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <span className="text-2xl">{problem.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-body font-semibold text-black group-hover:text-black/80">{problem.question}</p>
                        <p className="font-body text-sm text-neutral-500">{problem.solution.tagline}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {problem.severity === 'critical' && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-body text-xs font-medium hidden sm:block">Critical</span>
                        )}
                        <svg className={`w-5 h-5 ${pColors.text} group-hover:translate-x-1 transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* NOT SURE */}
            <div className="text-center pt-8 border-t border-neutral-200">
              <p className="font-body text-neutral-500 mb-4">Not sure what your biggest problem is?</p>
              <Link href="/portal/messages" className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-300 text-black font-body font-medium rounded-full hover:bg-neutral-50 transition-all">
                <span>Chat with our team</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>
          </>
        )}

        {/* RESULT STEP */}
        {step === 'result' && selectedProblem && colors && (
          <>
            {/* BACK BUTTON */}
            <button 
              onClick={handleBackToQuiz}
              className="flex items-center gap-2 text-neutral-500 hover:text-black font-body text-sm mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to all problems</span>
            </button>

            {/* THE PROBLEM */}
            <div className={`${colors.bg} ${colors.border} border-2 rounded-3xl p-8 mb-8`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 ${colors.light} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-4xl">{selectedProblem.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold font-body ${
                      selectedProblem.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      selectedProblem.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedProblem.severity === 'critical' ? '🚨 Critical Issue' : 
                       selectedProblem.severity === 'high' ? '⚠️ High Priority' : 
                       '📈 Growth Opportunity'}
                    </span>
                  </div>
                  <h1 className={`font-display text-2xl lg:text-3xl font-medium ${colors.text}`}>
                    {selectedProblem.title}
                  </h1>
                  <p className="font-body text-neutral-600 mt-1">{selectedProblem.subtitle}</p>
                </div>
              </div>

              <p className="font-body text-neutral-700 text-lg leading-relaxed mb-6">
                {selectedProblem.description}
              </p>

              {/* SYMPTOMS */}
              <div className="bg-white/70 rounded-2xl p-5">
                <p className="font-body text-sm font-semibold text-neutral-700 mb-3">Sound familiar?</p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {selectedProblem.symptoms.map((symptom, i) => (
                    <li key={i} className="flex items-center gap-2 font-body text-sm text-neutral-600">
                      <span className={`w-5 h-5 ${colors.light} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <svg className={`w-3 h-3 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* THE SOLUTION */}
            <div className="bg-black rounded-3xl p-8 text-white relative overflow-hidden mb-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💡</span>
                  <span className="font-body text-sm font-semibold text-emerald-400 uppercase tracking-wide">The Solution</span>
                </div>
                
                <h2 className="font-display text-3xl font-medium mb-2">{selectedProblem.solution.name}</h2>
                <p className="font-body text-white/70 text-lg mb-6">{selectedProblem.solution.tagline}</p>

                {/* FEATURES */}
                <div className="bg-white/10 rounded-2xl p-6 mb-6">
                  <p className="font-body text-sm font-semibold text-white/80 mb-4">What's included:</p>
                  <ul className="space-y-3">
                    {selectedProblem.solution.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 font-body text-white/90">
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* PRICING */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-4 border-t border-white/20">
                  <div>
                    {selectedProblem.solution.price ? (
                      <>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-display text-4xl font-bold">${selectedProblem.solution.price}</span>
                          <span className="font-body text-white/50">one-time setup</span>
                        </div>
                        <p className="font-body text-sm text-white/60">
                          + ${selectedProblem.solution.monthly}/mo {selectedProblem.solution.monthlyLabel}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-display text-4xl font-bold">${selectedProblem.solution.monthly}</span>
                          <span className="font-body text-white/50">/month</span>
                        </div>
                        <p className="font-body text-sm text-white/60">{selectedProblem.solution.monthlyLabel}</p>
                      </>
                    )}
                    <p className="font-body text-xs text-emerald-400 mt-2">
                      ⏱️ {selectedProblem.solution.timeline}
                    </p>
                  </div>
                  
                  <button className="w-full lg:w-auto px-8 py-4 bg-white text-black font-body font-semibold rounded-full hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                    <span>Get Started Now</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* GUARANTEE */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-body font-semibold text-emerald-900 mb-1">Our Guarantee</h3>
                  <p className="font-body text-emerald-700">{selectedProblem.solution.guarantee}</p>
                </div>
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-body text-sm font-medium text-black">Fast Results</p>
                <p className="font-body text-xs text-neutral-500">{selectedProblem.solution.timeline}</p>
              </div>
              
              <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="font-body text-sm font-medium text-black">Done For You</p>
                <p className="font-body text-xs text-neutral-500">We handle everything</p>
              </div>
              
              <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-body text-sm font-medium text-black">Clear ROI</p>
                <p className="font-body text-xs text-neutral-500">{selectedProblem.solution.result}</p>
              </div>
            </div>

            {/* OTHER OPTIONS */}
            <div className="text-center pt-8 border-t border-neutral-200">
              <p className="font-body text-neutral-500 mb-4">Have another challenge?</p>
              <button 
                onClick={handleBackToQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-300 text-black font-body font-medium rounded-full hover:bg-neutral-50 transition-all"
              >
                <span>See All Problems & Solutions</span>
              </button>
            </div>
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-neutral-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-neutral-500">© 2025 Verktorlabs. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">Privacy</Link>
              <Link href="/terms" className="font-body text-sm text-neutral-500 hover:text-black transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
