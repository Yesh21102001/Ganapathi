"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useEnquiry } from "@/components/EnquiryProvider";
import { site, type NavItem } from "@/lib/site";

export default function Header({ nav }: { nav: NavItem[] }) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathname = usePathname();
  const openEnquiry = useEnquiry();
  const open = openPath === pathname; // closes automatically on navigation

  // Smart sticky: hide while scrolling down, reveal on any scroll up.
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.max(window.scrollY, 0); // iOS overscroll can go negative
      const delta = y - lastY.current;
      setScrolled(y > 10);
      if (y < 100) setHidden(false);
      else if (Math.abs(delta) > 6) setHidden(delta > 0);
      if (Math.abs(delta) > 6 || y < 100) lastY.current = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    lastY.current = window.scrollY;
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Never hide while the mobile menu is open or the header holds keyboard focus.
  const [focused, setFocused] = useState(false);
  const offscreen = hidden && !open && !focused;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`sticky top-0 z-50 border-b border-[#2A1A14]/10 bg-[#FBF7F1]/95 backdrop-blur transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
        offscreen ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "shadow-md shadow-[#2A1A14]/10" : ""}`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="whitespace-nowrap font-serif text-xl font-semibold text-[#7B1E2B] sm:text-2xl"
        >
          {site.name}
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-9 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-sm transition-colors hover:text-[#7B1E2B] ${
                isActive(item.href) ? "text-[#7B1E2B]" : "text-[#2A1A14]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 text-[#2A1A14]">
          <button
            type="button"
            onClick={() => openEnquiry()}
            className="whitespace-nowrap rounded-md bg-[#7B1E2B] px-3 py-2 text-[13px] font-semibold sm:px-4 sm:py-2.5 sm:text-sm text-white transition hover:bg-[#611722]"
          >
            Send Enquiry
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpenPath(open ? null : pathname)}
            className="ml-1 rounded-full p-2 sm:ml-2 sm:p-2.5 hover:bg-[#2A1A14]/5 lg:hidden"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!open}
        className="border-t border-[#2A1A14]/10 bg-[#FBF7F1] px-4 pb-4 pt-2 lg:hidden"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md px-3 py-3 text-sm ${
              isActive(item.href) ? "bg-[#7B1E2B]/10 text-[#7B1E2B]" : "text-[#2A1A14]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
