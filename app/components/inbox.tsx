"use client";

import { useEffect, useRef, useState } from "react";
import { CURRENT_AGENT, timeNow, type Conversation, type Status } from "@/app/lib/types";
import { ContextPanel } from "./context-panel";
import { ConversationList } from "./conversation-list";
import { Thread } from "./thread";
import { TopBar } from "./top-bar";
import { WidgetPreviewModal } from "./widget-preview-modal";

const AUTO_REPLY = "ok trying that now — one sec";

export function Inbox({
  initialConversations,
}: {
  initialConversations: Conversation[];
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0].id);
  const [typingConvId, setTypingConvId] = useState<string | null>(null);
  const [typingText, setTypingText] = useState("");
  const [widgetOpen, setWidgetOpen] = useState(false);

  const activeIdRef = useRef(activeId);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const typingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      if (typingInterval.current) clearInterval(typingInterval.current);
    },
    [],
  );

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const patch = (id: string, updater: (c: Conversation) => Conversation) => {
    setConversations((cs) => cs.map((c) => (c.id === id ? updater(c) : c)));
  };

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  const selectConversation = (id: string) => {
    setActiveId(id);
    patch(id, (c) => ({ ...c, unread: 0 }));
  };

  const handleSend = (text: string, mode: "reply" | "note") => {
    const id = activeId;
    const note = mode === "note";
    const messageId = `m${Date.now()}`;

    patch(id, (c) => ({
      ...c,
      unread: 0,
      status: c.status === "open" && !note ? ("pending" as Status) : c.status,
      messages: [
        ...c.messages,
        {
          id: messageId,
          from: note ? "note" : "agent",
          author: note ? CURRENT_AGENT : "Nabil H.",
          text,
          time: timeNow(),
          status: note ? undefined : "sent",
        },
      ],
    }));

    if (note) return;

    const setDeliveryStatus = (status: "delivered" | "seen") =>
      patch(id, (c) => ({
        ...c,
        messages: c.messages.map((m) => (m.id === messageId ? { ...m, status } : m)),
      }));

    later(() => setDeliveryStatus("delivered"), 700);
    later(() => setDeliveryStatus("seen"), 1800);

    later(() => {
      if (activeIdRef.current !== id) return;
      let i = 0;
      setTypingConvId(id);
      setTypingText("");
      typingInterval.current = setInterval(() => {
        i += 1;
        setTypingText(AUTO_REPLY.slice(0, i));
        if (i >= AUTO_REPLY.length) {
          if (typingInterval.current) clearInterval(typingInterval.current);
          later(() => {
            setTypingConvId(null);
            setTypingText("");
            patch(id, (c) => ({
              ...c,
              messages: [
                ...c.messages,
                { id: `r${Date.now()}`, from: "cust", text: AUTO_REPLY, time: timeNow() },
              ],
            }));
          }, 850);
        }
      }, 52);
    }, 2400);
  };

  return (
    <>
      <TopBar onOpenWidget={() => setWidgetOpen(true)} />

      <div className="grid min-h-0 flex-1 grid-cols-[306px_minmax(0,1fr)_352px]">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={selectConversation}
        />
        <Thread
          key={active.id}
          conversation={active}
          onStatusChange={(status) => patch(activeId, (c) => ({ ...c, status }))}
          onAssigneeChange={(assignee) => patch(activeId, (c) => ({ ...c, assignee }))}
          onAddTag={(tag) => patch(activeId, (c) => ({ ...c, tags: [...c.tags, tag] }))}
          onRemoveTag={(tag) =>
            patch(activeId, (c) => ({ ...c, tags: c.tags.filter((t) => t !== tag) }))
          }
          onSend={handleSend}
          typingConvId={typingConvId}
          typingText={typingText}
        />
        <ContextPanel conversation={active} />
      </div>

      {widgetOpen ? (
        <WidgetPreviewModal conversation={active} onClose={() => setWidgetOpen(false)} />
      ) : null}
    </>
  );
}
