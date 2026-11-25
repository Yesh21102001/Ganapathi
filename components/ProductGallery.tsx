import Image from "next/image";
import type { ShopifyImage } from "@/types/shopify";

/** Desktop: two-column grid of every image. Mobile: swipeable snap carousel. */
export default function ProductGallery({
  images,
  title,
}: {
  images: ShopifyImage[];
  title: string;
}) {
  if (images.length === 0) {
    return <div className="aspect-[3/4] rounded-sm bg-[#EADBC8]" />;
  }

  return (
    <ul className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-2 lg:content-start lg:gap-3 lg:overflow-visible">
      {images.map((img, i) => (
        <li
          key={img.url}
          className={`relative aspect-[3/4] w-[85%] shrink-0 snap-center overflow-hidden rounded-sm border border-[#2A1A14]/10 bg-[#EADBC8] sm:w-[60%] lg:w-auto ${
            // A lone image spans the full width of the grid.
            images.length === 1 ? "lg:col-span-2" : ""
          }`}
        >
          <Image
            src={img.url}
            alt={img.altText || `${title} – image ${i + 1}`}
            fill
            priority={i < 2}
            sizes="(min-width: 1024px) 30vw, 85vw"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}
