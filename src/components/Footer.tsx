"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { STUDIO } from "@/data/classes";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-border bg-bg-elevated">
      <div className="container-app grid gap-8 py-10 sm:py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo size="sm" href="/" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-secondary">
            Demo systemu rezerwacji przygotowane dla Bosodance (Sopot). Oferta,
            grafik i panel admina — w produkcji szyjemy na miarę.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Nawigacja
            </p>
            <ul className="mt-3 space-y-2 text-sm text-fg-secondary">
              {[
                ["/zajecia", "Zajęcia"],
                ["/grafik", "Grafik"],
                ["/cennik", "Cennik"],
                ["/rezerwacja", "Rezerwacja"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-fg">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Studio
            </p>
            <ul className="mt-3 space-y-2 text-sm text-fg-secondary">
              <li>
                <Link href="/o-nas" className="hover:text-fg">
                  O nas
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-accent">
                  Panel admina
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Kontakt
            </p>
            <ul className="mt-3 space-y-2 text-sm text-fg-secondary">
              <li>{STUDIO.address}</li>
              <li className="break-all">{STUDIO.email}</li>
              <li>{STUDIO.phone}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-app flex flex-col gap-1 py-4 text-center text-xs text-fg-muted sm:flex-row sm:justify-between sm:text-left">
          <span>
            © {new Date().getFullYear()} {STUDIO.name}
          </span>
          <span>Demo · nie jest oficjalną stroną studia</span>
        </div>
      </div>
    </footer>
  );
}
