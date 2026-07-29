import { BarChart3Icon, HeadphonesIcon, LayoutPanelLeftIcon, SparklesIcon } from "lucide-react";
import { CURRENT_AGENT } from "@/app/lib/types";

export type Tab = "inbox" | "dashboard" | "insights";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "inbox", label: "Inbox", icon: <LayoutPanelLeftIcon className="size-4" /> },
  { id: "dashboard", label: "Dashboard", icon: <BarChart3Icon className="size-4" /> },
  { id: "insights", label: "Insights", icon: <SparklesIcon className="size-4" /> },
];

export function TopBar({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  const initials = CURRENT_AGENT.split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <header className="flex flex-none items-center justify-between gap-4 border-b border-border bg-card px-6 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary p-2">
          <HeadphonesIcon className="size-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg leading-tight font-bold text-foreground">WowDesk</h1>
          <p className="text-xs leading-tight text-muted-foreground">
            WPXPO support workspace
          </p>
        </div>
      </div>

      <nav className="flex items-center gap-1.5 rounded-lg bg-muted p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </span>
          <span className="text-sm">{CURRENT_AGENT}</span>
        </span>
      </div>
    </header>
  );
}
