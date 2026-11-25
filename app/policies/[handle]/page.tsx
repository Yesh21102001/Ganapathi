import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPolicies } from "@/lib/shopify";
import PageHero from "@/components/PageHero";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const policy = (await getPolicies().catch(() => [])).find((p) => p.handle === handle);
  return { title: policy?.title ?? "Policy" };
}

export default async function PolicyPage({ params }: Props) {
  const { handle } = await params;
  const policy = (await getPolicies()).find((p) => p.handle === handle);
  if (!policy) notFound();

  return (
    <>
      <PageHero title={policy.title} eyebrow="Store policy" crumbs={[{ label: policy.title }]} />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        {/* Merchant-authored HTML served by the Shopify Storefront API. */}
        <div className="shop-prose" dangerouslySetInnerHTML={{ __html: policy.body }} />
      </article>
    </>
  );
}
