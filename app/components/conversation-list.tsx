"use client";

import { useMemo, useState } from "react";
import {
  ASSIGNEE_FILTERS,
  PLATFORM_FILTERS,
  STATUSES,
  type Conversation,
  type Status,
} from "@/app/lib/types";

const STATUS_FILTERS: { value: "all" | Status; label: string }[] = [
  { value: "all", label: "All" },
  ...STATUSES.map((status) => ({ value: status, label: status })),
];

export function ConversationList({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState<"all" | Status>("all");
  const [fAssignee, setFAssignee] = useState("all");
  const [fPlatform, setFPlatform] = useState("all");

  const shown = useMemo(() => {
    const query = q.trim().toLowerCase();
    return conversations.filter((c) => {
      if (fStatus !== "all" && c.status !== fStatus) return false;
      if (fAssignee !== "all" && c.assignee !== fAssignee) return false;
      if (fPlatform !== "all") {
        if (fPlatform === "email" ? c.channel !== "email" : c.platform !== fPlatform)
          return false;
      }
      if (query) {
        const haystack = [c.name, c.email, c.subject, c.siteUrl, c.tags.join(" ")]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [conversations, q, fStatus, fAssignee, fPlatform]);

  const filtersOn =
    q.trim() !== "" || fStatus !== "all" || fAssignee !== "all" || fPlatform !== "all";
  const unassignedCount = conversations.filter((c) => c.assignee === "Unassigned").length;
  const unreadCount = conversations.reduce((n, c) => n + c.unread, 0);

  return (
    <aside className="grid min-h-0 grid-rows-[auto_1fr] border-r border-divider">
      <div className="flex flex-col gap-2.25 border-b border-divider p-3.25 pb-2.5">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search conversations, contacts, tags…"
          className="w-full border border-divider bg-surface px-2.5 py-1.5 text-[13px] outline-none focus-visible:border-accent"
        />

        <div className="flex flex-wrap gap-1.25">
          {STATUS_FILTERS.map((chip) => {
            const on = fStatus === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => setFStatus(chip.value)}
                className={`border px-1.75 py-1 font-heading text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap uppercase ${
                  on
                    ? "border-accent-800 bg-accent-800 text-bg"
                    : "border-divider text-ink/65"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <select
            value={fAssignee}
            onChange={(e) => setFAssignee(e.target.value)}
            className="w-full border border-divider bg-surface px-1.75 py-1.25 text-xs outline-none focus-visible:border-accent"
          >
            {ASSIGNEE_FILTERS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={fPlatform}
            onChange={(e) => setFPlatform(e.target.value)}
            className="w-full border border-divider bg-surface px-1.75 py-1.25 text-xs outline-none focus-visible:border-accent"
          >
            {PLATFORM_FILTERS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.04em] text-ink/50">
          <span>
            {shown.length} of {conversations.length} · {unassignedCount} unassigned ·{" "}
            {unreadCount} unread
          </span>
          {filtersOn ? (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setFStatus("all");
                setFAssignee("all");
                setFPlatform("all");
              }}
              className="px-1 text-[10px] tracking-[0.04em] text-accent uppercase hover:bg-accent/10 active:bg-accent/18"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 overflow-x-hidden overflow-y-auto">
        {shown.map((c) => {
          const on = c.id === activeId;
          const last = c.messages.at(-1);
          const preview = last
            ? (last.from === "cust" ? "" : last.from === "note" ? "Note · " : "You · ") +
              last.text
            : "";
          const platformLabel =
            c.channel === "email" ? "MAIL" : c.platform === "wp" ? "WP" : "SHOP";

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={`grid w-full grid-cols-[32px_1fr] gap-2.5 border-b border-divider px-3.25 py-2.75 text-left last:border-b-0 ${
                on
                  ? "border-l-[3px] border-l-accent-800 bg-accent-100"
                  : "border-l-[3px] border-l-transparent hover:bg-ink/5"
              }`}
            >
              <div
                className={`flex size-8 items-center justify-center border font-heading text-xs font-semibold tracking-[0.03em] ${
                  on
                    ? "border-accent-800 bg-accent-800 text-bg"
                    : "border-divider text-ink/70"
                }`}
              >
                {c.initials}
              </div>

              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="flex-1 truncate font-heading text-[15px] font-semibold">
                    {c.name}
                  </span>
                  <span className="border border-divider px-1 font-mono text-[9px] tracking-[0.06em] text-ink/58">
                    {platformLabel}
                  </span>
                  <span className="whitespace-nowrap text-[10.5px] text-ink/50">
                    {c.time}
                  </span>
                </div>
                <div className="line-clamp-1 text-[12.5px] leading-[1.35] text-ink/78">
                  {c.subject}
                </div>
                <div className="line-clamp-1 text-xs leading-[1.35] text-ink/50">
                  {preview}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.25">
                  <span
                    className={`border px-1.25 font-mono text-[9px] tracking-[0.07em] uppercase ${
                      on
                        ? "border-accent-800 bg-accent-800 text-bg"
                        : "border-divider text-ink/58"
                    }`}
                  >
                    {c.status}
                  </span>
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[9px] tracking-[0.05em] text-ink/55"
                    >
                      #{t}
                    </span>
                  ))}
                  <span className="flex-1" />
                  {c.unread > 0 ? (
                    <span className="flex h-4 min-w-4 items-center justify-center bg-accent-800 px-1 font-heading text-[10px] font-semibold text-bg">
                      {c.unread}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}

        {shown.length === 0 ? (
          <div className="px-4 py-7 text-center text-[12.5px] text-ink/55">
            No conversations match these filters.
          </div>
        ) : null}
      </div>
    </aside>
  );
}
