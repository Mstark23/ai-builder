// app/api/stripe/webhook/route.ts
// Stripe Webhook Handler with Email Notifications

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Import email functions
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
        Thank you for your payment! Your website for <strong>${project.business_name}</strong> is now ready.
      </p>
      <div style="background: #d4edda; border-radius: 12px; padding: 25px; text-align: center; margin: 25px 0;">
        <p style="color: #155724; font-size: 14px; margin: 0 0 5px;">Amount Paid</p>
        <p style="color: #155724; font-size: 36px; font-weight: 700; margin: 0;">$${amount}</p>
      </div>
      <div style="text-align: center;">
        <a href="${APP_URL}/portal/project/${project.id}" style="display: inline-block; background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">View Your Website</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Email to Admin
  const adminEmail = `
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
        html: adminEmail,
      }),
    });
    console.log('✅ Payment notification email sent to admin');
  } catch (err) {
    console.error('Failed to send admin email:', err);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  // If no webhook secret, still process but skip verification
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('⚠️ STRIPE_WEBHOOK_SECRET not set, processing without verification');
  }

  let event: Stripe.Event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      // Parse event without verification (for development)
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  console.log('📥 Webhook received:', event.type);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('✅ Payment successful for session:', session.id);
      
      const projectId = session.metadata?.projectId;
      
      if (projectId) {
        // Update project to paid
        const { error } = await supabase
          .from('projects')
          .update({
            paid: true,
            status: 'PAID',
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent as string,
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

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('✅ PaymentIntent succeeded:', paymentIntent.id);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('❌ Payment failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}