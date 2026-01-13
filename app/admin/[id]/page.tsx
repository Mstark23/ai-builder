import { notFound } from "next/navigation";
import { supabaseServer } from "@/app/lib/supabaseServer";

type ProjectRow = {
  id: string;
  created_at: string;
  status: "QUEUED" | "IN_PROGRESS" | "DELIVERED";
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export default async function PreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = supabaseServer();

  const { data: project, error } = await supabase
    .from("projects")
    .select("id, created_at, status")
    .eq("id", params.id)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        padding: 40,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          width: "100%",
          background: "white",
          padding: 40,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: 36, fontWeight: 900 }}>
          Website Preview
        </h1>

        <p style={{ marginTop: 8, color: "#555" }}>
          This is a live preview of your website.
        </p>

        <hr style={{ margin: "24px 0" }} />

        <p>
          <strong>Project ID:</strong>{" "}
          <span style={{ fontFamily: "monospace" }}>{project.id}</span>
        </p>

        <p>
          <strong>Status:</strong> {project.status}
        </p>

        <p>
          <strong>Created:</strong> {formatDate(project.created_at)}
        </p>

        <div
          style={{
            marginTop: 40,
            padding: 24,
            borderRadius: 12,
            background: "#f0f0f0",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>
            🚧 Preview Content Placeholder
          </h2>

          <p style={{ marginTop: 8, color: "#666" }}>
            The generated website will appear here.
            <br />
            This page is already live and deployed.
          </p>
        </div>
      </div>
    </main>
  );
}
