"use client";

import { useEffect, useRef, useState } from "react";
import { cannedReplies } from "@/app/lib/seed";
import { ALL_TAGS, AGENTS, STATUSES, type Conversation, type Status } from "@/app/lib/types";
import { Blueprint } from "./blueprint";
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
  typingConvId,
  typingText,
}: {
  conversation: Conversation;
  onStatusChange: (status: Status) => void;
  onAssigneeChange: (assignee: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onSend: (text: string, mode: ComposeMode) => void;
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
    <main className="grid min-h-0 grid-rows-[auto_1fr_auto] bg-ink/2">
      <div className="flex flex-col gap-2.25 border-b border-divider bg-bg px-4.5 py-2.75">
        <div className="flex items-baseline gap-3">
          <span className="flex-1 font-heading text-[19px] leading-[1.2] font-semibold">
            {conversation.subject}
          </span>
          <span className="font-mono text-[10px] tracking-[0.06em] text-ink/50">
            {conversation.ticket} · {conversation.channel === "email" ? "email" : "web chat"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.75">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPopover(popover === "status" ? null : "status")}
              className="border border-accent-800 bg-accent-800 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-bg uppercase"
            >
              {conversation.status} ▾
            </button>
            {popover === "status" ? (
              <PopoverPanel onClose={() => setPopover(null)} className="top-full left-0 mt-2 w-42">
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
              className="border border-divider px-2 py-1 font-mono text-[10px] tracking-[0.06em] hover:bg-ink/6"
            >
              {conversation.assignee === "Unassigned"
                ? "Unassigned ·"
                : `Assigned · ${conversation.assignee}`}{" "}
              ▾
            </button>
            {popover === "assignee" ? (
              <PopoverPanel onClose={() => setPopover(null)} className="top-full left-0 mt-2 w-47.5">
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

          <span className="h-4.5 w-px bg-divider" />

          {conversation.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.25 border border-divider px-1.5 py-0.75 font-mono text-[10px] tracking-[0.04em] text-ink/70"
            >
              #{t}
              <button
                type="button"
                onClick={() => onRemoveTag(t)}
                aria-label={`Remove tag ${t}`}
                className="text-[11px] leading-none"
              >
                ×
              </button>
            </span>
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={() => setPopover(popover === "tag" ? null : "tag")}
              className="border border-dashed border-ink/30 px-2 py-0.75 text-[11px] whitespace-nowrap text-ink/60 hover:bg-ink/6"
            >
              + tag
            </button>
            {popover === "tag" ? (
              <PopoverPanel
                onClose={() => setPopover(null)}
                className="top-full left-0 mt-2 max-h-58 w-43.5 overflow-y-auto"
              >
                {untaggedOptions.length === 0 ? (
                  <div className="px-2.75 py-2 text-[11.5px] text-ink/55">
                    All tags applied.
                  </div>
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
            className="border border-accent bg-accent px-3 py-1.25 text-xs tracking-[0.05em] text-bg uppercase hover:bg-accent-600 active:bg-accent-700"
          >
            Resolve
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex min-h-0 flex-col gap-3 overflow-x-hidden overflow-y-auto px-5.5 pt-4.5 pb-2"
      >
        <div className="mb-0.5 flex flex-none items-center gap-2.5">
          <span className="h-px flex-1 bg-divider" />
          <span className="font-mono text-[9.5px] tracking-[0.1em] whitespace-nowrap text-ink/45 uppercase">
            {conversation.day}
          </span>
          <span className="h-px flex-1 bg-divider" />
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
              <div className="flex items-center gap-2 border border-dashed border-ink/26 px-3 py-2">
                <span className="flex gap-1">
                  <span className="animate-typing-dot size-1.25 bg-accent-700" />
                  <span
                    className="animate-typing-dot size-1.25 bg-accent-700"
                    style={{ animationDelay: "180ms" }}
                  />
                  <span
                    className="animate-typing-dot size-1.25 bg-accent-700"
                    style={{ animationDelay: "360ms" }}
                  />
                </span>
                <span className="text-[13px] text-ink/60 italic">{typingText || "…"}</span>
              </div>
              <span className="font-mono text-[9.5px] tracking-[0.05em] text-ink/45">
                live typing preview
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-divider bg-bg px-4.5 pt-2.5 pb-3">
        <div className="mb-2.25 flex gap-0">
          <button
            type="button"
            onClick={() => setMode("reply")}
            className={`border px-3 py-1.25 font-heading text-xs font-semibold tracking-[0.08em] uppercase ${
              mode === "reply"
                ? "border-accent-800 bg-accent-800 text-bg"
                : "border-divider text-ink/60"
            }`}
          >
            Reply
          </button>
          <button
            type="button"
            onClick={() => setMode("note")}
            className={`-ml-px border px-3 py-1.25 font-heading text-xs font-semibold tracking-[0.08em] whitespace-nowrap uppercase ${
              mode === "note"
                ? "border-accent-800 bg-accent-800 text-bg"
                : "border-divider text-ink/60"
            }`}
          >
            Internal note
          </button>
          <span className="flex-1" />
          <span className="self-center font-mono text-[9.5px] tracking-[0.05em] whitespace-nowrap text-ink/45">
            {mode === "note" ? "⏎ saves · visible to your team only" : "⏎ sends · ⇧⏎ new line"}
          </span>
        </div>

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={3}
          placeholder={
            mode === "note"
              ? "Internal note — @mention a teammate. Never shown to the customer."
              : `Reply to ${conversation.name}…`
          }
          className={`block w-full resize-none border px-3 py-2.5 text-[13.5px] leading-[1.5] outline-none ${
            mode === "note" ? "border-accent-400 bg-accent-100" : "border-divider bg-bg"
          }`}
        />

        <div className="mt-2 flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPopover(popover === "canned" ? null : "canned")}
              className="border border-divider px-2.5 py-1.25 text-[11.5px] tracking-[0.05em] whitespace-nowrap uppercase hover:bg-ink/6"
            >
              Canned reply ▾
            </button>
            {popover === "canned" ? (
              <PopoverPanel
                onClose={() => setPopover(null)}
                className="bottom-full left-0 mb-2.25 w-82.5 shadow-(--shadow-lg)"
              >
                {cannedReplies.map((reply) => (
                  <button
                    key={reply.title}
                    type="button"
                    onClick={() => {
                      setDraft(reply.body);
                      setMode("reply");
                      setPopover(null);
                    }}
                    className="block w-full border-b border-divider px-3 py-2.25 text-left last:border-b-0 hover:bg-ink/6"
                  >
                    <span className="block font-heading text-[13px] font-semibold tracking-[0.03em]">
                      {reply.title}
                    </span>
                    <span className="block truncate text-[11.5px] leading-[1.4] text-ink/55">
                      {reply.body}
                    </span>
                  </button>
                ))}
              </PopoverPanel>
            ) : null}
          </div>
          <button
            type="button"
            className="border border-divider px-2.5 py-1.25 text-[11.5px] tracking-[0.05em] uppercase hover:bg-ink/6"
          >
            Attach
          </button>
          <span className="flex-1" />
          <button
            type="button"
            onClick={submit}
            className="border border-accent bg-accent px-4 py-1.5 text-xs tracking-[0.06em] whitespace-nowrap text-bg uppercase hover:bg-accent-600 active:bg-accent-700"
          >
            {mode === "note" ? "Save note" : "Send reply"}
          </button>
        </div>
      </div>
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
    ? "border border-dashed border-accent-400 bg-accent-100 text-accent-900"
    : isCust
      ? "border border-divider bg-transparent text-ink"
      : "border border-accent-800 bg-accent-800 text-bg";

  const badge = isNote
    ? "internal note · not visible to customer"
    : isCust
      ? customerEmail
      : "agent";

  const author = isCust ? customerName : message.author;

  const tick = isCust
    ? message.time
    : message.time + (message.status ? ` · ${TICK_LABEL[message.status]}` : "");
  const tickColor = message.status === "seen" ? "text-accent-700" : "text-ink/45";

  return (
    <div className={`flex flex-none ${isCust ? "justify-start" : "justify-end"}`}>
      <div
        className={`flex max-w-[74%] min-w-0 flex-col gap-0.75 ${
          isCust ? "items-start" : "items-end"
        }`}
      >
        <div className="flex max-w-full items-baseline gap-1.75 font-mono text-[9.5px] tracking-[0.05em] whitespace-nowrap text-ink/48">
          <span className="flex-none">{author}</span>
          <span className="min-w-0 overflow-hidden text-ellipsis">{badge}</span>
        </div>
        <div
          className={`flex-none px-3 py-2.25 text-[13.5px] leading-[1.5] text-pretty ${bubbleClass}`}
        >
          {message.text}
        </div>
        {message.attach ? (
          <Blueprint className="mt-0.75 flex flex-none items-center gap-2.25 bg-bg px-2.5 py-1.75">
            <span
              className="block size-6.5 border border-divider"
              style={{
                background:
                  "repeating-linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 22%, transparent) 0 3px, transparent 3px 6px)",
              }}
            />
            <span className="font-mono text-[10.5px] tracking-[0.03em]">{message.attach}</span>
          </Blueprint>
        ) : null}
        <div className={`font-mono text-[9.5px] tracking-[0.05em] whitespace-nowrap ${tickColor}`}>
          {tick}
        </div>
      </div>
    </div>
  );
}
