import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { PageHeader } from "./PageHeader";

const SECTIONS = [
  { label: "Categories", to: "/admin/masters/categories" },
  { label: "Destinations", to: "/admin/masters/destinations" },
  { label: "Guides", to: "/admin/masters/guides" },
  { label: "Tours", to: "/admin/masters/tours" },
  { label: "Schedules", to: "/admin/masters/schedules" },
];

export function MastersShell({ title, description, actions, children }) {
  const navRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector('[aria-current="page"]');
    if (!active) return;
    nav.scrollLeft += active.getBoundingClientRect().left - nav.getBoundingClientRect().left - (nav.clientWidth - active.clientWidth) / 2;
  }, [pathname]);

  return (
    <div className="mx-auto min-w-0 max-w-[1600px] space-y-5 pb-10 sm:space-y-6">
      <PageHeader eyebrow="Manage Masters / TourTrip catalogue" title={title} description={description} actions={actions} className="!mb-0" />
      <nav ref={navRef} aria-label="Masters sections" className="overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full gap-1">
          {SECTIONS.map(({ label, to }) => <NavLink key={to} to={to} className={({ isActive }) =>
            "relative whitespace-nowrap rounded-t-control px-4 py-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/60 " +
            (isActive ? "bg-primary/10 text-primary-ink after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary" : "text-muted hover:bg-surface-2 hover:text-foreground")
          }>{label}</NavLink>)}
        </div>
      </nav>
      {children}
    </div>
  );
}
