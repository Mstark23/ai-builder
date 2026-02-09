// lib/tracker.ts
// VektorLabs Internal Tracking System
// Tracks: page views, clicks, scroll depth, email captures, real-time presence

const COOKIE_NAME = 'vl_vid';
const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const SCROLL_THROTTLE = 2000; // 2 seconds
const API_ENDPOINT = '/api/track';

// ── Cookie helpers ──
function getVisitorId(): string {
  if (typeof document === 'undefined') return '';
  
  const cookies = document.cookie.split(';').reduce((acc, c) => {
    const [key, val] = c.trim().split('=');
    acc[key] = val;
    return acc;
  }, {} as Record<string, string>);

  if (cookies[COOKIE_NAME]) return cookies[COOKIE_NAME];

  // Generate new visitor ID
  const vid = 'vl_' + crypto.randomUUID().replace(/-/g, '').substring(0, 16);
  
  // Set cookie for 1 year
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${vid};path=/;expires=${expires};SameSite=Lax`;
  
  return vid;
}

// ── Device detection ──
function getDevice(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return 'mobile';
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  return 'desktop';
}

function getBrowser(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  return 'Other';
}

// ── UTM extraction ──
function getUTMs(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
  };
}

// ── Send tracking data ──
async function sendEvent(data: Record<string, unknown>): Promise<void> {
  try {
    const payload = {
      ...data,
      visitor_id: getVisitorId(),
      timestamp: new Date().toISOString(),
    };

    // Use sendBeacon if available (works on page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(API_ENDPOINT, JSON.stringify(payload));
    } else {
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  } catch (e) {
    // Silent fail — tracking should never break the app
  }
}

// ── Main tracker class ──
export class VLTracker {
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private maxScroll = 0;
  private pageLoadTime = Date.now();
  private currentPage = '';
  private scrollTimer: ReturnType<typeof setTimeout> | null = null;
  private initialized = false;

  init() {
    if (typeof window === 'undefined' || this.initialized) return;
    this.initialized = true;

    const vid = getVisitorId();
    this.currentPage = window.location.pathname;
    this.pageLoadTime = Date.now();
    this.maxScroll = 0;

    // ── Track page view ──
    sendEvent({
      type: 'pageview',
      page: this.currentPage,
      referrer: document.referrer || null,
      device: getDevice(),
      browser: getBrowser(),
      ...getUTMs(),
    });

    // ── Start heartbeat (real-time presence) ──
    this.startHeartbeat();

    // ── Track scroll depth (throttled) ──
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      this.maxScroll = Math.max(this.maxScroll, depth);

      if (this.scrollTimer) clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        sendEvent({
          type: 'scroll',
          page: this.currentPage,
          scroll_depth: this.maxScroll,
        });
      }, SCROLL_THROTTLE);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ── Track CTA clicks ──
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button, a[href], [data-track]');
      if (!button) return;

      const trackName = button.getAttribute('data-track');
      const text = button.textContent?.trim().substring(0, 50);
      const href = button.getAttribute('href');

      // Only track meaningful clicks
      if (trackName || href?.startsWith('/') || text?.toLowerCase().includes('get started') || text?.toLowerCase().includes('sign') || text?.toLowerCase().includes('register')) {
        sendEvent({
          type: 'click',
          event_name: trackName || text || 'unknown',
          page: this.currentPage,
          metadata: { text, href, tag: button.tagName },
        });
      }
    });

    // ── Track email input (partial capture) ──
    document.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'email' && target.value && target.value.includes('@')) {
        sendEvent({
          type: 'email_capture',
          email: target.value,
          page: this.currentPage,
          source: 'form_input',
        });
      }
    });

    // ── Track page unload (duration + final scroll) ──
    const handleUnload = () => {
      const duration = Math.round((Date.now() - this.pageLoadTime) / 1000);
      sendEvent({
        type: 'page_leave',
        page: this.currentPage,
        duration_seconds: duration,
        scroll_depth: this.maxScroll,
      });
    };

    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') handleUnload();
    });
  }

  // ── Heartbeat for real-time tracking ──
  private startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      sendEvent({
        type: 'heartbeat',
        page: window.location.pathname,
      });
    }, HEARTBEAT_INTERVAL);
  }

  // ── Track page navigation (for SPA) ──
  trackPageChange(newPage: string) {
    // Send leave event for old page
    const duration = Math.round((Date.now() - this.pageLoadTime) / 1000);
    sendEvent({
      type: 'page_leave',
      page: this.currentPage,
      duration_seconds: duration,
      scroll_depth: this.maxScroll,
    });

    // Reset for new page
    this.currentPage = newPage;
    this.pageLoadTime = Date.now();
    this.maxScroll = 0;

    // Send new pageview
    sendEvent({
      type: 'pageview',
      page: newPage,
      referrer: this.currentPage,
      device: getDevice(),
      browser: getBrowser(),
    });
  }

  // ── Manual event tracking ──
  trackEvent(eventName: string, metadata?: Record<string, unknown>) {
    sendEvent({
      type: 'custom',
      event_name: eventName,
      page: window.location.pathname,
      metadata,
    });
  }

  // ── Track exit intent email ──
  trackEmailCapture(email: string, source: string = 'exit_intent') {
    sendEvent({
      type: 'email_capture',
      email,
      page: window.location.pathname,
      source,
    });
  }

  // ── Identity stitching (link anonymous → registered) ──
  identify(customerId: string, email: string) {
    sendEvent({
      type: 'identify',
      customer_id: customerId,
      email,
    });
  }

  destroy() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.initialized = false;
  }
}

// Singleton instance
export const tracker = new VLTracker();
