// app/api/square/webhook/route.ts
// Square Webhook Handler with Email Notifications
// Mirrors the existing Stripe webhook at /api/stripe/webhook

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Verify Square webhook signature ─────────────────────────
function verifySignature(
  body: string,
  signature: string,
  url: string,
  sigKey: string
): boolean {
  const combined = url + body;
  const expectedSignature = crypto
    .createHmac('sha256', sigKey)
    .update(combined)
    .digest('base64');
  return signature === expectedSignature;
}

// ── Send payment notification emails (matches existing Stripe webhook) ──
async function sendPaymentEmails(project: any) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'Verktorlabs <noreply@verktorlabs.com>';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@verktorlabs.com';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!RESEND_API_KEY) {
    console.log('📧 Emails would be sent (RESEND_API_KEY not set)');
    console.log('   - Payment confirmation to customer');
    console.log('   - Payment notification to admin');
    return;
  }

  const planPrices: Record<string, number> = {
    starter: 299, landing: 299,
    professional: 599, service: 599,
    premium: 799,
    enterprise: 999, ecommerce: 999,
  };

  const amount = planPrices[project.plan] || 299;

  // Email to Customer
  const customerEmail = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="background: #000; padding: 30px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px;">VERKTORLABS</h1>
    </div>
    <div style="padding: 40px;">
      <h2 style="color: #000; margin: 0 0 20px;">🎉 Payment Confirmed!</h2>
      <p style="color: #444; font-size: 16px; line-height: 1.6;">
        Hi ${project.customers?.name || 'there'},
      </p>
      <p style="color: #444; font-size: 16px; line-height: 1.6;">
        Thank you for your payment! Your website for <strong>${project.business_name}</strong> is now being built.
      </p>
      <div style="background: #d4edda; border-radius: 12px; padding: 25px; text-align: center; margin: 25px 0;">
        <p style="color: #155724; font-size: 14px; margin: 0 0 5px;">Amount Paid</p>
        <p style="color: #155724; font-size: 36px; font-weight: 700; margin: 0;">$${amount}</p>
      </div>
      <p style="color: #444; font-size: 16px; line-height: 1.6;">
        <strong>What's next?</strong> You'll receive a preview of your website within 72 hours. In the meantime, check out our Growth tools to maximize your website's impact!
      </p>
      <div style="text-align: center;">
        <a href="${APP_URL}/portal/project/${project.id}" style="display: inline-block; background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">View Your Project</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Email to Admin
  const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden;">
    <div style="background: #000; padding: 30px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px;">VERKTORLABS</h1>
    </div>
    <div style="padding: 40px;">
      <h2 style="color: #000; margin: 0 0 20px;">💰 Payment Received!</h2>
      <div style="background: #d4edda; border-radius: 12px; padding: 25px; text-align: center; margin: 20px 0;">
        <p style="color: #155724; font-size: 36px; font-weight: 700; margin: 0;">+$${amount}</p>
      </div>
      <table style="width: 100%; background: #f8f8f8; border-radius: 12px; padding: 20px;">
        <tr><td style="padding: 8px; color: #888;">Project</td><td style="padding: 8px; color: #000; font-weight: 600;">${project.business_name}</td></tr>
        <tr><td style="padding: 8px; color: #888;">Customer</td><td style="padding: 8px; color: #000;">${project.customers?.name || 'N/A'}</td></tr>
        <tr><td style="padding: 8px; color: #888;">Email</td><td style="padding: 8px; color: #000;">${project.customers?.email || 'N/A'}</td></tr>
        <tr><td style="padding: 8px; color: #888;">Plan</td><td style="padding: 8px; color: #000; text-transform: capitalize;">${project.plan}</td></tr>
        <tr><td style="padding: 8px; color: #888;">Processor</td><td style="padding: 8px; color: #000;">Square</td></tr>
      </table>
      <div style="text-align: center; margin-top: 25px;">
        <a href="${APP_URL}/admin/projects/${project.id}" style="display: inline-block; background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">View Project</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Send to customer
  if (project.customers?.email) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [project.customers.email],
          subject: `🎉 Payment Confirmed - ${project.business_name}`,
          html: customerEmail,
        }),
      });
      console.log('✅ Payment confirmation email sent to customer');
    } catch (err) {
      console.error('Failed to send customer email:', err);
    }
  }

  // Send to admin
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `💰 Payment Received: $${amount} - ${project.business_name}`,
        html: adminEmailHtml,
      }),
    });
    console.log('✅ Payment notification email sent to admin');
  } catch (err) {
    console.error('Failed to send admin email:', err);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-square-hmacsha256-signature') || '';

  // Verify signature if webhook secret is set
  if (process.env.SQUARE_WEBHOOK_SIGNATURE_KEY) {
    const webhookUrl = process.env.SQUARE_WEBHOOK_URL || '';
    const isValid = verifySignature(
      body,
      signature,
      webhookUrl,
      process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
    );

    if (!isValid) {
      console.warn('⚠️ Invalid Square webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  } else {
    console.log('⚠️ SQUARE_WEBHOOK_SIGNATURE_KEY not set, processing without verification');
  }

  let event: any;

  try {
    event = JSON.parse(body);
  } catch (err: any) {
    console.error('Failed to parse webhook body:', err.message);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log('📥 Square webhook received:', event.type);

  switch (event.type) {
    // ─── PAYMENT COMPLETED ──────────────────────────────
    case 'payment.completed': {
      const payment = event.data?.object?.payment;
      const projectId = payment?.reference_id;

      console.log('✅ Payment completed:', payment?.id, 'Project:', projectId);

      if (projectId) {
        // Update project to paid
        const { error } = await supabase
          .from('projects')
          .update({
            paid: true,
            status: 'PAID',
            square_payment_id: payment?.id,
            paid_at: new Date().toISOString(),
          })
          .eq('id', projectId);

        if (error) {
          console.error('Failed to update project:', error);
        } else {
          console.log('✅ Project marked as paid:', projectId);

          // Fetch project details and send emails
          const { data: project } = await supabase
            .from('projects')
            .select('*, customers(name, email)')
            .eq('id', projectId)
            .single();

          if (project) {
            await sendPaymentEmails(project);
          }
        }
      }
      break;
    }

    // ─── PAYMENT FAILED ─────────────────────────────────
    case 'payment.failed': {
      const payment = event.data?.object?.payment;
      console.log('❌ Payment failed:', payment?.id);
      break;
    }

    // ─── REFUND ─────────────────────────────────────────
    case 'refund.created':
    case 'refund.updated': {
      const refund = event.data?.object?.refund;
      console.log('💸 Refund event:', refund?.id, refund?.status);
      break;
    }

    default:
      console.log(`Unhandled Square event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
