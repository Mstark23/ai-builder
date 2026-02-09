import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  // Auth: only admins can update projects
  const adminSecret = req.headers.get('x-admin-secret');
  if (adminSecret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
  }

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

export async function DELETE(req: NextRequest) {
  // Auth: only admins can delete projects
  const adminSecret = req.headers.get('x-admin-secret');
  if (adminSecret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Delete related data first
  await supabaseAdmin.from("messages").delete().eq("project_id", id);
  await supabaseAdmin.from("tracking_events").delete().eq("project_id", id);

  // Delete the project
  const { error } = await supabaseAdmin
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
