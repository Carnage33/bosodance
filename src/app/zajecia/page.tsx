import Link from "next/link";
import { classes, categoryLabels } from "@/data/classes";
import type { ClassCategory } from "@/types";

const order: ClassCategory[] = [
  "tango",
  "wcs",
  "zouk",
  "fitness",
  "dzieci",
  "imprezy",
];

export default function ClassesPage() {
  return (
    <main className="container-app py-8 sm:py-12">
      <div className="max-w-2xl">
        <p className="label-section">Oferta</p>
        <h1 className="heading-page mt-1">Zajęcia</h1>
        <p className="mt-2 text-body">
          Od tanga argentyńskiego po WCS, Zouk i grupy dziecięce. Wybierz poziom i
          zarezerwuj miejsce online.
        </p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1 sm:mt-8 sm:flex-wrap">
        {order.map((cat) => (
          <a
            key={cat}
            href={`#${cat}`}
            className="shrink-0 rounded-full border border-border bg-bg-elevated px-3.5 py-1.5 text-sm font-medium text-fg-secondary hover:border-border-strong hover:text-fg"
          >
            {categoryLabels[cat]}
          </a>
        ))}
      </div>

      <div className="mt-10 space-y-12">
        {order.map((cat) => {
          const items = classes.filter((c) => c.category === cat);
          return (
            <section key={cat} id={cat} className="scroll-mt-24">
              <div className="mb-4 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: items[0]?.color }}
                />
                <h2 className="text-lg font-semibold text-fg">
                  {categoryLabels[cat]}
                </h2>
                <span className="text-sm text-fg-muted">({items.length})</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((cls) => (
                  <article key={cls.id} className="surface flex flex-col p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-fg">{cls.name}</h3>
                      <span className="badge shrink-0 bg-bg text-fg-secondary">
                        {cls.level}
                      </span>
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-secondary">
                      {cls.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-fg-muted">
                      <span>{cls.durationMin} min</span>
                      <span className="truncate pl-2">{cls.instructor}</span>
                    </div>
                    <Link
                      href={`/rezerwacja?class=${cls.id}`}
                      className="mt-3 block rounded-xl bg-fg py-2.5 text-center text-sm font-semibold text-white hover:bg-accent"
                    >
                      Rezerwuj
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
