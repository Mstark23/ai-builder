export const dynamic = "force-dynamic";

import Link from "next/link";
import { supabaseServer } from "@/app/lib/supabaseServer";

export default async function AdminProjectsPage() {
  const supabase = supabaseServer();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: 32 }}>
        <h1>Admin Projects</h1>
        <p style={{ color: "red" }}>Failed to load projects</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>
        Admin Projects
      </h1>

      {projects?.map((project) => (
        <div
          key={project.id}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        >
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

          <Link
            href={`/admin/projects/${project.id}`}
            style={{ color: "#2563eb" }}
          >
            View →
          </Link>
        </div>
      ))}
    </main>
  );
}
