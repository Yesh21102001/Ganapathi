// Static storefront content. Fill in the empty strings to show them on the site;
// anything left empty is simply not rendered.
export const site = {
  name: "Ganapati Vastram",
  tagline: "Clothing and home textiles for the whole family",
  offer: "", // e.g. "Free shipping above ₹999"
  address: "",
  phone: "+91 9030000088",
  whatsapp: "919030000088", // country code + number, digits only
  email: "ganapatiindustries23@gmail.com",
  social: {
    facebook: "https://www.facebook.com/ganapatiindustriesfactoryoutlet/",
    instagram: "https://www.instagram.com/ganapatiindustriesfo",
    youtube: "https://www.youtube.com/@ganapatiindustries5862",
  }, // profile URLs; empty = icon hidden
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

// Shopify collections shown as chips in the Home Essentials banner, in this order.
// `handle` is the Shopify collection handle; `label` is what the chip says.
export const homeCollections = [
  { label: "Bedsheets", handle: "bedsheets" },
  { label: "Pillows & Covers", handle: "pillows-covers" },
  { label: "Sofa Covers", handle: "sofa-covers" },
  { label: "Diwan Set Covers", handle: "diwan-sets" },
  { label: "Door Curtains", handle: "door-curtains" },
  { label: "Carpets", handle: "carpets" },
  { label: "Doormats", handle: "doormats" },
  { label: "Bath Towels", handle: "bath-towels" },
  { label: "Fridge Covers", handle: "fridge-covers" },
  { label: "Dining Covers", handle: "dining-covers" },
];

// Local images for the "Shop by collection" cards, keyed by collection handle.
// These take priority over the image set on the collection in Shopify.
export const collectionImages: Record<string, string> = {
  men: "/images/men-collection.png",
};

export type NavItem = { href: string; label: string };

export function buildNav(collections: { handle: string; title: string }[]): NavItem[] {
  const rank = (h: string) => {
    const i = priorityHandles.indexOf(h);
    return i === -1 ? priorityHandles.length : i;
  };
  const sorted = [...collections].sort((a, b) => rank(a.handle) - rank(b.handle));
  return [
    { href: "/products", label: "Shop" },
    ...sorted.slice(0, 5).map((c) => ({ href: `/collections/${c.handle}`, label: c.title })),
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
}

// Shopify collections shown in the "For kids" section, in this order.
export const kids = [
  { label: "Frocks", handle: "girls-frocks" },
  { label: "Lehengas", handle: "kids-lehengas" },
  { label: "Shirts (Boys)", handle: "kids-shirts" },
  { label: "Jeans (Boys)", handle: "kids-jeans" },
];

export const kidsBrands = ["Bhavika", "Akka Chelli", "Urban Urge", "Teko Fest"];

// Customer reviews shown on the home page. Shopify's Storefront API does not expose
// reviews, so replace these placeholders with real customer quotes.
// Add as many as you like; they scroll in a slider. Set to [] to hide the section.
export const reviews = [
  { name: "[Customer name]", location: "[City]", rating: 5, text: "[Customer review: what they bought and what they liked about it.]" },
  { name: "[Customer name]", location: "[City]", rating: 5, text: "[Customer review: what they bought and what they liked about it.]" },
  { name: "[Customer name]", location: "[City]", rating: 5, text: "[Customer review: what they bought and what they liked about it.]" },
  { name: "[Customer name]", location: "[City]", rating: 5, text: "[Customer review: what they bought and what they liked about it.]" },
  { name: "[Customer name]", location: "[City]", rating: 5, text: "[Customer review: what they bought and what they liked about it.]" },
  { name: "[Customer name]", location: "[City]", rating: 5, text: "[Customer review: what they bought and what they liked about it.]" },
  { name: "[Customer name]", location: "[City]", rating: 5, text: "[Customer review: what they bought and what they liked about it.]" },
  { name: "[Customer name]", location: "[City]", rating: 5, text: "[Customer review: what they bought and what they liked about it.]" },
];
