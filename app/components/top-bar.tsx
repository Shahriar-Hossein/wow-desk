import { CURRENT_AGENT } from "@/app/lib/types";

export function TopBar({ onOpenWidget }: { onOpenWidget: () => void }) {
  const initials = CURRENT_AGENT.split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <header className="flex flex-none items-center justify-between gap-4 border-b border-divider bg-bg px-4 py-[13px]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="block size-3.25 bg-accent-800" />
          <span className="font-heading text-lg font-semibold tracking-[0.08em] uppercase">
            WowDesk
          </span>
        </div>
        <span className="h-5 w-px bg-divider" />
        <span className="font-mono text-[10px] tracking-[0.1em] text-ink/50 uppercase">
          WPXPO · Support workspace
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenWidget}
          className="border border-divider px-2.5 py-1.25 text-[11px] tracking-[0.06em] whitespace-nowrap uppercase hover:bg-ink/7 active:bg-ink/14"
        >
          Customer widget
        </button>
        <span className="h-5 w-px bg-divider" />
        <span className="flex items-center gap-1.75">
          <span className="flex size-6 items-center justify-center bg-accent-800 font-heading text-[11px] font-semibold tracking-[0.04em] text-bg">
            {initials}
          </span>
          <span className="text-[12.5px]">{CURRENT_AGENT}</span>
        </span>
      </div>
    </header>
  );
}
