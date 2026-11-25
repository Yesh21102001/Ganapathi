import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import EnquiryButton from "@/components/EnquiryButton";
import { getPage, safe } from "@/lib/shopify";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact us" };

export default async function ContactPage() {
  const page = await safe(getPage("contact"), null);

  const details = [
    site.address && { Icon: MapPin, label: "Visit us", value: site.address, href: undefined },
    site.phone && { Icon: Phone, label: "Call us", value: site.phone, href: `tel:${site.phone}` },
    site.email && { Icon: Mail, label: "Email us", value: site.email, href: `mailto:${site.email}` },
  ].filter(Boolean) as { Icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero
        title="Contact us"
        eyebrow="We would love to hear from you"
        description="Questions about a product, a size or an order? Send us an enquiry and we will get back to you."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div className="rounded-md border border-[#EADFD2] bg-white p-8 sm:p-10">
          <MessageSquare size={28} strokeWidth={1.5} className="text-[#7B1E2B]" />
          <h2 className="mt-5 font-serif text-3xl font-medium text-[#2A1A14]">Send an enquiry</h2>
          <p className="mt-3 max-w-md leading-relaxed text-[#6B4F43]">
            Tell us what you are looking for. Share a product name, size or fabric and we will
            reply with details and availability.
          </p>
          <EnquiryButton className="mt-7 rounded-md bg-[#7B1E2B] px-8 py-3.5 font-semibold text-white transition hover:bg-[#611722]">
            Open enquiry form
          </EnquiryButton>
          {page?.body?.trim() && (
            // Merchant-authored HTML served by the Shopify Storefront API.
            <div className="shop-prose mt-8 border-t border-[#EADFD2] pt-6" dangerouslySetInnerHTML={{ __html: page.body }} />
          )}
        </div>

        <div className="space-y-4">
          {details.map(({ Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4 rounded-md border border-[#EADFD2] bg-white p-6">
              <Icon size={22} strokeWidth={1.6} className="mt-0.5 shrink-0 text-[#7B1E2B]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6B4F43]">{label}</p>
                {href ? (
                  <a href={href} className="mt-1 block text-[#2A1A14] hover:underline">{value}</a>
                ) : (
                  <p className="mt-1 text-[#2A1A14]">{value}</p>
                )}
              </div>
            </div>
          ))}
          <div className="rounded-md bg-[#F3EADF] p-6 text-sm leading-relaxed text-[#6B4F43]">
            Looking for something specific? Browse{" "}
            <Link href="/products" className="font-medium text-[#7B1E2B] underline">all products</Link>{" "}
            or check our{" "}
            <Link href="/policies/shipping-policy" className="font-medium text-[#7B1E2B] underline">shipping</Link>{" "}
            and{" "}
            <Link href="/policies/refund-policy" className="font-medium text-[#7B1E2B] underline">refund</Link>{" "}
            policies.
          </div>
        </div>
      </section>
    </>
  );
}
