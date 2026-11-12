import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-3xl font-bold text-navy-900">This page is not in the catalogue</h1>
      <p className="mt-3 max-w-md text-[13px] leading-relaxed text-navy-500">
        The page or product you are looking for may have moved. Browse the catalogue or ask our team
        for the current SKU and availability.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/products" className="btn btn-primary">Browse Products</Link>
        <Link href="/contact" className="btn btn-ghost">Contact Sales</Link>
      </div>
    </section>
  );
}
