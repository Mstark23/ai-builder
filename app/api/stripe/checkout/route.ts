// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Check if Stripe key exists
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set!');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Plan prices in cents
const PLAN_PRICES: Record<string, number> = {
  starter: 29900,
  landing: 29900,
  professional: 59900,
  service: 59900,
  premium: 79900,
  enterprise: 99900,
  ecommerce: 99900,
};

const PLAN_NAMES: Record<string, string> = {
  starter: 'Starter Website',
  landing: 'Landing Page',
  professional: 'Professional Website',
  service: 'Service Business Website',
  premium: 'Premium Website',
  enterprise: 'Enterprise Website',
  ecommerce: 'E-Commerce Website',
};

export async function POST(request: NextRequest) {
  console.log('Stripe checkout API called');
  
  try {
    // Check for Stripe key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY');
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    const { projectId, plan, businessName } = body;

    if (!projectId || !plan) {
      return NextResponse.json(
        { error: 'Project ID and plan are required' },
        { status: 400 }
      );
    }

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*, customers(email, name)')
      .eq('id', projectId)
      .single();

    if (projectError) {
      console.error('Project fetch error:', projectError);
      return NextResponse.json(
        { error: 'Project not found', details: projectError.message },
        { status: 404 }
      );
    }

    if (project.paid) {
      return NextResponse.json(
        { error: 'Project is already paid' },
        { status: 400 }
      );
    }

    const priceInCents = PLAN_PRICES[plan] || PLAN_PRICES['starter'];
    const planName = PLAN_NAMES[plan] || 'Website';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    console.log('Creating Stripe session...');
    console.log('Price:', priceInCents);
    console.log('App URL:', appUrl);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planName} - ${businessName || 'Website'}`,
              description: `Custom website for ${businessName || 'your business'}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/portal/project/${projectId}?payment=success`,
      cancel_url: `${appUrl}/portal/project/${projectId}?payment=cancelled`,
      customer_email: project.customers?.email || undefined,
      metadata: {
        projectId: projectId,
        plan: plan,
        businessName: businessName || '',
      },
    });

    console.log('Stripe session created:', session.id);
    console.log('Checkout URL:', session.url);

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });

  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    
    // Return proper error response
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session', 
        details: error.message,
        type: error.type || 'unknown'
      },
      { status: 500 }
    );
  }
}