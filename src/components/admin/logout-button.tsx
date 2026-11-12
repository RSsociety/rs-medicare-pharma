"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin");
        router.refresh();
      }}
      className="rounded-lg px-3 py-2 text-left text-[12px] font-semibold text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
