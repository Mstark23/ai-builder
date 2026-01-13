"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

type Project = {
  id: string;
  status: string;
  created_at: string;
};

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 🔒 Protect route
      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("id, status, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data);
      }

      setLoading(false);
    };

    load();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (loading) {
    return <p style={{ padding: 24 }}>Loading…</p>;
  }

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <h1 style={{ fontSize: 32 }}>Admin Projects</h1>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 16px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>

      {/* PROJECTS */}
      {projects.length === 0 && <p>No projects yet.</p>}

      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
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

          <a
            href={`/admin/projects/${project.id}`}
            style={{ marginTop: 10, display: "inline-block" }}
          >
            View →
          </a>
        </div>
      ))}
    </main>
  );
}
