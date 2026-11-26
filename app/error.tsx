"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E2B]">Something went wrong</p>
      <h1 className="mt-4 font-serif text-5xl font-medium text-[#2A1A14]">We hit a snag</h1>
      <p className="mt-4 text-[#6B4F43]">
        We could not load this page from the store. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-sm bg-[#7B1E2B] px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#611722] hover:shadow-md active:translate-y-0"
      >
        Try again
      </button>
    </section>
  );
}
