import type { AddAircraftInput, Aircraft, Flight } from "@/types/records";
import { isValidDate } from "@/utils/flight-format";

export function aircraftValue(value: string | null | undefined): string {
  return value?.trim() || "Not provided";
}

export function aircraftName(aircraft: Pick<Aircraft, "make" | "model" | "variant">): string {
  return [aircraft.make, aircraft.model, aircraft.variant].map((value) => value?.trim()).filter(Boolean).join(" / ") || "Not provided";
}

type AircraftParams = { id?: string | string[]; registration?: string | string[] };

export function findAircraft(aircraft: readonly Aircraft[], params: AircraftParams): Aircraft | undefined {
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const registration = Array.isArray(params.registration) ? params.registration[0] : params.registration;
  if (params.id !== undefined) return aircraft.find((item) => item.id === id);
  if (registration) return aircraft.find((item) => item.registration === registration);
  return undefined;
}

export function getAircraftFlightSummary(aircraftId: string, flights: readonly Flight[]) {
  const linkedFlights = flights.filter((flight) => flight.aircraftId === aircraftId);
  return {
    flightCount: linkedFlights.length,
    durationMinutes: linkedFlights.reduce((total, flight) => total + (Number.isFinite(flight.durationMinutes) && flight.durationMinutes > 0 ? flight.durationMinutes : 0), 0),
  };
}

export function getAircraftDetails(aircraft: Aircraft): { label: string; value: string }[] {
  const fields: [string, string | undefined][] = [
    ["Aircraft Registration", aircraft.registration],
    ["Manufacturer / Make", aircraft.make],
    ["Model", aircraft.model],
    ["Variant", aircraft.variant],
    ["Aircraft Category", aircraft.category],
    ["Engine Category", aircraft.engineCategory],
    ["Serial Number", aircraft.serialNumber],
    ["Year Model", aircraft.yearModel],
    ["Home Base", aircraft.homeBase],
    ["Maximum Occupants", aircraft.maxOccupants],
    ["Fuel Type", aircraft.fuelType],
    ["Registration Date", aircraft.registrationDate],
    ["Expiry Date", aircraft.expiryDate],
  ];
  return fields.map(([label, value]) => ({ label, value: aircraftValue(value) }));
}

export type AircraftFormErrors = Partial<Record<keyof AddAircraftInput, string>>;

export function validateAircraftInput(input: AddAircraftInput, aircraft: readonly Aircraft[]): AircraftFormErrors {
  const errors: AircraftFormErrors = {};
  const registration = input.registration.trim().toUpperCase();
  if (!registration) errors.registration = "Enter the aircraft registration.";
  else if (aircraft.some((item) => item.registration.trim().toUpperCase() === registration)) errors.registration = "This aircraft registration is already saved.";
  if (!input.make.trim()) errors.make = "Enter the manufacturer / make.";
  if (!input.model.trim()) errors.model = "Enter the model.";
  const year = input.yearModel?.trim();
  if (year && (!/^\d{4}$/.test(year) || Number(year) === 0)) errors.yearModel = "Enter a four-digit year or leave it blank.";
  const occupants = input.maxOccupants?.trim();
  if (occupants && (!/^\d+$/.test(occupants) || !Number.isSafeInteger(Number(occupants)) || Number(occupants) < 1)) errors.maxOccupants = "Enter a positive whole number or leave it blank.";
  const registrationDate = input.registrationDate?.trim();
  const expiryDate = input.expiryDate?.trim();
  if (registrationDate && !isValidDate(registrationDate)) errors.registrationDate = "Enter a valid date as YYYY-MM-DD or leave it blank.";
  if (expiryDate && !isValidDate(expiryDate)) errors.expiryDate = "Enter a valid date as YYYY-MM-DD or leave it blank.";
  if (registrationDate && expiryDate && !errors.registrationDate && !errors.expiryDate && expiryDate < registrationDate) errors.expiryDate = "Expiry date cannot be before the registration date.";
  return errors;
}
