import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Check, Compass, Copy, Download, Landmark, Mail, Ticket } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { formatUsd } from "../../../../lib/format";
import { motionEase } from "../../../../lib/motion";
import { downloadInvoice } from "../../../bookings/invoice";
import { customerMethodName, formatTripDate } from "../../booking";
import { BookingSummary } from "./BookingSummary";
import { SuccessCheck } from "./SuccessCheck";
import { outlinePill, primaryPill } from "./styles";

function nextSteps(booking, settings) {
  const amount = formatUsd(booking.amount);
  const date = formatTripDate(booking.travelDate);
  if (booking.paymentStatus === "Paid") {
    return { title: "You're all set!", body: `We received ${amount} by ${customerMethodName(booking.paymentMethod)}. Your seats on ${date} are confirmed.` };
  }
  if (booking.paymentMethod === "Bank Transfer") {
    const bank = settings.payments.bankTransfer;
    return {
      title: "Your booking is reserved",
      body: "Please complete payment to confirm. We'll confirm your seats as soon as your transfer arrives.",
      bank: { ...bank, amount, reference: booking.id },
    };
  }
  return {
    title: "Your booking is reserved",
    body: `Please complete payment to confirm: pay ${amount} in cash to your guide on ${date}. We'll confirm your seats by email shortly.`,
  };
}

/** Step 4: booking number, what happens next, the summary card and the invoice download. */
export function ConfirmationStep({ booking, settings }) {
  const reduceMotion = useReducedMotion();
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const paid = booking.paymentStatus === "Paid";
  const next = nextSteps(booking, settings);
  const reveal = (delay) => (reduceMotion ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay, ease: motionEase } });

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(booking.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy. Your booking number is " + booking.id);
    }
  }

  async function invoice() {
    setDownloading(true);
    try {
      await downloadInvoice(booking, settings);
      toast.success("Invoice downloaded", { description: `tourtrip-invoice-${booking.id}.pdf` });
    } catch {
      toast.error("The invoice could not be created. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col items-center text-center">
        <SuccessCheck tone={paid ? "success" : "pending"} />
        <motion.p {...reveal(0.2)} className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-muted">Booking number</motion.p>
        <motion.div {...reveal(0.25)} className="mt-2 flex items-center gap-2">
          <span className="font-display text-4xl font-semibold tracking-[-0.03em] tabular-nums text-foreground sm:text-5xl">{booking.id}</span>
          <button
            type="button"
            onClick={copyNumber}
            aria-label={copied ? "Booking number copied" : "Copy booking number"}
            className="grid size-9 place-items-center rounded-full text-muted outline-none transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
          >
            {copied ? <Check className="size-4 text-success-ink" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          </button>
        </motion.div>
        <motion.h2 {...reveal(0.3)} className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em] text-balance text-foreground sm:text-3xl">{next.title}</motion.h2>
        <motion.p {...reveal(0.35)} className="mt-3 max-w-xl text-base leading-relaxed text-pretty text-muted">{next.body}</motion.p>
      </div>

      <motion.div {...reveal(0.45)} className="mt-8 space-y-4">
        <p className="flex items-center gap-3 rounded-card border border-info/25 bg-info/[0.07] px-4 py-3 text-sm text-info-ink">
          <Mail className="size-5 shrink-0" aria-hidden="true" />
          <span>
            {settings.email?.bookingConfirmation === false ? "Your booking details are saved in My Bookings." : <>Confirmation email sent to <strong className="font-semibold break-all">{booking.contactEmail}</strong></>}
          </span>
        </p>

        {next.bank && (
          <div className="rounded-card border border-accent/35 bg-accent/[0.08] p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold text-foreground"><Landmark className="size-4 text-accent-ink" aria-hidden="true" /> Bank transfer details</p>
            <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {[["Bank", next.bank.bankName], ["Account name", next.bank.accountName], ["Account number", next.bank.accountNumber], ["Amount", next.bank.amount], ["Reference", next.bank.reference]].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 sm:block">
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="font-semibold tabular-nums text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <BookingSummary booking={booking} />

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:justify-center">
          <Button variant="outline" onClick={invoice} loading={downloading} className="h-12 rounded-full bg-surface px-6 text-foreground hover:border-primary/40 hover:bg-primary/[0.05]">
            <Download className="size-4" aria-hidden="true" /> Download invoice
          </Button>
          <Link to={`/my-bookings?booking=${booking.id}`} className={primaryPill}>
            <Ticket className="size-4" aria-hidden="true" /> View my booking
          </Link>
          <Link to="/tours" className={outlinePill}>
            <Compass className="size-4" aria-hidden="true" /> Continue exploring
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
