"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import {
  ALL_TAGS,
  MESSAGE_TYPES,
  PRIORITIES,
  STATUSES,
  type Channel,
  type Priority,
  type Status,
} from "@/app/lib/types";
import { Badge } from "./badge";
import { PopoverPanel } from "./popover-panel";

export type SelectedFilters = {
  types: Channel[];
  priorities: Priority[];
  statuses: Status[];
  tags: string[];
};

const EMPTY_FILTERS: SelectedFilters = { types: [], priorities: [], statuses: [], tags: [] };

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function FilterDialog({
  onApply,
}: {
  onApply: (filters: SelectedFilters) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SelectedFilters>(EMPTY_FILTERS);
  const activeCount =
    draft.types.length + draft.priorities.length + draft.statuses.length + draft.tags.length;

  const chipClass = (on: boolean) =>
    `rounded px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
      on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
    }`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
          activeCount > 0
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-background hover:bg-muted"
        }`}
      >
        <SlidersHorizontal className="size-3.5" />
        Filter
        {activeCount > 0 ? (
          <Badge className="bg-background/20 px-1.5 text-[10px] text-inherit">
            {activeCount}
          </Badge>
        ) : null}
      </button>

      {open ? (
        <PopoverPanel onClose={() => setOpen(false)} className="top-full right-0 mt-2 w-80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Advanced Filters</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Message Type
            </label>
            <div className="flex flex-wrap gap-2">
              {MESSAGE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, types: toggle(d.types, type) }))}
                  className={chipClass(draft.types.includes(type))}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-foreground">Priority</label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() =>
                    setDraft((d) => ({ ...d, priorities: toggle(d.priorities, priority) }))
                  }
                  className={chipClass(draft.priorities.includes(priority))}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, statuses: toggle(d.statuses, status) }))}
                  className={chipClass(draft.statuses.includes(status))}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-foreground">Tags</label>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, tags: toggle(d.tags, tag) }))}
                  className={chipClass(draft.tags.includes(tag))}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setDraft(EMPTY_FILTERS);
                onApply(EMPTY_FILTERS);
              }}
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(draft);
                setOpen(false);
              }}
              className="flex-1 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Apply
            </button>
          </div>
        </PopoverPanel>
      ) : null}
    </div>
  );
}
