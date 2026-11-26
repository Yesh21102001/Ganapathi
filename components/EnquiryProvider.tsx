"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type EnquiryProduct = { title: string; handle: string } | null;
type Status = "idle" | "sending" | "sent" | "error";

const EnquiryContext = createContext<(product?: EnquiryProduct) => void>(() => {});

export const useEnquiry = () => useContext(EnquiryContext);

const field =
  "mt-1.5 w-full rounded-sm border border-[#2A1A14]/25 bg-white px-3.5 py-2.5 text-sm text-[#2A1A14] outline-none focus:border-[#7B1E2B] focus:ring-1 focus:ring-[#7B1E2B]";

export default function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [product, setProduct] = useState<EnquiryProduct>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [formKey, setFormKey] = useState(0); // remount form to clear it on each open

  const openEnquiry = useCallback((p: EnquiryProduct = null) => {
    setProduct(p);
    setStatus("idle");
    setError("");
    setFormKey((k) => k + 1);
    dialogRef.current?.showModal();
  }, []);

  const close = () => dialogRef.current?.close();

  // Lock page scroll while the dialog is open.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const lock = () => (document.body.style.overflow = "hidden");
    const unlock = () => (document.body.style.overflow = "");
    const obs = new MutationObserver(() => (d.open ? lock() : unlock()));
    obs.observe(d, { attributes: true, attributeFilter: ["open"] });
    return () => {
      obs.disconnect();
      unlock();
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, product: product?.title, productHandle: product?.handle }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not send your enquiry. Please try again.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <EnquiryContext.Provider value={openEnquiry}>
      {children}

      <dialog
        ref={dialogRef}
        aria-labelledby="enquiry-title"
        onClick={(e) => e.target === dialogRef.current && close()}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-sm bg-[#FBF7F1] p-0 text-[#2A1A14] shadow-2xl backdrop:bg-[#2A1A14]/60"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="enquiry-title" className="font-serif text-3xl font-medium">
                Send enquiry
              </h2>
              <p className="mt-1 text-sm text-[#6B4F43]">
                Tell us what you are looking for and we will get back to you.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="-mr-2 -mt-2 rounded-full p-2 hover:bg-[#2A1A14]/5"
            >
              <X size={20} />
            </button>
          </div>

          {status === "sent" ? (
            <div className="mt-8 text-center">
              <p className="font-serif text-2xl text-[#7B1E2B]">Thank you!</p>
              <p className="mt-2 text-sm text-[#6B4F43]">
                We have received your enquiry and will contact you soon.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-6 rounded-sm bg-[#7B1E2B] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#611722] hover:shadow-md active:translate-y-0"
              >
                Close
              </button>
            </div>
          ) : (
            <form key={formKey} onSubmit={onSubmit} className="mt-6 space-y-4">
              {product && (
                <p className="rounded-sm bg-[#F3EADF] px-3.5 py-2.5 text-sm">
                  <span className="text-[#6B4F43]">About: </span>
                  {product.title}
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Name
                  <input name="name" required maxLength={100} autoComplete="name" className={field} />
                </label>
                <label className="block text-sm font-medium">
                  Phone
                  <input
                    name="phone"
                    type="tel"
                    required
                    maxLength={20}
                    autoComplete="tel"
                    className={field}
                  />
                </label>
              </div>

              <label className="block text-sm font-medium">
                Email <span className="font-normal text-[#6B4F43]">(optional)</span>
                <input name="email" type="email" maxLength={150} autoComplete="email" className={field} />
              </label>

              <label className="block text-sm font-medium">
                Message
                <textarea name="message" required rows={4} maxLength={1500} className={field} />
              </label>

              {status === "error" && (
                <p role="alert" className="text-sm font-medium text-[#B42318]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-sm bg-[#7B1E2B] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#611722] hover:shadow-md active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send enquiry"}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </EnquiryContext.Provider>
  );
}
