import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Compass, Heart, LogIn, Trash2 } from "lucide-react";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Button } from "../../../components/ui/Button";
import { motionEase } from "../../../lib/motion";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { authPath } from "../auth/redirect";
import { PageIntro } from "../components/PageIntro";
import { TourCard, TourCardSkeleton } from "../components/TourCard";
import { useCatalog } from "../hooks";
import { useWishlist } from "../wishlist";

const pill =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent/70";

/** Saved tours: newest first, hearts remove in place, with an empty state that leads back to browsing. */
export default function WishlistPage() {
  const catalog = useCatalog();
  const { ids, clear } = useWishlist();
  const { isAuthenticated, user } = useCustomerAuth();
  const reduceMotion = useReducedMotion();

  // Keep the saved order and quietly skip tours that were retired since they were saved.
  const tours = useMemo(() => {
    const byId = new Map((catalog.data?.tours ?? []).map((tour) => [tour.id, tour]));
    return ids.map((id) => byId.get(id)).filter(Boolean);
  }, [catalog.data, ids]);

  const intro = isAuthenticated
    ? `Tours you've saved, ${user?.name?.split(" ")[0] ?? "traveller"}. Tap a heart to remove one.`
    : "Saved on this device. Sign in and they'll be kept with your account.";

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Wishlist" }]}
        eyebrow="Saved tours"
        title="Your wishlist"
        actions={
          tours.length > 0 && (
            <>
              <Link to="/tours" className={`${pill} bg-primary text-white hover:bg-primary/90`}>
                <Compass className="size-4" aria-hidden="true" /> Find more tours
              </Link>
              {!isAuthenticated && (
                <Link to={authPath("/wishlist")} className={`${pill} border border-border text-foreground hover:bg-foreground/[0.06]`}>
                  <LogIn className="size-4" aria-hidden="true" /> Sign in to keep them
                </Link>
              )}
              <button type="button" onClick={clear} className={`${pill} text-muted hover:bg-foreground/[0.06] hover:text-foreground`}>
                <Trash2 className="size-4" aria-hidden="true" /> Clear all
              </button>
            </>
          )
        }
      >
        {intro}
      </PageIntro>

      <section aria-label="Saved tours" className="mx-auto max-w-[1320px] px-5 pb-24 sm:pb-32 lg:px-8">
        <p className="sr-only" role="status" aria-live="polite">
          {catalog.isLoading ? "" : `${tours.length} saved ${tours.length === 1 ? "tour" : "tours"}`}
        </p>
        {catalog.isError ? (
          <EmptyState
            icon={Compass}
            title="We couldn't load your saved tours"
            description="Your list is safe on this device. Check your connection and try again."
            action={<Button onClick={() => catalog.refetch()}>Try again</Button>}
          />
        ) : catalog.isLoading && ids.length > 0 ? (
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {ids.slice(0, 6).map((id) => (
              <li key={id}>
                <TourCardSkeleton />
              </li>
            ))}
          </ul>
        ) : tours.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No saved tours yet"
            description="Tap the heart on any tour to save it here, then come back when you're ready to book."
            action={
              <Link to="/tours" className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white outline-none transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent/70">
                <Compass className="size-4" aria-hidden="true" /> Browse tours
              </Link>
            }
          />
        ) : (
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            <AnimatePresence initial={false} mode="popLayout">
              {tours.map((tour) => (
                <motion.li
                  key={tour.id}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.4, ease: motionEase }}
                >
                  <TourCard tour={tour} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>
    </>
  );
}
