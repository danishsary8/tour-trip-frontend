import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";

const INTERVAL_MS = 6500;

export function TextSlideshow({
  slides,
  activeIndex,
  onSlideChange,
  className = "",
}) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const isControlled = typeof activeIndex === "number";
  const currentIndex = isControlled ? activeIndex : internalIndex;

  const handleSlideChange = (nextIndex) => {
    if (onSlideChange) onSlideChange(nextIndex);
    if (!isControlled) setInternalIndex(nextIndex);
  };

  useEffect(() => {
    if (isPaused || reduceMotion) return undefined;
    const timer = window.setInterval(() => {
      if (onSlideChange) {
        onSlideChange((prev) => (prev + 1) % slides.length);
      } else {
        setInternalIndex((prev) => (prev + 1) % slides.length);
      }
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, reduceMotion, onSlideChange, slides.length]);

  const slide = slides[currentIndex] || slides[0];

  const handlePrev = () => {
    handleSlideChange((currentIndex - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    handleSlideChange((currentIndex + 1) % slides.length);
  };

  return (
    <div
      className={`relative max-w-[680px] pb-6 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Tagline & Badge */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <motion.p
          key={`tagline-${currentIndex}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent"
        >
          <span className="h-px w-8 bg-accent/70" /> {slide.tagline}
        </motion.p>

        <motion.span
          key={`meta-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/55 backdrop-blur-md max-sm:hidden"
        >
          <Compass className="size-3 text-accent" /> {slide.meta}
        </motion.span>
      </div>

      {/* Main Animated Headline & Description */}
      <div className="min-h-[220px] max-lg:min-h-[170px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display text-[clamp(3.1rem,5.6vw,6.4rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-white drop-shadow-2xl max-lg:text-[clamp(2.4rem,10vw,4.2rem)]">
              {slide.title}
              <span
                className={`mt-3 block bg-gradient-to-r ${slide.gradient} bg-clip-text text-[.44em] leading-none tracking-[-0.025em] text-transparent`}
              >
                {slide.subtitle}
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Controls & Progress */}
      <div className="mt-8 flex items-center gap-3">
        {/* Prev button on Left side */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60 backdrop-blur transition-all hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-95"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Progress Dots in Center */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSlideChange(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group relative h-2 overflow-hidden rounded-full transition-all duration-300"
              style={{ width: i === currentIndex ? 28 : 7 }}
            >
              <span
                className={`absolute inset-0 rounded-full transition-colors ${
                  i === currentIndex ? "bg-accent" : "bg-white/20 group-hover:bg-white/40"
                }`}
              />
              {i === currentIndex && !isPaused && !reduceMotion && (
                <motion.span
                  key={`progress-${currentIndex}`}
                  className="absolute inset-0 bg-white/40"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: INTERVAL_MS / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Next button on Right side */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next slide"
          className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60 backdrop-blur transition-all hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-95"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
