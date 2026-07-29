"use client";

import { useState } from "react";
import { Inbox } from "@/app/components/inbox";
import { InsightsPage } from "@/app/components/insights-page";
import { MetricsDashboard } from "@/app/components/metrics-dashboard";
import { TopBar, type Tab } from "@/app/components/top-bar";
import { seedConversations } from "@/app/lib/seed";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("inbox");
  const [conversations, setConversations] = useState(seedConversations);

  return (
    <>
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "inbox" ? (
        <Inbox conversations={conversations} setConversations={setConversations} />
      ) : null}
      {activeTab === "dashboard" ? <MetricsDashboard conversations={conversations} /> : null}
      {activeTab === "insights" ? <InsightsPage conversations={conversations} /> : null}
    </>
  );
}
