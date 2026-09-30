import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Check, Minus, Plus, ShieldCheck, X } from "lucide-react";
import { useEscapeLayer } from "../../../hooks/useEscapeLayer";
import { useFocusTrap } from "../../../hooks/useFocusTrap";
import { formatUsd } from "../../../lib/format";
import { CANCELLATION_WINDOW } from "../content";
import { seatTone, seatsLeft, upcomingSchedules } from "../booking";

const dateFormat = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const readableDate = (value) => dateFormat.format(new Date(`${value}T12:00:00Z`));
/** Traveller +/- stepper; also used by the booking wizard's details step. */
export function Counter({ label, value, onChange, min, max }) {
  return <div className="flex items-center justify-between gap-4 py-3"><span className="text-sm font-medium text-foreground">{label}</span><div className="flex items-center gap-3">
    <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label={`Remove one ${label.toLowerCase()}`} className="grid size-9 place-items-center rounded-full border border-border text-foreground outline-none transition-colors hover:border-primary hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"><Minus className="size-4" /></button>
    <output aria-label={`${label}: ${value}`} className="w-5 text-center text-sm font-semibold tabular-nums text-foreground">{value}</output>
    <button type="button" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label={`Add one ${label.toLowerCase()}`} className="grid size-9 place-items-center rounded-full border border-border text-foreground outline-none transition-colors hover:border-primary hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"><Plus className="size-4" /></button>
  </div></div>;
}

function Picker({ tour, schedules, selected, onSelect, adults, setAdults, childrenCount, setChildrenCount, onBook }) {
  const available = selected ? seatsLeft(selected) : 0;
  const maxTravelers = Math.min(tour.groupSize, available || tour.groupSize);
  const total = (adults + childrenCount) * (selected?.priceOverride ?? tour.price);
  return <div><div className="flex items-baseline gap-2"><span className="font-display text-3xl font-semibold text-foreground">{formatUsd(tour.price)}</span><span className="text-sm text-muted">/ traveller</span></div>
    <p className="mt-1 text-xs text-muted">Pick a departure below. Seat counts are live.</p>
    <h3 className="mt-6 flex items-center gap-2 text-sm font-semibold text-foreground"><CalendarDays className="size-4 text-primary-ink" aria-hidden="true" />Available departures</h3>
    {schedules.length ? <div className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1" role="group" aria-label="Departure dates">{schedules.map((schedule) => { const left = seatsLeft(schedule); const active = selected?.id === schedule.id; return <button key={schedule.id} type="button" disabled={left === 0} aria-pressed={active} onClick={() => onSelect(schedule)} className={`w-full rounded-control border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 ${active ? "border-primary bg-primary/[0.08]" : "border-border hover:border-primary/50 hover:bg-surface-2"}`}>
      <span className="flex items-center justify-between gap-2 text-sm font-semibold text-foreground"><span>{readableDate(schedule.date)} · {schedule.time}</span>{active && <Check className="size-4 text-primary-ink" aria-hidden="true" />}</span>
      <span className="mt-2 block text-xs text-muted">{left ? `${left} seat${left === 1 ? "" : "s"} left` : "Sold out"}</span><span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-border" aria-hidden="true"><span className={`block h-full rounded-full ${seatTone(schedule)}`} style={{ width: `${schedule.seatsBooked / schedule.capacity * 100}%` }} /></span>
    </button>; })}</div> : <p className="mt-3 rounded-control border border-dashed border-border p-4 text-sm text-muted">No departures scheduled yet. <Link to="/contact" className="font-semibold text-primary-ink underline-offset-2 hover:underline">Ask us about private dates</Link> or check back soon.</p>}
    <div className="mt-5 border-t border-border pt-2"><Counter label="Adults" value={adults} min={1} max={Math.max(1, maxTravelers - childrenCount)} onChange={setAdults} /><Counter label="Children" value={childrenCount} min={0} max={Math.max(0, maxTravelers - adults)} onChange={setChildrenCount} /></div>
    <div className="mt-3 flex items-center justify-between border-t border-border pt-5"><span className="text-sm font-semibold text-foreground">Total for {adults + childrenCount} traveller{adults + childrenCount === 1 ? "" : "s"}</span><strong className="font-display text-2xl text-foreground">{formatUsd(total)}</strong></div>
    <button type="button" disabled={!selected || adults + childrenCount > available} onClick={onBook} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow outline-none transition-all hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">Book now <ArrowRight className="size-4" aria-hidden="true" /></button>
    <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted"><ShieldCheck className="size-3.5 text-success-ink" aria-hidden="true" /> Free cancellation up to {CANCELLATION_WINDOW} before</p>
  </div>;
}

function MobileSheet({ onClose, children }) {
  const panel = useRef(null);
  const close = useRef(null);
  const reduceMotion = useReducedMotion();
  useFocusTrap(panel, true, { initialFocusRef: close });
  useEscapeLayer(true, onClose);
  useEffect(() => { const old = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = old; }; }, []);
  return <div className="fixed inset-0 z-[75] lg:hidden"><motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true" />
    <motion.section ref={panel} role="dialog" aria-modal="true" aria-label="Choose departure and travellers" initial={reduceMotion ? { opacity: 0 } : { y: "100%" }} animate={{ y: 0, opacity: 1 }} exit={reduceMotion ? { opacity: 0 } : { y: "100%" }} transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-panel border border-border bg-surface px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 shadow-panel">
      <div className="mb-4 flex items-center justify-between"><span className="h-1.5 w-10 rounded-full bg-border" aria-hidden="true" /><button ref={close} type="button" onClick={onClose} aria-label="Close booking options" className="grid size-9 place-items-center rounded-full text-muted outline-none transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary active:scale-95"><X className="size-5" /></button></div>{children}
    </motion.section></div>;
}

export function BookingCard({ tour, schedules, onBook }) {
  const [selected, setSelected] = useState(null);
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [open, setOpen] = useState(false);
  const future = upcomingSchedules(schedules);
  const choose = (schedule) => { setSelected(schedule); if (adults + childrenCount > seatsLeft(schedule)) { setAdults(1); setChildrenCount(0); } };
  const submit = () => { if (selected && seatsLeft(selected) >= adults + childrenCount) { setOpen(false); onBook({ date: selected.date, adults, children: childrenCount }); } };
  const props = { tour, schedules: future, selected, onSelect: choose, adults, setAdults, childrenCount, setChildrenCount, onBook: submit };
  return <><aside aria-label="Book this tour" className="hidden self-start lg:sticky lg:top-24 lg:block"><div className="rounded-panel border border-border bg-surface p-6 shadow-panel"><Picker {...props} /></div></aside>
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-5 py-3 shadow-panel backdrop-blur-xl lg:hidden"><div className="mx-auto flex max-w-lg items-center justify-between gap-3"><div><p className="text-xs text-muted">From / person</p><p className="font-display text-xl font-semibold text-foreground">{formatUsd(tour.price)}</p></div><button type="button" onClick={() => setOpen(true)} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white outline-none transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent active:scale-95">Choose date <ArrowRight className="ml-1 inline size-4" aria-hidden="true" /></button></div></div>
    {createPortal(<AnimatePresence>{open && <MobileSheet onClose={() => setOpen(false)}><Picker {...props} /></MobileSheet>}</AnimatePresence>, document.body)}
  </>;
}
