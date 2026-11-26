"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { reviews } from "@/lib/site";

export default function Reviews() {
  const track = useRef<HTMLUListElement>(null);
  if (reviews.length === 0) return null;

  const scrollByPage = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="bg-[#F3EADF]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E2B]">Reviews</p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">
              What our customers say
            </h2>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              aria-label="Previous reviews"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9C9B6] bg-white text-[#2A1A14] transition hover:bg-[#FBF7F1]"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              aria-label="Next reviews"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9C9B6] bg-white text-[#2A1A14] transition hover:bg-[#FBF7F1]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <ul
          ref={track}
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((r, i) => (
            <li
              key={i}
              className="flex w-full shrink-0 snap-start flex-col rounded-md border border-[#EADFD2] bg-white p-7 md:w-[calc((100%-2.5rem)/3)] sm:w-[calc((100%-1.25rem)/2)]"
            >
              <div className="flex gap-0.5 text-[#C9962B]" role="img" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={18} fill={s < r.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-[#4A362D]">“{r.text}”</blockquote>
              <p className="mt-6 text-sm font-semibold text-[#2A1A14]">
                {r.name}
                {r.location && <span className="font-normal text-[#6B4F43]"> · {r.location}</span>}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
