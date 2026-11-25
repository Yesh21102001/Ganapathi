import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCollectionByHandle, safe } from "@/lib/shopify";
import CollectionFilters from "@/components/CollectionFilters";
import PageHero from "@/components/PageHero";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await safe(getCollectionByHandle(handle), null);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.title,
    description: collection.description?.slice(0, 160) || undefined,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle); // a real API failure should hit the error boundary, not look like a 404
  if (!collection) notFound();

  return (
    <>
      <PageHero
        centered
        title={collection.title}
        eyebrow="Collection"
        description={collection.description || undefined}
        crumbs={[{ label: "Collections", href: "/collections" }, { label: collection.title }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <CollectionFilters products={collection.products.nodes} />
      </section>
    </>
  );
}
