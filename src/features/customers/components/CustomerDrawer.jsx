import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarCheck2, ChevronRight, Globe2, Mail, Phone, Power, Wallet } from "lucide-react";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { Drawer } from "../../../components/shared/Drawer";
import { Skeleton } from "../../../components/shared/Skeleton";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { AnimatedNumber } from "../../../components/ui/AnimatedNumber";
import { Button } from "../../../components/ui/Button";
import { formatDate, formatShortDate, formatUsd } from "../../../lib/format";
import { BookingDrawer } from "../../bookings/components/BookingDrawer";
import { useBookings } from "../../bookings/hooks";
import { useCustomerStatus, useCustomers } from "../hooks";
import { summarizeBookings } from "../stats";

const PAGE = 8;

function Stat({ icon: Icon, label, children }) {
  return (
    <div className="rounded-card border border-border bg-surface-2/35 p-3.5">
      <p className="flex items-center gap-1.5 text-xs text-muted">
        <Icon className="size-3.5" aria-hidden="true" /> {label}
      </p>
      <p className="mt-1.5 font-display text-xl font-semibold tabular-nums text-foreground">{children}</p>
    </div>
  );
}

/**
 * Customer profile. Totals and history are computed from the shared bookings cache, so a
 * payment or status change made in the nested booking drawer updates them straight away.
 */
export function CustomerDrawer({ customerId, open, onClose }) {
  const customers = useCustomers();
  const bookingsQuery = useBookings();
  const statusMutation = useCustomerStatus();
  const [bookingId, setBookingId] = useState(null);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [shown, setShown] = useState(PAGE);

  const customer = customers.data?.find((item) => item.id === customerId);
  const history = useMemo(
    () => (bookingsQuery.data ?? []).filter((booking) => booking.customerId === customerId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [bookingsQuery.data, customerId],
  );
  const totals = summarizeBookings(history);
  const active = customer?.status === "Active";
  const loading = customers.isLoading || bookingsQuery.isLoading;

  async function toggleStatus() {
    const status = active ? "Inactive" : "Active";
    try {
      await statusMutation.mutateAsync({ id: customer.id, status });
      toast.success(`${customer.name} is now ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(error.message || "Status could not be changed");
    } finally {
      setConfirmStatus(false);
    }
  }

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        wide
        title={customer?.name ?? "Customer"}
        description={customer ? `Member since ${formatDate(customer.joinedAt)}` : undefined}
        footer={
          customer && (
            <Button
              variant={active ? "outline" : "primary"}
              onClick={() => setConfirmStatus(true)}
              className={active ? "bg-transparent text-danger-ink hover:border-danger/30 hover:bg-danger/10" : undefined}
            >
              <Power className="size-4" aria-hidden="true" /> {active ? "Deactivate customer" : "Activate customer"}
            </Button>
          )
        }
      >
        {loading ? (
          <div className="space-y-4" role="status" aria-label="Loading customer">
            <Skeleton className="h-20 w-full rounded-card" />
            <Skeleton className="h-24 w-full rounded-card" />
            <Skeleton className="h-64 w-full rounded-card" />
          </div>
        ) : !customer ? (
          <p className="text-sm text-muted">This customer could not be found.</p>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/20 font-display text-lg font-bold text-primary-ink">
                {customer.initials}
              </span>
              <div className="min-w-0 space-y-1.5 text-sm">
                <a href={`mailto:${customer.email}`} className="flex items-center gap-2 break-all text-foreground outline-none hover:text-primary-ink focus-visible:text-primary-ink">
                  <Mail className="size-3.5 shrink-0 text-muted" aria-hidden="true" /> {customer.email}
                </a>
                <a href={`tel:${customer.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-foreground outline-none hover:text-primary-ink focus-visible:text-primary-ink">
                  <Phone className="size-3.5 shrink-0 text-muted" aria-hidden="true" /> {customer.phone}
                </a>
                {customer.country && (
                  <p className="flex items-center gap-2 text-muted">
                    <Globe2 className="size-3.5 shrink-0" aria-hidden="true" /> {customer.country}
                  </p>
                )}
              </div>
              <StatusBadge status={customer.status} className="ml-auto self-start" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat icon={CalendarCheck2} label="Bookings">
                <AnimatedNumber value={totals.totalBookings} />
              </Stat>
              <Stat icon={Wallet} label="Total spent">
                <AnimatedNumber value={totals.totalSpent} format={(value) => formatUsd(Math.round(value))} />
              </Stat>
              <Stat icon={CalendarCheck2} label="Upcoming">
                <AnimatedNumber value={totals.upcoming} />
              </Stat>
            </div>

            <section aria-labelledby="customer-history">
              <div className="mb-2 flex items-baseline justify-between">
                <h3 id="customer-history" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Booking history
                </h3>
                {totals.lastBookingDate && <span className="text-xs text-muted">Last booked {formatDate(totals.lastBookingDate)}</span>}
              </div>
              {history.length === 0 ? (
                <p className="rounded-card border border-dashed border-border p-6 text-center text-sm text-muted">No bookings yet.</p>
              ) : (
                <>
                  <ul className="divide-y divide-border overflow-hidden rounded-card border border-border">
                    {history.slice(0, shown).map((booking) => (
                      <li key={booking.id}>
                        <button
                          type="button"
                          onClick={() => setBookingId(booking.id)}
                          className="group flex w-full items-center gap-3 px-3.5 py-3 text-left outline-none transition-colors hover:bg-surface-2/60 focus-visible:bg-surface-2/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50 active:bg-surface-2"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-foreground">{booking.tourPackage}</span>
                            <span className="block text-xs tabular-nums text-muted">
                              {booking.id} · {formatShortDate(booking.travelDate)}
                            </span>
                          </span>
                          <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">{formatUsd(booking.amount)}</span>
                          <StatusBadge status={booking.status} className="hidden shrink-0 sm:inline-flex" />
                          <ChevronRight className="size-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  {history.length > shown && (
                    <button
                      type="button"
                      onClick={() => setShown((count) => count + PAGE)}
                      className="mt-3 w-full rounded-control border border-border py-2 text-xs font-semibold text-muted outline-none transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-[0.99]"
                    >
                      Show more ({history.length - shown} remaining)
                    </button>
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </Drawer>

      <BookingDrawer bookingId={bookingId} open={Boolean(bookingId)} onClose={() => setBookingId(null)} />

      <ConfirmDialog
        open={confirmStatus}
        onClose={() => setConfirmStatus(false)}
        onConfirm={toggleStatus}
        loading={statusMutation.isPending}
        tone={active ? "danger" : "primary"}
        icon={Power}
        title={active ? `Deactivate ${customer?.name}?` : `Activate ${customer?.name}?`}
        description={
          active
            ? "They keep their booking history but will not be able to make new bookings until reactivated."
            : "They will be able to sign in and book tours again."
        }
        confirmLabel={active ? "Deactivate" : "Activate"}
      />
    </>
  );
}
