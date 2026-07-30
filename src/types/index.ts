export type ClassCategory =
  | "tango"
  | "wcs"
  | "zouk"
  | "fitness"
  | "dzieci"
  | "imprezy";

export interface DanceClass {
  id: string;
  name: string;
  category: ClassCategory;
  level: string;
  description: string;
  durationMin: number;
  instructor: string;
  color: string;
}

export interface ScheduleSlot {
  id: string;
  classId: string;
  dayOfWeek: number; // 0=Niedziela, 1=Poniedziałek...
  time: string;
  room: string;
  capacity: number;
  booked: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  entries: number | "open";
  price: number;
  perEntry?: number;
  note?: string;
  highlight?: boolean;
  category?: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "test";

export interface Booking {
  id: string;
  classId: string;
  slotId?: string;
  planId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  createdAt: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  passEntries: number;
  passType: string;
  joinedAt: string;
}
