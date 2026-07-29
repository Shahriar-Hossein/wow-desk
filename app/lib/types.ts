export type Status = "open" | "pending" | "resolved" | "snoozed";
export type Channel = "chat" | "email";
export type Platform = "wp" | "shopify";
export type MessageFrom = "cust" | "agent" | "note";
export type DeliveryStatus = "sent" | "delivered" | "seen" | "";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type Product =
  | "postx"
  | "wowstore"
  | "wholesalex"
  | "wowaddons"
  | "wowrevenue"
  | "wowinvoice"
  | "wowoptin";

export type Message = {
  id: string;
  from: MessageFrom;
  text: string;
  time: string;
  author?: string;
  attach?: string;
  status?: DeliveryStatus;
};

export type Order = {
  id: string;
  product: string;
  total: string;
  date: string;
  status: string;
  match: string;
};

/** An order found by the manual lookup, which searches across all
 * customers rather than the active conversation's own orders. */
export type LookupOrder = Omit<Order, "match"> & { owner: string };

export type PageVisit = {
  path: string;
  dwell: string;
};

export type HistoryItem = {
  subject: string;
  date: string;
  meta: string;
};

export type Conversation = {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar: string;
  subject: string;
  status: Status;
  priority: Priority;
  product: Product;
  assignee: string;
  time: string;
  ticket: string;
  tags: string[];
  channel: Channel;
  platform: Platform;
  unread: number;
  online: boolean;
  lastSeen: string;
  day: string;

  country: string;
  countryCode: string;
  timezone: string;
  ip: string;
  browser: string;
  phone: string;
  location: string;

  siteUrl: string;
  theme: string;
  plugin: string;
  wp: string;
  durbin: boolean;

  consentTelemetry: string;
  consentChat: string;

  pluginsActive: string[];
  pluginsInactive: string[];

  customerSince: string;
  totalSpent: string;
  lastOrderDate: string;

  orders: Order[];
  pages: PageVisit[];
  history: HistoryItem[];

  messages: Message[];
};

export const CURRENT_AGENT = "Shihab A.";

export function timeNow() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Live wall-clock time in an IANA timezone, e.g. "4:42:03 PM". */
export function customerLocalTime(timezone: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString();
  }
}

/** Short zone abbreviation, e.g. "PDT", for an IANA timezone id. */
export function timezoneAbbr(timezone: string) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value ?? "UTC";
  } catch {
    return "UTC";
  }
}

export const AGENTS = ["Nabil H.", "Tanjila R.", "Rashed K.", "Shihab A."];

export const STATUSES: Status[] = ["open", "pending", "resolved", "snoozed"];

export const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Urgent"];

export const PRIORITY_STYLES: Record<Priority, string> = {
  Low: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  Medium: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  High: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  Urgent: "bg-red-500/15 text-red-700 dark:text-red-300",
};

export const PRODUCTS: Record<Product, { name: string; color: string }> = {
  postx: { name: "PostX", color: "#3B82F6" },
  wowstore: { name: "WowStore", color: "#8B5CF6" },
  wholesalex: { name: "WholesaleX", color: "#EC4899" },
  wowaddons: { name: "WowAddons", color: "#10B981" },
  wowrevenue: { name: "WowRevenue", color: "#F59E0B" },
  wowinvoice: { name: "WowInvoice", color: "#06B6D4" },
  wowoptin: { name: "WowOptin", color: "#EF4444" },
};

export const ALL_TAGS = [
  "wowstore",
  "wowrevenue",
  "wowoptin",
  "license",
  "conflict",
  "bug",
  "refund",
  "review",
  "billing",
  "shopify",
  "pre-sales",
];

export const ASSIGNEE_FILTERS = [
  { value: "all", label: "Any assignee" },
  { value: "Unassigned", label: "Unassigned" },
  ...AGENTS.map((agent) => ({ value: agent, label: agent })),
];

export const MESSAGE_TYPES: Channel[] = ["chat", "email"];

export const PLATFORM_FILTERS = [
  { value: "all", label: "Any platform" },
  { value: "wp", label: "WordPress" },
  { value: "shopify", label: "Shopify" },
  { value: "email", label: "Email channel" },
];
