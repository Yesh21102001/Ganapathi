import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPage, safe } from "@/lib/shopify";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About us" };

const pillars = [
  { title: "Everything under one roof", text: "Sarees and lehengas, shirts and tees, kids wear and home textiles, so the whole family can shop in one place." },
  { title: "Fabrics you can feel", text: "Cotton, silk cotton, organza and more, chosen for how they wear and how they last." },
  { title: "Help when you need it", text: "Not sure about a size or a fabric? Send an enquiry and we will get back to you." },
];

export default async function AboutPage() {
  const page = await safe(getPage("about-us"), null);

  return (
    <>
      <PageHero
        title={`About ${site.name}`}
        eyebrow="Our story"
        description={site.tagline + "."}
        crumbs={[{ label: "About us" }]}
      />

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#EADBC8]">
          <Image
            src="/images/Elegant Purple Saree Portrait.png"
            alt="Woman wearing an elegant purple saree"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          {page?.body?.trim() ? (
            // Merchant-authored HTML served by the Shopify Storefront API.
            <div className="shop-prose" dangerouslySetInnerHTML={{ __html: page.body }} />
          ) : (
            <>
              <h2 className="font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">
                Clothing and home textiles for the whole family
              </h2>
              <p className="mt-5 leading-relaxed text-[#6B4F43]">
                {site.name} brings traditional and everyday wear together with home essentials,
                from festive sarees to bedsheets and bath towels, in one store.
              </p>
            </>
          )}
          <Link
            href="/products"
            className="mt-8 inline-block rounded-md bg-[#7B1E2B] px-6 py-3.5 font-semibold text-white transition hover:bg-[#611722]"
          >
            Start shopping
          </Link>
        </div>
      </section>

      <section className="bg-[#F3EADF]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-md border border-[#EADFD2] bg-white p-7">
              <h3 className="font-serif text-2xl font-medium text-[#2A1A14]">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6B4F43]">{p.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
