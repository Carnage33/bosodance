"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  classes,
  pricingPlans,
  schedule,
  instructors,
  rooms,
  STUDIO,
  DAYS,
} from "@/data/classes";
import {
  getBookings,
  getCustomers,
  getStats,
  getClasses,
  getPlans,
  addBooking,
  updateBooking,
  resetAllData,
} from "@/lib/store";
import type {
  Booking,
  BookingStatus,
  DanceClass,
  PaymentStatus,
  PricingPlan,
} from "@/types";
import { buildAnalytics } from "@/lib/analytics-real";
import {
  BarChart,
  HorizontalBars,
  ShareBar,
  FunnelChart,
  MiniSparkline,
} from "@/components/Charts";
import { CustomersTab as CustomersTabView } from "./tabs/CustomersTab";
import { ClassesTab as ClassesTabView } from "./tabs/ClassesTab";
import { BookingsTab as BookingsTabView } from "./tabs/BookingsTab";

type Tab =
  | "dashboard"
  | "bookings"
  | "customers"
  | "schedule"
  | "payments"
  | "classes"
  | "instructors"
  | "passes"
  | "attendance"
  | "messages"
  | "reports"
  | "settings";

const tabs: { id: Tab; label: string; group: string }[] = [
  { id: "dashboard", label: "Pulpit", group: "Główne" },
  { id: "bookings", label: "Rezerwacje", group: "Główne" },
  { id: "customers", label: "Klienci", group: "Główne" },
  { id: "schedule", label: "Grafik", group: "Operacje" },
  { id: "attendance", label: "Frekwencja", group: "Operacje" },
  { id: "payments", label: "Płatności", group: "Finanse" },
  { id: "passes", label: "Karnety", group: "Finanse" },
  { id: "reports", label: "Raporty", group: "Finanse" },
  { id: "classes", label: "Zajęcia", group: "Studio" },
  { id: "instructors", label: "Nauczyciele", group: "Studio" },
  { id: "messages", label: "Wiadomości", group: "Studio" },
  { id: "settings", label: "Ustawienia", group: "Studio" },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState(getStats());
  const [customers, setCustomers] = useState(getCustomers());
  const [catalog, setCatalog] = useState<DanceClass[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setBookings(getBookings());
    setStats(getStats());
    setCustomers(getCustomers());
    setCatalog(getClasses());
    setPlans(getPlans());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (filter !== "all" && b.status !== filter) return false;
      if (query) {
        const q = query.toLowerCase();
        const cls = classes.find((c) => c.id === b.classId);
        return (
          b.customerName.toLowerCase().includes(q) ||
          b.customerEmail.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          (cls?.name.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [bookings, filter, query]);

  function notify(msg: string) {
    setToast(msg);
  }


  function goTab(id: Tab) {
    setTab(id);
    setSidebarOpen(false);
  }

  const groups = ["Główne", "Operacje", "Finanse", "Studio"];
  const currentTabLabel = tabs.find((t) => t.id === tab)?.label ?? "Panel";

  const navContent = (
    <nav className="flex flex-col gap-5 p-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {groups.map((group) => (
        <div key={group}>
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-fg-muted">
            {group}
          </p>
          <div className="flex flex-col gap-0.5">
            {tabs
              .filter((t) => t.group === group)
              .map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => goTab(t.id)}
                    className={`flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[15px] font-medium transition ${
                      active
                        ? "bg-fg text-white shadow-sm"
                        : "text-fg-secondary active:bg-[#eceef2] hover:bg-[#f4f5f7] hover:text-fg"
                    }`}
                  >
                    <span>{t.label}</span>
                    {t.id === "bookings" && stats.pending > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          active ? "bg-white/20 text-white" : "bg-accent text-white"
                        }`}
                      >
                        {stats.pending}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="admin-app min-h-screen min-h-dvh bg-[#f0f2f5]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90">
        <div className="flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-fg active:bg-[#f4f5f7] lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Otwórz menu"
              aria-expanded={sidebarOpen}
            >
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-[11px] font-bold text-white">
              bd
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight text-fg">
                {STUDIO.name}
              </p>
              <p className="truncate text-[11px] leading-tight text-fg-muted">
                <span className="lg:hidden">{currentTabLabel}</span>
                <span className="hidden lg:inline">Panel administratora</span>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="badge hidden bg-warning-soft text-warning sm:inline-flex">
              Demo
            </span>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-3 text-xs font-semibold text-fg active:bg-[#f4f5f7] sm:px-3.5"
            >
              <span className="sm:hidden">Strona</span>
              <span className="hidden sm:inline">Strona klienta</span>
            </Link>
          </div>
        </div>

        {/* Mobile horizontal section switcher */}
        <div className="border-t border-border lg:hidden">
          <div className="admin-scroll flex gap-1.5 overflow-x-auto px-3 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => goTab(t.id)}
                  className={`relative shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition ${
                    active
                      ? "bg-fg text-white"
                      : "bg-[#eceef2] text-fg-secondary active:bg-[#e0e3e8]"
                  }`}
                >
                  {t.label}
                  {t.id === "bookings" && stats.pending > 0 && (
                    <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                      {stats.pending}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] lg:gap-4 lg:px-4 lg:py-4">
        {/* Desktop sidebar */}
        <aside className="admin-scroll sticky top-[4.5rem] hidden max-h-[calc(100dvh-5.5rem)] w-60 shrink-0 self-start overflow-y-auto rounded-2xl border border-border bg-white shadow-sm lg:block">
          <div className="border-b border-border px-4 py-3.5">
            <p className="text-xs font-semibold text-fg">Nawigacja</p>
            <p className="text-[11px] text-fg-muted">Panel studia</p>
          </div>
          {navContent}
        </aside>

        {/* Mobile drawer */}
        <div
          className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          aria-hidden={!sidebarOpen}
        >
          <button
            type="button"
            className={`absolute inset-0 bg-fg/40 transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Zamknij menu"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className={`absolute bottom-0 left-0 top-0 flex w-[min(20rem,86vw)] max-w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              paddingTop: "env(safe-area-inset-top)",
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-[11px] font-bold text-white">
                  bd
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-fg">{STUDIO.name}</p>
                  <p className="text-[11px] text-fg-muted">Menu panelu</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-fg-secondary active:bg-[#f4f5f7]"
                aria-label="Zamknij"
              >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="admin-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {navContent}
            </div>
            <div className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <Link
                href="/"
                className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[#f0f2f5] text-sm font-semibold text-fg active:bg-[#e4e6ea]"
                onClick={() => setSidebarOpen(false)}
              >
                ← Wróć na stronę klienta
              </Link>
            </div>
          </aside>
        </div>

        <main className="min-w-0 w-full flex-1 overflow-x-clip px-3 pb-[max(5rem,env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-12 sm:pt-5 lg:px-2 lg:pt-0">
          {tab === "dashboard" && (
            <Dashboard stats={stats} bookings={bookings} catalog={catalog} onGo={goTab} />
          )}
          {tab === "bookings" && (
            <BookingsTabView
              bookings={filtered}
              catalog={catalog}
              plans={plans}
              filter={filter}
              setFilter={setFilter}
              query={query}
              setQuery={setQuery}
              onChange={refresh}
              notify={notify}
              onCreateDemo={() => {
                const first = catalog[0]?.id || "tango-p1";
                addBooking({
                  classId: first,
                  planId: plans[0]?.id || "single",
                  customerName: "Gość Demo",
                  customerEmail: "gosc@demo.pl",
                  customerPhone: "+48 600 000 001",
                  date: new Date().toISOString().slice(0, 10),
                  time: "18:00",
                  status: "pending",
                  paymentStatus: "unpaid",
                  amount: plans[0]?.price || 60,
                });
                refresh();
                notify("Dodano rezerwację demo");
              }}
            />
          )}
          {tab === "customers" && (
            <CustomersTabView
              customers={customers}
              onChange={refresh}
              notify={notify}
            />
          )}
          {tab === "schedule" && <ScheduleTab />}
          {tab === "attendance" && (
            <AttendanceTab bookings={bookings} notify={notify} />
          )}
          {tab === "payments" && (
            <PaymentsTab bookings={bookings} revenue={stats.revenue} />
          )}
          {tab === "passes" && <PassesTab customers={customers} />}
          {tab === "classes" && (
            <ClassesTabView
              catalog={catalog}
              onChange={refresh}
              notify={notify}
            />
          )}
          {tab === "instructors" && <InstructorsTab />}
          {tab === "messages" && <MessagesTab notify={notify} />}
          {tab === "reports" && (
            <ReportsTab stats={stats} bookings={bookings} catalog={catalog} plans={plans} />
          )}
          {tab === "settings" && <SettingsTab notify={notify} onReset={() => { resetAllData(); refresh(); notify("Przywrócono dane demo"); }} />}
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-[70] w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 rounded-2xl bg-fg px-4 py-3 text-center text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ─── Shared ─── */

function PageHead({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2.5 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
      <div className="min-w-0">
        <h1 className="text-lg font-bold tracking-tight text-fg sm:text-2xl">
          {title}
        </h1>
        {desc && (
          <p className="mt-0.5 text-xs leading-snug text-fg-secondary sm:mt-1 sm:text-sm">
            {desc}
          </p>
        )}
      </div>
      {action && <div className="flex w-full shrink-0 sm:w-auto">{action}</div>}
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-white p-3.5 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Card className="!p-3 sm:!p-4">
      <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-fg-muted">
        {label}
      </p>
      <p
        className={`mt-1 break-words text-base font-bold tracking-tight sm:mt-1.5 sm:text-xl ${
          accent ? "text-accent" : "text-fg"
        }`}
      >
        {value}
      </p>
      {hint && (
        <div className="mt-1 line-clamp-2 text-[10px] leading-snug text-fg-muted sm:text-xs">
          {hint}
        </div>
      )}
    </Card>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, string> = {
    pending: "bg-warning-soft text-warning",
    confirmed: "bg-success-soft text-success",
    cancelled: "bg-accent-soft text-accent",
    completed: "bg-[#f0f2f5] text-fg-secondary",
  };
  const labels: Record<BookingStatus, string> = {
    pending: "Oczekuje",
    confirmed: "Potwierdzona",
    cancelled: "Anulowana",
    completed: "Zakończona",
  };
  return <span className={`badge ${map[status]}`}>{labels[status]}</span>;
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, string> = {
    unpaid: "bg-warning-soft text-warning",
    paid: "bg-success-soft text-success",
    refunded: "bg-info-soft text-info",
    test: "bg-info-soft text-info",
  };
  const labels: Record<PaymentStatus, string> = {
    unpaid: "Nieopłacone",
    paid: "Opłacone",
    refunded: "Zwrot",
    test: "Test",
  };
  return <span className={`badge ${map[status]}`}>{labels[status]}</span>;
}

/* ─── Dashboard ─── */

function Dashboard({
  stats,
  bookings,
  catalog,
  onGo,
}: {
  stats: ReturnType<typeof getStats>;
  bookings: Booking[];
  catalog: DanceClass[];
  onGo: (t: Tab) => void;
}) {
  const recent = bookings.slice(0, 6);
  const a = useMemo(
    () => buildAnalytics(bookings, catalog),
    [bookings, catalog]
  );

  return (
    <div>
      <PageHead
        title="Pulpit"
        desc="Statystyki z realnych rezerwacji w tej przeglądarce"
      />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        <Stat
          label="Przychód"
          value={`${a.revenue.toLocaleString("pl-PL")} zł`}
          hint={`${a.paidCount} opłaconych · śr. ${a.avgTicket} zł`}
          accent
        />
        <Stat
          label="Rezerwacje"
          value={String(stats.totalBookings)}
          hint={`${stats.confirmed} potw. · ${stats.pending} czeka`}
        />
        <Stat
          label="Klienci"
          value={String(stats.customers)}
          hint={`${a.paidRate}% opłaconych rez.`}
        />
        <Stat
          label="Konwersja statusów"
          value={`${stats.occupancy}%`}
          hint={`Anul. ${a.cancelRate}%`}
        />
      </div>

      <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-fg">Przychód 7 dni (wg dnia tyg.)</h2>
            <MiniSparkline values={a.revenueDaily.map((d) => d.value)} />
          </div>
          <BarChart data={a.weekRevenue} height={150} />
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-fg">Udział kategorii</h2>
          <div className="mt-4">
            {a.byCategory.length > 0 ? (
              <ShareBar data={a.byCategory} />
            ) : (
              <p className="text-sm text-fg-muted">Brak danych</p>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-fg">14 dni — przychód</h2>
          <BarChart
            data={a.revenueDaily.map((d) => ({
              label: d.label,
              value: d.value,
            }))}
            height={120}
            showValues={false}
            color="#1d4e89"
          />
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-fg">Status płatności</h2>
          <BarChart data={a.paymentBars} height={120} />
        </Card>
      </div>

      <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fg">Ostatnie rezerwacje</h2>
            <button
              type="button"
              onClick={() => onGo("bookings")}
              className="text-xs font-semibold text-accent hover:underline"
            >
              Wszystkie
            </button>
          </div>
          <ul className="divide-y divide-border">
            {recent.length === 0 && (
              <li className="py-6 text-center text-sm text-fg-muted">Brak rezerwacji</li>
            )}
            {recent.map((b) => {
              const cls = catalog.find((c) => c.id === b.classId);
              return (
                <li
                  key={b.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">
                      {b.customerName}
                    </p>
                    <p className="truncate text-xs text-fg-muted">
                      {cls?.name ?? b.classId} · {b.date}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge status={b.status} />
                    <span className="text-xs font-semibold tabular-nums text-fg">
                      {b.amount} zł
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-fg">Szybkie akcje</h2>
          <div className="mt-4 space-y-2">
            {(
              [
                ["bookings", "Rezerwacje"],
                ["customers", "Klienci"],
                ["classes", "Zajęcia / usługi"],
                ["reports", "Raporty (realne dane)"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => onGo(id)}
                className="flex w-full items-center justify-between rounded-xl border border-border px-3.5 py-2.5 text-left text-sm font-medium text-fg hover:bg-[#f8f9fb]"
              >
                {label}
                <span className="text-fg-muted">→</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-white px-4 py-3 text-xs leading-relaxed text-fg-secondary sm:text-sm">
        <strong className="text-fg">Dane na żywo.</strong> Wykresy liczą się z
        rezerwacji w localStorage. Edytuj lub usuwaj wpisy — statystyki odświeżą się od razu.
      </div>
    </div>
  );
}

/* ─── Bookings ─── */

/* ─── Customers ─── */

/* ─── Schedule ─── */

function ScheduleTab() {
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div>
      <PageHead title="Grafik" desc="Obłożenie sal w tym tygodniu" />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {rooms.map((r) => (
          <Card key={r.id}>
            <p className="font-semibold text-fg">{r.name}</p>
            <p className="mt-1 text-xs text-fg-muted">
              max {r.capacity} · piętro {r.floor}
            </p>
          </Card>
        ))}
      </div>
      <div className="space-y-3">
        {dayOrder.map((day) => {
          const slots = schedule
            .filter((s) => s.dayOfWeek === day)
            .sort((a, b) => a.time.localeCompare(b.time));
          if (!slots.length) return null;
          return (
            <Card key={day}>
              <h2 className="mb-3 text-sm font-semibold text-fg">{DAYS[day]}</h2>
              <div className="space-y-2">
                {slots.map((slot) => {
                  const cls = classes.find((c) => c.id === slot.classId);
                  const pct = Math.round((slot.booked / slot.capacity) * 100);
                  return (
                    <div
                      key={slot.id}
                      className="flex flex-col gap-2 rounded-xl bg-[#f8f9fb] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-sm sm:gap-3">
                        <span className="w-12 font-mono font-semibold">{slot.time}</span>
                        <span className="font-medium">{cls?.name}</span>
                        <span className="text-xs text-fg-muted">{slot.room}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border">
                          <div
                            className={`h-full ${
                              pct >= 90
                                ? "bg-accent"
                                : pct >= 70
                                  ? "bg-warning"
                                  : "bg-success"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-16 text-right text-xs tabular-nums text-fg-muted">
                          {slot.booked}/{slot.capacity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Attendance ─── */

function AttendanceTab({
  bookings,
  notify,
}: {
  bookings: Booking[];
  notify: (m: string) => void;
}) {
  const confirmed = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "completed"
  );
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const init: Record<string, boolean> = {};
    confirmed.forEach((b) => {
      init[b.id] = b.status === "completed";
    });
    setChecks(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings.length]);

  function toggle(id: string) {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        updateBooking(id, { status: "completed" });
        notify("Obecność zaznaczona");
      } else {
        updateBooking(id, { status: "confirmed" });
        notify("Obecność cofnięta");
      }
      return next;
    });
  }

  return (
    <div>
      <PageHead
        title="Frekwencja"
        desc="Zaznacz obecność na zajęciach"
      />
      <Card className="!p-2 sm:!p-3">
        {confirmed.length === 0 && (
          <p className="py-10 text-center text-sm text-fg-muted">
            Brak potwierdzonych rezerwacji
          </p>
        )}
        {confirmed.map((b) => {
          const cls = classes.find((c) => c.id === b.classId);
          return (
            <label
              key={b.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 hover:bg-[#f8f9fb]"
            >
              <input
                type="checkbox"
                checked={!!checks[b.id]}
                onChange={() => toggle(b.id)}
                className="h-5 w-5 accent-[var(--accent)]"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-fg">{b.customerName}</p>
                <p className="text-xs text-fg-muted">
                  {cls?.name} · {b.date} {b.time}
                </p>
              </div>
            </label>
          );
        })}
      </Card>
    </div>
  );
}

/* ─── Payments ─── */

function PaymentsTab({
  bookings,
  revenue,
}: {
  bookings: Booking[];
  revenue: number;
}) {
  const paid = bookings.filter(
    (b) => b.paymentStatus === "paid" || b.paymentStatus === "test"
  );
  const unpaid = bookings.filter((b) => b.paymentStatus === "unpaid");
  const refunded = bookings.filter((b) => b.paymentStatus === "refunded");
  const all = [...paid, ...unpaid, ...refunded];

  return (
    <div>
      <PageHead title="Płatności" desc="Transakcje demo / test" />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Wpływy" value={`${revenue.toLocaleString("pl-PL")} zł`} accent />
        <Stat
          label="Oczekujące"
          value={String(unpaid.length)}
          hint={`${unpaid.reduce((s, b) => s + b.amount, 0)} zł`}
        />
        <Stat
          label="Zwroty"
          value={String(refunded.length)}
          hint={`${refunded.reduce((s, b) => s + b.amount, 0)} zł`}
        />
      </div>
      <div className="space-y-2 md:hidden">
        {all.map((b) => (
          <Card key={b.id}>
            <div className="flex justify-between gap-2">
              <p className="font-medium">{b.customerName}</p>
              <p className="font-bold tabular-nums">{b.amount} zł</p>
            </div>
            <p className="mt-1 font-mono text-[11px] text-fg-muted">{b.id}</p>
            <div className="mt-2">
              <PaymentBadge status={b.paymentStatus} />
            </div>
          </Card>
        ))}
      </div>
      <Card className="hidden !p-0 md:block">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border bg-[#fafbfc] text-[11px] uppercase tracking-wide text-fg-muted">
            <tr>
              {["ID", "Klient", "Metoda", "Status", "Kwota"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {all.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-mono text-xs">{b.id}</td>
                <td className="px-4 py-3">{b.customerName}</td>
                <td className="px-4 py-3 text-fg-muted">
                  {b.paymentStatus === "test" ? "Karta testowa" : "Online"}
                </td>
                <td className="px-4 py-3">
                  <PaymentBadge status={b.paymentStatus} />
                </td>
                <td className="px-4 py-3 font-semibold tabular-nums">
                  {b.amount} zł
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ─── Passes ─── */

function PassesTab({
  customers,
}: {
  customers: ReturnType<typeof getCustomers>;
}) {
  return (
    <div>
      <PageHead title="Karnety" desc="Typy i aktywne wejścia" />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pricingPlans.slice(0, 4).map((p) => (
          <Card key={p.id}>
            <p className="text-sm font-semibold text-fg">{p.name}</p>
            <p className="mt-2 text-2xl font-bold text-fg">
              {p.price}
              <span className="ml-1 text-sm font-medium text-fg-muted">zł</span>
            </p>
          </Card>
        ))}
      </div>
      <Card className="!p-0">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-fg">Aktywne karnety</h2>
        </div>
        <ul className="divide-y divide-border">
          {customers.map((c) => (
            <li
              key={c.id}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-fg">{c.name}</p>
                <p className="text-xs text-fg-muted">{c.passType}</p>
              </div>
              <span className="text-sm font-bold tabular-nums">
                {c.passEntries === 99 ? "∞" : c.passEntries} wejść
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ─── Classes ─── */

/* ─── Instructors ─── */

function InstructorsTab() {
  return (
    <div>
      <PageHead
        title="Nauczyciele"
        desc={`Zespół ${STUDIO.name}`}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {instructors.map((i) => (
          <Card key={i.id}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f0f2f5] text-xs font-bold text-fg">
                {i.name
                  .split(/[\s&]+/)
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-fg">{i.name}</p>
                <p className="text-xs text-fg-muted">{i.role}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-fg-muted">Zajęcia</span>
              <span className="font-bold">{i.classes}</span>
            </div>
            <span className="badge mt-3 bg-success-soft text-success">
              Aktywny
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─── Messages ─── */

function MessagesTab({ notify }: { notify: (m: string) => void }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState<"email" | "sms" | "push">("email");

  return (
    <div>
      <PageHead title="Wiadomości" desc="Komunikacja z kursantami (symulacja)" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold text-fg">Nowa wiadomość</h2>
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["email", "E-mail"],
                  ["sms", "SMS"],
                  ["push", "Push"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setChannel(id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    channel === id
                      ? "bg-fg text-white"
                      : "bg-[#f0f2f5] text-fg-secondary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Temat"
              className="field"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Treść…"
              rows={4}
              className="field resize-y"
            />
            <button
              type="button"
              onClick={() => {
                if (!subject.trim() && !body.trim()) {
                  notify("Uzupełnij treść");
                  return;
                }
                notify(`Wysłano (demo · ${channel})`);
                setSubject("");
                setBody("");
              }}
              className="btn-primary w-full sm:w-auto"
            >
              Wyślij (symulacja)
            </button>
          </div>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-fg">Historia</h2>
          <ul className="mt-4 divide-y divide-border">
            {[
              ["Przypomnienie o milondze", "E-mail", "48"],
              ["Zmiana sali — Tango P2", "SMS", "16"],
              ["Nowy karnet OPEN", "E-mail", "120"],
            ].map(([title, ch, n]) => (
              <li key={title} className="flex justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium text-fg">{title}</p>
                  <p className="text-xs text-fg-muted">{ch}</p>
                </div>
                <span className="text-xs text-fg-muted">{n} os.</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ─── Reports ─── */

function ReportsTab({
  stats,
  bookings,
  catalog,
  plans,
}: {
  stats: ReturnType<typeof getStats>;
  bookings: Booking[];
  catalog: DanceClass[];
  plans: PricingPlan[];
}) {
  const a = useMemo(
    () => buildAnalytics(bookings, catalog),
    [bookings, catalog]
  );

  const planName = (id: string) =>
    plans.find((p) => p.id === id)?.name ?? id;

  const byPassNamed = a.byPass.map((p) => ({
    ...p,
    label: planName(p.label),
  }));

  return (
    <div>
      <PageHead
        title="Raporty i analityka"
        desc="Wszystkie wykresy z realnych rezerwacji (localStorage)"
        action={
          <button
            type="button"
            onClick={() => {
              const rows = [
                "id;klient;email;zajecia;kwota;status;platnosc;data",
                ...bookings.map((b) => {
                  const cls = catalog.find((c) => c.id === b.classId);
                  return `${b.id};${b.customerName};${b.customerEmail};${cls?.name};${b.amount};${b.status};${b.paymentStatus};${b.createdAt}`;
                }),
              ].join("\n");
              const blob = new Blob([rows], {
                type: "text/csv;charset=utf-8",
              });
              const url = URL.createObjectURL(blob);
              const aEl = document.createElement("a");
              aEl.href = url;
              aEl.download = "bosodance-rezerwacje.csv";
              aEl.click();
              URL.revokeObjectURL(url);
            }}
            className="btn-secondary w-full !min-h-10 !py-2.5 text-xs sm:w-auto"
          >
            Eksport CSV
          </button>
        }
      />

      <div className="mb-3 grid grid-cols-2 gap-2.5 sm:mb-4 sm:gap-3 lg:grid-cols-4">
        <Stat
          label="Przychód"
          value={`${a.revenue.toLocaleString("pl-PL")} zł`}
          hint={`${a.paidCount} płatności`}
          accent
        />
        <Stat
          label="Rezerwacje"
          value={String(stats.totalBookings)}
          hint={`${stats.pending} oczekuje`}
        />
        <Stat label="Śr. koszyk" value={`${a.avgTicket} zł`} />
        <Stat
          label="Opłacone / anul."
          value={`${a.paidRate}% / ${a.cancelRate}%`}
        />
      </div>

      <div className="mb-3 grid gap-3 sm:mb-4 sm:gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-fg">Przychód — 8 tygodni</h2>
          <p className="mb-4 text-xs text-fg-muted">Suma opłaconych rezerwacji</p>
          <BarChart data={a.revenueWeekly} height={160} color="#d41820" />
        </Card>
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-fg">14 dni — przychód</h2>
          <p className="mb-4 text-xs text-fg-muted">Dzień po dniu</p>
          <BarChart
            data={a.revenueDaily}
            height={160}
            color="#1d4e89"
            showValues={false}
          />
        </Card>
      </div>

      <div className="mb-3 grid gap-3 sm:mb-4 sm:gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-fg">Kategorie zajęć</h2>
          {a.byCategory.length ? (
            <ShareBar data={a.byCategory} />
          ) : (
            <p className="text-sm text-fg-muted">Brak danych</p>
          )}
        </Card>
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-fg">Struktura karnetów</h2>
          {byPassNamed.length ? (
            <HorizontalBars data={byPassNamed} unit="%" />
          ) : (
            <p className="text-sm text-fg-muted">Brak danych</p>
          )}
        </Card>
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-fg">Frekwencja / dzień tyg.</h2>
          <BarChart data={a.attendanceRate} height={130} color="#0d7a4f" />
        </Card>
      </div>

      <div className="mb-3 grid gap-3 sm:mb-4 sm:gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-fg">Lejek statusów</h2>
          <p className="mb-4 text-xs text-fg-muted">Na podstawie bieżących rezerwacji</p>
          <FunnelChart data={a.funnel} />
        </Card>
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-fg">Godziny utworzenia rez.</h2>
          <BarChart data={a.byHour} height={140} color="#6a4c93" showValues={false} />
          <h2 className="mb-3 mt-6 text-sm font-semibold text-fg">Płatności</h2>
          <HorizontalBars data={a.paymentBars} />
        </Card>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <Card className="!p-0 overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-fg">Top zajęcia</h2>
            <p className="text-xs text-fg-muted">Wg liczby rezerwacji</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[280px] text-left text-sm">
              <thead className="bg-[#fafbfc] text-[11px] uppercase tracking-wide text-fg-muted">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Zajęcia</th>
                  <th className="px-4 py-2.5 font-semibold">Rez.</th>
                  <th className="px-4 py-2.5 font-semibold">Przychód</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {a.topClasses.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-fg-muted">
                      Brak danych
                    </td>
                  </tr>
                )}
                {a.topClasses.map((row) => (
                  <tr key={row.id} className="hover:bg-[#fafbfc]">
                    <td className="px-4 py-2.5 font-medium text-fg">{row.name}</td>
                    <td className="px-4 py-2.5 tabular-nums">{row.bookings}</td>
                    <td className="px-4 py-2.5 font-semibold tabular-nums">
                      {row.revenue.toLocaleString("pl-PL")} zł
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="!p-0 overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-fg">Top klienci</h2>
            <p className="text-xs text-fg-muted">Wydatki z rezerwacji</p>
          </div>
          <ul className="divide-y divide-border">
            {a.topCustomers.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-fg-muted">Brak danych</li>
            )}
            {a.topCustomers.map((c, i) => (
              <li key={c.email + c.name} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f0f2f5] text-xs font-bold text-fg-muted">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">{c.name}</p>
                    <p className="truncate text-xs text-fg-muted">{c.visits} wizyt · {c.email}</p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-bold tabular-nums text-fg">
                  {c.spent.toLocaleString("pl-PL")} zł
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {a.topClasses.length > 0 && (
        <Card className="mt-3 sm:mt-4">
          <h2 className="mb-4 text-sm font-semibold text-fg">Popularność zajęć</h2>
          <HorizontalBars
            data={a.topClasses.map((c) => ({
              label: c.name,
              value: c.bookings,
            }))}
          />
        </Card>
      )}

      <p className="mt-4 text-center text-[11px] text-fg-muted sm:text-xs">
        Usuń rezerwację lub zmień status — wykresy przeliczą się automatycznie.
      </p>
    </div>
  );
}

/* ─── Settings ─── */

function SettingsTab({ notify, onReset }: { notify: (m: string) => void; onReset: () => void }) {
  const [cancelHours, setCancelHours] = useState(48);
  const [passWeeks, setPassWeeks] = useState(4);

  return (
    <div>
      <PageHead title="Ustawienia" desc="Konfiguracja studia (demo lokalne)" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold text-fg">Studio</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Nazwa", STUDIO.name],
              ["Miasto", STUDIO.city],
              ["E-mail", STUDIO.email],
              ["Waluta", "PLN"],
              ["Strefa", "Europe/Warsaw"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between gap-3 border-b border-border pb-2"
              >
                <dt className="text-fg-muted">{k}</dt>
                <dd className="text-right font-medium text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-fg">Rezerwacje</h2>
          <div className="mt-4 space-y-4 text-sm">
            <label className="flex items-center justify-between gap-3">
              <span className="text-fg-secondary">Odwołanie (h)</span>
              <input
                type="number"
                min={0}
                value={cancelHours}
                onChange={(e) => setCancelHours(Number(e.target.value))}
                className="field w-20 text-right"
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="text-fg-secondary">Ważność karnetu (tyg.)</span>
              <input
                type="number"
                min={1}
                value={passWeeks}
                onChange={(e) => setPassWeeks(Number(e.target.value))}
                className="field w-20 text-right"
              />
            </label>
            <button
              type="button"
              onClick={() =>
                notify(`Zapisano: ${cancelHours}h / ${passWeeks} tyg.`)
              }
              className="btn-primary w-full"
            >
              Zapisz (demo)
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-fg">Dane demo</h2>
          <p className="mt-2 text-sm text-fg-secondary">
            Przywróć startowe rezerwacje, klientów, zajęcia i cennik. Usuwa lokalne zmiany.
          </p>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.confirm("Przywrócić wszystkie dane demo?")) {
                onReset();
              }
            }}
            className="btn-secondary mt-4 w-full"
          >
            Resetuj dane demo
          </button>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-fg">
            Co wchodzi w system na miarę
          </h2>
          <ul className="mt-4 grid gap-2 text-sm text-fg-secondary sm:grid-cols-2">
            {[
              "Stripe / Przelewy24 / BLIK",
              "Logowanie klientów",
              "Frekwencja dla nauczycieli",
              "SMS i e-mail automatycznie",
              "Role: admin / recepcja / trener",
              "Raporty PDF",
              "Google Calendar",
              "Branding i domena studia",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-accent">✓</span> {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
