import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Power, Search, Trash2 } from "lucide-react";
import { usePopover } from "../../hooks/usePopover";
import { cn } from "../../lib/cn";
import { MenuItem, PopoverPanel } from "../ui/Popover";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "./Skeleton";

function SelectBox({ checked, indeterminate, onChange, label, disabled = false }) {
  return <input type="checkbox" checked={checked} disabled={disabled} ref={(node) => { if (node) node.indeterminate = indeterminate; }} onChange={onChange}
    aria-label={label} className="size-4 cursor-pointer rounded border-border accent-primary focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-30" />;
}

// Clicks on controls inside a clickable row keep their own behaviour.
const isInteractive = (target) => Boolean(target.closest?.("button, a, input, select, textarea, label, [role=menuitem]"));

function rowActivation(onRowClick, row) {
  if (!onRowClick) return {};
  return {
    tabIndex: 0,
    onClick: (event) => { if (!isInteractive(event.target)) onRowClick(row); },
    onKeyDown: (event) => {
      if ((event.key === "Enter" || event.key === " ") && event.target === event.currentTarget) {
        event.preventDefault();
        onRowClick(row);
      }
    },
  };
}

const defaultRowLabel = (row) => row.name ?? row.id;

// Width from which the table replaces the stacked cards.
const CARD_BREAKPOINTS = {
  md: { table: "md:block", cards: "md:hidden" },
  lg: { table: "lg:block", cards: "lg:hidden" },
  xl: { table: "xl:block", cards: "xl:hidden" },
};

export function RowActions({ row, onEdit, onDelete, onToggle }) {
  const { open, toggle, close, triggerRef, panelRef } = usePopover();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const active = String(row.status).toLowerCase() === "active";

  function openMenu() {
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8 + 150 > window.innerHeight ? rect.top - 154 : rect.bottom + 8,
      left: Math.max(8, Math.min(rect.right - 184, window.innerWidth - 192)),
    });
    toggle();
  }

  return (
    <>
      <button ref={triggerRef} type="button" aria-label={`Actions for ${row.name ?? row.id}`} aria-haspopup="menu" aria-expanded={open} onClick={openMenu}
        className="grid size-8 place-items-center rounded-lg text-muted outline-none transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95">
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </button>
      {open && createPortal(
        <div className="fixed z-[80]" style={position}>
          <PopoverPanel ref={panelRef} open label={`Actions for ${row.name ?? row.id}`} className="!relative !top-0 !right-auto min-w-44">
            {onEdit && <MenuItem icon={Pencil} onClick={() => { close(); onEdit(row); }}>Edit</MenuItem>}
            {onToggle && <MenuItem icon={Power} onClick={() => { close(); onToggle(row); }}>{active ? "Deactivate" : "Activate"}</MenuItem>}
            {onDelete && <MenuItem icon={Trash2} tone="danger" onClick={() => { close(); onDelete(row); }}>Delete</MenuItem>}
          </PopoverPanel>
        </div>, document.body,
      )}
    </>
  );
}

/**
 * Sortable, searchable table with column filters, bulk actions and mobile cards.
 * Optional: `onRowClick` (keyboard-activatable rows), `rowActions(row)` in place of the edit
 * menu, `canSelectRow(row)`, `bulkActions: [{ label, tone, onClick(selected, clear) }]`,
 * `toolbar` (extra filter controls), `mobileCard(row)`, `initialSorting`, `error` + `onRetry`, `dense`.
 * `selectable={false}` hides the selection column. `cardsBelow` ("md" | "lg" | "xl") sets where stacked cards give way to the table.
 * A column's `meta.className` applies to its header and cells (e.g. responsive hiding).
 */
export function DataTable({ rows = [], columns, loading = false, searchPlaceholder = "Search records", filters = [],
  onEdit, onDelete, onToggle, onBulkDelete, onBulkToggle, emptyTitle = "No records found", emptyDescription = "Try another search or filter.",
  onRowClick, rowActions, canSelectRow, bulkActions = [], toolbar, mobileCard, initialSorting = [], pageSize = 8, error = false, onRetry,
  rowLabel = defaultRowLabel, caption, dense = false, cardsBelow = "md", selectable = true }) {
  const [sorting, setSorting] = useState(initialSorting);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const reduceMotion = useReducedMotion();

  const hasActions = Boolean(onEdit || onDelete || onToggle || rowActions);

  const allColumns = useMemo(() => {
    const renderActions = (row) => (rowActions ? rowActions(row) : <RowActions row={row} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />);
    return [
      ...(selectable ? [{ id: "select", enableSorting: false, enableGlobalFilter: false, size: 42,
        header: ({ table }) => <SelectBox label="Select this page" checked={table.getIsAllPageRowsSelected()} indeterminate={table.getIsSomePageRowsSelected()} onChange={table.getToggleAllPageRowsSelectedHandler()} />,
        cell: ({ row }) => <SelectBox label={`Select ${rowLabel(row.original)}`} checked={row.getIsSelected()} indeterminate={false} disabled={!row.getCanSelect()} onChange={row.getToggleSelectedHandler()} /> }] : []),
      ...columns,
      ...(onEdit || onDelete || onToggle || rowActions ? [{ id: "actions", enableSorting: false, enableGlobalFilter: false, size: rowActions ? 96 : 54,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => renderActions(row.original) }] : []),
    ];
  }, [columns, onEdit, onDelete, onToggle, rowActions, rowLabel, selectable]);
  const renderMobileActions = (row) => (rowActions ? rowActions(row) : <RowActions row={row} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />);

  const table = useReactTable({
    data: rows, columns: allColumns, getRowId: (row) => String(row.id),
    state: { sorting, columnFilters, globalFilter, rowSelection },
    onSortingChange: setSorting, onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter, onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString", initialState: { pagination: { pageSize } },
    enableRowSelection: canSelectRow ? (row) => canSelectRow(row.original) : true,
  });
  const pageRows = table.getRowModel().rows;
  const selected = table.getSelectedRowModel().rows.map((row) => row.original);
  const filteredCount = table.getFilteredRowModel().rows.length;

  function bulk(action, status) {
    if (action) action(selected, status);
    table.resetRowSelection();
  }
  const clearSelection = () => table.resetRowSelection();
  const renderMobileBody = (row) => (mobileCard ? mobileCard(row.original) : <dl className="space-y-2.5">{row.getVisibleCells().filter((cell) => !["select", "actions"].includes(cell.column.id)).map((cell) => <div key={cell.id} className="grid grid-cols-[90px_minmax(0,1fr)] gap-3 text-sm">
                <dt className="text-xs font-medium text-muted">{typeof cell.column.columnDef.header === "string" ? cell.column.columnDef.header : cell.column.id}</dt>
                <dd className="min-w-0 break-words text-foreground">{flexRender(cell.column.columnDef.cell, cell.getContext())}</dd>
              </div>)}</dl>);

  return (
    <section className="min-w-0 overflow-hidden rounded-panel border border-border bg-surface shadow-soft">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:p-5">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <span className="sr-only">Search records</span>
          <input type="search" value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} placeholder={searchPlaceholder}
            className="h-10 w-full rounded-control border border-border bg-surface-2/50 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
        <div className="flex flex-wrap gap-2">
          {filters.map(({ columnId, label, options }) => <select key={columnId} aria-label={`Filter ${label}`} value={table.getColumn(columnId)?.getFilterValue() ?? ""}
            onChange={(event) => table.getColumn(columnId)?.setFilterValue(event.target.value || undefined)}
            className="h-10 rounded-control border border-border bg-surface px-3 text-sm text-foreground outline-none transition-colors hover:border-primary/35 focus-visible:ring-2 focus-visible:ring-primary/30">
            <option value="">All {label.toLowerCase()}</option>
            {options.map((option) => <option key={option.value ?? option} value={option.value ?? option}>{option.label ?? option}</option>)}
          </select>)}
          {toolbar}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {selected.length > 0 && <motion.div key="bulk" initial={reduceMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="flex flex-wrap items-center gap-2 border-b border-primary/20 bg-primary/[0.06] px-4 py-3 text-xs sm:px-5">
          <strong className="mr-auto text-foreground">{selected.length} selected</strong>
          {onBulkToggle && <><button type="button" onClick={() => bulk(onBulkToggle, "Active")} className="rounded-lg px-2 py-1.5 font-semibold text-success-ink hover:bg-success/12 focus-visible:outline-2 focus-visible:outline-primary">Activate</button>
            <button type="button" onClick={() => bulk(onBulkToggle, "Inactive")} className="rounded-lg px-2 py-1.5 font-semibold text-muted hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-primary">Deactivate</button></>}
          {onBulkDelete && <button type="button" onClick={() => bulk(onBulkDelete)} className="rounded-lg px-2 py-1.5 font-semibold text-danger-ink hover:bg-danger/12 focus-visible:outline-2 focus-visible:outline-primary">Delete</button>}
          {bulkActions.map((action) => <button key={action.label} type="button" onClick={() => action.onClick(selected, clearSelection)}
            className={cn("rounded-lg px-2.5 py-1.5 font-semibold outline-none transition-[background-color,transform] active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/60",
              action.tone === "success" ? "bg-success/12 text-success-ink hover:bg-success/20" : action.tone === "danger" ? "text-danger-ink hover:bg-danger/12" : "text-foreground hover:bg-surface-2")}>{action.label}</button>)}
          {bulkActions.length > 0 && <button type="button" onClick={clearSelection} className="rounded-lg px-2 py-1.5 font-semibold text-muted outline-none hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/60">Clear</button>}
        </motion.div>}
      </AnimatePresence>

      {error ? <div role="alert" className="m-5 flex flex-col items-center gap-3 rounded-card border border-dashed border-danger/30 bg-danger/[0.04] p-8 text-center text-sm text-muted">
          Records could not be loaded.
          {onRetry && <button type="button" onClick={onRetry} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground outline-none transition-colors hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95">Retry</button>}
        </div>
        : loading ? <div className="space-y-3 p-5" aria-label="Loading records" role="status">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        : filteredCount === 0 ? <EmptyState compact title={emptyTitle} description={emptyDescription} className="m-5 border-0 bg-transparent" />
        : <>
          <div className={cn("hidden max-h-[70vh] overflow-auto", CARD_BREAKPOINTS[cardsBelow].table)}>
            <table className="w-full min-w-[750px] text-left text-sm">
              {caption && <caption className="sr-only">{caption}</caption>}
              <thead className="sticky top-0 z-10 bg-surface-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                {table.getHeaderGroups().map((group) => <tr key={group.id}>{group.headers.map((header) => <th key={header.id} scope="col" style={{ width: header.column.columnDef.size }}
                  aria-sort={header.column.getCanSort() ? header.column.getIsSorted() === "asc" ? "ascending" : header.column.getIsSorted() === "desc" ? "descending" : "none" : undefined}
                  className={cn("whitespace-nowrap border-b border-border py-3", dense ? "px-3" : "px-4", header.column.columnDef.meta?.className)}>
                  {header.isPlaceholder ? null : header.column.getCanSort() ? <button type="button" onClick={header.column.getToggleSortingHandler()}
                    className="inline-flex items-center gap-1.5 rounded text-left uppercase tracking-[0.12em] outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/60">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" ? <ArrowUp className="size-3.5" /> : header.column.getIsSorted() === "desc" ? <ArrowDown className="size-3.5" /> : null}
                  </button> : flexRender(header.column.columnDef.header, header.getContext())}
                </th>)}</tr>)}
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {pageRows.map((row) => <motion.tr key={row.id} layout={reduceMotion ? false : "position"} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: reduceMotion ? 0 : 0.22 }} data-selected={row.getIsSelected()} {...rowActivation(onRowClick, row.original)}
                    aria-label={onRowClick ? `Open ${rowLabel(row.original)}` : undefined}
                    className={cn("transition-colors hover:bg-surface-2/55 data-[selected=true]:bg-primary/[0.06]", onRowClick && "cursor-pointer outline-none focus-visible:bg-surface-2/70 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50 active:bg-surface-2")}>
                    {row.getVisibleCells().map((cell) => <td key={cell.id} className={cn("max-w-[260px] text-foreground", dense ? "px-3 py-3" : "px-4 py-3.5", cell.column.columnDef.meta?.className)}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                  </motion.tr>)}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className={cn("space-y-3 p-4", CARD_BREAKPOINTS[cardsBelow].cards)}>
            <AnimatePresence initial={false}>{pageRows.map((row) => <motion.article key={row.id} layout={reduceMotion ? false : "position"} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              {...rowActivation(onRowClick, row.original)} aria-label={onRowClick ? `Open ${rowLabel(row.original)}` : undefined}
              className={cn("rounded-card border border-border bg-surface-2/35 p-4 shadow-soft", row.getIsSelected() && "border-primary/40",
                onRowClick && "cursor-pointer outline-none transition-[border-color,transform] hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-[0.99]")}>
              {selectable ? <><div className="mb-3 flex items-start justify-between gap-2"><SelectBox label={`Select ${rowLabel(row.original)}`} checked={row.getIsSelected()} indeterminate={false} disabled={!row.getCanSelect()} onChange={row.getToggleSelectedHandler()} />
                {hasActions && renderMobileActions(row.original)}</div>
              {renderMobileBody(row)}</> : <div className="flex items-start gap-2"><div className="min-w-0 flex-1">{renderMobileBody(row)}</div>{hasActions && renderMobileActions(row.original)}</div>}
            </motion.article>)}</AnimatePresence>
          </div>
        </>}

      <div className="flex flex-col gap-2 border-t border-border px-4 py-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <span>{filteredCount} {filteredCount === 1 ? "record" : "records"} · Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}</span>
        <nav className="flex items-center gap-2" aria-label="Table pages">
          <button type="button" aria-label="Previous page" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="grid size-8 place-items-center rounded-lg border border-border text-foreground outline-none transition-colors hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-primary/60 disabled:opacity-40"><ChevronLeft className="size-4" /></button>
          <button type="button" aria-label="Next page" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="grid size-8 place-items-center rounded-lg border border-border text-foreground outline-none transition-colors hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-primary/60 disabled:opacity-40"><ChevronRight className="size-4" /></button>
        </nav>
      </div>
    </section>
  );
}
