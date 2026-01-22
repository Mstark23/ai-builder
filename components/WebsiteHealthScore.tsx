// /components/WebsiteHealthScore.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type HealthCheck = {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'checking';
  score: number;
  maxScore: number;
  recommendation?: string;
  fixUrl?: string;
  category: 'seo' | 'performance' | 'security' | 'presence';
};

type WebsiteHealthScoreProps = {
  projectId: string;
  businessName: string;
  websiteUrl?: string;
  googlePlaceId?: string;
  compact?: boolean;
  onScoreCalculated?: (score: number) => void;
};

const categoryConfig = {
  seo: { name: 'SEO', icon: '🔍', color: 'blue' },
  performance: { name: 'Performance', icon: '⚡', color: 'amber' },
  security: { name: 'Security', icon: '🔒', color: 'emerald' },
  presence: { name: 'Online Presence', icon: '🌐', color: 'purple' },
};

export default function WebsiteHealthScore({
  projectId,
  businessName,
  websiteUrl,
  googlePlaceId,
  compact = false,
  onScoreCalculated,
}: WebsiteHealthScoreProps) {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallScore, setOverallScore] = useState(0);
  const [expanded, setExpanded] = useState(!compact);

  useEffect(() => {
    runHealthChecks();
  }, [projectId, websiteUrl]);

  const runHealthChecks = async () => {
    setLoading(true);

    // Initialize checks
    const initialChecks: HealthCheck[] = [
      // SEO Checks
      {
        id: 'google-indexed',
        name: 'Google Indexed',
        description: 'Your website appears in Google search results',
        status: 'checking',
        score: 0,
        maxScore: 15,
        category: 'seo',
        recommendation: 'Submit your sitemap to Google Search Console',
        fixUrl: '/portal/growth',
      },
      {
        id: 'meta-tags',
        name: 'Meta Tags Optimized',
        description: 'Title and description are set correctly',
        status: 'checking',
        score: 0,
        maxScore: 10,
        category: 'seo',
        recommendation: 'Add compelling meta title and description',
      },
      {
        id: 'mobile-friendly',
        name: 'Mobile Friendly',
        description: 'Website works well on mobile devices',
        status: 'checking',
        score: 0,
        maxScore: 15,
        category: 'seo',
        recommendation: 'Ensure responsive design on all pages',
      },
      // Performance Checks
      {
        id: 'page-speed',
        name: 'Page Speed',
        description: 'Website loads in under 3 seconds',
        status: 'checking',
        score: 0,
        maxScore: 15,
        category: 'performance',
        recommendation: 'Optimize images and enable caching',
      },
      {
        id: 'images-optimized',
        name: 'Images Optimized',
        description: 'Images are compressed and properly sized',
        status: 'checking',
        score: 0,
        maxScore: 10,
        category: 'performance',
        recommendation: 'Compress images and use modern formats',
      },
      // Security Checks
      {
        id: 'ssl-certificate',
        name: 'SSL Certificate',
        description: 'Website uses HTTPS encryption',
        status: 'checking',
        score: 0,
        maxScore: 15,
        category: 'security',
        recommendation: 'Install SSL certificate for secure browsing',
      },
      // Online Presence Checks
      {
        id: 'google-business',
        name: 'Google Business Profile',
        description: 'Business is listed on Google Maps',
        status: 'checking',
        score: 0,
        maxScore: 10,
        category: 'presence',
        recommendation: 'Create and verify your Google Business Profile',
        fixUrl: '/portal/growth',
      },
      {
        id: 'review-count',
        name: 'Customer Reviews',
        description: 'Has 5+ customer reviews online',
        status: 'checking',
        score: 0,
        maxScore: 10,
        category: 'presence',
        recommendation: 'Start collecting reviews from happy customers',
        fixUrl: '/portal/reviews',
      },
    ];

    setChecks(initialChecks);

    // Simulate running checks (in production, these would be real API calls)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Run each check with simulated results
    // In production, replace with actual API calls
    const updatedChecks = await Promise.all(
      initialChecks.map(async (check, index) => {
        await new Promise(resolve => setTimeout(resolve, 200 * index));

        // Simulate check results based on available data
        let status: HealthCheck['status'] = 'fail';
        let score = 0;

        switch (check.id) {
          case 'ssl-certificate':
            // Check if URL starts with https
            if (websiteUrl?.startsWith('https://')) {
              status = 'pass';
              score = check.maxScore;
            }
            break;

          case 'google-business':
            if (googlePlaceId) {
              status = 'pass';
              score = check.maxScore;
            }
            break;

          case 'mobile-friendly':
            // Assume our websites are mobile-friendly
            status = 'pass';
            score = check.maxScore;
            break;

          case 'meta-tags':
            // Simulate: 70% chance of passing
            if (Math.random() > 0.3) {
              status = 'pass';
              score = check.maxScore;
            } else {
              status = 'warning';
              score = Math.floor(check.maxScore * 0.5);
            }
            break;

          case 'google-indexed':
            // Simulate based on whether site exists
            if (websiteUrl) {
              if (Math.random() > 0.4) {
                status = 'pass';
                score = check.maxScore;
              } else {
                status = 'warning';
                score = Math.floor(check.maxScore * 0.3);
              }
            }
            break;

          case 'page-speed':
            // Simulate: most sites pass
            if (Math.random() > 0.2) {
              status = 'pass';
              score = check.maxScore;
            } else {
              status = 'warning';
              score = Math.floor(check.maxScore * 0.6);
            }
            break;

          case 'images-optimized':
            // Simulate
            if (Math.random() > 0.3) {
              status = 'pass';
              score = check.maxScore;
            } else {
              status = 'warning';
              score = Math.floor(check.maxScore * 0.5);
            }
            break;

          case 'review-count':
            // Usually fails for new businesses
            if (Math.random() > 0.7) {
              status = 'pass';
              score = check.maxScore;
            } else if (Math.random() > 0.5) {
              status = 'warning';
              score = Math.floor(check.maxScore * 0.3);
            }
            break;
        }

        return { ...check, status, score };
      })
    );

    setChecks(updatedChecks);

    // Calculate overall score
    const totalScore = updatedChecks.reduce((sum, check) => sum + check.score, 0);
    const maxPossible = updatedChecks.reduce((sum, check) => sum + check.maxScore, 0);
    const percentage = Math.round((totalScore / maxPossible) * 100);

    setOverallScore(percentage);
    setLoading(false);

    if (onScoreCalculated) {
      onScoreCalculated(percentage);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-100' };
    if (score >= 60) return { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-100' };
    return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Critical';
  };

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warning': return '⚠️';
      case 'checking': return '⏳';
    }
  };

  const scoreColor = getScoreColor(overallScore);
  const failedChecks = checks.filter(c => c.status === 'fail' || c.status === 'warning');

  // Compact view
  if (compact && !expanded) {
    return (
      <div
        onClick={() => setExpanded(true)}
        className="bg-white rounded-2xl border border-neutral-200 p-6 cursor-pointer hover:shadow-lg transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full ${scoreColor.light} flex items-center justify-center`}>
              {loading ? (
                <div className="w-6 h-6 border-2 border-neutral-300 border-t-black rounded-full animate-spin"></div>
              ) : (
                <span className={`font-display text-2xl font-bold ${scoreColor.text}`}>{overallScore}</span>
              )}
            </div>
            <div>
              <h3 className="font-body font-semibold text-black">Website Health Score</h3>
              <p className="font-body text-sm text-neutral-500">
                {loading ? 'Analyzing...' : `${getScoreLabel(overallScore)} • ${failedChecks.length} issues found`}
              </p>
            </div>
          </div>
          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-medium text-black">Website Health Score</h2>
            <p className="font-body text-sm text-neutral-500">{businessName}</p>
          </div>
          {compact && (
            <button
              onClick={() => setExpanded(false)}
              className="text-neutral-400 hover:text-black transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Score Circle */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e5e5"
                strokeWidth="12"
                fill="none"
              />
              {!loading && (
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(overallScore / 100) * 352} 352`}
                  className="transition-all duration-1000"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {loading ? (
                <div className="w-8 h-8 border-3 border-neutral-300 border-t-black rounded-full animate-spin"></div>
              ) : (
                <div className="text-center">
                  <span className={`font-display text-4xl font-bold ${scoreColor.text}`}>{overallScore}</span>
                  <p className="font-body text-xs text-neutral-500">/ 100</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className={`inline-block px-3 py-1 rounded-full ${scoreColor.light} ${scoreColor.text} font-body text-sm font-semibold mb-2`}>
              {loading ? 'Analyzing...' : getScoreLabel(overallScore)}
            </div>
            <p className="font-body text-sm text-neutral-600 mb-3">
              {loading
                ? 'Running health checks on your website...'
                : overallScore >= 80
                ? "Great job! Your website is performing well."
                : overallScore >= 60
                ? "Your website is doing okay, but there's room for improvement."
                : "Your website needs attention. Fix the issues below to improve."}
            </p>
            {!loading && failedChecks.length > 0 && (
              <p className="font-body text-sm">
                <span className="text-red-600 font-semibold">{failedChecks.length} issue{failedChecks.length > 1 ? 's' : ''}</span>
                <span className="text-neutral-500"> found that may be hurting your business</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="p-6 border-b border-neutral-100">
        <h3 className="font-body font-semibold text-black mb-4">Score Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const categoryChecks = checks.filter(c => c.category === key);
            const categoryScore = categoryChecks.reduce((sum, c) => sum + c.score, 0);
            const categoryMax = categoryChecks.reduce((sum, c) => sum + c.maxScore, 0);
            const categoryPercent = categoryMax > 0 ? Math.round((categoryScore / categoryMax) * 100) : 0;

            return (
              <div key={key} className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{config.icon}</span>
                  <span className="font-body text-xs font-medium text-neutral-600">{config.name}</span>
                </div>
                <p className={`font-display text-2xl font-bold ${getScoreColor(categoryPercent).text}`}>
                  {loading ? '-' : categoryPercent}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Checks */}
      <div className="p-6">
        <h3 className="font-body font-semibold text-black mb-4">Detailed Checks</h3>
        <div className="space-y-3">
          {checks.map(check => (
            <div
              key={check.id}
              className={`p-4 rounded-xl border transition ${
                check.status === 'pass'
                  ? 'bg-emerald-50 border-emerald-200'
                  : check.status === 'warning'
                  ? 'bg-amber-50 border-amber-200'
                  : check.status === 'fail'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{getStatusIcon(check.status)}</span>
                  <div>
                    <p className="font-body font-semibold text-black">{check.name}</p>
                    <p className="font-body text-sm text-neutral-600">{check.description}</p>
                    {(check.status === 'fail' || check.status === 'warning') && check.recommendation && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-body text-xs text-neutral-500">💡 {check.recommendation}</span>
                        {check.fixUrl && (
                          <Link
                            href={check.fixUrl}
                            className="font-body text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Fix it →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`font-body text-sm font-semibold ${
                    check.status === 'pass' ? 'text-emerald-600' :
                    check.status === 'warning' ? 'text-amber-600' :
                    check.status === 'fail' ? 'text-red-600' : 'text-neutral-400'
                  }`}>
                    {check.score}/{check.maxScore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!loading && overallScore < 80 && (
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-medium mb-1">Want to improve your score?</h3>
              <p className="font-body text-sm text-white/80">Our Growth packages can fix these issues for you.</p>
            </div>
            <Link
              href="/portal/growth"
              className="px-6 py-3 bg-white text-blue-600 rounded-full font-body font-semibold hover:bg-white/90 transition flex-shrink-0"
            >
              View Solutions
            </Link>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="p-4 border-t border-neutral-100 text-center">
        <button
          onClick={runHealthChecks}
          disabled={loading}
          className="font-body text-sm text-neutral-500 hover:text-black transition disabled:opacity-50"
        >
          {loading ? 'Running checks...' : '🔄 Refresh Score'}
        </button>
      </div>
    </div>
  );
}
