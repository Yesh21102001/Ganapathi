// Static storefront content. Fill in the empty strings to show them on the site;
// anything left empty is simply not rendered.
export const site = {
  name: "Ganapati Vastram",
  tagline: "Clothing and home textiles for the whole family",
  offer: "", // e.g. "Free shipping above ₹999"
  address: "",
  phone: "",
  email: "",
  trust: {
    shipping: "[Shipping promise]",
    returns: "[Returns policy]",
    payment: "[Payment options]",
    support: "[Customer support contact]",
  },
};

// Collections that should lead the navigation when they exist in Shopify.
// Everything else Shopify returns follows in its own order.
export const priorityHandles = ["women", "men", "kids", "home-essentials"];

export type NavItem = { href: string; label: string };

export function buildNav(collections: { handle: string; title: string }[]): NavItem[] {
  const rank = (h: string) => {
    const i = priorityHandles.indexOf(h);
    return i === -1 ? priorityHandles.length : i;
  };
  const sorted = [...collections].sort((a, b) => rank(a.handle) - rank(b.handle));
  return [
    { href: "/products", label: "Shop all" },
    ...sorted.slice(0, 5).map((c) => ({ href: `/collections/${c.handle}`, label: c.title })),
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
}

export const kids = [
  { key: "boys", title: "Boys", blurb: "T-shirts, jeans, ethnic wear, clothing sets" },
  { key: "girls", title: "Girls", blurb: "Frocks, party wear, lehengas, clothing sets" },
  { key: "infants", title: "Infants", blurb: "Infant care" },
  { key: "toys-games", title: "Toys & games", blurb: "Activity toys" },
];

export const kidsBrands = ["Bhavika", "Akka Chelli", "Urban Urge", "Teko Fest"];

// Customer reviews shown on the home page. Shopify's Storefront API does not expose
// reviews, so replace these placeholders with real customer quotes.
// Set to [] to hide the section.
export const reviews = [
  { name: "[Customer name]", location: "[City]", rating: 5, text: "[Customer review: what they bought and what they liked about it.]" },
  { name: "[Customer name]", location: "[City]", rating: 5, text: "[Customer review: what they bought and what they liked about it.]" },
  { name: "[Customer name]", location: "[City]", rating: 5, text: "[Customer review: what they bought and what they liked about it.]" },
];
