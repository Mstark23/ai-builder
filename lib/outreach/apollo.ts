// lib/outreach/apollo.ts
// ═══════════════════════════════════════════════
// APOLLO LEAD EXTRACTOR
// FREE: 10K credits/mo. Upgrade Apollo plan for more. No code changes.
// ═══════════════════════════════════════════════

import { supabaseAdmin } from '@/lib/supabaseAdmin';

const APOLLO_KEY = process.env.APOLLO_API_KEY;

const INDUSTRY_MAP: Record<string, string> = {
  'restaurants': 'Restaurants & Food', 'food & beverages': 'Restaurants & Food',
  'food': 'Restaurants & Food', 'hospitality': 'Restaurants & Food',
  'real estate': 'Real Estate',
  'retail': 'E-Commerce / Retail', 'e-commerce': 'E-Commerce / Retail',
  'consumer goods': 'E-Commerce / Retail', 'apparel & fashion': 'E-Commerce / Retail',
  'health': 'Health & Wellness', 'wellness': 'Health & Wellness',
  'medical': 'Dental & Medical', 'hospital & health care': 'Dental & Medical',
  'dental': 'Dental & Medical',
  'construction': 'Construction & Trades', 'building materials': 'Construction & Trades',
  'cosmetics': 'Beauty & Skincare', 'beauty': 'Beauty & Skincare',
  'health, wellness and fitness': 'Fitness & Gym', 'fitness': 'Fitness & Gym',
  'law practice': 'Legal Services', 'legal services': 'Legal Services',
  'photography': 'Photography',
  'information technology': 'SaaS / Tech', 'computer software': 'SaaS / Tech',
  'management consulting': 'Consulting', 'consulting': 'Consulting',
  'education': 'Education & Coaching',
  'luxury goods & jewelry': 'Jewelry & Accessories', 'jewelry': 'Jewelry & Accessories',
  'facilities services': 'Home Services', 'home services': 'Home Services',
  'financial services': 'Financial Services', 'insurance': 'Financial Services',
};

function mapIndustry(raw: string): string {
  if (!raw) return 'Consulting';
  const lower = raw.toLowerCase();
  for (const [k, v] of Object.entries(INDUSTRY_MAP)) {
    if (lower.includes(k)) return v;
  }
  return 'Consulting';
}

function cleanUrl(url: string): string | null {
  if (!url) return null;
  let u = url.trim();
  if (!u.startsWith('http')) u = 'https://' + u;
  try { new URL(u); return u; } catch { return null; }
}

export async function extractLeads(params: {
  industry?: string;
  city?: string;
  country?: string;
  limit?: number;
  campaign?: string;
}): Promise<{ imported: number; skipped: number; errors: number }> {
  const { industry, city, country = 'United States', limit = 50, campaign } = params;

  if (!APOLLO_KEY) {
    console.error('[Apollo] APOLLO_API_KEY not set');
    return { imported: 0, skipped: 0, errors: 1 };
  }

  let imported = 0, skipped = 0, errors = 0, page = 1;

  while (imported < limit) {
    try {
      const body: Record<string, any> = {
        api_key: APOLLO_KEY,
        page,
        per_page: Math.min(100, limit - imported),
        person_titles: ['owner', 'founder', 'ceo', 'president', 'proprietor', 'managing director', 'co-founder'],
        organization_num_employees_ranges: ['1,10', '11,50'],
      };
      if (city) body.organization_locations = [city];
      if (country) body.person_locations = [country];
      if (industry) body.q_organization_keyword_tags = [industry];

      const res = await fetch('https://api.apollo.io/api/v1/mixed_people/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log(`[Apollo] Request to api.apollo.io, status: ${res.status}`);

      if (!res.ok) {
        const errBody = await res.text();
        console.error(`[Apollo] HTTP ${res.status}: ${errBody}`);
        errors++; break;
      }
      const data = await res.json();
      console.log(`[Apollo] Page ${page}: ${data.people?.length || 0} people found`);
      if (!data.people?.length) break;

      for (const p of data.people) {
        if (imported >= limit) break;
        const email = p.email;
        const website = cleanUrl(p.organization?.website_url);
        if (!email || !website) { skipped++; continue; }

        // Dedup: outreach_leads + existing customers
        const { data: d1 } = await supabaseAdmin.from('outreach_leads').select('id').eq('email', email).maybeSingle();
        if (d1) { skipped++; continue; }
        const { data: d2 } = await supabaseAdmin.from('customers').select('id').eq('email', email.toLowerCase()).maybeSingle();
        if (d2) { skipped++; continue; }

        const { error: err } = await supabaseAdmin.from('outreach_leads').insert({
          first_name: p.first_name || 'Business',
          last_name: p.last_name || 'Owner',
          email: email.toLowerCase().trim(),
          phone: p.phone_numbers?.[0]?.raw_number || null,
          job_title: p.title || null,
          company_name: p.organization?.name || 'Business',
          company_website: website,
          industry: mapIndustry(p.organization?.industry || industry || ''),
          city: p.organization?.city || city || null,
          state: p.organization?.state || null,
          country: p.organization?.country || country,
          employee_count: p.organization?.estimated_num_employees || null,
          apollo_id: p.id,
          status: 'new',
          campaign: campaign || null,
        });

        if (err) { if (err.code === '23505') skipped++; else errors++; }
        else imported++;
      }

      if (page >= (data.pagination?.total_pages || 1)) break;
      page++;
      await new Promise(r => setTimeout(r, 1000));
    } catch (e: any) {
      console.error('[Apollo]', e.message); errors++; break;
    }
  }

  console.log(`[Apollo] ${imported} imported, ${skipped} skipped, ${errors} errors`);
  return { imported, skipped, errors };
}
