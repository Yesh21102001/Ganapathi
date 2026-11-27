import type { ShopifyProduct } from "@/types/shopify";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }: { product: ShopifyProduct }) {
  const soldOut = product.availableForSale === false;
  const href = `/products/${product.handle}`;

  return (
    <article className="group">
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden rounded-sm bg-[#EADBC8]"
      >
        {product.featuredImage?.url && (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition duration-[1400ms] group-hover:scale-105"
          />
        )}
        {soldOut && (
          <span
            className="absolute left-2 top-2 rounded-sm bg-[#2A1A14] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
          >
            Sold out
          </span>
        )}
      </Link>

      {product.productType && (
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B4F43]">
          {product.productType}
        </p>
      )}
      <h3 className={`line-clamp-2 text-sm text-[#2A1A14] ${product.productType ? "mt-1" : "mt-3"}`}>
        <Link href={href} className="transition-colors group-hover:text-[#7B1E2B] hover:underline">
          {product.title}
        </Link>
      </h3>
    </article>
  );
}
