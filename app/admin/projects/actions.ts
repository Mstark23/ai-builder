"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../../lib/supabaseServer";
import { sendPreviewEmail, sendDeliveredEmail } from "../../lib/email";

type ProjectStatus = "QUEUED" | "IN_PROGRESS" | "DELIVERED";

function isValidStatus(value: string): value is ProjectStatus {
  return value === "QUEUED" || value === "IN_PROGRESS" || value === "DELIVERED";
}

function generatePreviewUrl(projectId: string) {
  return `${
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  }/preview/${projectId}`;
}

export async function updateProjectStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));

  if (!id) throw new Error("Missing project id");
  if (!isValidStatus(status)) throw new Error("Invalid status");

  const supabase = supabaseServer();

  const { data: project, error } = await supabase
    .from("projects")
    .select("status, preview_url, email")
    .eq("id", id)
    .single();

  if (error || !project) {
    throw new Error("Project not found");
  }

  let previewUrl: string | null = project.preview_url ?? null;
  let previewJustCreated = false;
  let deliveredJustNow = false;

  const updateData: {
    status: ProjectStatus;
    preview_url?: string;
  } = { status };

  // Create preview once
  if (status === "IN_PROGRESS" && !project.preview_url) {
    previewUrl = generatePreviewUrl(id);
    updateData.preview_url = previewUrl;
    previewJustCreated = true;
  }

  // Detect delivery transition
  if (status === "DELIVERED" && project.status !== "DELIVERED") {
    deliveredJustNow = true;
  }

  const { error: updateError } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  // Emails
  if (previewJustCreated && project.email && previewUrl) {
    await sendPreviewEmail({
      to: project.email,
      projectId: id,
      previewUrl,
    });
  }

  if (deliveredJustNow && project.email && previewUrl) {
    await sendDeliveredEmail({
      to: project.email,
      projectId: id,
      previewUrl,
    });
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
}
