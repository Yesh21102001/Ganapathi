import type { ShopifyMoney, ShopifyProduct } from "@/types/shopify";

export function formatPrice(money: ShopifyMoney) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(money.amount));
}

/** Compare-at money if the product is genuinely discounted, else null. */
export function saleInfo(product: ShopifyProduct) {
  const price = product.priceRange.minVariantPrice;
  const compare = product.compareAtPriceRange?.minVariantPrice;
  if (!compare || Number(compare.amount) <= Number(price.amount)) return null;
  const percent = Math.round((1 - Number(price.amount) / Number(compare.amount)) * 100);
  return { compare, percent };
}
