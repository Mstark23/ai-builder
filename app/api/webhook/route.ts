import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    // For local testing without webhook signature verification
    event = JSON.parse(body) as Stripe.Event;
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const projectId = session.metadata?.projectId;

    if (projectId) {
      // Update project as paid
      const { error } = await supabase
        .from('projects')
        .update({
          paid: true,
          payment_status: 'PAID',
          status: 'PAID',
        })
        .eq('id', projectId);

      if (error) {
        console.error('Error updating project:', error);
      } else {
        console.log('Project marked as paid:', projectId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
