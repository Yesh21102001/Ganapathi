import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description: `${site.name} is a wholesale supplier of clothing and home textiles for retailers, boutiques and bulk buyers.`,
};

const categories = [
  { title: "Women", text: "Sarees, lehengas, kurtis and festive wear.", href: "/collections/women", img: "/images/Elegant Ivory-and-Gold Lehenga Portrait.png" },
  { title: "Men", text: "Shirts, tees and everyday essentials.", href: "/collections/men", img: "/images/Contemplative Teal Shirt Portrait.png" },
  { title: "Kids", text: "Ethnic and casual wear for boys and girls.", href: "/collections/kids", img: "/images/Smiling Girl in Blue Striped Dress.png" },
  { title: "Home Essentials", text: "Bedsheets, towels and bedding sets.", href: "/collections/home-essentials", img: "/images/Burnt Orange Geometric Bedding in a Sunlit Bedroom.png" },
];

const strengths = [
  { title: "One supplier, whole family", text: "Women, men, kids and home textiles from a single source, so you consolidate orders instead of juggling vendors." },
  { title: "Fabric-first sourcing", text: "Cotton, silk cotton, organza and more, selected for how they wear, wash and last on your shelves." },
  { title: "Bulk-friendly ordering", text: "Order by size set or full range. Tell us your quantities and we will quote against your requirement." },
  { title: "Direct communication", text: "Talk to us directly on phone or WhatsApp for samples, pricing and availability. No middle layers." },
];

const steps = [
  { n: "01", title: "Share your requirement", text: "Tell us the categories, styles and approximate quantities you are looking for." },
  { n: "02", title: "Get a quote and samples", text: "We respond with pricing, availability and fabric details, and arrange samples where needed." },
  { n: "03", title: "Confirm and dispatch", text: "Confirm the order, and we pack and dispatch it to your location." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Us"
        centered
        eyebrow="Wholesale & bulk supply"
        crumbs={[{ label: "About us" }]}
      />

      {/* Who we are */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#EADBC8]">
          <Image
            src="/images/Elegant Purple Saree Portrait.png"
            alt="Saree from the Ganapati Vastram range"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E2B]">Who we are</p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">
            Welcome to Ganapati Industries
          </h2>
          <div className="mt-5 space-y-4 leading-relaxed text-[#6B4F43]">
            <p>
              A trusted name committed to quality, reliability, and customer satisfaction.
            </p>
            <p>
              At Ganapati Industries, we believe in delivering products that meet high standards of
              excellence. Our focus is on providing durable, dependable, and value-driven products to
              our customers. We continuously work to improve our processes and services to ensure
              consistent quality and timely delivery.
            </p>
            <p>
              Customer trust is at the heart of everything we do. We aim to build long-term
              relationships by maintaining transparency, ethical business practices, and responsive
              support. Our team is dedicated to understanding customer needs and offering solutions
              that add real value.
            </p>
            <p>
              With a strong commitment to quality and continuous improvement, Ganapati Industries
              strives to grow while serving customers with integrity and professionalism.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-8 inline-block text-sm font-semibold text-[#7B1E2B] underline-offset-4 hover:underline"
          >
            Browse the catalogue →
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#F3EADF]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E2B]">What we supply</p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">
              Four categories, one order
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {categories.map((c) => (
              <Link key={c.title} href={c.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#EADBC8]">
                  <Image
                    src={c.img}
                    alt={c.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 font-serif text-xl font-medium text-[#2A1A14]">{c.title}</h3>
                <p className="mt-1 text-sm text-[#6B4F43]">{c.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E2B]">Why buyers work with us</p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">
            Built for repeat business
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {strengths.map((s) => (
            <div key={s.title} className="rounded-sm border border-[#EADFD2] bg-white p-7">
              <h3 className="font-serif text-2xl font-medium text-[#2A1A14]">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6B4F43]">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#F3EADF] text-[#2A1A14]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E2B]">How it works</p>
          <h2 className="mt-3 font-serif text-3xl font-medium sm:text-4xl">Ordering in three steps</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="border-t border-[#2A1A14]/20 pt-5">
                <span className="font-serif text-4xl text-[#7B1E2B]">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B4F43]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-sm bg-[#7B1E2B] px-6 py-12 text-center text-white sm:px-12">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-medium sm:text-4xl">
            Planning a bulk order or stocking a new store?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Send us your requirement and we will respond with pricing and availability.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-sm bg-[#FBF7F1] px-6 py-3.5 text-sm font-semibold text-[#2A1A14] transition hover:bg-white"
            >
              Request a quote
            </Link>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="rounded-sm border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Call {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
