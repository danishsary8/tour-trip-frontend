import { useMemo, useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CalendarDays, ChevronLeft, ChevronRight, List, Plus } from "lucide-react";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { DataTable } from "../../../components/shared/DataTable";
import { Drawer } from "../../../components/shared/Drawer";
import { MastersShell } from "../../../components/shared/MastersShell";
import { Skeleton } from "../../../components/shared/Skeleton";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { useDeleteSchedule, useSaveSchedule, useScheduleStatus, useSchedules } from "../../../features/schedules/hooks";
import { scheduleSchema } from "../../../features/schedules/schema";
import { useTours } from "../../../features/tours/hooks";

const EMPTY = [];
const field = "w-full rounded-control border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";
const dayKey = (date) => format(date, "yyyy-MM-dd");

function capacityTone(item) {
  const ratio = item.seatsBooked / item.capacity;
  return ratio >= 1 ? "bg-danger" : ratio >= 0.8 ? "bg-accent" : "bg-success";
}

function ScheduleForm({ item, date, tours, onSave }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(scheduleSchema), defaultValues: {
    tourId: item?.tourId ?? "", date: item?.date ?? date, time: item?.time ?? "08:00", capacity: item?.capacity ?? 16,
    priceOverride: item?.priceOverride ?? "", status: item?.status ?? "Active",
  } });
  return <form id="schedule-form" onSubmit={handleSubmit((data) => onSave({ ...data, priceOverride: data.priceOverride === "" ? null : Number(data.priceOverride), seatsBooked: item?.seatsBooked ?? 0 }))} className="space-y-5">
    <div><label htmlFor="schedule-tour" className="mb-1.5 block text-sm font-semibold">Tour</label><select id="schedule-tour" {...register("tourId")} className={field} aria-invalid={Boolean(errors.tourId)}><option value="">Choose a tour</option>{tours.map((tour) => <option key={tour.id} value={tour.id}>{tour.name}</option>)}</select>{errors.tourId && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors.tourId.message}</p>}</div>
    <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="schedule-date" className="mb-1.5 block text-sm font-semibold">Departure date</label><input id="schedule-date" type="date" {...register("date")} className={field} aria-invalid={Boolean(errors.date)} />{errors.date && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors.date.message}</p>}</div>
      <div><label htmlFor="schedule-time" className="mb-1.5 block text-sm font-semibold">Time</label><input id="schedule-time" type="time" {...register("time")} className={field} aria-invalid={Boolean(errors.time)} />{errors.time && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors.time.message}</p>}</div></div>
    <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="schedule-capacity" className="mb-1.5 block text-sm font-semibold">Seat capacity</label><input id="schedule-capacity" type="number" min={Math.max(1, item?.seatsBooked ?? 1)} {...register("capacity")} className={field} aria-invalid={Boolean(errors.capacity)} />{errors.capacity && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors.capacity.message}</p>}</div>
      <div><label htmlFor="schedule-price" className="mb-1.5 block text-sm font-semibold">Price override (USD)</label><input id="schedule-price" type="number" min="0" step="0.01" {...register("priceOverride")} className={field} placeholder="Use tour price" aria-invalid={Boolean(errors.priceOverride)} />{errors.priceOverride && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors.priceOverride.message}</p>}</div></div>
    <div><label htmlFor="schedule-status" className="mb-1.5 block text-sm font-semibold">Status</label><select id="schedule-status" {...register("status")} className={field}><option>Active</option><option>Inactive</option></select></div>
  </form>;
}

export default function SchedulesPage() {
  const query = useSchedules(); const tours = useTours(); const save = useSaveSchedule(); const remove = useDeleteSchedule(); const changeStatus = useScheduleStatus();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [view, setView] = useState(() => localStorage.getItem("tourtrip-schedules-view") || (window.innerWidth < 768 ? "table" : "calendar"));
  const [editing, setEditing] = useState(null); const [selectedDate, setSelectedDate] = useState(dayKey(new Date())); const [drawerOpen, setDrawerOpen] = useState(false); const [deleting, setDeleting] = useState([]);
  const rows = query.data ?? EMPTY; const tourRows = tours.data ?? EMPTY;
  const days = useMemo(() => eachDayOfInterval({ start: startOfWeek(startOfMonth(month)), end: endOfWeek(endOfMonth(month)) }), [month]);
  const byDate = useMemo(() => rows.reduce((map, item) => { (map[item.date] ??= []).push(item); return map; }, {}), [rows]);
  const columns = useMemo(() => [
    { accessorKey: "date", header: "Date", cell: ({ getValue }) => <span className="font-semibold tabular-nums">{format(parseISO(getValue()), "dd MMM yyyy")}</span> },
    { accessorKey: "tourName", header: "Tour" },
    { accessorKey: "time", header: "Time" },
    { accessorKey: "capacity", header: "Seats", cell: ({ row }) => <span className="font-semibold tabular-nums">{row.original.seatsBooked} / {row.original.capacity}</span> },
    { accessorKey: "priceOverride", header: "Price", cell: ({ getValue }) => getValue() == null ? <span className="text-muted">Tour price</span> : `$${Number(getValue()).toFixed(2)}` },
    { accessorKey: "status", header: "Status", filterFn: "equalsString", cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
  ], []);
  function chooseView(next) { setView(next); localStorage.setItem("tourtrip-schedules-view", next); }
  function openCreate(date = dayKey(new Date())) { setEditing(null); setSelectedDate(date); setDrawerOpen(true); }
  function openEdit(item) { setEditing(item); setSelectedDate(item.date); setDrawerOpen(true); }
  async function onSave(data) { try { if (data.capacity < (editing?.seatsBooked ?? 0)) { toast.error("Capacity cannot be lower than already booked seats"); return; } await save.mutateAsync({ data, id: editing?.id }); toast.success(editing ? "Departure updated" : "Departure scheduled"); setDrawerOpen(false); setMonth(startOfMonth(parseISO(data.date))); } catch (error) { toast.error(error.message || "Departure could not be saved"); } }
  async function onDelete() { try { for (const item of deleting) await remove.mutateAsync(item.id); toast.success(deleting.length === 1 ? "Departure deleted" : `${deleting.length} departures deleted`); } catch (error) { toast.error(error.message); } finally { setDeleting([]); } }
  async function onStatus(item, status) { try { await changeStatus.mutateAsync({ id: item.id, status }); toast.success(`Departure ${status.toLowerCase()}`); } catch (error) { toast.error(error.message); } }
  return <MastersShell title="Tour schedules" description="Plan every departure, track seats and keep availability clear." actions={<Button onClick={() => openCreate()}><Plus className="size-4" /> Add schedule</Button>}>
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted">{rows.length} scheduled departures</p><div className="flex rounded-control border border-border bg-surface p-1" role="group" aria-label="Display view">
      {[["calendar", CalendarDays], ["table", List]].map(([key, Icon]) => <button key={key} type="button" onClick={() => chooseView(key)} aria-label={`${key} view`} aria-pressed={view === key} className={`grid size-9 place-items-center rounded-lg outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary ${view === key ? "bg-primary/12 text-primary-ink" : "text-muted"}`}><Icon className="size-4" /></button>)}</div></div>
    {query.isError ? <div role="alert" className="rounded-card border border-danger/30 bg-surface p-5">Schedules could not load. <button onClick={() => query.refetch()} className="text-primary-ink underline">Retry</button></div> : view === "table" ?
      <DataTable rows={rows} columns={columns} loading={query.isLoading} searchPlaceholder="Search departures" filters={[{ columnId: "status", label: "Status", options: ["Active", "Inactive"] }]}
        onEdit={openEdit} onDelete={(item) => setDeleting([item])} onToggle={(item) => onStatus(item, item.status === "Active" ? "Inactive" : "Active")}
        onBulkDelete={setDeleting} onBulkToggle={async (items, status) => { for (const item of items) await onStatus(item, status); }} /> :
      <section className="overflow-hidden rounded-panel border border-border bg-surface shadow-soft"><header className="flex items-center justify-between gap-3 border-b border-border p-4 sm:p-5"><div><p className="text-xs font-semibold uppercase tracking-widest text-accent-ink">Departure calendar</p><h2 className="font-display text-xl font-semibold">{format(month, "MMMM yyyy")}</h2></div><div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Previous month" onClick={() => setMonth(addMonths(month, -1))}><ChevronLeft className="size-4" /></Button><Button variant="outline" size="sm" onClick={() => setMonth(startOfMonth(new Date()))}>Today</Button><Button variant="ghost" size="icon" aria-label="Next month" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight className="size-4" /></Button></div></header>
        {query.isLoading ? <div className="grid grid-cols-7 gap-2 p-4">{Array.from({ length: 35 }, (_, index) => <Skeleton key={index} className="h-28" />)}</div> :
          <div className="overflow-x-auto"><div className="grid min-w-[840px] grid-cols-7 border-l border-border">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="border-b border-r border-border bg-surface-2 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">{day}</div>)}
            {days.map((day) => { const key = dayKey(day); const entries = byDate[key] ?? []; const current = isSameMonth(day, month); return <div key={key} className={`group min-h-36 border-b border-r border-border p-2 transition-colors hover:bg-surface-2/55 ${current ? "bg-surface" : "bg-surface-2/30 text-muted"}`}>
              <div className="mb-2 flex items-center justify-between"><span className={`grid size-7 place-items-center rounded-full text-xs font-semibold ${key === dayKey(new Date()) ? "bg-primary text-white" : ""}`}>{format(day, "d")}</span><button type="button" onClick={() => openCreate(key)} aria-label={`Add schedule on ${format(day, "dd MMMM yyyy")}`} className="grid size-7 place-items-center rounded-lg text-muted opacity-0 transition-all hover:bg-primary/12 hover:text-primary-ink focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary group-hover:opacity-100"><Plus className="size-3.5" /></button></div>
              <div className="space-y-1.5">{entries.map((item) => <button type="button" key={item.id} onClick={() => openEdit(item)} title={`${item.tourName} · ${item.seatsBooked}/${item.capacity} seats`} className="w-full rounded-lg border border-border bg-surface-2 p-2 text-left text-xs outline-none transition-all hover:-translate-y-0.5 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary">
                <span className="block truncate font-semibold text-foreground">{item.tourName}</span><span className="mt-0.5 block text-[10px] text-muted">{item.time} · {item.seatsBooked}/{item.capacity} seats</span><span className="mt-1.5 block h-1 rounded-full bg-border"><span className={`block h-full rounded-full ${capacityTone(item)}`} style={{ width: `${Math.min(100, (item.seatsBooked / item.capacity) * 100)}%` }} /></span></button>)}</div>
            </div>; })}</div></div>}
        <div className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-3 text-xs text-muted"><span><i className="mr-1 inline-block size-2 rounded-full bg-success" /> Open</span><span><i className="mr-1 inline-block size-2 rounded-full bg-accent" /> Filling up</span><span><i className="mr-1 inline-block size-2 rounded-full bg-danger" /> Full</span></div></section>}
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Edit departure" : "Add departure"} description="Departure capacity and price can differ from the parent tour."
      footer={<><Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button type="submit" form="schedule-form" loading={save.isPending}>{editing ? "Save changes" : "Add schedule"}</Button></>}>
      <ScheduleForm key={editing?.id ?? selectedDate} item={editing} date={selectedDate} tours={tourRows} onSave={onSave} /></Drawer>
    <ConfirmDialog open={deleting.length > 0} onClose={() => setDeleting([])} onConfirm={onDelete} loading={remove.isPending} title={`Delete ${deleting.length === 1 ? "this departure" : `${deleting.length} departures`}?`} description="This removes the selected scheduled departures from the mock calendar." confirmLabel="Delete departure" />
  </MastersShell>;
}
