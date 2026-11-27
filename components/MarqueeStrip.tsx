/** Slow, endless scrolling ticker. Pauses on hover; static (and still readable) when motion is reduced. */
export default function MarqueeStrip({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {messages.map((m) => (
        <li key={m} className="flex items-center whitespace-nowrap px-6 font-serif text-xl sm:px-10 sm:text-2xl">
          {m}
          <span aria-hidden="true" className="ml-6 text-[#F2D9A0] sm:ml-10">&#10022;</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Highlights" className="marquee-section group overflow-hidden bg-[#7B1E2B] py-4 text-[#FBF7F1] sm:py-5">
      <div className="marquee-track flex w-max group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
