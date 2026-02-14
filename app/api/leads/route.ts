import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin operations
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { industry, websiteType, businessName, email, phone } = body;

    // ── Validate ──
    if (!industry || !websiteType || !businessName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ── 1. Check if customer already exists by email ──
    let customerId: string | null = null;

    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      // ── 2. Create new customer record ──
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          full_name: businessName, // Use business name as display name for now
          source: 'landing_page',
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (customerError) {
        console.error('Customer creation error:', customerError);
        // If customers table doesn't exist or has different schema, 
        // proceed without customer record
      } else {
        customerId = newCustomer?.id || null;
      }
    }

    // ── 3. Create new project ──
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        customer_id: customerId,
        business_name: businessName.trim(),
        industry: industry,
        website_type: websiteType,
        status: 'pending', // Admin will pick this up
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        source: 'landing_page',
        metadata: {
          submitted_at: new Date().toISOString(),
          user_agent: req.headers.get('user-agent') || '',
          referrer: req.headers.get('referer') || '',
        },
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (projectError) {
      console.error('Project creation error:', projectError);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    // ── 4. Optional: Send notification (SMS/email to admin) ──
    // You can add Twilio, SendGrid, or any notification service here
    // Example: notify yourself via SMS when a new lead comes in
    //
    // await fetch('https://api.twilio.com/2010-04-01/Accounts/...', { ... })
    //
    // Or trigger a Supabase Edge Function:
    // await supabase.functions.invoke('notify-admin', {
    //   body: { projectId: project.id, businessName, industry, phone, email }
    // });

    console.log(`✅ New lead: ${businessName} (${industry}) — ${phone} — Project #${project?.id}`);

    return NextResponse.json({
      success: true,
      projectId: project?.id,
    });

  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
