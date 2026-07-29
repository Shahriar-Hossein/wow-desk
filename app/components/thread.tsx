"use client";

import { ChevronDown, Code2, Paperclip, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cannedReplies } from "@/app/lib/seed";
import { ALL_TAGS, AGENTS, STATUSES, type Conversation, type Status } from "@/app/lib/types";
import { Badge } from "./badge";
import { PopoverOption, PopoverPanel } from "./popover-panel";

type Popover = "status" | "assignee" | "tag" | "canned" | null;
type ComposeMode = "reply" | "note";

export function Thread({
  conversation,
  onStatusChange,
  onAssigneeChange,
  onAddTag,
  onRemoveTag,
  onSend,
  onPreviewWidget,
  typingConvId,
  typingText,
}: {
  conversation: Conversation;
  onStatusChange: (status: Status) => void;
  onAssigneeChange: (assignee: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onSend: (text: string, mode: ComposeMode) => void;
  onPreviewWidget: () => void;
  typingConvId: string | null;
  typingText: string;
}) {
  const [popover, setPopover] = useState<Popover>(null);
  const [mode, setMode] = useState<ComposeMode>("reply");
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const typing = typingConvId === conversation.id;

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation.messages.length, typing]);

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setPopover(null);
    onSend(text, mode);
  };

  const untaggedOptions = ALL_TAGS.filter((t) => !conversation.tags.includes(t));

  return (
    <main className="grid min-h-0 flex-1 grid-rows-[auto_1fr_auto] bg-background">
      <div className="border-b border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="font-semibold text-foreground">{conversation.subject}</h2>
          <div className="flex flex-none items-center gap-2">
            <span className="text-xs whitespace-nowrap text-muted-foreground">
              {conversation.ticket} · {conversation.channel === "email" ? "email" : "web chat"}
            </span>
            <button
              type="button"
              onClick={onPreviewWidget}
              title="Preview the embeddable chat widget"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Code2 className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPopover(popover === "status" ? null : "status")}
              className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground capitalize"
            >
              {conversation.status}
              <ChevronDown className="size-3" />
            </button>
            {popover === "status" ? (
              <PopoverPanel onClose={() => setPopover(null)} className="top-full left-0 mt-1.5 w-40">
                {STATUSES.map((s) => (
                  <PopoverOption
                    key={s}
                    mark={conversation.status === s ? "current" : undefined}
                    onClick={() => {
                      onStatusChange(s);
                      setPopover(null);
                    }}
                  >
                    {s}
                  </PopoverOption>
                ))}
              </PopoverPanel>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setPopover(popover === "assignee" ? null : "assignee")}
              className="flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted"
            >
              {conversation.assignee === "Unassigned" ? "Unassigned" : conversation.assignee}
              <ChevronDown className="size-3" />
            </button>
            {popover === "assignee" ? (
              <PopoverPanel onClose={() => setPopover(null)} className="top-full left-0 mt-1.5 w-44">
                {[...AGENTS, "Unassigned"].map((a) => (
                  <PopoverOption
                    key={a}
                    mark={conversation.assignee === a ? "current" : undefined}
                    onClick={() => {
                      onAssigneeChange(a);
                      setPopover(null);
                    }}
                  >
                    {a}
                  </PopoverOption>
                ))}
              </PopoverPanel>
            ) : null}
          </div>

          <span className="h-4 w-px bg-border" />

          {conversation.tags.map((t) => (
            <Badge key={t} className="gap-1 bg-muted/80 text-foreground">
              #{t}
              <button
                type="button"
                onClick={() => onRemoveTag(t)}
                aria-label={`Remove tag ${t}`}
                className="text-xs leading-none opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </Badge>
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={() => setPopover(popover === "tag" ? null : "tag")}
              className="rounded-md border border-dashed border-muted-foreground/40 px-2 py-1 text-xs whitespace-nowrap text-muted-foreground hover:bg-muted"
            >
              + tag
            </button>
            {popover === "tag" ? (
              <PopoverPanel
                onClose={() => setPopover(null)}
                className="top-full left-0 mt-1.5 max-h-58 w-40 overflow-y-auto"
              >
                {untaggedOptions.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-muted-foreground">All tags applied.</div>
                ) : (
                  untaggedOptions.map((t) => (
                    <PopoverOption
                      key={t}
                      onClick={() => {
                        onAddTag(t);
                        setPopover(null);
                      }}
                    >
                      #{t}
                    </PopoverOption>
                  ))
                )}
              </PopoverPanel>
            ) : null}
          </div>

          <span className="flex-1" />
          <button
            type="button"
            onClick={() => onStatusChange("resolved")}
            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Resolve
          </button>
        </div>
      </div>

      <div ref={scroller} className="flex min-h-0 flex-col gap-4 overflow-y-auto p-4">
        <div className="flex flex-none items-center gap-2.5">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-medium whitespace-nowrap text-muted-foreground uppercase">
            {conversation.day}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {conversation.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            customerName={conversation.name}
            customerEmail={conversation.email}
          />
        ))}

        {typing ? (
          <div className="flex flex-none justify-start">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2">
                <span className="flex gap-1">
                  <span className="animate-typing-dot size-1.5 rounded-full bg-primary" />
                  <span
                    className="animate-typing-dot size-1.5 rounded-full bg-primary"
                    style={{ animationDelay: "180ms" }}
                  />
                  <span
                    className="animate-typing-dot size-1.5 rounded-full bg-primary"
                    style={{ animationDelay: "360ms" }}
                  />
                </span>
                <span className="text-sm text-muted-foreground italic">{typingText || "…"}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Composer
        key={conversation.id}
        conversation={conversation}
        mode={mode}
        setMode={setMode}
        draft={draft}
        setDraft={setDraft}
        popover={popover}
        setPopover={setPopover}
        onSubmit={submit}
      />
    </main>
  );
}

const TICK_LABEL: Record<string, string> = {
  sent: "✓ sent",
  delivered: "✓✓ delivered",
  seen: "✓✓ seen",
};

function MessageBubble({
  message,
  customerName,
  customerEmail,
}: {
  message: Conversation["messages"][number];
  customerName: string;
  customerEmail: string;
}) {
  const isCust = message.from === "cust";
  const isNote = message.from === "note";

  const bubbleClass = isNote
    ? "border-2 border-dashed border-primary/40 bg-primary/10 text-foreground"
    : isCust
      ? "bg-muted text-foreground"
      : "bg-primary text-primary-foreground";

  const badge = isNote
    ? "internal note · not visible to customer"
    : isCust
      ? customerEmail
      : "agent";

  const author = isCust ? customerName : message.author;

  const tick = isCust
    ? message.time
    : message.time + (message.status ? ` · ${TICK_LABEL[message.status]}` : "");

  return (
    <div className={`flex flex-none ${isCust ? "justify-start" : "justify-end"}`}>
      <div
        className={`flex max-w-md min-w-0 flex-col gap-1 ${isCust ? "items-start" : "items-end"}`}
      >
        <div className="flex max-w-full items-baseline gap-1.5 text-[11px] whitespace-nowrap text-muted-foreground">
          <span className="flex-none font-medium">{author}</span>
          <span className="min-w-0 overflow-hidden text-ellipsis">{badge}</span>
        </div>
        <div className={`rounded-lg px-4 py-2 text-sm text-pretty ${bubbleClass}`}>
          {message.text}
        </div>
        {message.attach ? (
          <div className="mt-0.5 flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5">
            <Paperclip className="size-3.5 text-muted-foreground" />
            <span className="text-xs">{message.attach}</span>
          </div>
        ) : null}
        <div className="text-[11px] whitespace-nowrap opacity-70">{tick}</div>
      </div>
    </div>
  );
}

function Composer({
  conversation,
  mode,
  setMode,
  draft,
  setDraft,
  popover,
  setPopover,
  onSubmit,
}: {
  conversation: Conversation;
  mode: ComposeMode;
  setMode: (mode: ComposeMode) => void;
  draft: string;
  setDraft: (draft: string) => void;
  popover: Popover;
  setPopover: (popover: Popover) => void;
  onSubmit: () => void;
}) {
  const input = useRef<HTMLTextAreaElement>(null);
  const lastMessage = conversation.messages.at(-1);

  return (
    <div className="border-t border-border bg-card p-4">
      {mode === "reply" ? (
        <AiSuggestions
          key={lastMessage?.id ?? "none"}
          conversation={conversation}
          onPick={(s) => {
            setDraft(s);
            input.current?.focus();
          }}
        />
      ) : null}

      <div className="mb-2 flex gap-0">
        <button
          type="button"
          onClick={() => setMode("reply")}
          className={`rounded-l-md border px-3 py-1.5 text-xs font-medium ${
            mode === "reply"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground"
          }`}
        >
          Reply
        </button>
        <button
          type="button"
          onClick={() => setMode("note")}
          className={`-ml-px rounded-r-md border px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
            mode === "note"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground"
          }`}
        >
          Internal note
        </button>
        <span className="flex-1" />
        <span className="self-center text-[11px] whitespace-nowrap text-muted-foreground">
          {mode === "note" ? "⏎ saves · visible to your team only" : "⏎ sends · ⇧⏎ new line"}
        </span>
      </div>

      <textarea
        ref={input}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        rows={3}
        placeholder={
          mode === "note"
            ? "Internal note — @mention a teammate. Never shown to the customer."
            : `Reply to ${conversation.name}…`
        }
        className={`block w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${
          mode === "note" ? "border-primary/40 bg-primary/5" : "border-border bg-muted"
        }`}
      />

      <div className="mt-2 flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setPopover(popover === "canned" ? null : "canned")}
            className="flex items-center gap-1.5 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Canned responses"
          >
            <ChevronDown className="size-4" />
          </button>
          {popover === "canned" ? (
            <PopoverPanel onClose={() => setPopover(null)} className="bottom-full left-0 mb-2 w-80">
              {cannedReplies.map((reply) => (
                <button
                  key={reply.title}
                  type="button"
                  onClick={() => {
                    setDraft(reply.body);
                    setMode("reply");
                    setPopover(null);
                  }}
                  className="block w-full border-b border-border px-3 py-2 text-left last:border-b-0 hover:bg-muted"
                >
                  <span className="block text-sm font-medium">{reply.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {reply.body}
                  </span>
                </button>
              ))}
            </PopoverPanel>
          ) : null}
        </div>
        <button
          type="button"
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Paperclip className="size-4" />
        </button>
        <span className="flex-1" />
        <button
          type="button"
          onClick={onSubmit}
          disabled={!draft.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Send className="size-4" />
          {mode === "note" ? "Save note" : "Send reply"}
        </button>
      </div>
    </div>
  );
}

/** Remounted (via `key`) whenever the conversation's last message changes,
 * so each instance only ever fetches for one message — no stale-suggestion
 * reset needed inside the effect. */
function AiSuggestions({
  conversation,
  onPick,
}: {
  conversation: Conversation;
  onPick: (text: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const lastMessage = conversation.messages.at(-1);

  useEffect(() => {
    if (!lastMessage || lastMessage.from !== "cust") return;

    let cancelled = false;
    fetch("/api/ai-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversation.messages.map((m) => ({ content: m.text })),
        context: { priority: conversation.priority, type: conversation.channel },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSuggestions(data.suggestions ?? []);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- this instance is scoped to one lastMessage via `key`
  }, []);

  if (suggestions.length === 0) return null;

  return (
    <div className="mb-3 flex flex-col gap-1.5 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 p-3">
      <div className="mb-1 flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <p className="text-xs font-medium text-primary">AI Suggestions</p>
      </div>
      {suggestions.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onPick(s)}
          className="rounded-md bg-background px-2.5 py-1.5 text-left text-xs hover:bg-muted"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
