/**
 * Customer totals derived from booking records, never stored: total bookings counts every
 * booking, total spent counts only paid bookings (refunds and unpaid balances excluded).
 */
export function summarizeBookings(bookings) {
  let totalSpent = 0;
  let lastBookingDate = null;
  let upcoming = 0;
  const today = new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD

  for (const booking of bookings) {
    if (booking.paymentStatus === "Paid") totalSpent += booking.amount;
    if (!lastBookingDate || booking.bookingDate > lastBookingDate) lastBookingDate = booking.bookingDate;
    if (booking.travelDate >= today && (booking.status === "Pending" || booking.status === "Confirmed")) upcoming += 1;
  }
  return { totalBookings: bookings.length, totalSpent, lastBookingDate, upcoming };
}

/** Groups bookings by customer id in one pass. */
export function bookingsByCustomer(bookings) {
  const groups = new Map();
  for (const booking of bookings) {
    if (!groups.has(booking.customerId)) groups.set(booking.customerId, []);
    groups.get(booking.customerId).push(booking);
  }
  return groups;
}
