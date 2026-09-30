import apiClient from "../../lib/axios";
import {
  PAYMENT_METHODS,
  REJECT_REASON,
  TOURS,
  dashboardDb,
  invalidateIndex,
  saveStorefrontBooking,
  toKey,
} from "../../mocks/dashboard";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/**
 * Every write below mutates `dashboardDb.bookings`, the one mock booking store shared by the
 * dashboard widgets, the sidebar badge, the Bookings page and customer totals.
 */
export async function getBookings() {
  if (!useMock) return apiClient.get("/admin/bookings").then(({ data }) => data);
  await wait(300);
  return dashboardDb.bookings.map(cloneBooking);
}

const tourImage = (tourId) => TOURS.find((tour) => tour.id === tourId)?.image ?? null;

const cloneBooking = (booking) => ({
  ...booking,
  tourImage: tourImage(booking.tourId),
  statusHistory: booking.statusHistory.map((entry) => ({ ...entry })),
});

function findBooking(id) {
  const booking = dashboardDb.bookings.find((item) => item.id === id);
  if (!booking) throw new Error(`Booking ${id} was not found`);
  return booking;
}

/** Fields an action may change; restoring them undoes the action exactly. */
const snapshotOf = (booking) => ({
  status: booking.status,
  cancelReason: booking.cancelReason,
  paymentStatus: booking.paymentStatus,
  paymentMethod: booking.paymentMethod,
  paidDate: booking.paidDate,
  statusHistory: booking.statusHistory.map((entry) => ({ ...entry })),
});

/**
 * Allowed transitions. Reject and Cancel both end in `Cancelled`; Reject always keeps the
 * domain reason "Rejected by admin", optionally followed by the admin's note.
 */
export const STATUS_ACTIONS = {
  confirm: { from: ["Pending"], to: "Confirmed", label: "Confirmed", event: "confirmed", title: "Booking confirmed" },
  reject: { from: ["Pending"], to: "Cancelled", label: "Rejected", event: "cancellation", title: "Booking rejected" },
  complete: { from: ["Confirmed"], to: "Completed", label: "Completed", event: "confirmed", title: "Booking completed" },
  cancel: { from: ["Confirmed"], to: "Cancelled", label: "Cancelled", event: "cancellation", title: "Booking cancelled" },
};

function reasonFor(action, reason) {
  const note = reason?.trim();
  if (action === "reject") return note ? `${REJECT_REASON}: ${note}` : REJECT_REASON;
  if (action === "cancel") {
    if (!note) throw new Error("A cancellation reason is required");
    return note;
  }
  return null;
}

function applyStatus(booking, action, reason) {
  const rule = STATUS_ACTIONS[action];
  if (!rule) throw new Error("Unknown booking action");
  if (!rule.from.includes(booking.status)) throw new Error(`Booking ${booking.id} is already ${booking.status.toLowerCase()}`);

  const cancelReason = rule.to === "Cancelled" ? reasonFor(action, reason) : null;
  const at = new Date().toISOString();
  Object.assign(booking, { status: rule.to, cancelReason });
  booking.statusHistory.push({ id: `${booking.id}-${action}-${Date.now()}`, kind: "status", status: rule.to, at, by: "Admin", note: cancelReason });

  const eventId = `${rule.event}-${booking.id}-${Date.now()}`;
  dashboardDb.events.unshift({ id: eventId, type: rule.event, title: rule.title, detail: `${booking.id} · ${booking.customerName}`, at });
  return eventId;
}

/** Status change for one booking: `confirm | reject | complete | cancel`. */
export async function updateBookingStatus({ id, action, reason }) {
  if (!useMock) return apiClient.post(`/admin/bookings/${id}/${action}`, { reason }).then(({ data }) => data);
  await wait(350);

  const booking = findBooking(id);
  const snapshot = snapshotOf(booking);
  const eventId = applyStatus(booking, action, reason);
  saveStorefrontBooking(booking, snapshot.status);
  invalidateIndex();
  return { booking: cloneBooking(booking), snapshot, eventId };
}

/** Dashboard shortcut kept for its quick Confirm / Reject buttons. */
export const decideBooking = ({ id, decision, reason }) => updateBookingStatus({ id, action: decision, reason });

/** Confirms several pending bookings at once; non-pending ids are skipped and reported. */
export async function bulkConfirmBookings(ids) {
  if (!useMock) return apiClient.post("/admin/bookings/bulk-confirm", { ids }).then(({ data }) => data);
  await wait(450);

  const confirmed = [];
  const skipped = [];
  for (const id of ids) {
    const booking = dashboardDb.bookings.find((item) => item.id === id);
    if (booking?.status !== "Pending") {
      skipped.push(id);
      continue;
    }
    const snapshot = snapshotOf(booking);
    const eventId = applyStatus(booking, "confirm");
    saveStorefrontBooking(booking, snapshot.status);
    confirmed.push({ id, snapshot, eventId });
  }
  invalidateIndex();
  return { confirmed, skipped };
}

/**
 * Payment status and/or method. Paid books income today; Refunded removes it from income
 * (the mock counts income on the day money is received, see AGENTS.md).
 */
export async function updateBookingPayment({ id, paymentStatus, paymentMethod }) {
  if (!useMock) return apiClient.patch(`/admin/bookings/${id}/payment`, { paymentStatus, paymentMethod }).then(({ data }) => data);
  await wait(300);

  const booking = findBooking(id);
  const snapshot = snapshotOf(booking);
  const at = new Date().toISOString();

  if (paymentMethod && paymentMethod !== booking.paymentMethod) {
    if (!PAYMENT_METHODS.includes(paymentMethod)) throw new Error("Unknown payment method");
    const note = booking.paymentMethod ? `${booking.paymentMethod} → ${paymentMethod}` : paymentMethod;
    booking.statusHistory.push({ id: `${id}-method-${Date.now()}`, kind: "payment", status: "Method changed", at, by: "Admin", note });
    booking.paymentMethod = paymentMethod;
  }

  let eventId = null;
  if (paymentStatus && paymentStatus !== booking.paymentStatus) {
    if (paymentStatus === "Paid" && booking.status === "Cancelled") throw new Error("A cancelled booking cannot be marked as paid");
    if (paymentStatus === "Refunded" && booking.paymentStatus !== "Paid") throw new Error("Only paid bookings can be refunded");
    booking.paymentStatus = paymentStatus;
    booking.paidDate = paymentStatus === "Paid" ? toKey(new Date()) : null;
    booking.statusHistory.push({ id: `${id}-pay-${Date.now()}`, kind: "payment", status: paymentStatus, at, by: "Admin", note: booking.paymentMethod });
    eventId = `payment-${id}-${Date.now()}`;
    dashboardDb.events.unshift({
      id: eventId,
      type: paymentStatus === "Paid" ? "payment" : "cancellation",
      title: paymentStatus === "Paid" ? "Payment received" : "Payment refunded",
      detail: `${id} · ${booking.paymentMethod}`,
      amount: booking.amount,
      at,
    });
  }
  saveStorefrontBooking(booking, snapshot.status);
  invalidateIndex();
  return { booking: cloneBooking(booking), snapshot, eventId };
}

/** Undo for any action above: puts the snapshot back and drops the activity event. */
export async function restoreBooking({ id, snapshot, eventId }) {
  if (!useMock) return apiClient.post(`/admin/bookings/${id}/restore`, snapshot).then(({ data }) => data);
  await wait(250);

  const booking = findBooking(id);
  const previousStatus = booking.status;
  Object.assign(booking, { ...snapshot, statusHistory: snapshot.statusHistory.map((entry) => ({ ...entry })) });
  saveStorefrontBooking(booking, previousStatus);
  dashboardDb.events = dashboardDb.events.filter((event) => event.id !== eventId);
  invalidateIndex();
  return { booking: cloneBooking(booking) };
}

/* ----------------------------------------------------------- customer side */

/**
 * Checkout and My Bookings write to the same `dashboardDb.bookings` records the admin reads,
 * so a booking made or cancelled here is immediately a row on /admin/bookings.
 * Domain rule: Cash and Bank Transfer stay Pending/Unpaid until an admin confirms them;
 * ABA Pay (Simulation) and Credit Card (Simulation) are processed instantly (Confirmed/Paid).
 */
export const ONLINE_METHODS = ["ABA Pay (Simulation)", "Credit Card (Simulation)"];
export const isOnlineMethod = (method) => ONLINE_METHODS.includes(method);
export const CUSTOMER_CANCELLABLE = ["Pending", "Confirmed"];

const sameEmail = (a, b) => String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();

/** The admin directory record for a signed-in customer, created on their first booking. */
function directoryCustomer(account) {
  const found = dashboardDb.customers.find((customer) => sameEmail(customer.email, account.email));
  if (found) return found;
  const number = dashboardDb.customers.reduce((max, customer) => Math.max(max, Number(customer.id.slice(2)) || 0), 0) + 1;
  const name = account.name.trim();
  const created = {
    id: `c-${String(number).padStart(4, "0")}`,
    name,
    initials: name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase(),
    email: account.email.trim().toLowerCase(),
    phone: "",
    country: "",
    joinedAt: toKey(new Date()),
    status: "Active",
  };
  dashboardDb.customers.unshift(created);
  return created;
}

function nextBookingId() {
  const highest = dashboardDb.bookings.reduce((max, booking) => Math.max(max, Number(booking.id.slice(3)) || 0), 0);
  return `TT-${highest + 1}`;
}

function findOwnBooking(id, email) {
  const booking = findBooking(id);
  const owner = dashboardDb.customers.find((customer) => customer.id === booking.customerId);
  if (!sameEmail(owner?.email, email)) throw new Error("This booking belongs to a different account");
  return booking;
}

/** Bookings of the signed-in customer (matched through their directory record), newest first. */
export async function getMyBookings(email) {
  if (!useMock) return apiClient.get("/customer/bookings").then(({ data }) => data);
  await wait(350);
  const customer = dashboardDb.customers.find((item) => sameEmail(item.email, email));
  if (!customer) return [];
  return dashboardDb.bookings.filter((booking) => booking.customerId === customer.id).map(cloneBooking);
}

/**
 * "Confirm booking" on the review step: the booking becomes real here as Pending/Unpaid with
 * no payment method yet. `account` is the signed-in customer; `contact` may differ from it.
 */
export async function createBooking({ account, tourId, scheduleId, adults, children, contact, specialRequests }) {
  if (!useMock) return apiClient.post("/customer/bookings", { tourId, scheduleId, adults, children, contact, specialRequests }).then(({ data }) => data);
  await wait(700);

  const tour = TOURS.find((item) => item.id === tourId && item.status !== "Inactive");
  if (!tour) throw new Error("This tour is no longer available");
  const schedule = dashboardDb.schedules.find((item) => item.id === scheduleId && item.tourId === tourId);
  if (!schedule || schedule.status === "Inactive") throw new Error("That departure is no longer available. Please pick another date.");
  const guests = adults + children;
  const left = Math.max(0, schedule.capacity - schedule.seatsBooked);
  if (left < guests) throw new Error(`Only ${left} seat${left === 1 ? "" : "s"} left on that departure. Please change the date or travellers.`);

  const customer = directoryCustomer(account);
  if (!customer.phone && contact.phone) customer.phone = contact.phone;
  const now = new Date();
  const unitPrice = schedule.priceOverride ?? tour.price;
  const amount = unitPrice * guests;
  const id = nextBookingId();
  const booking = {
    id,
    customerId: customer.id,
    customerName: contact.name,
    initials: customer.initials,
    tourId: tour.id,
    tourPackage: tour.name,
    destination: tour.destination,
    bookingDate: toKey(now),
    travelDate: schedule.date,
    guests,
    createdAt: now.toISOString(),
    status: "Pending",
    cancelReason: null,
    paymentStatus: "Unpaid",
    paymentMethod: null,
    paidDate: null,
    adults,
    children,
    infants: 0,
    unitPrice,
    // Storefront pricing: children pay the per-person price (FAQ, Tour Detail).
    childPrice: unitPrice,
    subtotal: amount,
    discount: 0,
    discountLabel: null,
    amount,
    contactName: contact.name,
    contactEmail: contact.email,
    contactPhone: contact.phone,
    specialRequests: specialRequests ?? "",
    departureTime: schedule.time,
    source: "storefront",
    holdsSeats: true,
    statusHistory: [{ id: `${id}-created`, kind: "status", status: "Pending", at: now.toISOString(), by: "Customer", note: "Booked online · payment method not chosen yet" }],
  };
  dashboardDb.bookings.unshift(booking);
  dashboardDb.events.unshift({ id: `booking-${id}`, type: "booking", title: "New booking", detail: `${id} · ${contact.name}`, amount, at: now.toISOString() });
  saveStorefrontBooking(booking, null);
  return cloneBooking(booking);
}

/**
 * Payment step. Offline methods record the choice and keep the booking Pending/Unpaid;
 * the two simulated online methods "process" for a moment, then confirm and mark it Paid.
 */
export async function payBooking({ id, email, method }) {
  if (!useMock) return apiClient.post(`/customer/bookings/${id}/payment`, { method }).then(({ data }) => data);
  if (!PAYMENT_METHODS.includes(method)) throw new Error("Choose a payment method");
  const online = isOnlineMethod(method);
  await wait(online ? 1700 : 600);

  const booking = findOwnBooking(id, email);
  if (booking.status !== "Pending" || booking.paymentStatus !== "Unpaid") throw new Error(`Booking ${id} is already ${booking.status.toLowerCase()}`);
  const previousStatus = booking.status;
  const at = new Date().toISOString();
  booking.paymentMethod = method;

  if (online) {
    Object.assign(booking, { status: "Confirmed", paymentStatus: "Paid", paidDate: toKey(new Date()) });
    booking.statusHistory.push(
      { id: `${id}-pay-${Date.now()}`, kind: "payment", status: "Paid", at, by: "Customer", note: method },
      { id: `${id}-confirm-${Date.now()}`, kind: "status", status: "Confirmed", at, by: "System", note: "Confirmed automatically after online payment" },
    );
    dashboardDb.events.unshift({ id: `payment-${id}-${Date.now()}`, type: "payment", title: "Payment received", detail: `${id} · ${method}`, amount: booking.amount, at });
  } else {
    booking.statusHistory.push({
      id: `${id}-method-${Date.now()}`,
      kind: "payment",
      status: "Method chosen",
      at,
      by: "Customer",
      note: method === "Cash" ? "Cash on the tour day · awaiting admin confirmation" : "Bank Transfer · awaiting transfer and admin confirmation",
    });
  }
  saveStorefrontBooking(booking, previousStatus);
  return cloneBooking(booking);
}

/**
 * Customer cancellation (Pending or Confirmed only). A paid booking is refunded to the
 * original method; an unpaid one is simply cancelled.
 */
export async function cancelMyBooking({ id, email, reason }) {
  if (!useMock) return apiClient.post(`/customer/bookings/${id}/cancel`, { reason }).then(({ data }) => data);
  await wait(650);

  const booking = findOwnBooking(id, email);
  if (!CUSTOMER_CANCELLABLE.includes(booking.status)) throw new Error(`Booking ${id} is already ${booking.status.toLowerCase()}`);
  const note = reason?.trim();
  if (!note) throw new Error("Tell us why you're cancelling");

  const previousStatus = booking.status;
  const refunded = booking.paymentStatus === "Paid";
  const at = new Date().toISOString();
  Object.assign(booking, { status: "Cancelled", cancelReason: note });
  booking.statusHistory.push({ id: `${id}-cancel-${Date.now()}`, kind: "status", status: "Cancelled", at, by: "Customer", note });
  if (refunded) {
    Object.assign(booking, { paymentStatus: "Refunded", paidDate: null });
    booking.statusHistory.push({ id: `${id}-refund-${Date.now()}`, kind: "payment", status: "Refunded", at, by: "System", note: `Refund to ${booking.paymentMethod} · 5–7 business days` });
  }
  dashboardDb.events.unshift({ id: `cancellation-${id}-${Date.now()}`, type: "cancellation", title: "Cancelled by customer", detail: `${id} · ${note}`, at });
  saveStorefrontBooking(booking, previousStatus);
  return { booking: cloneBooking(booking), refunded };
}
