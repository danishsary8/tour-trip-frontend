import { useState } from "react";
import { toast } from "sonner";
import { CalendarCheck, Copy, DollarSign, Inbox, Mail, MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { AngkorLines } from "../../../components/effects/AngkorLines";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { EmptyState } from "../../../components/shared/EmptyState";
import { PageHeader } from "../../../components/shared/PageHeader";
import { PageSkeleton, Skeleton } from "../../../components/shared/Skeleton";
import { StatCard } from "../../../components/shared/StatCard";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Badge } from "../../../components/ui/Badge";
import { BrandMark } from "../../../components/ui/BrandMark";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Divider } from "../../../components/ui/Divider";
import { Input } from "../../../components/ui/Input";
import { PasswordInput } from "../../../components/ui/PasswordInput";
import { MenuItem, PopoverPanel } from "../../../components/ui/Popover";
import { Spinner } from "../../../components/ui/Spinner";
import { Tooltip } from "../../../components/ui/Tooltip";
import { usePopover } from "../../../hooks/usePopover";

const STATUSES = ["confirmed", "pending", "completed", "cancelled", "active", "inactive"];

function Section({ title, note, children, dark = false }) {
  const id = `kit-${title.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <section aria-labelledby={id} className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={id} className="font-display text-lg font-semibold tracking-[-0.02em]">
          {title}
        </h2>
        {note && <p className="text-xs text-muted">{note}</p>}
      </div>
      <div className={dark ? "rounded-card border border-white/10 bg-[#0b1215] p-5 text-white" : "rounded-card border border-border bg-surface p-5"}>
        {children}
      </div>
    </section>
  );
}

function KitMenu() {
  const { open, toggle, close, triggerRef, panelRef } = usePopover();
  return (
    <div className="relative inline-block">
      <Button ref={triggerRef} variant="outline" onClick={toggle} aria-haspopup="menu" aria-expanded={open} className="bg-transparent hover:bg-foreground/[0.06]">
        <MoreHorizontal className="size-4" aria-hidden="true" /> Row actions
      </Button>
      <PopoverPanel ref={panelRef} open={open} align="left" label="Row actions" className="w-48">
        <MenuItem icon={Pencil} onClick={close}>
          Edit
        </MenuItem>
        <MenuItem icon={Copy} onClick={close}>
          Duplicate
        </MenuItem>
        <MenuItem icon={Mail} disabled>
          Email guest (disabled)
        </MenuItem>
        <div className="my-1 h-px bg-border" role="separator" />
        <MenuItem icon={Trash2} tone="danger" onClick={close}>
          Delete
        </MenuItem>
      </PopoverPanel>
    </div>
  );
}

/** Dev-only gallery at /admin/_kit for reviewing every shared and ui component. */
export default function ComponentKit() {
  const [dialog, setDialog] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [checked, setChecked] = useState(true);

  function confirmDelete() {
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setDialog(null);
      toast.success("Booking TT-20931 deleted");
    }, 1200);
  }

  return (
    <div className="space-y-10 pb-16">
      <PageHeader
        eyebrow="Development only"
        title="Component kit"
        description="Every shared and ui primitive in its states. Toggle the theme from the topbar to review light and dark."
        actions={
          <>
            <Button variant="outline" className="bg-transparent hover:bg-foreground/[0.06]">
              Secondary action
            </Button>
            <Button>Primary action</Button>
          </>
        }
      />

      <Section title="Buttons" note="hover · focus-visible · active · disabled · loading · success">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline" className="bg-transparent hover:bg-foreground/[0.06]">
            Outline
          </Button>
          <Button variant="ghost" className="hover:bg-foreground/[0.06]">
            Ghost
          </Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Saving</Button>
          <Button success>Saved</Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add booking">
            <CalendarCheck className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </Section>

      <Section title="Status badges">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
          <StatusBadge status="refunded" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge>Muted</Badge>
        </div>
      </Section>

      <Section title="Stat cards">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Revenue" value="$48,210" delta={12.4} icon={DollarSign} />
          <StatCard label="Bookings" value="326" delta={-3.1} icon={CalendarCheck} />
          <StatCard label="Travellers" value="1,284" icon={Users} />
          <StatCard label="Loading" loading />
        </div>
      </Section>

      <Section title="Empty states">
        <div className="grid gap-4 lg:grid-cols-2">
          <EmptyState
            icon={Inbox}
            title="No bookings yet"
            description="When travellers reserve a tour, their bookings will appear here."
            action={<Button size="sm">Create booking</Button>}
          />
          <EmptyState compact icon={Inbox} title="Nothing matches" description="Try a different filter." />
        </div>
      </Section>

      <Section title="Overlays" note="Esc closes · focus returns to the trigger">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="danger" onClick={() => setDialog("danger")}>
            <Trash2 className="size-4" aria-hidden="true" /> Delete booking
          </Button>
          <Button onClick={() => setDialog("primary")}>Publish tour</Button>
          <KitMenu />
          <Tooltip label="Tooltips slide out on hover and focus" className="inline-block">
            <Button variant="outline" className="bg-transparent hover:bg-foreground/[0.06]">
              Hover me
            </Button>
          </Tooltip>
          <Tooltip label="Also below" side="bottom" className="inline-block">
            <Button variant="ghost" className="hover:bg-foreground/[0.06]">
              Tooltip bottom
            </Button>
          </Tooltip>
          <Button variant="secondary" onClick={() => toast("Tour saved as draft")}>
            Show toast
          </Button>
        </div>
        <ConfirmDialog
          open={dialog === "danger"}
          onClose={() => setDialog(null)}
          onConfirm={confirmDelete}
          loading={deleting}
          title="Delete booking TT-20931?"
          description="The traveller will be notified and any payment will need to be refunded manually. This cannot be undone."
          confirmLabel="Delete booking"
        />
        <ConfirmDialog
          open={dialog === "primary"}
          onClose={() => setDialog(null)}
          onConfirm={() => setDialog(null)}
          tone="primary"
          title="Publish Angkor Sunrise Explorer?"
          description="The tour becomes visible to customers immediately."
          confirmLabel="Publish"
        />
      </Section>

      <Section title="Skeletons">
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-24 rounded-card" />
        </div>
        <Divider />
        <div className="mt-4">
          <PageSkeleton />
        </div>
      </Section>

      <Section title="Auth form controls" note="Built for the dark login surface" dark>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Email address" icon={Mail} />
          <PasswordInput label="Password" />
          <Input label="With error" error="Please enter a valid email" defaultValue="admin@" />
          <Input label="Disabled" disabled />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-6">
          <Checkbox label="Remember me" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
          <Checkbox label="Disabled" disabled />
          <Spinner className="size-5 text-accent" />
        </div>
        <div className="mt-5">
          <Divider>or</Divider>
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">Default card</Card>
          <Card variant="elevated" className="p-5">
            Elevated card
          </Card>
          <Card interactive className="p-5">
            Interactive card (hover)
          </Card>
        </div>
      </Section>

      <Section title="Brand & texture">
        <div className="flex flex-wrap items-center gap-10">
          <BrandMark className="text-foreground" />
          <BrandMark compact showText={false} className="text-foreground" />
          <AngkorLines className="h-20 w-60 text-accent/60" />
        </div>
      </Section>
    </div>
  );
}
