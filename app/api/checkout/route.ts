import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { projectId, projectName, plan, email } = await request.json();

    // Get price based on plan
    let amount = 29900; // $299 default
    let planName = 'Landing Page';
    
    switch (plan) {
      case 'landing':
        amount = 29900;
        planName = 'Landing Page';
        break;
      case 'service':
        amount = 59900;
        planName = 'Service Business';
        break;
      case 'ecommerce':
        amount = 99900;
        planName = 'E-Commerce';
        break;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planName} Website - ${projectName}`,
              description: 'Professional website with 72-hour delivery',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/portal/project/${projectId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/portal/project/${projectId}?payment=cancelled`,
      customer_email: email,
      metadata: {
        projectId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}