import Link from "next/link";
import type { ReactNode } from "react";

export function Logo({ variant = "dark", compact = false }: { variant?: "dark" | "light"; compact?: boolean }) {
  const text = variant === "light" ? "text-white" : "text-navy-900";
  const sub = variant === "light" ? "text-white/60" : "text-navy-400";
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-navy-900 shadow-[0_10px_24px_-14px_rgba(11,37,69,0.9)]">
        <span className="absolute inset-x-0 bottom-0 h-1.5 bg-brand-500" />
        <span className="font-display text-[15px] font-extrabold tracking-tight text-white">RS</span>
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-brand-400" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[15px] font-extrabold tracking-[0.02em] ${text}`}>
          RS MEDICARE
        </span>
        <span className={`mt-1 text-[9.5px] font-semibold uppercase tracking-[0.34em] ${sub}`}>
          {compact ? "Pharma" : "Pharma · B2B Supply"}
        </span>
      </span>
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-5 ${
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={`max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
        {eyebrow ? <p className={`eyebrow ${light ? "text-brand-300" : ""}`}>{eyebrow}</p> : null}
        <h2
          className={`mt-3 text-2xl font-bold leading-tight text-balance sm:text-3xl lg:text-[2.15rem] ${
            light ? "text-white" : "text-navy-900"
          }`}
        >
          {title}
        </h2>
        {description ? (
          <p className={`mt-3 text-[15px] leading-relaxed ${light ? "text-white/70" : "text-navy-500"}`}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "navy" | "amber" | "rose" | "emerald" | "sky";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-navy-50 text-navy-600 ring-navy-100",
    brand: "bg-brand-50 text-brand-700 ring-brand-200",
    navy: "bg-navy-900 text-white ring-navy-900",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
  };
  return <span className={`chip ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-navy-400">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {item.href ? (
            <Link href={item.href} className="transition hover:text-navy-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-navy-600">{item.label}</span>
          )}
          {index < items.length - 1 ? <span className="text-navy-200">/</span> : null}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  image,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-navy-100 bg-navy-950 text-white">
      {image ? (
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      ) : null}
      <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute inset-0 grid-noise opacity-40" />
      <div className="shell relative py-12 sm:py-16">
        {breadcrumbs ? (
          <div className="mb-5 text-white/50">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : null}
        {eyebrow ? <p className="eyebrow text-brand-300">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-[1.12] text-balance sm:text-4xl lg:text-[2.9rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70">{description}</p>
        ) : null}
        {children ? <div className="mt-7 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}

export function StatBlock({ value, label, hint }: { value: string; label: string; hint?: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold text-navy-900 sm:text-[1.7rem]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-navy-700">{label}</p>
      {hint ? <p className="mt-0.5 text-xs text-navy-400">{hint}</p> : null}
    </div>
  );
}

export function TrustStrip() {
  const points = [
    "Centralised base pricing across markets",
    "GST shown separately at checkout",
    "Freight confirmed after location review",
    "Guest ordering — no account required",
  ];
  return (
    <div className="border-y border-navy-100 bg-white">
      <div className="shell grid gap-3 py-4 text-[12.5px] font-medium text-navy-600 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point) => (
          <div key={point} className="flex items-center gap-2">
            <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-brand-600" fill="currentColor" aria-hidden>
              <path d="M10 1.7 3 4.6v5.1c0 4.2 2.9 7.3 7 8.6 4.1-1.3 7-4.4 7-8.6V4.6L10 1.7Zm3.5 6.1-4 4.4a1 1 0 0 1-1.5 0L6.3 10l1.5-1.4 1 1.2 3.3-3.6 1.4 1.1Z" />
            </svg>
            {point}
          </div>
        ))}
      </div>
    </div>
  );
}
