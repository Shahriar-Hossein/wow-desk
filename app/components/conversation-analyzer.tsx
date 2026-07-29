"use client";

import { AlertCircleIcon, BugIcon, FilterIcon, LightbulbIcon, TrendingUpIcon } from "lucide-react";
import { useState } from "react";
import type { Conversation } from "@/app/lib/types";
import { Badge } from "./badge";

type AnalyzerFilter = "all" | "issues" | "feedback" | "requests";

export function ConversationAnalyzer({ conversations }: { conversations: Conversation[] }) {
  const [selectedType, setSelectedType] = useState<AnalyzerFilter>("all");

  const analyzed = conversations.map((conv) => {
    const content = conv.messages.map((m) => m.text.toLowerCase()).join(" ");
    const tags: string[] = [];
    const hasPainPoint = /problem|issue|error|broken|collapse/.test(content);
    const hasFeatureRequest = /feature|can we|would like|wish/.test(content);
    const isBugReport = /bug|403|404|timeout|crash|not firing/.test(content);

    if (hasPainPoint) tags.push("pain-point");
    if (hasFeatureRequest) tags.push("feature-request");
    if (isBugReport) tags.push("bug");

    return { conversation: conv, tags, hasPainPoint, hasFeatureRequest, isBugReport };
  });

  const filtered = analyzed.filter((item) => {
    if (selectedType === "all") return true;
    if (selectedType === "issues") return item.isBugReport;
    if (selectedType === "feedback") return item.hasFeatureRequest;
    if (selectedType === "requests") return item.hasPainPoint;
    return true;
  });

  const stats = {
    totalAnalyzed: conversations.length,
    painPointsFound: analyzed.filter((a) => a.hasPainPoint).length,
    featureRequests: analyzed.filter((a) => a.hasFeatureRequest).length,
    bugReports: analyzed.filter((a) => a.isBugReport).length,
  };

  const filters: { id: AnalyzerFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "issues", label: "Issues" },
    { id: "feedback", label: "Feedback" },
    { id: "requests", label: "Requests" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatTile
          icon={<AlertCircleIcon className="size-4 text-orange-500" />}
          label="Pain Points"
          value={stats.painPointsFound}
        />
        <StatTile
          icon={<LightbulbIcon className="size-4 text-yellow-500" />}
          label="Feature Requests"
          value={stats.featureRequests}
        />
        <StatTile
          icon={<BugIcon className="size-4 text-red-500" />}
          label="Bug Reports"
          value={stats.bugReports}
        />
        <StatTile
          icon={<TrendingUpIcon className="size-4 text-blue-500" />}
          label="Analyzed"
          value={stats.totalAnalyzed}
        />
      </div>

      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSelectedType(f.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedType === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <FilterIcon className="size-4" />
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No items found for this filter</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.conversation.id}
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <div className="mb-2">
                <p className="font-semibold text-foreground">{item.conversation.subject}</p>
                <p className="text-sm text-muted-foreground">
                  {item.conversation.ticket} · {item.conversation.name}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className={
                      tag === "pain-point"
                        ? "bg-orange-500/15 text-orange-700 dark:text-orange-300"
                        : tag === "feature-request"
                          ? "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300"
                          : "bg-red-500/15 text-red-700 dark:text-red-300"
                    }
                  >
                    {tag.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
