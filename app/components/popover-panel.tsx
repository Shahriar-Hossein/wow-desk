"use client";

import { useEffect, useRef } from "react";
import { Blueprint } from "./blueprint";

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
    <Blueprint
      ref={ref}
      className={`animate-rise absolute z-40 bg-bg shadow-(--shadow-md) ${className}`}
    >
      {children}
    </Blueprint>
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
      className="flex w-full items-center justify-between border-b border-divider px-2.75 py-1.75 text-left text-[12.5px] last:border-b-0 hover:bg-ink/6"
    >
      <span>{children}</span>
      {mark ? (
        <span className="font-mono text-[10px] text-accent-700">{mark}</span>
      ) : null}
    </button>
  );
}
