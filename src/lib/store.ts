"use client";

import type { Booking, Customer } from "@/types";

const BOOKINGS_KEY = "bossodens_bookings";
const CUSTOMERS_KEY = "bossodens_customers";

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
    createdAt: "2026-07-28T10:00:00.000Z",
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
    createdAt: "2026-07-29T14:20:00.000Z",
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
    createdAt: "2026-07-30T09:15:00.000Z",
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
    createdAt: "2026-07-25T18:00:00.000Z",
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
    createdAt: "2026-07-20T11:30:00.000Z",
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
    createdAt: "2026-07-15T08:00:00.000Z",
    notes: "Odwołane przez klienta (48h+)",
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

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getBookings(): Booking[] {
  if (typeof window === "undefined") return seedBookings;
  const stored = localStorage.getItem(BOOKINGS_KEY);
  if (!stored) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(seedBookings));
    return seedBookings;
  }
  return safeParse(stored, seedBookings);
}

export function saveBookings(bookings: Booking[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
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

export function getCustomers(): Customer[] {
  if (typeof window === "undefined") return seedCustomers;
  const stored = localStorage.getItem(CUSTOMERS_KEY);
  if (!stored) {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(seedCustomers));
    return seedCustomers;
  }
  return safeParse(stored, seedCustomers);
}

export function getStats() {
  const bookings = getBookings();
  const customers = getCustomers();
  const paid = bookings.filter((b) => b.paymentStatus === "paid");
  const revenue = paid.reduce((sum, b) => sum + b.amount, 0);
  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  return {
    totalBookings: bookings.length,
    revenue,
    pending,
    confirmed,
    cancelled,
    customers: customers.length,
    occupancy: 72,
  };
}
