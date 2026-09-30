import { Link } from "react-router-dom";
import angkorImage from "../../../assets/images/common/login_bg_luxury.jpg";
import { Calendar, Compass, MapPin, Sparkles, User, Users } from "lucide-react";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { PageIntro } from "../components/PageIntro";

export default function CustomerBookingsPage() {
  const { user } = useCustomerAuth();

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-8 space-y-10">
        <PageIntro
          eyebrow="Traveller Dashboard"
          title={`Welcome back, ${user?.name || "Traveller"}`}
          actions={
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent active:translate-y-0"
            >
              <Compass className="size-4" />
              <span>Browse Tours</span>
            </Link>
          }
        >
          Manage your upcoming journeys, view confirmation vouchers, and discover new destinations across Cambodia.
        </PageIntro>

        {/* Account Summary Strip */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <User className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Account Profile</p>
                <p className="font-semibold text-foreground">{user?.name || "Customer"}</p>
                <p className="text-xs text-muted truncate max-w-[200px]">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-accent/20 text-accent-ink">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Membership Tier</p>
                <p className="font-semibold text-foreground">Explorer Club</p>
                <p className="text-xs text-muted">Member since {user?.memberSince || "2026"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Calendar className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Active Bookings</p>
                <p className="font-semibold text-foreground">1 Upcoming Journey</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Ready for departure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              Upcoming Reservations
            </h2>
            <span className="text-xs font-medium text-muted">Booking Reference: TT-84920</span>
          </div>

          {/* Sample Active Booking Card */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="relative h-48 md:h-auto md:col-span-4 lg:col-span-3">
                <img
                  src={angkorImage}
                  alt="Angkor Wat reflection"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow">
                  Confirmed
                </span>
              </div>

              <div className="p-6 md:col-span-8 lg:col-span-9 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5 text-primary" /> Siem Reap
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3.5 text-primary" /> Oct 14, 2026 · 05:00 AM
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5 text-primary" /> 2 Adults
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
                    Angkor Wat Sunrise Signature Experience
                  </h3>
                  <p className="text-sm text-muted line-clamp-2">
                    Witness first dawn over the five towers, followed by breakfast near Srah Srang and quiet morning exploration of Ta Prohm before peak hours.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                  <div>
                    <span className="text-xs text-muted">Total Paid (ABA Pay Simulation):</span>
                    <span className="ml-2 font-display text-base font-bold text-primary">$170.00</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => alert("Booking voucher downloaded (demo simulated).")}
                      className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-2"
                    >
                      Download Voucher
                    </button>
                    <Link
                      to="/tours"
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
                    >
                      Explore More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
