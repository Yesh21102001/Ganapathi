import Link from "next/link";
import Image from "next/image";
import { getCollections, getProducts, safe } from "@/lib/shopify";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import KidsSection from "@/components/KidsSection";
import Reviews from "@/components/Reviews";
import HelpBand from "@/components/HelpBand";
import HeroCollage from "@/components/HeroCollage";
import { collectionImages, homeCollections, priorityHandles } from "@/lib/site";
import type { ShopifyProduct } from "@/types/shopify";

function Section({
  title,
  href,
  products,
}: {
  title: string;
  href: string;
  products: ShopifyProduct[];
}) {
  if (products.length === 0) return null;
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">{title}</h2>
          <Link href={href} className="shrink-0 text-sm font-medium text-[#7B1E2B] hover:underline">
            View all
          </Link>
        </div>
        {/* Phones and tablets: swipeable slider showing 2.3 cards. Desktop: 4-up grid. */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-pl-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-5 lg:gap-y-8 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {products.slice(0, 8).map((product, i) => (
            <div
              key={product.id}
              className={`w-[calc((100%-2rem)/2.3)] shrink-0 snap-start sm:w-[calc((100%-2rem)/3.3)] lg:w-auto ${
                i >= 4 ? "lg:hidden" : ""
              }`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function heroImage(p?: ShopifyProduct) {
  return p?.featuredImage?.url ? { src: p.featuredImage.url, alt: p.featuredImage.altText || p.title } : null;
}

export default async function Home() {
  const [collections, newest, bestSelling] = await Promise.all([
    safe(getCollections(), []),
    safe(getProducts(8, "CREATED_AT"), []),
    safe(getProducts(8, "BEST_SELLING"), []),
  ]);

  const rank = (h: string) => {
    const i = priorityHandles.indexOf(h);
    return i === -1 ? priorityHandles.length : i;
  };
  const shopCollections = collections
    .filter((c) => priorityHandles.includes(c.handle))
    .sort((a, b) => rank(a.handle) - rank(b.handle));
  const shopHandles = new Set(collections.map((c) => c.handle));
  const homeChips = homeCollections.filter((c) => shopHandles.has(c.handle));
  const nothingLoaded = collections.length === 0 && newest.length === 0;

  return (
    <>
      {/* HERO */}
      <HeroCollage
        title="Clothing and Home Textiles for the Whole Family"
        images={{
          a: { src: "/images/Contemplative Teal Shirt Portrait.png", alt: "Woman wearing an elegant purple saree" },
          b: { src: "/images/Burnt Orange Geometric Bedding in a Sunlit Bedroom.png", alt: "Burnt orange geometric bedding" },
          c: { src: "/images/Smiling Boy in Blue and White Outfit.png", alt: "Man wearing a rust coloured shirt" },
          center: { src: "/images/Elegant Purple Saree Portrait.png", alt: "Stacked terry towels in warm tones" },
          d: heroImage(newest[0]),
          e: heroImage(newest[1]),
          f: heroImage(newest[2]),
        }}
      />

      {nothingLoaded && (
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="font-serif text-3xl text-[#2A1A14]">We could not load the catalogue</h2>
          <p className="mt-3 text-[#6B4F43]">
            The store is not responding right now. Please try again in a moment.
          </p>
        </div>
      )}

      {/* COLLECTIONS, straight from Shopify */}
      {shopCollections.length > 0 && (
        <section className="bg-[#F3EADF]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">
                Shop by collection
              </h2>
              <Link href="/collections" className="shrink-0 text-sm font-medium text-[#7B1E2B] hover:underline">
                All collections
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {shopCollections.slice(0, 4).map((collection, index) => (
                <CategoryCard
                  key={collection.id}
                  index={index}
                  title={collection.title}
                  blurb={collection.description}
                  href={`/collections/${collection.handle}`}
                  imageUrl={collectionImages[collection.handle] ?? collection.image?.url ?? null}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Section title="New arrivals" href="/collections/new-arrivals" products={newest} />

      {/* FEATURE BANNER */}
      <section className="bg-[#7B1E2B]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#A24B54]">
            <Image
              src="/images/Elegant Taupe Striped Bedroom Retreat.png"
              alt="Stacked terry towels in rust and brown tones"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F2D9A0]">
              Home · Textiles
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[#FBF7F1] sm:text-4xl">
              Home Essentials
            </h2>
            {homeChips.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {homeChips.map((c) => (
                  <Link
                    key={c.handle}
                    href={`/collections/${c.handle}`}
                    className="rounded-full border border-[#FBF7F1]/40 px-3.5 py-1.5 text-xs text-[#FBF7F1] transition hover:bg-[#FBF7F1]/10"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
            <Link
              href="/collections/home-essentials"
              className="mt-8 inline-block rounded-md bg-[#FBF7F1] px-6 py-3.5 text-sm font-semibold text-[#2A1A14] transition hover:bg-white"
            >
              Shop home essentials
            </Link>
          </div>
        </div>
      </section>

      <Section title="Best sellers" href="/collections/best-sellers" products={bestSelling} />

      <Reviews />
      <KidsSection collections={collections} />
      <HelpBand />
      
    </>
  );
}
