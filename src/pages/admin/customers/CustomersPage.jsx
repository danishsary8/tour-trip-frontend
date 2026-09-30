import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Power, UserPlus } from "lucide-react";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { DataTable } from "../../../components/shared/DataTable";
import { Drawer } from "../../../components/shared/Drawer";
import { PageHeader } from "../../../components/shared/PageHeader";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { CustomerDrawer } from "../../../features/customers/components/CustomerDrawer";
import { useCreateCustomer, useCustomerStatus, useCustomers } from "../../../features/customers/hooks";
import { customerSchema } from "../../../features/customers/schema";
import { formatDate, formatUsd } from "../../../lib/format";

const field =
  "w-full rounded-control border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-danger/70";

function FieldError({ error }) {
  return error ? (
    <p role="alert" className="mt-1 text-xs text-danger-ink">
      {error.message}
    </p>
  ) : null;
}

function CustomerForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });
  return (
    <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="customer-name" className="mb-1.5 block text-sm font-semibold">Full name</label>
        <input id="customer-name" {...register("name")} autoComplete="name" className={field} placeholder="e.g. Sophea Chan" aria-invalid={Boolean(errors.name)} />
        <FieldError error={errors.name} />
      </div>
      <div>
        <label htmlFor="customer-email" className="mb-1.5 block text-sm font-semibold">Email</label>
        <input id="customer-email" type="email" {...register("email")} autoComplete="email" className={field} placeholder="name@example.com" aria-invalid={Boolean(errors.email)} />
        <FieldError error={errors.email} />
      </div>
      <div>
        <label htmlFor="customer-phone" className="mb-1.5 block text-sm font-semibold">Phone</label>
        <input id="customer-phone" type="tel" {...register("phone")} autoComplete="tel" className={field} placeholder="+855 12 345 678" aria-invalid={Boolean(errors.phone)} />
        <FieldError error={errors.phone} />
      </div>
      <p className="text-xs text-muted">New customers start as Active. Bookings and totals appear once they book a tour.</p>
    </form>
  );
}

function MobileCustomerCard({ customer }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 text-xs font-bold text-primary-ink">{customer.initials}</span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-semibold text-foreground">{customer.name}</p>
          <StatusBadge status={customer.status} />
        </div>
        <p className="truncate text-xs text-muted">{customer.email}</p>
        <p className="text-xs text-muted">
          {customer.totalBookings} bookings · <span className="font-semibold text-foreground">{formatUsd(customer.totalSpent)}</span> spent
        </p>
      </div>
    </div>
  );
}

/** Manage Customers: directory, profile drawer with computed totals, activate/deactivate and create. */
export default function CustomersPage() {
  const query = useCustomers();
  const create = useCreateCustomer();
  const statusMutation = useCustomerStatus();
  const [params, setParams] = useSearchParams();
  const [toggling, setToggling] = useState(null);
  const selectedId = params.get("customer");
  const creating = params.get("create") === "1";

  function setParam(key, value) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, { replace: !value });
  }

  const customers = useMemo(() => query.data ?? [], [query.data]);
  const activeCount = customers.filter((customer) => customer.status === "Active").length;

  const columns = useMemo(
    () => [
      {
        id: "name",
        // Name first so sorting stays alphabetical; the id makes "c-0725" searchable too.
        accessorFn: (row) => `${row.name} ${row.id}`,
        header: "Customer",
        cell: ({ row }) => (
          <span className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/12 text-[11px] font-bold text-primary-ink">{row.original.initials}</span>
            <span className="min-w-0">
              <span className="block truncate font-semibold">{row.original.name}</span>
              <span className="block text-xs tabular-nums text-muted">{row.original.id}</span>
            </span>
          </span>
        ),
      },
      { accessorKey: "email", header: "Email", cell: ({ getValue }) => <span className="block max-w-[200px] truncate text-muted">{getValue()}</span> },
      {
        accessorKey: "phone",
        header: "Phone",
        enableGlobalFilter: false,
        enableSorting: false,
        meta: { className: "hidden 2xl:table-cell" },
        cell: ({ getValue }) => <span className="whitespace-nowrap text-muted">{getValue()}</span>,
      },
      { accessorKey: "totalBookings", header: "Bookings", enableGlobalFilter: false, cell: ({ getValue }) => <span className="tabular-nums">{getValue()}</span> },
      {
        accessorKey: "totalSpent",
        header: "Total spent",
        enableGlobalFilter: false,
        cell: ({ getValue }) => <span className="font-semibold tabular-nums">{formatUsd(getValue())}</span>,
      },
      {
        accessorKey: "joinedAt",
        header: "Joined",
        enableGlobalFilter: false,
        cell: ({ getValue }) => <span className="whitespace-nowrap text-muted">{formatDate(getValue())}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        enableGlobalFilter: false,
        enableSorting: false,
        filterFn: "equalsString",
        cell: ({ getValue }) => <StatusBadge status={getValue()} />,
      },
    ],
    [],
  );

  async function onCreate(data) {
    try {
      const customer = await create.mutateAsync(data);
      toast.success(`${customer.name} added`, { description: customer.email });
      setParams((current) => {
        const next = new URLSearchParams(current);
        next.delete("create");
        next.set("customer", customer.id);
        return next;
      });
    } catch (error) {
      toast.error(error.message || "Customer could not be added");
    }
  }

  async function onToggle() {
    const status = toggling.status === "Active" ? "Inactive" : "Active";
    try {
      await statusMutation.mutateAsync({ id: toggling.id, status });
      toast.success(`${toggling.name} is now ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(error.message || "Status could not be changed");
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="mx-auto min-w-0 max-w-[1580px] space-y-5 pb-8">
      <PageHeader
        eyebrow="Operations"
        title="Customers"
        description={query.isLoading ? "Loading customers…" : `${customers.length.toLocaleString("en-US")} customers · ${activeCount.toLocaleString("en-US")} active`}
        actions={
          <Button onClick={() => setParam("create", "1")}>
            <UserPlus className="size-4" aria-hidden="true" /> Add customer
          </Button>
        }
      />

      <DataTable
        rows={customers}
        columns={columns}
        caption="Customers"
        loading={query.isLoading}
        error={query.isError && !query.data}
        onRetry={() => query.refetch()}
        searchPlaceholder="Search name, email or ID"
        filters={[{ columnId: "status", label: "Statuses", options: ["Active", "Inactive"] }]}
        onRowClick={(customer) => setParam("customer", customer.id)}
        onToggle={(customer) => setToggling(customer)}
        rowLabel={(customer) => customer.name}
        selectable={false}
        mobileCard={(customer) => <MobileCustomerCard customer={customer} />}
        cardsBelow="lg"
        initialSorting={[{ id: "totalSpent", desc: true }]}
        pageSize={10}
        dense
        emptyTitle="No customers match"
        emptyDescription="Try another name or email, or add a new customer."
      />

      <CustomerDrawer customerId={selectedId} open={Boolean(selectedId)} onClose={() => setParam("customer", null)} />

      <Drawer
        open={creating}
        onClose={() => setParam("create", null)}
        title="Add customer"
        description="Create a traveller profile for phone or walk-in bookings."
        footer={
          <>
            <Button variant="outline" onClick={() => setParam("create", null)} className="bg-transparent hover:bg-foreground/[0.06]">
              Cancel
            </Button>
            <Button type="submit" form="customer-form" loading={create.isPending}>
              Add customer
            </Button>
          </>
        }
      >
        <CustomerForm onSubmit={onCreate} />
      </Drawer>

      <ConfirmDialog
        open={Boolean(toggling)}
        onClose={() => setToggling(null)}
        onConfirm={onToggle}
        loading={statusMutation.isPending}
        tone={toggling?.status === "Active" ? "danger" : "primary"}
        icon={Power}
        title={toggling?.status === "Active" ? `Deactivate ${toggling?.name}?` : `Activate ${toggling?.name}?`}
        description={
          toggling?.status === "Active"
            ? "They keep their booking history but will not be able to make new bookings until reactivated."
            : "They will be able to sign in and book tours again."
        }
        confirmLabel={toggling?.status === "Active" ? "Deactivate" : "Activate"}
      />
    </div>
  );
}
