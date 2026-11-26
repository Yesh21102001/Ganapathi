import Link from "next/link";
import Image from "next/image";
import { getCollections, getProducts, safe } from "@/lib/shopify";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import KidsSection from "@/components/KidsSection";
import Reviews from "@/components/Reviews";
import { priorityHandles, site } from "@/lib/site";
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-5 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
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
  const shopCollections = [...collections].sort((a, b) => rank(a.handle) - rank(b.handle));
  const featured = collections.find((c) => c.image?.url) ?? null;
  const nothingLoaded = collections.length === 0 && newest.length === 0;

  return (
    <>
      {/* HERO */}
      <section className="bg-[#FCF8F3]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E2B]">
              {site.tagline}
            </p>
            <h1 className="font-serif text-4xl font-medium leading-[1.1] text-[#2A1A14] sm:text-5xl lg:text-6xl">
              Sarees, ethnic wear and everyday essentials, all in one store
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#6B4F43]">
              From festive sarees and lehengas to everyday shirts, kids wear and home textiles.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-md bg-[#7B1E2B] px-6 py-3.5 font-semibold text-white transition hover:bg-[#611722]"
              >
                Explore Products
              </Link>
            </div>
          </div>

          <div className="grid h-[420px] grid-cols-2 grid-rows-2 gap-3 sm:h-[520px]">
            <div className="relative row-span-2 overflow-hidden rounded-md bg-[#EADBC8]">
              <Image
                src="/images/Elegant Purple Saree Portrait.png"
                alt="Woman wearing an elegant purple saree"
                fill
                priority
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div className="relative overflow-hidden rounded-md bg-[#E4D2BD]">
              <Image
                src="/images/Rust Shirt Editorial Portrait.png"
                alt="Man wearing a rust coloured shirt"
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div className="relative overflow-hidden rounded-md bg-[#F0E4D4]">
              <Image
                src="/images/Burnt Orange Geometric Bedding in a Sunlit Bedroom.png"
                alt="Burnt orange geometric bedding in a sunlit bedroom"
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {shopCollections.slice(0, 4).map((collection, index) => (
                <CategoryCard
                  key={collection.id}
                  index={index}
                  title={collection.title}
                  blurb={collection.description}
                  href={`/collections/${collection.handle}`}
                  imageUrl={collection.image?.url ?? null}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Section title="New arrivals" href="/collections/new-arrivals" products={newest} />

      {/* FEATURE BANNER */}
      {featured && (
        <section className="bg-[#7B1E2B]">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#A24B54]">
              <Image
                src={featured.image!.url}
                alt={featured.image!.altText || featured.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F2D9A0]">
                Featured collection
              </p>
              <h2 className="mt-3 font-serif text-3xl font-medium text-[#FBF7F1] sm:text-4xl">
                {featured.title}
              </h2>
              {featured.description && (
                <p className="mt-4 max-w-md text-[#FBF7F1]/90">{featured.description}</p>
              )}
              <Link
                href={`/collections/${featured.handle}`}
                className="mt-8 inline-block rounded-md bg-[#FBF7F1] px-6 py-3.5 text-sm font-semibold text-[#2A1A14] transition hover:bg-white"
              >
                Explore {featured.title}
              </Link>
            </div>
          </div>
        </section>
      )}



      <Section title="Best sellers" href="/collections/best-sellers" products={bestSelling} />

      <Reviews />
      <KidsSection hasKidsCollection={collections.some((c) => c.handle === "kids")} />
      
    </>
  );
}
