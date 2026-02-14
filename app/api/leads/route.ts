import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { industry, websiteType, businessName, email, phone } = body;

    if (!industry || !websiteType || !businessName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let customerId: string | null = null;

    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          name: businessName,
          source: 'landing_page',
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (customerError) {
        console.error('Customer creation error:', customerError);
      } else {
        customerId = newCustomer?.id || null;
      }
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        customer_id: customerId,
        business_name: businessName.trim(),
        industry: industry,
        website_type: websiteType,
        status: 'pending',
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

    console.log(`New lead: ${businessName} (${industry}) - ${phone} - Project #${project?.id}`);

    return NextResponse.json({
      success: true,
      projectId: project?.id,
    });

  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
