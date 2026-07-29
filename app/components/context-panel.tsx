"use client";

import { useState } from "react";
import { lookupOrders } from "@/app/lib/seed";
import type { Conversation, LookupOrder } from "@/app/lib/types";
import { Blueprint } from "./blueprint";

export function ContextPanel({ conversation }: { conversation: Conversation }) {
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const toggle = (key: string) =>
    setClosed((c) => ({ ...c, [key]: !c[key] }));

  const wp = conversation.platform === "wp";

  return (
    <aside className="grid min-h-0 grid-rows-[auto_1fr] border-l border-divider bg-bg">
      <div className="flex flex-col gap-2.75 border-b border-divider p-3.75 pb-3.25">
        <div className="flex items-start gap-2.75">
          <Blueprint className="flex size-11.5 flex-none items-center justify-center bg-accent-800 font-heading text-[17px] font-semibold tracking-[0.03em] text-bg">
            {conversation.initials}
          </Blueprint>
          <div className="min-w-0 flex-1">
            <div className="font-heading text-xl leading-[1.15] font-semibold">
              {conversation.name}
            </div>
            <div className="overflow-hidden text-[12.5px] text-ellipsis text-ink/62">
              {conversation.email}
            </div>
            <div className="mt-1.25 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.05em] text-ink/60">
              <span
                className={`block size-1.5 ${
                  conversation.online ? "bg-accent-600" : "bg-ink/35"
                }`}
              />
              <span>
                {conversation.online
                  ? "Online now · typing preview enabled"
                  : `Last seen ${conversation.lastSeen}`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.25">
          <span className="border border-accent-400 bg-accent-200 px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.07em] text-accent-900 uppercase">
            {conversation.channel === "email"
              ? "Email only"
              : wp
                ? "WordPress"
                : "Shopify"}
          </span>
          <span className="border border-divider px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.07em] text-ink/62 uppercase">
            {conversation.countryCode}
          </span>
          <span className="border border-divider px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.07em] whitespace-nowrap text-ink/62 uppercase">
            {conversation.durbin ? "Durbin matched" : "No Durbin record"}
          </span>
        </div>
      </div>

      <div className="min-h-0 overflow-x-hidden overflow-y-auto">
        <Section
          title="Identity"
          sectionKey="identity"
          closed={!!closed.identity}
          onToggle={toggle}
        >
          <Rows
            rows={[
              ["Name", conversation.name],
              ["Email", conversation.email],
              [
                "Profile image",
                conversation.durbin ? "Gravatar matched" : "Initials fallback",
              ],
              ["Country", `${conversation.country} · ${conversation.countryCode}`],
              ["Local time", conversation.localTime],
              [
                "Active status",
                conversation.online
                  ? "Online now"
                  : `Last seen ${conversation.lastSeen}`,
              ],
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
              ["IP address", conversation.ip],
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
            <div className="flex flex-col gap-2.5 px-3.5 py-2.75">
              <div>
                <div className="mb-1.5 font-mono text-[9.5px] tracking-[0.08em] text-ink/50 uppercase">
                  Active · {conversation.pluginsActive.length}
                </div>
                <div className="flex flex-wrap gap-1">
                  {conversation.pluginsActive.map((p) => (
                    <span
                      key={p}
                      className="border border-accent-400 bg-accent-100 px-1.5 py-0.5 font-mono text-[10.5px] text-accent-900"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              {conversation.pluginsInactive.length > 0 ? (
                <div>
                  <div className="mb-1.5 font-mono text-[9.5px] tracking-[0.08em] text-ink/50 uppercase">
                    Inactive · {conversation.pluginsInactive.length}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {conversation.pluginsInactive.map((p) => (
                      <span
                        key={p}
                        className="border border-dashed border-ink/26 px-1.5 py-0.5 font-mono text-[10.5px] text-ink/55"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="text-[11.5px] leading-[1.45] text-pretty text-ink/55">
                Pulled from Durbin telemetry — conflict triage without asking the
                customer to list anything.
              </div>
            </div>
          </Section>
        ) : null}

        <Section
          title="Order history"
          sectionKey="orders"
          closed={!!closed.orders}
          onToggle={toggle}
        >
          <OrdersSection key={conversation.id} conversation={conversation} />
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
                <div
                  key={page.path}
                  className="flex items-baseline gap-2 px-3.5 py-1"
                >
                  <span className="w-3.5 font-mono text-[9.5px] text-ink/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 overflow-hidden font-mono text-[11px] text-ellipsis whitespace-nowrap">
                    {page.path}
                  </span>
                  <span className="text-[11px] whitespace-nowrap text-ink/55">
                    {page.dwell}
                  </span>
                </div>
              ))}
              <div className="px-3.5 pt-1.75 pb-0.5 text-[11.5px] leading-[1.45] text-pretty text-ink/55">
                Intent before the customer explains it — the docs page they
                bounced off is usually the answer.
              </div>
            </div>
          </Section>
        ) : null}

        <Section
          title="Conversation history"
          sectionKey="history"
          closed={!!closed.history}
          onToggle={toggle}
        >
          <div className="py-1.5">
            {conversation.history.map((item) => (
              <div
                key={item.subject}
                className="border-b border-divider px-3.5 py-1.75 last:border-b-0"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="flex-1 text-[12.5px] leading-[1.35]">
                    {item.subject}
                  </span>
                  <span className="font-mono text-[9.5px] whitespace-nowrap text-ink/48">
                    {item.date}
                  </span>
                </div>
                <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.05em] text-ink/50 uppercase">
                  {item.meta}
                </div>
              </div>
            ))}
            {conversation.history.length === 0 ? (
              <div className="px-3.5 py-2 text-[12px] text-ink/55">
                No prior conversations.
              </div>
            ) : null}
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
  children,
}: {
  title: string;
  sectionKey: string;
  closed: boolean;
  onToggle: (key: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(sectionKey)}
        className="flex w-full items-center justify-between gap-2 border-b border-divider bg-ink/3 px-3.5 py-2.25 text-left hover:bg-ink/7"
      >
        <span className="font-heading text-[13px] font-semibold tracking-[0.09em] whitespace-nowrap uppercase">
          {title}
        </span>
        <span className="font-mono text-xs text-ink/55">{closed ? "+" : "–"}</span>
      </button>
      {!closed ? <div className="border-b border-divider">{children}</div> : null}
    </div>
  );
}

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <div className="py-1">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-[92px_1fr] gap-2.25 border-l-[3px] border-l-transparent py-1.25 pr-3.5 pl-2.75"
        >
          <span className="pt-0.5 font-mono text-[10px] tracking-[0.04em] text-ink/50 uppercase">
            {label}
          </span>
          <span className="text-[12.5px] leading-[1.45] break-words">
            {value || "—"}
          </span>
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
    <div className="flex flex-col gap-2.25 px-3.5 py-2.75">
      {conversation.orders.map((order) => (
        <Blueprint key={order.id} className="bg-bg px-2.75 py-2.25">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-[11px] tracking-[0.03em]">{order.id}</span>
            <span
              className={`border px-1.25 font-mono text-[9.5px] tracking-[0.07em] uppercase ${
                order.status === "Active"
                  ? "border-accent-400 bg-accent-200 text-accent-900"
                  : "border-divider text-ink/58"
              }`}
            >
              {order.status}
            </span>
          </div>
          <div className="mt-1 font-heading text-[14.5px] leading-[1.25] font-semibold">
            {order.product}
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-2 text-[11.5px] text-ink/60">
            <span>
              {order.date} · {order.total}
            </span>
            <span className="font-mono text-[9.5px]">matched by {order.match}</span>
          </div>
        </Blueprint>
      ))}
      {conversation.orders.length === 0 ? (
        <div className="text-[12px] leading-[1.45] text-ink/55">
          No orders auto-matched by email or site URL. Search manually below.
        </div>
      ) : null}

      <div className="border-t border-dashed border-ink/22 pt-2.25">
        <div className="mb-1.5 font-mono text-[9.5px] tracking-[0.08em] text-ink/50 uppercase">
          Manual lookup
        </div>
        <div className="flex gap-1.25">
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
            className="min-w-0 flex-1 border border-divider bg-surface px-2 py-1.25 text-xs outline-none focus-visible:border-accent"
          />
          <button
            type="button"
            onClick={lookup}
            className="border border-accent bg-accent px-2.5 py-1.25 text-[11px] tracking-[0.05em] text-bg uppercase hover:bg-accent-600 active:bg-accent-700"
          >
            Find
          </button>
        </div>

        {result ? (
          <Blueprint className="animate-rise mt-2.25 bg-accent-100 px-2.75 py-2.25">
            <div className="font-mono text-[11px]">
              {result.id} · {result.total}
            </div>
            <div className="mt-0.75 font-heading text-[14.5px] leading-[1.25] font-semibold">
              {result.product}
            </div>
            <div className="mt-0.75 text-[11.5px] text-ink/62">
              {result.date} · {result.status} · {result.owner}
            </div>
          </Blueprint>
        ) : null}
        {!result && missText ? (
          <div className="mt-2.25 border border-dashed border-ink/26 px-2.5 py-2 text-[11.5px] text-ink/60">
            {missText}
          </div>
        ) : null}
      </div>
    </div>
  );
}
