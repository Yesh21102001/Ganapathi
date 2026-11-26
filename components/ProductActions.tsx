"use client";

import Link from "next/link";
import { useState } from "react";
import OptionPicker from "@/components/OptionPicker";

type Option = { name: string; values: string[]; soldOut: string[] };

/** Option pickers plus the WhatsApp enquiry button, which sends the product and chosen options. */
export default function ProductActions({
  title,
  handle,
  price,
  options,
  inStock,
  whatsapp,
}: {
  title: string;
  handle: string;
  price: string;
  options: Option[];
  inStock: boolean;
  whatsapp: string;
}) {
  // Single-value options (e.g. only one size) are pre-selected.
  const [chosen, setChosen] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      options
        .filter((o) => o.values.length === 1 && !o.soldOut.includes(o.values[0]))
        .map((o) => [o.name, o.values[0]])
    )
  );

  const enquire = () => {
    const lines = [
      "Hi, I'm interested in this product:",
      "",
      `*${title}*`,
      `Price: ${price}`,
      ...options.filter((o) => chosen[o.name]).map((o) => `${o.name}: ${chosen[o.name]}`),
      `Link: ${window.location.origin}/products/${handle}`,
    ];
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {options.map((o) => (
        <OptionPicker
          key={o.name}
          name={o.name}
          values={o.values}
          soldOut={o.soldOut}
          selected={chosen[o.name]}
          onSelect={(v) => setChosen((c) => ({ ...c, [o.name]: v }))}
        />
      ))}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={enquire}
          className="min-w-56 flex-1 rounded-md bg-[#7B1E2B] px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#611722] sm:flex-none"
        >
          Enquire now
        </button>
        <Link
          href="/products"
          className="rounded-md border border-[#2A1A14]/25 px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-[#2A1A14] transition hover:border-[#2A1A14]"
        >
          Keep browsing
        </Link>
      </div>
      {!inStock && <p className="mt-3 text-sm font-medium text-[#7B1E2B]">Currently out of stock</p>}
    </>
  );
}
