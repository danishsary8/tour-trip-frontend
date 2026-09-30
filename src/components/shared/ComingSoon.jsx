import { Link } from "react-router-dom";
import { ArrowLeft, Command, Hammer } from "lucide-react";
import { buttonVariants } from "../ui/Button";
import { useShell } from "../layout/shellContext";
import { cn } from "../../lib/cn";
import { EmptyState } from "./EmptyState";
import { PageHeader } from "./PageHeader";

/** Placeholder for admin routes whose page has not been built yet. */
export function ComingSoon({ title, description }) {
  const { setPaletteOpen } = useShell();

  return (
    <>
      <PageHeader eyebrow="In the works" title={title} description={description} />
      <EmptyState
        icon={Hammer}
        title="This page is still being carved"
        description={`Like the stonework at Banteay Srei, good things take a little time. ${title} will arrive in an upcoming release. Meanwhile, everything else is a keystroke away.`}
        action={
          <>
            <Link to="/admin" className={buttonVariants({ variant: "primary", size: "md" })}>
              <ArrowLeft className="size-4" aria-hidden="true" /> Back to dashboard
            </Link>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={cn(
                buttonVariants({ variant: "outline", size: "md" }),
                "bg-transparent hover:border-foreground/20 hover:bg-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-primary/60",
              )}
            >
              <Command className="size-4" aria-hidden="true" /> Open command palette
            </button>
          </>
        }
      />
    </>
  );
}
