import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { AlertCircle, ArrowUpRight, CheckCircle2, Clock, Mail, MapPin, Navigation, Phone, Send } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/cn";
import { motionEase } from "../../../lib/motion";
import { PageIntro } from "../components/PageIntro";
import { Reveal, RevealItem } from "../components/Reveal";
import { WhatsappIcon } from "../components/SocialIcons";
import { CONTACT, SOCIAL_LINKS } from "../content";
import { useContactMessage } from "../hooks";
import { CONTACT_SUBJECTS, contactSchema } from "../schema";

const MESSAGE_MAX = 1000;
const SELECT_ARROW = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a9a9c' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>")`;
const fieldClass =
  "w-full rounded-xl border bg-surface-2/60 px-4 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-muted/70 hover:bg-surface-2 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20";

function Field({ id, label, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </label>
        {hint}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1 text-xs text-danger-ink">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function ContactForm() {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const send = useContactMessage();
  const [sent, setSent] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });
  const messageLength = useWatch({ control, name: "message" })?.length ?? 0;

  const describe = (name) => (errors[name] ? `${id}-${name}-error` : undefined);
  const invalid = (name) => (errors[name] ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border");

  function onSubmit(values) {
    send.mutate(values, {
      onSuccess: ({ reference }) => {
        setSent({ name: values.name.split(" ")[0], email: values.email, reference });
        reset();
        toast.success("Message sent", { description: `Reference ${reference}. We'll reply to ${values.email}.` });
      },
      onError: () => toast.error("We couldn't send your message", { description: "Please try again, or message us on WhatsApp." }),
    });
  }

  const swap = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.35, ease: motionEase } };

  return (
    <div className="rounded-panel border border-border bg-surface p-6 sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="sent" {...swap} className="flex min-h-[460px] flex-col items-center justify-center text-center" role="status">
            <span className="grid size-16 place-items-center rounded-full bg-success/15 text-success-ink">
              <CheckCircle2 className="size-8" aria-hidden="true" />
            </span>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.03em] text-foreground">Thanks, {sent.name}. Message received</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              We&apos;ll reply to <span className="font-semibold text-foreground">{sent.email}</span> within two working hours (8 am – 8 pm, Phnom Penh time).
            </p>
            <p className="mt-5 rounded-full border border-border bg-surface-2/60 px-4 py-1.5 font-mono text-sm tracking-wider text-foreground">{sent.reference}</p>
            <Button variant="ghost" className="mt-8 border border-border hover:bg-foreground/[0.06]" onClick={() => setSent(null)}>
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form key="form" {...swap} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" aria-labelledby={`${id}-title`}>
            <div>
              <h2 id={`${id}-title`} className="font-display text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
                Send us a message
              </h2>
              <p className="mt-1.5 text-sm text-muted">Questions about a tour, a booking or a private trip. A real person reads every one.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`${id}-name`} label="Your name" error={errors.name?.message}>
                <input
                  id={`${id}-name`}
                  autoComplete="name"
                  placeholder="Sophie Laurent"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describe("name")}
                  {...register("name")}
                  className={cn(fieldClass, "h-12", invalid("name"))}
                />
              </Field>
              <Field id={`${id}-email`} label="Email" error={errors.email?.message}>
                <input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describe("email")}
                  {...register("email")}
                  className={cn(fieldClass, "h-12", invalid("email"))}
                />
              </Field>
            </div>
            <Field id={`${id}-subject`} label="Subject" error={errors.subject?.message}>
              <select
                id={`${id}-subject`}
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={describe("subject")}
                {...register("subject")}
                style={{ backgroundImage: SELECT_ARROW, backgroundSize: 18, backgroundPosition: "right 14px center", backgroundRepeat: "no-repeat" }}
                className={cn(fieldClass, "h-12 cursor-pointer appearance-none pr-10", invalid("subject"))}
              >
                <option value="" disabled>
                  What&apos;s it about?
                </option>
                {CONTACT_SUBJECTS.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </Field>
            <Field
              id={`${id}-message`}
              label="Message"
              error={errors.message?.message}
              hint={
                <span className={cn("text-xs tabular-nums", messageLength > MESSAGE_MAX ? "text-danger-ink" : "text-muted")} aria-hidden="true">
                  {messageLength}/{MESSAGE_MAX}
                </span>
              }
            >
              <textarea
                id={`${id}-message`}
                rows={6}
                placeholder="Tell us your dates, how many of you are travelling and anything we should know."
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describe("message")}
                {...register("message")}
                className={cn(fieldClass, "min-h-40 resize-y py-3 leading-relaxed", invalid("message"))}
              />
            </Field>
            <div className="flex flex-col-reverse gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted">We only use your details to reply. No newsletters unless you ask.</p>
              <Button type="submit" size="lg" loading={send.isPending} className="rounded-full px-7">
                <Send className="size-4" aria-hidden="true" /> Send message
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const infoLink =
  "rounded font-semibold text-foreground outline-none transition-colors hover:text-primary-ink focus-visible:ring-2 focus-visible:ring-primary/60";

function ContactDetails() {
  return (
    <Reveal stagger as="ul" className="grid border-t border-foreground/80 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1">
      <RevealItem as="li" className="flex gap-4 border-b border-border py-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/25 text-primary-ink">
          <Phone className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Call or WhatsApp</p>
          <p className="mt-1">
            <a href={CONTACT.phoneHref} className={infoLink}>
              {CONTACT.phone}
            </a>
          </p>
          <p className="mt-0.5">
            <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className={cn(infoLink, "inline-flex items-center gap-1.5")}>
              <WhatsappIcon className="size-4 text-[#25d366]" /> {CONTACT.whatsapp}
            </a>
          </p>
        </div>
      </RevealItem>
      <RevealItem as="li" className="flex gap-4 border-b border-border py-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/25 text-primary-ink">
          <Mail className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Email</p>
          <p className="mt-1">
            <a href={`mailto:${CONTACT.email}`} className={infoLink}>
              {CONTACT.email}
            </a>
          </p>
          <p className="mt-0.5 text-muted">Replies within 2 working hours</p>
        </div>
      </RevealItem>
      <RevealItem as="li" className="flex gap-4 border-b border-border py-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/25 text-primary-ink">
          <MapPin className="size-5" aria-hidden="true" />
        </span>
        <address className="min-w-0 text-sm not-italic">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Office</p>
          {CONTACT.addressLines.map((line, index) => (
            <p key={line} className={index === 0 ? "mt-1 font-semibold text-foreground" : "text-muted"}>
              {line}
            </p>
          ))}
        </address>
      </RevealItem>
      <RevealItem as="li" className="flex gap-4 border-b border-border py-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/25 text-primary-ink">
          <Clock className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Opening hours</p>
          <dl className="mt-1 space-y-0.5">
            {CONTACT.hours.map((row) => (
              <div key={row.days} className="flex flex-wrap justify-between gap-x-4">
                <dt className="text-muted">{row.days}</dt>
                <dd className="font-semibold tabular-nums text-foreground">{row.time}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs leading-relaxed text-muted">{CONTACT.hoursNote}</p>
        </div>
      </RevealItem>
    </Reveal>
  );
}

/** Stylised map of central Phnom Penh (no map API): street grid, the riverfront and an office pin. */
function MapCard() {
  return (
    <Reveal className="relative isolate h-96 overflow-hidden rounded-panel border border-border bg-surface-2">
      <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 -z-10 size-full" aria-hidden="true">
        <defs>
          <pattern id="contact-map-grid" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
            <path d="M44 0H0v44" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-foreground/[0.08]" />
          </pattern>
        </defs>
        <rect width="800" height="400" fill="url(#contact-map-grid)" />
        {/* Main boulevards */}
        <path d="M-20 250 L820 150" stroke="currentColor" strokeWidth="9" className="text-surface" />
        <path d="M250 -20 L330 420" stroke="currentColor" strokeWidth="9" className="text-surface" />
        <path d="M470 -20 L520 420" stroke="currentColor" strokeWidth="6" className="text-surface" />
        {/* Tonlé Sap and Mekong riverfront */}
        <path d="M640 -20 C 600 80, 690 170, 640 260 S 610 380, 660 430 L 900 430 L 900 -20 Z" className="fill-info/20" />
        <path d="M640 -20 C 600 80, 690 170, 640 260 S 610 380, 660 430" fill="none" stroke="currentColor" strokeWidth="2" className="text-info/40" />
        {/* Royal Palace grounds */}
        <rect x="520" y="200" width="80" height="62" rx="8" className="fill-accent/25" transform="rotate(-8 560 231)" />
        {/* Independence Monument park */}
        <circle cx="330" cy="300" r="26" className="fill-success/20" />
      </svg>
      <span className="absolute left-[64%] top-[44%] text-[10px] font-semibold uppercase tracking-[0.16em] text-muted" aria-hidden="true">
        Royal Palace
      </span>
      <span className="absolute right-6 top-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-info-ink" aria-hidden="true">
        Tonlé Sap
      </span>

      {/* Office pin */}
      <div className="absolute left-[50%] top-[40%] sm:top-[46%] -translate-x-1/2 -translate-y-full" aria-hidden="true">
        <span className="absolute bottom-0 left-1/2 size-5 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/40 motion-safe:animate-ping" />
        <span className="relative grid size-12 place-items-center rounded-full rounded-br-none bg-primary text-white shadow-glow [transform:rotate(45deg)]">
          <MapPin className="size-5 [transform:rotate(-45deg)]" />
        </span>
      </div>

      <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-card border border-border bg-surface/90 p-4 shadow-soft backdrop-blur-md sm:inset-x-auto sm:left-4 sm:max-w-sm">
        <div>
          <p className="font-display text-base font-semibold text-foreground">TourTrip office · Street 240</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">{CONTACT.landmark}</p>
        </div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Street+240+Phnom+Penh"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white outline-none transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          <Navigation className="size-3.5" aria-hidden="true" /> Get directions
          <span className="sr-only">(opens Google Maps)</span>
        </a>
      </div>
    </Reveal>
  );
}

function WhatsappCard() {
  return (
    <Reveal className="dark relative flex-1 overflow-hidden rounded-panel bg-background p-6 text-white">
      <div className="relative flex h-full flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#25d366] text-[#0b1215]">
            <WhatsappIcon className="size-6" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold">Quicker on WhatsApp</p>
            <p className="text-xs text-white/70">Usually a reply within 15 minutes</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-white/80">Send a photo of your hotel, a voice note or a quick question. It's how most of our guests already talk to us.</p>
        <a
          href={CONTACT.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#1a1f21] outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0"
        >
          Chat on WhatsApp <ArrowUpRight className="size-4" aria-hidden="true" />
          <span className="sr-only">(opens WhatsApp)</span>
        </a>
      </div>
    </Reveal>
  );
}

function Socials() {
  return (
    <Reveal className="border-t border-foreground/80 pt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Follow the journey</p>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {SOCIAL_LINKS.map(({ label, handle, Icon }) => (
          <li key={label}>
            {/* Placeholder profiles until TourTrip's real accounts exist. */}
            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              className="group flex items-center gap-3 rounded-card px-2 py-2.5 outline-none transition-colors duration-300 hover:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              <Icon className="size-[18px] shrink-0 text-muted transition-colors group-hover:text-primary-ink" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">{label}</span>
                <span className="block truncate text-xs text-muted">{handle}</span>
              </span>
              <ArrowUpRight className="ml-auto size-3.5 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

/** Contact: validated message form, office details and hours, a stylised map and social links. */
export default function ContactPage() {
  return (
    <>
      <PageIntro breadcrumbs={[{ label: "Contact" }]} eyebrow="Contact us" title="Talk to a real person in Phnom Penh">
        Planning a trip, changing a booking or just wondering if the temples are busy in April? Message, call or drop by the office. We&apos;re two minutes from the Royal Palace.
      </PageIntro>
      <div className="mx-auto grid max-w-[1320px] gap-6 px-5 pb-24 sm:pb-32 lg:grid-cols-[1.25fr_1fr] lg:gap-8 lg:px-8">
        <Reveal>
          <ContactForm />
        </Reveal>
        <ContactDetails />
        <div className="space-y-6 lg:col-span-2 lg:grid lg:grid-cols-[1.25fr_1fr] lg:gap-8 lg:space-y-0">
          <MapCard />
          <div className="flex flex-col gap-6">
            <WhatsappCard />
            <Socials />
          </div>
        </div>
      </div>
    </>
  );
}
