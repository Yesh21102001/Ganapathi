"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-1.5 w-full rounded-sm border border-[#2A1A14]/25 bg-white px-3.5 py-2.5 text-sm text-[#2A1A14] outline-none focus:border-[#7B1E2B] focus:ring-1 focus:ring-[#7B1E2B]";

const interests = ["Women", "Men", "Kids", "Home Essentials", "Multiple categories"];

/** Inline enquiry form; posts to the same /api/enquiry endpoint as the enquiry dialog. */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    // The enquiry API takes name / phone / email / message, so extra fields travel inside the message.
    const lines = [
      d.company ? `Company: ${d.company}` : "",
      d.interest ? `Interested in: ${d.interest}` : "",
      d.quantity ? `Approx. quantity: ${d.quantity}` : "",
    ].filter(Boolean);
    lines.push("", d.message);

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: d.name, phone: d.phone, email: d.email, message: lines.join("\n") }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not send your enquiry. Please try again.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-10 text-center">
        <p className="font-serif text-3xl text-[#7B1E2B]">Thank you!</p>
        <p className="mx-auto mt-3 max-w-sm text-[#6B4F43]">
          We have received your enquiry and will contact you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-[#7B1E2B] underline-offset-4 hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
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

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-[#B42318]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-sm bg-[#7B1E2B] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#611722] hover:shadow-md active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "sending" ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
