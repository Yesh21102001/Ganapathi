export type ShopifyImage = {
  url: string;
  altText: string | null;
};

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  productType?: string;
  vendor?: string;
  tags?: string[];
  availableForSale?: boolean;
  options?: { name: string; values: string[] }[];
  variants?: { nodes: ShopifyVariant[] };
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  priceRange: { minVariantPrice: ShopifyMoney };
  compareAtPriceRange?: { minVariantPrice: ShopifyMoney };
};

export type ShopifyCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
};

export type ShopifyPage = { handle: string; title: string; body: string };
