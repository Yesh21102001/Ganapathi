import Link from "next/link";
import Image from "next/image";
import { kids, kidsBrands, kidsImages } from "@/lib/site";
import { placeholderColors } from "@/components/CategoryCard";

export default function KidsSection({
  collections,
}: {
  collections: { handle: string; image?: { url: string; altText: string | null } | null }[];
}) {
  const byHandle = new Map(collections.map((c) => [c.handle, c]));
  const items = kids.filter((k) => byHandle.has(k.handle));
  if (items.length === 0) return null;

  return (
    <section className="bg-[#FBF7F1]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <h2 data-reveal="fade" className="font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">For kids</h2>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {items.map((k, i) => (
            <li key={k.handle} data-reveal="slide">
              <Link
                href={`/collections/${k.handle}`}
                className="flex h-full flex-col gap-3 rounded-sm border border-[#EADFD2] bg-white p-2.5 transition duration-700 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:gap-5 sm:p-3.5"
              >
                <div
                  className="relative aspect-square w-full shrink-0 overflow-hidden rounded-sm sm:h-24 sm:w-24"
                  style={{ backgroundColor: placeholderColors[i % placeholderColors.length] }}
                >
                  {(kidsImages[k.handle] ?? byHandle.get(k.handle)?.image?.url) && (
                    <Image
                      src={(kidsImages[k.handle] ?? byHandle.get(k.handle)?.image?.url)!}
                      alt={k.label}
                      fill
                      sizes="(min-width: 640px) 96px, 50vw"
                      className="object-cover object-top"
                    />
                  )}
                </div>
                <h3 className="px-0.5 font-serif text-lg font-medium leading-tight text-[#2A1A14] sm:px-0 sm:text-2xl">{k.label}</h3>
              </Link>
            </li>
          ))}
        </ul>

        <div data-reveal="fade" className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#EADFD2] pt-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B4F43]">
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
