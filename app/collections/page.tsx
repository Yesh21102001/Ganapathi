import type { Metadata } from "next";
import { getCollectionPreviews, safe } from "@/lib/shopify";
import CollectionTabs, { type Tab, type TabGroup, type TabItem } from "@/components/CollectionTabs";
import PageHero from "@/components/PageHero";
import { categoryTree, collectionImages, shopByCollection } from "@/lib/site";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const collections = await safe(getCollectionPreviews(), []);
  const byHandle = new Map(collections.map((c) => [c.handle, c]));

  const toItem = (handle: string): TabItem | null => {
    const c = byHandle.get(handle);
    if (!c) return null;
    return {
      handle,
      title: c.title,
      imageUrl: collectionImages[handle] ?? c.image?.url ?? c.products.nodes[0]?.featuredImage?.url ?? null,
    };
  };
  const items = (handles: string[]) => handles.map(toItem).filter((i): i is TabItem => i !== null);

  // One tab per top-level category. Plain sub-categories come first as one group;
  // sub-categories that have their own children (Girls, Boys, Bedroom...) get a titled group each.
  const tabs: Tab[] = shopByCollection.flatMap((entry) => {
    const node = categoryTree.find((n) => n.handle === entry.handle);
    if (!node?.children) return [];
    const groups: TabGroup[] = [];
    const plain = items(node.children.filter((c) => !c.children).map((c) => c.handle));
    if (plain.length) groups.push({ items: plain });
    for (const child of node.children.filter((c) => c.children)) {
      const inner = items(child.children!.map((c) => c.handle));
      if (inner.length) {
        groups.push({
          title: byHandle.get(child.handle)?.title ?? child.handle,
          items: inner,
        });
      }
    }
    return groups.length ? [{ handle: entry.handle, title: entry.title, groups }] : [];
  });

  return (
    <>
      <PageHero
        centered
        title="Collections"
        eyebrow="Browse by category"
        description="Pick a category to see everything inside it."
        crumbs={[{ label: "Collections" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {tabs.length > 0 ? (
          <CollectionTabs tabs={tabs} />
        ) : (
          <p className="rounded-sm border border-dashed border-[#D9C9B6] p-12 text-center text-[#6B4F43]">
            No collections are available right now.
          </p>
        )}
      </section>
    </>
  );
}
