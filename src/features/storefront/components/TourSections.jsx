import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Clock3, Languages, MapPin, Sunrise, Users, Waves, X } from "lucide-react";
import { Tabs, tabId, tabPanelId } from "../../../components/shared/Tabs";
import { Reveal } from "./Reveal";
import { TourReviews } from "./TourReviews";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "itinerary", label: "Itinerary" },
  { value: "included", label: "Included / Excluded" },
  { value: "reviews", label: "Reviews" },
];
const DAY_ICONS = [Sunrise, Waves, MapPin];

function Fact({ icon: Icon, label, value }) {
  return <div className="flex min-w-0 items-start gap-3 rounded-card border border-border bg-surface p-4 sm:p-5">
    <span className="grid size-10 shrink-0 place-items-center rounded-control bg-primary/10 text-primary-ink"><Icon className="size-4.5" aria-hidden="true" /></span>
    <div className="min-w-0"><dt className="text-[11px] font-semibold uppercase tracking-[0.11em] text-muted">{label}</dt><dd className="mt-1 text-sm font-semibold leading-snug text-foreground">{value}</dd></div>
  </div>;
}

function Overview({ tour, story }) {
  return <div className="space-y-8"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-ink">The experience</p>
    <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">A closer look at the journey</h2>
    <p className="mt-5 max-w-3xl text-[15px] leading-8 text-muted sm:text-base">{story.overview}</p></div>
    <dl className="grid gap-3 sm:grid-cols-2">
      <Fact icon={Users} label="Group size" value={`Up to ${tour.groupSize} travellers`} />
      <Fact icon={Clock3} label="Duration" value={tour.durationLabel} />
      <Fact icon={Languages} label="Languages" value={story.languages.join(" · ")} />
      <Fact icon={MapPin} label="Meeting point" value={story.meetingPoint} />
    </dl></div>;
}

function Itinerary({ days }) {
  const [openDays, setOpenDays] = useState(() => new Set([0]));
  const reduceMotion = useReducedMotion();
  function toggle(index) { setOpenDays((current) => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next; }); }
  return <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-ink">Day by day</p>
    <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">The route, at your pace</h2>
    <p className="mt-3 text-sm leading-relaxed text-muted">Open each day to see what&apos;s planned. Your local guide may adjust the order for weather or the best light.</p>
    <ol className="relative mt-8 space-y-4 border-l border-primary/25 pl-5 sm:pl-8">{days.map((day, index) => { const Icon = DAY_ICONS[index % DAY_ICONS.length]; const open = openDays.has(index); return <li key={`${index}-${day.title}`} className="relative">
      <span className="absolute -left-[34px] top-4 grid size-7 place-items-center rounded-full border border-primary/30 bg-background text-primary-ink sm:-left-[46px]"><Icon className="size-3.5" aria-hidden="true" /></span>
      <div className="overflow-hidden rounded-card border border-border bg-surface transition-colors hover:border-primary/30">
        <button type="button" onClick={() => toggle(index)} aria-expanded={open} aria-controls={`tour-day-${index}`}
          className="flex w-full items-center gap-4 px-4 py-4 text-left outline-none transition-colors hover:bg-surface-2/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary active:bg-primary/[0.06] sm:px-6 sm:py-5">
          <span className="font-display text-xl font-semibold tabular-nums text-primary-ink">{String(index + 1).padStart(2, "0")}</span>
          <span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold uppercase tracking-widest text-muted">Day {index + 1}</span><span className="mt-1 block font-display text-lg font-semibold text-foreground">{day.title}</span></span>
          <ChevronDown className={`size-5 shrink-0 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        <AnimatePresence initial={false}>{open && <motion.div id={`tour-day-${index}`} initial={reduceMotion ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.35 }} className="overflow-hidden">
          <p className="border-t border-border px-4 py-4 text-sm leading-7 text-muted sm:px-6">{day.description}</p>
        </motion.div>}</AnimatePresence>
      </div>
    </li>; })}</ol></div>;
}

function Included({ included, excluded }) {
  return <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-ink">The details</p>
    <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">What&apos;s part of the experience</h2>
    <div className="mt-7 grid gap-4 sm:grid-cols-2">
      <section className="rounded-panel border border-success/20 bg-success/[0.045] p-5 sm:p-7"><h3 className="font-display text-xl font-semibold text-foreground">Included</h3><ul className="mt-5 space-y-4">{included.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground"><Check className="mt-0.5 size-4 shrink-0 text-success-ink" aria-hidden="true" />{item}</li>)}</ul></section>
      <section className="rounded-panel border border-danger/20 bg-danger/[0.035] p-5 sm:p-7"><h3 className="font-display text-xl font-semibold text-foreground">Not included</h3><ul className="mt-5 space-y-4">{excluded.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground"><X className="mt-0.5 size-4 shrink-0 text-danger-ink" aria-hidden="true" />{item}</li>)}</ul></section>
    </div></div>;
}

export function TourSections({ tour, story, reviews }) {
  const [active, setActive] = useState("overview");
  const reduceMotion = useReducedMotion();
  return <Reveal className="min-w-0"><Tabs tabs={TABS} value={active} onChange={setActive} label="Tour details" idPrefix="tour-detail" className="sticky top-16 z-20 bg-background/95 backdrop-blur-md sm:top-20" />
    <AnimatePresence mode="wait" initial={false}><motion.div key={active} role="tabpanel" id={tabPanelId("tour-detail", active)} aria-labelledby={tabId("tour-detail", active)}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduceMotion ? 0 : 0.4 }}
      className="min-h-80 py-8 sm:py-10">
      {active === "overview" && <Overview tour={tour} story={story} />}
      {active === "itinerary" && <Itinerary days={story.itinerary} />}
      {active === "included" && <Included included={story.included} excluded={story.excluded} />}
      {active === "reviews" && <TourReviews reviews={reviews} />}
    </motion.div></AnimatePresence>
  </Reveal>;
}
