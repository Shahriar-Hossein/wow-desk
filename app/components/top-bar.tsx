import type { BridgeSignal } from "./workspace";

export function TopBar({ bridge }: { bridge: BridgeSignal | null }) {
  return (
    <header className="flex h-14 flex-none items-center justify-between bg-ink px-5 text-white">
      <div className="flex items-center gap-2.5">
        <div className="flex size-6.5 items-center justify-center rounded-[7px] bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-dark))] font-display text-sm font-bold text-[#0b1a18]">
          W
        </div>
        <div className="font-display text-base font-bold tracking-[0.2px]">
          WowDesk
        </div>
        <div className="ml-2 border-l border-[#3a4557] pl-2 text-[11px] font-medium text-ink-mute">
          Prototype · Customer messaging &amp; CRM
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-ink-mute">
        <span>Widget</span>
        <div className="relative h-0.5 w-35 rounded-sm bg-[#374156]">
          {bridge ? (
            <span
              key={bridge.seq}
              className={`absolute -top-0.75 size-2 rounded-full bg-amber opacity-0 shadow-[0_0_10px_var(--color-amber)] ${
                bridge.direction === "right" ? "bridge-right" : "bridge-left"
              }`}
            />
          ) : null}
        </div>
        <span>Inbox</span>
      </div>
    </header>
  );
}
