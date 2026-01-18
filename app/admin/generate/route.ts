import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function extractTextFromResponse(response: any): string {
  // The Responses API returns output items; we safely extract all text chunks.
  const items = response?.output ?? [];
  let text = "";

  for (const item of items) {
    const content = item?.content ?? [];
    for (const c of content) {
      if (c?.type === "output_text" && typeof c?.text === "string") {
        text += c.text;
      }
    }
  }

  return text.trim();
}

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    // 1) Fetch project data
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select(
        "id, business_name, industry, style, notes, status, paid, plan, email"
      )
      .eq("id", projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Optional: only allow generation when status is GENERATING
    if (project.status !== "GENERATING") {
      return NextResponse.json(
        { error: "Project must be GENERATING to generate" },
        { status: 400 }
      );
    }

    // 2) Ask OpenAI to generate a single-file HTML website
    // Using Responses API (recommended). :contentReference[oaicite:4]{index=4}
    const prompt = `
You are generating a COMPLETE, single-file website as HTML.

Requirements:
- Output ONLY valid HTML (no markdown, no backticks).
- Include inline CSS in a <style> tag (no external libraries).
- Make it look modern, clean, and professional.
- Sections: hero, services/features, about, testimonials, contact, footer.
- Use the brand/business info below.
- Do not include any scripts.

Business Name: ${project.business_name ?? ""}
Industry: ${project.industry ?? ""}
Style Keywords: ${project.style ?? ""}
Admin Notes (internal): ${project.notes ?? ""}

Return ONLY the HTML file.
`.trim();

    const aiResponse = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const html = extractTextFromResponse(aiResponse);

    if (!html || !html.includes("<html")) {
      return NextResponse.json(
        { error: "AI did not return valid HTML" },
        { status: 500 }
      );
    }

    // 3) Save generated HTML + mark delivered
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        generated_html: html,
        status: "DELIVERED",
      })
      .eq("id", projectId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to save generated_html" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Generate route error:", err);
    return NextResponse.json(
      { error: "Server error generating website" },
      { status: 500 }
    );
  }
}
