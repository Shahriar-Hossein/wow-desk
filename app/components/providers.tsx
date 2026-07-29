"use client";

import { ConversationsProvider } from "@/app/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ConversationsProvider>{children}</ConversationsProvider>;
}
