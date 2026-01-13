export const dynamic = "force-dynamic";

import { supabaseServer } from "@/app/lib/supabaseServer";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function AdminProjectDetailPage({ params }: PageProps) {
  const supabase = supabaseServer();
  const projectId = params.id;

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error || !project) {
    return (
      <main style={{ padding: 32 }}>
        <h1>Project not found</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Project Detail
      </h1>

      <p>
        <strong>ID:</strong> {project.id}
      </p>
      <p>
        <strong>Email:</strong> {project.email}
      </p>
      <p>
        <strong>Status:</strong> {project.status}
      </p>
      <p>
        <strong>Created:</strong>{" "}
        {new Date(project.created_at).toLocaleString()}
      </p>
    </main>
  );
}
