import { NavLink } from "react-router-dom";

/**
 * Sibling section tabs for the shared "Manage Masters" area.
 * Add a tab here once, every masters page picks it up.
 * @type {{ label: string, path: string }[]}
 */
const mastersTabs = [
  { label: "Tours", path: "/admin/masters/tours" },
  { label: "Categories", path: "/admin/masters/categories" },
  { label: "Destinations", path: "/admin/masters/destinations" },
  { label: "Guides", path: "/admin/masters/guides" },
  { label: "Schedules", path: "/admin/masters/schedules" },
];

/**
 * Horizontal tab bar shared by every /admin/masters/* page.
 * Renders nav only — each page owns its own heading and content.
 */
export default function MastersTabs() {
  return (
    <nav aria-label="Manage Masters sections" className="border-b border-slate-200/80">
      <ul className="-mb-px flex items-center gap-7 overflow-x-auto">
        {mastersTabs.map((tab) => (
          <li key={tab.path} className="shrink-0">
            <NavLink
              to={tab.path}
              className={({ isActive }) =>
                [
                  "inline-block border-b-2 pt-1 pb-3 text-[13.5px] whitespace-nowrap transition-colors duration-150",
                  "focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                  isActive
                    ? "border-indigo-600 font-semibold text-slate-900"
                    : "border-transparent font-medium text-slate-500 hover:border-slate-300 hover:text-slate-800",
                ].join(" ")
              }
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
