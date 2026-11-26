"use client";

import { ArrowUp } from "lucide-react";

export default function ScrollTop() {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="text-white/70 transition hover:text-white"
    >
      <ArrowUp size={22} strokeWidth={1.4} />
    </button>
  );
}
