// lib/outreach/scorer.ts
// FREE: Google PageSpeed API — 25K requests/day, no key needed

import { supabaseAdmin } from '@/lib/supabaseAdmin';

const PAGESPEED_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;

async function getScore(url: string): Promise<{ score: number; issues: string[] }> {
  try {
    const params = new URLSearchParams({ url, strategy: 'mobile', category: 'performance' });
    if (PAGESPEED_KEY) params.set('key', PAGESPEED_KEY);

    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
      { signal: AbortSignal.timeout(25000) }
    );
    if (!res.ok) return { score: 0, issues: ['Site unreachable'] };

    const data = await res.json();
    const lh = data.lighthouseResult;
    const perf = Math.round((lh?.categories?.performance?.score || 0) * 100);
    const issues: string[] = [];

    if (perf < 30) issues.push(`Extremely slow — ${perf}/100 performance`);
    else if (perf < 50) issues.push(`Slow — ${perf}/100 mobile performance`);
    else if (perf < 70) issues.push(`Below average — ${perf}/100 performance`);

    const speed = lh?.audits?.['speed-index']?.numericValue;
    if (speed && speed > 5000) issues.push(`${(speed / 1000).toFixed(1)}s load time (should be under 3s)`);

    if (lh?.audits?.viewport?.score < 1) issues.push('Not mobile friendly');
    if (!url.startsWith('https')) issues.push('No SSL — shows "Not Secure"');

    return { score: perf, issues: issues.length ? issues : ['Could use a modern refresh'] };
  } catch {
    return { score: 0, issues: ['Site unreachable or timed out'] };
  }
}

export async function scoreNewLeads(batchSize: number = 50) {
  const { data: leads, error: queryErr } = await supabaseAdmin
    .from('outreach_leads')
    .select('id, company_website, company_name')
    .eq('status', 'new')
    .order('created_at')
    .limit(batchSize);

  console.log(`[Scorer] Query: found ${leads?.length || 0} leads with status=new${queryErr ? `, error: ${queryErr.message}` : ''}`);

  if (!leads?.length) return { scored: 0, qualified: 0, disqualified: 0 };

  let scored = 0, qualified = 0, disqualified = 0;

  for (const lead of leads) {
    await supabaseAdmin.from('outreach_leads').update({ status: 'scoring' }).eq('id', lead.id);

    const { score, issues } = await getScore(lead.company_website);

    let priority: string, status: string;
    if (score < 40) { priority = 'hot'; status = 'qualified'; qualified++; }
    else if (score < 70) { priority = 'warm'; status = 'qualified'; qualified++; }
    else { priority = 'low'; status = 'disqualified'; disqualified++; }

    await supabaseAdmin.from('outreach_leads').update({
      site_score: score, site_issues: issues, priority, status,
      updated_at: new Date().toISOString(),
    }).eq('id', lead.id);

    scored++;
    console.log(`[Scorer] ${lead.company_name}: ${score}/100 → ${priority}`);
    await new Promise(r => setTimeout(r, 1500));
  }

  return { scored, qualified, disqualified };
}
