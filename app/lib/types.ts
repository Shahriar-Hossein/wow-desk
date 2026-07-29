export type Status = "open" | "pending" | "resolved" | "snoozed";
export type Channel = "chat" | "email";
export type Platform = "wp" | "shopify";
export type MessageFrom = "cust" | "agent" | "note";
export type DeliveryStatus = "sent" | "delivered" | "seen" | "";

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
  subject: string;
  status: Status;
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
  localTime: string;
  ip: string;
  browser: string;

  siteUrl: string;
  theme: string;
  plugin: string;
  wp: string;
  durbin: boolean;

  consentTelemetry: string;
  consentChat: string;

  pluginsActive: string[];
  pluginsInactive: string[];

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

export const AGENTS = ["Nabil H.", "Tanjila R.", "Rashed K.", "Shihab A."];

export const STATUSES: Status[] = ["open", "pending", "resolved", "snoozed"];

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

export const PLATFORM_FILTERS = [
  { value: "all", label: "Any platform" },
  { value: "wp", label: "WordPress" },
  { value: "shopify", label: "Shopify" },
  { value: "email", label: "Email channel" },
];
