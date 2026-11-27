"use client";

import { useEffect, useMemo, useState } from "react";
import type { ShopifyProduct } from "@/types/shopify";
import ProductCard from "@/components/ProductCard";

const sizesOf = (p: ShopifyProduct) =>
  (p.options ?? []).filter((o) => o.name.toLowerCase() === "size").flatMap((o) => o.values);
const uniq = (a: (string | undefined)[]) => [...new Set(a.filter(Boolean) as string[])].sort();

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#2A1A14]/10 py-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left font-medium text-[#2A1A14]"
      >
        {title}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function Checks({
  values,
  selected,
  toggle,
  counts,
}: {
  values: string[];
  selected: string[];
  toggle: (v: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <ul className="space-y-2">
      {values.map((v) => (
        <li key={v}>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#2A1A14]">
            <input
              type="checkbox"
              checked={selected.includes(v)}
              onChange={() => toggle(v)}
              className="h-4 w-4 accent-[#7B1E2B]"
            />
            <span className="flex-1">{v}</span>
            <span className="text-xs text-[#6B4F43]">{counts[v] ?? 0}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

export default function CollectionFilters({ products }: { products: ShopifyProduct[] }) {
  const [cats, setCats] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [stock, setStock] = useState<"in" | "out" | null>(null);
  const [drawer, setDrawer] = useState(false);

  // Lock page scroll and allow Esc to close while the mobile drawer is open.
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  const categories = useMemo(() => uniq(products.map((p) => p.productType)), [products]);
  const allSizes = useMemo(() => uniq(products.flatMap(sizesOf)), [products]);
  const vendors = useMemo(() => uniq(products.map((p) => p.vendor)), [products]);

  const count = (f: (p: ShopifyProduct) => string[]) => {
    const c: Record<string, number> = {};
    products.forEach((p) => f(p).forEach((v) => (c[v] = (c[v] ?? 0) + 1)));
    return c;
  };

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) =>
    set((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  const shown = products.filter((p) => {
    if (cats.length && !cats.includes(p.productType ?? "")) return false;
    if (sizes.length && !sizesOf(p).some((s) => sizes.includes(s))) return false;
    if (brands.length && !brands.includes(p.vendor ?? "")) return false;
    if (stock === "in" && p.availableForSale === false) return false;
    if (stock === "out" && p.availableForSale !== false) return false;
    return true;
  });

  const dirty = cats.length || sizes.length || brands.length || stock;
  const reset = () => {
    setCats([]);
    setSizes([]);
    setBrands([]);
    setStock(null);
  };

  const inStock = products.filter((p) => p.availableForSale !== false).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
      {drawer && (
        <div
          className="fade-in fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setDrawer(false)}
          aria-hidden="true"
        />
      )}
      <aside
        aria-label="Filters"
        className={`fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-[#FBF7F1] px-5 pb-6 pt-5 shadow-xl transition-transform duration-500 lg:sticky lg:top-24 lg:z-auto lg:block lg:w-auto lg:max-w-none lg:translate-x-0 lg:self-start lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none ${
          drawer ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 lg:items-baseline">
          <h2 className="font-serif text-3xl font-medium text-[#2A1A14]">Filters</h2>
          <div className="flex items-center gap-4">
            {dirty ? (
              <button type="button" onClick={reset} className="text-sm text-[#7B1E2B] hover:underline">
                Clear all
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label="Close filters"
              className="text-2xl leading-none text-[#2A1A14] lg:hidden"
            >
              ×
            </button>
          </div>
        </div>

        {categories.length > 0 && (
          <Section title="Category">
            <Checks
              values={categories}
              selected={cats}
              toggle={toggle(setCats)}
              counts={count((p) => (p.productType ? [p.productType] : []))}
            />
          </Section>
        )}

        {allSizes.length > 0 && (
          <Section title="Size">
            <div className="flex flex-wrap gap-2">
              {allSizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle(setSizes)(s)}
                  className={`min-w-10 rounded-sm border px-3 py-1.5 text-sm transition ${
                    sizes.includes(s)
                      ? "border-[#7B1E2B] bg-[#7B1E2B] text-white"
                      : "border-[#2A1A14]/25 text-[#2A1A14] hover:border-[#2A1A14]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Section>
        )}

        {vendors.length > 0 && (
          <Section title="Brand">
            <Checks
              values={vendors}
              selected={brands}
              toggle={toggle(setBrands)}
              counts={count((p) => (p.vendor ? [p.vendor] : []))}
            />
          </Section>
        )}

        <Section title="Availability">
          <ul className="space-y-2 text-sm text-[#2A1A14]">
            {(
              [
                ["in", "In stock", inStock],
                ["out", "Out of stock", products.length - inStock],
              ] as const
            ).map(([k, label, n]) => (
              <li key={k}>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={stock === k}
                    onChange={() => setStock(stock === k ? null : k)}
                    className="h-4 w-4 accent-[#7B1E2B]"
                  />
                  <span className="flex-1">{label}</span>
                  <span className="text-xs text-[#6B4F43]">{n}</span>
                </label>
              </li>
            ))}
          </ul>
        </Section>

        <button
          type="button"
          onClick={() => setDrawer(false)}
          className="mt-6 rounded-sm bg-[#7B1E2B] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#611722] hover:shadow-md active:translate-y-0 lg:hidden"
        >
          Show {shown.length} {shown.length === 1 ? "product" : "products"}
        </button>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#6B4F43]">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="flex items-center gap-2 rounded-sm border border-[#2A1A14]/25 px-4 py-1.5 font-medium text-[#2A1A14] lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            Filters{dirty ? " •" : ""}
          </button>
          <p>
            {shown.length} {shown.length === 1 ? "product" : "products"}
          </p>
        </div>

        {shown.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-5">
            {shown.map((p) => (
              <div key={p.id} data-reveal="slide"><ProductCard product={p} /></div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-sm border border-dashed border-[#D9C9B6] p-12 text-center text-[#6B4F43]">
            No products match these filters.
          </div>
        )}
      </div>
    </div>
  );
}
