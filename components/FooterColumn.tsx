"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

/**
 * Footer link column. On phones it is an accordion (tap the heading to open);
 * from the `sm` breakpoint up the links are always visible.
 */
export default function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="border-b border-white/15 sm:border-0">
      <h3 className="font-serif text-lg text-white">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between py-4 text-left sm:pointer-events-none sm:cursor-default sm:py-0"
        >
          {title}
          <ChevronDown size={20} className={`transition-transform sm:hidden ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      <ul id={id} className={`${open ? "block" : "hidden"} space-y-3.5 pb-5 sm:mt-5 sm:block sm:pb-0`}>
        {items.map((i) => (
          <li key={i.href + i.label}>
            <Link href={i.href} className="text-[15px] text-white/90 transition-colors hover:text-white hover:underline">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
