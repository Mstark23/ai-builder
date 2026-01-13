"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/projects");
  }

  return (
    <main
      suppressHydrationWarning
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Admin Login
        </h1>

        <p style={{ color: "#666", marginBottom: 24 }}>
          Sign in to access the admin dashboard
        </p>

        <form onSubmit={handleSubmit}>
          <input
            suppressHydrationWarning
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={input}
          />

          <input
            suppressHydrationWarning
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={input}
          />

          {error && (
            <p style={{ color: "crimson", marginBottom: 8 }}>{error}</p>
          )}

          <button
            suppressHydrationWarning
            type="submit"
            disabled={loading}
            style={button}
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
};

const button: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: 8,
  background: "#111",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: 15,
};
