"use client";

import {
  AlertCircleIcon,
  BarChart3Icon,
  CheckCircleIcon,
  ClockIcon,
  MessageSquareIcon,
  StarIcon,
  TrendingUpIcon,
  VideoIcon,
} from "lucide-react";
import { supportMetrics } from "@/app/lib/seed";
import type { Conversation } from "@/app/lib/types";

export function MetricsDashboard({ conversations }: { conversations: Conversation[] }) {
  const totalTickets = conversations.length;
  const ticketsResolved = conversations.filter((c) => c.status === "resolved").length;
  const openTickets = conversations.filter((c) => c.status === "open").length;
  const urgentTickets = conversations.filter((c) => c.priority === "Urgent").length;
  const resolutionRate = totalTickets ? Math.round((ticketsResolved / totalTickets) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Support Metrics</h1>
        <p className="mt-1 text-muted-foreground">
          Track team performance and customer satisfaction
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<MessageSquareIcon className="size-6 text-blue-500" />}
          label="Chats Replied"
          value={supportMetrics.totalChatsReplied}
          color="bg-blue-500/15"
          trend={12}
        />
        <StatCard
          icon={<ClockIcon className="size-6 text-orange-500" />}
          label="Avg Response Time"
          value={supportMetrics.averageResponseTime}
          unit="m"
          color="bg-orange-500/15"
        />
        <StatCard
          icon={<StarIcon className="size-6 text-yellow-500" />}
          label="Avg Rating"
          value={supportMetrics.averageRating}
          color="bg-yellow-500/15"
        />
        <StatCard
          icon={<VideoIcon className="size-6 text-purple-500" />}
          label="Total Meetings"
          value={supportMetrics.totalMeetings}
          color="bg-purple-500/15"
          trend={8}
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/15 p-3">
              <BarChart3Icon className="size-6 text-blue-500" />
            </div>
            <h3 className="font-semibold text-foreground">Total Tickets</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalTickets}</p>
          <p className="mt-2 text-sm text-muted-foreground">{ticketsResolved} resolved</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-red-500/15 p-3">
              <AlertCircleIcon className="size-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-foreground">Open Issues</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{openTickets}</p>
          <p className="mt-2 text-sm text-red-500">{urgentTickets} urgent</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-500/15 p-3">
              <CheckCircleIcon className="size-6 text-green-500" />
            </div>
            <h3 className="font-semibold text-foreground">Resolution Rate</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{resolutionRate}%</p>
          <p className="mt-2 text-sm text-muted-foreground">This week</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold text-foreground">This Week Performance</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Chats Replied</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {supportMetrics.currentWeekMetrics.chatsReplied}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${(supportMetrics.currentWeekMetrics.chatsReplied / supportMetrics.totalChatsReplied) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Meetings Scheduled</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {supportMetrics.currentWeekMetrics.meetingsScheduled}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-purple-500"
                style={{
                  width: `${(supportMetrics.currentWeekMetrics.meetingsScheduled / supportMetrics.totalMeetings) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Tickets Resolved</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{ticketsResolved}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-green-500"
                style={{ width: `${resolutionRate}%` }}
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Customer Rating</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {supportMetrics.currentWeekMetrics.averageRating}
            </p>
            <div className="mt-3 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`size-4 ${
                    i < Math.floor(supportMetrics.currentWeekMetrics.averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  trend,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
        {trend !== undefined ? (
          <div className="flex items-center gap-1 rounded-lg bg-green-500/15 px-2 py-1">
            <TrendingUpIcon className="size-4 text-green-500" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              +{trend}%
            </span>
          </div>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">
        {value}
        {unit ? <span className="text-lg text-muted-foreground">{unit}</span> : null}
      </p>
    </div>
  );
}
