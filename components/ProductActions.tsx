"use client";

import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useState } from "react";
import OptionPicker from "@/components/OptionPicker";

type Option = { name: string; values: string[]; soldOut: string[] };

/** Option pickers plus the WhatsApp enquiry button, which sends the product and chosen options. */
export default function ProductActions({
  title,
  handle,
  options,
  inStock,
  whatsapp,
}: {
  title: string;
  handle: string;
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

      <div className="mt-8">
        <button
          type="button"
          onClick={enquire}
          className="flex items-center justify-center gap-2.5 rounded-sm bg-[#7B1E2B] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#611722] hover:shadow-md active:translate-y-0"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Enquire on WhatsApp
        </button>
      </div>
      {!inStock && <p className="mt-3 text-sm font-medium text-[#7B1E2B]">Currently out of stock</p>}
    </>
  );
}
