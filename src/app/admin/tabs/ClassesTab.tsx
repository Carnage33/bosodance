"use client";

import { useMemo, useState } from "react";
import type { ClassCategory, DanceClass } from "@/types";
import { categoryLabels } from "@/data/classes";
import {
  addClass,
  updateClass,
  deleteClass,
  CATEGORY_OPTIONS,
} from "@/lib/store";
import {
  Modal,
  IconBtn,
  IconEdit,
  IconTrash,
  Field,
} from "@/components/admin/Modal";

const emptyForm = {
  name: "",
  category: "tango" as ClassCategory,
  level: "Open",
  description: "",
  durationMin: 60,
  instructor: "",
  color: "#c41e3a",
};

export function ClassesTab({
  catalog,
  onChange,
  notify,
}: {
  catalog: DanceClass[];
  onChange: () => void;
  notify: (m: string) => void;
}) {
  const [edit, setEdit] = useState<DanceClass | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState<string>("all");

  const cats = useMemo(() => {
    const set = new Set(catalog.map((c) => c.category));
    return ["all", ...Array.from(set)];
  }, [catalog]);

  const list =
    filter === "all"
      ? catalog
      : catalog.filter((c) => c.category === filter);

  function openCreate() {
    setForm(emptyForm);
    setCreating(true);
    setEdit(null);
  }

  function openEdit(c: DanceClass) {
    setForm({
      name: c.name,
      category: c.category,
      level: c.level,
      description: c.description,
      durationMin: c.durationMin,
      instructor: c.instructor,
      color: c.color,
    });
    setEdit(c);
    setCreating(false);
  }

  function save() {
    if (form.name.trim().length < 2) {
      notify("Podaj nazwę zajęć");
      return;
    }
    if (edit) {
      updateClass(edit.id, {
        name: form.name.trim(),
        category: form.category,
        level: form.level.trim(),
        description: form.description.trim(),
        durationMin: Number(form.durationMin) || 60,
        instructor: form.instructor.trim(),
        color: form.color,
      });
      notify("Zajęcia zaktualizowane");
    } else {
      addClass({
        name: form.name.trim(),
        category: form.category,
        level: form.level.trim(),
        description: form.description.trim(),
        durationMin: Number(form.durationMin) || 60,
        instructor: form.instructor.trim(),
        color: form.color,
      });
      notify("Zajęcia dodane");
    }
    setEdit(null);
    setCreating(false);
    onChange();
  }

  function remove(id: string) {
    deleteClass(id);
    setConfirmId(null);
    notify("Zajęcia usunięte z oferty");
    onChange();
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2.5 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-fg sm:text-2xl">
            Zajęcia / usługi
          </h1>
          <p className="mt-0.5 text-xs text-fg-secondary sm:text-sm">
            {catalog.length} pozycji · edytuj ofertę studia
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary w-full !min-h-10 text-xs sm:w-auto"
        >
          + Dodaj zajęcia
        </button>
      </div>

      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cats.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
              filter === cat
                ? "bg-fg text-white"
                : "bg-[#eceef2] text-fg-secondary"
            }`}
          >
            {cat === "all" ? "Wszystkie" : categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((cls) => (
          <div
            key={cls.id}
            className="flex flex-col rounded-2xl border border-border bg-white p-3.5 shadow-sm sm:p-4"
          >
            <div className="flex items-start gap-2.5">
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: cls.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-fg">{cls.name}</p>
                    <p className="text-xs text-fg-muted">
                      {categoryLabels[cls.category]} · {cls.level} ·{" "}
                      {cls.durationMin} min
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <IconBtn label="Edytuj" onClick={() => openEdit(cls)}>
                      <IconEdit />
                    </IconBtn>
                    <IconBtn
                      label="Usuń"
                      tone="danger"
                      onClick={() => setConfirmId(cls.id)}
                    >
                      <IconTrash />
                    </IconBtn>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-fg-secondary">
                  {cls.description}
                </p>
                <p className="mt-2 text-[11px] text-fg-muted">
                  {cls.instructor}
                </p>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-white py-12 text-center text-sm text-fg-muted">
            Brak zajęć w tej kategorii
          </div>
        )}
      </div>

      <Modal
        open={creating || !!edit}
        title={edit ? "Edytuj zajęcia" : "Nowe zajęcia"}
        onClose={() => {
          setCreating(false);
          setEdit(null);
        }}
        wide
      >
        <div className="space-y-3">
          <Field label="Nazwa">
            <input
              className="field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="np. Tango P1"
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Kategoria">
              <select
                className="field"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as ClassCategory,
                  })
                }
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {categoryLabels[c]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Poziom">
              <input
                className="field"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Opis">
            <textarea
              className="field min-h-[88px] resize-y"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Czas (min)">
              <input
                className="field"
                type="number"
                min={15}
                step={15}
                value={form.durationMin}
                onChange={(e) =>
                  setForm({ ...form, durationMin: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Prowadzący">
              <input
                className="field"
                value={form.instructor}
                onChange={(e) =>
                  setForm({ ...form, instructor: e.target.value })
                }
              />
            </Field>
            <Field label="Kolor">
              <input
                className="field h-11 !p-1"
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
            </Field>
          </div>
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
        title="Usunąć zajęcia z oferty?"
        onClose={() => setConfirmId(null)}
      >
        <p className="text-sm text-fg-secondary">
          Istniejące rezerwacje zachowają ID zajęć, ale pozycja zniknie z
          katalogu.
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
