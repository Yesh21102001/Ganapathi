import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCollectionByHandle, getCollectionPreviews, safe } from "@/lib/shopify";
import CategoryCard from "@/components/CategoryCard";
import CollectionFilters from "@/components/CollectionFilters";
import PageHero from "@/components/PageHero";
import { categoryPath, collectionImages, shopByCollection } from "@/lib/site";

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

  // Where this collection sits in the category tree (Kids > Girls > Frocks ...), for breadcrumbs and sub-categories.
  const path = categoryPath(handle);
  const node = path?.[path.length - 1];
  const titleFor = (h: string, fallback: string) => shopByCollection.find((s) => s.handle === h)?.title ?? fallback;
  const title = titleFor(handle, collection.title);

  const previews = path ? await safe(getCollectionPreviews(), []) : [];
  const byHandle = new Map(previews.map((c) => [c.handle, c]));
  const subs = (node?.children ?? []).flatMap((child) => {
    const c = byHandle.get(child.handle);
    return c ? [c] : [];
  });

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
        eyebrow={node?.children ? "Browse by category" : "Collection"}
        description={collection.description || undefined}
        crumbs={crumbs}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        {node?.children ? (
          subs.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {subs.map((c, i) => (
                <CategoryCard
                  key={c.id}
                  index={i}
                  title={c.title}
                  href={`/collections/${c.handle}`}
                  imageUrl={collectionImages[c.handle] ?? c.image?.url ?? c.products.nodes[0]?.featuredImage?.url ?? null}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-sm border border-dashed border-[#D9C9B6] p-12 text-center text-[#6B4F43]">
              No sub-categories are available right now.
            </p>
          )
        ) : (
          <CollectionFilters products={collection.products.nodes} />
        )}
      </section>
    </>
  );
}
