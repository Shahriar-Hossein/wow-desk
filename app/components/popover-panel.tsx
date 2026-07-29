"use client";

import { useEffect, useRef } from "react";

export function PopoverPanel({
  onClose,
  className = "",
  children,
}: {
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointer = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`animate-rise absolute z-40 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

export function PopoverOption({
  onClick,
  children,
  mark,
}: {
  onClick: () => void;
  children: React.ReactNode;
  mark?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm capitalize hover:bg-muted"
    >
      <span>{children}</span>
      {mark ? (
        <span className="text-xs font-medium text-muted-foreground">{mark}</span>
      ) : null}
    </button>
  );
}
