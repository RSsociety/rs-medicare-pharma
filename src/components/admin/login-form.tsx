"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Login failed.");
        setLoading(false);
        return;
      }
      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please retry.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <div>
        <label className="label" htmlFor="admin-email">Admin email</label>
        <input id="admin-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="field" placeholder="admin@rsmedicarepharma.com" autoComplete="username" />
      </div>
      <div>
        <label className="label" htmlFor="admin-password">Password</label>
        <input id="admin-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="field" placeholder="••••••••" autoComplete="current-password" />
      </div>
      {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-[11.5px] font-medium text-rose-700">{error}</p> : null}
      <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
        {loading ? "Verifying…" : "Sign in to admin"}
      </button>
    </form>
  );
}
