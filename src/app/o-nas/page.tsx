import Image from "next/image";
import Link from "next/link";
import { STUDIO, classes, instructors } from "@/data/classes";

export default function AboutPage() {
  return (
    <main>
      <section className="border-b border-border bg-bg-elevated">
        <div className="container-app py-8 sm:py-12">
          <div className="grid items-end gap-6 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="label-section">Studio</p>
              <h1 className="heading-page mt-1 sm:text-4xl">{STUDIO.name}</h1>
              <p className="mt-4 text-lg font-medium leading-relaxed text-fg-secondary sm:text-xl">
                „{STUDIO.quote}”
              </p>
            </div>
            <p className="text-body lg:pb-1">
              Szkoła tańca w Sopocie. Ta strona pokazuje, jak może wyglądać
              Wasz system rezerwacji — z ofertą, grafikiem, cennikiem i panelem
              administracyjnym, przygotowany pod realne potrzeby studia.
            </p>
          </div>
        </div>
      </section>

      <section className="container-app py-8 sm:py-12">
        <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl bg-fg/5 sm:mb-10 sm:aspect-[21/8]">
          <Image
            src="/images/studio-room.jpg"
            alt="Sala taneczna"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="surface p-5 sm:p-7">
            <h2 className="text-base font-semibold text-fg">O studiu</h2>
            <p className="mt-3 text-sm leading-relaxed text-fg-secondary">
              {STUDIO.name} to miejsce, w którym tango argentyńskie spotyka West
              Coast Swing, Zouk, Pilates i Body Balet. Prowadzimy grupy od zera
              po zaawansowane, milongi (m.in. la Despeinada), seminaria
              tematyczne, Ladies Technique oraz zajęcia dla dzieci 8–12 i 12–15
              lat.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-fg-secondary">
              Karnety na 4 tygodnie (wykorzystanie w 5), reguła odwołań 48h,
              karnety specjalistyczne na Zouk i WCS — reguły studia są już
              wpisane w demo, żeby pokazać realny flow.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link href="/rezerwacja" className="btn-primary">
                Rezerwuj
              </Link>
              <Link href="/grafik" className="btn-secondary">
                Grafik
              </Link>
            </div>
          </div>

          <div className="surface p-5 sm:p-7">
            <h2 className="text-base font-semibold text-fg">
              To demo — i strona pod Was
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-fg-secondary">
              Nie jest to generyczny szablon SaaS. Układ, oferta, cennik i
              procesy są przygotowane pod Bosodance. Jednocześnie jasno
              pokazujemy, że to{" "}
              <strong className="font-semibold text-fg">
                demonstracja technologiczna
              </strong>
              : płatności testowe, dane przykładowe, panel admina do klikania.
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                "Widok kursanta: oferta, grafik, cennik, rezerwacja",
                "Płatność testowa (symulacja karty)",
                "Panel: rezerwacje, frekwencja, karnety, raporty",
                "W produkcji: Wasze zdjęcia, Stripe/P24, SMS, role",
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
            <div className="mt-6 rounded-xl bg-warning-soft px-4 py-3 text-xs leading-relaxed text-warning">
              <strong>Wersja demo.</strong> Gotowy system szyjemy na miarę —
              branding, reguły karnetów, sale, nauczyciele i integracje pod
              Państwa studio.
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-fg">Zespół (demo)</h2>
          <p className="mt-1 text-sm text-fg-secondary">
            Przykładowi nauczyciele — w produkcji dane z Waszej kadry.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((i) => (
              <div key={i.id} className="surface flex items-center gap-3 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fg text-xs font-bold text-white">
                  {i.name
                    .split(/[\s&]+/)
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-fg">{i.name}</p>
                  <p className="text-xs text-fg-muted">{i.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { v: `${classes.length}+`, l: "zajęć" },
            { v: "6", l: "kategorii" },
            { v: String(instructors.length), l: "nauczycieli" },
          ].map((s) => (
            <div key={s.l} className="surface py-5 text-center">
              <p className="text-2xl font-bold text-fg">{s.v}</p>
              <p className="mt-1 text-xs text-fg-muted sm:text-sm">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/dance-tango.jpg"
              alt="Tango"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/dance-wcs.jpg"
              alt="WCS"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
