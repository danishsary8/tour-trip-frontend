import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, UsersRound } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { StatusBadge } from "../components/shared/StatusBadge";
import { buttonVariants } from "../components/ui/Button";
import { useLegacyCustomers } from "../features/customers/hooks";

function CustomerList() {
  const { data: customers = [], isLoading, isError, refetch } = useLegacyCustomers();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  // Search customers
  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.id.toLowerCase().includes(search.toLowerCase()) ||
      (customer.phone ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }).filter((customer) => status === "All" || customer.status === status);

  return (
    <div className="mx-auto min-w-0 max-w-[1580px] pb-8">
      <PageHeader
        eyebrow="People / Guest care"
        title="Customers"
        description="A tidy directory of travelers and their booking activity."
        actions={<Link to="/admin/customers/create" className={buttonVariants({ variant: "primary" })}><Plus className="size-4" aria-hidden="true" /> Create customer</Link>}
      />
      {isError && <div role="alert" className="mb-4 rounded-card border border-danger/25 bg-surface p-4 text-sm text-foreground">Customers could not be loaded. <button type="button" onClick={() => refetch()} className="font-semibold text-primary-ink underline">Try again</button></div>}
      <div>

        {/* ================= TABLE ================= */}
        <div className="min-w-0 overflow-hidden rounded-panel border border-border bg-surface shadow-soft">
          <div className="flex flex-col justify-between gap-4 border-b border-border p-4 sm:p-5 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-primary/12 text-primary-ink"><UsersRound className="size-4" aria-hidden="true" /></span><h2 className="font-display text-lg font-semibold text-foreground">Guest directory</h2></div>
              <p className="mt-1 text-xs text-muted">{isLoading ? "Loading records..." : `${customers.length} preview records`} · Search names, contacts or IDs</p>
            </div>
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input type="search" placeholder="Search customers" aria-label="Search customers" value={search} onChange={(event) => setSearch(event.target.value)}
                className="h-10 w-full rounded-control border border-border bg-surface-2/50 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-3 sm:px-5" role="group" aria-label="Filter customers by status">
            {["All", "Active", "Blocked"].map((filter) => <button key={filter} type="button" aria-pressed={status === filter} onClick={() => setStatus(filter)}
              className={"whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary " + (status === filter ? "bg-primary text-white" : "bg-surface-2 text-muted hover:text-foreground")}>
              {filter} <span className="ml-1 opacity-70">{filter === "All" ? customers.length : customers.filter((item) => item.status === filter).length}</span>
            </button>)}
          </div>
          <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] table-fixed text-left text-sm">

            {/* ================= TABLE HEADER ================= */}
            <thead>
              <tr className="bg-surface-2/60 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">

                <th scope="col" className="w-[24%] px-5 py-4">
                  Customer
                </th>

                <th scope="col" className="w-[29%] px-3 py-4">
                  Contact
                </th>

                <th scope="col" className="w-[11%] px-3 py-4 text-right">
                  Bookings
                </th>

                <th scope="col" className="w-[20%] px-3 py-4">
                  Last Activity
                </th>

                <th scope="col" className="w-[16%] px-3 py-4">
                  Status
                </th>

              </tr>
            </thead>

            {/* ================= TABLE BODY ================= */}
            <tbody>

              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (

                  <tr
                    key={customer.id}
                    className="border-t border-border transition-colors hover:bg-surface-2/50"
                  >

                    {/* CUSTOMER */}
                    <td className="px-5 py-3">

                      <div className="gap-3 flex items-center">

                        {customer.image && customer.image !== "null" ? (
                          <img
                            src={customer.image}
                            alt={customer.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-sm font-semibold text-primary-ink">
                            {customer.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("")}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground" title={customer.name}>
                            {customer.name}
                          </p>

                          <p className="text-[11px] text-muted">
                            ID: {customer.id}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="px-3 py-3">

                      <p className="truncate text-sm text-foreground" title={customer.email}>
                        {customer.email}
                      </p>

                      <p className="text-[11px] text-muted">
                        {customer.phone}
                      </p>

                    </td>

                    {/* BOOKINGS */}
                    <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums text-foreground">
                      {customer.bookings}
                    </td>

                    {/* LAST ACTIVITY */}
                    <td className="px-3 py-3">

                      {customer.date ? (
                        <>
                          <p className="truncate text-sm text-foreground" title={customer.lastActivity || "No bookings yet"}>
                            {customer.lastActivity || "No bookings yet"}
                          </p>

                          <p className="text-[11px] text-muted">
                            {customer.date}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-foreground">
                          {customer.lastActivity}
                        </p>
                      )}

                    </td>

                    {/* STATUS */}
                    <td className="px-3 py-3">

                      <StatusBadge status={customer.status}>{customer.status}</StatusBadge>

                    </td>

                  </tr>

                ))
              ) : (

                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-sm text-muted"
                  >
                    {isLoading ? "Loading customers..." : "No customers found."}
                  </td>
                </tr>

              )}

            </tbody>
          </table>
          </div>

          <div className="border-t border-border px-5 py-3 text-xs text-muted">
            Showing {filteredCustomers.length} of {customers.length} preview records
          </div>

        </div>
      </div>
    </div>
  );
}

export default CustomerList;
