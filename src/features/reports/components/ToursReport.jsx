import { useCallback, useMemo } from "react";
import { Star } from "lucide-react";
import { DataTable } from "../../../components/shared/DataTable";
import { formatCount, formatUsd } from "../../../lib/format";
import { RANGE_COPY } from "../../dashboard/ranges";
import { useWidgetStatus } from "../../dashboard/widgetState";
import { useRegisterExport } from "../exportContext";
import { useToursReport } from "../hooks";

function Rating({ value, reviews }) {
  if (value === null) return <span className="text-xs text-muted">No reviews</span>;
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <Star className="size-3.5 fill-accent text-accent" aria-hidden="true" />
      <span className="font-semibold tabular-nums">{value.toFixed(1)}</span>
      <span className="text-xs text-muted">({reviews})</span>
    </span>
  );
}

function ShareBar({ value }) {
  return (
    <span className="flex min-w-[120px] items-center gap-2">
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.07]" aria-hidden="true">
        <span className="block h-full origin-left rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-700" style={{ transform: `scaleX(${value / 100})` }} />
      </span>
      <span className="w-12 text-right text-xs font-semibold tabular-nums">{value.toFixed(1)}%</span>
    </span>
  );
}

/** Popular tours report: every tour ranked by bookings, sortable, with ratings from Reviews. */
export function ToursReport({ range }) {
  const query = useToursReport(range);
  const status = useWidgetStatus(query, (data) => data.totals.bookings === 0);
  const rows = useMemo(() => (status === "ready" ? query.data.rows : []), [status, query.data]);

  const columns = useMemo(
    () => [
      { accessorKey: "rank", header: "#", enableGlobalFilter: false, size: 48, cell: ({ getValue }) => <span className="font-display font-semibold tabular-nums text-muted">{getValue()}</span> },
      {
        accessorKey: "name",
        header: "Tour",
        cell: ({ row }) => (
          <span className="flex items-center gap-3">
            <img src={row.original.image} alt="" width="40" height="40" loading="lazy" className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-border" />
            <span className="min-w-0">
              <span className="block truncate font-semibold">{row.original.name}</span>
              <span className="block text-xs text-muted">{row.original.destination}</span>
            </span>
          </span>
        ),
      },
      { accessorKey: "bookings", header: "Bookings", enableGlobalFilter: false, cell: ({ getValue }) => <span className="font-semibold tabular-nums">{formatCount(getValue())}</span> },
      { accessorKey: "travellers", header: "Travellers", enableGlobalFilter: false, meta: { className: "hidden xl:table-cell" }, cell: ({ getValue }) => <span className="tabular-nums">{formatCount(getValue())}</span> },
      { accessorKey: "revenue", header: "Revenue", enableGlobalFilter: false, cell: ({ getValue }) => <span className="font-semibold tabular-nums">{formatUsd(getValue())}</span> },
      {
        accessorKey: "rating",
        header: "Avg rating",
        enableGlobalFilter: false,
        sortUndefined: "last",
        sortingFn: (a, b) => (a.original.rating ?? -1) - (b.original.rating ?? -1),
        cell: ({ row }) => <Rating value={row.original.rating} reviews={row.original.reviews} />,
      },
      { accessorKey: "share", header: "% of bookings", enableGlobalFilter: false, cell: ({ getValue }) => <ShareBar value={getValue()} /> },
    ],
    [],
  );

  const buildExport = useCallback(
    () => ({
      title: "Popular tours",
      subtitle: `${RANGE_COPY[range].period[0].toUpperCase()}${RANGE_COPY[range].period.slice(1)} · bookings made, revenue received (USD)`,
      filename: `tourtrip-popular-tours-${range.toLowerCase()}`,
      summary: [
        ["Bookings", query.data.totals.bookings, "count"],
        ["Revenue", query.data.totals.revenue, "usd"],
        ["Top tour", query.data.rows[0]?.name ?? "-", "text"],
        ["Tours with bookings", query.data.rows.filter((row) => row.bookings > 0).length, "count"],
      ],
      tables: [
        {
          name: "Tours",
          columns: [
            { header: "Rank", key: "rank", format: "count", width: 6 },
            { header: "Tour", key: "name", width: 26 },
            { header: "Destination", key: "destination", width: 16 },
            { header: "Bookings", key: "bookings", format: "count" },
            { header: "Travellers", key: "travellers", format: "count" },
            { header: "Revenue", key: "revenue", format: "usd" },
            { header: "Avg rating", key: "rating", format: "rating" },
            { header: "Reviews", key: "reviews", format: "count" },
            { header: "% of bookings", key: "share", format: "percent" },
          ],
          rows: query.data.rows,
        },
      ],
    }),
    [query.data, range],
  );
  useRegisterExport(buildExport, status === "ready");

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Every tour ranked by bookings made in the {RANGE_COPY[range].period}. Ratings average visible reviews (hidden reviews excluded). Click a column to sort.
      </p>
      <DataTable
        rows={rows}
        columns={columns}
        caption="Popular tours"
        loading={status === "loading"}
        error={status === "error"}
        onRetry={() => query.refetch()}
        searchPlaceholder="Search tours"
        selectable={false}
        dense
        cardsBelow="lg"
        pageSize={10}
        emptyTitle="No bookings in this range"
        emptyDescription="Try a longer range to rank tours."
      />
    </div>
  );
}
