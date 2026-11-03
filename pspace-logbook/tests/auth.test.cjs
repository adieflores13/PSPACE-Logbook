/* global __dirname */
const assert = require("node:assert/strict");
const { readFileSync, mkdtempSync, rmSync } = require("node:fs");
const { resolve, join } = require("node:path");
const { tmpdir } = require("node:os");
const { DatabaseSync } = require("node:sqlite");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
function source(path, dependencies = {}, globals = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(readFileSync(resolve(__dirname, "..", path), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, require: (name) => dependencies[name] ?? require(name), ...globals });
  return module.exports;
}
const formats = source("utils/flight-format.ts");
test("mobile registration mirrors PSPACE password and age requirements", () => {
  const validation = source("utils/auth-validation.ts", { "@/utils/flight-format": formats });
  assert.equal(validation.passwordError("Existing1!"), null);
  for (const password of ["short", "password123!", "Password!", "Password123"]) assert.ok(validation.passwordError(password));
  assert.ok(validation.birthDateError("2026-02-30"));
  assert.ok(validation.birthDateError("2020-01-01", new Date(2026, 10, 3)));
  assert.equal(validation.birthDateError("2000-01-01", new Date(2026, 10, 3)), null);
});
function repository(t) {
  const directory = mkdtempSync(join(tmpdir(), "pspace-accounts-"));
  const connections = [];
  t.after(() => { connections.forEach((db) => db.close()); rmSync(directory, { recursive: true }); });
  const sqlite = { async openDatabaseAsync(name) {
    const db = new DatabaseSync(join(directory, name)); connections.push(db);
    const adapter = {
      execAsync: async (sql) => db.exec(sql), runAsync: async (sql, ...args) => db.prepare(sql).run(...args),
      getAllAsync: async (sql, ...args) => db.prepare(sql).all(...args), getFirstAsync: async (sql, ...args) => db.prepare(sql).get(...args),
      withExclusiveTransactionAsync: async (action) => { db.exec("BEGIN IMMEDIATE"); try { await action(adapter); db.exec("COMMIT"); } catch (error) { db.exec("ROLLBACK"); throw error; } },
    }; return adapter;
  } };
  return source("services/local-records.ts", { "expo-sqlite": sqlite });
}
test("accounts isolate aircraft, flights, cached identity and registration uniqueness", async (t) => {
  const repo = repository(t);
  const first = "https://platform.test|1", second = "https://platform.test|2";
  await repo.saveAircraft({ id: "a", registration: "N123" }, first);
  await repo.saveAircraft({ id: "b", registration: "N123" }, second);
  await repo.saveFlight({ id: "f", aircraftId: "a" }, first);
  await assert.rejects(repo.saveFlight({ id: "cross-account", aircraftId: "a" }, second));
  await repo.cacheAccount({ id: "1", fullName: "First User" }, first);
  assert.equal((await repo.loadAircraft(first))[0].id, "a");
  assert.equal((await repo.loadAircraft(second))[0].id, "b");
  assert.equal((await repo.loadFlights(second)).length, 0);
  assert.equal(await repo.cachedAccount(second), null);
  assert.equal((await repo.cachedAccount(first)).id, "1");
});
test("legacy records require consent and may only be assigned to one account", async (t) => {
  const repo = repository(t);
  await repo.saveAircraft({ id: "legacy", registration: "OLD" });
  await repo.saveFlight({ id: "old-flight", aircraftId: "legacy" });
  assert.equal((await repo.loadAircraft("first")).length, 0);
  assert.equal(await repo.needsLegacyChoice("first"), true);
  await repo.resolveLegacyRecords("first", false);
  assert.equal(await repo.needsLegacyChoice("first"), false);
  assert.equal((await repo.loadAircraft()).length, 1);
  await repo.resolveLegacyRecords("second", true);
  assert.equal((await repo.loadFlights("second"))[0].id, "old-flight");
  assert.equal(await repo.needsLegacyChoice("third"), false);
  await assert.rejects(repo.resolveLegacyRecords("third", true));
  assert.equal((await repo.loadAircraft("third")).length, 0);
});
test("web storage commits an import and ownership claim without exposing it to other accounts", async () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const repo = source("services/local-records.web.ts", {}, { globalThis: { localStorage: storage } });
  await repo.saveAircraft({ id: "old", registration: "OLD" });
  await repo.resolveLegacyRecords("one", true);
  assert.equal((await repo.loadAircraft("one")).length, 1);
  assert.equal((await repo.loadAircraft("two")).length, 0);
  await assert.rejects(repo.resolveLegacyRecords("two", true));
});
test("the API omits browser cookies and handles relative profile images and error JSON", async () => {
  let request;
  const api = source("services/auth-api.ts", {}, {
    process: { env: { EXPO_PUBLIC_PSPACE_URL: "https://pspace.example/" } }, FormData, AbortController, setTimeout, clearTimeout,
    fetch: async (url, options) => { request = { url, options }; return { ok: true, status: 200, json: async () => ({ user: { id: "1" } }) }; },
  });
  await api.post("/auth/login", { email: "test@example.com", password: "not-logged" });
  assert.equal(request.url, "https://pspace.example/api/mobile/v1/auth/login");
  assert.equal(request.options.credentials, "omit");
  assert.equal(api.normalizeUser({ profileImage: "/static/photo.jpg" }).profileImage, "https://pspace.example/static/photo.jpg");
});
test("queued secure-storage writes cannot resurrect a signed-out session", async () => {
  const values = new Map();
  const secure = { WHEN_UNLOCKED_THIS_DEVICE_ONLY: "device-only", getItemAsync: async (key) => values.get(key) ?? null,
    setItemAsync: async (key, value) => values.set(key, value), deleteItemAsync: async (key) => values.delete(key) };
  const storage = source("services/session-storage.ts", { "expo-secure-store": secure });
  const saved = { refreshToken: "synthetic-test-token", accountKey: "server|1", offlineUntil: 1 };
  await Promise.all([storage.writeSession(saved), storage.writeSession(null)]);
  assert.equal(await storage.readSession(), null);
});
