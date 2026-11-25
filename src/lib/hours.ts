// src/lib/hours.ts
import type { BusinessHours } from "@/context/accounts/businessContext";

export type DayKey = keyof BusinessHours;

export const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

export function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function compactTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const hour = hours % 12 || 12;
  return minutes ? `${hour}:${String(minutes).padStart(2, "0")}` : String(hour);
}

export function summarizeHours(hours: BusinessHours) {
  const open: string[] = [];
  const closed: string[] = [];
  let index = 0;

  while (index < DAYS.length) {
    const day = DAYS[index];
    const schedule = hours[day.key];

    if (schedule.closed) {
      closed.push(`${day.short} closed`);
      index += 1;
      continue;
    }

    let end = index;
    while (end + 1 < DAYS.length) {
      const next = hours[DAYS[end + 1].key];
      if (next.closed || next.open !== schedule.open || next.close !== schedule.close) break;
      end += 1;
    }

    const span = index === end ? day.short : `${day.short}–${DAYS[end].short}`;
    open.push(`${span} ${compactTime(schedule.open)}–${compactTime(schedule.close)}`);
    index = end + 1;
  }

  return [...open, ...closed].join(" · ");
}

export function hoursByDay(hours: BusinessHours) {
  return DAYS.map(({ key, short }) => {
    const day = hours[key];
    return day.closed ? `${short} closed` : `${short} ${formatTime(day.open)}–${formatTime(day.close)}`;
  }).join(" · ");
}