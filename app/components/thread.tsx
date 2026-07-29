"use client";

import { useEffect, useRef, useState } from "react";
import { cannedReplies } from "@/app/lib/seed";
import { ASSIGNEES, type Conversation } from "@/app/lib/types";
import { Bubble } from "./site-preview";

export function Thread({
  conversation,
  onSend,
  onAssign,
}: {
  conversation: Conversation | undefined;
  onSend: (text: string) => void;
  onAssign: (assignee: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const messageCount = conversation?.messages.length ?? 0;

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messageCount, conversation?.id]);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-line px-4.5 py-3.25">
        <div>
          <div className="font-display text-[14.5px] font-semibold">
            {conversation?.name ?? "Select a conversation"}
          </div>
          <div className="mt-0.5 text-[11px] text-muted">
            {conversation?.email ?? ""}
          </div>
        </div>

        <select
          value={conversation?.assignee ?? "Unassigned"}
          onChange={(event) => onAssign(event.target.value)}
          disabled={!conversation}
          aria-label="Assign conversation"
          className="rounded-[7px] border border-line bg-white px-2.5 py-1.5 text-xs disabled:opacity-50"
        >
          {ASSIGNEES.map((assignee) => (
            <option key={assignee}>{assignee}</option>
          ))}
        </select>
      </div>

      <div
        ref={scroller}
        className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-[#fcfcfd] px-5 py-4.5"
      >
        {!conversation ? (
          <p className="m-auto max-w-65 text-center text-[13px] leading-relaxed text-muted">
            Pick a conversation from the left, or start one from the widget.
          </p>
        ) : conversation.messages.length === 0 ? (
          <p className="m-auto max-w-65 text-center text-[13px] leading-relaxed text-muted">
            No messages yet in this conversation.
          </p>
        ) : (
          conversation.messages.map((message) => (
            <Bubble
              key={message.id}
              message={message}
              mine="agent"
              className="max-w-[60%]"
            />
          ))
        )}
      </div>

      <Composer
        key={conversation?.id}
        disabled={!conversation}
        onSend={onSend}
      />
    </div>
  );
}

function Composer({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (text: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    onSend(text);
  };

  return (
    <>
      <div className="flex flex-wrap gap-1.5 border-t border-line bg-white px-5 py-2">
        {cannedReplies.map((reply) => (
          <button
            key={reply.label}
            type="button"
            onClick={() => {
              setDraft(reply.text);
              input.current?.focus();
            }}
            className="cursor-pointer rounded-[14px] border border-line bg-[#f4f5f7] px-2.5 py-1.25 text-[11px] hover:border-accent hover:bg-accent-wash"
          >
            {reply.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 border-t border-line px-4.5 py-3">
        <input
          ref={input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          disabled={disabled}
          placeholder="Reply as agent…"
          className="flex-1 rounded-[9px] border border-line px-3 py-2.5 text-[13.5px] outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled}
          className="cursor-pointer rounded-[9px] bg-ink px-4.5 text-[13px] font-semibold text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </>
  );
}
