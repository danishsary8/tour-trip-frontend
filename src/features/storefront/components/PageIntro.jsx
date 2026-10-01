import { cn } from "../../../lib/cn";
import { Breadcrumbs } from "./Breadcrumbs";
import { Reveal, RevealItem } from "./Reveal";
import { RouteMark } from "./RouteMark";

/**
 * Title block for inner storefront pages (below the solid header): breadcrumbs, eyebrow,
 * large display headline and an optional intro paragraph, revealed in sequence.
 */
export function PageIntro({ eyebrow, title, children, className, actions, breadcrumbs, aside }) {
  return (
    <Reveal stagger className={cn("mx-auto max-w-[1320px] px-5 pb-10 lg:px-8", breadcrumbs ? "pt-28 sm:pt-32" : "pt-32 sm:pt-36", className)}>
      {breadcrumbs && (
        <RevealItem className="mb-7">
          <Breadcrumbs items={breadcrumbs} />
        </RevealItem>
      )}
      {eyebrow && (
        <RevealItem as="p" className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-ink">
          <RouteMark />
          {eyebrow}
        </RevealItem>
      )}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <RevealItem as="h1" className="max-w-4xl font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] text-balance text-foreground sm:text-6xl lg:text-[68px]">
            {title}
          </RevealItem>
          {children && (
            <RevealItem as="div" className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-muted sm:text-lg">
              {children}
            </RevealItem>
          )}
        </div>
        {aside && <RevealItem as="div" className="shrink-0">{aside}</RevealItem>}
      </div>
      {actions && (
        <RevealItem as="div" className="mt-8 flex flex-wrap gap-3">
          {actions}
        </RevealItem>
      )}
    </Reveal>
  );
}
