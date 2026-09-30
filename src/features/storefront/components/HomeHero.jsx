import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import angkorImage from "../../../assets/images/common/otp_background.jpg";
import mekongImage from "../../../assets/images/common/mekong_river_sunset.jpg";
import kohRongImage from "../../../assets/images/common/koh_rong_island.jpg";
import palaceImage from "../../../assets/images/common/royal_palace.jpg";
import { SplitText } from "../../../components/effects/SplitText";
import { cn } from "../../../lib/cn";
import { motionEase } from "../../../lib/motion";

const SLIDES = [
  { image: angkorImage, caption: "Angkor Wat, Siem Reap" },
  { image: mekongImage, caption: "The Mekong at dusk" },
  { image: kohRongImage, caption: "Koh Rong, Sihanoukville" },
  { image: palaceImage, caption: "Royal Palace, Phnom Penh" },
];
const SLIDE_MS = 7000;

const todayKey = () => new Date().toLocaleDateString("en-CA");

const fieldShell =
  "group relative flex min-w-0 flex-col gap-1 rounded-card px-4 py-3 transition-colors duration-300 hover:bg-foreground/[0.04] focus-within:bg-foreground/[0.04]";
const labelClass = "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted";
const controlClass =
  "w-full min-w-0 appearance-none bg-transparent text-[15px] font-medium text-foreground outline-none [color-scheme:light] dark:[color-scheme:dark]";

/** Search card overlapping the hero. Destination filters /tours; date and travellers ride along as params. */
function HeroSearch({ destinations }) {
  const navigate = useNavigate();
  const ids = { destination: useId(), date: useId(), travelers: useId() };
  const [values, setValues] = useState({ destination: "", date: "", travelers: "2" });
  const set = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));

  function onSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => value && params.set(key, value));
    navigate(`/tours${params.size ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="Find a tour"
      className="grid gap-1 rounded-panel border border-border bg-surface/95 p-2 shadow-panel backdrop-blur-xl md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center md:gap-0 md:divide-x md:divide-border"
    >
      <div className={fieldShell}>
        <label htmlFor={ids.destination} className={labelClass}>
          <MapPin className="size-3.5 text-primary-ink" aria-hidden="true" /> Destination
        </label>
        <select id={ids.destination} value={values.destination} onChange={set("destination")} className={cn(controlClass, "cursor-pointer")}>
          <option value="">Anywhere in Cambodia</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id} disabled={!destination.tourCount}>
              {destination.name}
              {!destination.tourCount ? " (coming soon)" : ""}
            </option>
          ))}
        </select>
      </div>
      <div className={fieldShell}>
        <label htmlFor={ids.date} className={labelClass}>
          <CalendarDays className="size-3.5 text-primary-ink" aria-hidden="true" /> Date
        </label>
        <input id={ids.date} type="date" min={todayKey()} value={values.date} onChange={set("date")} className={controlClass} />
      </div>
      <div className={fieldShell}>
        <label htmlFor={ids.travelers} className={labelClass}>
          <Users className="size-3.5 text-primary-ink" aria-hidden="true" /> Travellers
        </label>
        <select id={ids.travelers} value={values.travelers} onChange={set("travelers")} className={cn(controlClass, "cursor-pointer")}>
          {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? "traveller" : "travellers"}
            </option>
          ))}
        </select>
      </div>
      <div className="p-1 md:pl-3">
        <button
          type="submit"
          className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-card bg-primary px-7 text-[15px] font-semibold text-white shadow-[0_14px_30px_-12px_var(--primary)] outline-none transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:translate-y-0 md:w-auto"
        >
          <Search className="size-[18px]" aria-hidden="true" /> Search tours
        </button>
      </div>
    </form>
  );
}

/**
 * Full-bleed photo hero: four Cambodian scenes crossfade slowly with a Ken Burns drift and a
 * gentle parallax, a word-by-word headline, and the search card overlapping the bottom edge.
 */
export function HomeHero({ destinations = [] }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const slide = SLIDES[index];

  return (
    <section ref={ref} aria-label="Welcome" className="relative">
      <div className="relative h-[92svh] min-h-[620px] overflow-hidden bg-[#0b1215]">
        <motion.div style={reduceMotion ? undefined : { y: imageY }} className="absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.img
              key={slide.image}
              src={slide.image}
              alt=""
              fetchPriority="high"
              decoding="async"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 1.6, ease: "easeInOut" }}
              className={cn("absolute inset-0 size-full object-cover", !reduceMotion && "animate-kenburns")}
            />
          </AnimatePresence>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,rgba(200,85,61,.28),transparent_60%)]" aria-hidden="true" />

        <motion.div
          style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
          className="relative mx-auto flex h-full max-w-[1320px] flex-col justify-center px-5 pb-28 pt-24 text-white lg:px-8"
        >
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: motionEase }}
            className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#f1c968]"
          >
            <span className="h-px w-10 bg-[#f1c968]/70" aria-hidden="true" /> Kingdom of Wonder
          </motion.p>
          <SplitText as="h1" delay={0.25} className="max-w-4xl pb-2 font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-7xl lg:text-[88px]">
            Journeys through Cambodia, guided by locals
          </SplitText>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9, ease: motionEase }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
          >
            Sunrise at Angkor, pepper farms in Kampot, quiet islands off Kep — small-group tours with the people who call them home.
          </motion.p>
        </motion.div>

        <div className="absolute bottom-24 right-5 hidden items-center gap-3 text-xs text-white/75 md:flex lg:right-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={slide.caption} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}>
              {slide.caption}
            </motion.span>
          </AnimatePresence>
          <div className="flex gap-1.5" role="group" aria-label="Hero photos">
            {SLIDES.map((item, slideIndex) => (
              <button
                key={item.caption}
                type="button"
                onClick={() => setIndex(slideIndex)}
                aria-label={`Show ${item.caption}`}
                aria-pressed={slideIndex === index}
                className={cn(
                  "h-1.5 rounded-full outline-none transition-[width,background-color] duration-500 focus-visible:ring-2 focus-visible:ring-accent/70",
                  slideIndex === index ? "w-8 bg-white" : "w-3 bg-white/45 hover:bg-white/75",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-[1100px] px-5 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1, ease: motionEase }}
        >
          <HeroSearch destinations={destinations} />
        </motion.div>
      </div>
    </section>
  );
}
