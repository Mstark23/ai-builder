// components/TrackerProvider.tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { tracker } from '@/lib/tracker';

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const initialized = useRef(false);

  // Initialize tracker on mount
  useEffect(() => {
    if (!initialized.current) {
      tracker.init();
      initialized.current = true;
    }

    return () => {
      tracker.destroy();
      initialized.current = false;
    };
  }, []);

  // Track page changes (SPA navigation)
  useEffect(() => {
    if (initialized.current && prevPathname.current !== pathname) {
      tracker.trackPageChange(pathname);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return <>{children}</>;
}
