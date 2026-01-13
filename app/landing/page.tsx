import Link from "next/link";

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafafa",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 720,
          width: "100%",
          background: "white",
          padding: 40,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 40,
            fontWeight: 900,
            marginBottom: 16,
          }}
        >
          AI Website Builder
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "#555",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          Generate a complete website automatically.
          <br />
          Submit your project and receive a preview when it’s ready.
        </p>

        <Link
          href="/new-project"
          style={{
            display: "inline-block",
            padding: "14px 28px",
            borderRadius: 10,
            background: "#111",
            color: "white",
            fontSize: 16,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Create a New Project
        </Link>

        <div
          style={{
            marginTop: 40,
            fontSize: 13,
            color: "#999",
          }}
        >
          Admin access at <code>/admin/login</code>
        </div>
      </div>
    </main>
  );
}
