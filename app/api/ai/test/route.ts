// app/api/ai/test/route.ts
// Simple test to verify Anthropic API key works

import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  // Check if key exists
  if (!apiKey) {
    return NextResponse.json({ 
      error: 'ANTHROPIC_API_KEY is not set',
      hint: 'Add it in Vercel Settings > Environment Variables'
    }, { status: 500 });
  }

  // Check key format
  if (!apiKey.startsWith('sk-ant-')) {
    return NextResponse.json({ 
      error: 'Invalid API key format',
      hint: 'Key should start with sk-ant-'
    }, { status: 500 });
  }

  // Try a simple API call
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 50,
        messages: [{ role: 'user', content: 'Say "API works!" and nothing else.' }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ 
        error: 'Anthropic API error',
        status: response.status,
        details: error.substring(0, 200)
      }, { status: 500 });
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true,
      message: 'API key is valid!',
      response: data.content[0].text
    });

  } catch (err) {
    return NextResponse.json({ 
      error: 'Failed to call API',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
