import type { Flight } from "@/types/records";
export function parseDuration(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (/^\d+:\d{2}$/.test(normalized)) {
    const [hours, minutes] = normalized.split(":").map(Number);
    return minutes < 60 ? hours * 60 + minutes : NaN;
  }
  return /^\d+(\.\d+)?$/.test(normalized) ? Math.round(Number(normalized) * 60) : NaN;
}
export function formatHours(minutes: number): string {
  return (minutes / 60).toFixed(2).replace(/\.?0+$/, "") || "0";
}
export function formatDuration(minutes: number): string {
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}
export function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return Number.isFinite(date.getTime()) && date.getFullYear() === Number(value.slice(0, 4)) && date.getMonth() + 1 === Number(value.slice(5, 7)) && date.getDate() === Number(value.slice(8, 10));
}
export function formatFlightDate(value: string): string {
  if (!isValidDate(value)) return value;
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
export function getFlightTotals(flights: Flight[]) {
  return flights.reduce((totals, flight) => ({
    minutes: totals.minutes + flight.durationMinutes,
    dayMinutes: totals.dayMinutes + (flight.period === "Day" ? flight.durationMinutes : 0),
    nightMinutes: totals.nightMinutes + (flight.period === "Night" ? flight.durationMinutes : 0),
    landings: totals.landings + Number(flight.landings),
  }), { minutes: 0, dayMinutes: 0, nightMinutes: 0, landings: 0 });
}
