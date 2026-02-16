// lib/outreach/google-scraper.ts
// ═══════════════════════════════════════════════
// GOOGLE MAPS LEAD SCRAPER
// ═══════════════════════════════════════════════
// FREE: Google Cloud gives $200/month credit = ~10K searches
// Finds businesses → grabs website + phone → scrapes email from site
//
// Setup: 
//   1. Go to console.cloud.google.com
//   2. Enable "Places API"
//   3. Create API key → add to env as GOOGLE_PLACES_API_KEY
//   4. You get $200/month free (covers ~10K searches)
// ═══════════════════════════════════════════════

import { supabaseAdmin } from '@/lib/supabaseAdmin';

const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Industry → Google Maps search queries
const SEARCH_QUERIES: Record<string, string[]> = {
  'medical spa': ['medical spa', 'med spa', 'medspa', 'aesthetic clinic', 'cosmetic clinic'],
  'home services': ['plumber', 'plumbing company', 'HVAC company', 'roofing company', 'electrician', 'AC repair', 'handyman service'],
  'restaurant': ['restaurant', 'cafe', 'bistro'],
  'real estate': ['real estate agency', 'realtor office'],
  'beauty': ['beauty salon', 'hair salon', 'nail salon'],
  'fitness': ['gym', 'fitness studio', 'personal trainer'],
  'dental': ['dentist', 'dental clinic'],
  'construction': ['construction company', 'general contractor'],
};

function getSearchQueries(industry: string): string[] {
  const lower = industry.toLowerCase();
  for (const [key, queries] of Object.entries(SEARCH_QUERIES)) {
    if (lower.includes(key)) return queries;
  }
  return [industry];
}

// Try to extract email from a website
async function scrapeEmail(websiteUrl: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(websiteUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VektorBot/1.0)' },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const html = await res.text();

    // Find emails in the HTML
    const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
    const emails = html.match(emailRegex) || [];

    // Filter out common junk emails
    const junk = ['example.com', 'sentry.io', 'wixpress.com', 'googleapis.com', 'schema.org', 'w3.org', 'gravatar.com'];
    const good = emails.filter(e => {
      const domain = e.split('@')[1]?.toLowerCase();
      return domain && !junk.some(j => domain.includes(j));
    });

    // Prefer info@, contact@, owner@, hello@ 
    const preferred = good.find(e => /^(info|contact|owner|hello|admin|office|support|team|booking)@/i.test(e));
    return preferred || good[0] || null;
  } catch {
    return null;
  }
}

// Try contact/about pages if homepage has no email
async function deepScrapeEmail(websiteUrl: string): Promise<string | null> {
  // Try homepage first
  let email = await scrapeEmail(websiteUrl);
  if (email) return email;

  // Try common contact pages
  const paths = ['/contact', '/contact-us', '/about', '/about-us'];
  const base = websiteUrl.replace(/\/$/, '');

  for (const path of paths) {
    email = await scrapeEmail(`${base}${path}`);
    if (email) return email;
  }

  return null;
}

function cleanUrl(url: string | undefined): string | null {
  if (!url) return null;
  let u = url.trim();
  if (!u.startsWith('http')) u = 'https://' + u;
  try { new URL(u); return u; } catch { return null; }
}

function cleanPhone(phone: string | undefined): string | null {
  if (!phone) return null;
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10) cleaned = '+1' + cleaned;
    else if (cleaned.length === 11 && cleaned.startsWith('1')) cleaned = '+' + cleaned;
    else return null;
  }
  if (cleaned.length < 11) return null;
  return cleaned;
}

// Extract owner name from business name (fallback)
function guessOwnerName(businessName: string): { first: string; last: string } {
  // Common patterns: "John's Plumbing", "Smith & Sons HVAC"
  const possessive = businessName.match(/^(\w+)'s\s/);
  if (possessive) return { first: possessive[1], last: '' };
  return { first: 'Business', last: 'Owner' };
}

export async function scrapeGoogleMaps(params: {
  industry?: string;
  city?: string;
  country?: string;
  limit?: number;
  campaign?: string;
}): Promise<{ imported: number; skipped: number; errors: number }> {
  const { industry = 'restaurant', city = 'Miami', country = 'United States', limit = 25, campaign } = params;

  if (!PLACES_KEY) {
    console.error('[Google] GOOGLE_PLACES_API_KEY not set');
    return { imported: 0, skipped: 0, errors: 1 };
  }

  console.log(`[Google] Searching for ${industry} in ${city}, ${country} (limit: ${limit})`);

  let imported = 0, skipped = 0, errors = 0;
  const queries = getSearchQueries(industry);

  for (const query of queries) {
    if (imported >= limit) break;

    const searchQuery = `${query} in ${city}`;
    console.log(`[Google] Query: "${searchQuery}"`);

    try {
      // Text Search API
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${PLACES_KEY}`;
      const res = await fetch(url);

      if (!res.ok) {
        console.error(`[Google] Text search failed: ${res.status}`);
        errors++;
        continue;
      }

      const data = await res.json();

      if (data.status !== 'OK') {
        console.error(`[Google] API status: ${data.status} - ${data.error_message || ''}`);
        errors++;
        continue;
      }

      console.log(`[Google] Found ${data.results?.length || 0} results for "${searchQuery}"`);

      for (const place of (data.results || [])) {
        if (imported >= limit) break;

        // Get detailed info (website, phone)
        const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,website,formatted_address,business_status&key=${PLACES_KEY}`;
        const detailRes = await fetch(detailUrl);
        const detail = await detailRes.json();
        const biz = detail.result;

        if (!biz || biz.business_status === 'CLOSED_PERMANENTLY') {
          skipped++;
          continue;
        }

        const website = cleanUrl(biz.website);
        const phone = cleanPhone(biz.formatted_phone_number);

        // Must have at least website or phone
        if (!website && !phone) {
          skipped++;
          continue;
        }

        // Try to find email from website
        let email: string | null = null;
        if (website) {
          email = await deepScrapeEmail(website);
        }

        // If no email found, generate a likely one from domain
        if (!email && website) {
          try {
            const domain = new URL(website).hostname.replace('www.', '');
            email = `info@${domain}`;
          } catch { }
        }

        // Dedup check
        if (email) {
          const { data: d1 } = await supabaseAdmin.from('outreach_leads').select('id').eq('email', email.toLowerCase()).maybeSingle();
          if (d1) { skipped++; continue; }
          const { data: d2 } = await supabaseAdmin.from('customers').select('id').eq('email', email.toLowerCase()).maybeSingle();
          if (d2) { skipped++; continue; }
        } else if (phone) {
          const { data: d1 } = await supabaseAdmin.from('outreach_leads').select('id').eq('phone', phone).maybeSingle();
          if (d1) { skipped++; continue; }
        } else {
          skipped++;
          continue;
        }

        const ownerName = guessOwnerName(biz.name || '');

        const mapIndustry = (ind: string) => {
          const lower = ind.toLowerCase();
          if (lower.includes('med') || lower.includes('spa') || lower.includes('aesthetic')) return 'Medical Spa';
          if (lower.includes('plumb') || lower.includes('hvac') || lower.includes('roof') || lower.includes('electric') || lower.includes('home')) return 'Home Services';
          if (lower.includes('restaurant') || lower.includes('food')) return 'Restaurants & Food';
          if (lower.includes('beauty') || lower.includes('salon')) return 'Beauty & Skincare';
          if (lower.includes('dental') || lower.includes('dentist')) return 'Dental & Medical';
          if (lower.includes('fitness') || lower.includes('gym')) return 'Fitness & Gym';
          return ind;
        };

        const { error: err } = await supabaseAdmin.from('outreach_leads').insert({
          first_name: ownerName.first,
          last_name: ownerName.last,
          email: email?.toLowerCase().trim() || null,
          phone: phone || null,
          job_title: 'Owner',
          company_name: biz.name || 'Business',
          company_website: website || '',
          industry: mapIndustry(industry),
          city: city,
          state: null,
          country: country,
          employee_count: null,
          apollo_id: null,
          google_place_id: place.place_id,
          status: 'new',
          campaign: campaign || null,
        });

        if (err) {
          if (err.code === '23505') skipped++;
          else { console.error('[Google] Insert error:', err.message); errors++; }
        } else {
          imported++;
        }

        // Rate limit: don't hammer Google
        await new Promise(r => setTimeout(r, 200));
      }
    } catch (e: any) {
      console.error(`[Google] Error: ${e.message}`);
      errors++;
    }

    // Pause between different search queries
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`[Google] ${imported} imported, ${skipped} skipped, ${errors} errors`);
  return { imported, skipped, errors };
}
