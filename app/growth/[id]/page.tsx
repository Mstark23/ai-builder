'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const QUESTIONS = [
  {
    id: 'clients_source',
    question: 'How are you currently getting clients?',
    type: 'multi',
    options: ['Word of mouth / Referrals', 'Social media', 'Google / SEO', 'Paid ads', 'Door-to-door / Cold calling', 'I\'m just getting started'],
  },
  {
    id: 'monthly_clients',
    question: 'How many new clients or jobs do you get per month?',
    type: 'single',
    options: ['0 – 5', '5 – 15', '15 – 30', '30+', 'Not sure'],
  },
  {
    id: 'biggest_challenge',
    question: 'What\'s your biggest challenge growing right now?',
    type: 'single',
    options: [
      'Not enough leads coming in',
      'Leads come in but don\'t convert',
      'Too busy — can\'t follow up fast enough',
      'No online presence / outdated website',
      'Spending on ads with no clear ROI',
      'Don\'t know what\'s working and what isn\'t',
    ],
  },
  {
    id: 'goal_12_months',
    question: 'Where do you want your business to be in 12 months?',
    type: 'single',
    options: [
      'Double my revenue',
      'Get consistent, predictable leads',
      'Stop relying on referrals only',
      'Build a real brand / online presence',
      'Automate so I can focus on the work',
      'All of the above',
    ],
  },
  {
    id: 'marketing_spend',
    question: 'Are you currently spending on marketing?',
    type: 'single',
    options: ['Nothing right now', 'Under $500/month', '$500 – $2,000/month', '$2,000+/month', 'I spend but don\'t track it'],
  },
];

export default function GrowthPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    // Fetch project info for personalization
    fetch(`/api/preview/${projectId}`)
      .then(r => r.json())
      .then(d => {
        if (d.business_name) setBusinessName(d.business_name);
      })
      .catch(() => {});
  }, [projectId]);

  const q = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;
  const isLast = currentQ === QUESTIONS.length - 1;

  const selectOption = (option: string) => {
    if (q.type === 'multi') {
      const current = (answers[q.id] as string[]) || [];
      if (current.includes(option)) {
        setAnswers({ ...answers, [q.id]: current.filter(o => o !== option) });
      } else {
        setAnswers({ ...answers, [q.id]: [...current, option] });
      }
    } else {
      setAnswers({ ...answers, [q.id]: option });
    }
  };

  const isSelected = (option: string) => {
    if (q.type === 'multi') {
      return ((answers[q.id] as string[]) || []).includes(option);
    }
    return answers[q.id] === option;
  };

  const canProceed = q.type === 'multi'
    ? ((answers[q.id] as string[]) || []).length > 0
    : !!answers[q.id];

  const next = async () => {
    if (!isLast) {
      setCurrentQ(currentQ + 1);
      return;
    }

    // Submit answers
    setSubmitting(true);
    try {
      await fetch('/api/needs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          type: 'growth_assessment',
          answers,
        }),
      });
    } catch (e) {
      console.error('Failed to save answers:', e);
    }

    // Go to booking page
    router.push(`/book/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] antialiased">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-d { font-family: 'Playfair Display', Georgia, serif; }
        .font-b { font-family: 'Inter', -apple-system, sans-serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
      `}</style>

      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[10%] -right-[150px] w-[600px] h-[600px] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[10%] -left-[150px] w-[500px] h-[500px] bg-gradient-to-tr from-neutral-100 to-neutral-200 rounded-full blur-3xl opacity-40" />

        {/* Card */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 max-w-[560px] w-full shadow-2xl shadow-neutral-200/50">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-d text-lg font-semibold">V</span>
              </div>
              <span className="font-b text-sm font-semibold tracking-wide text-black">VEKTORLABS</span>
            </div>
            <span className="font-b text-xs text-neutral-400">{currentQ + 1} of {QUESTIONS.length}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-neutral-100 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Personalized intro */}
          {currentQ === 0 && businessName && (
            <p className="font-b text-sm text-neutral-500 mb-2">
              We built your preview for <strong className="text-black">{businessName}</strong>. Now help us understand your business so we can show you how to grow it.
            </p>
          )}

          {/* Question */}
          <div key={currentQ} className="fade-up">
            <h2 className="font-d text-2xl sm:text-[28px] font-medium text-black mb-6 leading-snug">
              {q.question}
            </h2>

            {q.type === 'multi' && (
              <p className="font-b text-xs text-neutral-400 mb-4">Select all that apply</p>
            )}

            {/* Options */}
            <div className="space-y-3">
              {q.options.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    selectOption(option);
                    // Auto-advance on single select
                    if (q.type === 'single' && !isLast) {
                      setTimeout(() => setCurrentQ(currentQ + 1), 300);
                    }
                  }}
                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-b text-[15px] transition-all duration-200 ${
                    isSelected(option)
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isSelected(option) && (
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)}
              className={`font-b text-sm font-medium transition-colors ${currentQ > 0 ? 'text-neutral-500 hover:text-black cursor-pointer' : 'text-transparent cursor-default'}`}
            >
              ← Back
            </button>

            {(q.type === 'multi' || isLast) && (
              <button
                onClick={next}
                disabled={!canProceed || submitting}
                className={`px-8 py-3.5 rounded-full font-b text-sm font-medium tracking-wide transition-all ${
                  canProceed
                    ? 'bg-black text-white hover:shadow-xl hover:shadow-black/20'
                    : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                }`}
              >
                {submitting ? 'Loading...' : isLast ? 'Book My Free Strategy Call →' : 'Next →'}
              </button>
            )}
          </div>

          {/* Trust footer */}
          <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-neutral-100">
            {['100% confidential', 'No commitment', 'Takes 2 minutes'].map(t => (
              <span key={t} className="font-b text-[11px] text-neutral-400 flex items-center gap-1">
                <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
