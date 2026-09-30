import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import { PageIntro } from "../components/PageIntro";

const COPY = {
  "sign-in": { eyebrow: "Welcome back", title: "Customer sign in is almost ready" },
  register: { eyebrow: "Become a member", title: "Registration opens with the booking flow" },
};

/**
 * Compatibility handler for legacy /account/ modes.
 */
export default function AccountPage() {
  const { mode } = useParams();

  if (mode === "sign-in") {
    return <Navigate to="/login" replace />;
  }

  if (mode === "register") {
    return <Navigate to="/register" replace />;
  }

  const copy = COPY[mode] ?? COPY["sign-in"];

  return (
    <PageIntro
      eyebrow={copy.eyebrow}
      title={copy.title}
      className="min-h-[60vh]"
      actions={
        <>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white outline-none transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0"
          >
            <Compass className="size-4" aria-hidden="true" /> Continue browsing tours
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground outline-none transition-colors duration-300 hover:bg-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            Back home <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </>
      }
    >
      Guests can browse every tour, destination and review now. Signing in to book arrives in the next release, separate from the admin login.
    </PageIntro>
  );
}
