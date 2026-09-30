import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BrandMark } from "../components/ui/BrandMark";
import { useThemeScope } from "../app/providers/ThemeProvider";
import { Aurora } from "../components/effects/Aurora";
import { TextSlideshow } from "../components/effects/TextSlideshow";
import { AUTH_SLIDES } from "../features/auth/authSlides";
import { MOCK_LOGIN_STATS } from "../mocks/auth";

export function AuthLayout({ children }) {
  useThemeScope("admin");
  const [activeSlide, setActiveSlide] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <main className="grain relative min-h-dvh overflow-hidden bg-[#081013] text-white">
      {/* Synchronized Background Carousel */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        {AUTH_SLIDES.map((slide, i) => {
          const isActive = activeSlide === i;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-0" : "opacity-0 -z-10"
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-full w-full object-cover object-center scale-[1.02]"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              {/* Destination atmospheric glow */}
              <div
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${slide.glowStyle} ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Readability gradients & subtle ambient light */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(5,12,15,.93)_0%,rgba(5,12,15,.72)_45%,rgba(5,12,15,.52)_68%,rgba(5,12,15,.78)_100%)] max-lg:bg-[linear-gradient(180deg,rgba(5,12,15,.62)_0%,rgba(5,12,15,.86)_38%,rgba(5,12,15,.97)_100%)]" />
      <Aurora className="pointer-events-none z-10 opacity-45" />

      {/* Floating Side Carousel Navigation Arrows (Left & Right) */}
      <button
        type="button"
        onClick={() => setActiveSlide((prev) => (prev - 1 + AUTH_SLIDES.length) % AUTH_SLIDES.length)}
        aria-label="Previous destination slide"
        className="group absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2.5 text-white/70 backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-white/35 hover:bg-black/60 hover:text-white active:scale-95 sm:left-4 lg:left-6 xl:left-8 shadow-2xl max-lg:hidden"
      >
        <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />
      </button>

      <button
        type="button"
        onClick={() => setActiveSlide((prev) => (prev + 1) % AUTH_SLIDES.length)}
        aria-label="Next destination slide"
        className="group absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2.5 text-white/70 backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-white/35 hover:bg-black/60 hover:text-white active:scale-95 sm:right-4 lg:right-6 xl:right-8 shadow-2xl max-lg:hidden"
      >
        <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5" />
      </button>

      <div className="relative z-30 mx-auto grid min-h-dvh w-full min-w-0 max-w-[1680px] grid-cols-[minmax(0,1.15fr)_minmax(460px,.85fr)] items-center gap-12 px-8 py-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-32 max-lg:grid-cols-1 max-lg:content-start max-lg:gap-0 max-lg:px-5 max-lg:pb-10 max-lg:pt-6">
        <section className="flex min-h-[600px] min-w-0 flex-col justify-between py-8 max-lg:min-h-[35vh] max-lg:py-0">
          <BrandMark className="text-white" />

          <div className="max-w-[700px] pb-[4vh] max-lg:pb-8 max-lg:pt-10">
            <TextSlideshow
              slides={AUTH_SLIDES}
              activeIndex={activeSlide}
              onSlideChange={setActiveSlide}
            />

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.6 } } }}
              className="mt-6 flex flex-wrap gap-3 max-lg:hidden"
            >
              {MOCK_LOGIN_STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                  }}
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  className="rounded-full border border-white/13 bg-white/8 px-4 py-2.5 shadow-lg backdrop-blur-xl"
                >
                  <span className="font-display text-sm font-semibold text-white">{stat.value}</span>
                  <span className="ml-2 text-xs text-white/50">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="flex min-w-0 items-center justify-center max-lg:-mt-2 max-lg:w-full">
          {children}
        </section>
      </div>
    </main>
  );
}
