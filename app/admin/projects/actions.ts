"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/app/lib/supabaseServer";
import {
  sendPreviewEmail,
  sendDeliveredEmail,
} from "@/app/lib/email";

type ProjectStatus = "QUEUED" | "IN_PROGRESS" | "DELIVERED";

export async function updateProjectStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as ProjectStatus;

  if (!id || !status) {
    throw new Error("Missing project id or status");
  }

  const supabase = supabaseServer();

  // 1️⃣ Update project status
  const { error: updateError } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  // 2️⃣ Fetch project details
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("email, preview_url")
    .eq("id", id)
    .single();

  if (fetchError || !project) {
    throw new Error("Failed to fetch project after update");
  }

  // 3️⃣ Send emails depending on status
  if (status === "IN_PROGRESS" && project.preview_url) {
    await sendPreviewEmail({
      to: project.email,
      previewUrl: project.preview_url,
    });
  }

  if (status === "DELIVERED") {
    await sendDeliveredEmail({
      to: project.email,
    });
  }

  // 4️⃣ Revalidate admin pages
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
}
