import Link from "next/link";
import { classes, schedule, DAYS, categoryLabels } from "@/data/classes";

export default function SchedulePage() {
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];

  return (
    <main className="container-app py-8 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="label-section">Grafik</p>
          <h1 className="heading-page mt-1">Tygodniowy plan</h1>
          <p className="mt-2 text-body">
            Wolne miejsca i sale. Wybierz termin i przejdź od razu do rezerwacji.
          </p>
        </div>
        <Link href="/rezerwacja" className="btn-primary shrink-0">
          Rezerwuj
        </Link>
      </div>

      <div className="mt-8 space-y-6">
        {dayOrder.map((day) => {
          const slots = schedule
            .filter((s) => s.dayOfWeek === day)
            .sort((a, b) => a.time.localeCompare(b.time));
          if (!slots.length) return null;

          return (
            <section key={day}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-muted">
                {DAYS[day]}
              </h2>
              <div className="surface overflow-hidden divide-y divide-border">
                {slots.map((slot) => {
                  const cls = classes.find((c) => c.id === slot.classId);
                  if (!cls) return null;
                  const free = slot.capacity - slot.booked;
                  const full = free <= 0;
                  const pct = Math.round((slot.booked / slot.capacity) * 100);

                  return (
                    <div
                      key={slot.id}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
                        <div className="w-12 shrink-0 sm:w-14">
                          <p className="text-base font-bold tabular-nums text-fg sm:text-lg">
                            {slot.time}
                          </p>
                          <p className="text-[11px] text-fg-muted">
                            {cls.durationMin} min
                          </p>
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-fg">{cls.name}</h3>
                            <span className="badge bg-bg text-fg-muted">
                              {categoryLabels[cls.category]}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-fg-secondary">
                            {slot.room} · {cls.instructor}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border sm:w-28">
                              <div
                                className={`h-full rounded-full ${
                                  full
                                    ? "bg-fg-muted"
                                    : free <= 3
                                      ? "bg-warning"
                                      : "bg-success"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-fg-muted">
                              {full ? "Pełne" : `${free} wolne`} · {slot.booked}/
                              {slot.capacity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={
                          full
                            ? "#"
                            : `/rezerwacja?class=${cls.id}&slot=${slot.id}`
                        }
                        className={`shrink-0 rounded-xl px-4 py-2.5 text-center text-sm font-semibold ${
                          full
                            ? "cursor-not-allowed bg-bg text-fg-muted"
                            : "bg-fg text-white hover:bg-accent"
                        }`}
                        aria-disabled={full}
                      >
                        {full ? "Pełne" : "Rezerwuj"}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
