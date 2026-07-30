import Link from "next/link";
import { pricingPlans, scheduleRules } from "@/data/classes";

export default function PricingPage() {
  const main = pricingPlans.filter((p) => !p.category);
  const special = pricingPlans.filter((p) => p.category);

  return (
    <main className="container-app py-8 sm:py-12">
      <div className="max-w-2xl">
        <p className="label-section">Cennik</p>
        <h1 className="heading-page mt-1">Karnety i wejścia</h1>
        <p className="mt-2 text-body">
          Karnety w wariantach 1–4 wejść tygodniowo. Ważność 4 tygodnie —
          wykorzystanie w ciągu 5 tygodni od zakupu.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {main.map((plan) => (
          <div
            key={plan.id}
            className={`surface relative flex flex-col p-5 sm:p-6 ${
              plan.highlight ? "ring-2 ring-accent/25" : ""
            }`}
          >
            {plan.highlight && (
              <span className="badge absolute -top-2.5 left-5 bg-accent text-white">
                Polecany
              </span>
            )}
            <h2 className="text-base font-semibold text-fg">{plan.name}</h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-fg">
              {plan.price}
              <span className="ml-1 text-base font-medium text-fg-muted">zł</span>
            </p>
            {plan.perEntry && (
              <p className="mt-1 text-sm text-fg-muted">
                {plan.perEntry} zł za wejście
              </p>
            )}
            <p className="mt-2 text-sm font-medium text-fg">
              {plan.entries === "open"
                ? "Nielimitowany dostęp"
                : `${plan.entries} ${
                    plan.entries === 1
                      ? "wejście"
                      : plan.entries < 5
                        ? "wejścia"
                        : "wejść"
                  }`}
            </p>
            {plan.note && (
              <p className="mt-2 flex-1 text-sm text-fg-secondary">{plan.note}</p>
            )}
            <Link
              href={`/rezerwacja?plan=${plan.id}`}
              className={`mt-5 block rounded-xl py-2.5 text-center text-sm font-semibold text-white ${
                plan.highlight
                  ? "bg-accent hover:bg-accent-hover"
                  : "bg-fg hover:bg-accent"
              }`}
            >
              Wybierz
            </Link>
          </div>
        ))}
      </div>

      {special.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-fg">Karnety specjalistyczne</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {special.map((plan) => (
              <div key={plan.id} className="surface flex flex-col p-5 sm:p-6">
                <h3 className="font-semibold text-fg">{plan.name}</h3>
                <p className="mt-3 text-2xl font-bold text-fg">
                  {plan.price}
                  <span className="ml-1 text-base font-medium text-fg-muted">zł</span>
                </p>
                {plan.note && (
                  <p className="mt-2 flex-1 text-sm text-fg-secondary">{plan.note}</p>
                )}
                <Link
                  href={`/rezerwacja?plan=${plan.id}`}
                  className="mt-4 block rounded-xl bg-fg py-2.5 text-center text-sm font-semibold text-white hover:bg-accent"
                >
                  Wybierz
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="surface mt-12 p-5 sm:p-8">
        <h2 className="text-base font-semibold text-fg">Regulamin karnetów</h2>
        <ol className="mt-4 space-y-3">
          {scheduleRules.map((rule, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-fg-secondary">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                {i + 1}
              </span>
              {rule}
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
