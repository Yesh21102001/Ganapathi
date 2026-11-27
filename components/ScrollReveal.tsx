"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fades/slides marked elements ([data-reveal]) in as they scroll into view,
 * staggering siblings. Elements already on screen, and visitors who prefer
 * reduced motion, are left alone, so nothing is ever hidden without a way back.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const groups = new Map<Element, number>();
    const pending: HTMLElement[] = [];

    for (const el of targets) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
      const parent = el.parentElement!;
      const n = groups.get(parent) ?? 0;
      groups.set(parent, n + 1);
      el.style.setProperty("--reveal-delay", `${150 * Math.min(n, 5)}ms`);
      el.classList.add("reveal-pending");
      pending.push(el);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    pending.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      pending.forEach((el) => el.classList.remove("reveal-pending", "is-visible"));
    };
  }, [pathname]);

  return null;
}
