function csvCell(value) {
  const text = String(value ?? "");
  // Keep spreadsheet applications from interpreting untrusted names as formulas.
  const safe = /^[-=+@]/.test(text) ? "'" + text : text;
  return '"' + safe.replace(/"/g, '""') + '"';
}

/** Downloads the given bookings as a UTF-8 CSV that opens cleanly in Excel. */
export function exportBookingsCsv(bookings, filename = "tourtrip-bookings.csv") {
  const header = [
    "Booking ID", "Customer", "Email", "Phone", "Tour", "Destination", "Booking date", "Travel date",
    "Adults", "Children", "Infants", "Amount (USD)", "Payment status", "Payment method", "Status", "Cancel reason",
  ];
  const rows = bookings.map((item) => [
    item.id, item.customerName, item.contactEmail, item.contactPhone, item.tourPackage, item.destination,
    item.bookingDate, item.travelDate, item.adults, item.children, item.infants, item.amount,
    item.paymentStatus, item.paymentMethod, item.status, item.cancelReason,
  ]);
  const csv = "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
