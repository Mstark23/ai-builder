import React from "react";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/app/lib/supabaseServer";
import { updateProjectStatus } from "@/app/admin/projects/actions";

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
  // ✅ Next.js 16: params is a Promise
  const { id } = React.use(params);

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

      <p>
        <strong>ID:</strong> {project.id}
      </p>

      <p>
        <strong>Status:</strong> {project.status}
      </p>

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
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Open preview →
          </a>
        </p>
      )}

      <hr style={{ margin: "30px 0" }} />

      <h2>Update Status</h2>

      <form action={updateProjectStatus}>
        <input type="hidden" name="id" value={project.id} />

        <select
          name="status"
          defaultValue={project.status}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginRight: 12,
          }}
        >
          <option value="QUEUED">QUEUED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DELIVERED">DELIVERED</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 6,
            background: "#111",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Save
        </button>
      </form>
    </main>
  );
}
