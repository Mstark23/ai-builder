// app/api/ai/extract-king/route.ts
// VERKTORLABS - King Forensic Extraction Endpoint
//
// POST: Extract design DNA from a King's live website
// Stores the result in Supabase for reuse

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractKingProfile, validateProfile, getProfileSummary } from '@/lib/ai/forensic-extractor';
import type { ExtractionRequest } from '@/lib/ai/king-forensic-profile';

export const maxDuration = 300; // 5 minutes — extraction can take a while

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kingUrl, kingName, industry, additionalPages, forceRefresh } = body;

    // Validate input
    if (!kingUrl || !kingName) {
      return NextResponse.json(
        { error: 'kingUrl and kingName are required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Check if we already have a cached profile (less than 30 days old)
    if (!forceRefresh) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data: cached } = await supabase
        .from('king_profiles')
        .select('*')
        .eq('king_url', kingUrl)
        .eq('is_active', true)
        .gte('extracted_at', thirtyDaysAgo)
        .single();

      if (cached) {
        console.log(`[Extract King] Using cached profile for ${kingName}`);
        return NextResponse.json({
          success: true,
          profile: cached.profile_data,
          cached: true,
          extractedAt: cached.extracted_at,
        });
      }
    }

    // Extract fresh profile
    console.log(`[Extract King] Starting extraction for ${kingName} (${kingUrl})`);

    const extractionRequest: ExtractionRequest = {
      kingUrl,
      kingName,
      industry: industry || 'general',
      additionalPages: additionalPages || [],
    };

    const result = await extractKingProfile(extractionRequest);

    if (!result.success || !result.profile) {
      return NextResponse.json(
        { error: result.error || 'Extraction failed', success: false },
        { status: 500 }
      );
    }

    // Validate the extracted profile
    const validation = validateProfile(result.profile);
    console.log(`[Extract King] Profile completeness: ${validation.completeness}%`);

    if (!validation.isValid) {
      console.warn(`[Extract King] Low completeness. Missing: ${validation.missingFields.join(', ')}`);
    }

    // Log profile summary
    console.log(getProfileSummary(result.profile));

    // Store in Supabase
    const { error: upsertError } = await supabase
      .from('king_profiles')
      .upsert({
        king_name: kingName,
        king_url: kingUrl,
        industry: industry || 'general',
        profile_data: result.profile,
        extracted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        extraction_version: '2.0',
        is_active: true,
        completeness_score: validation.completeness,
      }, {
        onConflict: 'king_url',
      });

    if (upsertError) {
      console.error(`[Extract King] Failed to store profile: ${upsertError.message}`);
      // Don't fail the request — still return the profile
    }

    return NextResponse.json({
      success: true,
      profile: result.profile,
      cached: false,
      completeness: validation.completeness,
      missingFields: validation.missingFields,
      tokensUsed: result.tokensUsed,
      extractionTime: result.extractionTime,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Extract King] Error: ${message}`);
    return NextResponse.json(
      { error: message, success: false },
      { status: 500 }
    );
  }
}

// GET: Retrieve a stored King profile
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const kingUrl = searchParams.get('url');
  const kingName = searchParams.get('name');
  const listAll = searchParams.get('list');

  // List all stored profiles
  if (listAll === 'true') {
    const { data, error } = await supabase
      .from('king_profiles')
      .select('king_name, king_url, industry, extracted_at, completeness_score')
      .eq('is_active', true)
      .order('extracted_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ kings: data });
  }

  // Get specific profile
  if (!kingUrl && !kingName) {
    return NextResponse.json(
      { error: 'Provide url or name parameter, or list=true' },
      { status: 400 }
    );
  }

  const query = supabase
    .from('king_profiles')
    .select('*')
    .eq('is_active', true);

  if (kingUrl) query.eq('king_url', kingUrl);
  if (kingName) query.ilike('king_name', `%${kingName}%`);

  const { data, error } = await query.single();

  if (error || !data) {
    return NextResponse.json(
      { error: 'King profile not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    profile: data.profile_data,
    extractedAt: data.extracted_at,
    completeness: data.completeness_score,
  });
}
