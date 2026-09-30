import apiClient from "../../lib/axios";
import { PAYMENT_METHODS, REJECT_REASON, TOURS, dashboardDb, invalidateIndex, toKey } from "../../mocks/dashboard";

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
    booking.statusHistory.push({ id: `${id}-method-${Date.now()}`, kind: "payment", status: "Method changed", at, by: "Admin", note: `${booking.paymentMethod} → ${paymentMethod}` });
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
  invalidateIndex();
  return { booking: cloneBooking(booking), snapshot, eventId };
}

/** Undo for any action above: puts the snapshot back and drops the activity event. */
export async function restoreBooking({ id, snapshot, eventId }) {
  if (!useMock) return apiClient.post(`/admin/bookings/${id}/restore`, snapshot).then(({ data }) => data);
  await wait(250);

  const booking = findBooking(id);
  Object.assign(booking, { ...snapshot, statusHistory: snapshot.statusHistory.map((entry) => ({ ...entry })) });
  dashboardDb.events = dashboardDb.events.filter((event) => event.id !== eventId);
  invalidateIndex();
  return { booking: cloneBooking(booking) };
}
