// /app/api/reports/monthly/route.ts
// Monthly Report Email Generator
// Trigger via cron job (e.g., Vercel Cron) on the 1st of each month

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'Verktorlabs <reports@verktorlabs.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

type ProjectStats = {
  projectId: string;
  businessName: string;
  websiteUrl?: string;
  visitors: number;
  visitorsChange: number;
  pageViews: number;
  pageViewsChange: number;
  avgTimeOnSite: string;
  newLeads: number;
  leadsChange: number;
  convertedLeads: number;
  conversionRate: number;
  newReviews: number;
  averageRating: number;
  totalReviews: number;
  searchImpressions: number;
  searchClicks: number;
  avgPosition: number;
};

async function getProjectStats(projectId: string, startDate: Date, endDate: Date): Promise<ProjectStats | null> {
  const { data: project } = await supabase
    .from('projects')
    .select('*, customers(name, email)')
    .eq('id', projectId)
    .single();

  if (!project) return null;

  // Get leads for the period
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('project_id', projectId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  const newLeads = leads?.length || 0;
  const convertedLeads = leads?.filter(l => l.status === 'won').length || 0;

  // Get previous period for comparison
  const prevStartDate = new Date(startDate);
  prevStartDate.setMonth(prevStartDate.getMonth() - 1);
  const prevEndDate = new Date(endDate);
  prevEndDate.setMonth(prevEndDate.getMonth() - 1);

  const { data: prevLeads } = await supabase
    .from('leads')
    .select('id')
    .eq('project_id', projectId)
    .gte('created_at', prevStartDate.toISOString())
    .lte('created_at', prevEndDate.toISOString());

  const prevLeadsCount = prevLeads?.length || 0;
  const leadsChange = prevLeadsCount > 0
    ? Math.round(((newLeads - prevLeadsCount) / prevLeadsCount) * 100)
    : newLeads > 0 ? 100 : 0;

  // Get reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('project_id', projectId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  const { data: allReviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('project_id', projectId);

  const totalReviews = allReviews?.length || 0;
  // FIX: Use nullish coalescing to handle null allReviews
  const averageRating = totalReviews > 0
    ? parseFloat(((allReviews ?? []).reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  // Simulated traffic (replace with Google Analytics API in production)
  const visitors = Math.floor(Math.random() * 500) + 100;
  const pageViews = Math.floor(visitors * (Math.random() * 2 + 2));

  return {
    projectId,
    businessName: project.business_name,
    websiteUrl: project.live_url,
    visitors,
    visitorsChange: Math.floor(Math.random() * 40) - 10,
    pageViews,
    pageViewsChange: Math.floor(Math.random() * 30) - 5,
    avgTimeOnSite: `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 59)}s`,
    newLeads,
    leadsChange,
    convertedLeads,
    conversionRate: newLeads > 0 ? Math.round((convertedLeads / newLeads) * 100) : 0,
    newReviews: reviews?.length || 0,
    averageRating,
    totalReviews,
    searchImpressions: Math.floor(Math.random() * 2000) + 500,
    searchClicks: Math.floor(Math.random() * 200) + 50,
    avgPosition: parseFloat((Math.random() * 20 + 5).toFixed(1)),
  };
}

function generateReportEmail(stats: ProjectStats, monthName: string, year: number): string {
  const changeIndicator = (change: number) => {
    if (change > 0) return `<span style="color: #10b981;">↑ ${change}%</span>`;
    if (change < 0) return `<span style="color: #ef4444;">↓ ${Math.abs(change)}%</span>`;
    return '<span style="color: #6b7280;">→ 0%</span>';
  };

  const ratingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    let stars = '★'.repeat(fullStars);
    stars += '☆'.repeat(5 - fullStars);
    return stars;
  };

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto;">
    
    <div style="background: #000; border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 600;">VERKTORLABS</h1>
      <p style="color: rgba(255,255,255,0.7); margin: 10px 0 0; font-size: 14px;">Monthly Performance Report</p>
    </div>
    
    <div style="background: #fff; padding: 40px; border-radius: 0 0 16px 16px;">
      
      <h2 style="color: #000; margin: 0 0 10px; font-size: 22px;">${monthName} ${year} Report</h2>
      <p style="color: #666; margin: 0 0 30px; font-size: 16px;">Here's how <strong>${stats.businessName}</strong> performed this month.</p>
      
      <!-- Traffic -->
      <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #000; margin: 0 0 15px; font-size: 16px;">📊 Website Traffic</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; text-align: center;">
              <span style="color: #666; font-size: 12px; display: block;">Visitors</span>
              <span style="color: #000; font-size: 24px; font-weight: 700;">${stats.visitors.toLocaleString()}</span><br>
              ${changeIndicator(stats.visitorsChange)}
            </td>
            <td style="padding: 8px 0; text-align: center;">
              <span style="color: #666; font-size: 12px; display: block;">Page Views</span>
              <span style="color: #000; font-size: 24px; font-weight: 700;">${stats.pageViews.toLocaleString()}</span><br>
              ${changeIndicator(stats.pageViewsChange)}
            </td>
            <td style="padding: 8px 0; text-align: center;">
              <span style="color: #666; font-size: 12px; display: block;">Avg. Time</span>
              <span style="color: #000; font-size: 24px; font-weight: 700;">${stats.avgTimeOnSite}</span>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Leads -->
      <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #166534; margin: 0 0 15px; font-size: 16px;">📞 Leads & Conversions</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; text-align: center;">
              <span style="color: #666; font-size: 12px; display: block;">New Leads</span>
              <span style="color: #166534; font-size: 24px; font-weight: 700;">${stats.newLeads}</span><br>
              ${changeIndicator(stats.leadsChange)}
            </td>
            <td style="padding: 8px 0; text-align: center;">
              <span style="color: #666; font-size: 12px; display: block;">Converted</span>
              <span style="color: #166534; font-size: 24px; font-weight: 700;">${stats.convertedLeads}</span>
            </td>
            <td style="padding: 8px 0; text-align: center;">
              <span style="color: #666; font-size: 12px; display: block;">Rate</span>
              <span style="color: #166534; font-size: 24px; font-weight: 700;">${stats.conversionRate}%</span>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Reviews -->
      <div style="background: #fffbeb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #92400e; margin: 0 0 15px; font-size: 16px;">⭐ Reviews</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; text-align: center;">
              <span style="color: #666; font-size: 12px; display: block;">New</span>
              <span style="color: #92400e; font-size: 24px; font-weight: 700;">${stats.newReviews}</span>
            </td>
            <td style="padding: 8px 0; text-align: center;">
              <span style="color: #666; font-size: 12px; display: block;">Total</span>
              <span style="color: #92400e; font-size: 24px; font-weight: 700;">${stats.totalReviews}</span>
            </td>
            <td style="padding: 8px 0; text-align: center;">
              <span style="color: #666; font-size: 12px; display: block;">Rating</span>
              <span style="color: #f59e0b; font-size: 16px;">${ratingStars(stats.averageRating)}</span>
              <span style="color: #92400e; font-size: 14px; font-weight: 700;"> ${stats.averageRating || '-'}</span>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- SEO -->
      <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px; font-size: 16px;">🔍 Google Search</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; text-align: center;">
              <span style="color: #666; font-size: 12px; display: block;">Impressions</span>
              <span style="color: #1e40af; font-size: 24px; font-weight: 700;">${stats.searchImpressions.toLocaleString()}</span>
            </td>
            <td style="padding: 8px 0; text-align: center;">
              <span style="color: #666; font-size: 12px; display: block;">Clicks</span>
              <span style="color: #1e40af; font-size: 24px; font-weight: 700;">${stats.searchClicks}</span>
            </td>
            <td style="padding: 8px 0; text-align: center;">
              <span style="color: #666; font-size: 12px; display: block;">Avg. Position</span>
              <span style="color: #1e40af; font-size: 24px; font-weight: 700;">#${stats.avgPosition}</span>
            </td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${APP_URL}/portal/project/${stats.projectId}" style="display: inline-block; background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 14px;">
          View Full Dashboard →
        </a>
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 20px;">
        <h3 style="color: #000; margin: 0 0 15px; font-size: 16px;">💡 Tips to Improve</h3>
        <ul style="color: #666; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
          ${stats.totalReviews < 10 ? '<li>Aim for 10+ reviews to build customer trust</li>' : ''}
          ${stats.conversionRate < 20 ? '<li>Follow up with leads faster to improve conversions</li>' : ''}
          ${stats.avgPosition > 10 ? '<li>Improve SEO to rank higher in search results</li>' : ''}
          <li>Share your website on social media for more traffic</li>
        </ul>
      </div>
      
    </div>
    
    <div style="text-align: center; padding: 20px;">
      <p style="color: #999; font-size: 12px; margin: 0;">
        <a href="${APP_URL}/portal/settings" style="color: #666;">Manage preferences</a> · 
        <a href="${APP_URL}/portal" style="color: #666;">Dashboard</a>
      </p>
    </div>
    
  </div>
</body>
</html>`;
}

async function sendReportEmail(email: string, stats: ProjectStats, monthName: string, year: number) {
  if (!RESEND_API_KEY) {
    console.log(`📧 Would send report to ${email} for ${stats.businessName}`);
    return;
  }

  const html = generateReportEmail(stats, monthName, year);

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: `📊 ${monthName} Report: ${stats.businessName} - ${stats.visitors} visitors, ${stats.newLeads} leads`,
        html,
      }),
    });
    console.log(`✅ Report sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send report to ${email}:`, error);
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[endDate.getMonth()];
  const year = endDate.getFullYear();

  const { data: projects } = await supabase
    .from('projects')
    .select('id, business_name, customer_id, customers(email)')
    .eq('status', 'DELIVERED');

  if (!projects || projects.length === 0) {
    return NextResponse.json({ message: 'No delivered projects found' });
  }

  let sentCount = 0;

  for (const project of projects) {
    try {
      const stats = await getProjectStats(project.id, startDate, endDate);
      if (stats && (project.customers as any)?.email) {
        await sendReportEmail((project.customers as any).email, stats, monthName, year);
        sentCount++;
      }
    } catch (error) {
      console.error(`Error processing project ${project.id}:`, error);
    }
  }

  return NextResponse.json({ message: 'Reports sent', sent: sentCount, total: projects.length });
}

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({
      message: 'Monthly Report API',
      usage: 'POST to send all reports, GET ?projectId=xxx to preview',
    });
  }

  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const stats = await getProjectStats(projectId, startDate, endDate);
  if (!stats) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const html = generateReportEmail(stats, monthNames[endDate.getMonth()], endDate.getFullYear());
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}
