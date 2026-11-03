import type { Aircraft, Flight, LocalProfile } from "@/types/records";
import type { AccountUser } from "@/types/auth";
// Web preview uses browser storage; the installed iOS/Android app uses SQLite.
const key = "pspace-logbook.records.v1";
type Records = { aircraft: Aircraft[]; flights: Flight[] };
type DeviceRecords = Records & { accounts?: Record<string, Records>; legacyOwner?: string; legacyDeclined?: string[] };
const empty = (): Records => ({ aircraft: [], flights: [] });
function device(): DeviceRecords {
  const value = globalThis.localStorage?.getItem(key);
  return value ? JSON.parse(value) : empty();
}
function recordKey(owner?: string) { return owner ? `${key}:${owner}` : key; }
function read(owner?: string): Records { const all = device(); return owner ? all.accounts?.[owner] ?? empty() : all; }
function commit(value: DeviceRecords) { globalThis.localStorage.setItem(key, JSON.stringify(value)); }
function write(value: Records, owner?: string) {
  const all = device();
  commit(owner ? { ...all, accounts: { ...all.accounts, [owner]: value } } : { ...all, ...value });
}
export async function loadAircraft(owner?: string): Promise<Aircraft[]> { return read(owner).aircraft; }
export async function loadFlights(owner?: string): Promise<Flight[]> { return read(owner).flights; }
export async function saveAircraft(aircraft: Aircraft, owner?: string): Promise<void> {
  const records = read(owner);
  if (records.aircraft.some((item) => item.registration === aircraft.registration)) throw new Error("This aircraft registration is already saved.");
  records.aircraft.unshift(aircraft); write(records, owner);
}
export async function saveFlight(flight: Flight, owner?: string): Promise<void> {
  const records = read(owner);
  if (!records.aircraft.some((item) => item.id === flight.aircraftId)) throw new Error("Select an existing aircraft.");
  records.flights.unshift(flight); write(records, owner);
}
export async function loadProfile(owner?: string): Promise<LocalProfile | null> {
  const value = globalThis.localStorage?.getItem(owner ? `${recordKey(owner)}:profile` : "pspace-logbook.profile.v1");
  return value ? JSON.parse(value) : null;
}
export async function saveProfile(profile: LocalProfile, owner?: string): Promise<void> {
  globalThis.localStorage.setItem(owner ? `${recordKey(owner)}:profile` : "pspace-logbook.profile.v1", JSON.stringify(profile));
}
export async function cacheAccount(user: AccountUser, owner: string) { globalThis.localStorage.setItem(`${recordKey(owner)}:account`, JSON.stringify(user)); }
export async function cachedAccount(owner: string): Promise<AccountUser | null> {
  const value = globalThis.localStorage?.getItem(`${recordKey(owner)}:account`);
  return value ? JSON.parse(value) : null;
}
export async function needsLegacyChoice(owner: string) {
  const all = device();
  return !all.legacyOwner && !all.legacyDeclined?.includes(owner) && all.aircraft.length > 0 && read(owner).aircraft.length === 0;
}
export async function resolveLegacyRecords(owner: string, importRecords: boolean) {
  const all = device();
  if (!importRecords) { commit({ ...all, legacyDeclined: [...(all.legacyDeclined ?? []), owner] }); return; }
  if (!await needsLegacyChoice(owner)) throw new Error("These records cannot be imported into this account.");
  // Commit the ownership claim and imported snapshot in one storage operation.
  commit({ ...all, legacyOwner: owner, accounts: { ...all.accounts, [owner]: { aircraft: all.aircraft, flights: all.flights } } });
}
