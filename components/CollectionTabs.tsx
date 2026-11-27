"use client";

import { useState } from "react";
import CategoryCard from "@/components/CategoryCard";

export type TabItem = { handle: string; title: string; imageUrl: string | null };
export type TabGroup = { title?: string; items: TabItem[] };
export type Tab = { handle: string; title: string; groups: TabGroup[] };

/** Category tabs: picking a tab shows that category's sub-categories right on the page. */
export default function CollectionTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.handle);
  const current = tabs.find((t) => t.handle === active) ?? tabs[0];
  if (!current) return null;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Collection categories"
        className="-mx-4 flex justify-start gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((t) => {
          const selected = t.handle === current.handle;
          return (
            <button
              key={t.handle}
              type="button"
              role="tab"
              id={`tab-${t.handle}`}
              aria-selected={selected}
              aria-controls={`panel-${t.handle}`}
              onClick={() => setActive(t.handle)}
              className={`shrink-0 whitespace-nowrap rounded-sm border px-5 py-2.5 text-sm font-semibold transition-colors duration-500 sm:px-7 sm:py-3 ${
                selected
                  ? "border-[#7B1E2B] bg-[#7B1E2B] text-white"
                  : "border-[#D9C9B6] bg-white text-[#2A1A14] hover:border-[#7B1E2B] hover:text-[#7B1E2B]"
              }`}
            >
              {t.title}
            </button>
          );
        })}
      </div>

      <div
        key={current.handle}
        role="tabpanel"
        id={`panel-${current.handle}`}
        aria-labelledby={`tab-${current.handle}`}
        className="fade-in mt-8 space-y-12"
      >
        {current.groups.map((g, gi) => (
          <section key={g.title ?? `group-${gi}`}>
            {g.title && (
              <div className="mb-5">
                <h2 className="font-serif text-3xl font-medium text-[#2A1A14]">{g.title}</h2>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {g.items.map((item, i) => (
                <CategoryCard
                  key={item.handle}
                  index={i}
                  title={item.title}
                  href={`/collections/${item.handle}`}
                  imageUrl={item.imageUrl}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
