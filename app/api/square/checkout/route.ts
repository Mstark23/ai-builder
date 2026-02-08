// app/api/square/checkout/route.ts
// Square Payment Processing — replaces /api/stripe/checkout and /api/checkout
// Processes one-time payments for website builds

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { paymentsApi, customersApi, PLAN_PRICES, PLAN_NAMES } from '@/lib/square';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  console.log('Square checkout API called');

  try {
    // Check for Square key
    if (!process.env.SQUARE_ACCESS_TOKEN) {
      console.error('Missing SQUARE_ACCESS_TOKEN');
      return NextResponse.json(
        { error: 'Square is not configured. Please add SQUARE_ACCESS_TOKEN to .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);

    const { projectId, plan, businessName, sourceId } = body;

    if (!projectId || !plan) {
      return NextResponse.json(
        { error: 'Project ID and plan are required' },
        { status: 400 }
      );
    }

    if (!sourceId) {
      return NextResponse.json(
        { error: 'Payment source (sourceId) is required' },
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

    // ── 1. Create or find customer in Square ──────────────
    let squareCustomerId: string | undefined;
    const customerEmail = project.customers?.email;
    const customerName = project.customers?.name || '';

    if (customerEmail) {
      try {
        const searchResult = await customersApi.searchCustomers({
          query: {
            filter: {
              emailAddress: {
                exact: customerEmail,
              },
            },
          },
        });

        if (searchResult.result.customers && searchResult.result.customers.length > 0) {
          squareCustomerId = searchResult.result.customers[0].id;
        } else {
          const [givenName, ...familyParts] = customerName.split(' ');
          const familyName = familyParts.join(' ');

          const createResult = await customersApi.createCustomer({
            givenName: givenName || undefined,
            familyName: familyName || undefined,
            emailAddress: customerEmail,
            idempotencyKey: randomUUID(),
          });

          squareCustomerId = createResult.result.customer?.id;
        }
      } catch (err) {
        console.warn('Could not create/find Square customer:', err);
      }
    }

    // ── 2. Process the payment ────────────────────────────
    console.log('Processing Square payment...');
    console.log('Amount (cents):', priceInCents);

    const { result } = await paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId,
      amountMoney: {
        currency: 'CAD',
        amount: BigInt(priceInCents),
      },
      customerId: squareCustomerId,
      autocomplete: true,
      locationId: process.env.SQUARE_LOCATION_ID!,
      referenceId: projectId,
      note: `VektorLabs — ${planName} - ${businessName || project.business_name || 'Website'}`,
    });

    console.log('Square payment result:', result.payment?.id, result.payment?.status);

    // ── 3. Update project in Supabase ─────────────────────
    if (result.payment?.status === 'COMPLETED') {
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          paid: true,
          status: 'PAID',
          square_payment_id: result.payment.id,
          paid_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (updateError) {
        console.error('Failed to update project:', updateError);
      } else {
        console.log('✅ Project marked as paid:', projectId);
      }
    }

    // ── 4. Return result ──────────────────────────────────
    return NextResponse.json({
      success: true,
      payment: {
        id: result.payment?.id,
        status: result.payment?.status,
        receiptUrl: result.payment?.receiptUrl,
      },
    });

  } catch (error: any) {
    console.error('Square Checkout Error:', error);

    const errorMessage =
      error?.errors?.[0]?.detail || error.message || 'Payment processing failed';

    return NextResponse.json(
      {
        error: 'Failed to process payment',
        details: errorMessage,
        type: error?.errors?.[0]?.code || 'unknown',
      },
      { status: error?.statusCode || 500 }
    );
  }
}
