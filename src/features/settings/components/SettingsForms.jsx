import { useId } from "react";
import { Link } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { AlertCircle, Banknote, CreditCard, Landmark, Lock, Smartphone } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Switch } from "../../../components/ui/Switch";
import { cn } from "../../../lib/cn";
import { useSaveSettings } from "../hooks";
import { PAYMENT_METHOD_LABELS, emailSchema, generalSchema, otherSchema, paymentsSchema } from "../schema";

// Same input styling as the Masters and Customers drawers.
const field =
  "w-full rounded-control border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted hover:border-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-danger/70 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border";

function Field({ label, hint, error, children, id }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1 text-xs text-danger-ink">
          {error.message}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

/**
 * Card around one settings form: title, fields and a footer whose Save button only enables
 * when something changed. Saving shows a toast and makes the saved values the new baseline.
 */
function useSettingsForm(section, schema, defaultValues, successMessage) {
  const save = useSaveSettings();
  const form = useForm({ resolver: zodResolver(schema), defaultValues, mode: "onTouched" });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await save.mutateAsync({ section, values });
      form.reset(values);
      toast.success(successMessage, { description: "Mock settings: saved for this browser session." });
    } catch (error) {
      toast.error(error.message || "Settings could not be saved");
    }
  });

  return { form, onSubmit, saving: save.isPending };
}

function SettingsCard({ title, description, form, onSubmit, saving, children }) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const dirty = form.formState.isDirty;

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={titleId} className="overflow-hidden rounded-card border border-border bg-surface shadow-soft">
      <header className="border-b border-border px-5 py-4 sm:px-6">
        <h2 id={titleId} className="font-display text-lg font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h2>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </header>
      <div className="space-y-5 px-5 py-6 sm:px-6">{children}</div>
      <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-border bg-surface-2/30 px-5 py-3.5 sm:px-6">
        <AnimatePresence>
          {dirty && (
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="mr-auto inline-flex items-center gap-2 text-xs font-medium text-accent-ink"
              aria-live="polite"
            >
              <span className="size-2 rounded-full bg-accent" aria-hidden="true" /> Unsaved changes
            </motion.span>
          )}
        </AnimatePresence>
        <Button
          variant="outline"
          size="sm"
          className="h-10 bg-transparent hover:bg-foreground/[0.06]"
          onClick={() => form.reset()}
          disabled={!dirty || saving}
        >
          Discard
        </Button>
        <Button type="submit" size="sm" className="h-10" loading={saving} disabled={!dirty}>
          Save changes
        </Button>
      </footer>
    </form>
  );
}

export function GeneralSettingsForm({ values }) {
  const { form, onSubmit, saving } = useSettingsForm("general", generalSchema, values, "General settings saved");
  const { register, formState: { errors } } = form;
  const ids = { name: useId(), email: useId(), phone: useId(), currency: useId(), timezone: useId() };

  return (
    <SettingsCard title="General" description="How TourTrip introduces itself to travellers." form={form} onSubmit={onSubmit} saving={saving}>
      <Field id={ids.name} label="Site name" error={errors.siteName}>
        <input id={ids.name} {...register("siteName")} className={field} aria-invalid={Boolean(errors.siteName)} />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id={ids.email} label="Contact email" hint="Shown on invoices and the contact page." error={errors.contactEmail}>
          <input id={ids.email} type="email" autoComplete="email" {...register("contactEmail")} className={field} aria-invalid={Boolean(errors.contactEmail)} />
        </Field>
        <Field id={ids.phone} label="Contact phone" error={errors.contactPhone}>
          <input id={ids.phone} type="tel" autoComplete="tel" {...register("contactPhone")} className={field} aria-invalid={Boolean(errors.contactPhone)} />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id={ids.currency} label="Default currency" hint="All prices and reports use US dollars (domain rule).">
          <div className="relative">
            <select id={ids.currency} value={values.currency} disabled className={cn(field, "appearance-none pr-10")}>
              <option value="USD">USD — US dollar ($)</option>
            </select>
            <Lock className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          </div>
        </Field>
        <Field id={ids.timezone} label="Timezone" hint="Display only; set by the server.">
          <div className="relative">
            <input id={ids.timezone} value={values.timezone} readOnly disabled className={cn(field, "pr-10")} />
            <Lock className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          </div>
        </Field>
      </div>
    </SettingsCard>
  );
}

const METHODS = [
  { key: "cash", icon: Banknote, description: "Travellers pay their guide on the tour day." },
  { key: "bankTransfer", icon: Landmark, description: "Travellers transfer before the tour using the details below." },
  { key: "abaPay", icon: Smartphone, description: "Simulated ABA Pay QR checkout. No real payment is taken." },
  { key: "creditCard", icon: CreditCard, description: "Simulated card checkout. No real card is charged." },
];

function MethodPanel({ method, control, register, errors, children }) {
  const enabled = useWatch({ control, name: `${method.key}.enabled` });
  const Icon = method.icon;
  return (
    <section className={cn("rounded-card border p-4 transition-colors duration-200", enabled ? "border-primary/25 bg-primary/[0.04]" : "border-border bg-surface-2/30")}>
      <div className="flex items-start gap-3">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl transition-colors", enabled ? "bg-primary/12 text-primary-ink" : "bg-foreground/[0.06] text-muted")}>
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <Controller
          control={control}
          name={`${method.key}.enabled`}
          render={({ field: { value, onChange, ref } }) => (
            <Switch
              ref={ref}
              checked={value}
              onCheckedChange={onChange}
              label={PAYMENT_METHOD_LABELS[method.key]}
              description={method.description}
              className="flex-1"
            />
          )}
        />
      </div>
      {children && <div className={cn("mt-4 grid gap-4 sm:grid-cols-2 sm:pl-[52px]", !enabled && "opacity-60")}>{children({ register, errors, enabled })}</div>}
    </section>
  );
}

export function PaymentSettingsForm({ values }) {
  const { form, onSubmit, saving } = useSettingsForm("payments", paymentsSchema, values, "Payment methods saved");
  const { control, register, formState: { errors } } = form;
  const ids = { cash: useId(), bank: useId(), account: useId(), number: useId(), merchant: useId(), descriptor: useId() };

  return (
    <SettingsCard title="Payment methods" description="Choose which of the four payment methods customers can use at checkout." form={form} onSubmit={onSubmit} saving={saving}>
      {errors.root && (
        <p role="alert" className="flex items-center gap-2 rounded-control border border-danger/30 bg-danger/[0.06] px-3.5 py-2.5 text-sm text-danger-ink">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" /> {errors.root.message}
        </p>
      )}
      <MethodPanel method={METHODS[0]} control={control} register={register} errors={errors}>
        {() => (
          <div className="sm:col-span-2">
            <Field id={ids.cash} label="Instructions shown at checkout" error={errors.cash?.instructions}>
              <input id={ids.cash} {...register("cash.instructions")} className={field} aria-invalid={Boolean(errors.cash?.instructions)} />
            </Field>
          </div>
        )}
      </MethodPanel>
      <MethodPanel method={METHODS[1]} control={control} register={register} errors={errors}>
        {() => (
          <>
            <Field id={ids.bank} label="Bank name" error={errors.bankTransfer?.bankName}>
              <input id={ids.bank} {...register("bankTransfer.bankName")} className={field} aria-invalid={Boolean(errors.bankTransfer?.bankName)} />
            </Field>
            <Field id={ids.account} label="Account name" error={errors.bankTransfer?.accountName}>
              <input id={ids.account} {...register("bankTransfer.accountName")} className={field} aria-invalid={Boolean(errors.bankTransfer?.accountName)} />
            </Field>
            <Field id={ids.number} label="Account number" hint="Mock value for display." error={errors.bankTransfer?.accountNumber}>
              <input id={ids.number} inputMode="numeric" {...register("bankTransfer.accountNumber")} className={field} aria-invalid={Boolean(errors.bankTransfer?.accountNumber)} />
            </Field>
          </>
        )}
      </MethodPanel>
      <MethodPanel method={METHODS[2]} control={control} register={register} errors={errors}>
        {() => (
          <Field id={ids.merchant} label="Merchant ID" hint="Simulation only." error={errors.abaPay?.merchantId}>
            <input id={ids.merchant} {...register("abaPay.merchantId")} className={field} aria-invalid={Boolean(errors.abaPay?.merchantId)} />
          </Field>
        )}
      </MethodPanel>
      <MethodPanel method={METHODS[3]} control={control} register={register} errors={errors}>
        {() => (
          <Field id={ids.descriptor} label="Statement descriptor" hint="Up to 22 characters on the card statement." error={errors.creditCard?.statementDescriptor}>
            <input id={ids.descriptor} {...register("creditCard.statementDescriptor")} className={field} aria-invalid={Boolean(errors.creditCard?.statementDescriptor)} />
          </Field>
        )}
      </MethodPanel>
    </SettingsCard>
  );
}

const NOTIFICATIONS = [
  { name: "bookingConfirmation", label: "Booking confirmation", description: "When an admin confirms a booking." },
  { name: "paymentReceived", label: "Payment received", description: "When a booking is marked as paid." },
  { name: "cancellation", label: "Cancellation", description: "When a booking is rejected or cancelled, including the reason." },
  { name: "reviewRequest", label: "Review request", description: "The day after a tour is completed." },
];

export function EmailSettingsForm({ values }) {
  const { form, onSubmit, saving } = useSettingsForm("email", emailSchema, values, "Email settings saved");
  const { control, register, formState: { errors } } = form;
  const ids = { name: useId(), email: useId() };

  return (
    <SettingsCard title="Email" description="Which emails customers receive. Mock only — no emails are actually sent." form={form} onSubmit={onSubmit} saving={saving}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id={ids.name} label="From name" error={errors.fromName}>
          <input id={ids.name} {...register("fromName")} className={field} aria-invalid={Boolean(errors.fromName)} />
        </Field>
        <Field id={ids.email} label="From email" error={errors.fromEmail}>
          <input id={ids.email} type="email" {...register("fromEmail")} className={field} aria-invalid={Boolean(errors.fromEmail)} />
        </Field>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-foreground">Customer notifications</legend>
        <div className="divide-y divide-border rounded-card border border-border">
          {NOTIFICATIONS.map((item) => (
            <Controller
              key={item.name}
              control={control}
              name={item.name}
              render={({ field: { value, onChange, ref } }) => (
                <Switch ref={ref} checked={value} onCheckedChange={onChange} label={item.label} description={item.description} className="px-4 py-3.5" />
              )}
            />
          ))}
        </div>
      </fieldset>
    </SettingsCard>
  );
}

export function OtherSettingsForm({ values }) {
  const { form, onSubmit, saving } = useSettingsForm("other", otherSchema, values, "Booking policy saved");
  const { control, register, formState: { errors } } = form;
  const windowId = useId();

  return (
    <SettingsCard title="Other settings" description="Booking and review policies." form={form} onSubmit={onSubmit} saving={saving}>
      <div className="max-w-xs">
        <Field id={windowId} label="Free cancellation window" hint="Days before the tour when customers can still cancel for free." error={errors.cancellationWindowDays}>
          <div className="relative">
            <input
              id={windowId}
              type="number"
              min={0}
              max={60}
              inputMode="numeric"
              {...register("cancellationWindowDays", { valueAsNumber: true })}
              className={cn(field, "pr-14")}
              aria-invalid={Boolean(errors.cancellationWindowDays)}
            />
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">days</span>
          </div>
        </Field>
      </div>
      <div className="divide-y divide-border rounded-card border border-border">
        <Controller
          control={control}
          name="guestCheckout"
          render={({ field: { value, onChange, ref } }) => (
            <Switch ref={ref} checked={value} onCheckedChange={onChange} label="Allow guest checkout" description="Travellers can book without creating an account." className="px-4 py-3.5" />
          )}
        />
        <Controller
          control={control}
          name="reviewsRequireApproval"
          render={({ field: { value, onChange, ref } }) => (
            <Switch
              ref={ref}
              checked={value}
              onCheckedChange={onChange}
              label="Reviews require approval"
              description={
                <>
                  New reviews wait in the{" "}
                  <Link to="/admin/reviews" className="rounded font-semibold text-primary-ink underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/60">
                    Reviews moderation queue
                  </Link>{" "}
                  until an admin approves them. Display only for now.
                </>
              }
              className="px-4 py-3.5"
            />
          )}
        />
      </div>
    </SettingsCard>
  );
}
