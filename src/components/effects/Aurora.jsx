import { cn } from "../../lib/cn";

export function Aurora({ className }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_12%_20%,rgba(200,85,61,0.22),transparent_70%),radial-gradient(ellipse_65%_50%_at_85%_78%,rgba(233,185,73,0.18),transparent_70%)]" />
    </div>
  );
}
