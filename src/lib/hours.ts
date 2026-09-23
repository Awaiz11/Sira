import { useEffect, useState } from "react";

/** Minutes from midnight. `close` may exceed 1440 when a shift runs past midnight. */
type Shift = { open: number; close: number } | null;

const h = (hours: number, minutes = 0) => hours * 60 + minutes;

/** Index 0 = Sunday (matches Date#getDay). */
export const WEEK: Shift[] = [
  { open: h(18), close: h(25) }, // Sun 18:00 – 01:00
  null, //                          Mon closed
  { open: h(19), close: h(26) }, // Tue 19:00 – 02:00
  { open: h(19), close: h(26) }, // Wed
  { open: h(19), close: h(26) }, // Thu
  { open: h(19), close: h(27) }, // Fri 19:00 – 03:00
  { open: h(19), close: h(27) }, // Sat
];

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Display-friendly schedule for the footer. */
export const SCHEDULE: { days: string; hours: string }[] = [
  { days: "Tue — Thu", hours: "19:00 — 02:00" },
  { days: "Fri — Sat", hours: "19:00 — 03:00" },
  { days: "Sunday", hours: "18:00 — 01:00" },
  { days: "Monday", hours: "Closed" },
];

export const fmt = (mins: number) =>
  `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

/** Current weekday + minutes in Barcelona, regardless of the visitor's timezone. */
export function barcelonaNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const minutes = (Number(get("hour")) % 24) * 60 + Number(get("minute"));

  return { day: day < 0 ? date.getDay() : day, minutes };
}

export type BarStatus = { open: boolean; label: string; short: string };

export function getStatus(date = new Date()): BarStatus {
  const { day, minutes } = barcelonaNow(date);
  const today = WEEK[day];
  const yesterday = WEEK[(day + 6) % 7];

  // Still pouring from last night's late shift
  if (yesterday && yesterday.close > 1440 && minutes < yesterday.close - 1440) {
    return { open: true, label: `Open now · until ${fmt(yesterday.close)}`, short: "Open now" };
  }

  if (today && minutes >= today.open && minutes < today.close) {
    return { open: true, label: `Open now · until ${fmt(today.close)}`, short: "Open now" };
  }

  if (today && minutes < today.open) {
    return {
      open: false,
      label: `Opens tonight at ${fmt(today.open)}`,
      short: `Tonight ${fmt(today.open)}`,
    };
  }

  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const shift = WEEK[d];
    if (shift) {
      const when = i === 1 ? "tomorrow" : DAY_NAMES[d];
      return {
        open: false,
        label: `Closed · opens ${when} at ${fmt(shift.open)}`,
        short: `Opens ${i === 1 ? "tomorrow" : DAY_NAMES[d].slice(0, 3)}`,
      };
    }
  }

  return { open: false, label: "Closed", short: "Closed" };
}

/** Live status, refreshed every minute. */
export function useBarStatus() {
  const [status, setStatus] = useState<BarStatus>(() => getStatus());

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return status;
}

/** Upcoming evenings for the reservation picker (Barcelona calendar). */
export function upcomingEvenings(count = 10) {
  const now = new Date();
  const { day: todayIdx } = barcelonaNow(now);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    day: "numeric",
    month: "short",
  });

  return Array.from({ length: count }, (_, i) => {
    const date = new Date(now.getTime() + i * 86_400_000);
    const weekday = (todayIdx + i) % 7;
    const shift = WEEK[weekday];
    const [dayNum, month] = formatter.format(date).split(" ");

    return {
      id: `${i}`,
      offset: i,
      weekday: i === 0 ? "Tonight" : i === 1 ? "Tomorrow" : DAY_NAMES[weekday].slice(0, 3),
      longLabel: `${DAY_NAMES[weekday]} ${dayNum} ${month}`,
      dayNum,
      month,
      closed: !shift,
      open: shift?.open ?? 0,
    };
  });
}

/** Seating times from opening until 23:30, every half hour. */
export function slotsFor(openMinutes: number) {
  const slots: string[] = [];
  for (let m = openMinutes; m <= h(23, 30); m += 30) slots.push(fmt(m));
  return slots;
}
