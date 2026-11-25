import type { Metadata } from "next";
import { getCollections, getProducts, safe } from "@/lib/shopify";
import ProductListing, { type SortKey } from "@/components/ProductListing";
import CollectionTabs from "@/components/CollectionTabs";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "All products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; sort?: string }>;
}) {
  const { type, sort } = await searchParams;
  const [products, collections] = await Promise.all([
    safe(getProducts(100), []),
    safe(getCollections(), []),
  ]);
  const sortKey: SortKey = sort === "price-asc" || sort === "price-desc" ? sort : "featured";

  return (
    <>
      <PageHero
        title="All products"
        eyebrow="The full catalogue"
        description="Browse everything in the store, or jump into a collection."
        crumbs={[{ label: "All products" }]}
      >
        <div className="mt-6">
          <CollectionTabs collections={collections} />
        </div>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <ProductListing basePath="/products" products={products} type={type} sort={sortKey} />
      </section>
    </>
  );
}
