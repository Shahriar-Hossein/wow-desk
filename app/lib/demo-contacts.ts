import type { Product } from "./types";

/** One simulated visitor per product, for the live widget demo page. */
export const demoContacts: Record<Product, { name: string; site: string; tagline: string }> = {
  postx: {
    name: "Alex Rivera",
    site: "riveraprints.demo",
    tagline: "Print-on-demand storefront",
  },
  wowstore: {
    name: "Jordan Lee",
    site: "leegoods.demo",
    tagline: "WooCommerce general store",
  },
  wholesalex: {
    name: "Morgan Blake",
    site: "blakewholesale.demo",
    tagline: "B2B wholesale catalog",
  },
  wowaddons: {
    name: "Casey Kim",
    site: "kimcraft.demo",
    tagline: "Handmade goods marketplace",
  },
  wowrevenue: {
    name: "Riley Chen",
    site: "chenoutdoors.demo",
    tagline: "Outdoor gear checkout upsells",
  },
  wowinvoice: {
    name: "Taylor Brooks",
    site: "brooksconsulting.demo",
    tagline: "Consulting invoices & billing",
  },
  wowoptin: {
    name: "Sam Patel",
    site: "pateldesigns.myshopify.com",
    tagline: "Shopify popup campaigns",
  },
};
