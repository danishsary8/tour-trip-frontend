/**
 * Checkout helpers shared by the booking wizard, My Bookings and the Tour Detail booking card:
 * seats, pricing, the payment methods admin Settings leaves enabled, and the cancellation rule.
 */
import { formatUsd } from "../../lib/format";
import { PAYMENT_METHOD_LABELS } from "../settings/schema";

export const BOOKING_STEPS = [
  { key: "details", label: "Your details" },
  { key: "review", label: "Review & confirm" },
  { key: "payment", label: "Payment" },
  { key: "done", label: "Confirmation" },
];

const todayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export const seatsLeft = (schedule) => Math.max(0, schedule.capacity - schedule.seatsBooked);
export const seatTone = (schedule) => (seatsLeft(schedule) === 0 ? "bg-danger" : schedule.seatsBooked / schedule.capacity >= 0.8 ? "bg-accent" : "bg-success");

/** Bookable departures: active, from today on, soonest first. */
export const upcomingSchedules = (schedules) =>
  schedules.filter((schedule) => schedule.status !== "Inactive" && schedule.date >= todayKey()).sort((a, b) => a.date.localeCompare(b.date));

/** Everyone pays the per-person price (a departure may override it); the FAQ says the same. */
export const unitPriceOf = (tour, schedule) => schedule?.priceOverride ?? tour.price;

export function priceBreakdown({ unitPrice, childPrice = unitPrice, adults, children, discount = 0, discountLabel }) {
  const lines = [{ label: adults === 1 ? "Adult" : "Adults", count: adults, unit: unitPrice, amount: adults * unitPrice }];
  if (children > 0) lines.push({ label: children === 1 ? "Child" : "Children", count: children, unit: childPrice, amount: children * childPrice });
  if (discount > 0) lines.push({ label: discountLabel ?? "Discount", amount: -discount });
  return { lines, total: lines.reduce((sum, line) => sum + line.amount, 0) };
}

/** Payment choices shown at checkout, straight from the admin Settings → Payment methods tab. */
export function enabledPaymentMethods(payments) {
  if (!payments) return [];
  return Object.entries(PAYMENT_METHOD_LABELS)
    .filter(([key]) => payments[key]?.enabled)
    .map(([key, name]) => ({ key, name, config: payments[key] }));
}

/** "ABA Pay (Simulation)" → "ABA Pay"; customers see the simulation note separately. */
export const customerMethodName = (method) => (method ? method.replace(" (Simulation)", "") : "Not chosen yet");

export const cancellationHours = (settings) => (settings?.other?.cancellationWindowDays ?? 3) * 24;

/** Hours from now until the tour departs (local time). */
export function hoursUntilDeparture(booking) {
  const departure = new Date(`${booking.travelDate}T${booking.departureTime ?? "08:00"}:00`);
  return (departure.getTime() - Date.now()) / 3_600_000;
}

/**
 * Customers can cancel Pending or Confirmed bookings. A paid booking refunds in full, so it can
 * only be cancelled online outside the free-cancellation window (72 hours by default), which is
 * the promise made on the FAQ, footer and checkout. Inside it, the traveller contacts the team.
 */
export function cancellationOf(booking, settings) {
  if (!["Pending", "Confirmed"].includes(booking.status)) return { allowed: false, reason: null };
  const hours = hoursUntilDeparture(booking);
  if (hours <= 0) return { allowed: false, reason: "This tour has already started.", short: "Tour already started" };
  const windowHours = cancellationHours(settings);
  if (booking.paymentStatus === "Paid" && hours < windowHours) {
    return {
      allowed: false,
      reason: `Your tour starts in less than ${windowHours} hours, so it can no longer be refunded online. Contact us and we'll try to move you to another date.`,
      short: `Within ${windowHours} hours of departure`,
    };
  }
  return { allowed: true, reason: null };
}

/** Upcoming = still going ahead; used by the My Bookings tabs and header counts. */
export const isUpcoming = (booking) => booking.status === "Pending" || booking.status === "Confirmed";

/** A Pending booking that stopped before the payment step (no method yet). */
export const awaitsPaymentChoice = (booking) => booking.status === "Pending" && booking.paymentStatus === "Unpaid" && !booking.paymentMethod;

const longDate = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
/** `YYYY-MM-DD` → "Tue, 14 Oct 2026". */
export const formatTripDate = (value) => longDate.format(new Date(`${value}T12:00:00Z`));

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
/** "2 adults, 1 child". */
export const travellersLabel = (adults, children) =>
  [plural(adults, "adult", "adults"), children > 0 && plural(children, "child", "children")].filter(Boolean).join(", ");

/** The refund promise shown when a paid booking is cancelled. */
export const refundMessage = (booking) =>
  `A refund of ${formatUsd(booking.amount)} will be processed to your original payment method (${customerMethodName(booking.paymentMethod)}) within 5–7 business days.`;
