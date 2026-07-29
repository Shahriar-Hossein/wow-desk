"use client";

import { useEffect, useState } from "react";

export function Toast({
  toast,
}: {
  toast: { text: string; seq: number } | null;
}) {
  const [dismissedSeq, setDismissedSeq] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setDismissedSeq(toast.seq), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const visible = toast !== null && toast.seq !== dismissedSeq;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-[20px] bg-ink px-4.5 py-2.5 text-[12.5px] text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition duration-250 ${
        visible
          ? "-translate-y-1.5 opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <span className="size-1.75 rounded-full bg-accent" />
      {toast?.text}
    </div>
  );
}
