"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  schedule,
  DAYS,
  categoryLabels,
  classes as seedClasses,
  pricingPlans as seedPlans,
} from "@/data/classes";
import { addBooking, getClasses, getPlans } from "@/lib/store";
import type { DanceClass, PricingPlan } from "@/types";
import {
  formatPhonePL,
  formatName,
  formatEmail,
  formatCardNumber,
  formatCardExp,
  formatCvc,
  formatCardName,
  isValidPhonePL,
  isValidEmail,
  isValidCardExp,
} from "@/lib/format";

type Step = 1 | 2 | 3 | 4;

const STEP_LABELS = ["Zajęcia", "Karnet", "Dane", "Płatność"];

function BookingWizard() {
  const searchParams = useSearchParams();
  const preClass = searchParams.get("class") ?? "";
  const prePlan = searchParams.get("plan") ?? "pass-8";
  const preSlot = searchParams.get("slot") ?? "";

  const [step, setStep] = useState<Step>(1);
  const [classId, setClassId] = useState(preClass || seedClasses[0].id);
  const [slotId, setSlotId] = useState(preSlot);
  const [planId, setPlanId] = useState(prePlan);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+48 ");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paying, setPaying] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [classes, setClasses] = useState<DanceClass[]>(seedClasses);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(seedPlans);

  useEffect(() => {
    setClasses(getClasses());
    setPricingPlans(getPlans());
  }, []);

  const selectedClass = classes.find((c) => c.id === classId);
  const selectedPlan = pricingPlans.find((p) => p.id === planId);
  const classSlots = useMemo(
    () => schedule.filter((s) => s.classId === classId),
    [classId]
  );
  const selectedSlot = schedule.find((s) => s.id === slotId);

  const filteredClasses =
    categoryFilter === "all"
      ? classes
      : classes.filter((c) => c.category === categoryFilter);

  const categories = [
    "all",
    ...Array.from(new Set(classes.map((c) => c.category))),
  ];

  function validateStep3(): boolean {
    const fe: Record<string, string> = {};
    if (name.trim().length < 2) fe.name = "Podaj imię i nazwisko (min. 2 znaki)";
    if (!isValidEmail(email)) fe.email = "Podaj poprawny e-mail";
    if (!isValidPhonePL(phone))
      fe.phone = "Telefon: 9 cyfr lub +48 XXX XXX XXX";
    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  }

  function validateStep4(): boolean {
    const fe: Record<string, string> = {};
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length !== 16) fe.cardNumber = "16 cyfr numeru karty";
    if (!isValidCardExp(cardExp)) fe.cardExp = "Format MM/RR";
    if (cardCvc.length < 3) fe.cardCvc = "3–4 cyfry CVC";
    if (cardName.trim().length < 2) fe.cardName = "Imię na karcie";
    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  }

  function next() {
    setError("");
    setFieldErrors({});
    if (step === 1 && !classId) {
      setError("Wybierz zajęcia.");
      return;
    }
    if (step === 2 && !planId) {
      setError("Wybierz karnet.");
      return;
    }
    if (step === 3 && !validateStep3()) {
      setError("Popraw dane w formularzu.");
      return;
    }
    setStep((s) => Math.min(4, s + 1) as Step);
  }

  function back() {
    setError("");
    setFieldErrors({});
    setStep((s) => Math.max(1, s - 1) as Step);
  }

  async function pay() {
    setError("");
    if (!validateStep4()) {
      setError("Uzupełnij dane karty testowej poprawnie.");
      return;
    }
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1200));

    const booking = addBooking({
      classId,
      slotId: slotId || undefined,
      planId,
      customerName: name.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      date: selectedSlot
        ? nextDateForDay(selectedSlot.dayOfWeek)
        : new Date().toISOString().slice(0, 10),
      time: selectedSlot?.time ?? "—",
      status: "confirmed",
      paymentStatus: "test",
      amount: selectedPlan?.price ?? 0,
      notes: "Płatność demo (test)",
    });

    setDoneId(booking.id);
    setPaying(false);
  }

  if (doneId) {
    return (
      <main className="container-app py-10 sm:py-16">
        <div className="mx-auto max-w-md surface-raised p-6 text-center sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-2xl text-success">
            ✓
          </div>
          <h1 className="mt-4 text-xl font-bold text-fg sm:text-2xl">
            Rezerwacja potwierdzona
          </h1>
          <p className="mt-2 text-sm text-fg-secondary">
            To demo — żadna prawdziwa płatność nie została pobrana.
          </p>
          <dl className="mt-6 space-y-2 rounded-xl bg-bg p-4 text-left text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-fg-muted">Nr</dt>
              <dd className="font-mono font-medium text-fg">{doneId}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-fg-muted">Zajęcia</dt>
              <dd className="font-medium text-fg">{selectedClass?.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-fg-muted">Karnet</dt>
              <dd className="font-medium text-fg">
                {selectedPlan?.name} · {selectedPlan?.price} zł
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-fg-muted">E-mail</dt>
              <dd className="truncate font-medium text-fg">{email}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/admin" className="btn-primary w-full">
              Zobacz w panelu admina
            </Link>
            <Link href="/" className="btn-secondary w-full">
              Strona główna
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const progress = (step / 4) * 100;

  return (
    <main className="container-app py-5 sm:py-10">
      <div className="mb-5 max-w-2xl sm:mb-6">
        <p className="label-section">Rezerwacja</p>
        <h1 className="heading-page mt-1">Zarezerwuj i opłać</h1>
        <p className="mt-2 text-sm text-fg-secondary">
          Krok {step} z 4 · {STEP_LABELS[step - 1]}
        </p>
        <div className="progress-track mt-3 max-w-md sm:mt-4">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Main form */}
        <div className="min-w-0 lg:col-span-8">
          <div className="surface p-3.5 sm:p-6">
            {/* Step pills */}
            <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1">
              {STEP_LABELS.map((label, i) => {
                const n = (i + 1) as Step;
                const active = step === n;
                const done = step > n;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      if (n < step) setStep(n);
                    }}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      active
                        ? "bg-accent text-white"
                        : done
                          ? "bg-accent-soft text-accent"
                          : "bg-bg text-fg-muted"
                    }`}
                  >
                    <span>{n}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                );
              })}
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-fg">
                  Wybierz zajęcia
                </h2>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        categoryFilter === cat
                          ? "bg-fg text-white"
                          : "bg-bg text-fg-secondary"
                      }`}
                    >
                      {cat === "all" ? "Wszystkie" : categoryLabels[cat]}
                    </button>
                  ))}
                </div>
                <div className="grid max-h-[22rem] gap-2 overflow-y-auto pr-0.5 sm:grid-cols-2">
                  {filteredClasses.map((cls) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => {
                        setClassId(cls.id);
                        setSlotId("");
                      }}
                      className={`rounded-xl border p-3.5 text-left transition ${
                        classId === cls.id
                          ? "border-accent bg-accent-soft"
                          : "border-border bg-bg-elevated hover:border-border-strong"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: cls.color }}
                        />
                        <span className="font-semibold text-fg">{cls.name}</span>
                      </div>
                      <p className="mt-1 text-xs text-fg-secondary">
                        {categoryLabels[cls.category]} · {cls.level} ·{" "}
                        {cls.durationMin} min
                      </p>
                    </button>
                  ))}
                </div>

                {classSlots.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <p className="mb-2 text-sm font-medium text-fg">
                      Termin{" "}
                      <span className="font-normal text-fg-muted">
                        (opcjonalnie)
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {classSlots.map((slot) => {
                        const free = slot.capacity - slot.booked;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={free <= 0}
                            onClick={() => setSlotId(slot.id)}
                            className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                              slotId === slot.id
                                ? "border-accent bg-accent text-white"
                                : free <= 0
                                  ? "cursor-not-allowed border-border text-fg-muted opacity-50"
                                  : "border-border text-fg hover:border-border-strong"
                            }`}
                          >
                            {DAYS[slot.dayOfWeek]} {slot.time}
                            {free > 0 && free <= 3 ? ` · ${free}` : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-fg">
                  Wybierz karnet
                </h2>
                <div className="space-y-2">
                  {pricingPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setPlanId(plan.id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left ${
                        planId === plan.id
                          ? "border-accent bg-accent-soft"
                          : "border-border hover:border-border-strong"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-fg">{plan.name}</p>
                        <p className="mt-0.5 text-xs text-fg-secondary">
                          {plan.note}
                        </p>
                      </div>
                      <p className="shrink-0 text-lg font-bold tabular-nums text-fg">
                        {plan.price}{" "}
                        <span className="text-sm font-medium text-fg-muted">
                          zł
                        </span>
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-fg">Twoje dane</h2>
                <p className="text-xs text-fg-muted">
                  Pola formatują się automatycznie (telefon, e-mail, limity znaków).
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-fg">
                      Imię i nazwisko
                      <span className="text-[11px] font-normal text-fg-muted">
                        {name.length}/60
                      </span>
                    </span>
                    <input
                      value={name}
                      onChange={(e) => setName(formatName(e.target.value))}
                      className={`field ${fieldErrors.name ? "border-accent" : ""}`}
                      placeholder="Anna Kowalska"
                      autoComplete="name"
                      maxLength={60}
                      enterKeyHint="next"
                    />
                    {fieldErrors.name && (
                      <span className="mt-1 block text-xs text-accent">
                        {fieldErrors.name}
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-fg">
                      E-mail
                      <span className="text-[11px] font-normal text-fg-muted">
                        {email.length}/80
                      </span>
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(formatEmail(e.target.value))}
                      className={`field ${fieldErrors.email ? "border-accent" : ""}`}
                      placeholder="anna@email.com"
                      autoComplete="email"
                      maxLength={80}
                      inputMode="email"
                      enterKeyHint="next"
                    />
                    {fieldErrors.email && (
                      <span className="mt-1 block text-xs text-accent">
                        {fieldErrors.email}
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-fg">
                      Telefon
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhonePL(e.target.value))}
                      className={`field tabular-nums ${fieldErrors.phone ? "border-accent" : ""}`}
                      placeholder="+48 600 000 000"
                      autoComplete="tel"
                      inputMode="tel"
                      maxLength={16}
                      enterKeyHint="done"
                    />
                    {fieldErrors.phone ? (
                      <span className="mt-1 block text-xs text-accent">
                        {fieldErrors.phone}
                      </span>
                    ) : (
                      <span className="mt-1 block text-[11px] text-fg-muted">
                        Format: +48 XXX XXX XXX
                      </span>
                    )}
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-fg">
                  Płatność testowa
                </h2>
                <div className="rounded-xl bg-warning-soft px-3.5 py-2.5 text-xs leading-relaxed text-warning">
                  Tryb demo — karta nie zostanie obciążona. Użyj{" "}
                  <strong className="break-all">4242 4242 4242 4242</strong>
                  , data np. <strong>12/28</strong>, CVC <strong>123</strong>.
                </div>
                <div className="grid gap-3">
                  <label className="block">
                    <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-fg">
                      Imię na karcie
                      <span className="text-[11px] font-normal text-fg-muted">
                        {cardName.length}/40
                      </span>
                    </span>
                    <input
                      value={cardName}
                      onChange={(e) =>
                        setCardName(formatCardName(e.target.value))
                      }
                      className={`field ${fieldErrors.cardName ? "border-accent" : ""}`}
                      placeholder={
                        name ? formatCardName(name) : "ANNA KOWALSKA"
                      }
                      maxLength={40}
                      autoComplete="cc-name"
                    />
                    {fieldErrors.cardName && (
                      <span className="mt-1 block text-xs text-accent">
                        {fieldErrors.cardName}
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-fg">
                      Numer karty
                      <span className="text-[11px] font-normal text-fg-muted">
                        {cardNumber.replace(/\s/g, "").length}/16
                      </span>
                    </span>
                    <input
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      className={`field font-mono tracking-wide ${fieldErrors.cardNumber ? "border-accent" : ""}`}
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={19}
                    />
                    {fieldErrors.cardNumber && (
                      <span className="mt-1 block text-xs text-accent">
                        {fieldErrors.cardNumber}
                      </span>
                    )}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-fg">
                        Ważność
                      </span>
                      <input
                        value={cardExp}
                        onChange={(e) =>
                          setCardExp(formatCardExp(e.target.value))
                        }
                        className={`field font-mono ${fieldErrors.cardExp ? "border-accent" : ""}`}
                        placeholder="MM/RR"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        maxLength={5}
                      />
                      {fieldErrors.cardExp && (
                        <span className="mt-1 block text-xs text-accent">
                          {fieldErrors.cardExp}
                        </span>
                      )}
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-fg">
                        CVC
                      </span>
                      <input
                        value={cardCvc}
                        onChange={(e) => setCardCvc(formatCvc(e.target.value))}
                        className={`field font-mono ${fieldErrors.cardCvc ? "border-accent" : ""}`}
                        placeholder="123"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                      />
                      {fieldErrors.cardCvc && (
                        <span className="mt-1 block text-xs text-accent">
                          {fieldErrors.cardCvc}
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-between">
              {step > 1 ? (
                <button type="button" onClick={back} className="btn-secondary w-full sm:w-auto">
                  Wstecz
                </button>
              ) : (
                <span className="hidden sm:block" />
              )}
              {step < 4 ? (
                <button type="button" onClick={next} className="btn-primary w-full sm:w-auto sm:min-w-[140px]">
                  Dalej
                </button>
              ) : (
                <button
                  type="button"
                  onClick={pay}
                  disabled={paying}
                  className="btn-primary w-full sm:w-auto sm:min-w-[180px]"
                >
                  {paying
                    ? "Przetwarzanie…"
                    : `Zapłać ${selectedPlan?.price ?? 0} zł`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary — under form on mobile, sticky side on desktop */}
        <aside className="min-w-0 lg:col-span-4">
          <div className="surface p-4 sm:p-5 lg:sticky lg:top-24">
            <h2 className="text-sm font-semibold text-fg">Podsumowanie</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-fg-muted">Zajęcia</dt>
                <dd className="mt-0.5 font-medium text-fg">
                  {selectedClass?.name ?? "—"}
                </dd>
                {selectedClass && (
                  <dd className="text-xs text-fg-secondary">
                    {categoryLabels[selectedClass.category]} ·{" "}
                    {selectedClass.level}
                  </dd>
                )}
              </div>
              <div>
                <dt className="text-xs text-fg-muted">Termin</dt>
                <dd className="mt-0.5 font-medium text-fg">
                  {selectedSlot
                    ? `${DAYS[selectedSlot.dayOfWeek]} ${selectedSlot.time}`
                    : "Do ustalenia"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-fg-muted">Karnet</dt>
                <dd className="mt-0.5 font-medium text-fg">
                  {selectedPlan?.name ?? "—"}
                </dd>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-baseline justify-between">
                  <dt className="text-fg-secondary">Do zapłaty</dt>
                  <dd className="text-2xl font-bold tabular-nums text-fg">
                    {selectedPlan?.price ?? 0}{" "}
                    <span className="text-base font-medium text-fg-muted">
                      zł
                    </span>
                  </dd>
                </div>
              </div>
            </dl>
            {name && (
              <div className="mt-4 rounded-lg bg-bg px-3 py-2 text-xs text-fg-secondary">
                Kursant: <strong className="text-fg">{name}</strong>
                {email ? ` · ${email}` : ""}
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

function nextDateForDay(dayOfWeek: number): string {
  const d = new Date();
  const current = d.getDay();
  let add = dayOfWeek - current;
  if (add <= 0) add += 7;
  d.setDate(d.getDate() + add);
  return d.toISOString().slice(0, 10);
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="container-app py-16 text-center text-fg-muted">
          Ładowanie…
        </main>
      }
    >
      <BookingWizard />
    </Suspense>
  );
}
