"use client";

import { useCallback, useRef, useState } from "react";
import {
  AVATAR_COLORS,
  LIVE_CONVERSATION_ID,
  timeNow,
  type Conversation,
  type Sender,
} from "@/app/lib/types";
import { ContactPanel } from "./contact-panel";
import { ConversationList } from "./conversation-list";
import { SitePreview } from "./site-preview";
import { Thread } from "./thread";
import { Toast } from "./toast";
import { TopBar } from "./top-bar";

export type BridgeSignal = { direction: "right" | "left"; seq: number };

function newLiveConversation(): Conversation {
  return {
    id: LIVE_CONVERSATION_ID,
    name: "Website Visitor",
    email: "visitor@getwowstore-demo.com",
    color: AVATAR_COLORS[0],
    order: "—",
    plugin: "WowStore (trial)",
    tags: [{ label: "New contact", tone: "blue" }],
    assignee: "Unassigned",
    notes: "",
    messages: [],
    unread: true,
  };
}

export function Workspace({
  initialConversations,
}: {
  initialConversations: Conversation[];
}) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string>(initialConversations[0].id);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [bridge, setBridge] = useState<BridgeSignal | null>(null);
  const [toast, setToast] = useState<{ text: string; seq: number } | null>(null);

  const messageSeq = useRef(0);
  const signalSeq = useRef(0);

  const active = conversations.find((c) => c.id === activeId);
  const live = conversations.find((c) => c.id === LIVE_CONVERSATION_ID);

  const runBridge = useCallback((direction: BridgeSignal["direction"]) => {
    signalSeq.current += 1;
    setBridge({ direction, seq: signalSeq.current });
  }, []);

  const showToast = useCallback((text: string) => {
    signalSeq.current += 1;
    setToast({ text, seq: signalSeq.current });
  }, []);

  const buildMessage = (from: Sender, text: string) => {
    messageSeq.current += 1;
    return { id: `m${messageSeq.current}`, from, text, time: timeNow() };
  };

  const sendFromWidget = (text: string) => {
    const message = buildMessage("visitor", text);
    const unread = activeId !== LIVE_CONVERSATION_ID;

    if (!live) {
      setConversations([
        { ...newLiveConversation(), messages: [message], unread },
        ...conversations,
      ]);
      showToast("New contact auto-created: Website Visitor");
    } else {
      setConversations(
        conversations.map((c) =>
          c.id === LIVE_CONVERSATION_ID
            ? { ...c, messages: [...c.messages, message], unread }
            : c,
        ),
      );
    }

    runBridge("right");
  };

  const sendFromAgent = (text: string) => {
    if (!active) return;
    const message = buildMessage("agent", text);
    setConversations(
      conversations.map((c) =>
        c.id === active.id ? { ...c, messages: [...c.messages, message] } : c,
      ),
    );
    runBridge("left");
  };

  const selectConversation = (id: string) => {
    setActiveId(id);
    setConversations(
      conversations.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    );
  };

  const patchActive = (patch: Partial<Conversation>) => {
    setConversations(
      conversations.map((c) => (c.id === activeId ? { ...c, ...patch } : c)),
    );
  };

  const assign = (assignee: string) => {
    patchActive({ assignee });
    showToast(`Assigned to ${assignee}`);
  };

  return (
    <>
      <TopBar bridge={bridge} />

      <div className="flex min-h-0 flex-1 gap-4 p-4">
        <SitePreview
          open={widgetOpen}
          onOpenChange={setWidgetOpen}
          messages={live?.messages ?? []}
          onSend={sendFromWidget}
        />

        <div className="flex min-w-0 flex-1 overflow-hidden rounded-panel border border-line bg-card">
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={selectConversation}
          />
          <Thread
            conversation={active}
            onSend={sendFromAgent}
            onAssign={assign}
          />
          <ContactPanel
            conversation={active}
            onNotesChange={(notes) => patchActive({ notes })}
          />
        </div>
      </div>

      <Toast toast={toast} />
    </>
  );
}
