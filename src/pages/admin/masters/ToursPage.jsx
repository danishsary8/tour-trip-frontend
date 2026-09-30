import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { DataTable } from "../../../components/shared/DataTable";
import { MastersShell } from "../../../components/shared/MastersShell";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { useCategories } from "../../../features/categories/hooks";
import { useDestinations } from "../../../features/destinations/hooks";
import { useGuides } from "../../../features/guides/hooks";
import { TourWizard } from "../../../features/tours/components/TourWizard";
import { useDeleteTour, useSaveTour, useTourStatus, useTours } from "../../../features/tours/hooks";

const EMPTY = [];

export default function ToursPage() {
  const navigate = useNavigate();
  const query = useTours(); const categories = useCategories(); const destinations = useDestinations(); const guides = useGuides();
  const save = useSaveTour(); const remove = useDeleteTour(); const changeStatus = useTourStatus();
  const [editing, setEditing] = useState(null);
  const [wizardOpen, setWizardOpen] = useState(() => new URLSearchParams(window.location.search).get("create") === "1");
  const [deleting, setDeleting] = useState([]);
  const rows = query.data ?? EMPTY; const categoryRows = categories.data ?? EMPTY; const destinationRows = destinations.data ?? EMPTY; const guideRows = guides.data ?? EMPTY;
  const columns = useMemo(() => [
    { accessorKey: "name", header: "Tour", cell: ({ row }) => <span className="flex min-w-52 items-center gap-3"><img src={row.original.image} alt="" className="size-10 rounded-lg object-cover" /><span className="font-semibold">{row.original.name}</span></span> },
    { accessorFn: (row) => categoryRows.find((item) => item.id === row.categoryId)?.name ?? "—", id: "category", header: "Category" },
    { accessorKey: "destination", header: "Destination" },
    { accessorKey: "price", header: "Price", cell: ({ getValue }) => <span className="font-semibold tabular-nums">${Number(getValue()).toFixed(2)}</span> },
    { accessorKey: "durationDays", header: "Days" },
    { accessorKey: "bookingsCount", header: "Bookings" },
    { accessorKey: "status", header: "Status", filterFn: "equalsString", cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
  ], [categoryRows]);
  function closeWizard() { setWizardOpen(false); setEditing(null); if (window.location.search.includes("create")) navigate("/admin/masters/tours", { replace: true }); }
  async function onSave(data) { try { await save.mutateAsync({ data, id: editing?.id }); toast.success(editing ? "Tour updated" : "Tour created"); closeWizard(); } catch (error) { toast.error(error.message || "Tour could not be saved"); } }
  async function onDelete() { try { for (const item of deleting) await remove.mutateAsync(item.id); toast.success(deleting.length === 1 ? "Tour deleted" : `${deleting.length} tours deleted`); } catch (error) { toast.error(error.message || "Tour could not be deleted"); } finally { setDeleting([]); } }
  async function onStatus(item, status) { try { await changeStatus.mutateAsync({ id: item.id, status }); toast.success(`${item.name} ${status.toLowerCase()}`); } catch (error) { toast.error(error.message); } }
  return <MastersShell title="Tours" description="Shape the experiences guests will remember." actions={<Button onClick={() => { setEditing(null); setWizardOpen(true); }}><Plus className="size-4" /> Create tour</Button>}>
    <div className="flex flex-wrap gap-3 text-sm text-muted"><span>{rows.length} curated tours</span><span>·</span><span>{rows.filter((item) => item.status === "Active").length} active</span><span>·</span><span>{rows.reduce((total, item) => total + item.bookingsCount, 0)} bookings</span></div>
    {query.isError ? <div role="alert" className="rounded-card border border-danger/30 bg-surface p-5">Tours could not load. <button onClick={() => query.refetch()} className="text-primary-ink underline">Retry</button></div> :
      <DataTable rows={rows} columns={columns} loading={query.isLoading} searchPlaceholder="Search tours" filters={[{ columnId: "status", label: "Status", options: ["Active", "Inactive"] }]}
        onEdit={(item) => { setEditing(item); setWizardOpen(true); }} onDelete={(item) => setDeleting([item])} onToggle={(item) => onStatus(item, item.status === "Active" ? "Inactive" : "Active")}
        onBulkDelete={setDeleting} onBulkToggle={async (items, status) => { for (const item of items) await onStatus(item, status); }} emptyTitle="No tours found" emptyDescription="Try another search or create a tour." />}
    {wizardOpen && <TourWizard key={editing?.id ?? "new"} item={editing} categories={categoryRows} destinations={destinationRows} guides={guideRows} onSave={onSave} onClose={closeWizard} loading={save.isPending} />}
    <ConfirmDialog open={deleting.length > 0} onClose={() => setDeleting([])} onConfirm={onDelete} loading={remove.isPending} title={`Delete ${deleting.length === 1 ? deleting[0]?.name : `${deleting.length} tours`}?`} description="Linked mock departures will also be removed. This cannot be undone." confirmLabel="Delete tour" />
  </MastersShell>;
}
