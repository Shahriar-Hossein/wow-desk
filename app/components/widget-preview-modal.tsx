"use client";

import { X } from "lucide-react";
import type { Conversation } from "@/app/lib/types";

export function WidgetPreviewModal({
  conversation,
  onClose,
}: {
  conversation: Conversation;
  onClose: () => void;
}) {
  const wp = conversation.platform === "wp";
  const widgetUrl =
    (conversation.siteUrl || "northsidegear.com") +
    (wp ? "/product/trail-jacket/" : "/products/field-kit");
  const hostLabel = `Host site · ${wp ? "WooCommerce storefront" : "Shopify storefront"}`;
  const widgetTitle = `${(conversation.plugin || "WPXPO").split(" ")[0]} Support`;
  const widgetThread = conversation.messages.filter((m) => m.from !== "note").slice(-3);

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/60 p-8">
      <div className="flex h-full max-h-175 w-full max-w-280 flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xl font-semibold text-white">Embeddable chat widget</div>
            <div className="text-xs whitespace-nowrap text-white/60">
              One JS snippet · Shadow DOM isolation · &lt;40KB gzipped
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-md border border-white/25 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10"
          >
            <X className="size-3.5" />
            Close
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-rows-[36px_1fr] overflow-hidden rounded-xl bg-card shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3">
            <span className="flex gap-1.5">
              <span className="block size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="block size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="block size-2.5 rounded-full bg-muted-foreground/30" />
            </span>
            <span className="rounded-md bg-background px-2 py-0.5 text-[11px] whitespace-nowrap text-muted-foreground">
              {widgetUrl}
            </span>
          </div>

          <div className="relative overflow-hidden p-6">
            <div className="grid h-full grid-cols-2 gap-5">
              <div className="flex flex-col gap-3">
                <div className="text-[11px] font-medium whitespace-nowrap text-muted-foreground uppercase">
                  {hostLabel}
                </div>
                <div className="flex flex-1 items-center justify-center rounded-lg bg-muted">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    product image
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="block h-3 w-[62%] rounded bg-muted" />
                  <span className="block h-2.5 w-[88%] rounded bg-muted" />
                  <span className="block h-2.5 w-[74%] rounded bg-muted" />
                </div>
              </div>
              <div />
            </div>

            <div className="absolute right-6 bottom-6 flex w-87 flex-col overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border">
              <div className="flex items-center gap-2.5 bg-primary px-3.5 py-3 text-primary-foreground">
                <img
                  src={conversation.avatar}
                  alt=""
                  className="size-7 flex-none rounded-full bg-primary-foreground/20"
                />
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{widgetTitle}</span>
                  <span className="block text-[10.5px] text-primary-foreground/75">
                    {conversation.assignee === "Unassigned"
                      ? "Usually replies in a few minutes"
                      : `${conversation.assignee.split(" ")[0]} is online · replies in ~4 min`}
                  </span>
                </span>
              </div>

              <div className="flex max-h-67 flex-col gap-2.5 overflow-y-auto bg-background p-3.5">
                {widgetThread.map((m) => {
                  const isCust = m.from === "cust";
                  return (
                    <div key={m.id} className={`flex ${isCust ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[84%] rounded-lg px-3 py-2 text-xs text-pretty ${
                          isCust ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5">
                <span className="flex-1 text-xs text-muted-foreground">Write a message…</span>
                <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                  Send
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/40 px-3 py-1.5 text-[10px] text-muted-foreground">
                <span>Powered by WowDesk</span>
                <span>Chat consent · separate from telemetry</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
