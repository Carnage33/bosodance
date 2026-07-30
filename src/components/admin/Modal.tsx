"use client";

import { useEffect } from "react";

export function Modal({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-fg/45 backdrop-blur-[2px]"
        aria-label="Zamknij"
        onClick={onClose}
      />
      <div
        className={`relative z-10 flex max-h-[92dvh] w-full flex-col rounded-t-2xl border border-border bg-white shadow-2xl sm:rounded-2xl ${
          wide ? "sm:max-w-xl" : "sm:max-w-md"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <h2 className="text-base font-semibold text-fg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-fg-secondary active:bg-[#f4f5f7]"
            aria-label="Zamknij"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain p-4 sm:p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

export function IconBtn({
  label,
  onClick,
  tone = "neutral",
  children,
}: {
  label: string;
  onClick: () => void;
  tone?: "neutral" | "danger" | "primary";
  children: React.ReactNode;
}) {
  const tones = {
    neutral: "border-border text-fg-secondary hover:bg-[#f4f5f7] hover:text-fg",
    danger: "border-red-200 text-accent hover:bg-accent-soft",
    primary: "border-border text-fg hover:bg-[#f4f5f7]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-white transition ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function IconEdit() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
    </svg>
  );
}

export function IconTrash() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      {children}
    </label>
  );
}
