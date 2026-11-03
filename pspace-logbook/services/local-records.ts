import * as SQLite from "expo-sqlite";
import type { Aircraft, Flight, LocalProfile } from "@/types/records";
import type { AccountUser } from "@/types/auth";
let database: Promise<SQLite.SQLiteDatabase> | undefined;
async function getDatabase() {
  if (!database) {
    database = (async () => {
      const db = await SQLite.openDatabaseAsync("pspace-logbook.db");
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS aircraft (id TEXT PRIMARY KEY NOT NULL, registration TEXT UNIQUE NOT NULL, payload TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS flights (id TEXT PRIMARY KEY NOT NULL, aircraft_id TEXT NOT NULL REFERENCES aircraft(id), payload TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY NOT NULL, payload TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS account_aircraft (owner TEXT NOT NULL, id TEXT NOT NULL, registration TEXT NOT NULL, payload TEXT NOT NULL, PRIMARY KEY(owner, id), UNIQUE(owner, registration));
        CREATE TABLE IF NOT EXISTS account_flights (owner TEXT NOT NULL, id TEXT NOT NULL, aircraft_id TEXT NOT NULL, payload TEXT NOT NULL, PRIMARY KEY(owner, id), FOREIGN KEY(owner, aircraft_id) REFERENCES account_aircraft(owner, id));
        PRAGMA user_version = 2;
      `);
      return db;
    })().catch((error) => { database = undefined; throw error; });
  }
  return database;
}
export async function loadAircraft(owner?: string): Promise<Aircraft[]> {
  const rows = await (await getDatabase()).getAllAsync<{ payload: string }>(owner ? "SELECT payload FROM account_aircraft WHERE owner = ? ORDER BY rowid DESC" : "SELECT payload FROM aircraft ORDER BY rowid DESC", ...(owner ? [owner] : []));
  return rows.map(({ payload }) => JSON.parse(payload));
}
export async function saveAircraft(aircraft: Aircraft, owner?: string): Promise<void> {
  const db = await getDatabase();
  if (owner) await db.runAsync("INSERT INTO account_aircraft (owner, id, registration, payload) VALUES (?, ?, ?, ?)", owner, aircraft.id, aircraft.registration, JSON.stringify(aircraft));
  else await db.runAsync("INSERT INTO aircraft (id, registration, payload) VALUES (?, ?, ?)", aircraft.id, aircraft.registration, JSON.stringify(aircraft));
}
export async function loadFlights(owner?: string): Promise<Flight[]> {
  const rows = await (await getDatabase()).getAllAsync<{ payload: string }>(owner ? "SELECT payload FROM account_flights WHERE owner = ? ORDER BY rowid DESC" : "SELECT payload FROM flights ORDER BY rowid DESC", ...(owner ? [owner] : []));
  return rows.map(({ payload }) => JSON.parse(payload));
}
export async function saveFlight(flight: Flight, owner?: string): Promise<void> {
  const db = await getDatabase();
  if (owner) await db.runAsync("INSERT INTO account_flights (owner, id, aircraft_id, payload) VALUES (?, ?, ?, ?)", owner, flight.id, flight.aircraftId, JSON.stringify(flight));
  else await db.runAsync("INSERT INTO flights (id, aircraft_id, payload) VALUES (?, ?, ?)", flight.id, flight.aircraftId, JSON.stringify(flight));
}

export async function loadProfile(owner?: string): Promise<LocalProfile | null> {
  const row = await (await getDatabase()).getFirstAsync<{ payload: string }>("SELECT payload FROM settings WHERE key = ?", owner ? `${owner}:profile` : "profile");
  return row ? JSON.parse(row.payload) : null;
}
export async function saveProfile(profile: LocalProfile, owner?: string): Promise<void> {
  await (await getDatabase()).runAsync("INSERT INTO settings (key, payload) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET payload = excluded.payload", owner ? `${owner}:profile` : "profile", JSON.stringify(profile));
}

export async function cacheAccount(user: AccountUser, owner: string) { await (await getDatabase()).runAsync("INSERT INTO settings (key, payload) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET payload = excluded.payload", `${owner}:account`, JSON.stringify(user)); }
export async function cachedAccount(owner: string): Promise<AccountUser | null> {
  const row = await (await getDatabase()).getFirstAsync<{ payload: string }>("SELECT payload FROM settings WHERE key = ?", `${owner}:account`);
  return row ? JSON.parse(row.payload) : null;
}
export async function needsLegacyChoice(owner: string) {
  const db = await getDatabase();
  const handled = await db.getFirstAsync("SELECT key FROM settings WHERE key IN (?, ?)", "legacy-owner", `${owner}:legacy-declined`);
  const legacy = await db.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM aircraft");
  const existing = await db.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM account_aircraft WHERE owner = ?", owner);
  return !handled && !!legacy?.count && !existing?.count;
}
export async function resolveLegacyRecords(owner: string, importRecords: boolean) {
  const db = await getDatabase();
  await db.withExclusiveTransactionAsync(async (tx) => {
    if (!importRecords) { await tx.runAsync("INSERT OR IGNORE INTO settings (key, payload) VALUES (?, ?)", `${owner}:legacy-declined`, "true"); return; }
    const claimed = await tx.getFirstAsync("SELECT key FROM settings WHERE key = ?", "legacy-owner");
    if (claimed) throw new Error("These records have already been assigned to an account.");
    const existing = await tx.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM account_aircraft WHERE owner = ?", owner);
    if (existing?.count) throw new Error("Existing records can only be imported into an empty logbook.");
    await tx.runAsync("INSERT INTO account_aircraft (owner, id, registration, payload) SELECT ?, id, registration, payload FROM aircraft ORDER BY rowid", owner);
    await tx.runAsync("INSERT INTO account_flights (owner, id, aircraft_id, payload) SELECT ?, id, aircraft_id, payload FROM flights ORDER BY rowid", owner);
    await tx.runAsync("INSERT INTO settings (key, payload) VALUES (?, ?)", "legacy-owner", JSON.stringify(owner));
  });
}
