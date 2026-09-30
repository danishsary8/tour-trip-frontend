import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Star, ShieldAlert, CheckCircle2, EyeOff } from "lucide-react";
import { Skeleton } from "../../../components/shared/Skeleton";
import { tooltipPreset, useChartTheme, withAlpha } from "../../../lib/chart";

function RatingStars({ rating, className = "size-5" }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFilled = starIndex <= fullStars;
        const isHalf = !isFilled && starIndex === fullStars + 1 && hasHalfStar;

        return (
          <div key={starIndex} className="relative">
            <Star
              className={`${className} ${
                isFilled
                  ? "fill-accent text-accent"
                  : "fill-transparent text-border"
              }`}
            />
            {isHalf && (
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star className={`${className} fill-accent text-accent`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ReviewStatsHeaderSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-12 mb-6 sm:mb-8">
      <div className="md:col-span-5 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="flex items-baseline gap-3 mb-3">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
      <div className="md:col-span-7 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ReviewStatsHeader({ stats, isLoading }) {
  const theme = useChartTheme();

  const chartData = useMemo(() => {
    if (!stats?.distribution) return null;

    // Distribution is ordered 5 down to 1
    const labels = stats.distribution.map((d) => `${d.stars} Stars`);
    const counts = stats.distribution.map((d) => d.count);

    const barColors = [
      theme.accent,
      theme.primary,
      theme.info,
      theme.warning,
      theme.danger,
    ];

    return {
      labels,
      datasets: [
        {
          label: "Reviews",
          data: counts,
          backgroundColor: barColors.map((c) => withAlpha(c, 0.85)),
          hoverBackgroundColor: barColors,
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 12,
        },
      ],
    };
  }, [stats, theme]);

  const chartOptions = useMemo(() => {
    return {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 4, bottom: 4, left: 0, right: 12 },
      },
      plugins: {
        legend: { display: false },
        tooltip: tooltipPreset(theme, {
          callbacks: {
            title: (items) => items[0]?.label ?? "",
            label: (context) => {
              const count = context.raw;
              const total = stats?.totalCount || 1;
              const pct = Math.round((count / total) * 100);
              return ` ${count} ${count === 1 ? "review" : "reviews"} (${pct}%)`;
            },
          },
        }),
      },
      scales: {
        x: {
          grid: {
            color: theme.grid,
            drawBorder: false,
          },
          ticks: {
            color: theme.muted,
            precision: 0,
            font: { family: '"Inter Variable", "Kantumruy Pro", sans-serif', size: 11 },
          },
        },
        y: {
          grid: { display: false, drawBorder: false },
          ticks: {
            color: theme.foreground,
            font: { family: '"Inter Variable", "Kantumruy Pro", sans-serif', size: 12, weight: "500" },
          },
        },
      },
    };
  }, [stats, theme]);

  if (isLoading || !stats) {
    return <ReviewStatsHeaderSkeleton />;
  }

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-12 mb-6 sm:mb-8">
      {/* Overview Card */}
      <div className="md:col-span-5 flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-sm">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-ink">
            Customer Sentiment
          </span>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              {stats.averageRating.toFixed(1)}
            </span>
            <div className="flex flex-col">
              <RatingStars rating={stats.averageRating} className="size-4 sm:size-4.5" />
              <span className="mt-1 text-xs text-muted">
                out of 5.0 rating
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-muted">
            Based on <span className="font-medium text-foreground">{stats.totalCount}</span> verified tour reviews
          </p>
        </div>

        {/* Action / Status Summary Chips */}
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4">
          <div className="rounded-xl border border-accent/20 bg-accent/10 p-2.5 sm:p-3 text-center transition-colors">
            <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-accent-ink">
              <ShieldAlert className="size-3.5" />
              <span>Pending</span>
            </div>
            <div className="mt-1 text-lg sm:text-xl font-bold tabular-nums text-foreground">
              {stats.pendingCount}
            </div>
          </div>

          <div className="rounded-xl border border-success/20 bg-success/10 p-2.5 sm:p-3 text-center transition-colors">
            <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-success-ink">
              <CheckCircle2 className="size-3.5" />
              <span>Approved</span>
            </div>
            <div className="mt-1 text-lg sm:text-xl font-bold tabular-nums text-foreground">
              {stats.approvedCount}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-2 p-2.5 sm:p-3 text-center transition-colors">
            <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-muted">
              <EyeOff className="size-3.5" />
              <span>Hidden</span>
            </div>
            <div className="mt-1 text-lg sm:text-xl font-bold tabular-nums text-foreground">
              {stats.hiddenCount}
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Chart Card */}
      <div className="md:col-span-7 flex flex-col rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              Rating Distribution
            </h3>
            <p className="text-xs text-muted">
              Breakdown across star ratings
            </p>
          </div>
          <span className="text-xs font-medium text-muted tabular-nums">
            {stats.totalCount} total
          </span>
        </div>

        <div className="h-44 sm:h-48 w-full mt-2">
          {chartData && <Bar data={chartData} options={chartOptions} />}
        </div>
      </div>
    </div>
  );
}
