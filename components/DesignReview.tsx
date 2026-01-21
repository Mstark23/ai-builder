'use client';

import { useState } from 'react';

interface ReviewCategory {
  score: number;
  status: 'pass' | 'warning' | 'fail';
  findings?: { check: string; result: string; detail: string }[];
  issues?: string[];
  missingElements?: string[];
  forbiddenElementsFound?: string[];
  missingFeatures?: string[];
  foundFeatures?: string[];
}

interface ReviewData {
  overallScore: number;
  passesQuality: boolean;
  categories: {
    designDirection?: ReviewCategory;
    brandVoice?: ReviewCategory;
    colorPalette?: ReviewCategory & { colorsFound?: string[] };
    features?: ReviewCategory;
    heroSection?: ReviewCategory & { ctaText?: string };
    contentQuality?: ReviewCategory;
    technicalQuality?: ReviewCategory;
  };
  criticalIssues: string[];
  warnings: string[];
  suggestions: string[];
  summary: string;
}

interface DesignReviewProps {
  projectId: string;
  generatedHtml?: string;
  existingReview?: ReviewData;
  onReviewComplete?: (review: ReviewData) => void;
}

export default function DesignReview({ 
  projectId, 
  generatedHtml,
  existingReview,
  onReviewComplete 
}: DesignReviewProps) {
  const [review, setReview] = useState<ReviewData | null>(existingReview || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const runReview = async () => {
    if (!generatedHtml) {
      setError('No HTML to review');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, generatedHtml }),
      });

      if (!response.ok) {
        throw new Error('Review failed');
      }

      const data = await response.json();
      setReview(data.review);
      onReviewComplete?.(data.review);
    } catch (err: any) {
      setError(err.message || 'Review failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return (
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01" />
            </svg>
          </div>
        );
      case 'fail':
        return (
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const categoryLabels: Record<string, string> = {
    designDirection: 'Design Direction',
    brandVoice: 'Brand Voice',
    colorPalette: 'Color Palette',
    features: 'Requested Features',
    heroSection: 'Hero Section',
    contentQuality: 'Content Quality',
    technicalQuality: 'Technical Quality',
  };

  // No review yet - show run button
  if (!review) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-black text-lg">AI Design Review</h3>
            <p className="text-sm text-neutral-500">Automatically check if the design matches requirements</p>
          </div>
          <button
            onClick={runReview}
            disabled={loading || !generatedHtml}
            className="px-4 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Reviewing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Run AI Review
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {!generatedHtml && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
            Generate a design first to run the quality review.
          </div>
        )}
      </div>
    );
  }

  // Show review results
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      {/* Header with Overall Score */}
      <div className={`p-6 ${review.passesQuality ? 'bg-emerald-50' : 'bg-amber-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-black text-lg">AI Design Review</h3>
            <p className="text-sm text-neutral-600 mt-1">{review.summary}</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(review.overallScore)}`}>
              {review.overallScore}
            </div>
            <div className="text-xs text-neutral-500 mt-1">/ 100</div>
          </div>
        </div>

        {/* Score Bar */}
        <div className="mt-4 h-2 bg-white/50 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getScoreBg(review.overallScore)} transition-all duration-500`}
            style={{ width: `${review.overallScore}%` }}
          />
        </div>

        {/* Status Badge */}
        <div className="mt-3">
          {review.passesQuality ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Ready for Client Review
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
              Needs Revisions
            </span>
          )}
        </div>
      </div>

      {/* Critical Issues */}
      {review.criticalIssues.length > 0 && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <h4 className="font-medium text-red-800 text-sm mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Critical Issues ({review.criticalIssues.length})
          </h4>
          <ul className="space-y-1">
            {review.criticalIssues.map((issue, i) => (
              <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Category Scores */}
      <div className="p-4 border-b border-neutral-100">
        <h4 className="font-medium text-black text-sm mb-3">Category Breakdown</h4>
        <div className="space-y-2">
          {Object.entries(review.categories).map(([key, category]) => {
            if (!category) return null;
            const isExpanded = expanded === key;
            
            return (
              <div key={key} className="border border-neutral-100 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : key)}
                  className="w-full p-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(category.status)}
                    <span className="font-medium text-sm text-black">
                      {categoryLabels[key] || key}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold text-sm ${getScoreColor(category.score)}`}>
                      {category.score}%
                    </span>
                    <svg 
                      className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-3 pt-0 border-t border-neutral-100 bg-neutral-50">
                    {/* Findings */}
                    {category.findings && category.findings.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Checks</span>
                        <div className="mt-1 space-y-1">
                          {category.findings.map((finding, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className={finding.result === 'pass' ? 'text-emerald-500' : 'text-red-500'}>
                                {finding.result === 'pass' ? '✓' : '✗'}
                              </span>
                              <div>
                                <span className="text-neutral-700">{finding.check}</span>
                                {finding.detail && (
                                  <span className="text-neutral-500 ml-1">— {finding.detail}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Elements */}
                    {category.missingElements && category.missingElements.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-red-600">Missing:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {category.missingElements.map((el, i) => (
                            <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                              {el}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Features */}
                    {category.missingFeatures && category.missingFeatures.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-red-600">Missing Features:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {category.missingFeatures.map((f, i) => (
                            <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Found Features */}
                    {category.foundFeatures && category.foundFeatures.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-emerald-600">Found:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {category.foundFeatures.map((f, i) => (
                            <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Colors Found */}
                    {'colorsFound' in category && category.colorsFound && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-neutral-600">Colors Detected:</span>
                        <div className="flex gap-1 mt-1">
                          {category.colorsFound.map((color, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded border border-neutral-200"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Issues */}
                    {category.issues && category.issues.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-amber-600">Issues:</span>
                        <ul className="mt-1 space-y-0.5">
                          {category.issues.map((issue, i) => (
                            <li key={i} className="text-xs text-neutral-600">• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Warnings */}
      {review.warnings.length > 0 && (
        <div className="p-4 border-b border-neutral-100">
          <h4 className="font-medium text-amber-700 text-sm mb-2">Warnings</h4>
          <ul className="space-y-1">
            {review.warnings.map((warning, i) => (
              <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">⚠</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {review.suggestions.length > 0 && (
        <div className="p-4 border-b border-neutral-100">
          <h4 className="font-medium text-blue-700 text-sm mb-2">Suggestions</h4>
          <ul className="space-y-1">
            {review.suggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">💡</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Re-run Button */}
      <div className="p-4 bg-neutral-50">
        <button
          onClick={runReview}
          disabled={loading}
          className="w-full px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg font-medium text-sm hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
              Re-running Review...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Re-run Review
            </>
          )}
        </button>
      </div>
    </div>
  );
}
