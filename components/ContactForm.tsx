"use client";

import { site } from "@/lib/site";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const field =
  "mt-1.5 w-full rounded-sm border border-[#2A1A14]/25 bg-white px-3.5 py-2.5 text-sm text-[#2A1A14] outline-none focus:border-[#7B1E2B] focus:ring-1 focus:ring-[#7B1E2B]";

const interests = ["Women", "Men", "Kids", "Home Essentials", "Multiple categories"];

/** Inline enquiry form; hands the details over to WhatsApp as a ready-to-send message. */
export default function ContactForm() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const lines = [
      `Hi ${site.name}, I would like to make an enquiry.`,
      "",
      `Name: ${d.name}`,
      `Phone: ${d.phone}`,
      d.email ? `Email: ${d.email}` : "",
      d.company ? `Company / Store: ${d.company}` : "",
      d.interest ? `Interested in: ${d.interest}` : "",
      d.quantity ? `Approx. quantity: ${d.quantity}` : "",
      "",
      `Message: ${d.message}`,
    ].filter((l, i, all) => l !== "" || (all[i - 1] !== "" && i > 0));

    const link = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(lines.join(String.fromCharCode(10)))}`;
    window.open(link, "_blank", "noopener,noreferrer");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[#2A1A14]">
          Name
          <input name="name" required maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="block text-sm font-medium text-[#2A1A14]">
          Company / Store <span className="font-normal text-[#6B4F43]">(optional)</span>
          <input name="company" maxLength={100} autoComplete="organization" className={field} />
        </label>
        <label className="block text-sm font-medium text-[#2A1A14]">
          Phone
          <input name="phone" type="tel" required maxLength={20} autoComplete="tel" className={field} />
        </label>
        <label className="block text-sm font-medium text-[#2A1A14]">
          Email <span className="font-normal text-[#6B4F43]">(optional)</span>
          <input name="email" type="email" maxLength={150} autoComplete="email" className={field} />
        </label>
        <label className="block text-sm font-medium text-[#2A1A14]">
          Interested in
          <select name="interest" defaultValue="" className={field}>
            <option value="">Select a category</option>
            {interests.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-[#2A1A14]">
          Approx. quantity <span className="font-normal text-[#6B4F43]">(optional)</span>
          <input name="quantity" maxLength={60} placeholder="e.g. 200 pieces" className={field} />
        </label>
      </div>

      <label className="block text-sm font-medium text-[#2A1A14]">
        Message
        <textarea
          name="message"
          required
          rows={5}
          maxLength={1200}
          placeholder="Tell us about your requirement: styles, fabrics, sizes, delivery location."
          className={field}
        />
      </label>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#7B1E2B] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#611722] hover:shadow-md active:translate-y-0 sm:w-auto sm:px-10"
      >
        <WhatsAppIcon className="h-[18px] w-[18px]" />
        Send on WhatsApp
      </button>
    </form>
  );
}
