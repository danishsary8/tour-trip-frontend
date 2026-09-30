import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Languages, LayoutGrid, List, Phone, Plus } from "lucide-react";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { DataTable, RowActions } from "../../../components/shared/DataTable";
import { Drawer } from "../../../components/shared/Drawer";
import { EmptyState } from "../../../components/shared/EmptyState";
import { MastersShell } from "../../../components/shared/MastersShell";
import { Skeleton } from "../../../components/shared/Skeleton";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { useDeleteGuide, useGuideStatus, useGuides, useSaveGuide } from "../../../features/guides/hooks";
import { GUIDE_LANGUAGES, guideSchema } from "../../../features/guides/schema";

const field = "w-full rounded-control border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

function GuideForm({ item, onSave }) {
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({ resolver: zodResolver(guideSchema), defaultValues: {
    name: item?.name ?? "", phone: item?.phone ?? "", languages: item?.languages ?? ["Khmer"], status: item?.status ?? "Active",
  } });
  const chosen = useWatch({ control, name: "languages" }) ?? [];
  function toggle(language) { setValue("languages", chosen.includes(language) ? chosen.filter((entry) => entry !== language) : [...chosen, language], { shouldValidate: true, shouldDirty: true }); }
  return <form id="guide-form" onSubmit={handleSubmit((data) => onSave({ ...data, initials: data.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() }))} className="space-y-5">
    <div><label htmlFor="guide-name" className="mb-1.5 block text-sm font-semibold">Full name</label><input id="guide-name" {...register("name")} className={field} placeholder="e.g. Sokha Chhim" aria-invalid={Boolean(errors.name)} />{errors.name && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors.name.message}</p>}</div>
    <div><label htmlFor="guide-phone" className="mb-1.5 block text-sm font-semibold">Phone number</label><input id="guide-phone" type="tel" {...register("phone")} className={field} placeholder="+855 12 345 678" aria-invalid={Boolean(errors.phone)} />{errors.phone && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors.phone.message}</p>}</div>
    <fieldset><legend className="mb-2 text-sm font-semibold">Languages spoken</legend><div className="flex flex-wrap gap-2">{GUIDE_LANGUAGES.map((language) => <button key={language} type="button" onClick={() => toggle(language)} aria-pressed={chosen.includes(language)}
      className={`rounded-full border px-3 py-2 text-xs font-semibold outline-none transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95 ${chosen.includes(language) ? "border-primary/40 bg-primary/12 text-primary-ink" : "border-border bg-surface-2/40 text-muted hover:text-foreground"}`}>{language}</button>)}</div>
      {errors.languages && <p role="alert" className="mt-2 text-xs text-danger-ink">{errors.languages.message}</p>}</fieldset>
    <div><label htmlFor="guide-status" className="mb-1.5 block text-sm font-semibold">Status</label><select id="guide-status" {...register("status")} className={field}><option>Active</option><option>Inactive</option></select></div>
  </form>;
}

export default function GuidesPage() {
  const query = useGuides(); const save = useSaveGuide(); const remove = useDeleteGuide(); const changeStatus = useGuideStatus(); const reduced = useReducedMotion();
  const [view, setView] = useState(() => localStorage.getItem("tourtrip-guides-view") || "grid"); const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); const [drawerOpen, setDrawerOpen] = useState(false); const [deleting, setDeleting] = useState([]);
  const rows = query.data ?? []; const shown = rows.filter((item) => `${item.name} ${item.languages.join(" ")} ${item.phone}`.toLowerCase().includes(search.toLowerCase()));
  const columns = useMemo(() => [
    { accessorKey: "name", header: "Guide", cell: ({ row }) => <span className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/20 text-xs font-bold text-accent-ink">{row.original.initials}</span><span className="font-semibold">{row.original.name}</span></span> },
    { accessorFn: (row) => row.languages.join(", "), id: "languages", header: "Languages" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "assignedTours", header: "Tours" },
    { accessorKey: "status", header: "Status", filterFn: "equalsString", cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
  ], []);
  function chooseView(next) { setView(next); localStorage.setItem("tourtrip-guides-view", next); }
  function startDelete(items) { const linked = items.find((item) => item.assignedTours > 0); if (linked) { toast.error(`${linked.name} has ${linked.assignedTours} assigned tours. Reassign them before deleting.`); return; } setDeleting(items); }
  async function onSave(data) { try { await save.mutateAsync({ data, id: editing?.id }); toast.success(editing ? "Guide updated" : "Guide created"); setDrawerOpen(false); } catch (error) { toast.error(error.message); } }
  async function onDelete() { try { for (const item of deleting) await remove.mutateAsync(item.id); toast.success("Guide deleted"); } catch (error) { toast.error(error.message); } finally { setDeleting([]); } }
  async function onStatus(item, status) { try { await changeStatus.mutateAsync({ id: item.id, status }); toast.success(`${item.name} ${status.toLowerCase()}`); } catch (error) { toast.error(error.message); } }
  return <MastersShell title="Guides" description="The people who bring Cambodia's stories to life." actions={<Button onClick={() => { setEditing(null); setDrawerOpen(true); }}><Plus className="size-4" /> Add guide</Button>}>
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted">{rows.length} local guides · {rows.reduce((sum, row) => sum + row.assignedTours, 0)} tour assignments</p>
      <div className="flex rounded-control border border-border bg-surface p-1" role="group" aria-label="Display view">{[["grid", LayoutGrid], ["table", List]].map(([key, Icon]) => <button key={key} type="button" onClick={() => chooseView(key)} aria-label={`${key} view`} aria-pressed={view === key}
        className={`grid size-9 place-items-center rounded-lg outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary ${view === key ? "bg-primary/12 text-primary-ink" : "text-muted"}`}><Icon className="size-4" /></button>)}</div></div>
    {query.isError ? <div role="alert" className="rounded-card border border-danger/30 bg-surface p-5">Guides could not load. <button onClick={() => query.refetch()} className="text-primary-ink underline">Retry</button></div> : view === "table" ?
      <DataTable rows={rows} columns={columns} loading={query.isLoading} searchPlaceholder="Search guides" filters={[{ columnId: "status", label: "Status", options: ["Active", "Inactive"] }]}
        onEdit={(item) => { setEditing(item); setDrawerOpen(true); }} onDelete={(item) => startDelete([item])} onToggle={(item) => onStatus(item, item.status === "Active" ? "Inactive" : "Active")}
        onBulkDelete={startDelete} onBulkToggle={async (items, status) => { for (const item of items) await onStatus(item, status); }} /> :
      <><label className="sr-only" htmlFor="guide-search">Search guides</label><input id="guide-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search names or languages" className={`${field} max-w-sm`} />
        {query.isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0,1,2,3,4,5].map((n) => <Skeleton key={n} className="h-72 rounded-card" />)}</div> : shown.length === 0 ? <EmptyState title="No guides found" description="Try a different search or add a guide." /> :
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{shown.map((item) => <motion.article key={item.id} layout={reduced ? false : "position"} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-card border border-border bg-surface p-5 shadow-soft transition-colors hover:border-primary/35">
            <div className="flex items-start gap-3"><span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/20 font-display text-lg font-bold text-primary-ink">{item.initials}</span><div className="min-w-0 flex-1"><h2 className="font-display text-lg font-semibold">{item.name}</h2><p className="mt-1 flex items-center gap-1 text-sm text-muted"><Phone className="size-3.5" /> {item.phone}</p></div><RowActions row={item} onEdit={(record) => { setEditing(record); setDrawerOpen(true); }} onDelete={(record) => startDelete([record])} onToggle={(record) => onStatus(record, record.status === "Active" ? "Inactive" : "Active")} /></div>
            <div className="mt-5 flex min-h-14 flex-wrap content-start gap-1.5"><Languages className="mr-1 mt-1 size-4 text-muted" />{item.languages.map((language) => <span key={language} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">{language}</span>)}</div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4"><StatusBadge status={item.status} /><span className="text-xs font-semibold text-primary-ink">{item.assignedTours} assigned {item.assignedTours === 1 ? "tour" : "tours"}</span></div>
          </motion.article>)}</div>}</>}
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Edit guide" : "Add guide"} description="Set language skills and contact details."
      footer={<><Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button type="submit" form="guide-form" loading={save.isPending}>{editing ? "Save changes" : "Add guide"}</Button></>}>
      <GuideForm key={editing?.id ?? "new"} item={editing} onSave={onSave} /></Drawer>
    <ConfirmDialog open={deleting.length > 0} onClose={() => setDeleting([])} onConfirm={onDelete} loading={remove.isPending} title={`Delete ${deleting.length === 1 ? deleting[0]?.name : `${deleting.length} guides`}?`} description="This removes the selected guides from the mock catalogue." confirmLabel="Delete guide" />
  </MastersShell>;
}
