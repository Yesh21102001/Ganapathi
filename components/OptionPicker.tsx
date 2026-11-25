"use client";

import { useState } from "react";

/** Round selectable option chips (size, colour…). Values in `soldOut` are struck through and disabled. */
export default function OptionPicker({
  name,
  values,
  soldOut = [],
}: {
  name: string;
  values: string[];
  soldOut?: string[];
}) {
  const firstAvailable = values.find((v) => !soldOut.includes(v));
  const [selected, setSelected] = useState<string | undefined>(
    values.length === 1 ? firstAvailable : undefined
  );

  return (
    <div className="mt-7">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[#2A1A14]">
        Select {name}
        {selected && <span className="ml-2 font-normal normal-case text-[#6B4F43]">{selected}</span>}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label={name}>
        {values.map((v) => {
          const out = soldOut.includes(v);
          const on = selected === v;
          return (
            <li key={v}>
              <button
                type="button"
                role="radio"
                aria-checked={on}
                disabled={out}
                onClick={() => setSelected(v)}
                className={`flex h-12 min-w-12 items-center justify-center rounded-full border px-4 text-sm font-semibold transition ${
                  on
                    ? "border-[#7B1E2B] bg-[#7B1E2B] text-white"
                    : out
                      ? "cursor-not-allowed border-[#2A1A14]/15 text-[#2A1A14]/35 line-through"
                      : "border-[#2A1A14]/30 text-[#2A1A14] hover:border-[#7B1E2B] hover:text-[#7B1E2B]"
                }`}
              >
                {v}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
