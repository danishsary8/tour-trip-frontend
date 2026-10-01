import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { LayoutGrid, List, MapPin, Plus } from "lucide-react";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { DataTable, RowActions } from "../../../components/shared/DataTable";
import { Drawer } from "../../../components/shared/Drawer";
import { EmptyState } from "../../../components/shared/EmptyState";
import { MastersShell } from "../../../components/shared/MastersShell";
import { Skeleton } from "../../../components/shared/Skeleton";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { useDeleteDestination, useDestinationStatus, useDestinations, useSaveDestination } from "../../../features/destinations/hooks";
import { destinationSchema } from "../../../features/destinations/schema";
import { TOUR_PHOTOS } from "../../../mocks/tourImages";

// One cover photo per tour from the real photo library (see mocks/tourImages.js).
const PHOTOS = Object.values(TOUR_PHOTOS).map((set) => set[0].src);
const field = "w-full rounded-control border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

function DestinationForm({ item, onSave }) {
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({ resolver: zodResolver(destinationSchema), defaultValues: {
    name: item?.name ?? "", province: item?.province ?? "", country: item?.country ?? "Cambodia", description: item?.description ?? "", image: item?.image ?? PHOTOS[0], status: item?.status ?? "Active",
  } });
  const image = useWatch({ control, name: "image" });
  return <form id="destination-form" onSubmit={handleSubmit(onSave)} className="space-y-5">
    {[["name", "Name", "e.g. Kratie"], ["province", "Province or region", "e.g. Kratie"], ["country", "Country", "e.g. Cambodia"]].map(([key, label, placeholder]) => <div key={key}>
      <label htmlFor={`destination-${key}`} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <input id={`destination-${key}`} {...register(key)} placeholder={placeholder} className={field} aria-invalid={Boolean(errors[key])} />
      {errors[key] && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors[key].message}</p>}
    </div>)}
    <div><label htmlFor="destination-description" className="mb-1.5 block text-sm font-semibold">Description</label>
      <textarea id="destination-description" {...register("description")} rows={3} className={field} aria-invalid={Boolean(errors.description)} />
      {errors.description && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors.description.message}</p>}</div>
    <fieldset><legend className="mb-2 text-sm font-semibold">Choose a local photo</legend><div className="grid grid-cols-5 gap-2">
      {PHOTOS.map((photo, index) => <button key={photo} type="button" aria-label={`Choose photo ${index + 1}`} aria-pressed={image === photo}
        onClick={() => setValue("image", photo, { shouldValidate: true })}
        className={`aspect-square overflow-hidden rounded-lg border-2 outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary ${image === photo ? "border-primary" : "border-transparent"}`}>
        <img src={photo} alt="" className="size-full object-cover" /></button>)}
    </div></fieldset>
    <div><label htmlFor="destination-image" className="mb-1.5 block text-sm font-semibold">Or paste an image URL</label>
      <input id="destination-image" {...register("image")} className={field} placeholder="https://example.com/destination.jpg" aria-invalid={Boolean(errors.image)} />
      {errors.image && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors.image.message}</p>}</div>
    <div className="overflow-hidden rounded-card border border-border bg-surface-2"><img src={image} alt="Destination preview" onError={(event) => { event.currentTarget.style.opacity = "0"; }} onLoad={(event) => { event.currentTarget.style.opacity = "1"; }} className="h-40 w-full object-cover" /></div>
    <div><label htmlFor="destination-status" className="mb-1.5 block text-sm font-semibold">Status</label><select id="destination-status" {...register("status")} className={field}><option>Active</option><option>Inactive</option></select></div>
  </form>;
}

export default function DestinationsPage() {
  const query = useDestinations(); const save = useSaveDestination(); const remove = useDeleteDestination(); const changeStatus = useDestinationStatus();
  const reduced = useReducedMotion();
  const [view, setView] = useState(() => localStorage.getItem("tourtrip-destinations-view") || "grid");
  const [search, setSearch] = useState(""); const [editing, setEditing] = useState(null); const [drawerOpen, setDrawerOpen] = useState(() => new URLSearchParams(window.location.search).get("create") === "1"); const [deleting, setDeleting] = useState([]);
  const rows = query.data ?? [];
  const shown = rows.filter((item) => `${item.name} ${item.province} ${item.description}`.toLowerCase().includes(search.toLowerCase()));
  const columns = useMemo(() => [
    { accessorKey: "name", header: "Destination", cell: ({ row }) => <span className="flex items-center gap-3"><img src={row.original.image} alt="" className="size-10 rounded-lg object-cover" /><span className="font-semibold">{row.original.name}</span></span> },
    { accessorKey: "province", header: "Province" },
    { accessorKey: "tourCount", header: "Tours" },
    { accessorKey: "status", header: "Status", filterFn: "equalsString", cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
  ], []);
  function chooseView(next) { setView(next); localStorage.setItem("tourtrip-destinations-view", next); }
  function startDelete(items) { const linked = items.find((item) => item.tourCount > 0); if (linked) { toast.error(`${linked.name} has ${linked.tourCount} tours. Move them before deleting.`); return; } setDeleting(items); }
  async function onSave(data) { try { await save.mutateAsync({ data, id: editing?.id }); toast.success(editing ? "Destination updated" : "Destination created"); setDrawerOpen(false); } catch (error) { toast.error(error.message); } }
  async function onDelete() { try { for (const item of deleting) await remove.mutateAsync(item.id); toast.success("Destination deleted"); } catch (error) { toast.error(error.message); } finally { setDeleting([]); } }
  async function onStatus(item, status) { try { await changeStatus.mutateAsync({ id: item.id, status }); toast.success(`${item.name} ${status.toLowerCase()}`); } catch (error) { toast.error(error.message); } }
  return <MastersShell title="Destinations" description="Curate the places behind every remarkable journey." actions={<Button onClick={() => { setEditing(null); setDrawerOpen(true); }}><Plus className="size-4" /> Add destination</Button>}>
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted">{rows.length} destinations · {rows.reduce((sum, row) => sum + row.tourCount, 0)} tours</p>
      <div className="flex rounded-control border border-border bg-surface p-1" role="group" aria-label="Display view">{[["grid", LayoutGrid], ["table", List]].map(([key, Icon]) => <button key={key} type="button" onClick={() => chooseView(key)} aria-label={`${key} view`} aria-pressed={view === key}
        className={`grid size-9 place-items-center rounded-lg outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary ${view === key ? "bg-primary/12 text-primary-ink" : "text-muted"}`}><Icon className="size-4" /></button>)}</div></div>
    {query.isError ? <div role="alert" className="rounded-card border border-danger/30 bg-surface p-5">Destinations could not load. <button onClick={() => query.refetch()} className="text-primary-ink underline">Retry</button></div> : view === "table" ?
      <DataTable rows={rows} columns={columns} loading={query.isLoading} searchPlaceholder="Search destinations" filters={[{ columnId: "status", label: "Status", options: ["Active", "Inactive"] }]}
        onEdit={(item) => { setEditing(item); setDrawerOpen(true); }} onDelete={(item) => startDelete([item])} onToggle={(item) => onStatus(item, item.status === "Active" ? "Inactive" : "Active")}
        onBulkDelete={startDelete} onBulkToggle={async (items, status) => { for (const item of items) await onStatus(item, status); }} /> :
      <><label className="sr-only" htmlFor="destination-search">Search destinations</label><input id="destination-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search destinations or provinces" className={`${field} max-w-sm`} />
        {query.isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0,1,2,3,4,5].map((n) => <Skeleton key={n} className="h-80 rounded-card" />)}</div> : shown.length === 0 ? <EmptyState title="No destinations found" description="Try a different search or add a destination." /> :
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{shown.map((item) => <motion.article key={item.id} layout={reduced ? false : "position"} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="group overflow-hidden rounded-card border border-border bg-surface shadow-soft transition-colors hover:border-primary/35">
            <div className="relative h-44 overflow-hidden"><img src={item.image} alt={item.name} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" /><span className="absolute left-4 top-4"><StatusBadge status={item.status} /></span></div>
            <div className="p-4"><div className="flex items-start justify-between gap-2"><div><h2 className="font-display text-lg font-semibold">{item.name}</h2><p className="mt-1 flex items-center gap-1 text-sm text-muted"><MapPin className="size-3.5" /> {item.country && item.country !== "Cambodia" ? `${item.province}, ${item.country}` : item.province}</p></div><RowActions row={item} onEdit={(record) => { setEditing(record); setDrawerOpen(true); }} onDelete={(record) => startDelete([record])} onToggle={(record) => onStatus(record, record.status === "Active" ? "Inactive" : "Active")} /></div>
              <p className="mt-3 line-clamp-2 min-h-10 text-sm text-muted">{item.description}</p><p className="mt-4 border-t border-border pt-3 text-xs font-semibold text-primary-ink">{item.tourCount} {item.tourCount === 1 ? "tour" : "tours"}</p></div>
          </motion.article>)}</div>}</>}
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Edit destination" : "Add destination"} description="Places guests can discover on TourTrip."
      footer={<><Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button type="submit" form="destination-form" loading={save.isPending}>{editing ? "Save changes" : "Add destination"}</Button></>}>
      <DestinationForm key={editing?.id ?? "new"} item={editing} onSave={onSave} /></Drawer>
    <ConfirmDialog open={deleting.length > 0} onClose={() => setDeleting([])} onConfirm={onDelete} loading={remove.isPending} title={`Delete ${deleting.length === 1 ? deleting[0]?.name : `${deleting.length} destinations`}?`} description="This removes the selected destinations from the mock catalogue." confirmLabel="Delete destination" />
  </MastersShell>;
}
