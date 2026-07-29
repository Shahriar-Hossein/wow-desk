import { initials, type Conversation } from "@/app/lib/types";

export function ConversationList({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex w-62.5 flex-none flex-col border-r border-line bg-[#fafbfc]">
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5 font-display text-sm font-semibold">
        Inbox
        <span className="font-mono text-[10.5px] font-normal text-muted">
          {conversations.length} open
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const last = conversation.messages.at(-1);
          const isActive = conversation.id === activeId;

          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelect(conversation.id)}
              className={`relative flex w-full cursor-pointer items-start gap-2.5 border-b border-line-soft px-4 py-2.75 text-left ${
                isActive
                  ? "bg-accent-wash before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-accent before:content-['']"
                  : "hover:bg-[#f0f2f5]"
              }`}
            >
              <span
                className="flex size-8.5 flex-none items-center justify-center rounded-[9px] font-display text-[13px] font-semibold text-white"
                style={{ background: conversation.color }}
              >
                {initials(conversation.name)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex justify-between gap-1.5 text-[13px] font-semibold">
                  <span className="truncate">{conversation.name}</span>
                  <span className="flex-none font-mono text-[10px] font-normal text-muted">
                    {last?.time ?? ""}
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-[11.5px] text-muted">
                  {last?.text ?? "No messages yet"}
                </span>
              </span>

              {conversation.unread ? (
                <span className="mt-1 size-2 flex-none rounded-full bg-amber" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
