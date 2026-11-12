"use client";

import Link from "next/link";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-3 text-2xl font-bold text-navy-900">We could not load this page</h1>
      <p className="mt-3 max-w-md text-[13px] leading-relaxed text-navy-500">
        The page may be temporarily unavailable. Please retry, or contact our team if you were
        completing an order.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={reset} className="btn btn-primary">Retry</button>
        <Link href="/" className="btn btn-ghost">Back to home</Link>
        <Link href="/contact" className="btn btn-ghost">Contact support</Link>
      </div>
    </section>
  );
}
