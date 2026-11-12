import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminLogoutButton } from "@/components/admin/logout-button";
import { Logo } from "@/components/ui";
import { isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", hint: "Analytics" },
  { href: "/admin/orders", label: "Orders", hint: "Freight & status" },
  { href: "/admin/products", label: "Products", hint: "Catalogue" },
  { href: "/admin/enquiries", label: "Enquiries", hint: "B2B pipeline" },
  { href: "/admin/customers", label: "Customers", hint: "CRM records" },
  { href: "/admin/settings", label: "Settings", hint: "Tax, freight, payments" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-[100rem] flex-col lg:flex-row">
        <aside className="no-print bg-navy-950 text-white lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0">
          <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block lg:px-5 lg:py-5">
            <Link href="/admin/dashboard"><Logo variant="light" compact /></Link>
            <span className="rounded-md bg-white/10 px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/70 lg:mt-4 lg:inline-block">Admin console</span>
          </div>
          <nav className="no-scrollbar flex gap-1 overflow-x-auto border-t border-white/10 px-2 py-2 lg:flex-col lg:border-t-0 lg:px-3 lg:py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex shrink-0 flex-col rounded-lg px-3 py-2 text-[12px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white lg:w-full"
              >
                {link.label}
                <span className="text-[9.5px] font-medium text-white/35">{link.hint}</span>
              </Link>
            ))}
          </nav>
          <div className="hidden border-t border-white/10 p-3 lg:block">
            <Link href="/" className="block rounded-lg px-3 py-2 text-[12px] font-semibold text-white/60 transition hover:bg-white/10 hover:text-white">View storefront</Link>
            <AdminLogoutButton />
          </div>
        </aside>
        <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:py-8">
          <div className="no-print mb-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
            <p className="text-[11px] font-semibold text-slate-500">RS Medicare Pharma · internal operations</p>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
              <Link href="/" className="hover:text-slate-900">Storefront</Link>
              <span className="lg:hidden"><AdminLogoutButton /></span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
