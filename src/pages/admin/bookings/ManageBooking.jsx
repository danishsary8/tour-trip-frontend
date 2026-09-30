import { useState } from "react";
import { Download, Search, CalendarCheck2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Skeleton } from "../../../components/shared/Skeleton";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { DecisionButtons } from "../../../features/bookings/components/DecisionButtons";
import { useBookingActions, useBookings } from "../../../features/bookings/hooks";
import { formatDate, formatUsd } from "../../../lib/format";

const STATUSES = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];
const PAGE_SIZE = 7;

function csvCell(value) {
  const text = String(value ?? "");
  // Keep spreadsheet applications from interpreting untrusted names as formulas.
  const safe = /^[-=+@]/.test(text) ? "'" + text : text;
  return '"' + safe.replace(/"/g, '""') + '"';
}

function exportBookings(bookings) {
  const header = ["Booking ID", "Customer", "Tour", "Destination", "Booking date", "Travel date", "Guests", "Amount (USD)", "Status"];
  const rows = bookings.map((item) => [
    item.id, item.customerName, item.tourPackage, item.destination,
    item.bookingDate, item.travelDate, item.guests, item.amount, item.status,
  ]);
  const csv = "\uFEFF" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "tourtrip-bookings.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export default function ManageBooking() {
  const { data: bookings = [], isLoading, isError, refetch } = useBookings();
  const { onDecide, deciding, decidingId } = useBookingActions();
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [page, setPage] = useState(1);
  const normalizedSearch = search.trim().toLowerCase();
  const visible = bookings.filter((booking) => {
    const statusMatches = activeStatus === "All" || booking.status === activeStatus;
    const textMatches = !normalizedSearch || [booking.id, booking.customerName, booking.tourPackage, booking.destination]
      .some((value) => String(value).toLowerCase().includes(normalizedSearch));
    return statusMatches && textMatches;
  });
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function selectStatus(status) { setActiveStatus(status); setPage(1); }
  function updateSearch(value) { setSearch(value); setPage(1); }

  return (
    <div className="mx-auto min-w-0 max-w-[1580px] pb-8">
      <PageHeader
        eyebrow="Operations / Guest journeys"
        title="Bookings"
        description="Track requests, review travel plans and keep every guest in the loop."
        actions={<Button variant="outline" onClick={() => exportBookings(visible)} disabled={isLoading || visible.length === 0}><Download className="size-4" aria-hidden="true" /> Export CSV</Button>}
      />

      {isError ? (
        <div role="alert" className="rounded-panel border border-danger/25 bg-surface p-6 text-foreground">
          Bookings could not be loaded. <button type="button" onClick={() => refetch()} className="font-semibold text-primary-ink underline">Try again</button>
        </div>
      ) : (
        <section className="min-w-0 overflow-hidden rounded-panel border border-border bg-surface shadow-soft">
          <div className="flex flex-col justify-between gap-4 border-b border-border p-4 sm:p-5 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-primary/12 text-primary-ink"><CalendarCheck2 className="size-4" aria-hidden="true" /></span><h2 className="font-display text-lg font-semibold text-foreground">Booking desk</h2></div>
              <p className="mt-1 text-xs text-muted">{isLoading ? "Loading records..." : bookings.length + " booking records"} · Confirm or reject pending requests</p>
            </div>
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input type="search" value={search} onChange={(event) => updateSearch(event.target.value)} placeholder="Search name, ID, tour or place"
                aria-label="Search bookings"
                className="h-10 w-full rounded-control border border-border bg-surface-2/50 pl-9 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20" />
              {search && <button type="button" aria-label="Clear search" onClick={() => updateSearch("")} className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded text-muted hover:bg-surface hover:text-foreground"><X className="size-3.5" /></button>}
            </div>
          </div>

          <div className="overflow-x-auto border-b border-border px-4 py-3 sm:px-5">
            <div className="flex w-max min-w-full gap-1.5" role="group" aria-label="Filter bookings by status">
              {STATUSES.map((status) => {
                const count = status === "All" ? bookings.length : bookings.filter((item) => item.status === status).length;
                return (
                  <button key={status} type="button" aria-pressed={activeStatus === status} onClick={() => selectStatus(status)}
                    className={"whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition-[background-color,color,transform] focus-visible:outline-2 focus-visible:outline-primary active:scale-95 " +
                      (activeStatus === status ? "bg-primary text-white" : "bg-surface-2 text-muted hover:text-foreground")}>
                    {status} <span className={activeStatus === status ? "ml-1 text-white/75" : "ml-1 text-muted"}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {isLoading ? <div className="space-y-3 p-5"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] table-fixed text-left text-sm">
                <caption className="sr-only">TourTrip booking records</caption>
                <thead className="bg-surface-2/60 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  <tr>
                    <th scope="col" className="w-[12%] px-5 py-3.5 2xl:w-[11%]">Booking</th>
                    <th scope="col" className="w-[17%] px-3 py-3.5 2xl:w-[15%]">Guest</th>
                    <th scope="col" className="w-[24%] px-3 py-3.5 2xl:w-[19%]">Tour / Destination</th>
                    <th scope="col" className="hidden px-3 py-3.5 2xl:table-cell 2xl:w-[12%]">Booked</th>
                    <th scope="col" className="w-[16%] px-3 py-3.5 2xl:w-[12%]">Travel date</th>
                    <th scope="col" className="hidden px-3 py-3.5 text-right 2xl:table-cell 2xl:w-[6%]">Guests</th>
                    <th scope="col" className="w-[10%] px-3 py-3.5 text-right 2xl:w-[8%]">Amount</th>
                    <th scope="col" className="w-[12%] px-3 py-3.5 2xl:w-[10%]">Status</th>
                    <th scope="col" className="w-[9%] px-3 py-3.5 text-right 2xl:w-[7%]"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paged.length ? paged.map((booking) => (
                    <tr key={booking.id} className="transition-colors hover:bg-surface-2/50">
                      <td className="truncate px-5 py-4 font-semibold tabular-nums text-primary-ink" title={booking.id}>{booking.id}</td>
                      <td className="px-3 py-4">
                        <span className="flex items-center gap-2.5"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/12 text-[10px] font-bold text-primary-ink">{booking.initials}</span><span className="truncate font-medium text-foreground" title={booking.customerName}>{booking.customerName}</span></span>
                      </td>
                      <td className="px-3 py-4"><span className="block max-w-[220px] truncate font-medium text-foreground" title={booking.tourPackage}>{booking.tourPackage}</span><span className="text-xs text-muted">{booking.destination}</span></td>
                      <td className="hidden whitespace-nowrap px-3 py-4 text-muted 2xl:table-cell">{formatDate(booking.bookingDate)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-muted">{formatDate(booking.travelDate)}</td>
                      <td className="hidden px-3 py-4 text-right tabular-nums text-foreground 2xl:table-cell">{booking.guests}</td>
                      <td className="px-3 py-4 text-right font-semibold tabular-nums text-foreground">{formatUsd(booking.amount)}</td>
                      <td className="px-3 py-4"><StatusBadge status={booking.status} /></td>
                      <td className="px-3 py-4">{booking.status === "Pending" ? <DecisionButtons booking={booking} onDecide={onDecide} busy={deciding && decidingId === booking.id} /> : <span className="block text-right text-xs text-muted">—</span>}</td>
                    </tr>
                  )) : <tr><td colSpan={9} className="px-5 py-16 text-center text-sm text-muted">No bookings match this search. Try another name or status.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <span>{visible.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(currentPage * PAGE_SIZE, visible.length)} of {visible.length} bookings</span>
            <nav className="flex items-center gap-2" aria-label="Booking pages">
              <button type="button" aria-label="Previous page" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage <= 1}
                className="grid size-8 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-2 disabled:opacity-40"><ChevronLeft className="size-4" /></button>
              <span className="min-w-16 text-center tabular-nums">Page {currentPage} / {pageCount}</span>
              <button type="button" aria-label="Next page" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage >= pageCount}
                className="grid size-8 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-2 disabled:opacity-40"><ChevronRight className="size-4" /></button>
            </nav>
          </div>
        </section>
      )}
    </div>
  );
}
