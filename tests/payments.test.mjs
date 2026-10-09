import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { createHmac } from "node:crypto";
import { createRequire } from "node:module";
const requireDependency = createRequire(import.meta.url);

// Load the actual function code with isolated environment and API doubles.
// These tests never call Zoho, write a real sheet, or send email.
function load(file, { env = {}, mocks = {} } = {}, cache = new Map()) {
  file = resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const compiledModule = { exports: {} };
  cache.set(file, compiledModule);
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const localRequire = (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id.startsWith(".")) return load(resolve(dirname(file), id + ".ts"), { env, mocks }, cache);
    return requireDependency(id);
  };
  vm.runInNewContext(code, {
    module: compiledModule, exports: compiledModule.exports, require: localRequire,
    process: { env }, console: { error() {}, warn() {} }, Buffer, URL, Response,
  }, { filename: file });
  return compiledModule.exports;
}

test("sandbox uses INR 100; live uses the full price for all access plans", () => {
  const { checkoutAmount } = load("netlify/lib/checkout-amount.ts");
  const { MEMBERSHIP_PLANS } = load("src/lib/membership-plans.ts");
  for (const plan of Object.values(MEMBERSHIP_PLANS)) {
    assert.equal(checkoutAmount(plan, "sandbox"), 100);
    assert.equal(checkoutAmount(plan, "live"), plan.totalAmountRupees);
  }
});

function confirmation({ environment = "live", amount = 82600, status = "succeeded", ref = "EHC-TEST", currency = "INR", planId = "individual" } = {}) {
  const events = [];
  const { confirmPayment } = load("netlify/lib/confirm.ts", {
    mocks: {
      "./config": { getZohoConfig: () => ({ environment }) },
      "./sheet": { recordPaymentEvent: async (event) => { events.push(event); } },
      "./zoho": {
        getPayment: async () => ({ payments_session_id: "123", amount, currency, status }),
        getPaymentSession: async () => ({
          payments_session_id: "123", amount, currency, reference_number: "EHC-TEST",
          meta_data: [{ key: "plan", value: planId }, { key: "ref", value: ref }],
        }),
        readMeta: (meta, key) => meta.find((item) => item.key === key)?.value ?? "",
      },
    },
  });
  return { confirmPayment, events };
}

test("live rejects INR 100 even when session metadata has TEST prefix", async () => {
  const { confirmPayment, events } = confirmation({ amount: 100, ref: "TEST:EHC-TEST" });
  assert.equal((await confirmPayment("456", { source: "browser" })).status, "mismatch");
  assert.equal(events[0].status, "amount_mismatch");
});

test("sandbox accepts INR 100 only for server-marked test sessions", async () => {
  for (const [ref, expected] of [["TEST:EHC-TEST", "paid"], ["EHC-TEST", "mismatch"]]) {
    const { confirmPayment } = confirmation({ environment: "sandbox", amount: 100, ref });
    assert.equal((await confirmPayment("456", { source: "browser" })).status, expected);
  }
});

test("browser and webhook both verify the full live amount and record confirmation", async () => {
  for (const source of ["browser", "webhook"]) {
    const { confirmPayment, events } = confirmation();
    const result = await confirmPayment("456", { source, expectedSessionId: "123" });
    assert.equal(result.status, "paid");
    assert.equal(result.amount, 82600);
    assert.equal(events[0].source, source);
    assert.equal(events[0].status, "succeeded");
  }
});

test("a different session or currency cannot confirm payment", async () => {
  const wrongSession = confirmation();
  assert.equal((await wrongSession.confirmPayment("456", { source: "browser", expectedSessionId: "999" })).status, "mismatch");
  assert.equal(wrongSession.events.length, 0);
  const wrongCurrency = confirmation({ currency: "USD" });
  assert.equal((await wrongCurrency.confirmPayment("456", { source: "webhook" })).status, "mismatch");
});

test("failed and pending payments are never reported as paid", async () => {
  for (const [status, expected] of [["failed", "failed"], ["initiated", "pending"], ["incomplete", "pending"]]) {
    const { confirmPayment, events } = confirmation({ status });
    assert.equal((await confirmPayment("456", { source: "webhook" })).status, expected);
    assert.equal(events.some((event) => event.status === "succeeded"), false);
  }
});

test("webhook signatures reject forgery, tampering, missing headers and stale deliveries", () => {
  const { verifyWebhookSignature } = load("netlify/lib/webhook-signature.ts");
  const now = Date.now();
  const body = '{"event_type":"payment.succeeded"}';
  const sign = (time) => `t=${time},v=${createHmac("sha256", "test-key").update(`${time}.${body}`).digest("hex")}`;
  assert.equal(verifyWebhookSignature(sign(now), body, "test-key", now), true);
  assert.equal(verifyWebhookSignature(sign(now), body + " ", "test-key", now), false);
  assert.equal(verifyWebhookSignature(sign(now), body, "wrong-key", now), false);
  assert.equal(verifyWebhookSignature(null, body, "test-key", now), false);
  assert.equal(verifyWebhookSignature(sign(now - 25 * 3600000), body, "test-key", now), false);
});

test("Apps Script confirmation is idempotent and creates a row when the lead is missing", () => {
  const rows = [];
  const sheet = {
    getLastRow: () => rows.length,
    appendRow: (row) => rows.push([...row]),
    setFrozenRows() {},
    getRange(row, col, height = 1) {
      const range = {
        setNumberFormat: () => range,
        setFontWeight: () => range,
        setValues(values) { values.forEach((value, index) => { rows[row - 1 + index] = [...value]; }); return range; },
        getValue: () => rows[row - 1]?.[col - 1],
        setValue(value) { rows[row - 1][col - 1] = value; return range; },
        createTextFinder(value) {
          return { matchEntireCell() { return this; }, findNext() {
            for (let index = row - 1; index < row - 1 + height; index++) {
              if (String(rows[index]?.[col - 1]) === value) return { getRow: () => index + 1 };
            }
            return null;
          } };
        },
      };
      return range;
    },
  };
  const sent = [];
  const ss = { getSheetByName: () => rows.length ? sheet : null, insertSheet: () => sheet };
  const context = vm.createContext({
    SpreadsheetApp: { getActiveSpreadsheet: () => ss },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (name) => ({ PAYMENTS_SECRET: "test-secret", CLUB_NOTIFY_EMAIL: "club@example.com" })[name] }) },
    MailApp: { sendEmail: (email) => sent.push(email) }, console,
  });
  vm.runInContext(readFileSync("docs/apps-script.gs", "utf8"), context);
  const event = { action: "payment_update", secret: "test-secret", sessionId: "123", paymentId: "456", status: "succeeded", amount: 82600, plan: "individual", name: "Test", email: "member@example.com", source: "webhook", environment: "live" };
  assert.equal(context.handlePaymentEvent(event).status, "success");
  assert.equal(rows[1][1], "succeeded");
  assert.equal(rows[1][9], "456");
  assert.equal(sent.length, 2);
  assert.equal(context.handlePaymentEvent({ ...event, source: "browser" }).status, "duplicate");
  assert.equal(context.handlePaymentEvent({ ...event, action: "payment_created" }).status, "duplicate");
  assert.equal(rows.length, 2);
  assert.equal(sent.length, 2);
});

 test("Early Bird Access requires INR 2000 live and confirms through browser and webhook", async () => {
  for (const source of ["browser", "webhook"]) {
    const { confirmPayment, events } = confirmation({ planId: "early_bird", amount: 2000 });
    const result = await confirmPayment("456", { source, expectedSessionId: "123" });
    assert.equal(result.status, "paid");
    assert.equal(result.plan.name, "Early Bird Access");
    assert.equal(events[0].plan, "early_bird");
    assert.equal(events[0].amount, 2000);
  }
  for (const amount of [100, 1999, 2360]) {
    const { confirmPayment } = confirmation({ planId: "early_bird", amount });
    assert.equal((await confirmPayment("456", { source: "browser" })).status, "mismatch");
  }
});
