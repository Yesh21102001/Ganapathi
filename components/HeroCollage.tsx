import Link from "next/link";
import Image from "next/image";

type Img = { src: string; alt: string };

function Tile({
  img,
  className = "",
  bg,
  priority = false,
  children,
}: {
  img?: Img | null;
  className?: string;
  bg: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-sm ${className}`} style={{ backgroundColor: bg }}>
      {img && (
        <Image
          src={img.src}
          alt={img.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 20vw, 33vw"
          className="object-cover object-top transition duration-[1400ms] group-hover:scale-105"
        />
      )}
      {children}
    </div>
  );
}


export default function HeroCollage({
  title,
  images,
}: {
  title: string;
  images: {
    a: Img; // left, tall
    b: Img; // left, short
    c: Img; // second column
    center: Img;
    d?: Img | null; // fourth column
    e?: Img | null; // right, tall
    f?: Img | null; // right, short
  };
}) {
  return (
    <section className="bg-[#FCF8F3]">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 md:pt-14 lg:px-8 lg:pb-16">
        <h1 style={{ "--hero-delay": "100ms" } as React.CSSProperties} className="hero-in mx-auto max-w-5xl text-balance text-center font-serif text-3xl font-medium leading-[1.15] text-[#2A1A14] sm:text-4xl lg:text-5xl">
          {title.split("\n").map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h1>

        <div style={{ "--hero-delay": "350ms" } as React.CSSProperties} className="hero-in mt-6 flex justify-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 rounded-sm bg-[#7B1E2B] px-5 py-2.5 text-[13px] font-semibold sm:gap-2 sm:px-7 sm:py-3.5 sm:text-sm text-white transition hover:-translate-y-0.5 hover:bg-[#611722] hover:shadow-md active:translate-y-0"
          >
            Explore Collections
          </Link>
        </div>

        <div style={{ "--hero-delay": "600ms" } as React.CSSProperties} className="hero-in mt-8 grid h-[300px] grid-cols-3 gap-3 sm:h-[400px] md:mt-10 lg:h-[460px] lg:grid-cols-5 lg:gap-4">
          {/* Column 1 */}
          <div className="flex flex-col gap-3 lg:gap-4">
            <Tile img={images.a} bg="#EADBC8" priority className="flex-[2]" />
            <Tile img={images.b} bg="#E9C9A6" className="flex-1" />
          </div>

          {/* Column 2 */}
          <div className="hidden items-center lg:flex">
            <Tile img={images.c} bg="#C9962B" priority className="h-[88%] w-full" />
          </div>

          {/* Centre */}
          <div className="flex items-center">
            <Tile img={images.center} bg="#7B1E2B" priority className="h-[78%] w-full lg:h-[72%]" />
          </div>

          {/* Column 4 */}
          <div className="hidden items-center lg:flex">
            <Tile img={images.d} bg="#A24B54" className="h-[88%] w-full" />
          </div>

          {/* Column 5 */}
          <div className="flex flex-col gap-3 lg:gap-4">
            <Tile img={images.e} bg="#E4D2BD" className="flex-[2]" />
            <Tile img={images.f} bg="#D9B98E" className="flex-1" />
          </div>
        </div>
      </div>
    </section>
  );
}