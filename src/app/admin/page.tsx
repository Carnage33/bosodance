"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  classes,
  pricingPlans,
  schedule,
  categoryLabels,
  instructors,
  rooms,
  STUDIO,
  DAYS,
} from "@/data/classes";
import {
  getBookings,
  getCustomers,
  getStats,
  updateBooking,
  addBooking,
} from "@/lib/store";
import type { Booking, BookingStatus, PaymentStatus } from "@/types";
import { analyticsDemo, pctChange } from "@/data/analytics";
import {
  BarChart,
  HorizontalBars,
  ShareBar,
  FunnelChart,
  DeltaBadge,
  MiniSparkline,
} from "@/components/Charts";

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
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setBookings(getBookings());
    setStats(getStats());
    setCustomers(getCustomers());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

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

  function setStatus(id: string, status: BookingStatus) {
    updateBooking(id, { status });
    refresh();
    notify(
      status === "confirmed"
        ? "Potwierdzono"
        : status === "cancelled"
          ? "Anulowano"
          : "Zaktualizowano status"
    );
  }

  function setPayment(id: string, paymentStatus: PaymentStatus) {
    updateBooking(id, { paymentStatus });
    refresh();
    notify("Płatność zaktualizowana");
  }

  function goTab(id: Tab) {
    setTab(id);
    setSidebarOpen(false);
  }

  const groups = ["Główne", "Operacje", "Finanse", "Studio"];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Top bar — sticky under demo banner */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between gap-3 px-3 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border lg:hidden"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Menu"
            >
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent text-[10px] font-bold text-white">
              bd
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg">{STUDIO.name}</p>
              <p className="truncate text-[11px] text-fg-muted">Panel administratora</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge hidden bg-warning-soft text-warning sm:inline-flex">Demo</span>
            <Link href="/" className="btn-secondary !min-h-0 !px-3 !py-1.5 text-xs">
              <span className="sm:hidden">←</span>
              <span className="hidden sm:inline">Strona klienta</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-0 lg:gap-4 lg:px-4 lg:py-4">
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-fg/30 backdrop-blur-[2px] lg:hidden"
            aria-label="Zamknij"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar: card with radius — floating on mobile, sticky card on desktop */}
        <aside
          className={`admin-scroll z-50 w-[min(17.5rem,88vw)] shrink-0 overflow-hidden border border-border bg-white transition-transform duration-200 ease-out
            fixed bottom-4 left-3 top-[5.25rem] rounded-2xl shadow-2xl
            lg:static lg:bottom-auto lg:left-auto lg:top-auto lg:z-0 lg:max-h-[calc(100vh-6rem)] lg:w-60 lg:translate-x-0 lg:self-start lg:sticky lg:top-[4.5rem] lg:rounded-2xl lg:shadow-sm
            ${sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+1.5rem)] lg:translate-x-0"}
          `}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
            <span className="text-sm font-semibold">Menu</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg px-2 py-1 text-sm text-fg-muted hover:bg-[#f4f5f7]"
            >
              Zamknij
            </button>
          </div>
          <nav className="admin-scroll max-h-full space-y-5 overflow-y-auto p-3 pb-8">
            {groups.map((group) => (
              <div key={group}>
                <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                  {group}
                </p>
                <div className="space-y-0.5">
                  {tabs
                    .filter((t) => t.group === group)
                    .map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => goTab(t.id)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium ${
                          tab === t.id
                            ? "bg-fg text-white shadow-sm"
                            : "text-fg-secondary hover:bg-[#f4f5f7] hover:text-fg"
                        }`}
                      >
                        {t.label}
                        {t.id === "bookings" && stats.pending > 0 && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              tab === t.id ? "bg-white/20" : "bg-accent text-white"
                            }`}
                          >
                            {stats.pending}
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden p-3 pb-12 sm:p-5 lg:p-2 lg:pb-10">
          {tab === "dashboard" && (
            <Dashboard stats={stats} bookings={bookings} onGo={goTab} />
          )}
          {tab === "bookings" && (
            <BookingsTab
              bookings={filtered}
              filter={filter}
              setFilter={setFilter}
              query={query}
              setQuery={setQuery}
              setStatus={setStatus}
              setPayment={setPayment}
              onCreateDemo={() => {
                addBooking({
                  classId: "tango-p1",
                  planId: "single",
                  customerName: "Gość Demo",
                  customerEmail: "gosc@demo.pl",
                  customerPhone: "+48 600 000 001",
                  date: new Date().toISOString().slice(0, 10),
                  time: "18:00",
                  status: "pending",
                  paymentStatus: "unpaid",
                  amount: 60,
                });
                refresh();
                notify("Dodano rezerwację demo");
              }}
            />
          )}
          {tab === "customers" && <CustomersTab customers={customers} />}
          {tab === "schedule" && <ScheduleTab />}
          {tab === "attendance" && (
            <AttendanceTab bookings={bookings} notify={notify} />
          )}
          {tab === "payments" && (
            <PaymentsTab bookings={bookings} revenue={stats.revenue} />
          )}
          {tab === "passes" && <PassesTab customers={customers} />}
          {tab === "classes" && <ClassesTab />}
          {tab === "instructors" && <InstructorsTab />}
          {tab === "messages" && <MessagesTab notify={notify} />}
          {tab === "reports" && <ReportsTab stats={stats} bookings={bookings} />}
          {tab === "settings" && <SettingsTab notify={notify} />}
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-xl bg-fg px-4 py-3 text-center text-sm font-medium text-white shadow-lg">
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
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
          {title}
        </h1>
        {desc && <p className="mt-1 text-sm text-fg-secondary">{desc}</p>}
      </div>
      {action}
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
    <div className={`rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5 ${className}`}>
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
    <Card className="!p-3 sm:!p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-fg-muted sm:text-[11px]">
        {label}
      </p>
      <p
        className={`mt-1.5 text-lg font-bold tracking-tight sm:mt-2 sm:text-2xl ${
          accent ? "text-accent" : "text-fg"
        }`}
      >
        {value}
      </p>
      {hint && (
        <div className="mt-1 text-[11px] text-fg-muted sm:text-xs">{hint}</div>
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

function ActionBtn({
  children,
  onClick,
  tone = "neutral",
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "green" | "red" | "blue" | "neutral";
}) {
  const tones = {
    green: "bg-success-soft text-success hover:opacity-80",
    red: "bg-accent-soft text-accent hover:opacity-80",
    blue: "bg-info-soft text-info hover:opacity-80",
    neutral: "bg-[#f0f2f5] text-fg-secondary hover:bg-[#e6e8ec]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

/* ─── Dashboard ─── */

function Dashboard({
  stats,
  bookings,
  onGo,
}: {
  stats: ReturnType<typeof getStats>;
  bookings: Booking[];
  onGo: (t: Tab) => void;
}) {
  const recent = bookings.slice(0, 5);
  const a = analyticsDemo;
  const revDelta = pctChange(a.kpis.revenueMonth, a.kpis.revenuePrevMonth);

  return (
    <div>
      <PageHead
        title="Pulpit"
        desc={`${a.periodLabel} · dane przykładowe + lokalne rezerwacje`}
      />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        <Stat
          label="Przychód (mies.)"
          value={`${a.kpis.revenueMonth.toLocaleString("pl-PL")} zł`}
          hint={
            <span className="inline-flex items-center gap-1.5">
              <DeltaBadge value={revDelta} /> vs poprz. mies.
            </span>
          }
          accent
        />
        <Stat
          label="Śr. koszyk"
          value={`${a.kpis.avgTicket} zł`}
          hint={`${a.kpis.conversionRate}% konwersji płatności`}
        />
        <Stat
          label="Nowi klienci"
          value={String(a.kpis.newCustomers)}
          hint={`${a.kpis.returningRate}% wracających`}
        />
        <Stat
          label="Obłożenie"
          value={`${a.kpis.occupancyAvg}%`}
          hint={`No-show ${a.kpis.noShowRate}% · anul. ${a.kpis.cancelRate}%`}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-3 lg:grid-cols-4">
        <Stat label="Aktywne karnety" value={String(a.kpis.activePasses)} hint={`${a.kpis.openPasses} OPEN`} />
        <Stat label="Lista rezerwowa" value={String(a.kpis.waitlist)} hint="osób czeka" />
        <Stat label="Zajęcia (30 dni)" value={String(a.kpis.classesHeld)} hint="przeprowadzonych" />
        <Stat
          label="Lokalne rezerwacje"
          value={String(stats.totalBookings)}
          hint={`${stats.pending} oczekuje · sesja przeglądarki`}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-fg">Przychód w tygodniu</h2>
            <span className="text-xs text-fg-muted">PLN · demo</span>
          </div>
          <BarChart data={a.weekRevenue} height={150} />
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-fg">Udział kategorii</h2>
          <div className="mt-4">
            <ShareBar data={a.byCategory} />
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fg">14 dni — przychód</h2>
            <MiniSparkline values={a.revenueDaily.map((d) => d.value)} />
          </div>
          <BarChart
            data={a.revenueDaily.map((d) => ({
              label: d.label.slice(0, 5),
              value: d.value,
            }))}
            height={120}
            showValues={false}
            color="#1d4e89"
          />
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-fg">
            Godziny szczytu (rezerwacje)
          </h2>
          <BarChart data={a.byHour} height={120} color="#6a4c93" />
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
            {recent.map((b) => {
              const cls = classes.find((c) => c.id === b.classId);
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
                      {cls?.name} · {b.date}
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
                ["attendance", "Frekwencja"],
                ["reports", "Pełne raporty"],
                ["messages", "Wiadomości"],
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

      <div className="mt-4 rounded-2xl border border-warning/20 bg-warning-soft px-4 py-3 text-xs leading-relaxed text-warning sm:text-sm">
        <strong>Wersja demo.</strong> Wykresy i KPI to dane przykładowe do
        prezentacji. Lokalne rezerwacje z formularza widać w tabeli powyżej.
      </div>
    </div>
  );
}

/* ─── Bookings ─── */

function BookingsTab({
  bookings,
  filter,
  setFilter,
  query,
  setQuery,
  setStatus,
  setPayment,
  onCreateDemo,
}: {
  bookings: Booking[];
  filter: "all" | BookingStatus;
  setFilter: (f: "all" | BookingStatus) => void;
  query: string;
  setQuery: (q: string) => void;
  setStatus: (id: string, s: BookingStatus) => void;
  setPayment: (id: string, p: PaymentStatus) => void;
  onCreateDemo: () => void;
}) {
  return (
    <div>
      <PageHead
        title="Rezerwacje"
        desc="Statusy, płatności i szybkie akcje"
        action={
          <button type="button" onClick={onCreateDemo} className="btn-primary !min-h-0 !py-2 text-xs">
            + Dodaj demo
          </button>
        }
      />

      <Card className="mb-4 !p-3 sm:!p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj: imię, e-mail, ID…"
          className="field mb-3"
        />
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["all", "Wszystkie"],
              ["pending", "Oczekujące"],
              ["confirmed", "Potwierdzone"],
              ["cancelled", "Anulowane"],
              ["completed", "Zakończone"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                filter === id
                  ? "bg-fg text-white"
                  : "bg-[#f0f2f5] text-fg-secondary hover:bg-[#e6e8ec]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {bookings.length === 0 && (
          <Card className="py-10 text-center text-sm text-fg-muted">
            Brak rezerwacji
          </Card>
        )}
        {bookings.map((b) => {
          const cls = classes.find((c) => c.id === b.classId);
          return (
            <Card key={b.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-fg">{b.customerName}</p>
                  <p className="truncate text-xs text-fg-muted">{b.customerEmail}</p>
                </div>
                <span className="text-sm font-bold tabular-nums">{b.amount} zł</span>
              </div>
              <p className="mt-2 text-sm text-fg-secondary">
                {cls?.name} · {b.date} {b.time}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <StatusBadge status={b.status} />
                <PaymentBadge status={b.paymentStatus} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {b.status !== "confirmed" && (
                  <ActionBtn onClick={() => setStatus(b.id, "confirmed")} tone="green">
                    Potwierdź
                  </ActionBtn>
                )}
                {b.status !== "cancelled" && (
                  <ActionBtn onClick={() => setStatus(b.id, "cancelled")} tone="red">
                    Anuluj
                  </ActionBtn>
                )}
                {b.status === "confirmed" && (
                  <ActionBtn onClick={() => setStatus(b.id, "completed")}>
                    Zakończ
                  </ActionBtn>
                )}
                {b.paymentStatus !== "paid" && b.paymentStatus !== "test" && (
                  <ActionBtn onClick={() => setPayment(b.id, "paid")} tone="blue">
                    Płatne
                  </ActionBtn>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Desktop table */}
      <Card className="hidden !p-0 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="border-b border-border bg-[#fafbfc] text-[11px] uppercase tracking-wide text-fg-muted">
              <tr>
                {["Klient", "Zajęcia", "Termin", "Status", "Płatność", "Kwota", "Akcje"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-fg-muted">
                    Brak rezerwacji
                  </td>
                </tr>
              )}
              {bookings.map((b) => {
                const cls = classes.find((c) => c.id === b.classId);
                const plan = pricingPlans.find((p) => p.id === b.planId);
                return (
                  <tr key={b.id} className="hover:bg-[#fafbfc]">
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-fg">{b.customerName}</p>
                      <p className="text-xs text-fg-muted">{b.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium">{cls?.name}</p>
                      <p className="text-xs text-fg-muted">{plan?.name}</p>
                    </td>
                    <td className="px-4 py-3.5 tabular-nums">
                      <p>{b.date}</p>
                      <p className="text-xs text-fg-muted">{b.time}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <PaymentBadge status={b.paymentStatus} />
                    </td>
                    <td className="px-4 py-3.5 font-semibold tabular-nums">
                      {b.amount} zł
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {b.status !== "confirmed" && (
                          <ActionBtn onClick={() => setStatus(b.id, "confirmed")} tone="green">
                            Potwierdź
                          </ActionBtn>
                        )}
                        {b.status !== "cancelled" && (
                          <ActionBtn onClick={() => setStatus(b.id, "cancelled")} tone="red">
                            Anuluj
                          </ActionBtn>
                        )}
                        {b.status === "confirmed" && (
                          <ActionBtn onClick={() => setStatus(b.id, "completed")}>
                            Zakończ
                          </ActionBtn>
                        )}
                        {b.paymentStatus !== "paid" && b.paymentStatus !== "test" && (
                          <ActionBtn onClick={() => setPayment(b.id, "paid")} tone="blue">
                            Płatne
                          </ActionBtn>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ─── Customers ─── */

function CustomersTab({
  customers,
}: {
  customers: ReturnType<typeof getCustomers>;
}) {
  const [q, setQ] = useState("");
  const list = customers.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <PageHead title="Klienci" desc={`${customers.length} osób w bazie demo`} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Szukaj klienta…"
        className="field mb-4 max-w-sm"
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] text-xs font-bold text-fg">
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <span className="badge max-w-[50%] truncate bg-[#f0f2f5] text-fg-secondary">
                {c.passType}
              </span>
            </div>
            <h3 className="mt-3 font-semibold text-fg">{c.name}</h3>
            <p className="truncate text-xs text-fg-muted">{c.email}</p>
            <p className="text-xs text-fg-muted">{c.phone}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="text-fg-muted">Wejścia</span>
              <span className="font-bold tabular-nums">
                {c.passEntries === 99 ? "∞ OPEN" : c.passEntries}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

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

function ClassesTab() {
  const cats = Object.keys(categoryLabels);
  return (
    <div>
      <PageHead title="Katalog zajęć" desc={`${classes.length} pozycji`} />
      {cats.map((cat) => {
        const items = classes.filter((c) => c.category === cat);
        if (!items.length) return null;
        return (
          <div key={cat} className="mb-6">
            <h2 className="mb-2 text-sm font-semibold text-fg">
              {categoryLabels[cat]}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((cls) => (
                <Card key={cls.id} className="!p-3.5">
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: cls.color }}
                    />
                    <div>
                      <p className="font-semibold text-fg">{cls.name}</p>
                      <p className="text-xs text-fg-muted">
                        {cls.level} · {cls.durationMin} min · {cls.instructor}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
}: {
  stats: ReturnType<typeof getStats>;
  bookings: Booking[];
}) {
  const a = analyticsDemo;
  const revDelta = pctChange(a.kpis.revenueMonth, a.kpis.revenuePrevMonth);

  const byClassLive = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.forEach((b) => {
      map[b.classId] = (map[b.classId] || 0) + 1;
    });
    return Object.entries(map)
      .map(([id, count]) => ({
        label: classes.find((c) => c.id === id)?.name ?? id,
        value: count,
      }))
      .sort((x, y) => y.value - x.value)
      .slice(0, 8);
  }, [bookings]);

  return (
    <div>
      <PageHead
        title="Raporty i analityka"
        desc={a.periodLabel}
        action={
          <button
            type="button"
            onClick={() => {
              const rows = [
                "id;klient;email;zajecia;kwota;status;platnosc",
                ...bookings.map((b) => {
                  const cls = classes.find((c) => c.id === b.classId);
                  return `${b.id};${b.customerName};${b.customerEmail};${cls?.name};${b.amount};${b.status};${b.paymentStatus}`;
                }),
              ].join("\n");
              const blob = new Blob([rows], {
                type: "text/csv;charset=utf-8",
              });
              const url = URL.createObjectURL(blob);
              const aEl = document.createElement("a");
              aEl.href = url;
              aEl.download = "bosodance-rezerwacje-demo.csv";
              aEl.click();
              URL.revokeObjectURL(url);
            }}
            className="btn-secondary !min-h-0 !py-2 text-xs"
          >
            Eksport CSV
          </button>
        }
      />

      <div className="mb-3 grid grid-cols-2 gap-2.5 sm:mb-4 sm:gap-3 lg:grid-cols-4">
        <Stat
          label="Przychód 30 dni"
          value={`${a.kpis.revenueMonth.toLocaleString("pl-PL")} zł`}
          hint={
            <span className="inline-flex items-center gap-1.5">
              <DeltaBadge value={revDelta} /> m/m
            </span>
          }
          accent
        />
        <Stat
          label="Rezerwacje (demo)"
          value={String(a.monthly[a.monthly.length - 1]?.bookings ?? stats.totalBookings)}
          hint={`Lokalnie: ${stats.totalBookings}`}
        />
        <Stat label="Konwersja" value={`${a.kpis.conversionRate}%`} hint="Start → płatność" />
        <Stat
          label="Frekwencja śr."
          value={`${a.kpis.occupancyAvg}%`}
          hint={`No-show ${a.kpis.noShowRate}%`}
        />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2.5 sm:mb-4 sm:gap-3 lg:grid-cols-4">
        <Stat label="Anulowania" value={`${a.kpis.cancelRate}%`} hint="w okresie" />
        <Stat label="Śr. koszyk" value={`${a.kpis.avgTicket} zł`} />
        <Stat
          label="SMS / e-mail"
          value={`${a.kpis.smsSent} / ${a.kpis.emailsSent}`}
          hint="wysłane (demo)"
        />
        <Stat
          label="Karnety aktywne"
          value={String(a.kpis.activePasses)}
          hint={`${a.kpis.openPasses} OPEN`}
        />
      </div>

      <div className="mb-3 grid gap-3 sm:mb-4 sm:gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-fg">Przychód — 8 tygodni</h2>
          <p className="mb-4 text-xs text-fg-muted">Suma PLN / tydzień</p>
          <BarChart data={a.revenueWeekly} height={160} color="#d41820" />
        </Card>
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-fg">Trend 6 miesięcy</h2>
          <p className="mb-4 text-xs text-fg-muted">Przychód miesięczny</p>
          <BarChart
            data={a.monthly.map((m) => ({ label: m.label, value: m.revenue }))}
            height={160}
            color="#1d4e89"
          />
          <div className="mt-3 flex flex-wrap gap-3 border-t border-border pt-3 text-xs text-fg-muted">
            {a.monthly.map((m) => (
              <span key={m.label}>
                <strong className="text-fg">{m.label}</strong> · {m.bookings} rez.
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="mb-3 grid gap-3 sm:mb-4 sm:gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-fg">Kategorie zajęć</h2>
          <ShareBar data={a.byCategory} />
        </Card>
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-fg">Struktura karnetów</h2>
          <HorizontalBars data={a.byPass} unit="%" />
        </Card>
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-fg">Frekwencja / dzień tyg.</h2>
          <BarChart data={a.attendanceRate} height={130} color="#0d7a4f" />
        </Card>
      </div>

      <div className="mb-3 grid gap-3 sm:mb-4 sm:gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-fg">Lejek rezerwacji</h2>
          <p className="mb-4 text-xs text-fg-muted">Od wejścia na stronę do płatności (demo)</p>
          <FunnelChart data={a.funnel} />
        </Card>
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-fg">Wykorzystanie sal</h2>
          <HorizontalBars
            data={a.rooms.map((r) => ({
              label: r.name,
              value: r.utilization,
              color: r.utilization >= 80 ? "#d41820" : "#1d4e89",
            }))}
            unit="%"
          />
          <h2 className="mb-3 mt-6 text-sm font-semibold text-fg">Godziny szczytu</h2>
          <BarChart data={a.byHour} height={100} color="#6a4c93" showValues={false} />
        </Card>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <Card className="!p-0 overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-fg">Top zajęcia</h2>
            <p className="text-xs text-fg-muted">Dane demonstracyjne</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[280px] text-left text-sm">
              <thead className="bg-[#fafbfc] text-[11px] uppercase tracking-wide text-fg-muted">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Zajęcia</th>
                  <th className="px-4 py-2.5 font-semibold">Rez.</th>
                  <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Obłoż.</th>
                  <th className="px-4 py-2.5 font-semibold">Przychód</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {a.topClasses.map((row) => (
                  <tr key={row.name} className="hover:bg-[#fafbfc]">
                    <td className="px-4 py-2.5 font-medium text-fg">{row.name}</td>
                    <td className="px-4 py-2.5 tabular-nums">{row.bookings}</td>
                    <td className="hidden px-4 py-2.5 tabular-nums text-fg-muted sm:table-cell">
                      {row.occupancy}%
                    </td>
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
            <h2 className="text-sm font-semibold text-fg">Najwięksi klienci (demo)</h2>
            <p className="text-xs text-fg-muted">Wydatki i wizyty w okresie</p>
          </div>
          <ul className="divide-y divide-border">
            {a.topCustomers.map((c, i) => (
              <li key={c.name} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f0f2f5] text-xs font-bold text-fg-muted">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">{c.name}</p>
                    <p className="text-xs text-fg-muted">{c.visits} wizyt</p>
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

      {byClassLive.length > 0 && (
        <Card className="mt-3 sm:mt-4">
          <h2 className="mb-4 text-sm font-semibold text-fg">
            Popularność — ta sesja przeglądarki
          </h2>
          <HorizontalBars data={byClassLive} />
        </Card>
      )}

      <p className="mt-4 text-center text-[11px] text-fg-muted sm:text-xs">
        Większość wykresów to dane demonstracyjne. Eksport CSV obejmuje rezerwacje z tej przeglądarki.
      </p>
    </div>
  );
}

/* ─── Settings ─── */

function SettingsTab({ notify }: { notify: (m: string) => void }) {
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
