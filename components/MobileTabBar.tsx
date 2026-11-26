"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, LayoutGrid, Phone } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/products", label: "Shop", Icon: ShoppingBag },
  { href: "/collections", label: "Collections", Icon: LayoutGrid },
  { href: "/contact", label: "Contact", Icon: Phone },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#EADFD2] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-4">
        {tabs.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${
                  active ? "text-[#7B1E2B]" : "text-[#6B4F43] hover:text-[#2A1A14]"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.7} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
