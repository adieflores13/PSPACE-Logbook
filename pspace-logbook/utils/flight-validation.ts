import type { AddFlightInput, Aircraft } from "@/types/records";
import { isValidDate, parseDuration } from "@/utils/flight-format";

export function validateFlightInput(input: AddFlightInput, aircraft: readonly Aircraft[]): string | null {
  if (!aircraft.some((item) => item.id === input.aircraftId)) return "Choose an aircraft from your saved aircrafts.";
  if (!isValidDate(input.date)) return "Enter a valid flight date.";
  if (!input.departure.trim() || !input.destination.trim()) return "Enter both departure and destination airports.";
  const minutes = parseDuration(input.duration);
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 1440) return "Enter a duration between 1 minute and 24 hours.";
  if (!/^\d+$/.test(input.landings) || Number(input.landings) > 999) return "Enter a whole number of landings between 0 and 999.";
  for (const time of [input.blockOff, input.blockOn]) {
    if (time?.trim() && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time.trim())) return "Enter block times as HH:MM using a 24-hour clock.";
  }
  return null;
}
