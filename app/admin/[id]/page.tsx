export const dynamic = "force-dynamic";

"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/admin/projects";
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 360 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 20 }}>
          Admin Login
        </h1>

        {error && (
          <p style={{ color: "red", marginBottom: 12 }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: 12,
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: 12,
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              background: "#111",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
