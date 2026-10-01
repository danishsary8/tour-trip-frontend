/**
 * Deterministic dashboard fixtures. Every calendar day is generated from a PRNG
 * seeded with its own date, so a given day always has the same bookings no matter
 * when the page is loaded, and all dates are relative to today so nothing looks stale.
 *
 * The history covers ~26 months so every range (up to 12M) has a previous period to
 * compare against. The last 30 days hold roughly 120 bookings, the operational set
 * used by the tables and actions.
 */
import { coverOf } from "./tourImages";
import { MOCK_KEYS, onStoredChange, readJson, writeJson } from "./persistence";

/* ------------------------------------------------------------------ utils */

const DAY = 86_400_000;
const EPOCH = Date.UTC(2020, 0, 1);

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addMonths(date, months) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

/** Local calendar key, `YYYY-MM-DD`. */
export function toKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const dayNumber = (date) => Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - EPOCH) / DAY);

function poisson(rng, lambda) {
  const limit = Math.exp(-lambda);
  let product = rng();
  let count = 0;
  while (product > limit) {
    product *= rng();
    count += 1;
  }
  return count;
}

function pickWeighted(rng, items, weightOf = (item) => item.weight) {
  const total = items.reduce((sum, item) => sum + weightOf(item), 0);
  let roll = rng() * total;
  for (const item of items) {
    roll -= weightOf(item);
    if (roll <= 0) return item;
  }
  // Float rounding can leave a sliver of roll: fall back to the last item that can be picked, so
  // zero-weight entries (tours added after the history, e.g. International Escapes) never are.
  return items.findLast((item) => weightOf(item) > 0) ?? items[items.length - 1];
}

const initialsOf = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/* ------------------------------------------------------------ catalogue */

export const BOOKING_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];
export const PAYMENT_STATUSES = ["Unpaid", "Paid", "Refunded"];
export const PAYMENT_METHODS = ["Cash", "Bank Transfer", "ABA Pay (Simulation)", "Credit Card (Simulation)"];
export const REJECT_REASON = "Rejected by admin";

/**
 * Destinations carry a `country`. Cambodian provinces are the home market; "International
 * Escapes" tours sit in destinations outside Cambodia, so every tour still has exactly one
 * destination and its country comes from there (see `tour.country` below).
 */
export const HOME_COUNTRY = "Cambodia";

export const DESTINATIONS = [
  { id: "siem-reap", name: "Siem Reap", province: "Siem Reap" },
  { id: "phnom-penh", name: "Phnom Penh", province: "Phnom Penh" },
  { id: "kampot", name: "Kampot", province: "Kampot" },
  { id: "sihanoukville", name: "Sihanoukville", province: "Preah Sihanouk" },
  { id: "kep", name: "Kep", province: "Kep" },
  { id: "battambang", name: "Battambang", province: "Battambang" },
  { id: "bali", name: "Bali", province: "Bali", country: "Indonesia" },
  { id: "hanoi-ha-long", name: "Hanoi & Ha Long Bay", province: "Hanoi and Quảng Ninh", country: "Vietnam" },
  { id: "kyoto", name: "Kyoto", province: "Kyoto Prefecture", country: "Japan" },
].map((destination) => ({ country: HOME_COUNTRY, ...destination }));

export const CATEGORIES = [
  { id: "temples", name: "Temples & Heritage" },
  { id: "city", name: "City & Culture" },
  { id: "adventure", name: "Adventure & Nature" },
  { id: "island", name: "Island & Beach" },
  { id: "mountain", name: "Mountain & Hill Station" },
  { id: "food", name: "Food & Markets" },
  { id: "international", name: "International Escapes" },
];

export const GUIDES = [
  { id: "g-sokha", name: "Sokha Chhim" },
  { id: "g-dara", name: "Dara Meas" },
  { id: "g-vanna", name: "Vanna Kim" },
  { id: "g-sreyleak", name: "Sreyleak Phan" },
  { id: "g-piseth", name: "Piseth Nuon" },
  { id: "g-chenda", name: "Chenda Ly" },
].map((guide) => ({ ...guide, initials: initialsOf(guide.name) }));

export const TOURS = [
  { id: "angkor-sunrise", name: "Angkor Wat Sunrise Tour", destinationId: "siem-reap", categoryId: "temples", price: 85, capacity: 20, guideId: "g-sokha", image: coverOf("angkor-sunrise"), weight: 30 },
  { id: "phnom-penh-city", name: "Phnom Penh City Tour", destinationId: "phnom-penh", categoryId: "city", price: 45, capacity: 24, guideId: "g-dara", image: coverOf("phnom-penh-city"), weight: 21 },
  { id: "koh-rong", name: "Koh Rong Island", destinationId: "sihanoukville", categoryId: "island", price: 160, capacity: 18, guideId: "g-vanna", image: coverOf("koh-rong"), weight: 15 },
  { id: "kampot-adventure", name: "Kampot Adventure", destinationId: "kampot", categoryId: "adventure", price: 120, capacity: 16, guideId: "g-sreyleak", image: coverOf("kampot-adventure"), weight: 13 },
  { id: "kulen-mountain", name: "Kulen Mountain Tour", destinationId: "siem-reap", categoryId: "adventure", price: 95, capacity: 14, guideId: "g-piseth", image: coverOf("kulen-mountain"), weight: 12 },
  { id: "bokor-hill", name: "Bokor Hill Station", destinationId: "kampot", categoryId: "mountain", price: 70, capacity: 18, guideId: "g-chenda", image: coverOf("bokor-hill"), weight: 9 },
  // Added with the storefront (Phase 7). Bookings pick tours with one draw, so volumes are unchanged.
  { id: "tonle-sap-village", name: "Tonlé Sap Floating Village", destinationId: "siem-reap", categoryId: "city", price: 55, capacity: 16, guideId: "g-vanna", image: coverOf("tonle-sap-village"), weight: 7 },
  { id: "siem-reap-street-food", name: "Siem Reap Street Food Night", destinationId: "siem-reap", categoryId: "food", price: 35, capacity: 12, guideId: "g-dara", image: coverOf("siem-reap-street-food"), weight: 6 },
  { id: "kep-rabbit-island", name: "Kep Crab Market & Rabbit Island", destinationId: "kep", categoryId: "island", price: 75, capacity: 16, guideId: "g-sreyleak", image: coverOf("kep-rabbit-island"), weight: 5 },
  { id: "battambang-countryside", name: "Battambang Countryside & Bamboo Train", destinationId: "battambang", categoryId: "adventure", price: 65, capacity: 16, guideId: "g-chenda", image: coverOf("battambang-countryside"), weight: 4 },
  // International Escapes (new). Weight 0 keeps the generated booking history, dashboard and
  // reports exactly as before: these tours start with no past bookings and show as "New".
  { id: "bali-highlands", name: "Bali Highlands & Rice Terraces", destinationId: "bali", categoryId: "international", price: 890, capacity: 12, guideId: "g-vanna", image: coverOf("bali-highlands"), weight: 0 },
  { id: "hanoi-halong-bay", name: "Hanoi & Ha Long Bay Discovery", destinationId: "hanoi-ha-long", categoryId: "international", price: 640, capacity: 12, guideId: "g-dara", image: coverOf("hanoi-halong-bay"), weight: 0 },
  { id: "kyoto-temples-gardens", name: "Kyoto Temples & Gardens", destinationId: "kyoto", categoryId: "international", price: 1380, capacity: 12, guideId: "g-sokha", image: coverOf("kyoto-temples-gardens"), weight: 0 },
].map((tour) => {
  const destination = DESTINATIONS.find((item) => item.id === tour.destinationId);
  return { ...tour, destination: destination.name, country: destination.country };
});

const CUSTOMER_NAMES = [
  "Sophea Chan", "Dara Sok", "Sreymom Keo", "Vichea Pich", "Bopha Heng", "Ratha Sok", "Sreypov Nhem", "Kosal Chea",
  "Channary Lim", "Visal Ouk", "Monyrath Ek", "Pisey Touch", "Rithy Mao", "Sokunthea Yim", "Veasna Hout",
  "Maly Seng", "Chanthou Ros", "Sovann Tep", "Leakena Chhun", "Narith Ly",
  "Daniel Lee", "Maya Roberts", "Oliver Grant", "Yuki Tanaka", "Isabella Rossi", "Noah Martin", "Emma Schneider",
  "Lucas Dubois", "Mia Johansson", "Ethan Walker", "Chloe Nguyen", "Liam O'Connor", "Hana Kim", "Mateo García",
  "Ava Thompson", "Jonas Weber", "Priya Sharma", "Wei Zhang", "Sofia Costa", "James Wilson",
];

const EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com", "proton.me"];
const FOREIGN = [
  ["+61", "Australia"],
  ["+44", "United Kingdom"],
  ["+1", "United States"],
  ["+81", "Japan"],
  ["+49", "Germany"],
  ["+33", "France"],
  ["+65", "Singapore"],
];

const KHMER_FIRST = ["Sophea", "Dara", "Sreymom", "Vichea", "Bopha", "Ratha", "Sreypov", "Kosal", "Channary", "Visal", "Monyrath", "Pisey", "Rithy", "Sokunthea", "Veasna", "Maly", "Chanthou", "Sovann", "Leakena", "Narith", "Sokha", "Vanna", "Piseth", "Chenda", "Sophal", "Kanha", "Thida", "Rotha", "Makara", "Seyha"];
const KHMER_LAST = ["Chan", "Sok", "Keo", "Pich", "Heng", "Nhem", "Chea", "Lim", "Ouk", "Ek", "Touch", "Mao", "Yim", "Hout", "Seng", "Ros", "Tep", "Chhun", "Ly", "Meas", "Kim", "Phan", "Nuon", "Sam", "Prak", "Vong"];
const INTL_FIRST = ["Daniel", "Maya", "Oliver", "Yuki", "Isabella", "Noah", "Emma", "Lucas", "Mia", "Ethan", "Chloe", "Liam", "Hana", "Mateo", "Ava", "Jonas", "Priya", "Wei", "Sofia", "James", "Lena", "Tom", "Aiko", "Marco", "Clara", "Ben", "Nora", "Felix", "Zoe", "Ravi"];
const INTL_LAST = ["Lee", "Roberts", "Grant", "Tanaka", "Rossi", "Martin", "Schneider", "Dubois", "Johansson", "Walker", "Nguyen", "O'Connor", "Park", "García", "Thompson", "Weber", "Sharma", "Zhang", "Costa", "Wilson", "Müller", "Brown", "Sato", "Bianchi", "Fischer", "Taylor", "Silva", "Chen", "Patel", "Moreau"];

/** Customer n (1-based): the first 40 are the named core members, the rest come from name pools. */
function customerIdentity(n) {
  if (n <= CUSTOMER_NAMES.length) return { name: CUSTOMER_NAMES[n - 1], khmer: n <= 20 };
  const rng = mulberry32(hashString(`customer:${n}`));
  const khmer = rng() < 0.5;
  const pick = (list) => list[Math.floor(rng() * list.length)];
  return { name: khmer ? `${pick(KHMER_FIRST)} ${pick(KHMER_LAST)}` : `${pick(INTL_FIRST)} ${pick(INTL_LAST)}`, khmer };
}

/** Deterministic contact details: Khmer names get Cambodian numbers, others an international prefix. */
function contactFor(n, name, khmer, usedEmails) {
  const rng = mulberry32(hashString(`contact:${n}`));
  const slug = name.toLowerCase().normalize("NFD").replace(/[^a-z\s]/g, "").trim().replace(/\s+/g, ".");
  const digits = (length) => Array.from({ length }, () => Math.floor(rng() * 10)).join("");
  const [prefix, country] = FOREIGN[Math.floor(rng() * FOREIGN.length)];
  const domain = EMAIL_DOMAINS[Math.floor(rng() * EMAIL_DOMAINS.length)];
  let email = `${slug}@${domain}`;
  if (usedEmails.has(email)) email = `${slug}${n % 1000}@${domain}`;
  usedEmails.add(email);
  return {
    email,
    phone: khmer
      ? `+855 ${["12", "17", "77", "89", "96"][Math.floor(rng() * 5)]} ${digits(3)} ${digits(3)}`
      : `${prefix} ${digits(3)} ${digits(3)} ${digits(3)}`,
    country: khmer ? "Cambodia" : country,
  };
}

/**
 * The customer directory follows the same signup series as the "Total Customers" KPI:
 * BASE_CUSTOMERS members from before the history window, then each day's signups.
 * Returned oldest first.
 */
function buildCustomers(today, signups) {
  const usedEmails = new Set();
  const customers = [];
  const add = (joinedAt) => {
    const n = customers.length + 1;
    const { name, khmer } = customerIdentity(n);
    customers.push({
      id: `c-${String(n).padStart(4, "0")}`,
      name,
      initials: initialsOf(name),
      ...contactFor(n, name, khmer, usedEmails),
      joinedAt,
      status: n % 9 === 0 ? "Inactive" : "Active",
    });
  };
  const historyStart = addDays(today, -HISTORY_DAYS);
  for (let index = 0; index < BASE_CUSTOMERS; index += 1) {
    add(toKey(addDays(historyStart, -(BASE_CUSTOMERS - index))));
  }
  for (const [key, count] of signups) {
    for (let index = 0; index < count; index += 1) add(key);
  }
  return customers;
}

/**
 * One draw picks the customer: a quarter of bookings come from people who joined in the last
 * 60 days, the rest from everyone who had joined by then, so most people book a few times.
 */
function pickCustomer(u, customers, joinedCount, recentStart) {
  if (u < 0.25 && joinedCount > recentStart) {
    return customers[recentStart + Math.floor((u / 0.25) * (joinedCount - recentStart))];
  }
  return customers[Math.floor(((u - 0.25) / 0.75) * joinedCount)] ?? customers[joinedCount - 1];
}

const SPECIAL_REQUESTS = [
  "Vegetarian lunch for two guests, please.",
  "Hotel pickup from Old Market area.",
  "Celebrating an anniversary — a quiet table at lunch would be lovely.",
  "One traveller uses a walking stick; slower pace preferred.",
  "Child seat needed in the van.",
  "Please arrange an English and French speaking guide if possible.",
  "Late check-out at hotel requested after the tour.",
];

/** Adults pay the tour price, children (5–11) 60%, infants free — as on the booking review step. */
export const childPriceOf = (tour) => Math.round(tour.price * 0.6);

function historyFor(booking, rng, now) {
  const created = new Date(booking.createdAt).getTime();
  const clamp = (time) => new Date(Math.min(time, now.getTime())).toISOString();
  const hours = (count) => count * 3_600_000;
  const travelEvening = new Date(`${booking.travelDate}T18:00:00`).getTime();
  const history = [{ id: `${booking.id}-h0`, kind: "status", status: "Pending", at: booking.createdAt, by: "Customer", note: "Booking request submitted online" }];
  const confirmAt = created + hours(1 + Math.floor(rng() * 18));

  if (booking.status === "Confirmed" || booking.status === "Completed" || (booking.status === "Cancelled" && booking.cancelReason !== REJECT_REASON)) {
    history.push({ id: `${booking.id}-h1`, kind: "status", status: "Confirmed", at: clamp(confirmAt), by: "Admin", note: null });
  }
  if (booking.paymentStatus === "Paid" || booking.paymentStatus === "Refunded") {
    const paidAt = booking.paymentMethod === "Cash" ? travelEvening - hours(10) : created + hours(0.25);
    history.push({ id: `${booking.id}-p1`, kind: "payment", status: "Paid", at: clamp(paidAt), by: booking.paymentMethod === "Cash" ? "Guide" : "Customer", note: booking.paymentMethod });
  }
  if (booking.status === "Completed") {
    history.push({ id: `${booking.id}-h2`, kind: "status", status: "Completed", at: clamp(travelEvening), by: "System", note: "Tour finished" });
  }
  if (booking.status === "Cancelled") {
    const byAdmin = booking.cancelReason === REJECT_REASON;
    history.push({ id: `${booking.id}-h2`, kind: "status", status: "Cancelled", at: clamp(confirmAt + hours(byAdmin ? 0 : 30)), by: byAdmin ? "Admin" : "Customer", note: booking.cancelReason });
  }
  if (booking.paymentStatus === "Refunded") {
    history.push({ id: `${booking.id}-p2`, kind: "payment", status: "Refunded", at: clamp(confirmAt + hours(54)), by: "Admin", note: "Refund issued" });
  }
  return history.sort((a, b) => a.at.localeCompare(b.at));
}

/**
 * Traveller mix, price breakdown, requests and history. Uses its own PRNG per booking id,
 * so adding detail never shifts the dashboard's generated volumes.
 */
function enrichBooking(booking, tour, customer, now) {
  const rng = mulberry32(hashString(`detail:${booking.id}`));
  const children = booking.guests > 1 && rng() < 0.35 ? 1 + Math.floor(rng() * Math.min(2, booking.guests - 1)) : 0;
  const adults = booking.guests - children;
  const infants = rng() < 0.08 ? 1 : 0;
  const unitPrice = tour.price;
  const childPrice = childPriceOf(tour);
  const subtotal = adults * unitPrice + children * childPrice;
  const discount = rng() < 0.15 ? Math.round(subtotal * 0.1) : 0;

  Object.assign(booking, {
    adults,
    children,
    infants,
    unitPrice,
    childPrice,
    subtotal,
    discount,
    discountLabel: discount ? "Early bird 10%" : null,
    amount: subtotal - discount,
    contactEmail: customer.email,
    contactPhone: customer.phone,
    specialRequests: rng() < 0.22 ? SPECIAL_REQUESTS[Math.floor(rng() * SPECIAL_REQUESTS.length)] : "",
    departureTime: tour.id === "angkor-sunrise" ? "05:00" : ["07:00", "07:30", "08:00", "08:30"][Math.floor(rng() * 4)],
  });
  booking.statusHistory = historyFor(booking, rng, now);
}

/* --------------------------------------------------------------- volume */

const BASE_CUSTOMERS = 640;
const SEASON = [1.35, 1.3, 1.15, 1.05, 0.85, 0.75, 0.8, 0.85, 0.8, 0.95, 1.2, 1.4];
const HISTORY_DAYS = 800;

/** Business grows ~28% a year; high season runs November to March. */
function dailyDemand(date, daysAgo) {
  const trend = 1 / (1 + (daysAgo / 365) * 0.28);
  const weekend = date.getDay() === 0 || date.getDay() === 6 ? 1.15 : 0.95;
  return 5 * SEASON[date.getMonth()] * trend * weekend;
}

function statusFor(rng, booking, today) {
  const travel = fromKey(booking.travelDate);
  const bookedDaysAgo = Math.round((today - fromKey(booking.bookingDate)) / DAY);

  if (travel < today) return rng() < 0.9 ? { status: "Completed" } : { status: "Cancelled", reason: "Customer request" };
  if (bookedDaysAgo <= 3 && rng() < 0.55) return { status: "Pending" };
  const roll = rng();
  if (roll < 0.84) return { status: "Confirmed" };
  if (roll < 0.9) return { status: "Pending" };
  return { status: "Cancelled", reason: roll < 0.95 ? REJECT_REASON : "Customer request" };
}

/** Cash is collected on the tour day; online methods are paid at booking time. */
function paymentFor(rng, booking) {
  const method = pickWeighted(rng, PAYMENT_METHODS, (item) => ({ Cash: 20, "Bank Transfer": 24, "ABA Pay (Simulation)": 38 })[item] ?? 18);
  const cash = method === "Cash";
  const paid = (paidDate) => ({ paymentStatus: "Paid", paymentMethod: method, paidDate });
  const unpaid = { paymentStatus: "Unpaid", paymentMethod: method, paidDate: null };

  if (booking.status === "Completed") return paid(cash ? booking.travelDate : booking.bookingDate);
  if (booking.status === "Confirmed") return !cash && rng() < 0.92 ? paid(booking.bookingDate) : unpaid;
  if (booking.status === "Cancelled") return !cash && rng() < 0.5 ? { paymentStatus: "Refunded", paymentMethod: method, paidDate: null } : unpaid;
  return unpaid;
}

function bookingsForDay(date, daysAgo, today, now, pool) {
  const key = toKey(date);
  const rng = mulberry32(hashString(`bookings:${key}`));
  const count = Math.min(9, poisson(rng, dailyDemand(date, daysAgo)));
  const bookings = [];

  for (let index = 0; index < count; index += 1) {
    const tour = pickWeighted(rng, TOURS);
    const customer = pickCustomer(rng(), pool.customers, pool.joinedCount, pool.recentStart);
    const guests = 1 + Math.floor(rng() * rng() * 6);
    const createdAt = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 7 + Math.floor(rng() * 15), Math.floor(rng() * 60));
    const booking = {
      id: `TT-${dayNumber(date) * 10 + index}`,
      customerId: customer.id,
      customerName: customer.name,
      initials: customer.initials,
      tourId: tour.id,
      tourPackage: tour.name,
      destination: tour.destination,
      bookingDate: key,
      travelDate: toKey(addDays(date, 2 + Math.floor(rng() * 40))),
      guests,
      amount: tour.price * guests,
      createdAt: createdAt.toISOString(),
    };
    const { status, reason } = statusFor(rng, booking, today);
    Object.assign(booking, { status, cancelReason: reason ?? null });
    Object.assign(booking, paymentFor(rng, booking));
    if (createdAt <= now) {
      enrichBooking(booking, tour, customer, now);
      bookings.push(booking);
    }
  }
  return bookings;
}

function signupsForDay(date, daysAgo) {
  const rng = mulberry32(hashString(`signups:${toKey(date)}`));
  return poisson(rng, 1.4 * SEASON[date.getMonth()] / (1 + (daysAgo / 365) * 0.28));
}

/* ------------------------------------------------------- demo traveller */

/**
 * The storefront's demo customer (customer@tourtrip.com in CustomerAuthContext) with a small
 * trip history, so My Bookings has something in every tab: two completed trips (reviewable),
 * a cancelled one, a paid upcoming trip and one awaiting payment. Ids use slot 9 of their
 * booking day, which the daily generator never reaches (at most nine bookings, slots 0–8).
 */
export const DEMO_TRAVELLER = { name: "Sophea Meas", email: "customer@tourtrip.com", phone: "+855 12 345 678" };

const DEMO_TRIPS = [
  { tourId: "angkor-sunrise", bookedDaysAgo: 62, travelIn: -48, adults: 2, children: 0, status: "Completed", paymentStatus: "Paid", paymentMethod: "ABA Pay (Simulation)" },
  { tourId: "phnom-penh-city", bookedDaysAgo: 130, travelIn: -118, adults: 1, children: 1, status: "Completed", paymentStatus: "Paid", paymentMethod: "Cash" },
  { tourId: "bokor-hill", bookedDaysAgo: 40, travelIn: -25, adults: 2, children: 0, status: "Cancelled", paymentStatus: "Unpaid", paymentMethod: "Bank Transfer", cancelReason: "Change of plans" },
  { tourId: "koh-rong", bookedDaysAgo: 6, travelIn: 20, adults: 2, children: 0, status: "Confirmed", paymentStatus: "Paid", paymentMethod: "Credit Card (Simulation)", time: "09:00", specialRequests: "We'd love a snorkelling stop if the sea is calm." },
  { tourId: "kulen-mountain", bookedDaysAgo: 1, travelIn: 18, adults: 2, children: 1, status: "Pending", paymentStatus: "Unpaid", paymentMethod: "Bank Transfer", time: "07:30" },
];

function seedDemoTraveller(today, now, customers, bookings) {
  const n = customers.length + 1;
  const customer = {
    id: `c-${String(n).padStart(4, "0")}`,
    name: DEMO_TRAVELLER.name,
    initials: initialsOf(DEMO_TRAVELLER.name),
    email: DEMO_TRAVELLER.email,
    phone: DEMO_TRAVELLER.phone,
    country: "Cambodia",
    joinedAt: toKey(addDays(today, -150)),
    status: "Active",
  };
  customers.push(customer);

  for (const trip of DEMO_TRIPS) {
    const tour = TOURS.find((item) => item.id === trip.tourId);
    const booked = addDays(today, -trip.bookedDaysAgo);
    const travelDate = toKey(addDays(today, trip.travelIn));
    const guests = trip.adults + trip.children;
    const amount = tour.price * guests;
    const online = trip.paymentMethod !== "Cash";
    const booking = {
      id: `TT-${dayNumber(booked) * 10 + 9}`,
      customerId: customer.id,
      customerName: customer.name,
      initials: customer.initials,
      tourId: tour.id,
      tourPackage: tour.name,
      destination: tour.destination,
      bookingDate: toKey(booked),
      travelDate,
      guests,
      createdAt: new Date(booked.getFullYear(), booked.getMonth(), booked.getDate(), 20, 15).toISOString(),
      status: trip.status,
      cancelReason: trip.cancelReason ?? null,
      paymentStatus: trip.paymentStatus,
      paymentMethod: trip.paymentMethod,
      paidDate: trip.paymentStatus === "Paid" ? (online ? toKey(booked) : travelDate) : null,
      // Storefront pricing: every traveller pays the per-person price (see the FAQ).
      adults: trip.adults,
      children: trip.children,
      infants: 0,
      unitPrice: tour.price,
      childPrice: tour.price,
      subtotal: amount,
      discount: 0,
      discountLabel: null,
      amount,
      contactName: customer.name,
      contactEmail: customer.email,
      contactPhone: customer.phone,
      specialRequests: trip.specialRequests ?? "",
      departureTime: trip.time ?? (tour.id === "angkor-sunrise" ? "05:00" : "08:00"),
      source: "storefront",
    };
    booking.statusHistory = historyFor(booking, mulberry32(hashString(`demo:${booking.id}`)), now);
    bookings.push(booking);
  }
}

/* ------------------------------------------------------------ generation */

function generate(now = new Date()) {
  const today = startOfDay(now);
  const bookings = [];
  const signups = new Map();

  for (let daysAgo = HISTORY_DAYS; daysAgo >= 0; daysAgo -= 1) {
    const date = addDays(today, -daysAgo);
    signups.set(toKey(date), signupsForDay(date, daysAgo));
  }
  const customers = buildCustomers(today, signups);

  let joinedCount = 0;
  let recentStart = 0;
  for (let daysAgo = HISTORY_DAYS; daysAgo >= 0; daysAgo -= 1) {
    const date = addDays(today, -daysAgo);
    const key = toKey(date);
    const recentKey = toKey(addDays(date, -60));
    while (joinedCount < customers.length && customers[joinedCount].joinedAt <= key) joinedCount += 1;
    while (recentStart < joinedCount && customers[recentStart].joinedAt < recentKey) recentStart += 1;
    bookings.push(...bookingsForDay(date, daysAgo, today, now, { customers, joinedCount, recentStart }));
  }
  seedDemoTraveller(today, now, customers, bookings);
  bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  // Newest members first in the directory.
  customers.reverse();

  const at = (days, hours = 0) => new Date(now.getTime() - days * DAY - hours * 3_600_000).toISOString();

  const schedules = [
    { tourId: "angkor-sunrise", inDays: 1, time: "05:00", seatsBooked: 18 },
    { tourId: "kulen-mountain", inDays: 2, time: "07:30", seatsBooked: 14 },
    { tourId: "phnom-penh-city", inDays: 3, time: "08:30", seatsBooked: 11 },
    { tourId: "koh-rong", inDays: 4, time: "09:00", seatsBooked: 12 },
    { tourId: "bokor-hill", inDays: 6, time: "08:00", seatsBooked: 15 },
    { tourId: "kampot-adventure", inDays: 8, time: "07:00", seatsBooked: 6 },
    { tourId: "angkor-sunrise", inDays: 9, time: "05:00", seatsBooked: 9 },
    { tourId: "tonle-sap-village", inDays: 5, time: "08:00", seatsBooked: 8 },
    { tourId: "siem-reap-street-food", inDays: 7, time: "17:30", seatsBooked: 5 },
    { tourId: "kep-rabbit-island", inDays: 10, time: "07:00", seatsBooked: 7 },
    { tourId: "battambang-countryside", inDays: 11, time: "08:00", seatsBooked: 6 },
    { tourId: "koh-rong", inDays: 14, time: "09:00", seatsBooked: 18 },
    { tourId: "koh-rong", inDays: 20, time: "09:00", seatsBooked: 4 },
    { tourId: "kulen-mountain", inDays: 18, time: "07:30", seatsBooked: 4 },
    { tourId: "hanoi-halong-bay", inDays: 16, time: "08:00", seatsBooked: 5 },
    { tourId: "bali-highlands", inDays: 23, time: "09:00", seatsBooked: 7 },
    { tourId: "kyoto-temples-gardens", inDays: 30, time: "10:00", seatsBooked: 3 },
    { tourId: "hanoi-halong-bay", inDays: 37, time: "08:00", seatsBooked: 0 },
    { tourId: "bali-highlands", inDays: 44, time: "09:00", seatsBooked: 2 },
    { tourId: "kyoto-temples-gardens", inDays: 58, time: "10:00", seatsBooked: 0 },
  ].map((item, index) => {
    const tour = TOURS.find((entry) => entry.id === item.tourId);
    return {
      id: `sch-${index + 1}`,
      tourId: tour.id,
      tourName: tour.name,
      destination: tour.destination,
      image: tour.image,
      date: toKey(addDays(today, item.inDays)),
      time: item.time,
      seatsBooked: item.seatsBooked,
      capacity: tour.capacity,
      guide: GUIDES.find((guide) => guide.id === tour.guideId),
    };
  });

  const reviews = [
    { id: "rv-1", customerName: "Emma Schneider", tourName: "Angkor Wat Sunrise Tour", rating: 5, excerpt: "Watching the sun rise over the towers was unforgettable. Sokha knew every carving.", createdAt: at(0, 2) },
    { id: "rv-2", customerName: "Dara Sok", tourName: "Koh Rong Island", rating: 4, excerpt: "Beautiful beaches and a smooth ferry. Lunch could have been earlier.", createdAt: at(0, 9) },
    { id: "rv-3", customerName: "Hana Kim", tourName: "Kampot Adventure", rating: 5, excerpt: "Kayaking at golden hour and the pepper farm visit were the highlights.", createdAt: at(1, 3) },
    { id: "rv-4", customerName: "Lucas Dubois", tourName: "Phnom Penh City Tour", rating: 3, excerpt: "Great guide, but the tuk-tuk pickup was 30 minutes late.", createdAt: at(2, 5) },
  ].map((review) => ({ ...review, status: "Awaiting approval", initials: initialsOf(review.customerName) }));

  return { today, bookings, customers, signups, schedules, reviews, events: [] };
}

/** Mutable in-memory store shared by the dashboard and shell APIs for the session. */
export const dashboardDb = generate();

/* ---------------------------------------------------------------- ranges */

export const RANGES = ["7D", "30D", "90D", "12M"];

/** Deterministic five-day weighted average for display-only daily income trends. */
export function smoothDailyRevenue(values) {
  const weights = [1, 2, 3, 2, 1];
  return values.map((_, index) => {
    const weighted = weights.reduce((sum, weight, offset) => {
      const sample = values[Math.max(0, Math.min(values.length - 1, index + offset - 2))];
      return sum + sample * weight;
    }, 0);
    return Math.round(weighted / 9);
  });
}

const dayLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const weekdayLabel = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const monthLabel = new Intl.DateTimeFormat("en-US", { month: "short" });
const monthYearLabel = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

/**
 * Buckets for a range: 7D and 30D are daily, 90D weekly (13 weeks), 12M monthly.
 * `previous` holds the matching buckets of the preceding period; for 12M the
 * current, partial month is compared with the same days a year earlier.
 */
export function buildRange(range, today = dashboardDb.today) {
  const buckets = [];

  if (range === "7D" || range === "30D") {
    const days = range === "7D" ? 7 : 30;
    for (let index = days - 1; index >= 0; index -= 1) {
      const start = addDays(today, -index);
      buckets.push({
        start,
        end: start,
        label: range === "7D" ? weekdayLabel.format(start) : dayLabel.format(start),
        title: dayLabel.format(start),
        previous: { start: addDays(start, -days), end: addDays(start, -days) },
      });
    }
  } else if (range === "90D") {
    for (let index = 12; index >= 0; index -= 1) {
      const end = addDays(today, -index * 7);
      const start = addDays(end, -6);
      buckets.push({
        start,
        end,
        label: dayLabel.format(start),
        title: `Week of ${dayLabel.format(start)}`,
        previous: { start: addDays(start, -91), end: addDays(end, -91) },
      });
    }
  } else {
    for (let index = 11; index >= 0; index -= 1) {
      const start = new Date(today.getFullYear(), today.getMonth() - index, 1);
      const end = index === 0 ? today : new Date(start.getFullYear(), start.getMonth() + 1, 0);
      buckets.push({
        start,
        end,
        label: monthLabel.format(start),
        title: monthYearLabel.format(start),
        previous: { start: addMonths(start, -12), end: addMonths(end, -12) },
      });
    }
  }
  return buckets;
}

/** First day with generated bookings. */
export const historyStart = () => addDays(dashboardDb.today, -HISTORY_DAYS);

/**
 * Twelve calendar-month buckets for `year`. Months outside the generated history (before it
 * starts or after today) are flagged `covered: false` so reports can show a gap, not a zero.
 */
export function buildYear(year, today = dashboardDb.today) {
  const first = historyStart();
  return Array.from({ length: 12 }, (_, month) => {
    const start = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const end = monthEnd > today ? today : monthEnd;
    return {
      start,
      end,
      label: monthLabel.format(start),
      title: monthYearLabel.format(start),
      covered: start <= today && monthEnd >= first,
      partial: monthEnd > today || start < first,
    };
  });
}

/* ------------------------------------------------------------ aggregates */

function eachDayKey(start, end, callback) {
  for (let date = start; date <= end; date = addDays(date, 1)) callback(toKey(date));
}

let indexCache = null;

/** Bookings grouped by booking day and by travel day. Rebuilt after mutations. */
function getIndex() {
  if (indexCache) return indexCache;
  const byBookingDay = new Map();
  const byTravelDay = new Map();
  const byPaidDay = new Map();
  for (const booking of dashboardDb.bookings) {
    if (booking.paidDate) {
      if (!byPaidDay.has(booking.paidDate)) byPaidDay.set(booking.paidDate, []);
      byPaidDay.get(booking.paidDate).push(booking);
    }
    if (!byBookingDay.has(booking.bookingDate)) byBookingDay.set(booking.bookingDate, []);
    byBookingDay.get(booking.bookingDate).push(booking);
    if (!byTravelDay.has(booking.travelDate)) byTravelDay.set(booking.travelDate, []);
    byTravelDay.get(booking.travelDate).push(booking);
  }
  indexCache = { byBookingDay, byTravelDay, byPaidDay };
  return indexCache;
}

export function invalidateIndex() {
  indexCache = null;
}

export function bookingsBetween(start, end) {
  const { byBookingDay } = getIndex();
  const result = [];
  eachDayKey(start, end, (key) => result.push(...(byBookingDay.get(key) ?? [])));
  return result;
}

/** Payments received in the window (by payment day), optionally filtered. */
export function paymentsBetween(start, end) {
  const { byPaidDay } = getIndex();
  const clippedEnd = end > dashboardDb.today ? dashboardDb.today : end;
  const result = [];
  eachDayKey(start, clippedEnd, (key) => result.push(...(byPaidDay.get(key) ?? [])));
  return result;
}

export const incomeBetween = (start, end) => paymentsBetween(start, end).reduce((sum, booking) => sum + booking.amount, 0);

/** Tour departures that ran in the window: distinct tour + travel date with a non-cancelled booking. */
export function departuresBetween(start, end) {
  const { byTravelDay } = getIndex();
  const clippedEnd = end > dashboardDb.today ? dashboardDb.today : end;
  const departures = new Set();
  eachDayKey(start, clippedEnd, (key) => {
    for (const booking of byTravelDay.get(key) ?? []) {
      if (booking.status !== "Cancelled") departures.add(`${booking.tourId}|${key}`);
    }
  });
  return departures.size;
}


/** Registered customers at the end of `date`, counted from the customer directory itself. */
export function customersAt(date) {
  const target = toKey(date);
  let total = 0;
  for (const customer of dashboardDb.customers) if (customer.joinedAt <= target) total += 1;
  return total;
}

export const incomeOf = (bookings) =>
  bookings.reduce((sum, booking) => (booking.paymentStatus === "Paid" ? sum + booking.amount : sum), 0);

export function summarize(start, end) {
  const bookings = bookingsBetween(start, end);
  return {
    income: incomeBetween(start, end),
    bookings: bookings.length,
    tours: departuresBetween(start, end),
    customers: customersAt(end),
    byStatus: Object.fromEntries(BOOKING_STATUSES.map((status) => [status, bookings.filter((item) => item.status === status).length])),
  };
}

/* ------------------------------------------------- storefront persistence */

/**
 * Bookings made on the storefront (and the demo traveller's trips) are saved to localStorage
 * after every change, by the customer or by an admin, and replayed over the generated data on
 * load. That is what lets a booking made in one tab show up in the admin Bookings page of
 * another. Checkout bookings also hold seats on their departure until they are cancelled.
 */
const holdsSeats = (booking) => Boolean(booking?.holdsSeats) && booking.status !== "Cancelled";

function adjustSeats(booking, heldBefore) {
  const delta = Number(holdsSeats(booking)) - Number(heldBefore);
  if (!delta) return;
  const schedule = dashboardDb.schedules.find((item) => item.tourId === booking.tourId && item.date === booking.travelDate);
  if (schedule) schedule.seatsBooked = Math.max(0, schedule.seatsBooked + delta * (booking.adults + booking.children));
}

export const isStorefrontBooking = (booking) => booking?.source === "storefront";

/**
 * Call after any change to a storefront booking. `previousStatus` is its status before the
 * change (`null` for a new booking) so departures gain or release seats correctly.
 */
export function saveStorefrontBooking(booking, previousStatus) {
  if (!isStorefrontBooking(booking)) return;
  adjustSeats(booking, previousStatus !== null && booking.holdsSeats && previousStatus !== "Cancelled");
  const stored = readJson(MOCK_KEYS.bookings, {});
  stored[booking.id] = booking;
  writeJson(MOCK_KEYS.bookings, stored);
  invalidateIndex();
}

function applyStoredBookings(stored) {
  if (!stored || typeof stored !== "object") return;
  for (const record of Object.values(stored)) {
    if (!record?.id || !TOURS.some((tour) => tour.id === record.tourId)) continue;
    const existing = dashboardDb.bookings.find((item) => item.id === record.id);
    const heldBefore = holdsSeats(existing);
    if (existing) Object.assign(existing, record);
    else dashboardDb.bookings.push(record);
    adjustSeats(existing ?? record, heldBefore);
  }
  dashboardDb.bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  invalidateIndex();
}

applyStoredBookings(readJson(MOCK_KEYS.bookings, {}));
onStoredChange(MOCK_KEYS.bookings, "bookings", applyStoredBookings);
