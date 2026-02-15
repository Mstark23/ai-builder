'use client';

import { useState, useEffect } from 'react';

interface LeadTimerProps {
  createdAt: string; // ISO timestamp of when the lead came in
  previewSentAt?: string | null; // ISO timestamp of when SMS was sent (null = not sent yet)
  compact?: boolean; // smaller version for list views
}

export default function LeadTimer({ createdAt, previewSentAt, compact = false }: LeadTimerProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const created = new Date(createdAt).getTime();
  const deadline = created + 60 * 60 * 1000; // 1 hour from creation
  const remaining = deadline - now;
  const totalMs = 60 * 60 * 1000;
  const progress = Math.max(0, Math.min(1, 1 - remaining / totalMs));

  // If preview was already sent
  if (previewSentAt) {
    const sentTime = new Date(previewSentAt).getTime();
    const deliveryTime = sentTime - created;
    const minutes = Math.floor(deliveryTime / 60000);
    const wasOnTime = deliveryTime <= totalMs;

    if (compact) {
      return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${wasOnTime ? 'text-emerald-600' : 'text-orange-600'}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Sent in {minutes}m
        </span>
      );
    }

    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${wasOnTime ? 'bg-emerald-50 border border-emerald-200' : 'bg-orange-50 border border-orange-200'}`}>
        <svg className={`w-4 h-4 ${wasOnTime ? 'text-emerald-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className={`text-sm font-medium ${wasOnTime ? 'text-emerald-700' : 'text-orange-700'}`}>
          Preview sent in {minutes} min
        </span>
      </div>
    );
  }

  // Timer is running
  const isOverdue = remaining <= 0;
  const isWarning = remaining > 0 && remaining <= 15 * 60 * 1000; // < 15 min
  const isUrgent = remaining > 0 && remaining <= 5 * 60 * 1000; // < 5 min

  const absRemaining = Math.abs(remaining);
  const hours = Math.floor(absRemaining / 3600000);
  const minutes = Math.floor((absRemaining % 3600000) / 60000);
  const seconds = Math.floor((absRemaining % 60000) / 1000);

  const timeStr = hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;

  // Colors
  const colorClass = isOverdue
    ? 'text-red-600'
    : isUrgent
      ? 'text-red-500'
      : isWarning
        ? 'text-amber-600'
        : 'text-emerald-600';

  const bgClass = isOverdue
    ? 'bg-red-50 border-red-200'
    : isUrgent
      ? 'bg-red-50 border-red-200'
      : isWarning
        ? 'bg-amber-50 border-amber-200'
        : 'bg-emerald-50 border-emerald-200';

  const barColor = isOverdue
    ? 'bg-red-500'
    : isUrgent
      ? 'bg-red-500'
      : isWarning
        ? 'bg-amber-500'
        : 'bg-emerald-500';

  // ── Compact version (for list rows) ──
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold tabular-nums ${
          isOverdue ? 'bg-red-100 text-red-700 animate-pulse' :
          isUrgent ? 'bg-red-100 text-red-600' :
          isWarning ? 'bg-amber-100 text-amber-700' :
          'bg-emerald-100 text-emerald-700'
        }`}>
          {isOverdue ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {isOverdue ? `-${timeStr}` : timeStr}
        </div>
      </div>
    );
  }

  // ── Full version (for project detail page) ──
  return (
    <div className={`rounded-xl border p-4 ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isOverdue ? (
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          ) : (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUrgent ? 'bg-red-100' : isWarning ? 'bg-amber-100' : 'bg-emerald-100'
            }`}>
              <svg className={`w-4 h-4 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          <div>
            <span className={`text-sm font-semibold ${isOverdue ? 'text-red-700' : isWarning ? 'text-amber-800' : 'text-emerald-800'}`}>
              {isOverdue ? 'OVERDUE' : 'Preview Deadline'}
            </span>
            <p className="text-xs text-neutral-500">
              {isOverdue
                ? 'Customer should have received their preview by now'
                : 'Customer expects their preview within 1 hour'}
            </p>
          </div>
        </div>
        <div className={`text-2xl font-bold tabular-nums ${colorClass} ${isOverdue ? 'animate-pulse' : ''}`}>
          {isOverdue ? '-' : ''}{timeStr}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor} ${isOverdue ? 'animate-pulse' : ''}`}
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>

      {/* Urgency message */}
      {isOverdue && (
        <p className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1">
          <span>⚠️</span> Overdue by {timeStr} — send the preview now!
        </p>
      )}
      {isUrgent && !isOverdue && (
        <p className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1">
          <span>🔥</span> Less than 5 minutes — hurry!
        </p>
      )}
      {isWarning && !isUrgent && (
        <p className="mt-2 text-xs font-medium text-amber-600 flex items-center gap-1">
          <span>⏰</span> Under 15 minutes remaining
        </p>
      )}
    </div>
  );
}
