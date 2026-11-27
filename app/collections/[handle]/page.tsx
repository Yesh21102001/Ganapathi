import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCollectionByHandle, getCollectionPreviews, safe } from "@/lib/shopify";
import CollectionFilters from "@/components/CollectionFilters";
import PageHero from "@/components/PageHero";
import { categoryPath, shopByCollection } from "@/lib/site";

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

  // Where this collection sits in the category tree (Kids > Girls > Frocks ...), for the breadcrumb.
  const path = categoryPath(handle);
  const titleFor = (h: string, fallback: string) => shopByCollection.find((s) => s.handle === h)?.title ?? fallback;
  const title = titleFor(handle, collection.title);

  // Titles of parent categories, for the breadcrumb (only needed on nested pages).
  const ancestors = path && path.length > 1 ? await safe(getCollectionPreviews(), []) : [];
  const byHandle = new Map(ancestors.map((c) => [c.handle, c]));

  const crumbs = [
    { label: "Collections", href: "/collections" },
    ...(path ?? []).slice(0, -1).map((n) => ({
      label: titleFor(n.handle, byHandle.get(n.handle)?.title ?? n.handle),
      href: `/collections/${n.handle}`,
    })),
    { label: title },
  ];

  return (
    <>
      <PageHero
        centered
        title={title}
        eyebrow="Collection"
        description={collection.description || undefined}
        crumbs={crumbs}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <CollectionFilters products={collection.products.nodes} />
      </section>
    </>
  );
}
