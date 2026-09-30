import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { CheckCheck, Download } from "lucide-react";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { DataTable } from "../../../components/shared/DataTable";
import { PageHeader } from "../../../components/shared/PageHeader";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { BookingDrawer } from "../../../features/bookings/components/BookingDrawer";
import { DecisionButtons } from "../../../features/bookings/components/DecisionButtons";
import { exportBookingsCsv } from "../../../features/bookings/export";
import { useBookingActions, useBookings, useBulkConfirm, useRestoreBooking } from "../../../features/bookings/hooks";
import { formatDate, formatUsd } from "../../../lib/format";

const dateInput =
  "h-10 rounded-control border border-border bg-surface px-3 text-sm text-foreground outline-none transition-colors hover:border-primary/35 focus-visible:ring-2 focus-visible:ring-primary/30 [color-scheme:light] dark:[color-scheme:dark]";

/** "2 adults, 1 child" style hint, only when the party is not all adults. */
const travellerMix = (booking) =>
  booking.children || booking.infants
    ? [`${booking.adults}A`, booking.children && `${booking.children}C`, booking.infants && `${booking.infants}I`].filter(Boolean).join(" ")
    : null;

function MobileBookingCard({ booking }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{booking.customerName}</p>
          <p className="text-xs tabular-nums text-muted">{booking.id}</p>
        </div>
        <p className="shrink-0 font-display text-lg font-semibold tabular-nums text-foreground">{formatUsd(booking.amount)}</p>
      </div>
      <p className="truncate text-sm text-foreground">{booking.tourPackage}</p>
      <p className="text-xs text-muted">
        {formatDate(booking.travelDate)} · {booking.guests} {booking.guests === 1 ? "traveller" : "travellers"}
      </p>
      <div className="flex flex-wrap gap-1.5 pt-1">
        <StatusBadge status={booking.status} />
        <StatusBadge status={booking.paymentStatus} />
      </div>
    </div>
  );
}

/** Manage Bookings: list, filters, quick and bulk actions, and the detail drawer. */
export default function BookingsPage() {
  const query = useBookings();
  const actions = useBookingActions();
  const bulkConfirm = useBulkConfirm();
  const restore = useRestoreBooking();
  const [params, setParams] = useSearchParams();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [bulkSelection, setBulkSelection] = useState(null);
  const selectedId = params.get("booking");

  function openBooking(booking) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set("booking", booking.id);
      return next;
    });
  }

  function closeBooking() {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("booking");
      return next;
    }, { replace: true });
  }

  const bookings = useMemo(() => query.data ?? [], [query.data]);
  const rows = useMemo(
    () => bookings.filter((booking) => (!from || booking.travelDate >= from) && (!to || booking.travelDate <= to)),
    [bookings, from, to],
  );
  const pendingCount = bookings.filter((booking) => booking.status === "Pending").length;

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Booking",
        cell: ({ getValue }) => <span className="whitespace-nowrap font-semibold tabular-nums text-primary-ink">{getValue()}</span>,
      },
      {
        id: "customer",
        accessorFn: (row) => row.customerName,
        header: "Customer",
        cell: ({ row }) => (
          <span className="flex items-center gap-2.5">
            <span className="hidden size-8 shrink-0 place-items-center rounded-full bg-primary/12 text-[10px] font-bold text-primary-ink 2xl:grid">{row.original.initials}</span>
            <span className="truncate font-medium">{row.original.customerName}</span>
          </span>
        ),
      },
      {
        accessorKey: "tourPackage",
        header: "Tour",
        enableGlobalFilter: false,
        cell: ({ row }) => (
          <span className="block min-w-0">
            <span className="block max-w-[180px] truncate">{row.original.tourPackage}</span>
            <span className="text-xs text-muted">
              {row.original.destination}
              <span className="2xl:hidden"> · {row.original.guests} pax</span>
            </span>
          </span>
        ),
      },
      {
        accessorKey: "travelDate",
        header: "Travel date",
        enableGlobalFilter: false,
        cell: ({ getValue }) => <span className="whitespace-nowrap text-muted">{formatDate(getValue())}</span>,
      },
      {
        accessorKey: "guests",
        header: "Travellers",
        enableGlobalFilter: false,
        enableSorting: false,
        meta: { className: "hidden 2xl:table-cell" },
        cell: ({ row }) => (
          <span className="whitespace-nowrap tabular-nums">
            {row.original.guests}
            {travellerMix(row.original) && <span className="ml-1 text-xs text-muted">{travellerMix(row.original)}</span>}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        enableGlobalFilter: false,
        cell: ({ getValue }) => <span className="font-semibold tabular-nums">{formatUsd(getValue())}</span>,
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment",
        enableGlobalFilter: false,
        enableSorting: false,
        filterFn: "equalsString",
        cell: ({ getValue }) => <StatusBadge status={getValue()} />,
      },
      {
        accessorKey: "status",
        header: "Status",
        enableGlobalFilter: false,
        enableSorting: false,
        filterFn: "equalsString",
        cell: ({ getValue }) => <StatusBadge status={getValue()} />,
      },
    ],
    [],
  );

  const rowActions = (booking) =>
    booking.status === "Pending" ? (
      <DecisionButtons booking={booking} onDecide={actions.onDecide} busy={actions.deciding && actions.decidingId === booking.id} />
    ) : null;

  async function confirmSelected() {
    const { items, clear } = bulkSelection;
    try {
      const result = await bulkConfirm.mutateAsync(items.map((booking) => booking.id));
      clear();
      const skipped = result.skipped.length ? ` ${result.skipped.length} skipped (no longer pending).` : "";
      toast.success(`${result.confirmed.length} bookings confirmed`, {
        description: skipped || "Guests will be notified once email is connected.",
        duration: 5000,
        action: {
          label: "Undo",
          onClick: async () => {
            for (const entry of result.confirmed) await restore.mutateAsync(entry);
            toast(`${result.confirmed.length} bookings are pending again`);
          },
        },
      });
    } catch (error) {
      toast.error(error.message || "Bookings could not be confirmed");
    } finally {
      setBulkSelection(null);
    }
  }

  const dateFilters = (
    <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:flex sm:w-auto" role="group" aria-label="Travel date range">
      <label className="sr-only" htmlFor="bookings-from">Travel date from</label>
      <input id="bookings-from" type="date" value={from} max={to || undefined} onChange={(event) => setFrom(event.target.value)} className={`${dateInput} w-full sm:w-auto`} />
      <span className="text-xs text-muted">to</span>
      <label className="sr-only" htmlFor="bookings-to">Travel date to</label>
      <input id="bookings-to" type="date" value={to} min={from || undefined} onChange={(event) => setTo(event.target.value)} className={`${dateInput} w-full sm:w-auto`} />
      {(from || to) && (
        <button
          type="button"
          onClick={() => {
            setFrom("");
            setTo("");
          }}
          className="col-span-3 h-10 rounded-control px-2.5 text-xs font-semibold text-muted outline-none transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          Clear dates
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto min-w-0 max-w-[1580px] space-y-5 pb-8">
      <PageHeader
        eyebrow="Operations"
        title="Bookings"
        description={query.isLoading ? "Loading bookings…" : `${bookings.length.toLocaleString("en-US")} bookings · ${pendingCount} waiting for confirmation`}
        actions={
          <Button variant="outline" onClick={() => exportBookingsCsv(rows)} disabled={query.isLoading || rows.length === 0}>
            <Download className="size-4" aria-hidden="true" /> Export CSV
          </Button>
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        caption="Bookings"
        loading={query.isLoading}
        error={query.isError && !query.data}
        onRetry={() => query.refetch()}
        searchPlaceholder="Search customer or booking ID"
        filters={[
          { columnId: "status", label: "Statuses", options: ["Pending", "Confirmed", "Completed", "Cancelled"] },
          { columnId: "paymentStatus", label: "Payments", options: ["Unpaid", "Paid", "Refunded"] },
        ]}
        toolbar={dateFilters}
        onRowClick={openBooking}
        rowActions={rowActions}
        rowLabel={(booking) => `booking ${booking.id} for ${booking.customerName}`}
        canSelectRow={(booking) => booking.status === "Pending"}
        bulkActions={[
          { label: "Confirm selected", tone: "success", onClick: (items, clear) => setBulkSelection({ items, clear }) },
        ]}
        mobileCard={(booking) => <MobileBookingCard booking={booking} />}
        pageSize={10}
        dense
        cardsBelow="xl"
        emptyTitle="No bookings match"
        emptyDescription="Try another name, booking ID, status or date range."
      />

      <BookingDrawer bookingId={selectedId} open={Boolean(selectedId)} onClose={closeBooking} />

      <ConfirmDialog
        open={Boolean(bulkSelection)}
        onClose={() => setBulkSelection(null)}
        onConfirm={confirmSelected}
        loading={bulkConfirm.isPending}
        tone="primary"
        icon={CheckCheck}
        title={`Confirm ${bulkSelection?.items.length ?? 0} pending ${bulkSelection?.items.length === 1 ? "booking" : "bookings"}?`}
        description="Each selected booking moves from Pending to Confirmed. You can undo right after."
        confirmLabel={`Confirm ${bulkSelection?.items.length ?? 0}`}
      />
    </div>
  );
}
