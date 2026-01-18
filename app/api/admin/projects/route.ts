import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, ...fields } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("projects")
    .update(fields)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}