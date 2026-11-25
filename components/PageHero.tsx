import Link from "next/link";

/** Shared banner used by listing, content and policy pages. */
export default function PageHero({
  title,
  eyebrow,
  description,
  crumbs = [],
  children,
  centered = false,
}: {
  centered?: boolean;
  title: string;
  eyebrow?: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-[#2A1A14]/10 bg-[#F3EADF]">
      <div className={`mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8 ${centered ? "text-center" : ""}`}>
        <nav aria-label="Breadcrumb" className="text-xs text-[#6B4F43]">
          <Link href="/" className="hover:underline">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}>
              <span className="mx-2">/</span>
              {c.href ? (
                <Link href={c.href} className="hover:underline">{c.label}</Link>
              ) : (
                <span className="text-[#2A1A14]">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        {eyebrow && (
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E2B]">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-serif text-4xl font-medium text-[#2A1A14] sm:text-5xl">{title}</h1>
        {description && (
          <p className={`mt-4 max-w-2xl leading-relaxed text-[#6B4F43] ${centered ? "mx-auto" : ""}`}>{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
