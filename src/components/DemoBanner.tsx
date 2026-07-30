"use client";

import { useState } from "react";

export function DemoBanner() {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div className="border-b border-border bg-fg text-white">
      <div className="container-app flex items-center gap-2 py-2 sm:gap-3 sm:py-2.5">
        <span className="shrink-0 rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
          Demo
        </span>
        <p className="min-w-0 flex-1 text-[11px] leading-snug text-white/85 sm:text-sm">
          <span className="font-medium text-white">
            Demo systemu rezerwacji dla Bosodance.
          </span>{" "}
          <span className="hidden text-white/70 sm:inline">
            Strona i procesy pod Państwa studio — gotowe rozwiązanie szyjemy na
            miarę.
          </span>
          <span className="text-white/70 sm:hidden">
            Przygotowane pod studio · na miarę.
          </span>
        </p>
        <button
          type="button"
          onClick={() => setHidden(true)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
          aria-label="Zamknij"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
