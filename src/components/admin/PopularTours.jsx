import { Doughnut } from "react-chartjs-2";
import { POPULAR_TOURS } from "../../constants/dashboardOverviewData";
import { tooltipPreset, useChartTheme } from "../../lib/chart";

export default function PopularTours() {
    const theme = useChartTheme();
    // Convert your POPULAR_TOURS data to Chart.js format
    const data = {
        labels: POPULAR_TOURS.map((tour) => tour.name),

        datasets: [
            {
                label: "Popular Tours",

                data: POPULAR_TOURS.map((tour) => tour.percentage),

                backgroundColor: [theme.success, theme.accent, theme.info, theme.muted],

                hoverOffset: 8,

                borderWidth: 3,

                borderColor: theme.surface,
            },
        ],
    };

    const options = {
        responsive: true,

        maintainAspectRatio: false,

        cutout: "72%",

        plugins: {
            legend: {
                display: false,
            },

            tooltip: tooltipPreset(theme, {
                callbacks: {
                    label: function (context) {
                        return ` ${context.label}: ${context.raw}%`;
                    },
                },
            }),
        },
    };

    return (
        <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm">
            {/* ================= HEADER ================= */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Popular Tours</h3>

                    <p className="mt-1 text-xs text-muted">
                        Most popular tour categories
                    </p>
                </div>

                <button
                    className="
                        flex h-9 w-9 items-center justify-center
                        rounded-lg text-xl font-bold
                        text-muted
                        transition
                        hover:bg-surface-2
                        hover:text-foreground
                    "
                >
                    ⋮
                </button>
            </div>

            {/* ================= DOUGHNUT ================= */}
            <div className="relative mx-auto my-4 h-56 w-56">
                <Doughnut data={data} options={options} />

                {/* Center Content */}
                <div
                    className="
                        pointer-events-none
                        absolute inset-0
                        flex flex-col
                        items-center
                        justify-center
                    "
                >
                    <span className="text-3xl font-bold text-foreground">42</span>

                    <span className="mt-1 text-xs font-medium text-muted">
                        Active Tours
                    </span>

                    <span className="mt-1 text-[10px] font-semibold text-success-ink">
                        ↑ 8.4% this month
                    </span>
                </div>
            </div>

            {/* ================= TOUR LIST ================= */}
            <div className="mt-4 space-y-3">
                {POPULAR_TOURS.map((tour, idx) => (
                    <div
                        key={idx}
                        className="
                            group flex items-center
                            justify-between rounded-xl
                            px-2 py-2
                            transition
                            hover:bg-background
                        "
                    >
                        <div className="flex items-center gap-3">
                            {/* Number */}
                            <span
                                className="
                                    flex h-7 w-7
                                    items-center justify-center
                                    rounded-lg bg-surface-2
                                    text-xs font-bold
                                    text-muted
                                    transition
                                    group-hover:bg-primary/10
                                    group-hover:text-primary-ink
                                "
                            >
                                {idx + 1}
                            </span>

                            {/* Color */}
                            <span
                                className={`
                                    h-2.5 w-2.5 rounded-full
                                    ${tour.color.split(" ")[0]}
                                `}
                            />

                            <span className="text-sm font-medium text-muted">
                                {tour.name}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">
                                {tour.percentage}%
                            </span>

                            <span className="text-xs text-muted">→</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= FOOTER ================= */}
            <button
                className="
                    mt-5 w-full rounded-xl
                    border border-border
                    py-2.5 text-xs font-semibold
                    text-muted
                    transition-all
                    hover:border-primary/20
                    hover:bg-primary/10
                    hover:text-primary-ink
                "
            >
                View All Tours →
            </button>
        </div>
    );
}
