import { Link } from "react-router-dom";
import { Compass, FolderKanban, Map, Plus, Users } from "lucide-react";

const masterSections = [
  {
    title: "Tours",
    description: "Create and manage tour packages in your catalog.",
    icon: Compass,
    action: "Add new tour",
    path: "/admin/masters/tours/new",
  },
  {
    title: "Categories",
    description: "Organize tours into categories customers can browse.",
    icon: FolderKanban,
    action: "Manage categories",
    path: "/admin/categories",
  },
  {
    title: "Destinations",
    description: "Keep the destinations used across your tour catalog.",
    icon: Map,
    action: "Coming soon",
    path: null,
  },
  {
    title: "Guides",
    description: "Manage tour guides and their availability.",
    icon: Users,
    action: "Coming soon",
    path: null,
  },
];

export default function MastersPage() {
  return (
    <div className="p-6 min-h-full bg-slate-50 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider">Administration</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">Manage Masters</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Maintain the core information used to build and publish your tour catalog.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {masterSections.map(({ title, description, icon: Icon, action, path }) => {
            const content = (
              <>
                <div className="gap-4 justify-between flex items-start">
                  <span className="grid rounded-xl bg-teal-50 text-teal-700 size-11 place-items-center">
                    <Icon size={21} />
                  </span>
                  {path && <Plus size={18} className="text-slate-400" />}
                </div>
                <div className="mt-5">
                  <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                  <p className="mt-1 text-sm text-slate-500 leading-6">{description}</p>
                </div>
                <span className={`mt-6 inline-flex text-sm font-semibold ${path ? "text-teal-700" : "text-slate-400"}`}>
                  {action}
                </span>
              </>
            );

            return path ? (
              <Link
                key={title}
                to={path}
                className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
              >
                {content}
              </Link>
            ) : (
              <div key={title} className="p-6 rounded-2xl border border-slate-200 bg-white opacity-75 shadow-sm">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
