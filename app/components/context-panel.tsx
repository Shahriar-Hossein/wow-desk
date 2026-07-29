"use client";

import {
  CalendarIcon,
  ClockIcon,
  HistoryIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { lookupOrders } from "@/app/lib/seed";
import {
  PRIORITY_STYLES,
  customerLocalTime,
  timezoneAbbr,
  type Conversation,
  type LookupOrder,
} from "@/app/lib/types";
import { Badge } from "./badge";

export function ContextPanel({ conversation }: { conversation: Conversation }) {
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setClosed((c) => ({ ...c, [key]: !c[key] }));

  const wp = conversation.platform === "wp";
  const [localTime, setLocalTime] = useState(() => customerLocalTime(conversation.timezone));

  useEffect(() => {
    const id = setInterval(() => setLocalTime(customerLocalTime(conversation.timezone)), 1000);
    return () => clearInterval(id);
  }, [conversation.timezone]);

  return (
    <aside className="grid min-h-0 w-80 flex-none grid-rows-[auto_1fr] overflow-hidden border-l border-border bg-background">
      <div className="border-b border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-3">
          <img
            src={conversation.avatar}
            alt=""
            className="size-10 flex-none rounded-full bg-muted"
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{conversation.name}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {conversation.channel === "email" ? "Email only" : wp ? "WordPress" : "Shopify"}
            </p>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge className={PRIORITY_STYLES[conversation.priority]}>
            <TrendingUpIcon className="mr-1 size-3" />
            {conversation.priority} Priority
          </Badge>
          <Badge className="border border-border bg-transparent text-foreground">
            <ClockIcon className="mr-1 size-3" />
            {timezoneAbbr(conversation.timezone)}
          </Badge>
          <Badge className="border border-border bg-transparent text-foreground">
            {conversation.durbin ? "Durbin matched" : "No Durbin record"}
          </Badge>
        </div>

        <div className="flex gap-2">
          <a
            href={`https://wa.me/${conversation.phone.replace(/[^\d]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <MessageCircleIcon className="size-3.5" />
            WhatsApp
          </a>
        </div>
      </div>

      <div className="min-h-0 overflow-y-auto">
        <div className="border-b border-border p-4">
          <h4 className="mb-3 text-sm font-semibold text-foreground">Contact Info</h4>
          <div className="space-y-2 text-sm">
            <a
              href={`mailto:${conversation.email}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <MailIcon className="size-4 flex-none" />
              <span className="truncate">{conversation.email}</span>
            </a>
            <a
              href={`tel:${conversation.phone}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <PhoneIcon className="size-4 flex-none" />
              {conversation.phone}
            </a>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon className="size-4 flex-none" />
              {conversation.location}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ClockIcon className="size-4 flex-none" />
              <span className="text-xs">
                {localTime} ({timezoneAbbr(conversation.timezone)})
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-mono text-xs">{conversation.ip}</span>
            </div>
          </div>
        </div>

        <div className="border-b border-border p-4">
          <h4 className="mb-3 text-sm font-semibold text-foreground">Customer Info</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarIcon className="size-3.5" />
                Customer Since
              </span>
              <span className="font-medium text-foreground">{conversation.customerSince}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Spent</span>
              <span className="font-medium text-foreground">{conversation.totalSpent}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Order</span>
              <span className="font-medium text-foreground">{conversation.lastOrderDate}</span>
            </div>
          </div>
        </div>

        <Section
          title="Platform & session"
          sectionKey="platform"
          closed={!!closed.platform}
          onToggle={toggle}
        >
          <Rows
            rows={[
              [
                "Detected",
                conversation.channel === "email"
                  ? "No site detected · email channel"
                  : wp
                    ? "WordPress · WooCommerce"
                    : "Shopify · Online Store 2.0",
              ],
              ["Site URL", conversation.siteUrl],
              ["Browser", conversation.browser],
            ]}
          />
        </Section>

        <Section
          title="Consent state"
          sectionKey="consent"
          closed={!!closed.consent}
          onToggle={toggle}
        >
          <Rows
            rows={[
              ["Telemetry", conversation.consentTelemetry],
              ["Chat", conversation.consentChat],
            ]}
          />
        </Section>

        <Section
          title={wp ? "WordPress environment" : "Shopify store"}
          sectionKey="env"
          closed={!!closed.env}
          onToggle={toggle}
        >
          <Rows
            rows={[
              ["Platform", conversation.wp],
              ["Active theme", conversation.theme],
              ["WPXPO product", conversation.plugin],
            ]}
          />
        </Section>

        {conversation.pluginsActive.length > 0 ? (
          <Section
            title={wp ? "Installed plugins" : "Installed apps"}
            sectionKey="plugins"
            closed={!!closed.plugins}
            onToggle={toggle}
          >
            <div className="flex flex-col gap-3 px-4 py-3">
              <div>
                <div className="mb-1.5 text-xs font-medium text-muted-foreground">
                  Active · {conversation.pluginsActive.length}
                </div>
                <div className="flex flex-wrap gap-1">
                  {conversation.pluginsActive.map((p) => (
                    <Badge key={p} className="bg-primary/10 text-primary">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
              {conversation.pluginsInactive.length > 0 ? (
                <div>
                  <div className="mb-1.5 text-xs font-medium text-muted-foreground">
                    Inactive · {conversation.pluginsInactive.length}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {conversation.pluginsInactive.map((p) => (
                      <Badge key={p} className="border border-dashed border-border bg-transparent text-muted-foreground">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
              <p className="text-xs leading-relaxed text-pretty text-muted-foreground">
                Pulled from Durbin telemetry — conflict triage without asking the customer to
                list anything.
              </p>
            </div>
          </Section>
        ) : null}

        <Section
          title="Order history"
          sectionKey="orders"
          closed={!!closed.orders}
          onToggle={toggle}
        >
          <OrdersSection conversation={conversation} />
        </Section>

        {conversation.pages.length > 0 ? (
          <Section
            title="Browsed this session"
            sectionKey="pages"
            closed={!!closed.pages}
            onToggle={toggle}
          >
            <div className="py-2">
              {conversation.pages.map((page, i) => (
                <div key={page.path} className="flex items-baseline gap-2 px-4 py-1">
                  <span className="w-3.5 text-xs text-muted-foreground/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap">
                    {page.path}
                  </span>
                  <span className="text-xs whitespace-nowrap text-muted-foreground">
                    {page.dwell}
                  </span>
                </div>
              ))}
              <p className="px-4 pt-1.5 pb-0.5 text-xs leading-relaxed text-pretty text-muted-foreground">
                Intent before the customer explains it — the docs page they bounced off is
                usually the answer.
              </p>
            </div>
          </Section>
        ) : null}

        <Section
          title="Conversation history"
          sectionKey="history"
          closed={!!closed.history}
          onToggle={toggle}
          icon={<HistoryIcon className="size-4 text-muted-foreground" />}
        >
          <div className="py-1">
            {conversation.history.length === 0 ? (
              <div className="px-4 py-2 text-xs text-muted-foreground">
                No prior conversations.
              </div>
            ) : (
              conversation.history.map((item) => (
                <div
                  key={item.subject}
                  className="border-b border-border px-4 py-2 last:border-b-0"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="flex-1 text-xs">{item.subject}</span>
                    <span className="text-[11px] whitespace-nowrap text-muted-foreground">
                      {item.date}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground uppercase">
                    {item.meta}
                  </div>
                </div>
              ))
            )}
          </div>
        </Section>
      </div>
    </aside>
  );
}

function Section({
  title,
  sectionKey,
  closed,
  onToggle,
  icon,
  children,
}: {
  title: string;
  sectionKey: string;
  closed: boolean;
  onToggle: (key: string) => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(sectionKey)}
        className="flex w-full items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-2.5 text-left hover:bg-muted/60"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {icon}
          {title}
        </span>
        <span className="text-xs text-muted-foreground">{closed ? "+" : "−"}</span>
      </button>
      {!closed ? <div className="border-b border-border">{children}</div> : null}
    </div>
  );
}

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <div className="py-1">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[90px_1fr] gap-2 px-4 py-1.5 text-sm">
          <span className="pt-0.5 text-xs text-muted-foreground">{label}</span>
          <span className="leading-relaxed wrap-break-word">{value || "—"}</span>
        </div>
      ))}
    </div>
  );
}

function OrdersSection({ conversation }: { conversation: Conversation }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<LookupOrder | null>(null);
  const [missText, setMissText] = useState("");

  const lookup = () => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResult(null);
      setMissText("");
      return;
    }
    const hit = lookupOrders.find(
      (o) => o.id.toLowerCase().includes(q) || o.owner.toLowerCase().includes(q),
    );
    setResult(hit ?? null);
    setMissText(
      hit ? "" : `No order matches "${query.trim()}". Try the full order ID or the billing email.`,
    );
  };

  return (
    <div className="flex flex-col gap-2.5 px-4 py-3">
      <div className="mb-1 flex items-center gap-2">
        <ShoppingBagIcon className="size-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {conversation.orders.length} order{conversation.orders.length === 1 ? "" : "s"}
        </span>
      </div>

      {conversation.orders.map((order) => (
        <div key={order.id} className="rounded-lg border border-border bg-muted/50 p-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-medium">{order.id}</span>
            <Badge
              className={
                order.status === "Active"
                  ? "bg-green-500/15 text-green-700 dark:text-green-300"
                  : order.status === "Refunded"
                    ? "bg-red-500/15 text-red-700 dark:text-red-300"
                    : "border border-border bg-transparent text-muted-foreground"
              }
            >
              {order.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm font-semibold text-foreground">{order.product}</p>
          <div className="mt-1 flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {order.date} · {order.total}
            </span>
            <span>matched by {order.match}</span>
          </div>
        </div>
      ))}
      {conversation.orders.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No orders auto-matched by email or site URL. Search manually below.
        </p>
      ) : null}

      <div className="border-t border-dashed border-border pt-2.5">
        <div className="mb-1.5 text-xs font-medium text-muted-foreground">Manual lookup</div>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                lookup();
              }
            }}
            placeholder="Order ID or email"
            className="min-w-0 flex-1 rounded-md border border-border bg-background px-2 py-1.25 text-xs outline-none focus-visible:border-ring"
          />
          <button
            type="button"
            onClick={lookup}
            className="rounded-md bg-primary px-2.5 py-1.25 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Find
          </button>
        </div>

        {result ? (
          <div className="animate-rise mt-2 rounded-lg border border-primary/30 bg-primary/10 p-2.5">
            <div className="text-xs">
              {result.id} · {result.total}
            </div>
            <div className="mt-0.5 text-sm font-semibold text-foreground">{result.product}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {result.date} · {result.status} · {result.owner}
            </div>
          </div>
        ) : null}
        {!result && missText ? (
          <div className="mt-2 rounded-md border border-dashed border-border px-2.5 py-2 text-xs text-muted-foreground">
            {missText}
          </div>
        ) : null}
      </div>
    </div>
  );
}
