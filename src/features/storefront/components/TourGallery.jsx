import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Expand } from "lucide-react";
import { Lightbox } from "../../../components/shared/Lightbox";

export function TourGallery({ images, title }) {
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const reduceMotion = useReducedMotion();
  const current = images[active];

  return <section aria-label={`${title} photographs`} className="min-w-0">
    <button type="button" onClick={() => setLightboxIndex(active)} aria-label={`Open ${title} image gallery`}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-panel bg-surface-2 outline-none ring-offset-background transition-shadow duration-300 hover:shadow-panel focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:scale-[0.995] sm:aspect-[16/9]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.img key={`${current.src}-${active}`} src={current.src} alt={current.alt}
          initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.4 }}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
      </AnimatePresence>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" aria-hidden="true" />
      <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/45 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors group-hover:bg-black/65 sm:bottom-5 sm:right-5">
        <Expand className="size-4" aria-hidden="true" /> View gallery
      </span>
    </button>
    {images.length > 1 && <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Tour photo thumbnails">
      {images.map((image, index) => <button key={`${image.src}-${index}`} type="button" onClick={() => setActive(index)} aria-label={`Show photo ${index + 1}: ${image.alt}`} aria-pressed={active === index}
        className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-control border-2 outline-none transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 sm:w-32 ${active === index ? "border-primary shadow-glow" : "border-transparent opacity-70 hover:opacity-100"}`}>
        <img src={image.src} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
      </button>)}
    </div>}
    <Lightbox open={lightboxIndex !== null} items={images} index={lightboxIndex ?? 0} onIndexChange={setLightboxIndex} onClose={() => setLightboxIndex(null)} />
  </section>;
}
