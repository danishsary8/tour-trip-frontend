import { CalendarCheck, Compass, Headset, ShieldCheck } from "lucide-react";
import { cn } from "../../../lib/cn";
import { WHY_BOOK } from "../content";
import { revealScale } from "../motion";
import { Reveal, RevealItem } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const container = "mx-auto max-w-[1320px] px-5 lg:px-8";
const ICONS = { ShieldCheck, Compass, CalendarCheck, Headset };

/** Four reasons to book direct: payment, guides, cancellation and support. */
export function WhyBookSection() {
  return (
    <section aria-labelledby="home-why" className={cn(container, "pt-24 sm:pt-32")}>
      <SectionHeading id="home-why" eyebrow="Why book with us" title="Small company, big promises">
        We&apos;re a Phnom Penh team, not a marketplace. Every tour is one we run ourselves.
      </SectionHeading>
      <Reveal stagger as="ul" amount={0.15} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {WHY_BOOK.map((item, index) => {
          const Icon = ICONS[item.icon] ?? Compass;
          return (
            <RevealItem
              as="li"
              key={item.title}
              variants={revealScale}
              className="group relative flex flex-col overflow-hidden rounded-panel border border-border bg-surface p-6 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft sm:p-7"
            >
              <span className="absolute right-5 top-4 font-display text-5xl font-semibold tracking-[-0.04em] text-foreground/[0.06]" aria-hidden="true">
                0{index + 1}
              </span>
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary-ink transition-[transform,background-color,color] duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">{item.body}</p>
            </RevealItem>
          );
        })}
      </Reveal>
    </section>
  );
}
