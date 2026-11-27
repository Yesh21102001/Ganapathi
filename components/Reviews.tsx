"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { reviews } from "@/lib/site";

const initial = (name: string) => name.replace(/[^\p{L}]/gu, "").charAt(0).toUpperCase() || "?";

export default function Reviews() {
  const track = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  if (reviews.length === 0) return null;

  const scrollByCard = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * card.getBoundingClientRect().width, behavior: "smooth" });
  };

  // Mouse drag-to-scroll (touch and trackpads already scroll natively).
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { active: true, startX: e.clientX, startScroll: track.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d.active || !track.current) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    if (d.moved) {
      track.current.style.scrollSnapType = "none";
      track.current.style.scrollBehavior = "auto";
      track.current.scrollLeft = d.startScroll - dx;
    }
  };
  const endDrag = () => {
    const el = track.current;
    drag.current.active = false;
    if (el) {
      el.style.scrollSnapType = "";
      el.style.scrollBehavior = "";
    }
  };

  const arrow =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[#2A1A14]/25 bg-white text-[#2A1A14] transition hover:border-[#7B1E2B] hover:text-[#7B1E2B] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#2A1A14]/25 disabled:hover:text-[#2A1A14]";

  return (
    <section className="bg-[#F3EADF]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div data-reveal="fade" className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E2B]">Reviews</p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">
              What our customers say
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={edge.start}
              aria-label="Previous reviews"
              className={arrow}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={edge.end}
              aria-label="Next reviews"
              className={arrow}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <ul
          ref={track}
          onScroll={update}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          data-reveal="slide"
          className="mt-10 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((r, i) => (
            <li
              key={i}
              className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <figure className="flex h-full select-none flex-col rounded-sm border border-[#EADFD2] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex gap-0.5 text-[#C9962B]" role="img" aria-label={`${r.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={16} fill={s < r.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                    ))}
                  </div>
                  <span aria-hidden="true" className="font-serif text-6xl leading-[0.6] text-[#7B1E2B]/20">
                    “
                  </span>
                </div>

                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-[#4A362D]">{r.text}</blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-[#EADFD2] pt-5">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3EADF] font-serif text-lg text-[#7B1E2B]"
                  >
                    {initial(r.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[#2A1A14]">{r.name}</span>
                    {r.location && <span className="block truncate text-xs text-[#6B4F43]">{r.location}</span>}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
