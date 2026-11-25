import Link from "next/link";
import type { ShopifyProduct } from "@/types/shopify";
import ProductCard from "@/components/ProductCard";

export type SortKey = "featured" | "price-asc" | "price-desc";

const sorts: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

const price = (p: ShopifyProduct) => Number(p.priceRange.minVariantPrice.amount);

/** Server-rendered grid with product-type filter chips and sort links, driven by ?type= and ?sort=. */
export default function ProductListing({
  basePath,
  products,
  type,
  sort,
}: {
  basePath: string;
  products: ShopifyProduct[];
  type?: string;
  sort: SortKey;
}) {
  const types = [...new Set(products.map((p) => p.productType).filter(Boolean))] as string[];
  const slug = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const activeType = types.find((t) => slug(t) === type);

  let shown = activeType ? products.filter((p) => p.productType === activeType) : products;
  if (sort === "price-asc") shown = [...shown].sort((a, b) => price(a) - price(b));
  if (sort === "price-desc") shown = [...shown].sort((a, b) => price(b) - price(a));

  const href = (t?: string, s: SortKey = sort) => {
    const q = new URLSearchParams();
    if (t) q.set("type", t);
    if (s !== "featured") q.set("sort", s);
    const str = q.toString();
    return str ? `${basePath}?${str}` : basePath;
  };

  const chip = (on: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition ${
      on
        ? "border-[#7B1E2B] bg-[#7B1E2B] text-white"
        : "border-[#2A1A14]/25 text-[#2A1A14] hover:border-[#2A1A14]"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {types.length > 1 ? (
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href={href(undefined)} className={chip(!activeType)}>All</Link>
            </li>
            {types.map((t) => (
              <li key={t}>
                <Link href={href(slug(t))} className={chip(activeType === t)}>{t}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-2 text-sm text-[#6B4F43]">
          <span>Sort:</span>
          {sorts.map((s) => (
            <Link
              key={s.key}
              href={href(activeType ? slug(activeType) : undefined, s.key)}
              className={sort === s.key ? "font-semibold text-[#7B1E2B]" : "hover:text-[#2A1A14]"}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-[#6B4F43]">
        {shown.length} {shown.length === 1 ? "product" : "products"}
      </p>

      {shown.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-5 lg:grid-cols-4">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-md border border-dashed border-[#D9C9B6] p-12 text-center text-[#6B4F43]">
          No products found here yet.
        </div>
      )}
    </div>
  );
}
