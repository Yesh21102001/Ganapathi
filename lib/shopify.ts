import "server-only";
import type {
  ShopifyCollection,
  ShopifyPage,
  ShopifyProduct,
} from "@/types/shopify";

const API_VERSION = "2026-01";

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  // Read at call time so a changed .env.local is picked up without surprises.
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !token) {
    throw new Error(
      "Shopify credentials are missing: set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local"
    );
  }

  const response = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed with HTTP ${response.status}`);
  }

  const result = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (result.errors?.length) {
    throw new Error(result.errors.map((e) => e.message).join(", "));
  }
  if (!result.data) throw new Error("Shopify returned no data");
  return result.data;
}

/** Run a Shopify call; on failure log it and return the fallback so one bad call doesn't take the page down. */
export async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error("[shopify]", error instanceof Error ? error.message : error);
    return fallback;
  }
}

const productFields = `
  id
  handle
  title
  description
  productType
  vendor
  tags
  availableForSale
  options { name values }
  featuredImage { url altText }
  images(first: 10) { nodes { url altText } }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
`;

const collectionFields = `
  id
  handle
  title
  description
  image { url altText }
`;

export type ProductSort = "CREATED_AT" | "BEST_SELLING" | "TITLE" | "PRICE";

export async function getProducts(
  first = 24,
  sortKey: ProductSort = "CREATED_AT",
  reverse = sortKey === "CREATED_AT"
) {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(
    `query Products($first: Int!, $sortKey: ProductSortKeys!, $reverse: Boolean!) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        nodes { ${productFields} }
      }
    }`,
    { first, sortKey, reverse }
  );
  return data.products.nodes;
}

export async function getCollections() {
  const data = await shopifyFetch<{ collections: { nodes: ShopifyCollection[] } }>(
    `query Collections { collections(first: 250) { nodes { ${collectionFields} } } }`
  );
  return data.collections.nodes;
}

export async function getProductByHandle(handle: string) {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
    `query Product($handle: String!) {
      product(handle: $handle) {
        ${productFields}
        descriptionHtml
        variants(first: 100) {
          nodes {
            id
            title
            availableForSale
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
          }
        }
      }
    }`,
    { handle }
  );
  return data.product;
}

export async function getCollectionByHandle(handle: string) {
  const data = await shopifyFetch<{
    collection: (ShopifyCollection & { products: { nodes: ShopifyProduct[] } }) | null;
  }>(
    `query Collection($handle: String!) {
      collection(handle: $handle) {
        ${collectionFields}
        products(first: 100) { nodes { ${productFields} } }
      }
    }`,
    { handle }
  );
  return data.collection;
}

export async function getPage(handle: string) {
  const data = await shopifyFetch<{ page: ShopifyPage | null }>(
    `query Page($handle: String!) { page(handle: $handle) { handle title body } }`,
    { handle }
  );
  return data.page;
}

export async function getPolicies() {
  const data = await shopifyFetch<{
    shop: Record<"privacyPolicy" | "shippingPolicy" | "refundPolicy" | "termsOfService", ShopifyPage | null>;
  }>(`query Policies {
    shop {
      privacyPolicy { handle title body }
      shippingPolicy { handle title body }
      refundPolicy { handle title body }
      termsOfService { handle title body }
    }
  }`);
  return Object.values(data.shop).filter((p): p is ShopifyPage => Boolean(p));
}
