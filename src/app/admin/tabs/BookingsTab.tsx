"use client";

import { useState } from "react";
import type {
  Booking,
  BookingStatus,
  DanceClass,
  PaymentStatus,
  PricingPlan,
} from "@/types";
import { updateBooking, deleteBooking } from "@/lib/store";
import {
  Modal,
  IconBtn,
  IconEdit,
  IconTrash,
  Field,
} from "@/components/admin/Modal";

const statusOptions: BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];
const paymentOptions: PaymentStatus[] = [
  "unpaid",
  "paid",
  "test",
  "refunded",
];

const statusLabel: Record<BookingStatus, string> = {
  pending: "Oczekuje",
  confirmed: "Potwierdzona",
  cancelled: "Anulowana",
  completed: "Zakończona",
};

const payLabel: Record<PaymentStatus, string> = {
  unpaid: "Nieopłacone",
  paid: "Opłacone",
  refunded: "Zwrot",
  test: "Test",
};

export function BookingsTab({
  bookings,
  catalog,
  plans,
  filter,
  setFilter,
  query,
  setQuery,
  onChange,
  notify,
  onCreateDemo,
}: {
  bookings: Booking[];
  catalog: DanceClass[];
  plans: PricingPlan[];
  filter: "all" | BookingStatus;
  setFilter: (f: "all" | BookingStatus) => void;
  query: string;
  setQuery: (q: string) => void;
  onChange: () => void;
  notify: (m: string) => void;
  onCreateDemo: () => void;
}) {
  const [edit, setEdit] = useState<Booking | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    classId: "",
    planId: "",
    date: "",
    time: "",
    amount: 0,
    status: "pending" as BookingStatus,
    paymentStatus: "unpaid" as PaymentStatus,
    notes: "",
  });

  function openEdit(b: Booking) {
    setForm({
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      classId: b.classId,
      planId: b.planId,
      date: b.date,
      time: b.time,
      amount: b.amount,
      status: b.status,
      paymentStatus: b.paymentStatus,
      notes: b.notes || "",
    });
    setEdit(b);
  }

  function save() {
    if (!edit) return;
    if (form.customerName.trim().length < 2) {
      notify("Podaj imię klienta");
      return;
    }
    updateBooking(edit.id, {
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim(),
      customerPhone: form.customerPhone.trim(),
      classId: form.classId,
      planId: form.planId,
      date: form.date,
      time: form.time,
      amount: Number(form.amount) || 0,
      status: form.status,
      paymentStatus: form.paymentStatus,
      notes: form.notes.trim() || undefined,
    });
    setEdit(null);
    notify("Rezerwacja zaktualizowana");
    onChange();
  }

  function quickStatus(id: string, status: BookingStatus) {
    updateBooking(id, { status });
    notify(
      status === "confirmed"
        ? "Potwierdzono"
        : status === "cancelled"
          ? "Anulowano"
          : "Status zmieniony"
    );
    onChange();
  }

  function quickPay(id: string) {
    updateBooking(id, { paymentStatus: "paid" });
    notify("Oznaczono jako opłacone");
    onChange();
  }

  function remove(id: string) {
    deleteBooking(id);
    setConfirmId(null);
    notify("Rezerwacja usunięta");
    onChange();
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2.5 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-fg sm:text-2xl">
            Rezerwacje
          </h1>
          <p className="mt-0.5 text-xs text-fg-secondary sm:text-sm">
            Edycja, usuwanie, statusy i płatności
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateDemo}
          className="btn-primary w-full !min-h-10 text-xs sm:w-auto"
        >
          + Dodaj demo
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4">
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
                  : "bg-[#f0f2f5] text-fg-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {bookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-white py-10 text-center text-sm text-fg-muted">
            Brak rezerwacji
          </div>
        )}
        {bookings.map((b) => {
          const cls = catalog.find((c) => c.id === b.classId);
          return (
            <div
              key={b.id}
              className="rounded-2xl border border-border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-fg">{b.customerName}</p>
                  <p className="truncate text-xs text-fg-muted">
                    {b.customerEmail}
                  </p>
                </div>
                <span className="text-sm font-bold tabular-nums">
                  {b.amount} zł
                </span>
              </div>
              <p className="mt-2 text-sm text-fg-secondary">
                {cls?.name ?? b.classId} · {b.date} {b.time}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                <span className="badge bg-[#f0f2f5] text-fg-secondary">
                  {statusLabel[b.status]}
                </span>
                <span className="badge bg-[#f0f2f5] text-fg-secondary">
                  {payLabel[b.paymentStatus]}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <IconBtn label="Edytuj" onClick={() => openEdit(b)}>
                  <IconEdit />
                </IconBtn>
                <IconBtn
                  label="Usuń"
                  tone="danger"
                  onClick={() => setConfirmId(b.id)}
                >
                  <IconTrash />
                </IconBtn>
                {b.status !== "confirmed" && (
                  <button
                    type="button"
                    onClick={() => quickStatus(b.id, "confirmed")}
                    className="rounded-lg bg-success-soft px-2.5 py-1.5 text-[11px] font-semibold text-success"
                  >
                    Potwierdź
                  </button>
                )}
                {b.paymentStatus !== "paid" && b.paymentStatus !== "test" && (
                  <button
                    type="button"
                    onClick={() => quickPay(b.id)}
                    className="rounded-lg bg-info-soft px-2.5 py-1.5 text-[11px] font-semibold text-info"
                  >
                    Płatne
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-border bg-[#fafbfc] text-[11px] uppercase tracking-wide text-fg-muted">
              <tr>
                {[
                  "Klient",
                  "Zajęcia",
                  "Termin",
                  "Status",
                  "Płatność",
                  "Kwota",
                  "Akcje",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((b) => {
                const cls = catalog.find((c) => c.id === b.classId);
                const plan = plans.find((p) => p.id === b.planId);
                return (
                  <tr key={b.id} className="hover:bg-[#fafbfc]">
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-fg">{b.customerName}</p>
                      <p className="text-xs text-fg-muted">{b.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium">{cls?.name ?? b.classId}</p>
                      <p className="text-xs text-fg-muted">{plan?.name}</p>
                    </td>
                    <td className="px-4 py-3.5 tabular-nums">
                      <p>{b.date}</p>
                      <p className="text-xs text-fg-muted">{b.time}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="badge bg-[#f0f2f5] text-fg-secondary">
                        {statusLabel[b.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="badge bg-[#f0f2f5] text-fg-secondary">
                        {payLabel[b.paymentStatus]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold tabular-nums">
                      {b.amount} zł
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap items-center gap-1">
                        <IconBtn label="Edytuj" onClick={() => openEdit(b)}>
                          <IconEdit />
                        </IconBtn>
                        <IconBtn
                          label="Usuń"
                          tone="danger"
                          onClick={() => setConfirmId(b.id)}
                        >
                          <IconTrash />
                        </IconBtn>
                        {b.status !== "confirmed" && (
                          <button
                            type="button"
                            onClick={() => quickStatus(b.id, "confirmed")}
                            className="rounded-lg bg-success-soft px-2 py-1 text-[11px] font-semibold text-success"
                          >
                            Potwierdź
                          </button>
                        )}
                        {b.paymentStatus !== "paid" &&
                          b.paymentStatus !== "test" && (
                            <button
                              type="button"
                              onClick={() => quickPay(b.id)}
                              className="rounded-lg bg-info-soft px-2 py-1 text-[11px] font-semibold text-info"
                            >
                              Płatne
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!edit}
        title="Edytuj rezerwację"
        onClose={() => setEdit(null)}
        wide
      >
        <div className="space-y-3">
          <Field label="Klient">
            <input
              className="field"
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="E-mail">
              <input
                className="field"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
              />
            </Field>
            <Field label="Telefon">
              <input
                className="field"
                value={form.customerPhone}
                onChange={(e) =>
                  setForm({ ...form, customerPhone: e.target.value })
                }
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Zajęcia">
              <select
                className="field"
                value={form.classId}
                onChange={(e) => setForm({ ...form, classId: e.target.value })}
              >
                {catalog.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Karnet / plan">
              <select
                className="field"
                value={form.planId}
                onChange={(e) => setForm({ ...form, planId: e.target.value })}
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.price} zł)
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Data">
              <input
                className="field"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            <Field label="Godzina">
              <input
                className="field"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="18:00"
              />
            </Field>
            <Field label="Kwota (zł)">
              <input
                className="field"
                type="number"
                min={0}
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Status">
              <select
                className="field"
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as BookingStatus,
                  })
                }
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Płatność">
              <select
                className="field"
                value={form.paymentStatus}
                onChange={(e) =>
                  setForm({
                    ...form,
                    paymentStatus: e.target.value as PaymentStatus,
                  })
                }
              >
                {paymentOptions.map((s) => (
                  <option key={s} value={s}>
                    {payLabel[s]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Notatki">
            <textarea
              className="field min-h-[72px] resize-y"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Field>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="btn-secondary w-full sm:w-auto"
              onClick={() => setEdit(null)}
            >
              Anuluj
            </button>
            <button
              type="button"
              className="btn-primary w-full sm:w-auto"
              onClick={save}
            >
              Zapisz
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!confirmId}
        title="Usunąć rezerwację?"
        onClose={() => setConfirmId(null)}
      >
        <p className="text-sm text-fg-secondary">
          Rezerwacja zniknie z listy i przestanie liczyć się w statystykach.
        </p>
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn-secondary w-full sm:w-auto"
            onClick={() => setConfirmId(null)}
          >
            Anuluj
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-white sm:w-auto"
            onClick={() => confirmId && remove(confirmId)}
          >
            Usuń
          </button>
        </div>
      </Modal>
    </div>
  );
}
