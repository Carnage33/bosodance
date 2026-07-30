"use client";

import { useMemo, useState } from "react";
import type { Customer } from "@/types";
import {
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/lib/store";
import {
  Modal,
  IconBtn,
  IconEdit,
  IconTrash,
  Field,
} from "@/components/admin/Modal";

export function CustomersTab({
  customers,
  onChange,
  notify,
}: {
  customers: Customer[];
  onChange: () => void;
  notify: (m: string) => void;
}) {
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Customer | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    passType: "Karnet 8 wejść",
    passEntries: 8,
  });

  const list = useMemo(
    () =>
      customers.filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.email.toLowerCase().includes(q.toLowerCase()) ||
          c.phone.includes(q)
      ),
    [customers, q]
  );

  function openCreate() {
    setForm({
      name: "",
      email: "",
      phone: "+48 ",
      passType: "Karnet 8 wejść",
      passEntries: 8,
    });
    setCreating(true);
    setEdit(null);
  }

  function openEdit(c: Customer) {
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone,
      passType: c.passType,
      passEntries: c.passEntries,
    });
    setEdit(c);
    setCreating(false);
  }

  function save() {
    if (form.name.trim().length < 2) {
      notify("Podaj imię i nazwisko");
      return;
    }
    if (!form.email.includes("@")) {
      notify("Podaj poprawny e-mail");
      return;
    }
    if (edit) {
      updateCustomer(edit.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        passType: form.passType,
        passEntries: Number(form.passEntries) || 0,
      });
      notify("Klient zaktualizowany");
    } else {
      addCustomer({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        passType: form.passType,
        passEntries: Number(form.passEntries) || 0,
      });
      notify("Klient dodany");
    }
    setEdit(null);
    setCreating(false);
    onChange();
  }

  function remove(id: string) {
    deleteCustomer(id);
    setConfirmId(null);
    notify("Klient usunięty");
    onChange();
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2.5 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-fg sm:text-2xl">
            Klienci
          </h1>
          <p className="mt-0.5 text-xs text-fg-secondary sm:text-sm">
            {customers.length} w bazie · edycja i usuwanie demo
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary w-full !min-h-10 text-xs sm:w-auto"
        >
          + Dodaj klienta
        </button>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Szukaj: imię, e-mail, telefon…"
        className="field mb-4 max-w-md"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f2f5] text-xs font-bold text-fg">
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex gap-1.5">
                <IconBtn label="Edytuj" onClick={() => openEdit(c)}>
                  <IconEdit />
                </IconBtn>
                <IconBtn
                  label="Usuń"
                  tone="danger"
                  onClick={() => setConfirmId(c.id)}
                >
                  <IconTrash />
                </IconBtn>
              </div>
            </div>
            <h3 className="mt-3 font-semibold text-fg">{c.name}</h3>
            <p className="truncate text-xs text-fg-muted">{c.email}</p>
            <p className="text-xs text-fg-muted">{c.phone}</p>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="badge max-w-[60%] truncate bg-[#f0f2f5] text-fg-secondary">
                {c.passType}
              </span>
              <span className="font-bold tabular-nums">
                {c.passEntries === 99 ? "∞" : c.passEntries}
              </span>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-white py-12 text-center text-sm text-fg-muted">
            Brak klientów
          </div>
        )}
      </div>

      <Modal
        open={creating || !!edit}
        title={edit ? "Edytuj klienta" : "Nowy klient"}
        onClose={() => {
          setCreating(false);
          setEdit(null);
        }}
      >
        <div className="space-y-3">
          <Field label="Imię i nazwisko">
            <input
              className="field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="E-mail">
            <input
              className="field"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Telefon">
            <input
              className="field"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Typ karnetu">
            <input
              className="field"
              value={form.passType}
              onChange={(e) => setForm({ ...form, passType: e.target.value })}
            />
          </Field>
          <Field label="Wejścia (99 = OPEN ∞)">
            <input
              className="field"
              type="number"
              min={0}
              value={form.passEntries}
              onChange={(e) =>
                setForm({ ...form, passEntries: Number(e.target.value) })
              }
            />
          </Field>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="btn-secondary w-full sm:w-auto"
              onClick={() => {
                setCreating(false);
                setEdit(null);
              }}
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
        title="Usunąć klienta?"
        onClose={() => setConfirmId(null)}
      >
        <p className="text-sm text-fg-secondary">
          Tej operacji nie cofniesz (dane lokalne demo).
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
