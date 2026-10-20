"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { demoContacts } from "@/app/lib/demo-contacts";
import { quickQuestions } from "@/app/lib/quick-questions";
import { useConversationsStore } from "@/app/lib/store";
import {
  PRODUCTS,
  initialsOf,
  timeNow,
  type Conversation,
  type Message,
  type Product,
} from "@/app/lib/types";

const LIVE_PREFIX = "live-";

export function liveConversationId(product: Product) {
  return `${LIVE_PREFIX}${product}`;
}

/** A floating chat launcher scoped to one product's demo storefront card.
 * Sending a message here creates (or appends to) that product's live
 * conversation in the shared store — visible immediately in the Inbox,
 * in any tab. */
export function ChatHead({ product }: { product: Product }) {
  const { conversations, setConversations } = useConversationsStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [seenCount, setSeenCount] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const contact = demoContacts[product];
  const info = PRODUCTS[product];

  const conversation = conversations.find((c) => c.id === liveConversationId(product));
  const messages = conversation?.messages ?? [];
  const hasUnseenReply =
    !open && messages.length > seenCount && messages.at(-1)?.from === "agent";

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, open]);

  const send = (override?: string) => {
    const text = (override ?? draft).trim();
    if (!text) return;
    setDraft("");

    const message: Message = { id: `v${Date.now()}`, from: "cust", text, time: timeNow() };
    const id = liveConversationId(product);

    setConversations((cs) => {
      const existing = cs.find((c) => c.id === id);
      if (existing) {
        return cs.map((c) =>
          c.id === id ? { ...c, unread: c.unread + 1, messages: [...c.messages, message] } : c,
        );
      }

      const fresh: Conversation = {
        id,
        name: contact.name,
        email: `${contact.name.split(" ")[0].toLowerCase()}@${contact.site}`,
        initials: initialsOf(contact.name),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(contact.name)}`,
        subject: `New message via the ${info.name} widget`,
        status: "open",
        priority: "Medium",
        product,
        assignee: "Unassigned",
        time: "now",
        ticket: `LIVE-${product.toUpperCase()}`,
        tags: ["live-demo"],
        channel: "chat",
        platform: product === "wowoptin" ? "shopify" : "wp",
        unread: 1,
        online: true,
        lastSeen: "",
        day: "Today · live demo",
        country: "—",
        countryCode: "—",
        timezone: "UTC",
        ip: "—",
        browser: "—",
        phone: "—",
        location: contact.site,
        siteUrl: contact.site,
        theme: "—",
        plugin: info.name,
        wp: "—",
        durbin: false,
        consentTelemetry: "N/A · live widget demo",
        consentChat: "Granted · this session",
        pluginsActive: [],
        pluginsInactive: [],
        customerSince: "—",
        totalSpent: "—",
        lastOrderDate: "—",
        orders: [],
        pages: [],
        history: [],
        messages: [message],
      };
      return [fresh, ...cs];
    });
  };

  return (
    <>
      {open ? (
        <div className="absolute right-4 bottom-16 z-20 flex h-96 w-72 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between gap-2 px-3.5 py-3 text-primary-foreground" style={{ backgroundColor: info.color }}>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Chat with WPXPO</p>
              <p className="truncate text-[11px] opacity-85">{info.name} support</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 hover:bg-white/15"
              aria-label="Close chat"
            >
              <X className="size-4" />
            </button>
          </div>

          <div ref={scroller} className="flex flex-1 flex-col gap-2 overflow-y-auto bg-background p-3">
            {messages.length === 0 ? (
              <div className="m-auto flex max-w-56 flex-col items-center gap-3 text-center">
                <p className="text-xs text-muted-foreground">
                  Send a message as {contact.name} — it lands in the agent inbox instantly.
                </p>
                <div className="flex flex-col gap-1.5">
                  {quickQuestions[product].map((q) => (
                    <button
                      key={q}
                      type="button"
                      data-question={q}
                      onClick={(e) => send(e.currentTarget.dataset.question)}
                      className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-left text-xs hover:bg-muted"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages
                .filter((m) => m.from !== "note")
                .map((m) => {
                  const mine = m.from === "cust";
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[82%] rounded-lg px-2.5 py-1.5 text-xs text-pretty ${
                          mine ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          <div className="flex gap-1.5 border-t border-border bg-card p-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Type a message…"
              className="flex-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus-visible:border-ring"
            />
            <button
              type="button"
              onClick={() => send()}
              aria-label="Send message"
              className="flex size-8 flex-none items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="size-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setSeenCount(messages.length);
        }}
        aria-label={open ? "Close chat" : "Open chat"}
        className="absolute right-4 bottom-4 z-20 flex size-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105"
        style={{ backgroundColor: info.color }}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
        {hasUnseenReply ? (
          <span className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-red-500 ring-2 ring-background" />
        ) : null}
      </button>
    </>
  );
}
