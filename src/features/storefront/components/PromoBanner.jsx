import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Check, Copy, Hourglass, TicketPercent } from "lucide-react";
import { AngkorLines } from "../../../components/effects/AngkorLines";
import { cn } from "../../../lib/cn";
import { PROMO } from "../content";
import { revealScale } from "../motion";
import { Reveal } from "./Reveal";

const container = "mx-auto max-w-[1320px] px-5 lg:px-8";

function daysUntilYearEnd() {
  const today = new Date();
  const end = new Date(today.getFullYear(), 11, 31);
  return Math.max(0, Math.ceil((end - today) / 86_400_000));
}

/** Early-booking offer strip. Mock only: the code isn't applied anywhere yet. */
export function PromoBanner() {
  const [copied, setCopied] = useState(false);
  const days = daysUntilYearEnd();

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(PROMO.code);
    } catch {
      // Clipboard can be blocked (http, iframes); the code is still on screen.
    }
    setCopied(true);
    toast.success(`Code ${PROMO.code} copied`, { description: "Paste it at checkout to save 10%." });
    window.setTimeout(() => setCopied(false), 2400);
  }

  return (
    <section aria-labelledby="home-promo" className={cn(container, "pt-16 sm:pt-20")}>
      <Reveal
        variants={revealScale}
        className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(105deg,var(--primary),color-mix(in_srgb,var(--primary)_62%,#0b1215))] text-white shadow-[0_24px_60px_-30px_var(--primary)]"
      >
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(233,185,73,.45),transparent_55%)]" aria-hidden="true" />
        <AngkorLines withWater={false} className="pointer-events-none absolute -bottom-3 right-4 h-24 w-80 max-w-[60%] text-white/15" />
        <div className="relative flex flex-col gap-6 px-6 py-7 sm:px-10 sm:py-8 lg:flex-row lg:items-center lg:gap-10">
          <span className="hidden size-14 shrink-0 place-items-center rounded-2xl bg-white/15 sm:grid ring-1 ring-white/25 backdrop-blur-md" aria-hidden="true">
            <TicketPercent className="size-7" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f1c968]">
              <Hourglass className="size-3.5" aria-hidden="true" />
              {days > 0 ? `${days} days left` : "Last day"}
              <span className="hidden sm:inline">· {PROMO.deadline}</span>
            </p>
            <h2 id="home-promo" className="font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-balance sm:text-[32px]">
              {PROMO.title}
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">{PROMO.body}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copyCode}
              aria-label={`Copy promo code ${PROMO.code}`}
              className="group inline-flex h-12 items-center gap-3 rounded-full border-2 border-dashed border-white/55 bg-white/10 pl-5 pr-4 font-mono text-base font-bold tracking-[0.14em] outline-none transition-[background-color,border-color,transform] duration-300 hover:border-white hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary active:scale-[0.97]"
            >
              {PROMO.code}
              {copied ? <Check className="size-4 text-[#f1c968]" aria-hidden="true" /> : <Copy className="size-4 opacity-80 transition-opacity group-hover:opacity-100" aria-hidden="true" />}
            </button>
            <Link
              to="/tours"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#1a1f21] outline-none transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(0,0,0,.45)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary active:translate-y-0"
            >
              Find a tour <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
