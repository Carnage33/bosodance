"use client";

import type {
  Booking,
  Customer,
  DanceClass,
  PricingPlan,
  ClassCategory,
} from "@/types";
import {
  classes as seedClassesData,
  pricingPlans as seedPlansData,
} from "@/data/classes";

const BOOKINGS_KEY = "bosodance_bookings_v2";
const CUSTOMERS_KEY = "bosodance_customers_v2";
const CLASSES_KEY = "bosodance_classes_v2";
const PLANS_KEY = "bosodance_plans_v2";

const seedBookings: Booking[] = [
  {
    id: "b-1001",
    classId: "tango-p1",
    slotId: "s1",
    planId: "pass-8",
    customerName: "Julia Nowak",
    customerEmail: "julia.nowak@email.com",
    customerPhone: "+48 600 111 222",
    date: "2026-08-03",
    time: "18:00",
    status: "confirmed",
    paymentStatus: "paid",
    amount: 280,
    createdAt: daysAgo(12),
  },
  {
    id: "b-1002",
    classId: "wcs-l01",
    slotId: "s3",
    planId: "single",
    customerName: "Michał Kowal",
    customerEmail: "michal.k@email.com",
    customerPhone: "+48 600 333 444",
    date: "2026-08-03",
    time: "19:30",
    status: "confirmed",
    paymentStatus: "paid",
    amount: 60,
    createdAt: daysAgo(10),
  },
  {
    id: "b-1003",
    classId: "zouk-start",
    slotId: "s5",
    planId: "zouk-4",
    customerName: "Alicja Wiśniewska",
    customerEmail: "alicja.w@email.com",
    customerPhone: "+48 600 555 666",
    date: "2026-08-04",
    time: "19:15",
    status: "pending",
    paymentStatus: "unpaid",
    amount: 240,
    createdAt: daysAgo(2),
  },
  {
    id: "b-1004",
    classId: "milonga",
    slotId: "s19",
    planId: "single",
    customerName: "Tomasz Lewandowski",
    customerEmail: "tomasz.l@email.com",
    customerPhone: "+48 600 777 888",
    date: "2026-08-02",
    time: "19:00",
    status: "confirmed",
    paymentStatus: "paid",
    amount: 60,
    createdAt: daysAgo(8),
  },
  {
    id: "b-1005",
    classId: "dzieci-8-12",
    slotId: "s6",
    planId: "pass-4",
    customerName: "Ewa Zielińska (rodzic)",
    customerEmail: "ewa.z@email.com",
    customerPhone: "+48 600 999 000",
    date: "2026-08-04",
    time: "16:30",
    status: "confirmed",
    paymentStatus: "paid",
    amount: 160,
    createdAt: daysAgo(15),
  },
  {
    id: "b-1006",
    classId: "pilates",
    slotId: "s2",
    planId: "open",
    customerName: "Karolina Maj",
    customerEmail: "karolina.m@email.com",
    customerPhone: "+48 601 111 333",
    date: "2026-08-03",
    time: "19:15",
    status: "cancelled",
    paymentStatus: "refunded",
    amount: 500,
    createdAt: daysAgo(20),
    notes: "Odwołane przez klienta (48h+)",
  },
  {
    id: "b-1007",
    classId: "tango-p2",
    planId: "pass-8",
    customerName: "Julia Nowak",
    customerEmail: "julia.nowak@email.com",
    customerPhone: "+48 600 111 222",
    date: "2026-07-28",
    time: "18:00",
    status: "completed",
    paymentStatus: "paid",
    amount: 280,
    createdAt: daysAgo(25),
  },
  {
    id: "b-1008",
    classId: "body-balet",
    planId: "pass-12",
    customerName: "Karolina Maj",
    customerEmail: "karolina.m@email.com",
    customerPhone: "+48 601 111 333",
    date: "2026-07-22",
    time: "19:15",
    status: "completed",
    paymentStatus: "paid",
    amount: 300,
    createdAt: daysAgo(28),
  },
  {
    id: "b-1009",
    classId: "wcs-l2",
    planId: "wcs-4",
    customerName: "Michał Kowal",
    customerEmail: "michal.k@email.com",
    customerPhone: "+48 600 333 444",
    date: "2026-07-30",
    time: "19:30",
    status: "confirmed",
    paymentStatus: "paid",
    amount: 180,
    createdAt: daysAgo(5),
  },
  {
    id: "b-1010",
    classId: "tango-lt",
    planId: "pass-4",
    customerName: "Alicja Wiśniewska",
    customerEmail: "alicja.w@email.com",
    customerPhone: "+48 600 555 666",
    date: "2026-08-01",
    time: "18:00",
    status: "confirmed",
    paymentStatus: "paid",
    amount: 160,
    createdAt: daysAgo(6),
  },
  {
    id: "b-1011",
    classId: "zouk-p3",
    planId: "zouk-4",
    customerName: "Tomasz Lewandowski",
    customerEmail: "tomasz.l@email.com",
    customerPhone: "+48 600 777 888",
    date: "2026-08-05",
    time: "19:15",
    status: "confirmed",
    paymentStatus: "test",
    amount: 240,
    createdAt: daysAgo(1),
  },
  {
    id: "b-1012",
    classId: "tango-praktyka",
    planId: "single",
    customerName: "Ewa Zielińska (rodzic)",
    customerEmail: "ewa.z@email.com",
    customerPhone: "+48 600 999 000",
    date: "2026-08-01",
    time: "19:15",
    status: "completed",
    paymentStatus: "paid",
    amount: 60,
    createdAt: daysAgo(9),
  },
];

const seedCustomers: Customer[] = [
  {
    id: "c-1",
    name: "Julia Nowak",
    email: "julia.nowak@email.com",
    phone: "+48 600 111 222",
    passEntries: 6,
    passType: "Karnet 8 wejść",
    joinedAt: "2026-03-01",
  },
  {
    id: "c-2",
    name: "Michał Kowal",
    email: "michal.k@email.com",
    phone: "+48 600 333 444",
    passEntries: 0,
    passType: "Pojedyncze",
    joinedAt: "2026-07-29",
  },
  {
    id: "c-3",
    name: "Alicja Wiśniewska",
    email: "alicja.w@email.com",
    phone: "+48 600 555 666",
    passEntries: 4,
    passType: "Karnet Zouk 4×",
    joinedAt: "2026-06-10",
  },
  {
    id: "c-4",
    name: "Tomasz Lewandowski",
    email: "tomasz.l@email.com",
    phone: "+48 600 777 888",
    passEntries: 2,
    passType: "Karnet 4 wejścia",
    joinedAt: "2026-01-15",
  },
  {
    id: "c-5",
    name: "Karolina Maj",
    email: "karolina.m@email.com",
    phone: "+48 601 111 333",
    passEntries: 99,
    passType: "OPEN",
    joinedAt: "2025-11-01",
  },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10 + (n % 8), (n * 7) % 60, 0, 0);
  return d.toISOString();
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadList<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed.map((x) => ({ ...x }));
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed.map((x) => ({ ...x }));
  }
  return safeParse(stored, seed).map((x) => ({ ...x }));
}

function saveList<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
}

/* ─── Bookings ─── */

export function getBookings(): Booking[] {
  return loadList(BOOKINGS_KEY, seedBookings);
}

export function saveBookings(bookings: Booking[]) {
  saveList(BOOKINGS_KEY, bookings);
}

export function addBooking(
  booking: Omit<Booking, "id" | "createdAt">
): Booking {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: `b-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  bookings.unshift(newBooking);
  saveBookings(bookings);
  return newBooking;
}

export function updateBooking(
  id: string,
  patch: Partial<Booking>
): Booking | null {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], ...patch };
  saveBookings(bookings);
  return bookings[idx];
}

export function deleteBooking(id: string): boolean {
  const bookings = getBookings();
  const next = bookings.filter((b) => b.id !== id);
  if (next.length === bookings.length) return false;
  saveBookings(next);
  return true;
}

/* ─── Customers ─── */

export function getCustomers(): Customer[] {
  return loadList(CUSTOMERS_KEY, seedCustomers);
}

export function saveCustomers(customers: Customer[]) {
  saveList(CUSTOMERS_KEY, customers);
}

export function addCustomer(
  data: Omit<Customer, "id" | "joinedAt"> & { joinedAt?: string }
): Customer {
  const customers = getCustomers();
  const customer: Customer = {
    ...data,
    id: `c-${Date.now()}`,
    joinedAt: data.joinedAt ?? new Date().toISOString().slice(0, 10),
  };
  customers.unshift(customer);
  saveCustomers(customers);
  return customer;
}

export function updateCustomer(
  id: string,
  patch: Partial<Customer>
): Customer | null {
  const customers = getCustomers();
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  customers[idx] = { ...customers[idx], ...patch };
  saveCustomers(customers);
  return customers[idx];
}

export function deleteCustomer(id: string): boolean {
  const customers = getCustomers();
  const next = customers.filter((c) => c.id !== id);
  if (next.length === customers.length) return false;
  saveCustomers(next);
  return true;
}

/* ─── Classes (services) ─── */

export function getClasses(): DanceClass[] {
  return loadList(CLASSES_KEY, seedClassesData);
}

export function saveClasses(items: DanceClass[]) {
  saveList(CLASSES_KEY, items);
}

export function addClass(
  data: Omit<DanceClass, "id"> & { id?: string }
): DanceClass {
  const items = getClasses();
  const item: DanceClass = {
    ...data,
    id: data.id || `class-${Date.now()}`,
  };
  items.push(item);
  saveClasses(items);
  return item;
}

export function updateClass(
  id: string,
  patch: Partial<DanceClass>
): DanceClass | null {
  const items = getClasses();
  const idx = items.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  saveClasses(items);
  return items[idx];
}

export function deleteClass(id: string): boolean {
  const items = getClasses();
  const next = items.filter((c) => c.id !== id);
  if (next.length === items.length) return false;
  saveClasses(next);
  return true;
}

/* ─── Pricing plans ─── */

export function getPlans(): PricingPlan[] {
  return loadList(PLANS_KEY, seedPlansData);
}

export function savePlans(items: PricingPlan[]) {
  saveList(PLANS_KEY, items);
}

export function updatePlan(
  id: string,
  patch: Partial<PricingPlan>
): PricingPlan | null {
  const items = getPlans();
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  savePlans(items);
  return items[idx];
}

export function deletePlan(id: string): boolean {
  const items = getPlans();
  const next = items.filter((p) => p.id !== id);
  if (next.length === items.length) return false;
  savePlans(next);
  return true;
}

export function addPlan(data: Omit<PricingPlan, "id"> & { id?: string }): PricingPlan {
  const items = getPlans();
  const item: PricingPlan = {
    ...data,
    id: data.id || `plan-${Date.now()}`,
  };
  items.push(item);
  savePlans(items);
  return item;
}

/* ─── Stats ─── */

export function getStats() {
  const bookings = getBookings();
  const customers = getCustomers();
  const paid = bookings.filter(
    (b) => b.paymentStatus === "paid" || b.paymentStatus === "test"
  );
  const revenue = paid.reduce((sum, b) => sum + b.amount, 0);
  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  const completed = bookings.filter((b) => b.status === "completed").length;

  return {
    totalBookings: bookings.length,
    revenue,
    pending,
    confirmed,
    cancelled,
    completed,
    customers: customers.length,
    occupancy:
      bookings.length === 0
        ? 0
        : Math.round(
            ((confirmed + completed) / Math.max(bookings.length, 1)) * 100
          ),
  };
}

/** Reset all demo data to seeds */
export function resetAllData() {
  if (typeof window === "undefined") return;
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(seedBookings));
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(seedCustomers));
  localStorage.setItem(CLASSES_KEY, JSON.stringify(seedClassesData));
  localStorage.setItem(PLANS_KEY, JSON.stringify(seedPlansData));
}

export const CATEGORY_OPTIONS: ClassCategory[] = [
  "tango",
  "wcs",
  "zouk",
  "fitness",
  "dzieci",
  "imprezy",
];
