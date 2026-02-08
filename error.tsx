'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-semibold text-black mb-3">Something went wrong</h2>
        <p className="text-neutral-500 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-black/80 transition"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-neutral-300 text-black text-sm font-medium rounded-full hover:bg-neutral-50 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
