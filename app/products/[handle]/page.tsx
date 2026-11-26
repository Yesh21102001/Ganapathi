import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductByHandle, getProducts, safe } from "@/lib/shopify";
import { formatPrice, saleInfo } from "@/lib/format";
import ProductGallery from "@/components/ProductGallery";
import ProductActions from "@/components/ProductActions";
import { site } from "@/lib/site";
import ProductCard from "@/components/ProductCard";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await safe(getProductByHandle(handle), null);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description.slice(0, 160) || undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const related = (await safe(getProducts(8), []))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const images = product.images.nodes.length
    ? product.images.nodes
    : product.featuredImage
      ? [product.featuredImage]
      : [];
  const variants = product.variants?.nodes ?? [];
  // Shopify adds a single "Title: Default Title" option to products without real options.
  const options = (product.options ?? []).filter(
    (o) => !(o.name === "Title" && o.values.length === 1 && o.values[0] === "Default Title")
  );
  const inStock = variants.length === 0 || variants.some((v) => v.availableForSale);
  const sale = saleInfo(product);

  const facts = [
    product.vendor && { label: "Brand", value: product.vendor },
    product.productType && { label: "Type", value: product.productType },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-center text-xs text-[#6B4F43]">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:underline">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-[#2A1A14]">{product.title}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-8">
        <ProductGallery images={images} title={product.title} />

        <div className="lg:max-w-xl">
          <h1 className="text-2xl font-bold text-[#2A1A14] sm:text-3xl">
            {product.vendor || product.title}
          </h1>
          {product.vendor && (
            <p className="mt-1 text-lg text-[#6B4F43] sm:text-xl">{product.title}</p>
          )}

          <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-bold text-[#2A1A14]">
              {formatPrice(product.priceRange.minVariantPrice)}
            </span>
            {sale && (
              <>
                <span className="text-lg text-[#6B4F43]">
                  MRP <span className="line-through">{formatPrice(sale.compare)}</span>
                </span>
                <span className="text-lg font-semibold text-[#C2562B]">({sale.percent}% OFF)</span>
              </>
            )}
          </p>
          <p className="mt-2 text-sm font-semibold text-[#2E7D5B]">inclusive of all taxes</p>

          <ProductActions
            title={product.title}
            handle={product.handle}
            price={formatPrice(product.priceRange.minVariantPrice)}
            inStock={inStock}
            whatsapp={site.whatsapp}
            options={options.map((o) => ({
              name: o.name,
              values: o.values,
              // With a single option, each variant title is exactly that option's value.
              soldOut:
                options.length === 1
                  ? variants.filter((v) => !v.availableForSale).map((v) => v.title)
                  : [],
            }))}
          />

          {facts.length > 0 && (
            <div className="mt-8 border-t border-[#2A1A14]/10 pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#2A1A14]">
                Product details
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs uppercase tracking-wider text-[#6B4F43]">{f.label}</dt>
                    <dd className="mt-1 text-[#2A1A14]">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {product.description && (
            <div className="mt-8 border-t border-[#2A1A14]/10 pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#2A1A14]">
                Description
              </h2>
              {product.descriptionHtml ? (
                // Merchant-authored HTML served by the Shopify Storefront API.
                <div
                  className="shop-prose mt-3"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              ) : (
                <p className="mt-3 whitespace-pre-line leading-relaxed text-[#6B4F43]">
                  {product.description}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-[#F3EADF]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-serif text-3xl font-medium text-[#2A1A14]">You may also like</h2>
            <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
