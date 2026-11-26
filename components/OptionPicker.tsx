"use client";

/** Round selectable option chips (size, colour…). Values in `soldOut` are crossed out and disabled. */
export default function OptionPicker({
  name,
  values,
  soldOut = [],
  selected,
  onSelect,
}: {
  name: string;
  values: string[];
  soldOut?: string[];
  selected?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#2A1A14]">
        Select {name}
        {selected && <span className="ml-2 font-normal normal-case text-[#6B4F43]">· {selected}</span>}
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
                onClick={() => onSelect(v)}
                className={`relative flex h-12 min-w-12 items-center justify-center overflow-hidden rounded-sm border px-4 text-sm font-bold transition ${
                  on
                    ? "border-[#7B1E2B] text-[#7B1E2B] ring-1 ring-[#7B1E2B]"
                    : out
                      ? "cursor-not-allowed border-dashed border-[#2A1A14]/20 text-[#2A1A14]/35"
                      : "border-[#2A1A14]/30 text-[#2A1A14] hover:border-[#7B1E2B] hover:text-[#7B1E2B]"
                }`}
              >
                {v}
                {out && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top_right,transparent_47%,rgba(42,26,20,0.25)_49%,rgba(42,26,20,0.25)_51%,transparent_53%)]"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
