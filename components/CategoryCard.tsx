import Link from "next/link";
import Image from "next/image";

export const placeholderColors = ["#EADBC8", "#E4D2BD", "#F0E4D4", "#E8DCCF"];

export default function CategoryCard({
  title,
  href,
  blurb,
  imageUrl,
  index = 0,
}: {
  title: string;
  href: string;
  blurb?: string;
  imageUrl?: string | null;
  index?: number;
}) {
  return (
    <Link
      href={href}
      data-reveal="slide"
      className="group block rounded-sm border border-[#EADFD2] bg-white p-2 transition duration-300 sm:p-3 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className="relative aspect-square overflow-hidden rounded-sm"
        style={{ backgroundColor: placeholderColors[index % placeholderColors.length] }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 px-1 sm:mt-5">
        <h3 className="font-serif text-lg font-medium leading-tight text-[#2A1A14] sm:text-2xl">{title}</h3>
        <svg
          className="h-4 w-4 shrink-0 text-[#2A1A14] transition-transform group-hover:translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </div>

      {blurb && (
        <p className="mt-3 px-1 pb-1 text-sm leading-relaxed text-[#6B4F43]">{blurb}</p>
      )}
    </Link>
  );
}
