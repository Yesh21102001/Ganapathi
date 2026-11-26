"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import type { ShopifyImage } from "@/types/shopify";

/**
 * One large rounded-sm image with a zoom button and a thumbnail strip.
 * Phones: thumbnails run in a row under the image (swipe the image to change it).
 * Desktop: thumbnails run in a column on the left.
 */
export default function ProductGallery({
  images,
  title,
}: {
  images: ShopifyImage[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const touchX = useRef<number | null>(null);
  const strip = useRef<HTMLUListElement>(null);

  const count = images.length;

  // Keep the selected thumbnail in view when the image changes (swipe or keyboard).
  useEffect(() => {
    // Scroll only the strip itself, never the page.
    const box = strip.current;
    const el = box?.children[index] as HTMLElement | undefined;
    if (!box || !el) return;
    box.scrollTo({
      left: el.offsetLeft - (box.clientWidth - el.clientWidth) / 2,
      top: el.offsetTop - (box.clientHeight - el.clientHeight) / 2,
      behavior: "smooth",
    });
  }, [index]);

  // Lightbox: lock page scroll; Esc closes, arrows change image.
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [zoom, count]);

  if (count === 0) {
    return <div className="aspect-[3/4] rounded-sm bg-[#EADBC8]" />;
  }

  const alt = (img: ShopifyImage, i: number) => img.altText || `${title} – image ${i + 1}`;
  const active = images[Math.min(index, count - 1)];

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    setIndex((i) => (dx < 0 ? Math.min(i + 1, count - 1) : Math.max(i - 1, 0)));
  };

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:grid lg:grid-cols-[72px_minmax(0,1fr)] lg:items-start lg:gap-4">
      {/* Main image */}
      <div
        className={`relative order-1 aspect-[3/4] overflow-hidden rounded-sm bg-[#EADBC8] lg:order-2 ${
          count === 1 ? "lg:col-span-2" : ""
        }`}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={onTouchEnd}
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
        <button
          type="button"
          onClick={() => setZoom(true)}
          aria-label="Zoom image"
          className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2A1A14] shadow-md transition hover:scale-105"
        >
          <ZoomIn size={22} aria-hidden="true" />
        </button>
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <ul
          ref={strip}
          aria-label="Product images"
          className="relative order-2 flex gap-3 overflow-x-auto p-0.5 [scrollbar-width:none] lg:order-1 lg:max-h-[calc(100vh-8rem)] lg:flex-col lg:overflow-y-auto lg:overflow-x-visible [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <li key={img.url} className="w-[68px] shrink-0 lg:w-full">
              <button
                type="button"
                onClick={() => setIndex(i)}
                onMouseEnter={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className={`relative block aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#EADBC8] transition lg:rounded-sm ${
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

      {/* Zoom lightbox */}
      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
          className="fade-in fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoom(false)}
        >
          <button
            type="button"
            onClick={() => setZoom(false)}
            aria-label="Close zoom"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2A1A14]"
          >
            <X size={22} aria-hidden="true" />
          </button>
          <div className="relative h-full w-full max-w-4xl">
            <Image
              src={active.url}
              alt={alt(active, index)}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
