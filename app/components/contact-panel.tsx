import { initials, type Conversation } from "@/app/lib/types";

export function ContactPanel({
  conversation,
  onNotesChange,
}: {
  conversation: Conversation | undefined;
  onNotesChange: (notes: string) => void;
}) {
  if (!conversation) {
    return (
      <aside className="w-57.5 flex-none border-l border-line bg-[#fafbfc]" />
    );
  }

  return (
    <aside className="w-57.5 flex-none overflow-y-auto border-l border-line bg-[#fafbfc] px-4 py-4.5">
      <div
        className="mb-2.5 flex size-13 items-center justify-center rounded-xl font-display text-lg font-bold text-white"
        style={{ background: conversation.color }}
      >
        {initials(conversation.name)}
      </div>
      <div className="font-display text-[15px] font-semibold">
        {conversation.name}
      </div>
      <div className="mt-0.5 text-[11.5px] text-muted">
        {conversation.email}
      </div>

      <Section label="Store context">
        <Row label="Order" value={conversation.order} />
        <Row label="Plugin" value={conversation.plugin} />
      </Section>

      <Section label="Tags">
        <div className="flex flex-wrap gap-1.5">
          {conversation.tags.map((tag) => (
            <span
              key={tag.label}
              className={`rounded-[10px] px-2 py-0.75 text-[10.5px] font-semibold ${
                tag.tone === "amber"
                  ? "bg-[#fff3e0] text-[#b5730a]"
                  : "bg-[#eaf2ff] text-[#3a5dbb]"
              }`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </Section>

      <Section label="Internal note">
        <textarea
          value={conversation.notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Add a note only your team can see…"
          className="min-h-15 w-full resize-none rounded-lg border border-line bg-white p-2 text-xs outline-none focus:border-accent"
        />
      </Section>
    </aside>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4.5">
      <div className="mb-1.75 text-[10px] font-semibold tracking-[0.8px] text-muted uppercase">
        {label}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-dashed border-line py-1.25 text-[12.5px]">
      <span className="text-muted">{label}</span>
      <span className="font-mono text-[11.5px] font-medium">{value}</span>
    </div>
  );
}
