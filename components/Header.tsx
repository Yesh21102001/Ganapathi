"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEnquiry } from "@/components/EnquiryProvider";
import { site, type NavGroup, type NavItem } from "@/lib/site";

export default function Header({ nav }: { nav: NavItem[] }) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathname = usePathname();
  const openEnquiry = useEnquiry();
  const open = openPath === pathname; // closes automatically on navigation

  // Desktop dropdown (hover or keyboard focus) and mobile sub-menu; both close on navigation.
  const [hover, setHover] = useState<{ key: string; path: string } | null>(null);
  const hovered = hover && hover.path === pathname ? hover.key : null;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  // Small grace period on leave, so crossing the gap between link and panel never makes it flicker shut.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setHover(null), 200);
  };
  useEffect(() => cancelClose, []);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

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
      if (y < 80) setHidden(false);
      else if (Math.abs(delta) > 6) setHidden(delta > 0);
      if (Math.abs(delta) > 6 || y < 80) lastY.current = y;
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
      // Only keyboard focus pins the header; a mouse/touch click leaves focus on the link and must not.
      onFocus={(e) => setFocused(e.target.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      className={`sticky top-0 z-50 border-b border-[#2A1A14]/10 bg-[#FBF7F1]/95 backdrop-blur transition-[transform,box-shadow] duration-500 ease-out motion-reduce:transition-none ${
        offscreen ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "shadow-md shadow-[#2A1A14]/10" : ""}`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-1 whitespace-nowrap font-serif text-xl font-semibold text-[#7B1E2B] sm:text-2xl"
        >
          <Image src="/logo.png" alt={site.name} width={56} height={56} priority className="-my-2 -ml-2 h-14 w-14" />
        </Link>

        <nav aria-label="Main navigation" className="hidden h-full items-stretch gap-9 lg:flex">
          {nav.map((item) => {
            const active = isActive(item.href);
            const hasMenu = Boolean(item.groups?.length);
            const showMenu = hasMenu && hovered === item.href;
            const enter = () => {
              cancelClose();
              setHover({ key: item.href, path: pathname });
            };
            return (
              <div
                key={item.href}
                className="flex items-center"
                onMouseEnter={enter}
                onMouseLeave={scheduleClose}
                onFocus={enter}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setHover(null);
                }}
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-haspopup={hasMenu ? "true" : undefined}
                  aria-expanded={hasMenu ? showMenu : undefined}
                  className={`flex items-center gap-1 text-sm transition-colors hover:text-[#7B1E2B] ${
                    active || showMenu ? "text-[#7B1E2B]" : "text-[#2A1A14]"
                  }`}
                >
                  {item.label}
                  {hasMenu && (
                    <ChevronDown
                      size={14}
                      aria-hidden="true"
                      className={`block shrink-0 origin-center transform-gpu transition-transform duration-300 ease-out will-change-transform ${showMenu ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>

                {hasMenu && (
                  <div
                    className={`absolute inset-x-0 top-full border-b border-[#2A1A14]/10 bg-[#FBF7F1] shadow-lg shadow-[#2A1A14]/10 ${
                      showMenu
                        ? "visible opacity-100 transition-opacity duration-300"
                        : "pointer-events-none invisible opacity-0 transition-[opacity,visibility] duration-200 [transition-delay:0s,200ms]"
                    }`}
                  >
                    <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-6 px-8 py-8 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
                      {item.groups!.map((g, i) => (
                        <MenuColumn key={g.label ?? `g${i}`} group={g} index={i} show={showMenu} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 text-[#2A1A14]">
          <button
            type="button"
            onClick={() => openEnquiry()}
            className="hidden whitespace-nowrap rounded-sm bg-[#7B1E2B] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#611722] hover:shadow-md active:translate-y-0 lg:inline-block"
          >
            Send Enquiry
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpenPath(open ? null : pathname)}
            className="rounded-full p-2.5 hover:bg-[#2A1A14]/5 lg:hidden"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <div
        className={`grid bg-[#FBF7F1] transition-[grid-template-rows,opacity] duration-500 lg:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        inert={!open}
        className={`min-h-0 overflow-hidden px-4 ${open ? "border-t border-[#2A1A14]/10 pb-4 pt-2" : ""}`}
      >
        {nav.map((item) => {
          const hasMenu = Boolean(item.groups?.length);
          const expanded = expandedMobile === item.href;
          return (
            <div key={item.href}>
              <div className="flex items-center">
                <Link
                  href={item.href}
                  className={`block flex-1 rounded-sm px-3 py-3 text-sm ${
                    isActive(item.href) ? "bg-[#7B1E2B]/10 text-[#7B1E2B]" : "text-[#2A1A14]"
                  }`}
                >
                  {item.label}
                </Link>
                {hasMenu && (
                  <button
                    type="button"
                    aria-label={`${expanded ? "Hide" : "Show"} ${item.label} categories`}
                    aria-expanded={expanded}
                    onClick={() => setExpandedMobile(expanded ? null : item.href)}
                    className="rounded-full p-3 text-[#2A1A14]"
                  >
                    <ChevronDown size={18} className={`transition-transform duration-500 ${expanded ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
              {hasMenu && (
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ${
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div inert={!expanded} className="min-h-0 overflow-hidden">
                    <div className="space-y-4 border-l border-[#2A1A14]/10 pb-3 pl-4 pt-1 ml-3">
                      {item.groups!.map((g, i) => (
                        <MenuColumn key={g.label ?? `g${i}`} group={g} compact />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => {
            setOpenPath(null);
            openEnquiry();
          }}
          className="mt-3 w-full rounded-sm bg-[#7B1E2B] px-4 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#611722] hover:shadow-md active:translate-y-0"
        >
          Send Enquiry
        </button>
      </nav>
      </div>
    </header>
  );
}

/** One dropdown column: heading (a link to the whole group) over its sub-category links. */
function MenuColumn({
  group,
  compact = false,
  index = 0,
  show = true,
}: {
  group: NavGroup;
  compact?: boolean;
  index?: number;
  show?: boolean; // desktop dropdown only: columns fade in one after another
}) {
  return (
    <div
      className={compact ? undefined : `transition-[opacity,transform] duration-700 ${show ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"}`}
      style={compact ? undefined : { transitionDelay: show ? `${80 + index * 70}ms` : "0ms" }}
    >
      {group.label &&
        (group.href ? (
          <Link
            href={group.href}
            className="font-serif text-lg font-semibold text-[#7B1E2B] transition-colors hover:text-[#611722]"
          >
            {group.label}
          </Link>
        ) : (
          <p className="font-serif text-lg font-semibold text-[#2A1A14]">{group.label}</p>
        ))}
      <ul className={`${group.label ? "mt-2" : ""} ${compact ? "space-y-1" : "space-y-2"}`}>
        {group.links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={`group/link block text-sm text-[#2A1A14] transition-colors duration-300 hover:text-[#7B1E2B] ${compact ? "py-1.5" : ""}`}
            >
              {/* Only the text slides; the link box stays put so the hover area never moves under the cursor. */}
              <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-1">{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
