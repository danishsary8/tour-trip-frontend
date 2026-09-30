
import { Line } from "react-chartjs-2";
import { MONTHLY_INCOME } from "../../constants/dashboardOverviewData";
import { tooltipPreset, useChartTheme, withAlpha } from "../../lib/chart";

export default function MonthlyIncomeChart() {
    const theme = useChartTheme();
    // Chart Data
    const data = {
        labels: MONTHLY_INCOME.map(
            (item) => item.month
        ),

        datasets: [
            {
                label: "Monthly Income",

                data: MONTHLY_INCOME.map(
                    (item) => item.value
                ),

                fill: true,

                borderColor: theme.primary,

                backgroundColor: withAlpha(theme.primary, 0.1),

                borderWidth: 3,

                tension: 0.4,

                pointRadius: 5,

                pointHoverRadius: 8,

                pointBackgroundColor: theme.primary,

                pointBorderColor: theme.surface,

                pointBorderWidth: 2,
            },
        ],
    };
    // Chart Options
    const options = {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {
            intersect: false,
            mode: "index",
        },

        plugins: {

            legend: {
                display: false,
            },

            tooltip: tooltipPreset(theme, {
                callbacks: {

                    title: (items) => {
                        return items[0].label;
                    },

                    label: (context) => {
                        return `$${context.raw.toLocaleString()}`;
                    },
                },
            }),
        },
        scales: {

            x: {

                grid: {
                    display: false,
                },

                border: {
                    display: false,
                },

                ticks: {
                    color: theme.muted,

                    font: {
                        size: 12,
                        weight: "500",
                    },
                },
            },


            y: {

                min: 0,

                max: 50000,

                ticks: {

                    stepSize: 5000,

                    color: theme.muted,

                    font: {
                        size: 11,
                    },

                    callback: (value) => {
                        return `$${value / 1000}k`;
                    },
                },

                grid: {

                    color: theme.grid,

                    drawTicks: false,
                },

                border: {
                    display: false,
                },
            },
        },
    };
    // UI
    return (
        <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">

                <div>
                    <h3 className="text-lg font-bold text-foreground">
                        Monthly Income
                    </h3>

                    <p className="mt-1 text-xs text-muted">
                        Income performance from May to October
                    </p>
                </div>
                <button
                    className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-lg
                        text-xl font-bold
                        text-muted
                        transition
                        hover:bg-surface-2
                        hover:text-foreground
                    "
                >
                    ⋮
                </button>
            </div>
            {/* Summary */}
            <div className="mb-5 flex items-end justify-between">

                <div>

                    <p className="text-xs font-medium text-muted">
                        Current Income
                    </p>

                    <h4 className="mt-1 text-2xl font-bold text-foreground">
                        $45,200
                    </h4>

                </div>


                <div
                    className="
                        rounded-full
                        bg-success/12
                        px-3 py-1
                        text-xs font-semibold
                        text-success-ink
                    "
                >
                    ↑ 15.2%
                </div>

            </div>


            {/* Chart */}
            <div className="min-h-[280px] flex-1">

                <Line
                    data={data}
                    options={options}
                />

            </div>

        </div>
    );
}
