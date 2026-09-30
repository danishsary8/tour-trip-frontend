import { LoaderCircle } from "lucide-react";
import { cn } from "../../lib/cn";

export function Spinner({ className, label = "Loading" }) {
  return (
    <span role="status" className="inline-flex">
      <LoaderCircle className={cn("size-4 animate-spin", className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
