"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewConversationDialog({
  onCreate,
}: {
  onCreate: (email: string, name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const close = () => {
    setOpen(false);
    setEmail("");
    setName("");
    setError("");
  };

  const submit = () => {
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    onCreate(trimmed, name);
    close();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="size-3.5" />
        New
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-90 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="w-full max-w-sm rounded-lg border border-border bg-card p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">New message</h3>
              <button
                type="button"
                onClick={close}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">
                Customer email
              </span>
              <input
                autoFocus
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                placeholder="customer@example.com"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">
                Name (optional)
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                placeholder="Customer name"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={close}
                className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!email.trim()}
                className="flex-1 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Start conversation
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
