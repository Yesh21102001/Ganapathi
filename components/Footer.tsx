import Link from "next/link";
import { site } from "@/lib/site";
import type { ShopifyCollection } from "@/types/shopify";
import ScrollTop from "@/components/ScrollTop";
import FooterColumn from "@/components/FooterColumn";

type IconProps = { size?: number };
const svg = (size: number, children: React.ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    {children}
  </svg>
);
const Facebook = ({ size = 20 }: IconProps) =>
  svg(size, <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z" />);
const Instagram = ({ size = 20 }: IconProps) =>
  svg(size, <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2ZM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0Zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9Z" />);
const Youtube = ({ size = 20 }: IconProps) =>
  svg(size, <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />);

const help = [
  { href: "/contact", label: "Customer Support" },
  { href: "/policies/privacy-policy", label: "Privacy Policy" },
  { href: "/policies/refund-policy", label: "Refund Policy" },
  { href: "/policies/shipping-policy", label: "Shipping Policy" },
  { href: "/policies/terms-of-service", label: "Terms of Service" },
];

const discover = [
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

const quickHandles = ["best-sellers", "new-arrivals", "on-sale"];

export default function Footer({ collections }: { collections: ShopifyCollection[] }) {
  // Prefer the usual merchandising collections; otherwise fall back to the first few.
  const preferred = quickHandles
    .map((h) => collections.find((c) => c.handle === h))
    .filter(Boolean) as ShopifyCollection[];
  const quick = (preferred.length ? preferred : collections.slice(0, 4)).map((c) => ({
    href: `/collections/${c.handle}`,
    label: c.title,
  }));

  const socials = [
    { Icon: Facebook, href: site.social.facebook, label: "Facebook" },
    { Icon: Instagram, href: site.social.instagram, label: "Instagram" },
    { Icon: Youtube, href: site.social.youtube, label: "YouTube" },
  ].filter((s) => s.href);
  const contact = [site.phone, site.email, site.address].filter(Boolean);

  const heading = "font-serif text-lg text-white";

  const column = (title: string, items: { href: string; label: string }[]) =>
    items.length > 0 && <FooterColumn title={title} items={items} />;

  return (
    <footer className="bg-[#46040C] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-14 sm:px-6 lg:px-8">
        <div className="grid sm:gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
          <div className="pb-8 sm:pb-0">
            <Link href="/" className="font-serif text-3xl font-semibold leading-tight">
              {site.name}
            </Link>
            <p className="mt-5 max-w-xs text-[15px] leading-7 text-white/90">{site.tagline}.</p>
          </div>

          {column("Help", help)}
          {column("Discover", discover)}
          {column("Quick Links", quick)}

          {(contact.length > 0 || socials.length > 0) && (
            <div className="pt-8 sm:pt-0">
              <h3 className={heading}>Our store</h3>
              {contact.map((line) => (
                <p key={line} className="mt-3 break-words text-[15px] leading-6 text-white/90 first:mt-5">
                  {line}
                </p>
              ))}
              {socials.length > 0 && (
                <div className="mt-4 flex gap-3">
                  {socials.map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE6E3] text-[#2A1A14] transition hover:bg-white"
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-16 flex items-end justify-between gap-4 text-[15px] text-white/90">
          <div className="space-y-1">
            <p className="text-xs leading-relaxed text-white/70 sm:text-sm">© {site.name} {new Date().getFullYear()}    Developed by{" "}
              <a
                href="https://growwwtech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white underline-offset-4 hover:underline"
              >
                GrowwwTech
              </a>
            </p>
          </div>
          <ScrollTop />
        </div>
      </div>
    </footer>
  );
}
