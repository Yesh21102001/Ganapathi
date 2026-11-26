import type { Metadata } from "next";
import { getCollections, safe } from "@/lib/shopify";
import CategoryCard from "@/components/CategoryCard";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const collections = await safe(getCollections(), []);

  return (
    <>
      <PageHero
        title="Collections"
        eyebrow="Browse by category"
        description="Every collection in the store, in one place."
        crumbs={[{ label: "Collections" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((c, i) => (
              <CategoryCard
                key={c.id}
                index={i}
                title={c.title}
                blurb={c.description}
                href={`/collections/${c.handle}`}
                imageUrl={c.image?.url ?? null}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-sm border border-dashed border-[#D9C9B6] p-12 text-center text-[#6B4F43]">
            No collections are available right now.
          </p>
        )}
      </section>
    </>
  );
}
