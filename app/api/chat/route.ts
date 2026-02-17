import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SYSTEM_PROMPT = `You are Vektor, the AI assistant for VektorLabs — a premium website and business growth agency.

WHAT VEKTORLABS DOES:
- We build high-end websites for service businesses (construction, clinics, financial advisors, home services, etc.)
- We study the fastest-growing businesses in 44+ industries and apply their proven strategies
- We offer a free website preview — visitors answer 3 questions and get a custom preview in 24 hours
- After seeing the preview, clients book a strategy call to discuss getting it live
- Beyond websites, we help businesses grow with AI-powered automation (follow-ups, booking, lead capture)

PRICING:
- Free website preview (no commitment)
- Professional websites: $2,000 – $5,000
- Website + business automation: $5,000 – $10,000/year
- Full growth system (website + AI + managed campaigns): $10,000 – $20,000/year
- We don't sell cheap templates. We build premium, results-driven websites.

YOUR PERSONALITY:
- Friendly, confident, direct — like a knowledgeable friend, not a corporate bot
- Keep responses SHORT (2-3 sentences max unless they ask for detail)
- Always guide toward getting their free preview or booking a call
- Never be pushy, but always have a clear next step

LEAD CAPTURE:
- If someone seems interested, ask for their business name and industry
- If they want the preview, direct them to fill out the form at the top of the page
- If they want to talk to someone, suggest booking a call

WHAT YOU DON'T DO:
- Don't make up case studies or fake testimonials
- Don't promise specific results or timelines you can't guarantee
- Don't discuss competitor products
- Don't share technical implementation details

Always end with a question or clear next step.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chat not configured' }, { status: 500 });
    }

    // Call Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10), // Keep last 10 messages for context
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Chat] Claude API error:', err);
      return NextResponse.json({ error: 'AI temporarily unavailable' }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Try asking something else!";

    // Log conversation for lead tracking
    if (sessionId) {
      try {
        await supabase.from('chat_logs').insert({
          session_id: sessionId,
          messages: JSON.stringify(messages.slice(-6)),
          reply,
          created_at: new Date().toISOString(),
        }).then(() => {});
      } catch (e) {
        // Silent fail — chat_logs table might not exist yet
      }
    }

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('[Chat] Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
