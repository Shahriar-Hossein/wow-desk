"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "@/app/lib/types";

export function SitePreview({
  open,
  onOpenChange,
  messages,
  onSend,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: Message[];
  onSend: (text: string) => void;
}) {
  return (
    <section className="relative flex w-[38%] min-w-80 flex-col overflow-hidden rounded-panel border border-line bg-card">
      <div className="flex h-9.5 flex-none items-center gap-2 border-b border-line bg-[#edeff3] px-3">
        <span className="size-2.25 rounded-full bg-[#d3d7de]" />
        <span className="size-2.25 rounded-full bg-[#d3d7de]" />
        <span className="size-2.25 rounded-full bg-[#d3d7de]" />
        <div className="ml-2 flex-1 rounded-md border border-line bg-white px-2.5 py-1 font-mono text-[11.5px] text-muted">
          🔒 getwowstore-demo.com
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_20%_15%,#eafaf7_0%,transparent_45%),linear-gradient(180deg,#fff,#f7f8fa_60%)] px-6.5 py-7">
        <p className="text-[11px] font-semibold tracking-[1.5px] text-accent-dark uppercase">
          WowStore Demo Shop
        </p>
        <h1 className="mt-2.5 mb-2 font-display text-[26px] leading-[1.15] font-bold">
          Sell more,
          <br />
          support less.
        </h1>
        <p className="max-w-85 text-[13.5px] leading-relaxed text-muted">
          This is a stand-in storefront so you can see the WowDesk widget
          running exactly as a customer would — click the bubble bottom-right to
          start a chat.
        </p>
        <div className="mt-4.5 inline-block rounded-lg bg-ink px-4.5 py-2.5 text-[13px] font-semibold text-white">
          Shop now →
        </div>
        <div className="mt-6.5 flex items-center gap-2.5 text-[11.5px] text-muted">
          <span className="size-1.5 rounded-full bg-accent" />
          Powered by WowStore
        </div>
      </div>

      {open ? (
        <ChatWidget
          messages={messages}
          onSend={onSend}
          onClose={() => onOpenChange(false)}
        />
      ) : null}

      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="absolute right-4.5 bottom-4.5 flex size-13 cursor-pointer items-center justify-center rounded-full bg-ink text-[22px] text-white shadow-[0_8px_20px_rgba(22,27,38,0.28)] transition-transform hover:scale-106"
      >
        💬
      </button>
    </section>
  );
}

function ChatWidget({
  messages,
  onSend,
  onClose,
}: {
  messages: Message[];
  onSend: (text: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    onSend(text);
  };

  return (
    <div className="absolute right-4.5 bottom-20.5 flex max-h-100 w-75 flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_40px_rgba(20,25,35,0.22)]">
      <div className="flex items-center justify-between bg-ink px-4 py-3.5 text-white">
        <div>
          <div className="font-display text-sm font-semibold">
            Chat with WPXPO
          </div>
          <div className="mt-0.5 text-[11px] text-ink-mute">
            Usually replies in a few minutes
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="cursor-pointer text-base text-ink-mute hover:text-white"
        >
          ✕
        </button>
      </div>

      <div
        ref={scroller}
        className="flex max-h-62.5 min-h-45 flex-1 flex-col gap-2 overflow-y-auto bg-[#f8f9fb] p-3.5"
      >
        {messages.length === 0 ? (
          <p className="m-auto px-5 text-center text-[12.5px] text-muted">
            Send a message below — it&apos;ll land in the agent inbox on the
            right in real time.
          </p>
        ) : (
          messages.map((message) => (
            <Bubble key={message.id} message={message} mine="visitor" />
          ))
        )}
      </div>

      <div className="flex gap-1.5 border-t border-line bg-white p-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder="Type a message…"
          className="flex-1 rounded-lg border border-line px-2.5 py-2 text-[13px] outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={submit}
          aria-label="Send message"
          className="w-9 cursor-pointer rounded-lg bg-ink text-sm text-white"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

/**
 * `mine` is the sender rendered on the right in accent — the widget shows the
 * visitor's own messages there, the agent inbox shows the agent's.
 */
export function Bubble({
  message,
  mine,
  className = "",
}: {
  message: Message;
  mine: Message["from"];
  className?: string;
}) {
  const isMine = message.from === mine;

  return (
    <div
      className={`max-w-[78%] rounded-xl px-2.75 py-2 text-[13px] leading-[1.42] ${
        isMine
          ? "self-end rounded-br-[4px] bg-accent text-white"
          : "self-start rounded-bl-[4px] border border-line bg-white"
      } ${className}`}
    >
      {message.text}
      <div
        className={`mt-[3px] font-mono text-[9.5px] ${
          isMine ? "text-right text-white/75" : "text-muted"
        }`}
      >
        {message.time}
      </div>
    </div>
  );
}
