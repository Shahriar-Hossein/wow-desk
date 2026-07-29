"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { seedConversations } from "./seed";
import type { Conversation } from "./types";

const STORAGE_KEY = "wowdesk-conversations";
const CHANNEL_NAME = "wowdesk-sync";

type ConversationsContextValue = {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
};

const ConversationsContext = createContext<ConversationsContextValue | null>(null);

/**
 * Holds the one shared list of conversations for the whole app. Lives in the
 * root layout so it survives client-side navigation between `/` (inbox) and
 * `/widget` (live demo), and mirrors itself through localStorage + a
 * BroadcastChannel so a second browser tab — e.g. inbox in one window,
 * the widget demo in another — sees the same messages land live.
 */
export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const applyingRemote = useRef(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          applyingRemote.current = true;
          setConversations(parsed);
        }
      }
    } catch {
      // Corrupt or unavailable storage — keep the seed data.
    }
    hydrated.current = true;

    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;
    channel.onmessage = (event: MessageEvent<Conversation[]>) => {
      applyingRemote.current = true;
      setConversations(event.data);
    };
    return () => channel.close();
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    if (applyingRemote.current) {
      applyingRemote.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      // Storage full or unavailable — the tab still works, just unsynced.
    }
    channelRef.current?.postMessage(conversations);
  }, [conversations]);

  return (
    <ConversationsContext.Provider value={{ conversations, setConversations }}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversationsStore() {
  const ctx = useContext(ConversationsContext);
  if (!ctx) {
    throw new Error("useConversationsStore must be used within a ConversationsProvider");
  }
  return ctx;
}
