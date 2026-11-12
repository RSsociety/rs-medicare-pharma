"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { inr } from "@/lib/pricing";
import type { Category } from "@/db/schema";
import type { ProductWithMeta } from "@/lib/queries";

type Props = {
  products: ProductWithMeta[];
  categories: Category[];
  brands: { id: number; slug: string; name: string }[];
  initialQuery?: string;
  initialCategory?: string;
  initialBrand?: string;
  initialSort?: string;
};

const SORTS = [
  { value: "featured", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

const GROUPS = [
  { value: "all", label: "All ranges" },
  { value: "pharma", label: "Pharmaceuticals" },
  { value: "consumables", label: "Medical consumables" },
  { value: "glovx", label: "Glov-X" },
];

export function CatalogueBrowser({
  products,
  categories,
  brands,
  initialQuery = "",
  initialCategory = "",
  initialBrand = "",
  initialSort = "featured",
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [categorySlug, setCategorySlug] = useState(initialCategory);
  const [brandSlug, setBrandSlug] = useState(initialBrand);
  const [group, setGroup] = useState("all");
  const [application, setApplication] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sort, setSort] = useState(initialSort);
  const [maxPrice, setMaxPrice] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const topCategories = categories.filter((category) => !category.parentId);
  const applications = useMemo(
    () => [...new Set(products.flatMap((product) => product.applications ?? []))].sort(),
    [products],
  );
  const priceCeiling = useMemo(
    () => Math.ceil(Math.max(...products.map((product) => product.basePrice), 100)),
    [products],
  );

  const categorySlugs = useMemo(() => {
    if (!categorySlug) return null;
    const selected = categories.find((category) => category.slug === categorySlug);
    if (!selected) return new Set([categorySlug]);
    const children = categories.filter((category) => category.parentId === selected.id);
    return new Set([selected.slug, ...children.map((child) => child.slug)]);
  }, [categorySlug, categories]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const terms = term.split(/\s+/).filter(Boolean);
    let list = products.filter((product) => {
      if (group !== "all" && product.categoryGroup !== group) return false;
      if (brandSlug && product.brandSlug !== brandSlug) return false;
      if (categorySlugs) {
        const matchesCategory =
          (product.categorySlug && categorySlugs.has(product.categorySlug)) ||
          (product.parentCategorySlug && categorySlugs.has(product.parentCategorySlug)) ||
          (product.categoryGroup === "glovx" && categorySlugs.has("glov-x-range"));
        if (!matchesCategory) return false;
      }
      if (application !== "all" && !(product.applications ?? []).includes(application)) return false;
      if (availabilityFilter === "in" && product.stockQuantity <= product.lowStockThreshold) return false;
      if (availabilityFilter === "limited" && (product.stockQuantity <= 0 || product.stockQuantity > product.lowStockThreshold)) return false;
      if (availabilityFilter === "out" && product.stockQuantity > 0) return false;
      if (maxPrice > 0 && product.basePrice > maxPrice) return false;
      if (terms.length > 0) {
        const haystack = [
          product.name,
          product.sku,
          product.brandName,
          product.categoryName,
          product.parentCategoryName,
          product.subcategory,
          product.shortDescription,
          product.description,
          product.weight,
          product.packSize,
          ...(product.applications ?? []),
          ...Object.entries(product.specifications ?? {}).flatMap(([key, value]) => [key, value]),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!terms.every((word) => haystack.includes(word))) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.basePrice - b.basePrice;
      if (sort === "price-desc") return b.basePrice - a.basePrice;
      if (sort === "name") return a.name.localeCompare(b.name);
      return Number(b.isFeatured) - Number(a.isFeatured) || Number(b.isBestSeller) - Number(a.isBestSeller) || a.name.localeCompare(b.name);
    });
    return list;
  }, [products, query, group, brandSlug, categorySlugs, application, availabilityFilter, maxPrice, sort]);

  const activeFilters =
    (categorySlug ? 1 : 0) +
    (brandSlug ? 1 : 0) +
    (group !== "all" ? 1 : 0) +
    (application !== "all" ? 1 : 0) +
    (availabilityFilter !== "all" ? 1 : 0) +
    (maxPrice > 0 ? 1 : 0) +
    (query ? 1 : 0);

  const reset = () => {
    setQuery("");
    setCategorySlug("");
    setBrandSlug("");
    setGroup("all");
    setApplication("all");
    setAvailabilityFilter("all");
    setMaxPrice(0);
    setSort("featured");
  };

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <p className="label">Search catalogue</p>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, SKU, brand, spec…"
          className="field"
          aria-label="Search products"
        />
        <p className="mt-1.5 text-[10.5px] text-navy-400">Try “nitrile”, “3 gram”, “glov-x” or a SKU.</p>
      </div>

      <div>
        <p className="label">Product range</p>
        <div className="flex flex-wrap gap-1.5">
          {GROUPS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setGroup(option.value)}
              className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition ${
                group === option.value ? "bg-navy-900 text-white" : "border border-navy-100 bg-white text-navy-500 hover:border-navy-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label">Category</p>
        <select className="field" value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {topCategories.map((category) => (
            <optgroup key={category.id} label={category.name}>
              <option value={category.slug}>{category.name} (all)</option>
              {categories
                .filter((child) => child.parentId === category.id)
                .map((child) => (
                  <option key={child.id} value={child.slug}>{child.name}</option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <p className="label">Brand</p>
        <select className="field" value={brandSlug} onChange={(event) => setBrandSlug(event.target.value)} aria-label="Filter by brand">
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.slug}>{brand.name}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="label">Application</p>
        <select className="field" value={application} onChange={(event) => setApplication(event.target.value)} aria-label="Filter by application">
          <option value="">All applications</option>
          {applications.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="label">Availability</p>
        <select className="field" value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value)} aria-label="Filter by availability">
          <option value="all">Any availability</option>
          <option value="in">In stock</option>
          <option value="limited">Limited stock</option>
          <option value="out">Out of stock</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="label !mb-0">Base price up to</p>
          <span className="text-[11px] font-semibold text-navy-700">{maxPrice > 0 ? inr(maxPrice) : "Any"}</span>
        </div>
        <input
          type="range"
          min={0}
          max={priceCeiling}
          step={1}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="mt-2 w-full accent-brand-600"
          aria-label="Maximum base price"
        />
      </div>

      <button type="button" onClick={reset} className="btn btn-ghost w-full !py-2 !text-[12px]">
        Reset filters {activeFilters > 0 ? `(${activeFilters})` : ""}
      </button>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[16.5rem_1fr]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="mb-3 flex items-center justify-between lg:hidden">
          <button type="button" onClick={() => setFiltersOpen((open) => !open)} className="btn btn-ghost !py-2 !text-[12px]">
            {filtersOpen ? "Hide filters" : "Show filters"} {activeFilters > 0 ? `(${activeFilters})` : ""}
          </button>
        </div>
        <div className={`card p-5 ${filtersOpen ? "block" : "hidden lg:block"}`}>{filterPanel}</div>
        <div className="mt-4 rounded-2xl border border-navy-100 bg-navy-50/60 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy-400">Need a bulk quote?</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-navy-500">
            Send us your product list and quantity for a written commercial offer.
          </p>
          <a href="/bulk-orders" className="btn btn-primary mt-3 w-full !py-2 !text-[12px]">Request Quote</a>
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3">
          <p className="text-[12.5px] text-navy-500">
            <span className="font-semibold text-navy-900">{results.length}</span> products
            {query ? <> matching “<span className="font-medium text-navy-800">{query}</span>”</> : null}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-[11.5px] font-medium text-navy-400">Sort</label>
            <select id="sort" value={sort} onChange={(event) => setSort(event.target.value)} className="field !w-auto !py-1.5 !text-[12px]">
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-navy-200 bg-navy-50/50 p-10 text-center">
            <h3 className="text-[15px] font-bold text-navy-900">No products matched your filters</h3>
            <p className="mx-auto mt-2 max-w-md text-[12.5px] text-navy-500">
              Try a different keyword or reset the filters. If you are looking for a specific SKU that
              is not listed, send a product enquiry and we will confirm sourcing.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={reset} className="btn btn-primary !py-2 !text-[12px]">Reset filters</button>
              <a href="/bulk-orders" className="btn btn-ghost !py-2 !text-[12px]">Request a product</a>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
