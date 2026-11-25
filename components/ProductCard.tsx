import type { ShopifyProduct } from "@/types/shopify";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, saleInfo } from "@/lib/format";

export default function ProductCard({ product }: { product: ShopifyProduct }) {
  const price = product.priceRange.minVariantPrice;
  const sale = saleInfo(product);
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
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        {(sale || soldOut) && (
          <span
            className={`absolute left-2 top-2 rounded-sm px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
              soldOut ? "bg-[#2A1A14] text-white" : "bg-[#7B1E2B] text-white"
            }`}
          >
            {soldOut ? "Sold out" : `${sale!.percent}% off`}
          </span>
        )}
      </Link>

      {product.productType && (
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B4F43]">
          {product.productType}
        </p>
      )}
      <h3 className={`line-clamp-2 text-sm text-[#2A1A14] ${product.productType ? "mt-1" : "mt-3"}`}>
        <Link href={href} className="hover:underline">
          {product.title}
        </Link>
      </h3>
      <p className="mt-1.5 flex items-baseline gap-2 text-sm">
        <span className="font-semibold text-[#7B1E2B]">{formatPrice(price)}</span>
        {sale && (
          <span className="text-xs text-[#6B4F43] line-through">{formatPrice(sale.compare)}</span>
        )}
      </p>
    </article>
  );
}
