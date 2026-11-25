import Link from "next/link";
import { kids, kidsBrands } from "@/lib/site";
import { placeholderColors } from "@/components/CategoryCard";

export default function KidsSection({ hasKidsCollection }: { hasKidsCollection: boolean }) {
  // Link to the Shopify "kids" collection when it exists, otherwise to the full catalogue.
  const href = hasKidsCollection ? "/collections/kids" : "/products";

  return (
    <section className="bg-[#FBF7F1]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <h2 className="font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">For kids</h2>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kids.map((k, i) => (
            <li key={k.key}>
              <Link
                href={href}
                className="flex h-full items-center gap-5 rounded-md border border-[#EADFD2] bg-white p-3.5 transition hover:shadow-md"
              >
                <div
                  className="h-24 w-24 shrink-0 rounded-sm"
                  style={{ backgroundColor: placeholderColors[i % placeholderColors.length] }}
                />
                <div>
                  <h3 className="font-serif text-2xl font-medium text-[#2A1A14]">{k.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6B4F43]">{k.blurb}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#EADFD2] pt-8">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B4F43]">
            Kids brands
          </span>
          {kidsBrands.map((b) => (
            <span key={b} className="font-serif text-xl text-[#2A1A14]">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
