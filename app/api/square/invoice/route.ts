export const dynamic = "force-dynamic";

// POST /api/square/invoice
// Admin creates a Square invoice for a project with custom pricing
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { squareClient } from '@/lib/square';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { projectId, amount, description } = await request.json();

    if (!projectId || !amount) {
      return NextResponse.json({ error: 'Missing projectId or amount' }, { status: 400 });
    }

    // Get project + customer info
    const { data: project, error: projErr } = await supabaseAdmin
      .from('projects')
      .select('*, customers(email, name, phone)')
      .eq('id', projectId)
      .single();

    if (projErr || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const customerEmail = project.customers?.email || project.email;
    if (!customerEmail) {
      return NextResponse.json({ error: 'No customer email found' }, { status: 400 });
    }

    const { invoicesApi, customersApi } = squareClient;
    let squareCustomerId: string | undefined;

    try {
      const search = await customersApi.searchCustomers({
        query: { filter: { emailAddress: { exact: customerEmail } } },
      });
      if (search.result.customers && search.result.customers.length > 0) {
        squareCustomerId = search.result.customers[0].id;
      } else {
        const names = (project.customers?.name || project.business_name).split(' ');
        const create = await customersApi.createCustomer({
          givenName: names[0] || '',
          familyName: names.slice(1).join(' ') || '',
          emailAddress: customerEmail,
          phoneNumber: project.customers?.phone || project.phone || undefined,
          idempotencyKey: randomUUID(),
        });
        squareCustomerId = create.result.customer?.id;
      }
    } catch (err) {
      console.warn('Could not create Square customer:', err);
    }

    const invoiceResult = await invoicesApi.createInvoice({
      invoice: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        primaryRecipient: {
          customerId: squareCustomerId,
        },
        paymentRequests: [
          {
            requestType: 'BALANCE',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            automaticPaymentSource: 'NONE',
            reminders: [
              { relativeScheduledDays: -1, message: 'Your website invoice is due tomorrow!' },
            ],
          },
        ],
        deliveryMethod: 'EMAIL',
        title: `VektorLabs — ${project.business_name} Website`,
        description: description || `Custom website build for ${project.business_name}`,
        acceptedPaymentMethods: {
          card: true,
          bankAccount: false,
          squareGiftCard: false,
          buyNowPayLater: false,
        },
      },
      idempotencyKey: randomUUID(),
    });

    const invoiceId = invoiceResult.result.invoice?.id;

    if (!invoiceId) {
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }

    await invoicesApi.publishInvoice(invoiceId, {
      version: 0,
      idempotencyKey: randomUUID(),
    });

    const { data: proj } = await supabaseAdmin
      .from('projects')
      .select('metadata')
      .eq('id', projectId)
      .single();

    await supabaseAdmin
      .from('projects')
      .update({
        custom_price: amount,
        invoice_id: invoiceId,
        metadata: {
          ...(proj?.metadata || {}),
          invoice_sent_at: new Date().toISOString(),
          invoice_amount: amount,
        },
        status: 'invoice_sent',
      })
      .eq('id', projectId);

    return NextResponse.json({
      success: true,
      invoiceId,
      invoiceUrl: invoiceResult.result.invoice?.publicUrl,
    });
  } catch (err: any) {
    console.error('Invoice error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
