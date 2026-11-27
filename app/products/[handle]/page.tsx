import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductByHandle, getProducts, safe } from "@/lib/shopify";
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

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-8 lg:py-8">
        <ProductGallery images={images} title={product.title} />

        <div className="lg:max-w-xl">
          <h1 className="font-serif text-3xl font-medium text-[#2A1A14] sm:text-4xl">
            {product.vendor || product.title}
          </h1>
          {product.vendor && (
            <p className="mt-1 text-lg font-normal text-[#6B4F43] sm:text-xl">{product.title}</p>
          )}

          <p
            className={`mt-4 inline-flex items-center gap-2 rounded-sm border px-3 py-1 text-xs font-semibold ${
              inStock
                ? "border-[#2E7D5B]/30 bg-[#2E7D5B]/10 text-[#2E7D5B]"
                : "border-[#7B1E2B]/30 bg-[#7B1E2B]/10 text-[#7B1E2B]"
            }`}
          >
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-[#2E7D5B]" : "bg-[#7B1E2B]"}`} />
            {inStock ? "In stock" : "Out of stock"}
          </p>

          <div className="mt-5 border-t border-[#2A1A14]/10" />

          <ProductActions
            title={product.title}
            handle={product.handle}
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

          <div className="mt-8 border-t border-[#2A1A14]/10">
            {product.description && (
              <details open className="group border-b border-[#2A1A14]/10 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold uppercase tracking-wide text-[#2A1A14] [&::-webkit-details-marker]:hidden">
                  Product details
                  <ChevronDown size={18} className="transition group-open:rotate-180" aria-hidden="true" />
                </summary>
                {product.descriptionHtml ? (
                  // Merchant-authored HTML served by the Shopify Storefront API.
                  <div
                    className="shop-prose mt-4"
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                  />
                ) : (
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-[#6B4F43]">
                    {product.description}
                  </p>
                )}
              </details>
            )}

            {facts.length > 0 && (
              <details open className="group border-b border-[#2A1A14]/10 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold uppercase tracking-wide text-[#2A1A14] [&::-webkit-details-marker]:hidden">
                  Specifications
                  <ChevronDown size={18} className="transition group-open:rotate-180" aria-hidden="true" />
                </summary>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  {facts.map((f) => (
                    <div key={f.label} className="border-b border-[#2A1A14]/10 pb-3">
                      <dt className="text-xs text-[#6B4F43]">{f.label}</dt>
                      <dd className="mt-1 font-medium text-[#2A1A14]">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-[#F3EADF]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-serif text-3xl font-medium text-[#2A1A14]">You may also like</h2>
            <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <div key={p.id} data-reveal="slide"><ProductCard product={p} /></div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
