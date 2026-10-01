import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Star } from "lucide-react";
import { Tooltip } from "../../../components/ui/Tooltip";
import { chartAnimation, tooltipPreset, useChartTheme } from "../../../lib/chart";

const dateLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

const LOCKED = {
  guest: { tip: "Sign in to write a review", label: "Write a review: sign in required" },
  none: { tip: "Only travellers who completed this tour can review it", label: "Write a review: available after you complete this tour" },
  reviewed: { tip: "Thanks! Reviews appear after a quick approval", label: "You have already reviewed this tour" },
};

/**
 * "Write a review" works only for a signed-in traveller with a Completed booking of this tour
 * that has no review yet; otherwise it explains why it is locked.
 */
export function ReviewButton({ action }) {
  if (action?.state === "eligible") {
    return <button type="button" onClick={action.onWrite} className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/[0.06] px-5 py-2.5 text-sm font-semibold text-primary-ink outline-none transition-all hover:-translate-y-0.5 hover:bg-primary/[0.1] focus-visible:ring-2 focus-visible:ring-primary active:translate-y-0 active:scale-[0.98]"><Star className="size-4" aria-hidden="true" />Write a review</button>;
  }
  const locked = LOCKED[action?.state] ?? LOCKED.guest;
  return <Tooltip label={locked.tip} side="bottom" className="inline-flex"><button type="button" aria-disabled="true" aria-label={locked.label} className="cursor-not-allowed rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted opacity-65 transition-colors hover:border-primary/35 focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.99]">{action?.state === "reviewed" ? "Review submitted" : "Write a review"}</button></Tooltip>;
}

/** Rating summary and review list for the Tour Detail reviews chapter (the chapter supplies the heading). */
export function TourReviews({ reviews }) {
  const theme = useChartTheme();
  const reduceMotion = useReducedMotion();
  const counts = [5, 4, 3, 2, 1].map((rating) => reviews.filter((review) => review.rating === rating).length);
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const data = { labels: ["5 stars", "4 stars", "3 stars", "2 stars", "1 star"], datasets: [{ data: counts, backgroundColor: [theme.accent, theme.primary, theme.success, theme.info, theme.muted], borderRadius: 5, barThickness: 12 }] };
  const options = {
    indexAxis: "y", responsive: true, maintainAspectRatio: false, animation: chartAnimation(reduceMotion),
    plugins: { legend: { display: false }, tooltip: tooltipPreset(theme, { callbacks: { label: (context) => `${context.parsed.x} review${context.parsed.x === 1 ? "" : "s"}` } }) },
    scales: { x: { beginAtZero: true, ticks: { stepSize: 1, color: theme.muted, precision: 0 }, grid: { color: theme.grid }, border: { display: false } }, y: { ticks: { color: theme.foreground, font: { weight: 600 } }, grid: { display: false }, border: { display: false } } },
  };

  return <div>
    {reviews.length ? <><div className="grid gap-6 border-y border-border py-6 sm:grid-cols-[160px_1fr]">
      <div className="flex flex-col justify-center sm:border-r sm:border-border sm:pr-6"><span className="font-display text-6xl font-semibold leading-none text-foreground">{average.toFixed(1)}</span><span className="mt-3 flex gap-0.5" aria-label={`${average.toFixed(1)} out of 5 stars`}>{[1, 2, 3, 4, 5].map((number) => <Star key={number} className={`size-4 ${number <= Math.round(average) ? "fill-accent text-accent" : "text-muted/35"}`} aria-hidden="true" />)}</span><span className="mt-2 text-sm text-muted">{reviews.length} verified review{reviews.length === 1 ? "" : "s"}</span></div>
      <div role="img" aria-label={`Rating breakdown: ${counts.map((count, index) => `${5 - index} stars ${count}`).join(", ")}`} className="h-40 min-w-0"><Bar data={data} options={options} /></div></div>
      <div className="divide-y divide-border">{reviews.map((review) => <article key={review.id} className="py-6"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary-ink" aria-hidden="true">{review.customerName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><h3 className="text-sm font-semibold text-foreground">{review.customerName}</h3><time dateTime={review.createdAt} className="text-xs text-muted">{dateLabel.format(new Date(review.createdAt))}</time></div></div><span className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((number) => <Star key={number} className={`size-3.5 ${number <= review.rating ? "fill-accent text-accent" : "text-muted/30"}`} aria-hidden="true" />)}</span></div><p className="mt-4 max-w-prose text-[15px] leading-7 text-foreground/85">{review.comment}</p></article>)}</div></>
      : <div className="border-y border-border py-8"><p className="max-w-prose text-[15px] text-muted">Nobody has reviewed this tour yet. Travellers can write one once their trip is complete.</p><Link to="/reviews" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/60">Read reviews of our other tours</Link></div>}
  </div>;
}
