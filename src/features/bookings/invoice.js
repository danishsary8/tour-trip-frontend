import { exportReportPdf } from "../reports/export";

/**
 * Booking invoice as a PDF, built with the same jsPDF setup as the admin report exports
 * (`features/reports/export.js`). Text stays Latin-1 because the PDF uses built-in Helvetica.
 */

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

export const travellerSummary = (booking) =>
  [plural(booking.adults, "adult", "adults"), booking.children > 0 && plural(booking.children, "child", "children")].filter(Boolean).join(", ");

function paymentNote(booking, settings) {
  const amount = `$${booking.amount.toLocaleString("en-US")}`;
  const bank = settings?.payments?.bankTransfer;
  if (booking.paymentStatus === "Refunded") return `Refunded: ${amount} is being returned to the original payment method (${booking.paymentMethod}).`;
  if (booking.paymentStatus === "Paid") return `Paid in full by ${booking.paymentMethod}. Thank you.`;
  if (booking.status === "Cancelled") return "This booking was cancelled before payment. Nothing is owed.";
  if (booking.paymentMethod === "Bank Transfer" && bank) {
    return `Balance due: please transfer ${amount} to ${bank.bankName}, account ${bank.accountName}, number ${bank.accountNumber}, quoting ${booking.id} as the reference. We confirm your seats once the transfer arrives.`;
  }
  if (booking.paymentMethod === "Cash") return `Balance due: pay ${amount} in cash to your guide on the tour day. We confirm your seats shortly.`;
  return `Balance due: ${amount}. Choose a payment method from My Bookings to finish your booking.`;
}

export function invoiceReport(booking, settings) {
  const rows = [{ item: `Adults - ${booking.tourPackage}`, qty: booking.adults, unit: booking.unitPrice, amount: booking.adults * booking.unitPrice }];
  if (booking.children > 0) rows.push({ item: "Children", qty: booking.children, unit: booking.childPrice, amount: booking.children * booking.childPrice });
  if (booking.discount > 0) rows.push({ item: booking.discountLabel ?? "Discount", qty: 1, unit: -booking.discount, amount: -booking.discount });
  rows.push({ item: "Total", qty: null, unit: null, amount: booking.amount });

  const hours = (settings?.other?.cancellationWindowDays ?? 3) * 24;
  const general = settings?.general;

  return {
    kicker: `${(general?.siteName ?? "TourTrip Cambodia").toUpperCase()} · BOOKING INVOICE`,
    title: `Invoice ${booking.id}`,
    subtitle: booking.tourPackage,
    meta: `Issued ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · Demo booking, no real payment`,
    filename: `tourtrip-invoice-${booking.id}`,
    datedFilename: false,
    summary: [
      ["Booking ID", booking.id],
      ["Booking status", booking.status],
      ["Travel date", booking.travelDate, "date"],
      ["Payment status", booking.paymentStatus],
      ["Departure", `${booking.departureTime} · ${booking.destination}`],
      ["Payment method", booking.paymentMethod ?? "Not chosen yet"],
      ["Travellers", travellerSummary(booking)],
      ["Total", booking.amount, "usd"],
      ["Billed to", booking.contactName ?? booking.customerName],
      ["Booked on", booking.bookingDate, "date"],
      ["Email", booking.contactEmail],
      ["Phone", booking.contactPhone || "-"],
    ],
    tables: [
      {
        name: "Price breakdown",
        columns: [
          { header: "Item", key: "item" },
          { header: "Qty", key: "qty", format: "count" },
          { header: "Unit price", key: "unit", format: "usd" },
          { header: "Amount", key: "amount", format: "usd" },
        ],
        rows,
      },
    ],
    notes: [
      paymentNote(booking, settings),
      booking.status === "Cancelled" && booking.cancelReason ? `Cancellation reason: ${booking.cancelReason}.` : null,
      `Free cancellation up to ${hours} hours before departure from My Bookings.`,
      general ? `Questions? ${general.contactEmail} · ${general.contactPhone}` : null,
    ].filter(Boolean),
  };
}

/** Downloads `tourtrip-invoice-<id>.pdf`. jsPDF loads on demand, as in Reports. */
export const downloadInvoice = (booking, settings) => exportReportPdf(invoiceReport(booking, settings));
