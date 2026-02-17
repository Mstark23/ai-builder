// app/api/sms/send-preview/route.ts
// Sends SMS via Twilio with the preview link to the client

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================
// SMS TEMPLATES
// ============================================

function getPreviewMessage(businessName: string, previewUrl: string): string {
  return `Hey! 👋 Your website preview for ${businessName} is ready!\n\nCheck out 3 custom designs we made for you:\n${previewUrl}\n\nPick your favorite and we'll handle the rest.\n\n— VektorLabs Team`;
}

function getNeedsFollowUp(businessName: string, needsUrl: string): string {
  return `Hey! Just following up on your ${businessName} website preview. 🔥\n\nWant it live? Let's talk about growing your business:\n${needsUrl}\n\nTakes 2 min — then book a free strategy call.\n\n— VektorLabs Team`;
}

function getInvoiceReminder(businessName: string): string {
  return `Quick reminder — your invoice for the ${businessName} website is waiting! 💰\n\nOnce paid, we start building immediately.\n\nQuestions? Just reply to this text.\n\n— VektorLabs Team`;
}

function getPublishedMessage(businessName: string, liveUrl: string): string {
  return `🎉 Your ${businessName} website is LIVE!\n\n${liveUrl}\n\nShare it everywhere. We're here if you need anything.\n\n— VektorLabs Team`;
}

function getCustomMessage(customText: string): string {
  return `${customText}\n\n— VektorLabs Team`;
}

// ============================================
// FORMAT PHONE
// ============================================

function formatPhone(phone: string): string {
  // Strip everything except digits and leading +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If no country code, assume US/Canada (+1)
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10) {
      cleaned = '+1' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      cleaned = '+' + cleaned;
    } else {
      cleaned = '+1' + cleaned;
    }
  }
  
  return cleaned;
}

// ============================================
// SEND SMS VIA TWILIO
// ============================================

async function sendTwilioSMS(to: string, body: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return { success: false, error: 'Twilio credentials not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in env.' };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: fromNumber,
        Body: body,
      }).toString(),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, sid: data.sid };
    } else {
      return { success: false, error: data.message || `Twilio error ${response.status}` };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ============================================
// MAIN HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    const { projectId, phone, template, customMessage } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Load project
    const { data: project, error: dbError } = await supabase
      .from('projects')
      .select('*, customers(name, email, phone)')
      .eq('id', projectId)
      .single();

    if (dbError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Resolve phone number: explicit param > project contact_phone > customer phone
    const rawPhone = phone || project.contact_phone || (project.customers as any)?.phone;
    if (!rawPhone) {
      return NextResponse.json({ error: 'No phone number found for this project. Add a phone number first.' }, { status: 400 });
    }

    const formattedPhone = formatPhone(rawPhone);
    const baseUrl = 'https://vektorlabs.ai';

    // Build message based on template
    let message: string;
    const businessName = project.business_name || 'your business';

    switch (template) {
      case 'preview':
        message = getPreviewMessage(businessName, `${baseUrl}/preview/${project.id}`);
        break;
      case 'needs':
        message = getNeedsFollowUp(businessName, `${baseUrl}/growth/${project.id}`);
        break;
      case 'invoice':
        message = getInvoiceReminder(businessName);
        break;
      case 'published':
        const liveUrl = project.metadata?.live_url || `${baseUrl}/preview/${project.id}`;
        message = getPublishedMessage(businessName, liveUrl);
        break;
      case 'custom':
        if (!customMessage) {
          return NextResponse.json({ error: 'Custom message text required' }, { status: 400 });
        }
        message = getCustomMessage(customMessage);
        break;
      default:
        message = getPreviewMessage(businessName, `${baseUrl}/preview/${project.id}`);
    }

    // Send SMS
    const result = await sendTwilioSMS(formattedPhone, message);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Log the SMS in messages table
    await supabase.from('messages').insert({
      project_id: projectId,
      content: `📱 SMS sent to ${formattedPhone}: "${message.substring(0, 100)}..."`,
      sender_type: 'admin',
      read: true,
    });

    return NextResponse.json({
      success: true,
      sid: result.sid,
      to: formattedPhone,
      template,
      messageLength: message.length,
    });

  } catch (error: any) {
    console.error('[SMS] Error:', error);
    return NextResponse.json({ error: error.message || 'SMS failed' }, { status: 500 });
  }
}
