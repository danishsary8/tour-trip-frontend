import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../../lib/cn";
import { useWishlist } from "../wishlist";

/** Heart toggle for a tour: filled when saved. Sits over a card photo, outside the card link. */
export function WishlistButton({ tourId, tourName, className }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { has, toggle } = useWishlist();
  const saved = has(tourId);

  function onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const nowSaved = toggle(tourId);
    if (nowSaved) toast.success("Saved to your wishlist", { description: tourName, action: { label: "View", onClick: () => navigate("/wishlist") } });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${tourName} from your wishlist` : `Save ${tourName} to your wishlist`}
      className={cn(
        "relative grid size-10 place-items-center rounded-full bg-white/90 text-[#1a1f21] shadow-sm outline-none backdrop-blur-md transition-[background-color,transform] duration-300 hover:scale-105 hover:bg-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 active:scale-90",
        className,
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={saved ? "saved" : "idle"}
          initial={reduceMotion ? false : { scale: saved ? 0.4 : 0.8 }}
          animate={{ scale: 1 }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 14 }}
          className="grid place-items-center"
        >
          <Heart className={cn("size-5 transition-colors", saved ? "fill-primary text-primary" : "text-[#1a1f21]")} aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {saved && !reduceMotion && (
          <motion.span
            key="burst"
            className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-primary/60"
            initial={{ scale: 0.6, opacity: 1 }}
            animate={{ scale: 1.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </button>
  );
}
