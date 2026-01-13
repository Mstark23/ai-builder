"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "8px 14px",
        borderRadius: 8,
        border: "1px solid #ccc",
        background: "white",
        cursor: "pointer",
        fontSize: 14,
      }}
    >
      Logout
    </button>
  );
}
