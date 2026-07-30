"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const nav = [
  { href: "/", label: "Start" },
  { href: "/zajecia", label: "Zajęcia" },
  { href: "/grafik", label: "Grafik" },
  { href: "/cennik", label: "Cennik" },
  { href: "/rezerwacja", label: "Rezerwacja" },
  { href: "/o-nas", label: "Studio" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="border-b border-border bg-bg-elevated/95">
      {/* Subline: framing for the client demo */}
      <div className="hidden border-b border-border/80 bg-[#fafbfc] sm:block">
        <div className="container-app flex items-center justify-between gap-3 py-1.5 text-[11px] text-fg-muted sm:text-xs">
          <p>
            <span className="font-medium text-fg-secondary">
              Demo technologiczne rezerwacji
            </span>
            <span className="mx-1.5 text-border-strong">·</span>
            przygotowane dla studia{" "}
            <span className="font-semibold text-fg">Bosodance</span>
          </p>
          <Link
            href="/admin"
            className="shrink-0 font-medium text-fg-secondary hover:text-accent"
          >
            Panel admina →
          </Link>
        </div>
      </div>

      <div className="container-app flex h-14 items-center justify-between gap-3 sm:h-16">
        <div className="flex min-w-0 items-center gap-3">
          <Logo size="sm" />
          <span className="hidden max-w-[10rem] truncate text-[11px] leading-tight text-fg-muted md:block lg:max-w-none xl:hidden">
            System rezerwacji
          </span>
        </div>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-fg text-white"
                    : "text-fg-secondary hover:bg-bg hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/rezerwacja"
            className="btn-primary hidden !min-h-0 !px-4 !py-2 sm:inline-flex"
          >
            Rezerwuj
          </Link>
          <Link
            href="/admin"
            title="Panel admina"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-secondary hover:border-border-strong hover:bg-bg hover:text-fg sm:h-10 sm:w-10"
            aria-label="Panel admina"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border lg:hidden sm:h-10 sm:w-10"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.75}
              stroke="currentColor"
              className="h-5 w-5"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-fg/30 lg:hidden"
            aria-label="Zamknij menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 top-full z-50 border-b border-border bg-bg-elevated shadow-lg lg:hidden">
            <div className="container-app border-b border-border bg-[#fafbfc] py-2.5 text-[11px] text-fg-muted">
              Demo rezerwacji · przygotowane dla{" "}
              <span className="font-semibold text-fg">Bosodance</span>
            </div>
            <nav className="container-app flex flex-col gap-0.5 py-3">
              {nav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-3 text-[15px] font-medium ${
                      active ? "bg-fg text-white" : "text-fg hover:bg-bg"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/rezerwacja"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 w-full"
              >
                Rezerwuj zajęcia
              </Link>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="btn-secondary mt-1 w-full"
              >
                Panel admina
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
