import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { site } from "@/lib/site";

const WhatsApp = () => <WhatsAppIcon className="h-[18px] w-[18px]" />;

export default function HelpBand() {
  const phoneDigits = site.phone.replace(/[^\d+]/g, "");
  const contacts = [
    site.whatsapp && {
      key: "wa",
      href: `https://wa.me/${site.whatsapp}`,
      label: "Chat on WhatsApp",
      Icon: WhatsApp,
      external: true,
    },
    site.phone && { key: "ph", href: `tel:${phoneDigits}`, label: site.phone, Icon: Phone },
    site.email && { key: "em", href: `mailto:${site.email}`, label: site.email, Icon: Mail },
  ].filter(Boolean) as {
    key: string;
    href: string;
    label: string;
    Icon: typeof Phone | typeof WhatsApp;
    external?: boolean;
  }[];

  return (
    <section className="reveal bg-[#FBF7F1]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="relative overflow-hidden rounded-sm border border-[#EADFD2] bg-white px-6 py-12 text-center sm:px-12">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-[#7B1E2B]" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E2B]">
            Need help choosing?
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">
            Talk to us about sarees, shirts, kids wear or home textiles
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#6B4F43]">
            Share what you are looking for and we will help you pick the right fit, fabric and size.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {contacts.map(({ key, href, label, Icon, external }, i) => (
              <Link
                key={key}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={
                  i === 0
                    ? "inline-flex items-center gap-2 rounded-sm bg-[#7B1E2B] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#611722] hover:shadow-md active:translate-y-0"
                    : "inline-flex items-center gap-2 rounded-sm border border-[#D9C9B6] bg-[#FBF7F1] px-6 py-3.5 text-sm font-semibold text-[#2A1A14] transition hover:bg-[#F3EADF]"
                }
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
