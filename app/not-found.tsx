import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E2B]">Error 404</p>
      <h1 className="mt-4 font-serif text-5xl font-medium text-[#2A1A14]">Page not found</h1>
      <p className="mt-4 text-[#6B4F43]">
        The page you are looking for does not exist or has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-sm bg-[#7B1E2B] px-6 py-3.5 font-semibold text-white transition hover:bg-[#611722]">
          Back to home
        </Link>
        <Link href="/products" className="rounded-sm border border-[#2A1A14] px-6 py-3.5 font-semibold text-[#2A1A14] transition hover:bg-[#2A1A14]/5">
          Browse products
        </Link>
      </div>
    </section>
  );
}
