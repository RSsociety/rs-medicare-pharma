"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FooterConfig } from "@/lib/settings";

const SOCIAL_FIELDS = [
  { key: "facebook", label: "Facebook URL" },
  { key: "instagram", label: "Instagram URL" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "youtube", label: "YouTube URL" },
] as const;

/**
 * Admin editor for the website footer: description, link columns, social URLs,
 * copyright line and the legal disclaimer.
 */
export function FooterEditor({ initial }: { initial: FooterConfig }) {
  const router = useRouter();
  const [config, setConfig] = useState<FooterConfig>(() => JSON.parse(JSON.stringify(initial)));
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    setState("saving");
    setMessage(null);
    try {
      const response = await fetch("/api/admin/footer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setState("error");
        setMessage(data.error ?? "Could not save the footer.");
        return;
      }
      setState("saved");
      setMessage("Footer saved. It is live on every page now.");
      router.refresh();
      window.setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
      setMessage("Network error. Please retry.");
    }
  };

  const updateColumn = (index: number, patch: Partial<FooterConfig["columns"][number]>) =>
    setConfig((current) => ({
      ...current,
      columns: current.columns.map((column, position) => (position === index ? { ...column, ...patch } : column)),
    }));

  const updateLink = (columnIndex: number, linkIndex: number, patch: { label?: string; href?: string }) =>
    setConfig((current) => ({
      ...current,
      columns: current.columns.map((column, position) =>
        position === columnIndex
          ? { ...column, links: column.links.map((link, linkPosition) => (linkPosition === linkIndex ? { ...link, ...patch } : link)) }
          : column,
      ),
    }));

  return (
    <div className="space-y-4">
      {message ? (
        <p className={`rounded-lg px-3 py-2 text-[11.5px] font-medium ${state === "error" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
          {message}
        </p>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-[12.5px] font-bold text-slate-900">Footer description &amp; contact block</h2>
        <p className="mt-0.5 text-[10.5px] text-slate-400">
          Phone, email, address and business hours come from the main Settings page — this panel controls the footer text and links.
        </p>
        <div className="mt-3">
          <label className="label" htmlFor="f-desc">Company description (shown under the logo)</label>
          <textarea
            id="f-desc"
            rows={3}
            className="field resize-none"
            value={config.description}
            onChange={(event) => setConfig({ ...config, description: event.target.value })}
          />
          <p className="mt-1 text-[9.5px] text-slate-400">{config.description.length}/700 characters</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[12.5px] font-bold text-slate-900">Footer link columns</h2>
          <button
            type="button"
            disabled={config.columns.length >= 5}
            onClick={() =>
              setConfig((current) => ({
                ...current,
                columns: [...current.columns, { title: "New section", links: [{ label: "Link", href: "/" }] }],
              }))
            }
            className="btn btn-ghost !py-1.5 !text-[10.5px] disabled:opacity-50"
          >
            + Add column
          </button>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {config.columns.map((column, columnIndex) => (
            <div key={`col-${columnIndex}`} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <div className="flex items-center gap-2">
                <input
                  value={column.title}
                  onChange={(event) => updateColumn(columnIndex, { title: event.target.value })}
                  placeholder="Column title"
                  className="field !py-1.5 !text-[11.5px] font-semibold"
                />
                <button
                  type="button"
                  onClick={() =>
                    setConfig((current) => ({
                      ...current,
                      columns: current.columns.filter((_, position) => position !== columnIndex),
                    }))
                  }
                  className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                >
                  Remove
                </button>
              </div>

              <div className="mt-2 space-y-1.5">
                {column.links.map((link, linkIndex) => (
                  <div key={`link-${columnIndex}-${linkIndex}`} className="flex items-center gap-1.5">
                    <input
                      value={link.label}
                      onChange={(event) => updateLink(columnIndex, linkIndex, { label: event.target.value })}
                      placeholder="Label"
                      className="field !py-1 !text-[10.5px]"
                    />
                    <input
                      value={link.href}
                      onChange={(event) => updateLink(columnIndex, linkIndex, { href: event.target.value })}
                      placeholder="/about"
                      className="field !py-1 !text-[10.5px] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((current) => ({
                          ...current,
                          columns: current.columns.map((item, position) =>
                            position === columnIndex
                              ? { ...item, links: item.links.filter((_, linkPosition) => linkPosition !== linkIndex) }
                              : item,
                          ),
                        }))
                      }
                      className="shrink-0 rounded border border-slate-200 px-1.5 py-1 text-[10px] text-rose-600 hover:bg-rose-50"
                      aria-label="Remove link"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                disabled={column.links.length >= 12}
                onClick={() =>
                  setConfig((current) => ({
                    ...current,
                    columns: current.columns.map((item, position) =>
                      position === columnIndex ? { ...item, links: [...item.links, { label: "New link", href: "/" }] } : item,
                    ),
                  }))
                }
                className="mt-2 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-brand-700 hover:border-brand-300 disabled:opacity-50"
              >
                + Add link
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[9.5px] text-slate-400">
          Links must start with <code>/</code> for internal pages (e.g. <code>/about</code>) or <code>https://</code> for external pages.
          Anything else is rejected automatically for safety.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-[12.5px] font-bold text-slate-900">Social media &amp; legal text</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {SOCIAL_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="label" htmlFor={`f-${field.key}`}>{field.label}</label>
              <input
                id={`f-${field.key}`}
                className="field"
                placeholder="https://…"
                value={config.socials[field.key]}
                onChange={(event) => setConfig({ ...config, socials: { ...config.socials, [field.key]: event.target.value } })}
              />
            </div>
          ))}
          <div>
            <label className="label" htmlFor="f-copyright">Copyright line (blank = auto)</label>
            <input
              id="f-copyright"
              className="field"
              placeholder="© 2026 RS Medicare Pharma. All rights reserved."
              value={config.copyright}
              onChange={(event) => setConfig({ ...config, copyright: event.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="f-disclaimer">Legal disclaimer (bottom of every page)</label>
            <textarea
              id="f-disclaimer"
              rows={3}
              className="field resize-none"
              value={config.disclaimer}
              onChange={(event) => setConfig({ ...config, disclaimer: event.target.value })}
            />
          </div>
        </div>
      </section>

      <div className="sticky bottom-3 flex justify-end gap-2 rounded-xl border border-slate-200 bg-white/95 p-3 backdrop-blur">
        <button type="button" onClick={() => setConfig(JSON.parse(JSON.stringify(initial)))} className="btn btn-ghost !py-2 !text-[12px]">
          Reset
        </button>
        <button type="button" onClick={save} disabled={state === "saving"} className="btn btn-primary !py-2 !text-[12px] disabled:opacity-60">
          {state === "saving" ? "Saving…" : state === "saved" ? "✓ Saved" : "Save footer"}
        </button>
      </div>
    </div>
  );
}
