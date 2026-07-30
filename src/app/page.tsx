import Image from "next/image";
import Link from "next/link";
import {
  classes,
  categoryLabels,
  STUDIO,
  pricingPlans,
  schedule,
  instructors,
} from "@/data/classes";

const featuredCategories = [
  "tango",
  "wcs",
  "zouk",
  "fitness",
  "dzieci",
  "imprezy",
] as const;

const categoryVisual: Record<
  string,
  { src: string; alt: string; tone: string }
> = {
  tango: {
    src: "/images/dance-tango.jpg",
    alt: "Tango argentyńskie",
    tone: "from-black/55",
  },
  wcs: {
    src: "/images/dance-wcs.jpg",
    alt: "West Coast Swing",
    tone: "from-black/50",
  },
  zouk: {
    src: "/images/dance-solo.jpg",
    alt: "Zouk",
    tone: "from-black/55",
  },
  fitness: {
    src: "/images/studio-room.jpg",
    alt: "Pilates i Body Balet",
    tone: "from-black/45",
  },
  dzieci: {
    src: "/images/dance-wcs.jpg",
    alt: "Zajęcia dla dzieci",
    tone: "from-black/50",
  },
  imprezy: {
    src: "/images/dance-tango.jpg",
    alt: "Milonga",
    tone: "from-black/55",
  },
};

export default function HomePage() {
  const plans = pricingPlans.filter((p) =>
    ["single", "pass-8", "pass-12", "open"].includes(p.id)
  );

  return (
    <main>
      {/* Hero: studio first, booking second */}
      <section className="border-b border-border bg-bg-elevated">
        <div className="container-app py-8 sm:py-12 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p className="label-section">Bosodance · Sopot</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                Szkoła tańca,
                <span className="text-accent"> rezerwacje online</span>
              </h1>
              <p className="mt-4 text-body sm:text-base">
                Tango argentyńskie, West Coast Swing, Zouk, Pilates i grupy
                dziecięce. Tu kursanci rezerwują miejsca i kupują karnety —
                a studio ma wszystko w jednym panelu.
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <Link
                  href="/rezerwacja"
                  className="btn-primary w-full sm:w-auto sm:px-7"
                >
                  Zarezerwuj zajęcia
                </Link>
                <Link
                  href="/o-nas"
                  className="btn-secondary w-full sm:w-auto sm:px-7"
                >
                  O studiu
                </Link>
              </div>
              <dl className="mt-8 grid grid-cols-3 gap-2 border-t border-border pt-6">
                {[
                  { v: `${classes.length}+`, l: "zajęć" },
                  { v: String(schedule.length), l: "terminów / tydz." },
                  { v: String(instructors.length), l: "nauczycieli" },
                ].map((s) => (
                  <div key={s.l}>
                    <dt className="text-lg font-bold tracking-tight text-fg sm:text-xl">
                      {s.v}
                    </dt>
                    <dd className="text-[11px] text-fg-muted sm:text-xs">{s.l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Visual collage */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-12 gap-2 sm:gap-3">
                <div className="relative col-span-7 aspect-[4/5] overflow-hidden rounded-2xl bg-fg/5 sm:aspect-[4/4.5]">
                  <Image
                    src="/images/dance-tango.jpg"
                    alt="Para w tańcu — tango"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 60vw, 40vw"
                    priority
                  />
                </div>
                <div className="col-span-5 flex flex-col gap-2 sm:gap-3">
                  <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-fg/5">
                    <Image
                      src="/images/dance-solo.jpg"
                      alt="Technika i ruch"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 40vw, 25vw"
                      priority
                    />
                  </div>
                  <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-fg/5">
                    <Image
                      src="/images/dance-wcs.jpg"
                      alt="West Coast Swing"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 40vw, 25vw"
                    />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-[11px] text-fg-muted sm:text-left sm:text-xs">
                Grafiki przykładowe do prezentacji · w produkcji: Wasze zdjęcia
                ze studia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O studiu */}
      <section className="container-app py-10 sm:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative order-2 aspect-[16/11] overflow-hidden rounded-2xl bg-fg/5 lg:order-1">
            <Image
              src="/images/studio-room.jpg"
              alt="Sala taneczna Bosodance"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="label-section">Studio</p>
            <h2 className="heading-page mt-1">Bosodance w Sopocie</h2>
            <p className="mt-3 text-body">
              Miejsce, w którym tango argentyńskie spotyka West Coast Swing,
              Zouk, Pilates i Body Balet. Prowadzimy grupy od zera po
              zaawansowane, milongi, seminaria i zajęcia dla dzieci.
            </p>
            <p className="mt-3 text-body">
              Ta strona to{" "}
              <strong className="font-semibold text-fg">
                demo systemu rezerwacji
              </strong>{" "}
              przygotowane pod Wasze studio: oferta, grafik, cennik, płatności
              testowe i panel administracyjny. W produkcji podmieniamy grafiki,
              dane i integracje — na miarę Waszych procesów.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                "Karnety 4 / 8 / 12 wejść i OPEN — reguły 4+1 tydzień",
                "Odwołania min. 48h przed zajęciami",
                "Milonga la Despeinada, seminaria, Ladies Technique",
                "Panel admina: rezerwacje, frekwencja, płatności, raporty",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm text-fg-secondary"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Link href="/o-nas" className="btn-secondary">
                Więcej o studiu
              </Link>
              <Link href="/zajecia" className="btn-ghost">
                Pełna oferta →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How booking works */}
      <section className="border-y border-border bg-bg-elevated py-10 sm:py-14">
        <div className="container-app">
          <div className="mb-6 max-w-xl sm:mb-8">
            <p className="label-section">Dla kursanta</p>
            <h2 className="heading-page mt-1">Rezerwacja w trzech krokach</h2>
            <p className="mt-2 text-sm text-fg-secondary">
              Intuicyjny flow, który kursanci ogarniają bez instrukcji — a
              studio widzi wszystko od razu w panelu.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              {
                n: "1",
                t: "Wybierz zajęcia i termin",
                d: "Tango, WCS, Zouk, fitness lub dzieci. Widzisz wolne miejsca w grafiku.",
              },
              {
                n: "2",
                t: "Wybierz karnet",
                d: "Pojedyncze wejście, karnet 4–12 lub OPEN. Cena jasna przed płatnością.",
              },
              {
                n: "3",
                t: "Opłać i przyjdź",
                d: "Płatność online (tu: tryb testowy), potwierdzenie, reguła 48h na odwołanie.",
              },
            ].map((step) => (
              <div key={step.n} className="surface p-5 sm:p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
                  {step.n}
                </span>
                <h3 className="mt-3 text-base font-semibold text-fg">{step.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-secondary">
                  {step.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories with images */}
      <section className="container-app py-10 sm:py-14">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="label-section">Oferta</p>
            <h2 className="heading-page mt-1">Co tańczymy</h2>
          </div>
          <Link
            href="/zajecia"
            className="shrink-0 text-sm font-semibold text-fg hover:text-accent"
          >
            Wszystkie →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((cat) => {
            const items = classes.filter((c) => c.category === cat);
            const visual = categoryVisual[cat];
            return (
              <Link
                key={cat}
                href={`/zajecia#${cat}`}
                className="group overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-sm transition hover:border-border-strong hover:shadow-md"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-fg/5">
                  <Image
                    src={visual.src}
                    alt={visual.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${visual.tone} via-black/10 to-transparent`}
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-fg">
                    {items.length} zajęć
                  </span>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-base font-semibold text-fg group-hover:text-accent">
                    {categoryLabels[cat]}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-fg-secondary">
                    {items
                      .slice(0, 4)
                      .map((c) => c.name)
                      .join(" · ")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Team strip */}
      <section className="border-y border-border bg-bg-elevated py-10 sm:py-12">
        <div className="container-app">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="label-section">Zespół</p>
              <h2 className="heading-page mt-1">Nauczyciele</h2>
            </div>
            <Link
              href="/o-nas"
              className="text-sm font-semibold text-fg hover:text-accent"
            >
              O studiu →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {instructors.map((i) => (
              <div
                key={i.id}
                className="surface flex flex-col items-center px-3 py-4 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fg text-xs font-bold text-white">
                  {i.name
                    .split(/[\s&]+/)
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <p className="mt-2.5 text-sm font-semibold leading-snug text-fg">
                  {i.name}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-fg-muted">
                  {i.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container-app py-10 sm:py-14">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="label-section">Cennik</p>
            <h2 className="heading-page mt-1">Karnety</h2>
            <p className="mt-1 text-sm text-fg-secondary">
              4 tygodnie ważności · wykorzystaj w ciągu 5 tygodni od zakupu
            </p>
          </div>
          <Link
            href="/cennik"
            className="shrink-0 text-sm font-semibold text-fg hover:text-accent"
          >
            Pełny cennik →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`surface flex flex-col p-5 ${
                plan.highlight ? "ring-2 ring-accent/30" : ""
              }`}
            >
              {plan.highlight && (
                <span className="badge mb-2 w-fit bg-accent-soft text-accent">
                  Popularny
                </span>
              )}
              <h3 className="text-sm font-semibold text-fg">{plan.name}</h3>
              <p className="mt-3 text-3xl font-bold tracking-tight text-fg">
                {plan.price}
                <span className="ml-1 text-base font-medium text-fg-muted">
                  zł
                </span>
              </p>
              {plan.perEntry && (
                <p className="mt-1 text-xs text-fg-muted">
                  {plan.perEntry} zł / wejście
                </p>
              )}
              <p className="mt-3 flex-1 text-sm text-fg-secondary">{plan.note}</p>
              <Link
                href={`/rezerwacja?plan=${plan.id}`}
                className={`mt-4 block rounded-xl py-2.5 text-center text-sm font-semibold ${
                  plan.highlight
                    ? "bg-accent text-white hover:bg-accent-hover"
                    : "bg-fg text-white hover:bg-fg/90"
                }`}
              >
                Wybierz
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Quote + dual CTA */}
      <section className="border-t border-border bg-fg text-white">
        <div className="container-app py-10 sm:py-14">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-lg font-medium leading-relaxed text-white/90 sm:text-xl">
              „{STUDIO.quote}”
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/55">
              Demo technologiczne rezerwacji przygotowane dla {STUDIO.name}.
              Gotowy system dopasowujemy do Waszych procesów i brandingu.
            </p>
            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center sm:gap-3">
              <Link
                href="/rezerwacja"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Zarezerwuj miejsce
              </Link>
              <Link
                href="/admin"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Zobacz panel admina
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
