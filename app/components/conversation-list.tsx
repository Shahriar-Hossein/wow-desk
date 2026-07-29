"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  ASSIGNEE_FILTERS,
  PLATFORM_FILTERS,
  PRIORITIES,
  PRIORITY_STYLES,
  type Conversation,
  type Priority,
} from "@/app/lib/types";
import { Badge } from "./badge";
import { FilterDialog, type SelectedFilters } from "./filter-dialog";
import { NewConversationDialog } from "./new-conversation-dialog";

const EMPTY_FILTERS: SelectedFilters = { types: [], priorities: [], statuses: [], tags: [] };

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onCreate,
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: (email: string, name: string) => void;
}) {
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState<"All" | Priority>("All");
  const [advanced, setAdvanced] = useState<SelectedFilters>(EMPTY_FILTERS);
  const [fAssignee, setFAssignee] = useState("all");
  const [fPlatform, setFPlatform] = useState("all");

  const shown = useMemo(() => {
    const query = q.trim().toLowerCase();
    return conversations.filter((c) => {
      if (priority !== "All" && c.priority !== priority) return false;
      if (fAssignee !== "all" && c.assignee !== fAssignee) return false;
      if (fPlatform !== "all") {
        if (fPlatform === "email" ? c.channel !== "email" : c.platform !== fPlatform)
          return false;
      }
      if (advanced.types.length && !advanced.types.includes(c.channel)) return false;
      if (advanced.priorities.length && !advanced.priorities.includes(c.priority))
        return false;
      if (advanced.statuses.length && !advanced.statuses.includes(c.status)) return false;
      if (advanced.tags.length && !advanced.tags.some((t) => c.tags.includes(t)))
        return false;
      if (query) {
        const haystack = [c.name, c.email, c.subject, c.siteUrl, c.ticket, c.tags.join(" ")]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [conversations, q, priority, advanced, fAssignee, fPlatform]);

  const unreadCount = conversations.reduce((n, c) => n + c.unread, 0);

  return (
    <aside className="grid min-h-0 w-80 flex-none grid-rows-[auto_1fr_auto] border-r border-border bg-background">
      <div className="border-b border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Inbox</h2>
          <div className="flex items-center gap-2">
            <NewConversationDialog onCreate={onCreate} />
            <FilterDialog onApply={setAdvanced} />
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search conversations..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
          />
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {(["All", ...PRIORITIES] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                priority === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <select
            value={fAssignee}
            onChange={(e) => setFAssignee(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-2 py-1.25 text-xs outline-none focus-visible:border-ring"
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
            className="w-full rounded-md border border-border bg-background px-2 py-1.25 text-xs outline-none focus-visible:border-ring"
          >
            {PLATFORM_FILTERS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="min-h-0 overflow-y-auto">
        {shown.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        ) : (
          shown.map((c) => {
            const last = c.messages.at(-1);
            const preview = last
              ? (last.from === "cust" ? "" : last.from === "note" ? "Note · " : "You · ") +
                last.text
              : "No messages yet";

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c.id)}
                className={`w-full border-b border-border p-4 text-left transition-colors ${
                  c.id === activeId ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <div className="mb-2 flex items-start gap-2.5">
                  <img
                    src={c.avatar}
                    alt=""
                    className="size-9 flex-none rounded-full bg-muted"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.ticket}</p>
                  </div>
                  <Badge className={`flex-none whitespace-nowrap ${PRIORITY_STYLES[c.priority]}`}>
                    {c.priority}
                  </Badge>
                </div>
                <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{c.subject}</p>
                <p className="mb-2 line-clamp-1 text-xs text-muted-foreground/80">{preview}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {c.channel === "chat" ? "💬" : "📧"} {c.channel}
                  </span>
                  <span className="text-muted-foreground">{c.time}</span>
                </div>
                {c.unread > 0 ? (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="text-xs font-medium text-primary">{c.unread} new</span>
                  </div>
                ) : null}
              </button>
            );
          })
        )}
      </div>

      <div className="border-t border-border p-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-green-500" />
          Showing {shown.length} of {conversations.length} · {unreadCount} unread
        </div>
      </div>
    </aside>
  );
}
