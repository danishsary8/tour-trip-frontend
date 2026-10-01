import { useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CreditCard, LifeBuoy, Map, Plus, RotateCcw, Search, X } from "lucide-react";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/cn";
import { motionEase } from "../../../lib/motion";
import { PageIntro } from "../components/PageIntro";
import { Reveal, RevealItem } from "../components/Reveal";
import { WhatsappIcon } from "../components/SocialIcons";
import { CONTACT, FAQ_GROUPS } from "../content";

const GROUP_ICONS = { booking: CreditCard, cancellation: RotateCcw, "on-tour": Map };

function FaqItem({ item, open, onToggle }) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  return (
    <li className="border-b border-border">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="group flex w-full items-center gap-4 rounded py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <span className={cn("flex-1 font-display text-base font-semibold tracking-[-0.01em] transition-colors sm:text-lg", open ? "text-primary-ink" : "text-foreground group-hover:text-primary-ink")}>{item.q}</span>
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-300",
              open ? "rotate-45 bg-primary text-white" : "border border-border text-foreground group-hover:border-primary/40",
            )}
            aria-hidden="true"
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: motionEase }}
            className="overflow-hidden"
          >
            <p className="max-w-3xl pb-6 pr-12 text-[15px] leading-7 text-pretty text-muted">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function matches(item, query) {
  const text = `${item.q} ${item.a}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
}

/** FAQ: searchable, grouped accordion. Several answers can be open at once; the first starts open. */
export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState(() => new Set([`${FAQ_GROUPS[0].id}-0`]));
  const trimmed = query.trim();

  const groups = useMemo(
    () =>
      FAQ_GROUPS.map((group) => ({
        ...group,
        items: group.items.map((item, index) => ({ ...item, key: `${group.id}-${index}` })).filter((item) => !trimmed || matches(item, trimmed)),
      })).filter((group) => group.items.length > 0),
    [trimmed],
  );
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  function toggle(key) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "FAQ" }]}
        eyebrow="Help centre"
        title="Questions, answered"
        actions={
          <label className="relative block w-full max-w-md">
            <span className="sr-only">Search questions</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search: refund, visa, pickup…"
              className="h-12 w-full rounded-full border border-border bg-transparent pl-11 pr-11 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted hover:border-foreground/25 focus:border-primary focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </label>
        }
      >
        Booking, paying, cancelling and what to expect on the day: the things travellers ask us most, answered straight.
      </PageIntro>

      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 pb-24 sm:pb-32 lg:grid-cols-[260px_1fr] lg:gap-16 lg:px-8">
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="FAQ topics">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Topics</p>
            <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:gap-0 lg:border-t lg:border-foreground/80 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:px-0 [&::-webkit-scrollbar]:hidden">
              {FAQ_GROUPS.map((group) => {
                const Icon = GROUP_ICONS[group.id] ?? LifeBuoy;
                const count = groups.find((item) => item.id === group.id)?.items.length ?? 0;
                return (
                  <li key={group.id} className="shrink-0">
                    <a
                      href={`#faq-${group.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        document.getElementById(`faq-${group.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground outline-none transition-colors hover:text-primary-ink focus-visible:ring-2 focus-visible:ring-primary/60 lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:py-3",
                        count === 0 && "opacity-50",
                      )}
                    >
                      <Icon className="size-4 text-primary-ink" aria-hidden="true" />
                      {group.title}
                      <span className="ml-auto text-xs tabular-nums text-muted">{count}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 space-y-14">
          <p className="sr-only" role="status" aria-live="polite">
            {trimmed ? `${total} ${total === 1 ? "question matches" : "questions match"} “${trimmed}”` : ""}
          </p>
          {groups.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No answers match that search"
              description="Try a different word, or ask us directly. We usually reply within a couple of hours."
              action={
                <>
                  <Button variant="ghost" className="border border-border hover:bg-foreground/[0.06]" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                  <Link to="/contact" className="inline-flex h-11 items-center gap-2 rounded-control bg-primary px-5 text-sm font-semibold text-white outline-none transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent/70">
                    Contact us
                  </Link>
                </>
              }
            />
          ) : (
            groups.map((group) => (
              <Reveal as="section" key={group.id} id={`faq-${group.id}`} aria-labelledby={`faq-${group.id}-title`} className="scroll-mt-28">
                <h2 id={`faq-${group.id}-title`} className="mb-5 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
                  {group.title}
                </h2>
                <ul className="border-t border-foreground/80">
                  {group.items.map((item) => (
                    <FaqItem key={item.key} item={item} open={openIds.has(item.key)} onToggle={() => toggle(item.key)} />
                  ))}
                </ul>
              </Reveal>
            ))
          )}

          <Reveal stagger className="dark relative overflow-hidden rounded-panel bg-background p-7 text-white sm:p-10">
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-md">
                <RevealItem as="h2" className="font-display text-3xl font-semibold tracking-[-0.03em]">
                  Still have a question?
                </RevealItem>
                <RevealItem as="p" className="mt-2 text-sm leading-relaxed text-white/75 sm:text-base">
                  Our Phnom Penh team answers in English and Khmer, usually within a couple of hours.
                </RevealItem>
              </div>
              <RevealItem className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1a1f21] outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1215] active:translate-y-0"
                >
                  Contact us <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white outline-none transition-colors duration-300 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <WhatsappIcon className="size-4" /> WhatsApp
                  <span className="sr-only">(opens WhatsApp)</span>
                </a>
              </RevealItem>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
