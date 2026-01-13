import Link from "next/link";
import { supabaseServer } from "@/app/lib/supabaseServer";

type Project = {
  id: string;
  status: "QUEUED" | "IN_PROGRESS" | "DELIVERED";
  created_at: string;
};

export default async function AdminProjectsPage() {
  const supabase = supabaseServer();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <p style={{ padding: 32 }}>Error loading projects</p>;
  }

  return (
    <main style={{ padding: "32px", maxWidth: 900 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>
        Admin Projects
      </h1>

      {!projects || projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {projects.map((project: Project) => (
            <div
              key={project.id}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: 20,
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
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
