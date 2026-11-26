"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { ShopifyImage } from "@/types/shopify";

/**
 * Desktop: vertical thumbnail strip on the left, one large image on the right.
 * Mobile: full-width swipeable carousel with an "n / total" counter.
 */
export default function ProductGallery({
  images,
  title,
}: {
  images: ShopifyImage[];
  title: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-[3/4] bg-[#EADBC8] lg:rounded-2xl" />;
  }

  const alt = (img: ShopifyImage, i: number) => img.altText || `${title} – image ${i + 1}`;

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const active = images[Math.min(index, images.length - 1)];

  return (
    <div className="lg:sticky lg:top-24 lg:grid lg:grid-cols-[72px_minmax(0,1fr)] lg:items-start lg:gap-4">
      {/* Desktop thumbnails */}
      {images.length > 1 && (
        <ul
          className="hidden max-h-[calc(100vh-8rem)] flex-col gap-3 overflow-y-auto p-0.5 [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden"
          aria-label="Product images"
        >
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                onMouseEnter={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className={`relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#EADBC8] transition ${
                  i === index
                    ? "ring-2 ring-[#2A1A14] ring-offset-2 ring-offset-[#FBF7F1]"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt={alt(img, i)} fill sizes="72px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Desktop main image */}
      <div
        className={`relative hidden aspect-[3/4] overflow-hidden rounded-2xl bg-[#EADBC8] lg:block ${
          images.length === 1 ? "lg:col-span-2" : ""
        }`}
      >
        <Image
          key={active.url}
          src={active.url}
          alt={alt(active, index)}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* Mobile carousel */}
      <div className="relative lg:hidden">
        <ul
          ref={track}
          onScroll={onScroll}
          className="-mx-4 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] sm:mx-0 [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <li
              key={img.url}
              className="relative aspect-[3/4] w-full shrink-0 snap-center overflow-hidden bg-[#EADBC8]"
            >
              <Image
                src={img.url}
                alt={alt(img, i)}
                fill
                priority={i < 2}
                sizes="100vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
        {images.length > 1 && (
          <span
            aria-hidden="true"
            className="absolute bottom-3 left-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2A1A14] shadow"
          >
            {index + 1} / {images.length}
          </span>
        )}
      </div>
    </div>
  );
}
