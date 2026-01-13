"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";
import { updateProjectStatus } from "../actions";

type ProjectStatus = "QUEUED" | "IN_PROGRESS" | "DELIVERED";

type ProjectRow = {
  id: string;
  created_at: string;
  status: ProjectStatus;
  preview_url: string | null;
};

const STATUSES: ProjectStatus[] = ["QUEUED", "IN_PROGRESS", "DELIVERED"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export default function AdminProjectDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setProject(data as ProjectRow);
      setLoading(false);
    }

    if (projectId) {
      loadProject();
    }
  }, [projectId, router]);

  if (loading) {
    return <p style={{ padding: 24 }}>Loading project…</p>;
  }

  if (!project) {
    return <p style={{ padding: 24 }}>Project not found.</p>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>
        Project Details
      </h1>

      <p>
        <strong>ID:</strong>{" "}
        <span style={{ fontFamily: "monospace" }}>{project.id}</span>
      </p>
      <p>
        <strong>Created:</strong> {formatDate(project.created_at)}
      </p>
      <p>
        <strong>Status:</strong> {project.status}
      </p>

      {/* STATUS UPDATE */}
      <form action={updateProjectStatus} style={{ marginTop: 20 }}>
        <input type="hidden" name="id" value={project.id} />

        <select name="status" defaultValue={project.status}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button type="submit" style={{ marginLeft: 8 }}>
          Save
        </button>
      </form>

      {/* PREVIEW */}
      <div style={{ marginTop: 24 }}>
        <h3>Preview</h3>

        {project.preview_url ? (
          <Link href={project.preview_url} target="_blank">
            {project.preview_url}
          </Link>
        ) : (
          <p>Preview will appear when status = IN_PROGRESS</p>
        )}
      </div>
    </main>
  );
}
