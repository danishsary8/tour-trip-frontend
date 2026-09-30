import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MastersTabs from "../../../components/common/MastersTabs";
import DestinationTable from "./components/DestinationTable";
import DestinationsPagination from "./components/DestinationsPagination";
import { mockDestinations } from "./data/mockDestinations";
import "./destinations.css";

const PAGE_SIZE = 5;

/**
 * /admin/masters/destinations — paginated list of destinations.
 * Add / edit / delete flows land in a later task; handlers are stubbed for now.
 */
export default function DestinationsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalCount = mockDestinations.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const visibleDestinations = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return mockDestinations.slice(start, start + PAGE_SIZE);
  }, [currentPage]);

  function handlePageChange(page) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  function handleAdd() {
    navigate("/admin/destinations/create");
  }

  function handleEdit(_destination) {}

  function handleDelete(_destination) {}

  return (
    <div className="destinations-page mx-auto w-full max-w-7xl">
      {/* ─── Page header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[25px] leading-tight font-bold tracking-[-0.02em] text-slate-900 sm:text-[27px]">
            Manage Destinations
          </h1>
          <p className="mt-1 text-[13.5px] text-slate-500">
            Manage regions, cities, and popular spots.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-sm shadow-indigo-600/25 transition-all duration-150 hover:bg-indigo-700 hover:shadow-indigo-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add New Destination
        </button>
      </div>

      {/* ─── Shared Masters section tabs ─── */}
      <div className="mt-6">
        <MastersTabs />
      </div>

      {/* ─── Table card ─── */}
      {/* No overflow-hidden here on purpose: it would trap the table's sticky header. */}
      <div className="mt-5 rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-8px_rgba(15,23,42,0.10)]">
        <DestinationTable
          destinations={visibleDestinations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <DestinationsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
