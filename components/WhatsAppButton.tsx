import { site } from "@/lib/site";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function WhatsAppButton() {
  if (!site.whatsapp) return null;
  const text = encodeURIComponent(`Hi ${site.name}, I would like to know more about your products.`);

  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl md:bottom-6 md:right-6"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}
