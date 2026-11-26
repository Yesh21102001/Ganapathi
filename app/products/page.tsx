import type { Metadata } from "next";
import { getProducts, safe } from "@/lib/shopify";
import CollectionFilters from "@/components/CollectionFilters";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const products = await safe(getProducts(100), []);

  return (
    <>
      <PageHero
        centered
        title="Products"
        crumbs={[{ label: "Products" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <CollectionFilters products={products} />
      </section>
    </>
  );
}
