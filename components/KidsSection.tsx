import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { kids, kidsImages } from "@/lib/site";
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
          {items.map((k, i) => {
            const src = kidsImages[k.handle] ?? byHandle.get(k.handle)?.image?.url;
            return (
              <li key={k.handle} data-reveal="zoom">
                <Link
                  href={`/collections/${k.handle}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-sm transition duration-700 hover:-translate-y-1 hover:shadow-xl"
                  style={{ backgroundColor: placeholderColors[i % placeholderColors.length] }}
                >
                  {src && (
                    <Image
                      src={src}
                      alt={k.label}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover object-top transition duration-[1400ms] group-hover:scale-105"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2A1A14]/75 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4 text-white sm:p-5">
                    <h3 className="font-serif text-xl font-medium leading-tight sm:text-2xl">{k.label}</h3>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#2A1A14] transition duration-500 group-hover:translate-x-1 group-hover:bg-white">
                      <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
