export const dynamic = "force-dynamic";

// app/api/square/webhook/route.ts
// Square Webhook Handler — supports both direct payments AND invoice payments

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifySignature(body: string, signature: string, url: string, sigKey: string): boolean {
  const combined = url + body;
  const expectedSignature = crypto.createHmac('sha256', sigKey).update(combined).digest('base64');
  return signature === expectedSignature;
}

async function sendPaymentEmails(project: any) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'VektorLabs <noreply@vektorlabs.com>';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vektorlabs.com';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!RESEND_API_KEY) {
    console.log('📧 Emails skipped (RESEND_API_KEY not set)');
    return;
  }

  const planPrices: Record<string, number> = {
    starter: 299, landing: 299, professional: 599, service: 599,
    premium: 799, enterprise: 999, ecommerce: 999,
  };
  const amount = project.custom_price || planPrices[project.plan] || 299;

  if (project.customers?.email) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [project.customers.email],
          subject: `🎉 Payment Confirmed - ${project.business_name}`,
          html: `<!DOCTYPE html><html><body style="font-family:Arial;background:#f5f5f5;padding:40px">
            <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
              <div style="background:#000;padding:30px;text-align:center"><h1 style="color:#fff;margin:0;font-size:24px">VEKTORLABS</h1></div>
              <div style="padding:40px">
                <h2 style="color:#000;margin:0 0 20px">🎉 Payment Confirmed!</h2>
                <p style="color:#444;font-size:16px;line-height:1.6">Thank you! Your website for <strong>${project.business_name}</strong> is now being built.</p>
                <div style="background:#d4edda;border-radius:12px;padding:25px;text-align:center;margin:25px 0">
                  <p style="color:#155724;font-size:14px;margin:0 0 5px">Amount Paid</p>
                  <p style="color:#155724;font-size:36px;font-weight:700;margin:0">$${amount}</p>
                </div>
                <p style="color:#444;font-size:16px;line-height:1.6">Create your account below to access your portal, upload content, and track your build progress.</p>
                <div style="text-align:center">
                  <a href="${APP_URL}/create-account/${project.id}" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;border-radius:50px;font-weight:600">Create Your Account →</a>
                </div>
              </div>
            </div></body></html>`,
        }),
      });
      console.log('✅ Payment email sent to customer');
    } catch (err) { console.error('Customer email error:', err); }
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `💰 $${amount} Payment — ${project.business_name}`,
        html: `<!DOCTYPE html><html><body style="font-family:Arial;background:#f5f5f5;padding:40px">
          <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
            <div style="background:#000;padding:30px;text-align:center"><h1 style="color:#fff;margin:0">VEKTORLABS</h1></div>
            <div style="padding:40px">
              <h2 style="color:#000;margin:0 0 20px">💰 Payment Received!</h2>
              <div style="background:#d4edda;border-radius:12px;padding:25px;text-align:center;margin:20px 0">
                <p style="color:#155724;font-size:36px;font-weight:700;margin:0">+$${amount}</p>
              </div>
              <table style="width:100%;background:#f8f8f8;border-radius:12px;padding:20px">
                <tr><td style="padding:8px;color:#888">Project</td><td style="padding:8px;color:#000;font-weight:600">${project.business_name}</td></tr>
                <tr><td style="padding:8px;color:#888">Customer</td><td style="padding:8px;color:#000">${project.customers?.name || project.email || 'N/A'}</td></tr>
                <tr><td style="padding:8px;color:#888">Amount</td><td style="padding:8px;color:#000;font-weight:600">$${amount}</td></tr>
              </table>
              <div style="text-align:center;margin-top:25px">
                <a href="${APP_URL}/admin/projects/${project.id}" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600">View Project</a>
              </div>
            </div>
          </div></body></html>`,
      }),
    });
    console.log('✅ Payment email sent to admin');
  } catch (err) { console.error('Admin email error:', err); }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-square-hmacsha256-signature') || '';

  if (process.env.SQUARE_WEBHOOK_SIGNATURE_KEY) {
    const isValid = verifySignature(body, signature, process.env.SQUARE_WEBHOOK_URL || '', process.env.SQUARE_WEBHOOK_SIGNATURE_KEY);
    if (!isValid) {
      console.warn('⚠️ Invalid Square webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let event: any;
  try { event = JSON.parse(body); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  console.log('📥 Square webhook:', event.type);

  switch (event.type) {
    case 'payment.completed': {
      const payment = event.data?.object?.payment;
      const projectId = payment?.reference_id;
      console.log('✅ Payment completed:', payment?.id, 'Project:', projectId);

      if (projectId) {
        const { error } = await supabase
          .from('projects')
          .update({ paid: true, status: 'paid', square_payment_id: payment?.id, paid_at: new Date().toISOString() })
          .eq('id', projectId);

        if (!error) {
          const { data: project } = await supabase.from('projects').select('*, customers(name, email)').eq('id', projectId).single();
          if (project) await sendPaymentEmails(project);
        }
      }
      break;
    }

    case 'invoice.payment_made': {
      const invoice = event.data?.object?.invoice;
      const invoiceId = invoice?.id;
      console.log('✅ Invoice paid:', invoiceId);

      if (invoiceId) {
        const { data: project, error: findErr } = await supabase
          .from('projects')
          .select('*, customers(name, email)')
          .eq('invoice_id', invoiceId)
          .single();

        if (project && !findErr) {
          await supabase
            .from('projects')
            .update({ paid: true, status: 'paid', paid_at: new Date().toISOString() })
            .eq('id', project.id);

          await sendPaymentEmails(project);
          console.log('✅ Project marked paid via invoice:', project.id);
        }
      }
      break;
    }

    case 'payment.failed': {
      console.log('❌ Payment failed:', event.data?.object?.payment?.id);
      break;
    }

    case 'refund.created':
    case 'refund.updated': {
      console.log('💸 Refund:', event.data?.object?.refund?.id);
      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
