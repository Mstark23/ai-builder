"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("projects")
      .insert([
        {
          email,
          business_name: businessName,
          industry,
          style,
          plan,
          status: "QUEUED",
          paid: false,
        },
      ] as any); // ✅ FIX: tell TypeScript to stop guessing

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      alert("Project submitted successfully!");
      setEmail("");
      setBusinessName("");
      setIndustry("");
      setStyle("");
      setPlan("");
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 500 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 20 }}>
        Create Your Website
      </h1>

      {error && (
        <p style={{ color: "red", marginBottom: 12 }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 12, marginBottom: 10 }}
        />

        <input
          type="text"
          placeholder="Business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          style={{ width: "100%", padding: 12, marginBottom: 10 }}
        />

        <input
          type="text"
          placeholder="Industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          required
          style={{ width: "100%", padding: 12, marginBottom: 10 }}
        />

        <input
          type="text"
          placeholder="Style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          required
          style={{ width: "100%", padding: 12, marginBottom: 10 }}
        />

        <input
          type="text"
          placeholder="Plan"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          required
          style={{ width: "100%", padding: 12, marginBottom: 20 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            background: "#111",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
