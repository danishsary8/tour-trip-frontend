import apiClient from "../../lib/axios";
import {
  BOOKING_STATUSES,
  DESTINATIONS,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  TOURS,
  bookingsBetween,
  buildRange,
  paymentsBetween,
} from "../../mocks/dashboard";
import { getReviewsDb } from "../../mocks/reviews";
import { getYearlySeries } from "../dashboard/api";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function respond(path, params, build) {
  if (!useMock) return apiClient.get(path, { params }).then(({ data }) => data);
  await wait(500);
  return build();
}

/*
 * Definitions shared by every report:
 * - "Bookings" are bookings made (booking date) in the period.
 * - "Revenue" is money received (payment day) in the period, the same basis as dashboard
 *   income, so a report's revenue total always equals Income for that range.
 */

function rangeBounds(range) {
  const buckets = buildRange(range);
  return { buckets, start: buckets[0].start, end: buckets[buckets.length - 1].end };
}

const sum = (list, pick) => list.reduce((total, item) => total + pick(item), 0);
const share = (part, whole) => (whole ? (part / whole) * 100 : 0);

/** Monthly income for `year` against the year before; YoY compares months present in both. */
export async function getIncomeReport(year) {
  if (!useMock) return apiClient.get("/admin/reports/income", { params: { year } }).then(({ data }) => data);
  const [current, previous] = await Promise.all([getYearlySeries(year), getYearlySeries(year - 1)]);

  const months = current.months.map((month, index) => ({
    ...month,
    lastIncome: previous.months[index].income,
    lastBookings: previous.months[index].bookings,
  }));
  const covered = months.filter((month) => month.income !== null);
  const comparable = months.filter((month) => month.income !== null && month.lastIncome !== null);
  const total = sum(covered, (month) => month.income);
  const best = covered.reduce((top, month) => (!top || month.income > top.income ? month : top), null);
  const comparableNow = sum(comparable, (month) => month.income);
  const comparableThen = sum(comparable, (month) => month.lastIncome);

  return {
    year,
    years: Array.from({ length: current.lastYear - current.firstYear + 1 }, (_, index) => current.lastYear - index),
    months,
    summary: {
      total,
      bookings: sum(covered, (month) => month.bookings),
      average: covered.length ? total / covered.length : 0,
      best: best ? { label: best.title, income: best.income } : null,
      yoy: comparableThen ? ((comparableNow - comparableThen) / comparableThen) * 100 : null,
      yoyAmount: comparableThen ? comparableNow - comparableThen : null,
      comparableMonths: comparable.length,
      coveredMonths: covered.length,
    },
  };
}

/** Every tour ranked by bookings, with revenue, travellers and review ratings. */
export function getToursReport(range) {
  return respond("/admin/reports/tours", { range }, () => {
    const { start, end } = rangeBounds(range);
    const booked = bookingsBetween(start, end);
    const payments = paymentsBetween(start, end);
    const reviews = getReviewsDb().filter((review) => review.status !== "Hidden");
    const totalBookings = booked.length;

    const rows = TOURS.map((tour) => {
      const tourBookings = booked.filter((booking) => booking.tourId === tour.id);
      const tourReviews = reviews.filter((review) => review.tourName === tour.name);
      return {
        id: tour.id,
        name: tour.name,
        destination: tour.destination,
        image: tour.image,
        bookings: tourBookings.length,
        cancelled: tourBookings.filter((booking) => booking.status === "Cancelled").length,
        travellers: sum(tourBookings, (booking) => booking.guests),
        revenue: sum(payments.filter((booking) => booking.tourId === tour.id), (booking) => booking.amount),
        rating: tourReviews.length ? sum(tourReviews, (review) => review.rating) / tourReviews.length : null,
        reviews: tourReviews.length,
        share: share(tourBookings.length, totalBookings),
      };
    }).sort((a, b) => b.bookings - a.bookings);

    rows.forEach((row, index) => Object.assign(row, { rank: index + 1 }));
    return { range, rows, totals: { bookings: totalBookings, revenue: sum(rows, (row) => row.revenue) } };
  });
}

/** Status counts and shares, plus the mix per bucket for the trend chart. */
export function getStatusReport(range) {
  return respond("/admin/reports/status", { range }, () => {
    const { buckets, start, end } = rangeBounds(range);
    const booked = bookingsBetween(start, end);
    const items = BOOKING_STATUSES.map((status) => {
      const list = booked.filter((booking) => booking.status === status);
      return { status, count: list.length, value: sum(list, (booking) => booking.amount), share: share(list.length, booked.length) };
    });
    const timeline = buckets.map((bucket) => {
      const list = bookingsBetween(bucket.start, bucket.end);
      return {
        label: bucket.label,
        title: bucket.title,
        ...Object.fromEntries(BOOKING_STATUSES.map((status) => [status, list.filter((booking) => booking.status === status).length])),
      };
    });
    return { range, items, total: booked.length, timeline };
  });
}

/** Bookings and revenue per destination, including destinations with no tours yet. */
export function getDestinationReport(range) {
  return respond("/admin/reports/destinations", { range }, () => {
    const { start, end } = rangeBounds(range);
    const booked = bookingsBetween(start, end);
    const payments = paymentsBetween(start, end);
    const totalRevenue = sum(payments, (booking) => booking.amount);

    const rows = DESTINATIONS.map((destination) => {
      const destinationBookings = booked.filter((booking) => booking.destination === destination.name);
      const revenue = sum(payments.filter((booking) => booking.destination === destination.name), (booking) => booking.amount);
      return {
        id: destination.id,
        name: destination.name,
        province: destination.province,
        country: destination.country,
        tours: TOURS.filter((tour) => tour.destinationId === destination.id).length,
        bookings: destinationBookings.length,
        travellers: sum(destinationBookings, (booking) => booking.guests),
        revenue,
        share: share(revenue, totalRevenue),
      };
    }).sort((a, b) => b.revenue - a.revenue || b.bookings - a.bookings);

    return { range, rows, totals: { revenue: totalRevenue, bookings: booked.length } };
  });
}

/** Payment methods (money received), payment status mix and the individual transactions. */
export function getPaymentReport(range) {
  return respond("/admin/reports/payments", { range }, () => {
    const { start, end } = rangeBounds(range);
    const booked = bookingsBetween(start, end);
    const payments = paymentsBetween(start, end);
    const received = sum(payments, (booking) => booking.amount);

    const methods = PAYMENT_METHODS.map((method) => {
      const list = payments.filter((booking) => booking.paymentMethod === method);
      const amount = sum(list, (booking) => booking.amount);
      return { method, count: list.length, amount, share: share(amount, received) };
    });
    const statuses = PAYMENT_STATUSES.map((status) => {
      const list = booked.filter((booking) => booking.paymentStatus === status);
      return { status, count: list.length, amount: sum(list, (booking) => booking.amount), share: share(list.length, booked.length) };
    });
    const transactions = booked.map((booking) => ({
      id: booking.id,
      customerName: booking.customerName,
      tourPackage: booking.tourPackage,
      bookingDate: booking.bookingDate,
      paidDate: booking.paidDate,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      status: booking.status,
      amount: booking.amount,
    }));

    return { range, methods, statuses, transactions, totals: { received, bookings: booked.length } };
  });
}
