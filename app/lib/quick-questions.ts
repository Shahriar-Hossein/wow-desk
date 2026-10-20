import type { Product } from "./types";

/** Starter questions shown as tappable chips in the widget before a visitor
 * has sent their first message — lets them start the chat in one tap
 * instead of typing out a common issue. */
export const quickQuestions: Record<Product, string[]> = {
  postx: [
    "My print-on-demand order hasn't synced to the supplier",
    "How do I connect a new print provider?",
    "Product mockups aren't generating",
  ],
  wowstore: [
    "The product grid block isn't displaying correctly",
    "My license won't activate on this site",
    "How do I get a refund?",
  ],
  wholesalex: [
    "Wholesale pricing isn't showing for logged-in buyers",
    "How do I set up tiered bulk pricing?",
    "Buyer registration form isn't submitting",
  ],
  wowaddons: [
    "An addon isn't showing up in the editor",
    "How do I request a new addon?",
    "Addons broke after the last update",
  ],
  wowrevenue: [
    "Checkout upsell isn't showing the right currency",
    "How do I set up a frequently-bought-together offer?",
    "Bundle discount isn't applying at checkout",
  ],
  wowinvoice: [
    "I need a VAT invoice for a past order",
    "Invoice PDF isn't generating",
    "How do I add my company details to invoices?",
  ],
  wowoptin: [
    "The popup isn't firing on my storefront",
    "How do I target a popup to one page only?",
    "Does the popup work on mobile?",
  ],
};
