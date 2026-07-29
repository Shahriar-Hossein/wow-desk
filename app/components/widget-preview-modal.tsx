"use client";

import type { Conversation } from "@/app/lib/types";
import { Blueprint } from "./blueprint";

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
    <div className="fixed inset-0 z-90 flex items-center justify-center bg-accent-900/78 p-7.5">
      <div className="flex h-full max-h-175 w-full max-w-280 flex-col gap-2.5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="font-heading text-[22px] font-semibold tracking-[0.04em] text-bg uppercase">
              Embeddable chat widget
            </div>
            <div className="font-mono text-[10.5px] tracking-[0.06em] whitespace-nowrap text-bg/72">
              One JS snippet · Shadow DOM isolation · &lt;40KB gzipped
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-bg/45 px-3.5 py-1.75 font-heading text-xs font-semibold tracking-[0.08em] text-bg uppercase hover:bg-bg/10"
          >
            Close
          </button>
        </div>

        <Blueprint className="grid min-h-0 flex-1 grid-rows-[34px_1fr] overflow-hidden bg-bg">
          <div className="flex items-center gap-2 border-b border-divider bg-ink/4 px-3">
            <span className="flex gap-1.25">
              <span className="block size-2 border border-ink/32" />
              <span className="block size-2 border border-ink/32" />
              <span className="block size-2 border border-ink/32" />
            </span>
            <span className="border border-divider px-2 font-mono text-[10.5px] whitespace-nowrap text-ink/60">
              {widgetUrl}
            </span>
          </div>

          <div className="relative overflow-hidden p-5.5">
            <div className="grid h-full grid-cols-2 gap-4.5">
              <div className="flex flex-col gap-3">
                <div className="font-mono text-[10px] tracking-[0.08em] whitespace-nowrap text-ink/42 uppercase">
                  {hostLabel}
                </div>
                <div
                  className="flex flex-1 items-center justify-center border border-divider"
                  style={{
                    background:
                      "repeating-linear-gradient(135deg, color-mix(in srgb, var(--color-ink) 5%, transparent) 0 6px, transparent 6px 12px)",
                  }}
                >
                  <span className="font-mono text-[10.5px] tracking-[0.06em] text-ink/45 uppercase">
                    product image
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="block h-3.25 w-[62%] bg-ink/14" />
                  <span className="block h-2.25 w-[88%] bg-ink/9" />
                  <span className="block h-2.25 w-[74%] bg-ink/9" />
                </div>
              </div>
              <div />
            </div>

            <Blueprint className="absolute right-6 bottom-6 flex w-87 flex-col bg-bg shadow-(--shadow-lg)">
              <div className="flex items-center gap-2.25 bg-accent-800 px-3.25 py-2.75 text-bg">
                <span className="flex size-6.5 items-center justify-center border border-bg/45 font-heading text-[11px] font-semibold">
                  {conversation.initials}
                </span>
                <span className="flex-1">
                  <span className="block font-heading text-[14.5px] font-semibold tracking-[0.03em]">
                    {widgetTitle}
                  </span>
                  <span className="block font-mono text-[9px] tracking-[0.06em] text-bg/78 uppercase">
                    {conversation.assignee === "Unassigned"
                      ? "Usually replies in a few minutes"
                      : `${conversation.assignee.split(" ")[0]} is online · replies in ~4 min`}
                  </span>
                </span>
                <span className="text-[15px] leading-none">–</span>
              </div>

              <div className="flex max-h-67 flex-col gap-2.25 overflow-y-auto p-3.25">
                {widgetThread.map((m) => {
                  const isCust = m.from === "cust";
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isCust ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[84%] px-2.75 py-2 text-[12.5px] leading-[1.45] text-pretty ${
                          isCust
                            ? "border border-accent-800 bg-accent-800 text-bg"
                            : "border border-divider bg-transparent text-ink"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 border-t border-divider px-2.75 py-2.25">
                <span className="flex-1 text-[12.5px] text-ink/40">Write a message…</span>
                <span className="bg-accent px-2.25 py-1 font-heading text-[11px] font-semibold tracking-[0.07em] text-bg uppercase">
                  Send
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-divider px-2.75 py-1.5 font-mono text-[8.5px] tracking-[0.06em] text-ink/45 uppercase">
                <span>Powered by WowDesk</span>
                <span>Chat consent · separate from telemetry</span>
              </div>
            </Blueprint>
          </div>
        </Blueprint>
      </div>
    </div>
  );
}
