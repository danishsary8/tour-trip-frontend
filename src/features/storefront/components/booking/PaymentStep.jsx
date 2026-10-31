import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { AlertCircle, Banknote, CreditCard, Landmark, LockKeyhole, QrCode, Ticket, Zap } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Spinner } from "../../../../components/ui/Spinner";
import { cn } from "../../../../lib/cn";
import { formatUsd } from "../../../../lib/format";
import { usePayBooking } from "../../../bookings/hooks";
import { isOnlineMethod } from "../../../bookings/api";
import { cancellationHours, customerMethodName, enabledPaymentMethods } from "../../booking";
import { CheckField } from "../FormField";

const ICONS = { cash: Banknote, bankTransfer: Landmark, abaPay: QrCode, creditCard: CreditCard };

/** What each card says, from the same fields the admin edits in Settings → Payment methods. */
function describe(method, booking) {
  const { config } = method;
  switch (method.key) {
    case "cash":
      return { lines: [config.instructions || "Pay your guide in cash on the tour day."], tag: "Pay on the day" };
    case "bankTransfer":
      return {
        lines: [`${config.bankName} · ${config.accountName}`, `Account ${config.accountNumber} · Reference ${booking.id}`],
        tag: "Confirmed after transfer",
      };
    case "abaPay":
      return { lines: ["Scan to pay with the ABA Mobile app.", `Merchant ID ${config.merchantId}`], tag: "Instant confirmation" };
    default:
      return { lines: ["Visa, Mastercard and UnionPay.", `Appears on your statement as ${config.statementDescriptor}`], tag: "Instant confirmation" };
  }
}

/**
 * Step 3: pick one of the payment methods the admin has enabled. Cash and Bank Transfer keep
 * the booking Pending/Unpaid; ABA Pay and Credit Card simulate processing, then confirm it.
 */
export function PaymentStep({ booking, settings, email, onPaid }) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const pay = usePayBooking();
  const methods = enabledPaymentMethods(settings.payments);
  const [choice, setChoice] = useState(methods.length === 1 ? methods[0].name : null);
  const [agreed, setAgreed] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [error, setError] = useState(null);
  const online = isOnlineMethod(choice);
  const busy = phase !== "idle";

  async function submit() {
    if (!choice || !agreed || busy) return;
    setError(null);
    setPhase("processing");
    try {
      const updated = await pay.mutateAsync({ id: booking.id, email, method: choice });
      setPhase("success");
      // Same beat as the login button: show the tick, then move on.
      setTimeout(() => onPaid(updated), reduceMotion ? 150 : 650);
    } catch (failure) {
      setPhase("idle");
      setError(failure.message || "The payment could not be completed.");
      toast.error("Payment not completed", { description: failure.message });
    }
  }

  if (!methods.length) {
    return (
      <div className="rounded-card border border-dashed border-border p-6 text-sm text-muted">
        <p className="font-semibold text-foreground">Online checkout is paused right now.</p>
        <p className="mt-1">Your booking {booking.id} is saved. <Link to="/contact" className="font-semibold text-primary-ink underline-offset-2 hover:underline">Contact us</Link> and we&apos;ll help you pay.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="flex items-start gap-3 rounded-card border border-primary/20 bg-primary/[0.06] p-4 text-sm text-foreground">
        <Ticket className="mt-0.5 size-5 shrink-0 text-primary-ink" aria-hidden="true" />
        <span>
          Booking <strong className="font-semibold tabular-nums">{booking.id}</strong> is saved and your seats are held. Choose how you&apos;d like to pay{" "}
          <strong className="font-semibold tabular-nums">{formatUsd(booking.amount)}</strong>.
        </span>
      </p>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-muted">Payment method</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {methods.map((method) => {
            const Icon = ICONS[method.key];
            const selected = choice === method.name;
            const { lines, tag } = describe(method, booking);
            const instant = isOnlineMethod(method.name);
            return (
              <label
                key={method.key}
                className={cn(
                  "group relative flex cursor-pointer gap-3.5 rounded-card border p-4 transition-[border-color,background-color,box-shadow] duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
                  selected ? "border-primary bg-primary/[0.06]" : "border-border hover:border-primary/45 hover:bg-surface-2/60",
                )}
              >
                <input type="radio" name={`${id}-method`} value={method.name} checked={selected} disabled={busy} onChange={() => setChoice(method.name)} className="sr-only" />
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl transition-colors", selected ? "bg-primary text-white" : "bg-surface-2 text-primary-ink")}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-foreground">{customerMethodName(method.name)}</span>
                    {instant && <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-ink">Simulation</span>}
                  </span>
                  {lines.map((line) => (
                    <span key={line} className="mt-0.5 block break-words text-xs leading-relaxed text-muted">{line}</span>
                  ))}
                  <span className={cn("mt-2 inline-flex items-center gap-1 text-xs font-semibold", instant ? "text-success-ink" : "text-muted")}>
                    {instant && <Zap className="size-3.5" aria-hidden="true" />}
                    {tag}
                  </span>
                </span>
                <span
                  className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors", selected ? "border-primary" : "border-border group-hover:border-primary/50")}
                  aria-hidden="true"
                >
                  <span className={cn("size-2.5 rounded-full bg-primary transition-transform duration-200", selected ? "scale-100" : "scale-0")} />
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {choice && (
        <p className="text-sm text-muted">
          {online
            ? "This is a simulated payment: no real money moves and no card details are collected. Your booking is confirmed straight away."
            : "Your booking stays pending until we receive payment and confirm it. We'll email you as soon as it's confirmed."}
        </p>
      )}

      <CheckField id={`${id}-agree`} checked={agreed} disabled={busy} onChange={(event) => setAgreed(event.target.checked)}>
        I agree to the{" "}
        <Link to="/faq#faq-cancellation" target="_blank" rel="noopener" className="font-semibold text-primary-ink underline underline-offset-2 hover:no-underline">
          cancellation policy
        </Link>
        : free cancellation and a full refund up to {cancellationHours(settings)} hours before departure.
      </CheckField>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-card border border-danger/30 bg-danger/[0.07] p-4 text-sm text-danger-ink">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="space-y-3 border-t border-border pt-6">
        <Button
          size="lg"
          onClick={submit}
          disabled={!choice || !agreed}
          loading={phase === "processing"}
          success={phase === "success"}
          className="w-full rounded-full text-sm sm:ml-auto sm:flex sm:w-auto sm:px-8"
        >
          {online ? <><LockKeyhole className="size-4" aria-hidden="true" /> Pay {formatUsd(booking.amount)} now</> : "Confirm order"}
        </Button>
        {!busy && (!choice || !agreed) && (
          <p className="text-xs text-muted sm:text-right">{!choice ? "Choose a payment method to continue." : "Tick the box to accept the cancellation policy."}</p>
        )}
        <AnimatePresence>
          {phase === "processing" && online && (
            <motion.p
              aria-live="polite"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-sm text-muted sm:justify-end"
            >
              <Spinner label="" /> Contacting {customerMethodName(choice)} securely (simulated)…
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
