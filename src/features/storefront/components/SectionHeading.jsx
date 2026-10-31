import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "../../../lib/cn";
import { Reveal, RevealItem } from "./Reveal";
import { RouteMark } from "./RouteMark";

/** Eyebrow + display headline + intro for Home sections, with an optional "see all" link. */
export function SectionHeading({ id, eyebrow, title, children, link, className, align = "left" }) {
  return (
    <Reveal stagger className={cn("mb-10 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between", align === "center" && "items-center text-center md:flex-col md:items-center", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <RevealItem as="p" className={cn("mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-ink", align === "center" && "justify-center")}>
          <RouteMark />
          {eyebrow}
        </RevealItem>
        <RevealItem as="h2" id={id} className="font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] text-balance text-foreground sm:text-5xl">
          {title}
        </RevealItem>
        {children && (
          <RevealItem as="p" className="mt-4 text-base leading-relaxed text-pretty text-muted sm:text-lg">
            {children}
          </RevealItem>
        )}
      </div>
      {link && (
        <RevealItem>
          <Link
            to={link.to}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground outline-none transition-[background-color,border-color] duration-300 hover:border-primary/40 hover:bg-primary/[0.06] focus-visible:ring-2 focus-visible:ring-accent/70 active:scale-[0.98]"
          >
            {link.label}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </RevealItem>
      )}
    </Reveal>
  );
}
