// lib/outreach/templates.ts
// ═══════════════════════════════════════════════
// OUTREACH TEMPLATES
// SMS-first (Days 1-14), then SMS + Email (Day 15+)
//
// CRITICAL: Every SMS is slightly different.
// Carriers filter identical messages. We randomize greetings,
// phrasing, and emoji to make each text unique.
// ═══════════════════════════════════════════════

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://vektorlabs.com';

export interface LeadInfo {
  first_name: string;
  company_name: string;
  industry: string;
  site_score: number;
  site_issues: string[];
  city?: string;
}

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

// Full URL — no shorteners (carriers block them)
// Links to main landing page where they sign up FIRST
// No AI tokens burned until they give us their info
function previewUrl(): string { return APP_URL; }

// Click-tracked URL for emails
function trackedUrl(emailId: string): string {
  return `${APP_URL}/api/outreach/click/${emailId}?url=${encodeURIComponent(previewUrl())}`;
}

function pixel(id: string): string {
  return `<img src="${APP_URL}/api/outreach/track/${id}" width="1" height="1" style="display:none" alt="">`;
}

// ═══════════════════════════════════════
// SMS TEMPLATES (Days 1-14 primary channel)
// ═══════════════════════════════════════

// Step 1 (Day 0): The Hook
export function sms1(lead: LeadInfo): string {
  const greetings = [
    `Hey ${lead.first_name}`,
    `Hi ${lead.first_name}`,
    `${lead.first_name}`,
  ];
  const intros = [
    `I ran ${lead.company_name}'s website through Google's speed test`,
    `I just tested ${lead.company_name}'s website on Google PageSpeed`,
    `I checked ${lead.company_name}'s site speed`,
  ];
  const scores = [
    `— it scored ${lead.site_score}/100 on mobile`,
    `. Mobile score: ${lead.site_score}/100`,
    `and it got a ${lead.site_score}/100 on mobile`,
  ];
  const closes = [
    `We'll build you a better one for free — just answer 3 quick questions`,
    `Let us build you a new one for free. Takes 30 seconds`,
    `We can build you a better version for free. 3 questions, that's it`,
  ];

  return `${pick(greetings)}, ${pick(intros)}${pick(scores)}. ${pick(closes)}: ${previewUrl()}\n\nReply STOP to opt out`;
}

// Step 2 (Day 2): The Problem
export function sms2(lead: LeadInfo): string {
  const openers = [
    `Quick follow-up ${lead.first_name}`,
    `Hey ${lead.first_name}, quick thought`,
    `${lead.first_name} — one more thing`,
  ];
  const stats = [
    `53% of mobile visitors leave if a site takes more than 3 seconds to load`,
    `Over half of mobile visitors bounce if the site is slow`,
    `Most people leave a slow website within 3 seconds`,
  ];
  const refs = [
    `${lead.company_name}'s site is slower than that`,
    `Your current site is above that threshold`,
    `${lead.company_name}'s site is in that range`,
  ];

  return `${pick(openers)} — ${pick(stats)}. ${pick(refs)}. We'll build you a new ${lead.industry.toLowerCase()} website for free — 3 questions, 30 seconds: ${previewUrl()}\n\nReply STOP to opt out`;
}

// Step 3 (Day 5): Social Proof
export function sms3(lead: LeadInfo): string {
  return `${pick([`${lead.first_name}`, `Hey ${lead.first_name}`])} — the top ${lead.industry.toLowerCase()} websites ${pick(['load in under 2 seconds', 'are built mobile-first', 'convert 3x more visitors'])}. We'll build ${lead.company_name} one like that for free. ${pick(['Answer 3 quick questions', 'Takes 30 seconds'])}: ${previewUrl()}\n\nReply STOP to opt out`;
}

// Step 4 (Day 8): Breakup
export function sms4(lead: LeadInfo): string {
  return `${pick(['Last text', 'Final message'])} ${lead.first_name} — ${pick(["I know you're busy", "not trying to bug you"])}. If a new website for ${lead.company_name} isn't a priority right now, totally get it. Free offer stands: ${previewUrl()}\n\nReply STOP to opt out`;
}

// ═══════════════════════════════════════
// EMAIL TEMPLATES (Day 15+ when domains are warm)
// ═══════════════════════════════════════

function emailWrap(body: string, id: string, unsub: boolean = false): string {
  const u = unsub ? `<p style="font-size:11px;color:#bbb;margin-top:32px;"><a href="${APP_URL}/api/outreach/unsubscribe/${id}" style="color:#bbb;">Unsubscribe</a></p>` : '';
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.7;color:#1a1a1a;max-width:580px;">${body}<p style="margin-top:16px;">Jhordan<br><span style="color:#888;font-size:13px;">VektorLabs</span></p>${u}${pixel(id)}</div>`;
}

export function email1(lead: LeadInfo, id: string) {
  const link = trackedUrl(id);
  const subjects = [
    `${lead.first_name}, I checked ${lead.company_name}'s website`,
    `${lead.company_name}'s website — quick heads up`,
    `Free website for ${lead.company_name}, ${lead.first_name}`,
  ];
  const issueHtml = lead.site_issues.length
    ? `<p>Issues found:</p><ul style="color:#555;">${lead.site_issues.slice(0, 3).map(i => `<li>${i}</li>`).join('')}</ul>` : '';

  return {
    subject: pick(subjects),
    html: emailWrap(`
      <p>Hey ${lead.first_name},</p>
      <p>I ran <strong>${lead.company_name}</strong>'s website through Google's speed test. It scored <strong style="color:#dc2626;">${lead.site_score}/100</strong> on mobile.</p>
      <p>Anything below 50 means over half your visitors leave before the page even loads.</p>
      ${issueHtml}
      <p>We'll build ${lead.company_name} a modern ${lead.industry.toLowerCase()} website for free — just answer 3 quick questions:</p>
      <p style="margin:20px 0;"><a href="${link}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Get Your Free Website →</a></p>
      <p>No cost, no commitment. We build it, you decide if you want it.</p>
    `, id),
    text: `Hey ${lead.first_name},\n\nI ran ${lead.company_name}'s website through Google's speed test — ${lead.site_score}/100 on mobile. Anything below 50 means visitors leave.\n\nWe'll build you a new one for free. 3 questions, 30 seconds: ${previewUrl()}\n\nJhordan\nVektorLabs`,
  };
}

export function email2(lead: LeadInfo, id: string) {
  const link = trackedUrl(id);
  return {
    subject: `Re: ${lead.company_name}'s website`,
    html: emailWrap(`
      <p>Hey ${lead.first_name},</p>
      <p>Quick follow-up — <strong>53% of mobile visitors leave if a site takes more than 3 seconds to load.</strong></p>
      <p>${lead.company_name}'s site is slower than that. That's customers going to competitors.</p>
      <p>We build ${lead.industry.toLowerCase()} websites that convert — and we'll do it for free. 3 questions, 30 seconds:</p>
      <p style="margin:20px 0;"><a href="${link}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Build My Free Website →</a></p>
    `, id),
    text: `Hey ${lead.first_name},\n\n53% of mobile visitors leave slow sites. ${lead.company_name}'s is slower than the threshold.\n\nWe'll build you a better one for free: ${previewUrl()}\n\nJhordan\nVektorLabs`,
  };
}

export function email3(lead: LeadInfo, id: string) {
  const link = trackedUrl(id);
  return {
    subject: `What top ${lead.industry.toLowerCase()} websites do differently`,
    html: emailWrap(`
      <p>${lead.first_name},</p>
      <p>Top ${lead.industry.toLowerCase()} businesses getting customers online:</p>
      <ol style="color:#333;"><li style="margin:6px 0;"><strong>Under 2s load time</strong></li><li style="margin:6px 0;"><strong>Mobile-first design</strong></li><li style="margin:6px 0;"><strong>Clear call to action</strong></li></ol>
      <p>We'll build this for ${lead.company_name} — free. 3 questions:</p>
      <p style="margin:20px 0;"><a href="${link}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Get My Free Website →</a></p>
    `, id),
    text: `${lead.first_name},\n\nTop ${lead.industry.toLowerCase()} sites: fast, mobile-first, clear CTAs.\n\nWe'll build this for ${lead.company_name} for free: ${previewUrl()}\n\nJhordan\nVektorLabs`,
  };
}

export function email4(lead: LeadInfo, id: string) {
  const link = trackedUrl(id);
  return {
    subject: `Last one, ${lead.first_name}`,
    html: emailWrap(`
      <p>Hey ${lead.first_name},</p>
      <p>Last email. If a website upgrade isn't a priority right now, totally fine.</p>
      <p>But if you've been meaning to look into it — we'll build it for free. 3 questions, 30 seconds:</p>
      <p style="margin:20px 0;"><a href="${link}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Get Free Website →</a></p>
      <p>Wishing you the best with ${lead.company_name}.</p>
    `, id, true),
    text: `Hey ${lead.first_name},\n\nLast email. We'll build you a free website if you want it: ${previewUrl()}\n\nBest with ${lead.company_name}.\n\nJhordan\nVektorLabs`,
  };
}
