// app/api/ai/generate/route.ts
// VERKTORLABS - AI Website Generation Engine v2.0
//
// Two generation modes:
// 1. KING DNA MODE: Uses forensic extraction from a King's website
// 2. LEGACY MODE: Falls back to industry briefs if no King is selected

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 300;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =============================================================================
// TYPES (inline to avoid import issues)
// =============================================================================

interface CustomerQuestionnaire {
  businessName: string;
  industry: string;
  description: string;
  targetAudience: string;
  websiteGoal: string;
  uniqueSellingPoints: string[];
  services: string[];
  features: string[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  socialMedia?: Record<string, string>;
  testimonials?: { name: string; role: string; text: string; rating: number }[];
  stats?: { number: string; label: string }[];
  pricing?: { name: string; price: string; features: string[]; isPopular: boolean }[];
  faqs?: { question: string; answer: string }[];
  customContent?: Record<string, string>;
}

// =============================================================================
// CUSTOMER QUESTIONNAIRE BUILDER
// =============================================================================

function buildCustomerFromProject(project: any): CustomerQuestionnaire {
  return {
    businessName: project.business_name || 'My Business',
    industry: project.industry || 'Professional Services',
    description: project.description || 'A professional business offering quality services',
    targetAudience: project.target_audience || 'General audience',
    websiteGoal: project.website_goal || 'Generate leads and build trust',
    uniqueSellingPoints: project.unique_selling_points || project.usps || [],
    services: project.services || [],
    features: project.features || ['Contact Form', 'Testimonials', 'Services'],
    contactInfo: {
      email: project.contact_email || 'hello@company.com',
      phone: project.contact_phone || '(555) 123-4567',
      address: project.address || 'New York, NY',
    },
    socialMedia: project.social_media || {},
    testimonials: project.testimonials || [],
    stats: project.stats || [],
    pricing: project.pricing || [],
    faqs: project.faqs || [],
    customContent: project.custom_content || {},
  };
}

// =============================================================================
// LEGACY GENERATION (fallback when no King is selected)
// =============================================================================

const LEGACY_SYSTEM_PROMPT = `You are an elite creative director who has designed for Apple, Stripe, Linear, and Vercel. Companies pay you $100,000+ per website.

## DESIGN RULES
1. TYPOGRAPHY: Hero headlines clamp(48px, 7vw, 80px), letter-spacing -0.02em, font weight contrast 400 vs 700
2. COLOR: Maximum 3 colors + neutrals. Dark themes feel premium. Light themes need warmth.
3. WHITESPACE: Section padding 100px-150px vertical. Expensive = more space.
4. MOTION: transition 0.3s cubic-bezier(0.4, 0, 0.2, 1). Scroll reveals. Hover states.
5. WOW ELEMENT: gradient text, glassmorphism, glowing CTAs, floating shapes — pick ONE.
6. COPY: Headlines create emotion. Benefits over features. Social proof everywhere.
7. DETAILS: Custom selection color. Smooth scroll. Custom focus states.

## OUTPUT
Return ONLY complete HTML. Start with <!DOCTYPE html>. End with </html>.
ALL CSS in <style>, ALL JS in <script>. No markdown. No explanations.`;

const LEGACY_INDUSTRY_BRIEFS: Record<string, string> = {
  'restaurant': 'COLOR: burgundy #7f1d1d, cream #fef3c7, gold #d97706. FONTS: Playfair Display + Lato. SECTIONS: Hero, About/Story, Menu Highlights, Gallery, Testimonials, Location & Hours, Footer. COPY: Sensual, appetizing.',
  'health-beauty': 'COLOR: sage #84a98c, cream #fefcf3, gold #d4af37. FONTS: Cormorant Garamond + Quicksand. SECTIONS: Serene hero, Services, About, Team, Gallery, Testimonials, Booking, Footer. COPY: Soothing.',
  'professional': 'COLOR: navy #1e3a5f, gold #b8860b, light blue #dbeafe. FONTS: Inter + Source Sans Pro. SECTIONS: Hero, Services, About, Team, Case Studies, Testimonials, Contact, Footer. COPY: Authoritative.',
  'fitness': 'COLOR: electric blue #0ea5e9, charcoal #18181b, lime #84cc16. Dark theme. FONTS: Oswald + Inter. SECTIONS: Hero, Programs, Transformations, Trainers, Pricing, Contact, Footer. COPY: Motivational.',
  'tech-startup': 'COLOR: indigo #6366f1, pink #ec4899, cyan #22d3ee. FONTS: Space Grotesk + Inter. SECTIONS: Hero, Features (bento), How It Works, Pricing, Testimonials, FAQ, CTA, Footer. COPY: Benefit-focused.',
  'real-estate': 'COLOR: navy #1e3a5f, gold #b8860b, green #166534. FONTS: Poppins + Inter. SECTIONS: Hero, Listings, Agent Profile, Services, Testimonials, Contact, Footer. COPY: Aspirational.',
  'ecommerce': 'COLOR: black #000, brand, gold. FONTS: DM Sans + Inter. SECTIONS: Hero, Trust Badges, Products, Categories, Reviews, Newsletter, Footer. COPY: Concise + urgency.',
  'local-services': 'COLOR: blue #1e40af, orange #ea580c. FONTS: Poppins + Inter. SECTIONS: Hero + trust badges + phone, Services, Why Us, Gallery, Reviews, Areas, Contact, Footer. COPY: Reassuring.',
};

const LEGACY_STYLE_MODIFIERS: Record<string, string> = {
  'modern': 'Clean lines, subtle gradients, card-based layouts, smooth animations, lots of whitespace',
  'elegant': 'Serif fonts, gold accents, refined typography, subtle shadows, cream backgrounds',
  'bold': 'Oversized typography, high contrast, strong colors, dramatic shadows, striking imagery',
  'minimal': 'Maximum whitespace, 2-3 colors only, simple typography, essential elements only',
  'playful': 'Rounded corners, bright colors, bouncy animations, illustrated elements, fun patterns',
  'dark': 'Dark backgrounds (#0a0a0a), light text, glowing accents, gradient borders, premium feel',
  'corporate': 'Professional blues and grays, structured layouts, trust-building elements',
};

async function generateLegacy(project: any): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const industry = (project.industry || 'professional').toLowerCase().replace(/[^a-z-]/g, '-');
  const style = (project.style || 'modern').toLowerCase();

  const industryBrief = LEGACY_INDUSTRY_BRIEFS[industry] || LEGACY_INDUSTRY_BRIEFS['professional'] || '';
  const styleGuide = LEGACY_STYLE_MODIFIERS[style] || LEGACY_STYLE_MODIFIERS['modern'];

  const userPrompt = `Create a stunning website for:

BUSINESS: ${project.business_name} (${project.industry || 'Professional Services'})
DESCRIPTION: ${project.description || 'A professional business'}
GOAL: ${project.website_goal || 'Generate leads'}
STYLE: ${project.style || 'modern'} — ${styleGuide}
EMAIL: ${project.contact_email || 'hello@company.com'}
PHONE: ${project.contact_phone || '(555) 123-4567'}
ADDRESS: ${project.address || 'New York, NY'}
FEATURES: ${(project.features || ['Contact Form', 'Testimonials', 'Services']).join(', ')}

INDUSTRY GUIDE: ${industryBrief}

Make the hero breathtaking, use real Unsplash images, add scroll animations, mobile responsive.
Output ONLY the complete HTML starting with <!DOCTYPE html>`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: LEGACY_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) throw new Error(`Claude API: ${response.status}`);

  const data = await response.json();
  let html = data.content[0].text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) html = html.substring(doctypeIndex);

  return html;
}

// =============================================================================
// LEGACY REVISION
// =============================================================================

async function legacyRevise(currentHtml: string, editRequest: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: 'You are an elite web designer. Apply the requested changes while maintaining premium quality. Output ONLY the complete HTML.',
      messages: [{
        role: 'user',
        content: `Apply this change: ${editRequest}\n\nCurrent HTML:\n${currentHtml.substring(0, 20000)}\n\nReturn the COMPLETE updated HTML starting with <!DOCTYPE html>.`,
      }],
    }),
  });

  if (!response.ok) throw new Error('Edit failed');

  const data = await response.json();
  let html = data.content[0].text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');

  return html;
}

// =============================================================================
// API HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, action } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const { data: project, error: dbError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (dbError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // ═════════════════════════════════════════════════════════════
    // GENERATE
    // ═════════════════════════════════════════════════════════════
    if (action === 'generate') {
      let html: string;
      let generationMode: string;

      const kingUrl = project.king_url || body.kingUrl;
      const kingName = project.king_name || body.kingName;
      const kingProfileId = project.king_profile_id || body.kingProfileId;

      if (kingUrl || kingName || kingProfileId) {
        // ═══ KING DNA MODE ═══
        // Dynamic imports to avoid Next.js route export validation issues
        try {
          const kingGenerator = await import('@/lib/ai/king-generator');
          const forensicExtractor = await import('@/lib/ai/forensic-extractor');

          generationMode = 'king-dna';
          const customer = buildCustomerFromProject(project);

          // Try to load existing profile from Supabase
          let kingProfile = null;
          const identifier = kingProfileId || kingUrl || kingName;

          if (identifier) {
            let query = supabase
              .from('king_profiles')
              .select('profile_data')
              .eq('is_active', true);

            if (identifier.startsWith('http')) {
              query = query.eq('king_url', identifier);
            } else if (identifier.match(/^[0-9a-f-]{36}$/)) {
              query = query.eq('id', identifier);
            } else {
              query = query.ilike('king_name', `%${identifier}%`);
            }

            const { data } = await query.single();
            if (data?.profile_data) {
              kingProfile = data.profile_data;
            }
          }

          if (kingProfile) {
            console.log('[Generate] King DNA mode: stored profile');
            html = await kingGenerator.generateFromKingDNA(kingProfile, customer);
          } else if (kingUrl) {
            // Live extraction + generation
            console.log(`[Generate] Live extraction for: ${kingName || kingUrl}`);
            const result = await forensicExtractor.extractKingProfile({
              kingUrl,
              kingName: kingName || 'Unknown',
              industry: project.industry || 'general',
            });

            if (!result.success || !result.profile) {
              throw new Error(`King extraction failed: ${result.error}`);
            }

            // Store for future use
            await supabase
              .from('king_profiles')
              .upsert({
                king_name: kingName || 'Unknown',
                king_url: kingUrl,
                industry: project.industry || 'general',
                profile_data: result.profile,
                extracted_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                extraction_version: '2.0',
                is_active: true,
              }, { onConflict: 'king_url' });

            html = await kingGenerator.generateFromKingDNA(result.profile, customer);
          } else {
            throw new Error('King not found');
          }
        } catch (kingError) {
          // Fall back to legacy if King system fails
          console.error('[Generate] King DNA failed, falling back:', kingError);
          generationMode = 'legacy-fallback';
          html = await generateLegacy(project);
        }
      } else {
        // ═══ LEGACY MODE ═══
        generationMode = 'legacy';
        html = await generateLegacy(project);
      }

      await supabase
        .from('projects')
        .update({
          generated_html: html,
          status: 'PREVIEW_READY',
          generation_mode: generationMode,
          generated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html, mode: generationMode });
    }

    // ═════════════════════════════════════════════════════════════
    // QUICK-EDIT / REVISE
    // ═════════════════════════════════════════════════════════════
    if (action === 'quick-edit' || action === 'revise') {
      const { instruction, feedback, currentHtml } = body;
      const editRequest = instruction || feedback;
      const htmlToEdit = currentHtml || project.generated_html || '';

      let html: string;

      const kingUrl = project.king_url;
      const kingName = project.king_name;

      if (kingUrl || kingName) {
        try {
          const kingGenerator = await import('@/lib/ai/king-generator');

          const identifier = kingUrl || kingName;
          let query = supabase
            .from('king_profiles')
            .select('profile_data')
            .eq('is_active', true);

          if (identifier!.startsWith('http')) {
            query = query.eq('king_url', identifier);
          } else {
            query = query.ilike('king_name', `%${identifier}%`);
          }

          const { data } = await query.single();

          if (data?.profile_data) {
            const customer = buildCustomerFromProject(project);
            html = await kingGenerator.reviseFromKingDNA(data.profile_data, htmlToEdit, editRequest, customer);
          } else {
            html = await legacyRevise(htmlToEdit, editRequest);
          }
        } catch {
          html = await legacyRevise(htmlToEdit, editRequest);
        }
      } else {
        html = await legacyRevise(htmlToEdit, editRequest);
      }

      await supabase
        .from('projects')
        .update({
          generated_html: html,
          ...(action === 'revise' && { revision_count: (project.revision_count || 0) + 1 }),
        })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Generate] Error: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
