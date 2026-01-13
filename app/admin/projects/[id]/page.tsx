import { notFound } from "next/navigation";
import { supabaseServer } from "@/app/lib/supabaseServer";
import { updateProjectStatus } from "../actions";

export const dynamic = "force-dynamic";

type Project = {
  id: string;
  status: "QUEUED" | "IN_PROGRESS" | "DELIVERED";
  created_at: string;
  preview_url: string | null;
};

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ NEXT.JS 16 FIX — params IS A PROMISE
  const { id } = await params;

  const supabase = supabaseServer();

  const { data: project, error } = await supabase
    .from("projects")
    .select("id, status, created_at, preview_url")
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1 style={{ fontSize: 32, fontWeight: 900 }}>
        Project Details
      </h1>

      <p><strong>ID:</strong> {project.id}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <p>
        <strong>Created:</strong>{" "}
        {new Date(project.created_at).toLocaleString()}
      </p>

      {project.preview_url && (
        <p>
          <strong>Preview:</strong>{" "}
          <a
            href={project.preview_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open preview →
          </a>
        </p>
      )}

      <hr style={{ margin: "30px 0" }} />

      <form action={updateProjectStatus}>
        <input type="hidden" name="id" value={project.id} />

        <select name="status" defaultValue={project.status}>
          <option value="QUEUED">QUEUED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DELIVERED">DELIVERED</option>
        </select>

        <button type="submit" style={{ marginLeft: 12 }}>
          Save
        </button>
      </form>
    </main>
  );
}
