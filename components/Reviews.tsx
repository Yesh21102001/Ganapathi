import { Star } from "lucide-react";
import { reviews } from "@/lib/site";

export default function Reviews() {
  if (reviews.length === 0) return null;

  // Two copies of the list make the loop seamless; the second copy is hidden from assistive tech.
  const loop = [...reviews, ...reviews];

  return (
    <section className="overflow-hidden bg-[#F3EADF]">
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E2B]">Reviews</p>
        <h2 className="mt-3 font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">
          What our customers say
        </h2>
      </div>

      <div className="marquee mt-8 pb-14 lg:pb-16">
        <ul
          className="marquee-track flex w-max"
          style={{ "--marquee-duration": `${Math.max(reviews.length * 7, 28)}s` } as React.CSSProperties}
        >
          {loop.map((r, i) => (
            <li
              key={i}
              aria-hidden={i >= reviews.length ? true : undefined}
              className="w-[82vw] shrink-0 pr-5 sm:w-[24rem]"
            >
              <div className="flex h-full flex-col rounded-sm border border-[#EADFD2] bg-white p-7">
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
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
