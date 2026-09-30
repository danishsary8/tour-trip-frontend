import { Link } from "react-router-dom";
import { cn } from "../../../lib/cn";

const linkClass = "rounded outline-none transition-colors hover:text-primary-ink focus-visible:ring-2 focus-visible:ring-primary";

/**
 * Storefront breadcrumb trail (same pattern as Tour Detail). `items` are the crumbs after
 * Home; the last one is the current page and is not a link.
 */
export function Breadcrumbs({ items, className }) {
  const trail = [{ label: "Home", to: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs font-medium text-muted sm:text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((item, index) => {
          const current = index === trail.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {current ? (
                <span className="max-w-44 truncate text-foreground sm:max-w-none" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
