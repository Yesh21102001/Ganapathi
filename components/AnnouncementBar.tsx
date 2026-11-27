"use client";

import { useEffect, useState } from "react";

/** Rotating announcement strip: messages cross-fade into each other. */
export default function AnnouncementBar({ messages, href }: { messages: string[]; href: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (messages.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4500);
    return () => clearInterval(id);
  }, [messages.length, paused]);

  if (messages.length === 0) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="fade-in grid bg-[#7B1E2B] px-4 py-2.5 text-center text-xs font-medium tracking-wide text-[#FBF7F1] transition-colors hover:bg-[#611722] sm:text-[13px]"
    >
      {messages.map((m, i) => (
        <span
          key={m}
          aria-hidden={i !== index}
          className={`col-start-1 row-start-1 transition-[opacity,transform] duration-700 ${
            i === index ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
          }`}
        >
          {m}
        </span>
      ))}
    </a>
  );
}
