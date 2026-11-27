// Static storefront content. Fill in the empty strings to show them on the site;
// anything left empty is simply not rendered.
export const site = {
  name: "Ganapati Vastram",
  tagline: "Clothing and home textiles for the whole family",
  // Announcement bar above the header; messages fade from one to the next. Empty list = hidden.
  announcements: [
    "Clothing & home textiles for the whole family",
    "Sarees, kids wear, bedsheets, bath towels and more",
    "Order or enquire on WhatsApp: +91 9030000088",
  ],
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
  women: "/images/Elegant Teal Saree Portrait.png",
  men: "/images/men-collection.png",
  kids: "/images/kids-collection.png",
  "home-essentials": "/images/home-essentials-collection.png",
};

// The "Shop by collection" cards: only these collections, with these titles.
export const shopByCollection = [
  { handle: "women", title: "Women's Wear" },
  { handle: "men", title: "Men's Wear" },
  { handle: "kids", title: "Kids Wear" },
  { handle: "home-essentials", title: "Home Essentials" },
];

// Category tree for the Collections pages. Shopify collections are flat, so the grouping lives here.
// A node with `children` opens a page of sub-category cards; a node without opens its products.
// Handles are Shopify collection handles; the card title is the collection's title in Shopify.
export type CategoryNode = { handle: string; children?: CategoryNode[] };
const leaves = (...handles: string[]): CategoryNode[] => handles.map((handle) => ({ handle }));

export const categoryTree: CategoryNode[] = [
  {
    handle: "women",
    children: leaves(
      "sarees", "lehengas", "kurta-sets", "kurtas", "dresses", "tops", "women-t-shirts", "western-wear",
      "traditional-wear", "dupattas", "readymade-blouses", "leggings", "plazzos", "women-jeans",
      "women-sweaters", "women-shorts", "women-nightwear", "lingerie-nightwear", "bras", "petticoats",
      "south-indian-dress", "unstitched-dress-material", "unstitched-blouse-pieces"
    ),
  },
  {
    handle: "men",
    children: leaves(
      "t-shirts", "casual-shirts", "formal-shirts", "ramraj-shirts", "jeans", "casual-trousers",
      "formal-trousers", "track-pants-joggers", "mens-shorts", "sweatshirts-sweaters", "jacketsdenim-rain",
      "traditional-wear-1", "dhotis", "sleepwear", "vests", "briefs-trunks", "boxers", "briefs",
      "mens-active-t-shirts", "mens-swimwear", "fabric"
    ),
  },
  {
    handle: "kids",
    children: [
      {
        handle: "girls",
        children: leaves(
          "girls-frocks", "girls-party-wear-dresses", "kids-lehengas", "girls-t-shirts", "girls-clothing-sets",
          "kids-skirts-and-shorts", "girls-night-wear", "girls-jacket-sweaters-sweatshirts", "girls-innerwear"
        ),
      },
      {
        handle: "boys",
        children: leaves(
          "kids-shirts", "kids-jeans", "boys-t-shirts", "boys-clothing-sets", "boys-trousers", "boys-shorts",
          "boys-night-wear", "boys-trackpants-and-joggers", "boys-jacket-sweater-sweatshirts", "boys-innerwear",
          "boys-swimsuits"
        ),
      },
      ...leaves("infants", "infant-care", "kids-ethnic-wear", "kids-raincoats", "activity-toys", "toys-games"),
    ],
  },
  {
    handle: "home-essentials",
    children: [
      {
        handle: "bedroom",
        children: leaves("bedsheets", "bedding-sets", "blankets-quilts-dohars", "pillows-covers", "bed-covers", "mattress-protectors"),
      },
      {
        handle: "living-room",
        children: leaves("sofa-covers", "diwan-sets", "chair-pads-covers", "door-curtains", "carpets", "doormats", "floor-mats-dhurries"),
      },
      {
        handle: "bath",
        children: leaves("bath-towels", "hand-face-towels", "towel-sets", "bath-robes", "shower-curtains", "bath-accessories"),
      },
      {
        handle: "kitchen-decor",
        children: leaves("fridge-covers", "dining-covers", "candles", "wallpapers"),
      },
    ],
  },
];

/** Path from a top-level category down to `handle` (inclusive), or null if the handle is not in the tree. */
export function categoryPath(handle: string, nodes: CategoryNode[] = categoryTree): CategoryNode[] | null {
  for (const node of nodes) {
    if (node.handle === handle) return [node];
    const inner = node.children && categoryPath(handle, node.children);
    if (inner) return [node, ...inner];
  }
  return null;
}

export type NavItem = { href: string; label: string };

// Header navigation, in this order. Collection links use the Shopify collection handle.
export function buildNav(): NavItem[] {
  return [
    { href: "/", label: "Home" },
    { href: "/collections/new-arrivals", label: "New Arrivals" },
    { href: "/collections/women", label: "Women" },
    { href: "/collections/men", label: "Men" },
    { href: "/collections/kids", label: "Kids" },
    { href: "/collections/home-essentials", label: "Home Essentials" },
  ];
}

// Shopify collections shown in the "For kids" section, in this order.
export const kids = [
  { label: "Frocks", handle: "girls-frocks" },
  { label: "Lehengas", handle: "kids-lehengas" },
  { label: "Shirts (Boys)", handle: "kids-shirts" },
  { label: "Jeans (Boys)", handle: "kids-jeans" },
];

// Local images for the "For kids" tiles, keyed by collection handle (override the Shopify image).
export const kidsImages: Record<string, string> = {
  "girls-frocks": "/images/kids-frocks.png",
  "kids-lehengas": "/images/kids-lehengas.png",
  "kids-shirts": "/images/kids-shirts.png",
  "kids-jeans": "/images/kids-jeans.png",
};

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
