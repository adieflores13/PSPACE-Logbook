/* global __dirname */
const assert = require("node:assert/strict");
const { mkdtempSync, readFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join, resolve } = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

function loadSource(path, dependencies = {}) {
  const module = { exports: {} };
  const { outputText } = ts.transpileModule(readFileSync(resolve(__dirname, "..", path), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  vm.runInNewContext(outputText, { module, exports: module.exports, require: (name) => dependencies[name] ?? require(name) });
  return module.exports;
}

const formats = loadSource("utils/flight-format.ts");

test("flight durations preserve minute precision for decimal hours and HH:MM", () => {
  assert.equal(formats.parseDuration("1.5"), 90);
  assert.equal(formats.parseDuration("01:30"), 90);
  assert.equal(formats.parseDuration("0,25"), 15);
  assert.equal(formats.parseDuration("1.02"), 61);
  assert.ok(Number.isNaN(formats.parseDuration("01:60")));
  assert.ok(Number.isNaN(formats.parseDuration("-1")));
  assert.ok(Number.isNaN(formats.parseDuration("")));
  assert.equal(formats.formatHours(90), "1.5");
  assert.equal(formats.formatHours(600), "10");
  assert.equal(formats.formatDuration(90), "1h 30m");
});

test("invalid calendar dates cannot roll over silently", () => {
  assert.equal(formats.isValidDate("2024-02-29"), true);
  assert.equal(formats.isValidDate("2025-02-29"), false);
  assert.equal(formats.isValidDate("2026-04-31"), false);
  assert.equal(formats.isValidDate("2026-13-01"), false);
});

test("flight review rejects incomplete or invalid inputs before saving", () => {
  const { validateFlightInput } = loadSource("utils/flight-validation.ts", { "@/utils/flight-format": formats });
  const aircraft = [{ id: "saved-aircraft" }];
  const valid = { aircraftId: "saved-aircraft", date: "2026-11-03", departure: "KAPA", destination: "KDEN", duration: "1.5", landings: "2", period: "Day", instructor: "", remarks: "" };
  assert.equal(validateFlightInput(valid, aircraft), null);
  assert.ok(validateFlightInput({ ...valid, aircraftId: "missing" }, aircraft));
  assert.ok(validateFlightInput({ ...valid, destination: " " }, aircraft));
  assert.ok(validateFlightInput({ ...valid, duration: "0" }, aircraft));
  assert.ok(validateFlightInput({ ...valid, landings: "1.5" }, aircraft));
  assert.ok(validateFlightInput({ ...valid, blockOff: "25:30" }, aircraft));
  assert.equal(validateFlightInput({ ...valid, blockOff: "08:15", blockOn: "09:45" }, aircraft), null);
});

test("logbook totals use saved minutes and distinguish Day and Night", () => {
  const totals = formats.getFlightTotals([
    { durationMinutes: 90, period: "Day", landings: "3" },
    { durationMinutes: 45, period: "Night", landings: "2" },
    { durationMinutes: 61, period: "Day", landings: "1" },
  ]);
  assert.equal(totals.minutes, 196);
  assert.equal(totals.dayMinutes, 151);
  assert.equal(totals.nightMinutes, 45);
  assert.equal(totals.landings, 6);
  assert.equal(formats.getFlightTotals([]).minutes, 0);
});

test("aircraft details resolve exact IDs and PDF output escapes entered values", () => {
  const helpers = loadSource("utils/aircraft-details.ts", { "@/utils/flight-format": formats });
  const aircraft = { id: "aircraft-1", registration: "QA123", make: "<script>bad()</script>", model: '172S & "Skyhawk"', variant: "" };
  assert.equal(helpers.findAircraft([aircraft], { id: "missing" }), undefined);
  assert.equal(helpers.findAircraft([aircraft], { registration: "QA123" }).id, "aircraft-1");
  assert.equal(helpers.getAircraftDetails(aircraft).find((row) => row.label === "Serial Number").value, "Not provided");
  const pdf = loadSource("services/aircraft-pdf.ts", {
    "@/utils/aircraft-details": helpers,
    "expo-print": {}, "expo-sharing": {}, "expo-file-system": {}, "react-native": { Platform: { OS: "ios" } },
  });
  const html = pdf.buildAircraftPdfHtml(aircraft, [
    { aircraftId: "aircraft-1", durationMinutes: 90 }, { aircraftId: "different-aircraft", durationMinutes: 600 },
  ]);
  assert.ok(html.includes("&lt;script&gt;bad()&lt;/script&gt;"));
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&amp; &quot;Skyhawk&quot;"));
  assert.ok(html.includes("1.50 h (90 minutes)"));
  assert.ok(html.includes("Not provided"));
});

test("the native repository survives reopening and enforces aircraft relationships", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "pspace-records-"));
  const connections = [];
  t.after(() => { connections.forEach((db) => db.close()); rmSync(directory, { recursive: true }); });
  const sqlite = {
    async openDatabaseAsync(name) {
      const db = new DatabaseSync(join(directory, name));
      connections.push(db);
      return {
        execAsync: async (sql) => db.exec(sql),
        runAsync: async (sql, ...args) => db.prepare(sql).run(...args),
        getAllAsync: async (sql, ...args) => db.prepare(sql).all(...args),
        getFirstAsync: async (sql, ...args) => db.prepare(sql).get(...args),
      };
    },
  };
  const first = loadSource("services/local-records.ts", { "expo-sqlite": sqlite });
  assert.equal((await first.loadAircraft()).length, 0);
  const aircraft = { id: "qa-aircraft", registration: "QA123", makeModelVariant: "Cessna / 172S" };
  const flight = { id: "qa-flight", aircraftId: aircraft.id, remarks: "Saved locally", period: "Night", durationMinutes: 90 };
  await first.saveAircraft(aircraft);
  await first.saveFlight(flight);
  await assert.rejects(first.saveAircraft({ ...aircraft, id: "duplicate-registration" }));
  await assert.rejects(first.saveFlight({ ...flight, id: "orphan-flight", aircraftId: "missing" }));
  await first.saveProfile({ fullName: "Test Pilot" });
  await first.saveProfile({ fullName: "Updated Pilot" });
  const reopened = loadSource("services/local-records.ts", { "expo-sqlite": sqlite });
  assert.equal((await reopened.loadAircraft())[0].registration, "QA123");
  assert.equal((await reopened.loadFlights())[0].remarks, "Saved locally");
  assert.equal((await reopened.loadFlights())[0].period, "Night");
  assert.equal((await reopened.loadProfile()).fullName, "Updated Pilot");
});
