/* global __dirname */
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const moduleExports = { exports: {} };
const code = ts.transpileModule(readFileSync(resolve(__dirname, "../utils/dashboard-layout.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
vm.runInNewContext(code, { module: moduleExports, exports: moduleExports.exports });
const { getDashboardLayout } = moduleExports.exports;

test("small or short phones use compact spacing without depending on OS", () => {
  assert.equal(getDashboardLayout(320, 568, 1).compact, true);
  assert.equal(getDashboardLayout(360, 640, 1).compact, true);
  assert.equal(getDashboardLayout(411, 914, 1).compact, false);
});

test("narrow screens and larger text move the percentage out of the details column", () => {
  assert.equal(getDashboardLayout(320, 568, 1).stackedPercentage, true);
  assert.equal(getDashboardLayout(411, 914, 1.3).stackedPercentage, true);
  assert.equal(getDashboardLayout(411, 914, 1).stackedPercentage, false);
  assert.equal(getDashboardLayout(390, 844, 2).stackedPercentage, true);
});
