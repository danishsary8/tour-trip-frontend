import apiClient from "../../lib/axios";
import {
  BOOKING_STATUSES,
  PAYMENT_METHODS,
  REJECT_REASON,
  TOURS,
  bookingsBetween,
  buildRange,
  buildYear,
  customersAt,
  dashboardDb,
  historyStart,
  departuresBetween,
  incomeBetween,
  incomeOf,
  invalidateIndex,
  paymentsBetween,
  smoothDailyRevenue,
  summarize,
} from "../../mocks/dashboard";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const MOCK_DELAY = 600;

/** Runs `build` after a realistic delay, or calls the real endpoint when mocks are off. */
async function respond(path, params, build) {
  if (!useMock) return apiClient.get(path, { params }).then(({ data }) => data);
  await wait(MOCK_DELAY);
  return build();
}

const percentChange = (current, previous) => (previous ? ((current - previous) / previous) * 100 : null);

function periodBounds(buckets) {
  return {
    current: { start: buckets[0].start, end: buckets[buckets.length - 1].end },
    previous: { start: buckets[0].previous.start, end: buckets[buckets.length - 1].previous.end },
  };
}

/* ---------------------------------------------------------------- reads */

export function getSummary(range) {
  return respond("/admin/dashboard/summary", { range }, () => {
    const buckets = buildRange(range);
    const bounds = periodBounds(buckets);
    const current = summarize(bounds.current.start, bounds.current.end);
    const previous = summarize(bounds.previous.start, bounds.previous.end);
    const perBucket = buckets.map((bucket) => bookingsBetween(bucket.start, bucket.end));

    const metric = (key, series) => ({
      value: current[key],
      previous: previous[key],
      delta: percentChange(current[key], previous[key]),
      series,
    });

    return {
      range,
      tours: metric("tours", buckets.map((bucket) => departuresBetween(bucket.start, bucket.end))),
      bookings: metric("bookings", perBucket.map((list) => list.length)),
      customers: metric("customers", buckets.map((bucket) => customersAt(bucket.end))),
      income: metric("income", buckets.map((bucket) => incomeBetween(bucket.start, bucket.end))),
    };
  });
}

export function getRevenueSeries(range) {
  return respond("/admin/dashboard/revenue", { range }, () => {
    const buckets = buildRange(range);
    const points = buckets.map((bucket) => {
      const current = bookingsBetween(bucket.start, bucket.end);
      const previous = bookingsBetween(bucket.previous.start, bucket.previous.end);
      return {
        label: bucket.label,
        title: bucket.title,
        income: incomeBetween(bucket.start, bucket.end),
        bookings: current.length,
        previousIncome: incomeBetween(bucket.previous.start, bucket.previous.end),
        previousBookings: previous.length,
      };
    });
    if (range === "7D" || range === "30D") {
      const currentTrend = smoothDailyRevenue(points.map((point) => point.income));
      const previousTrend = smoothDailyRevenue(points.map((point) => point.previousIncome));
      points.forEach((point, index) => {
        point.trendIncome = currentTrend[index];
        point.previousTrendIncome = previousTrend[index];
      });
    }
    const total = (key) => points.reduce((sum, point) => sum + point[key], 0);
    return {
      range,
      points,
      totals: {
        income: total("income"),
        bookings: total("bookings"),
        previousIncome: total("previousIncome"),
        previousBookings: total("previousBookings"),
      },
    };
  });
}

/**
 * Income and bookings per calendar month of `year` (year-over-year reports). Months with no
 * generated history return `null` values. Shares the aggregation helpers used by ranges.
 */
export function getYearlySeries(year) {
  return respond("/admin/dashboard/yearly", { year }, () => {
    const months = buildYear(year).map((bucket) => ({
      label: bucket.label,
      title: bucket.title,
      partial: bucket.partial,
      income: bucket.covered ? incomeBetween(bucket.start, bucket.end) : null,
      bookings: bucket.covered ? bookingsBetween(bucket.start, bucket.end).length : null,
    }));
    return { year, months, firstYear: historyStart().getFullYear(), lastYear: dashboardDb.today.getFullYear() };
  });
}

export function getStatusBreakdown(range) {
  return respond("/admin/dashboard/status", { range }, () => {
    const { current } = periodBounds(buildRange(range));
    const { byStatus } = summarize(current.start, current.end);
    const items = BOOKING_STATUSES.map((status) => ({ status, count: byStatus[status] }));
    return { range, items, total: items.reduce((sum, item) => sum + item.count, 0) };
  });
}

export function getBookingsTimeline(range) {
  return respond("/admin/dashboard/timeline", { range }, () => {
    const buckets = buildRange(range);
    return {
      range,
      points: buckets.map((bucket) => {
        const list = bookingsBetween(bucket.start, bucket.end);
        const count = (...statuses) => list.filter((booking) => statuses.includes(booking.status)).length;
        return {
          label: bucket.label,
          title: bucket.title,
          confirmed: count("Confirmed", "Completed"),
          pending: count("Pending"),
          cancelled: count("Cancelled"),
        };
      }),
    };
  });
}

export function getPopularTours(range) {
  return respond("/admin/dashboard/popular-tours", { range }, () => {
    const { current } = periodBounds(buildRange(range));
    const booked = bookingsBetween(current.start, current.end).filter((booking) => booking.status !== "Cancelled");
    const ranked = TOURS.map((tour) => {
      const tourBookings = booked.filter((booking) => booking.tourId === tour.id);
      return {
        id: tour.id,
        name: tour.name,
        destination: tour.destination,
        image: tour.image,
        bookings: tourBookings.length,
        travelers: tourBookings.reduce((sum, booking) => sum + booking.guests, 0),
        income: incomeOf(tourBookings),
      };
    }).sort((a, b) => b.bookings - a.bookings);
    const top = ranked[0]?.bookings || 1;
    return {
      range,
      items: ranked.slice(0, 5).map((tour, index) => ({ ...tour, rank: index + 1, share: (tour.bookings / top) * 100 })),
    };
  });
}

export function getPaymentBreakdown(range) {
  return respond("/admin/dashboard/payments", { range }, () => {
    const { current } = periodBounds(buildRange(range));
    const paid = paymentsBetween(current.start, current.end);
    const items = PAYMENT_METHODS.map((method) => {
      const list = paid.filter((booking) => booking.paymentMethod === method);
      return { method, count: list.length, amount: incomeOf(list) };
    });
    return { range, items, total: items.reduce((sum, item) => sum + item.amount, 0) };
  });
}

export function getRecentBookings() {
  return respond("/admin/dashboard/recent-bookings", undefined, () =>
    dashboardDb.bookings.slice(0, 6).map((booking) => ({ ...booking })),
  );
}

export function getUpcomingDepartures() {
  return respond("/admin/dashboard/departures", undefined, () => dashboardDb.schedules.slice(0, 5).map((item) => ({ ...item })));
}

export const pendingBookings = () => dashboardDb.bookings.filter((booking) => booking.status === "Pending");

export function getAttention() {
  return respond("/admin/dashboard/attention", undefined, () => {
    const pending = pendingBookings();
    return {
      pendingBookings: { count: pending.length, items: pending.slice(0, 3).map((booking) => ({ ...booking })) },
      reviews: { count: dashboardDb.reviews.length, items: dashboardDb.reviews.slice(0, 3).map((review) => ({ ...review })) },
      almostFull: dashboardDb.schedules
        .filter((schedule) => schedule.seatsBooked / schedule.capacity >= 0.8)
        .map((schedule) => ({ ...schedule })),
    };
  });
}

/** Latest events: session actions first, then derived booking, payment, cancellation and review events. */
export function getActivity() {
  return respond("/admin/dashboard/activity", undefined, () => {
    const derived = [];
    for (const booking of dashboardDb.bookings.slice(0, 20)) {
      derived.push({ id: `new-${booking.id}`, type: "booking", title: "New booking", detail: `${booking.customerName} · ${booking.tourPackage}`, at: booking.createdAt });
      if (booking.paymentStatus === "Paid") {
        derived.push({
          id: `paid-${booking.id}`,
          type: "payment",
          title: "Payment received",
          detail: `${booking.id} · ${booking.paymentMethod}`,
          amount: booking.amount,
          at: new Date(new Date(booking.createdAt).getTime() + 18 * 60_000).toISOString(),
        });
      }
      if (booking.status === "Cancelled") {
        derived.push({ id: `cancel-${booking.id}`, type: "cancellation", title: "Booking cancelled", detail: `${booking.id} · ${booking.cancelReason}`, at: booking.createdAt });
      }
    }
    for (const review of dashboardDb.reviews) {
      derived.push({ id: `review-${review.id}`, type: "review", title: `${review.rating}★ review awaiting approval`, detail: `${review.customerName} · ${review.tourName}`, at: review.createdAt });
    }
    const now = Date.now();
    return [...dashboardDb.events, ...derived.filter((event) => new Date(event.at).getTime() <= now).sort((a, b) => b.at.localeCompare(a.at))]
      .slice(0, 8)
      .map((event) => ({ ...event }));
  });
}

/* ------------------------------------------------------------- mutations */

const DECISIONS = {
  confirm: { status: "Confirmed", cancelReason: null, event: "confirmed" },
  reject: { status: "Cancelled", cancelReason: REJECT_REASON, event: "rejected" },
};

/** Confirm or reject a pending booking. Resolves with a snapshot that `restoreBooking` can undo. */
export async function decideBooking({ id, decision }) {
  if (!useMock) return apiClient.post(`/admin/bookings/${id}/${decision}`).then(({ data }) => data);
  await wait(350);

  const booking = dashboardDb.bookings.find((item) => item.id === id);
  if (!booking) throw new Error(`Booking ${id} was not found`);
  if (booking.status !== "Pending") throw new Error(`Booking ${id} is already ${booking.status.toLowerCase()}`);

  const snapshot = { status: booking.status, cancelReason: booking.cancelReason };
  const change = DECISIONS[decision];
  Object.assign(booking, { status: change.status, cancelReason: change.cancelReason });
  const eventId = `${change.event}-${id}-${Date.now()}`;
  dashboardDb.events.unshift({
    id: eventId,
    type: decision === "confirm" ? "confirmed" : "cancellation",
    title: decision === "confirm" ? "Booking confirmed" : "Booking rejected",
    detail: `${booking.id} · ${booking.customerName}`,
    at: new Date().toISOString(),
  });
  invalidateIndex();
  return { booking: { ...booking }, snapshot, eventId };
}

export async function restoreBooking({ id, snapshot, eventId }) {
  if (!useMock) return apiClient.post(`/admin/bookings/${id}/restore`, snapshot).then(({ data }) => data);
  await wait(250);

  const booking = dashboardDb.bookings.find((item) => item.id === id);
  if (!booking) throw new Error(`Booking ${id} was not found`);
  Object.assign(booking, snapshot);
  dashboardDb.events = dashboardDb.events.filter((event) => event.id !== eventId);
  invalidateIndex();
  return { booking: { ...booking } };
}
