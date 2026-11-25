import Link from "next/link";
import type { ShopifyCollection } from "@/types/shopify";

/** Pill row for hopping between all products and each collection. */
export default function CollectionTabs({
  collections,
  active,
}: {
  collections: ShopifyCollection[];
  active?: string;
}) {
  const pill = (on: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${
      on
        ? "border-[#7B1E2B] bg-[#7B1E2B] text-white"
        : "border-[#2A1A14]/25 text-[#2A1A14] hover:border-[#2A1A14]"
    }`;
  return (
    <nav aria-label="Collections" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-2">
        <li>
          <Link href="/products" className={pill(!active)} aria-current={!active ? "page" : undefined}>
            All products
          </Link>
        </li>
        {collections.map((c) => (
          <li key={c.handle}>
            <Link
              href={`/collections/${c.handle}`}
              className={pill(active === c.handle)}
              aria-current={active === c.handle ? "page" : undefined}
            >
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
