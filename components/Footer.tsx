import Link from "next/link";
import { RotateCcw, Truck, CreditCard, Phone } from "lucide-react";
import { site } from "@/lib/site";
import type { ShopifyCollection } from "@/types/shopify";

const policyLinks = [
  { href: "/policies/shipping-policy", label: "Shipping policy" },
  { href: "/policies/refund-policy", label: "Refund policy" },
  { href: "/policies/privacy-policy", label: "Privacy policy" },
  { href: "/policies/terms-of-service", label: "Terms of service" },
];

export default function Footer({ collections }: { collections: ShopifyCollection[] }) {
  const trust = [
    { Icon: Truck, text: site.trust.shipping },
    { Icon: RotateCcw, text: site.trust.returns },
    { Icon: CreditCard, text: site.trust.payment },
    { Icon: Phone, text: site.trust.support },
  ].filter((t) => t.text);

  const contact = [site.address, site.phone, site.email].filter(Boolean);
  const heading = "text-xs font-semibold uppercase tracking-[0.15em] text-[#F2D9A0]";
  const link = "text-sm text-[#FBF7F1]/85 transition-colors hover:text-white";

  return (
    <footer>
      {trust.length > 0 && (
        <div className="border-y border-[#2A1A14]/10 bg-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {trust.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-[#2A1A14]">
                <Icon size={20} strokeWidth={1.6} className="shrink-0 text-[#7B1E2B]" />
                {text}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#2A1A14] text-[#FBF7F1]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="font-serif text-3xl font-semibold">
                {site.name}
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#FBF7F1]/65">
                {site.tagline}. Sarees, ethnic wear, kids wear and home essentials.
              </p>
              {contact.map((line) => (
                <p key={line} className="mt-2 text-sm text-[#FBF7F1]/65">
                  {line}
                </p>
              ))}
            </div>

            <div>
              <h3 className={heading}>Shop</h3>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link href="/products" className={link}>All products</Link>
                </li>
                {collections.map((c) => (
                  <li key={c.handle}>
                    <Link href={`/collections/${c.handle}`} className={link}>{c.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={heading}>Company</h3>
              <ul className="mt-5 space-y-3">
                <li><Link href="/about" className={link}>About us</Link></li>
                <li><Link href="/contact" className={link}>Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className={heading}>Policies</h3>
              <ul className="mt-5 space-y-3">
                {policyLinks.map((p) => (
                  <li key={p.href}><Link href={p.href} className={link}>{p.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-[#FBF7F1]/15 pt-6 text-xs text-[#FBF7F1]/60">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
