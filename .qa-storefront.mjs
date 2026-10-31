import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const base = "http://127.0.0.1:4173";
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const profile = join(tmpdir(), `tourtrip-edge-${process.pid}`);
const shots = join(tmpdir(), `tourtrip-shots-${process.pid}`);
await mkdir(profile, { recursive: true });
await mkdir(shots, { recursive: true });

const edge = spawn(edgePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--no-first-run",
  "--no-default-browser-check",
  "--remote-debugging-port=9333",
  `--user-data-dir=${profile}`,
  base,
], { stdio: "ignore" });
const keepAlive = setInterval(() => {}, 1000);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitForJson(url, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {}
    await delay(150);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

let socket;
let nextId = 0;
const pending = new Map();
const eventWaiters = new Map();
const errors = [];

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject, method, hint: params.expression?.slice(0, 120) });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function waitEvent(method, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeout);
    const list = eventWaiters.get(method) ?? [];
    list.push((params) => { clearTimeout(timer); resolve(params); });
    eventWaiters.set(method, list);
  });
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Browser evaluation failed");
  return result.result.value;
}

async function navigate(path) {
  const loaded = waitEvent("Page.loadEventFired");
  await send("Page.navigate", { url: `${base}${path}` });
  await loaded;
  await delay(900);
}

async function waitUntil(expression, label, timeout = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(expression)) return;
    await delay(120);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
  process.stdout.write(`PASS ${message}\n`);
}

async function clickText(selector, text) {
  const clicked = await evaluate(`(() => { const el = [...document.querySelectorAll(${JSON.stringify(selector)})].find((node) => node.textContent.trim().toLowerCase().includes(${JSON.stringify(text.toLowerCase())})); if (!el) return false; el.click(); return true; })()`);
  assert(clicked, `click ${text}`);
}

async function input(selector, value) {
  const changed = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set; setter.call(el, ${JSON.stringify(value)}); el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); return true; })()`);
  assert(changed, `fill ${selector}`);
}

async function viewport(width, height = 900) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
}

async function screenshot(name) {
  const result = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await writeFile(join(shots, `${name}.png`), Buffer.from(result.data, "base64"));
}

try {
  await waitForJson("http://127.0.0.1:9333/json/version");
  const targets = await waitForJson("http://127.0.0.1:9333/json/list");
  const target = targets.find((item) => item.type === "page");
  if (!target) throw new Error("Edge did not expose a page target");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  socket.addEventListener("error", (event) => process.stderr.write(`WebSocket error ${event.message ?? ""}\n`));
  socket.addEventListener("close", () => process.stderr.write("WebSocket closed\n"));
  socket.addEventListener("message", async (event) => {
    const payload = typeof event.data === "string" ? event.data : Buffer.from(await event.data.arrayBuffer()).toString("utf8");
    const message = JSON.parse(payload);
    if (message.id) {
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      if (message.error) waiter.reject(new Error(`${waiter.method}${waiter.hint ? ` (${waiter.hint})` : ""}: ${message.error.message}`)); else waiter.resolve(message.result);
      return;
    }
    if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails?.exception?.description ?? message.params.exceptionDetails?.text ?? "Runtime exception");
    if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") errors.push(message.params.args.map((arg) => arg.value ?? arg.description).join(" "));
    const waiters = eventWaiters.get(message.method);
    if (waiters?.length) {
      eventWaiters.delete(message.method);
      waiters.forEach((resolve) => resolve(message.params));
    }
  });
  await Promise.all([send("Page.enable"), send("Runtime.enable"), send("Log.enable")]);
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await viewport(1280);
  await navigate("/");
  await evaluate(`localStorage.clear(); sessionStorage.clear();`);
  await navigate("/");
  await waitUntil(`!!document.querySelector('a[href="/tours?destination=battambang"]')`, "Battambang home link", 20000);
  assert((await evaluate(`document.body.innerText.includes("Battambang") && ![...document.querySelectorAll('[aria-label*="Battambang"]')].some(el => el.textContent.includes("Coming soon"))`)), "Home shows active Battambang destination");

  await navigate("/destinations");
  assert((await evaluate(`document.body.innerText.includes("Battambang") && document.body.innerText.includes("10 small-group tours") && !!document.querySelector('a[href="/tours?destination=battambang"]')`)), "Destinations counts Battambang and links to its tours");

  await navigate("/tours?destination=Battambang");
  assert((await evaluate(`document.body.innerText.includes("Battambang Countryside & Bamboo Train")`)), "case-insensitive Battambang URL filter returns its tour");

  await navigate("/tours/battambang-countryside");
  await waitUntil(`document.querySelectorAll('[aria-label="Departure dates"] button:not(:disabled)').length > 0`, "available departure");
  await clickText('[aria-label="Departure dates"] button:not(:disabled)', "seat");
  assert((await evaluate(`(() => { const el = document.querySelector('button[aria-label="Add one children"]'); if (!el) return false; el.click(); return true; })()`)), "add one child");
  await clickText('button', "Book now");
  await waitUntil(`location.pathname === "/login"`, "login redirect");
  const encodedRedirect = await evaluate(`new URLSearchParams(location.search).get("redirect")`);
  assert(encodedRedirect?.startsWith("/booking/battambang-countryside?date=") && encodedRedirect.includes("adults=1") && encodedRedirect.includes("children=1"), "Book Now preserves date and travellers in login redirect");
  await waitUntil(`document.body.innerText.includes("Your date and travellers are saved")`, "preserved selection message");
  assert((await evaluate(`document.body.innerText.includes("Your date and travellers are saved")`)), "Login explains preserved booking selection");
  await input("#customer-email", "customer@tourtrip.com");
  await input("#customer-password", "Customer@123");
  await clickText('button[type="submit"]', "Sign in");
  await waitUntil(`location.pathname === "/booking/battambang-countryside"`, "booking redirect after login", 15000);
  await waitUntil(`document.body.innerText.includes("Almost there")`, "booking stub content");
  const booking = await evaluate(`({ search: location.search, text: document.body.innerText })`);
  assert(booking.search.includes("adults=1") && booking.search.includes("children=1") && booking.text.includes("1 adult") && booking.text.includes("1 child"), "Booking stub receives the original date and travellers");

  await evaluate(`(() => { localStorage.removeItem("tourtrip.customer.auth"); sessionStorage.removeItem("tourtrip.customer.auth"); localStorage.removeItem("wishlist"); return true; })()`);
  await navigate("/tours");
  await waitUntil(`!!document.querySelector('button[aria-label^="Save "]')`, "tour cards");
  await evaluate(`document.querySelector('button[aria-label^="Save "]').click()`);
  assert(JSON.parse(await evaluate(`localStorage.getItem("wishlist")`)).length === 1, "guest wishlist persists under localStorage wishlist key");
  assert((await evaluate(`!!document.querySelector('a[aria-label^="Wishlist, 1 saved"]')`)), "header wishlist count updates live");
  await navigate("/wishlist");
  assert((await evaluate(`document.querySelectorAll('button[aria-label^="Remove "]').length === 1`)), "wishlist page reuses saved TourCard");
  await evaluate(`document.querySelector('button[aria-label^="Remove "]').click()`);
  await waitUntil(`document.body.innerText.includes("No saved tours yet")`, "wishlist empty state");
  assert((await evaluate(`document.body.innerText.includes("Browse tours")`)), "wishlist empty state offers Browse Tours");

  await navigate("/tours/angkor-sunrise");
  await navigate("/tours/battambang-countryside");
  const recent = JSON.parse(await evaluate(`localStorage.getItem("tourtrip.recentlyViewed")`));
  assert(recent[0] === "battambang-countryside" && recent.includes("angkor-sunrise") && recent.length <= 6, "recently viewed stores newest-first tour ids");
  await navigate("/");
  assert((await evaluate(`document.body.innerText.includes("Recently viewed")`)), "Home shows Recently Viewed when history exists");

  for (const path of ["/gallery", "/reviews", "/about", "/contact", "/faq"]) {
    await navigate(path);
    assert((await evaluate(`document.querySelector('main') !== null`)), `${path} renders inside storefront`);
  }

  for (const width of [375, 768, 1280, 1920]) {
    await viewport(width, width === 375 ? 812 : 900);
    for (const path of ["/", "/tours", "/tours/battambang-countryside", "/wishlist"]) {
      await navigate(path);
      const overflow = await evaluate(`document.documentElement.scrollWidth - window.innerWidth`);
      assert(overflow <= 1, `${path} has no horizontal overflow at ${width}px`);
    }
  }

  await viewport(1280);
  await evaluate(`localStorage.setItem("tourtrip.theme.storefront", "dark")`);
  await navigate("/tours/battambang-countryside");
  assert((await evaluate(`document.documentElement.classList.contains("dark")`)), "tour detail respects dark storefront theme");
  await screenshot("tour-detail-dark-1280");
  await viewport(375, 812);
  await screenshot("tour-detail-dark-375");
  assert(errors.length === 0, `browser console has no errors${errors.length ? `: ${errors.join(" | ")}` : ""}`);
  process.stdout.write(`SCREENSHOTS ${shots}\n`);
} finally {
  try { socket?.close(); } catch {}
  edge.kill();
  clearInterval(keepAlive);
  await delay(300);
  await rm(profile, { recursive: true, force: true }).catch(() => {});
}
