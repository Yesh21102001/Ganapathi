import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getPage, safe } from "@/lib/shopify";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Get in touch with ${site.name} for wholesale and bulk orders.`,
};

export default async function ContactPage() {
  const page = await safe(getPage("contact"), null);

  const details = [
    site.phone && { Icon: Phone, label: "Call us", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    site.whatsapp && {
      Icon: WhatsAppIcon,
      label: "WhatsApp",
      value: "Chat with us",
      href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi, I would like to discuss a wholesale order.")}`,
      external: true,
    },
    site.email && { Icon: Mail, label: "Email us", value: site.email, href: `mailto:${site.email}` },
    site.address && { Icon: MapPin, label: "Visit us", value: site.address, href: undefined },
  ].filter(Boolean) as {
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
  }[];

  return (
    <>
      <PageHero title="Contact Us" centered eyebrow="Wholesale & bulk enquiries" crumbs={[{ label: "Contact" }]} />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:gap-12 lg:px-8 lg:py-20">
        <div className="rounded-sm border border-[#EADFD2] bg-white p-6 sm:p-10">
          <h2 className="font-serif text-3xl font-medium text-[#2A1A14]">Send us your requirement</h2>
          <p className="mt-3 max-w-lg leading-relaxed text-[#6B4F43]">
            Share what you are looking for and we will reply with pricing and availability.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-sm bg-[#F3EADF] p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-medium text-[#2A1A14]">Reach us directly</h2>
            <ul className="mt-6 space-y-6">
              {details.map(({ Icon, label, value, href, external }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-white text-[#7B1E2B]">
                    {Icon === WhatsAppIcon ? <WhatsAppIcon className="h-5 w-5" /> : <Icon size={20} strokeWidth={1.6} />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B4F43]">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="mt-1 block break-words text-[#2A1A14] hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-[#2A1A14]">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-sm border border-[#EADFD2] bg-white p-6 text-sm leading-relaxed text-[#6B4F43]">
            Want to see what we carry first? Browse{" "}
            <Link href="/products" className="font-medium text-[#7B1E2B] underline">all products</Link>{" "}
            or read our{" "}
            <Link href="/policies/shipping-policy" className="font-medium text-[#7B1E2B] underline">shipping</Link>{" "}
            and{" "}
            <Link href="/policies/refund-policy" className="font-medium text-[#7B1E2B] underline">refund</Link>{" "}
            policies.
          </div>
        </aside>
      </section>

      {page?.body?.trim() && (
        <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
          {/* Merchant-authored HTML served by the Shopify Storefront API. */}
          <div className="shop-prose" dangerouslySetInnerHTML={{ __html: page.body }} />
        </section>
      )}
    </>
  );
}
