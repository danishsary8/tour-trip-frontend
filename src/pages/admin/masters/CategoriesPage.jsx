import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Building2, Compass, Landmark, Mountain, Plus, Trees, UtensilsCrossed, Waves } from "lucide-react";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { DataTable } from "../../../components/shared/DataTable";
import { Drawer } from "../../../components/shared/Drawer";
import { MastersShell } from "../../../components/shared/MastersShell";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { useCategories, useCategoryStatus, useDeleteCategory, useSaveCategory } from "../../../features/categories/hooks";
import { CATEGORY_ICONS, categorySchema } from "../../../features/categories/schema";

const ICONS = { Landmark, Building2, Mountain, Waves, Trees, Compass, UtensilsCrossed };
const fieldClass = "w-full rounded-control border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

function CategoryForm({ item, onSave, id = "category-form" }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(categorySchema), defaultValues: {
    name: item?.name ?? "", description: item?.description ?? "", icon: item?.icon ?? "Landmark", status: item?.status ?? "Active",
  } });
  return <form id={id} onSubmit={handleSubmit(onSave)} className="space-y-5">
    <div><label htmlFor="category-name" className="mb-1.5 block text-sm font-semibold text-foreground">Name</label>
      <input id="category-name" {...register("name")} className={fieldClass} placeholder="e.g. Heritage journeys" aria-invalid={Boolean(errors.name)} />
      {errors.name && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors.name.message}</p>}</div>
    <div><label htmlFor="category-description" className="mb-1.5 block text-sm font-semibold text-foreground">Description</label>
      <textarea id="category-description" {...register("description")} rows={4} className={fieldClass} placeholder="What makes this category distinct?" aria-invalid={Boolean(errors.description)} />
      {errors.description && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors.description.message}</p>}</div>
    <fieldset><legend className="mb-2 text-sm font-semibold text-foreground">Icon</legend>
      <div className="grid grid-cols-3 gap-2">{CATEGORY_ICONS.map((name) => { const Icon = ICONS[name]; return <label key={name} className="group cursor-pointer">
        <input type="radio" value={name} {...register("icon")} className="peer sr-only" />
        <span className="flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-control border border-border bg-surface-2/40 text-xs font-medium text-muted transition-all group-hover:border-primary/40 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary-ink peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50">
          <Icon className="size-5" aria-hidden="true" />{name}
        </span>
      </label>; })}</div>
    </fieldset>
    <div><label htmlFor="category-status" className="mb-1.5 block text-sm font-semibold text-foreground">Status</label>
      <select id="category-status" {...register("status")} className={fieldClass}><option>Active</option><option>Inactive</option></select></div>
  </form>;
}

export default function CategoriesPage() {
  const navigate = useNavigate();
  const query = useCategories();
  const save = useSaveCategory();
  const remove = useDeleteCategory();
  const changeStatus = useCategoryStatus();
  const [drawerOpen, setDrawerOpen] = useState(() => new URLSearchParams(window.location.search).get("create") === "1");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState([]);

  const columns = useMemo(() => [
    { accessorKey: "name", header: "Category", cell: ({ row }) => { const Icon = ICONS[row.original.icon] ?? Compass; return <span className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary-ink"><Icon className="size-4" /></span><span className="font-semibold">{row.original.name}</span></span>; } },
    { accessorKey: "description", header: "Description", cell: ({ getValue }) => <span className="line-clamp-2 max-w-sm text-muted">{getValue()}</span> },
    { accessorKey: "tourCount", header: "Tours", cell: ({ getValue }) => <span className="font-semibold tabular-nums">{getValue()}</span> },
    { accessorKey: "status", header: "Status", filterFn: "equalsString", cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
  ], []);

  function closeDrawer() {
    setDrawerOpen(false);
    setEditing(null);
    if (window.location.search.includes("create")) navigate("/admin/masters/categories", { replace: true });
  }
  function startEdit(item) { setEditing(item); setDrawerOpen(true); }
  function startDelete(items) {
    const linked = items.find((item) => item.tourCount > 0);
    if (linked) { toast.error(`${linked.name} is used by ${linked.tourCount} tours. Move them before deleting it.`); return; }
    setDeleting(items);
  }
  async function onSave(data) {
    try { await save.mutateAsync({ data, id: editing?.id }); toast.success(editing ? "Category updated" : "Category created"); closeDrawer(); }
    catch (error) { toast.error(error.message || "Category could not be saved"); }
  }
  async function onDelete() {
    try { for (const item of deleting) await remove.mutateAsync(item.id); toast.success(deleting.length === 1 ? "Category deleted" : `${deleting.length} categories deleted`); setDeleting([]); }
    catch (error) { toast.error(error.message || "Category could not be deleted"); setDeleting([]); }
  }
  async function onStatus(item, status) {
    try { await changeStatus.mutateAsync({ id: item.id, status }); toast.success(`${item.name} ${status.toLowerCase()}`); }
    catch (error) { toast.error(error.message || "Status could not be changed"); }
  }

  return <MastersShell title="Categories" description="Organize the experiences guests explore across Cambodia."
    actions={<Button onClick={() => { setEditing(null); setDrawerOpen(true); }}><Plus className="size-4" /> Add category</Button>}>
    {query.isError ? <div role="alert" className="rounded-card border border-danger/30 bg-surface p-5 text-sm text-foreground">Categories could not be loaded. <button type="button" onClick={() => query.refetch()} className="text-primary-ink underline">Retry</button></div>
      : <DataTable rows={query.data ?? []} columns={columns} loading={query.isLoading} searchPlaceholder="Search categories" filters={[{ columnId: "status", label: "Status", options: ["Active", "Inactive"] }]}
        onEdit={startEdit} onDelete={(item) => startDelete([item])} onToggle={(item) => onStatus(item, item.status === "Active" ? "Inactive" : "Active")}
        onBulkDelete={startDelete} onBulkToggle={async (items, status) => { try { for (const item of items) await changeStatus.mutateAsync({ id: item.id, status }); toast.success(`${items.length} categories updated`); } catch (error) { toast.error(error.message); } }}
        emptyTitle="No categories match" emptyDescription="Try a different search, or add a new category." />}
    <Drawer open={drawerOpen} onClose={closeDrawer} title={editing ? "Edit category" : "Add category"} description="A clear category helps guests find the right kind of journey."
      footer={<><Button variant="outline" onClick={closeDrawer}>Cancel</Button><Button type="submit" form="category-form" loading={save.isPending}>{editing ? "Save changes" : "Add category"}</Button></>}>
      <CategoryForm key={editing?.id ?? "new"} item={editing} onSave={onSave} />
    </Drawer>
    <ConfirmDialog open={deleting.length > 0} onClose={() => setDeleting([])} onConfirm={onDelete} loading={remove.isPending}
      title={deleting.length === 1 ? `Delete ${deleting[0]?.name}?` : `Delete ${deleting.length} categories?`}
      description="This removes the selected categories from the mock catalogue. Tours that use a category cannot be deleted." confirmLabel="Delete category" />
  </MastersShell>;
}
