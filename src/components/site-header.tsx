"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { Logo } from "@/components/ui";
import { MAIN_NAV } from "@/lib/site";

type HeaderProps = {
  announcement: string;
  phone: string;
  whatsappLink: string;
};

export function SiteHeader({ announcement, phone, whatsappLink }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const cart = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    router.push(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-navy-950 text-white/70 md:block">
        <div className="shell flex h-9 items-center justify-between text-[11.5px]">
          <p className="truncate tracking-wide">{announcement}</p>
          <div className="flex items-center gap-5">
            <Link href="/track" className="transition hover:text-white">Track Order</Link>
            <Link href="/bulk-orders" className="transition hover:text-white">Request Bulk Quote</Link>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold text-white transition hover:text-brand-300">
              {phone}
            </a>
          </div>
        </div>
      </div>

      <div
        className={`border-b bg-white/95 backdrop-blur transition-shadow ${
          scrolled ? "border-navy-100 shadow-[0_12px_30px_-24px_rgba(11,37,69,0.55)]" : "border-navy-100/70"
        }`}
      >
        <div className="shell flex h-16 items-center justify-between gap-4 lg:h-[70px]">
          <Link href="/" aria-label="RS Medicare Pharma home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-lg px-3 py-2 text-[13px] font-semibold transition ${
                  isActive(item.href)
                    ? "text-navy-900"
                    : "text-navy-500 hover:bg-navy-50 hover:text-navy-900"
                }`}
              >
                {item.label}
                {isActive(item.href) ? (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-500" />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Search products"
              aria-expanded={searchOpen}
              className="grid h-9 w-9 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50 hover:text-navy-900"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" strokeLinecap="round" />
              </svg>
            </button>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-navy-600 transition hover:bg-navy-50 hover:text-navy-900 sm:flex"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand-600" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-3.4-1.8 11 11 0 0 1-2.4-3c-.3-.5-.6-1.2-.6-1.8 0-.6.3-1.1.6-1.4.2-.2.4-.3.6-.3h.4c.2 0 .3 0 .4.3l.7 1.6c.1.2 0 .4-.1.5l-.4.5c-.1.1-.2.3-.1.4.3.6.8 1.2 1.3 1.7.5.4 1 .7 1.5 1 .2.1.3 0 .4-.1l.6-.6c.1-.2.3-.2.5-.1l1.5.8c.2.1.4.2.4.4 0 .1 0 .5-.1.8Z" />
              </svg>
              WhatsApp
            </a>

            <Link
              href="/cart"
              className="relative grid h-9 w-9 place-items-center rounded-lg text-navy-700 transition hover:bg-navy-50 hover:text-navy-900"
              aria-label={`Cart with ${cart.count} items`}
            >
              <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="20" r="1.3" />
                <circle cx="18" cy="20" r="1.3" />
              </svg>
              {cart.ready && cart.items.length > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                  {cart.items.length}
                </span>
              ) : null}
            </Link>

            <Link href="/bulk-orders" className="btn btn-primary ml-1 hidden !px-3.5 !py-2 !text-[12.5px] sm:inline-flex">
              Quick Enquiry
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              className="grid h-9 w-9 place-items-center rounded-lg text-navy-800 transition hover:bg-navy-50 lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                {mobileOpen ? <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
              </svg>
            </button>
          </div>
        </div>

        {searchOpen ? (
          <div className="border-t border-navy-100 bg-white">
            <form onSubmit={submitSearch} className="shell flex items-center gap-3 py-3">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-navy-400" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" strokeLinecap="round" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by product name, SKU, brand, category or keyword (e.g. nitrile, 3 gram, glov-x)"
                className="h-10 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-navy-300"
                aria-label="Search the catalogue"
              />
              <button type="submit" className="btn btn-brand !py-2 !text-[12.5px]">Search</button>
            </form>
          </div>
        ) : null}

        {mobileOpen ? (
          <div className="border-t border-navy-100 bg-white lg:hidden">
            <nav className="shell grid gap-1 py-3" aria-label="Mobile">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive(item.href) ? "bg-navy-50 text-navy-900" : "text-navy-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-1 h-px bg-navy-100" />
              <Link href="/track" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-navy-600">Track Order</Link>
              <Link href="/catalogue" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-navy-600">Product Catalogue</Link>
              <Link href="/dealer-enquiry" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-navy-600">Partner With Us</Link>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/products" className="btn btn-ghost !py-2.5 !text-[13px]">Explore Products</Link>
                <Link href="/cart" className="btn btn-primary !py-2.5 !text-[13px]">Cart ({cart.items.length})</Link>
              </div>
            </nav>
          </div>
        ) : null}
      </div>

      {cart.lastAdded ? (
        <div className="pointer-events-none fixed left-1/2 top-24 z-50 -translate-x-1/2 rounded-xl bg-navy-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl">
          Added to cart · {cart.lastAdded.slice(0, 46)}
          {cart.lastAdded.length > 46 ? "…" : ""}
        </div>
      ) : null}
    </header>
  );
}
