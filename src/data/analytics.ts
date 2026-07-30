/** Rich demo analytics for admin dashboard & reports */

export const analyticsDemo = {
  periodLabel: "Ostatnie 30 dni (demo)",

  kpis: {
    revenueMonth: 18420,
    revenuePrevMonth: 15280,
    avgTicket: 186,
    newCustomers: 47,
    returningRate: 68,
    occupancyAvg: 74,
    noShowRate: 4.2,
    cancelRate: 7.8,
    conversionRate: 61,
    activePasses: 128,
    openPasses: 19,
    waitlist: 14,
    classesHeld: 86,
    smsSent: 312,
    emailsSent: 890,
  },

  /** Daily revenue last 14 days */
  revenueDaily: [
    { label: "17.07", value: 480 },
    { label: "18.07", value: 720 },
    { label: "19.07", value: 540 },
    { label: "20.07", value: 910 },
    { label: "21.07", value: 1180 },
    { label: "22.07", value: 640 },
    { label: "23.07", value: 390 },
    { label: "24.07", value: 520 },
    { label: "25.07", value: 780 },
    { label: "26.07", value: 860 },
    { label: "27.07", value: 990 },
    { label: "28.07", value: 1240 },
    { label: "29.07", value: 710 },
    { label: "30.07", value: 580 },
  ],

  /** Weekly revenue 8 weeks */
  revenueWeekly: [
    { label: "W1", value: 3200 },
    { label: "W2", value: 3680 },
    { label: "W3", value: 3410 },
    { label: "W4", value: 4120 },
    { label: "W5", value: 3890 },
    { label: "W6", value: 4550 },
    { label: "W7", value: 4780 },
    { label: "W8", value: 5020 },
  ],

  weekRevenue: [
    { label: "Pn", value: 1420 },
    { label: "Wt", value: 1680 },
    { label: "Śr", value: 1540 },
    { label: "Cz", value: 1920 },
    { label: "Pt", value: 2160 },
    { label: "Sb", value: 2890 },
    { label: "Nd", value: 980 },
  ],

  /** Bookings by hour */
  byHour: [
    { label: "16:00", value: 8 },
    { label: "17:00", value: 14 },
    { label: "18:00", value: 32 },
    { label: "19:00", value: 41 },
    { label: "20:00", value: 28 },
    { label: "21:00", value: 11 },
  ],

  /** Category share (for pie-like bars) */
  byCategory: [
    { label: "Tango", value: 34, color: "#c41e3a" },
    { label: "WCS", value: 22, color: "#1d4e89" },
    { label: "Zouk", value: 18, color: "#6a4c93" },
    { label: "Fitness", value: 12, color: "#2d6a4f" },
    { label: "Dzieci", value: 9, color: "#e85d04" },
    { label: "Imprezy", value: 5, color: "#8b0000" },
  ],

  /** Pass type mix */
  byPass: [
    { label: "Pojedyncze", value: 18 },
    { label: "Karnet 4", value: 24 },
    { label: "Karnet 8", value: 31 },
    { label: "Karnet 12", value: 14 },
    { label: "OPEN", value: 9 },
    { label: "Zouk / WCS", value: 12 },
  ],

  /** Top classes (demo seed if bookings few) */
  topClasses: [
    { name: "Tango P1", bookings: 48, occupancy: 86, revenue: 3840 },
    { name: "WCS L 0/1", bookings: 41, occupancy: 79, revenue: 3280 },
    { name: "Zouk Start", bookings: 36, occupancy: 72, revenue: 4320 },
    { name: "Tango praktyka", bookings: 34, occupancy: 88, revenue: 2040 },
    { name: "Pilates", bookings: 29, occupancy: 91, revenue: 1740 },
    { name: "Milonga", bookings: 52, occupancy: 67, revenue: 3120 },
    { name: "Body Balet", bookings: 22, occupancy: 68, revenue: 1320 },
    { name: "Tango LT", bookings: 19, occupancy: 84, revenue: 1140 },
  ],

  /** Funnel */
  funnel: [
    { label: "Wejścia na stronę", value: 2840 },
    { label: "Start rezerwacji", value: 612 },
    { label: "Wybór karnetu", value: 448 },
    { label: "Dane kontaktowe", value: 391 },
    { label: "Płatność OK", value: 374 },
  ],

  /** Monthly trend 6 months */
  monthly: [
    { label: "Lut", revenue: 11200, bookings: 62 },
    { label: "Mar", revenue: 12840, bookings: 71 },
    { label: "Kwi", revenue: 13920, bookings: 78 },
    { label: "Maj", revenue: 15100, bookings: 84 },
    { label: "Cze", revenue: 15280, bookings: 86 },
    { label: "Lip", revenue: 18420, bookings: 98 },
  ],

  /** Room utilization % */
  rooms: [
    { name: "Sala A", utilization: 82 },
    { name: "Sala B", utilization: 71 },
    { name: "Sala główna", utilization: 58 },
  ],

  /** Recent transactions demo (extra) */
  topCustomers: [
    { name: "Karolina Maj", spent: 1500, visits: 22 },
    { name: "Julia Nowak", spent: 1120, visits: 18 },
    { name: "Alicja Wiśniewska", spent: 960, visits: 14 },
    { name: "Tomasz Lewandowski", spent: 720, visits: 11 },
    { name: "Michał Kowal", spent: 480, visits: 8 },
  ],

  attendanceRate: [
    { label: "Pn", value: 91 },
    { label: "Wt", value: 88 },
    { label: "Śr", value: 93 },
    { label: "Cz", value: 86 },
    { label: "Pt", value: 84 },
    { label: "Sb", value: 79 },
    { label: "Nd", value: 95 },
  ],
};

export function pctChange(current: number, prev: number): number {
  if (!prev) return 0;
  return Math.round(((current - prev) / prev) * 1000) / 10;
}
