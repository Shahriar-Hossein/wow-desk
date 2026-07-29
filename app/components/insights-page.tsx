"use client";

import { FilterIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";
import { useState } from "react";
import type { Conversation } from "@/app/lib/types";
import { ConversationAnalyzer } from "./conversation-analyzer";

export function InsightsPage({ conversations }: { conversations: Conversation[] }) {
  const [selectedTab, setSelectedTab] = useState<"analyzer" | "recommendations">("analyzer");

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">AI Insights &amp; Analysis</h1>
        <p className="mt-1 text-muted-foreground">
          Discover patterns, pain points, and opportunities from conversations
        </p>
      </div>

      <div className="mb-6 flex gap-4 border-b border-border">
        <button
          type="button"
          onClick={() => setSelectedTab("analyzer")}
          className={`px-4 py-3 font-medium transition-colors ${
            selectedTab === "analyzer"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <FilterIcon className="size-4" />
            Conversation Analyzer
          </div>
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab("recommendations")}
          className={`px-4 py-3 font-medium transition-colors ${
            selectedTab === "recommendations"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4" />
            AI Recommendations
          </div>
        </button>
      </div>

      {selectedTab === "analyzer" ? <ConversationAnalyzer conversations={conversations} /> : null}

      {selectedTab === "recommendations" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/15 p-2">
                  <SparklesIcon className="size-5 text-blue-500" />
                </div>
                <h3 className="font-semibold text-foreground">Publish a plugin-conflict guide</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Multiple customers hit the same Astra + WowStore 3.2 grid regression this week.
                A self-service conflict-isolation guide would deflect repeat tickets.
              </p>
              <button className="mt-4 rounded-lg bg-blue-500/15 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-500/25 dark:text-blue-300">
                Create Guide
              </button>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-red-500/15 p-2">
                  <TrendingUpIcon className="size-5 text-red-500" />
                </div>
                <h3 className="font-semibold text-foreground">Review license activation limits</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Staging subdomains are being counted against site-activation limits. Recommend
                excluding *.staging.* and *.local from the seat count.
              </p>
              <button className="mt-4 rounded-lg bg-red-500/15 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-500/25 dark:text-red-300">
                View Details
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">
              Content &amp; Feature Opportunities
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm font-medium text-foreground">📚 Currency-conversion FAQ</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  WowRevenue upsell pricing vs. CURCY multi-currency came up twice — worth a
                  dedicated compatibility note.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm font-medium text-foreground">🧾 Self-service VAT invoices</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Email-only contacts keep asking for VAT invoices manually — a billing-portal
                  self-serve flow would close this loop.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm font-medium text-foreground">⚡ Shopify popup timing tips</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Share best practices for WowOptin trigger timing on Dawn-based themes.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Suggested Scheduled Messages</h3>
            <div className="space-y-3">
              <button className="w-full rounded-lg border border-border bg-background p-4 text-left hover:bg-muted">
                <p className="font-medium text-foreground">Fix shipped: mobile grid regression</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Notify customers who reported the Astra + WowStore 3.2 grid collapse.
                </p>
                <span className="mt-2 inline-block rounded-full bg-blue-500/15 px-2 py-1 text-xs text-blue-600 dark:text-blue-300">
                  To 3 customers
                </span>
              </button>

              <button className="w-full rounded-lg border border-border bg-background p-4 text-left hover:bg-muted">
                <p className="font-medium text-foreground">New: staging domains excluded from seats</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Notify customers who hit license-activation limits on staging sites.
                </p>
                <span className="mt-2 inline-block rounded-full bg-green-500/15 px-2 py-1 text-xs text-green-600 dark:text-green-300">
                  To 2 customers
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
