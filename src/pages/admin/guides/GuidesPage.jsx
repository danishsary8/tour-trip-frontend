import MastersTabs from "../../../components/common/MastersTabs";

export default function GuidesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Manage Guides
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage the guides available for your tours.
        </p>
      </div>

      <div className="mt-6">
        <MastersTabs />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">No guides yet</h2>
        <p className="mt-1 text-sm text-slate-500">
          Guide management will appear here when guides are added.
        </p>
      </div>
    </div>
  );
}
