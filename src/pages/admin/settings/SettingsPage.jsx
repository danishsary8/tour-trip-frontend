import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Building2, CreditCard, Mail, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Skeleton } from "../../../components/shared/Skeleton";
import { Tabs, tabId, tabPanelId } from "../../../components/shared/Tabs";
import { WidgetError } from "../../../features/dashboard/components/WidgetCard";
import {
  EmailSettingsForm,
  GeneralSettingsForm,
  OtherSettingsForm,
  PaymentSettingsForm,
} from "../../../features/settings/components/SettingsForms";
import { useSettings } from "../../../features/settings/hooks";
import { pageTransition } from "../../../lib/motion";

const SECTIONS = [
  { value: "general", label: "General", icon: Building2, Form: GeneralSettingsForm },
  { value: "payments", label: "Payment methods", icon: CreditCard, Form: PaymentSettingsForm },
  { value: "email", label: "Email", icon: Mail, Form: EmailSettingsForm },
  { value: "other", label: "Other", icon: SlidersHorizontal, Form: OtherSettingsForm },
];

const staticTransition = { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1, transition: { duration: 0 } } };

function SettingsSkeleton() {
  return (
    <div className="space-y-5 rounded-card border border-border bg-surface p-6" role="status" aria-label="Loading settings">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-72 max-w-full" />
      <div className="grid gap-5 pt-2 md:grid-cols-2">
        {[0, 1, 2, 3].map((key) => (
          <Skeleton key={key} className="h-16" />
        ))}
      </div>
    </div>
  );
}

/** System settings: General, Payment methods, Email and Other. All values are mock. */
export default function SettingsPage() {
  const [params, setParams] = useSearchParams();
  const reduceMotion = useReducedMotion();
  const query = useSettings();
  const section = SECTIONS.find((item) => item.value === params.get("tab")) ?? SECTIONS[0];
  const { Form } = section;

  return (
    <div className="mx-auto min-w-0 max-w-[1100px] space-y-5 pb-10 sm:space-y-6">
      <PageHeader
        eyebrow="System"
        title="Settings"
        description="Company details, checkout payment methods, customer emails and booking policies."
        className="!mb-0"
      />

      <Tabs
        idPrefix="settings"
        label="Settings sections"
        tabs={SECTIONS.map(({ value, label, icon }) => ({ value, label, icon }))}
        value={section.value}
        onChange={(next) =>
          setParams((current) => {
            const updated = new URLSearchParams(current);
            updated.set("tab", next);
            return updated;
          }, { replace: true })
        }
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={section.value}
          id={tabPanelId("settings", section.value)}
          role="tabpanel"
          aria-labelledby={tabId("settings", section.value)}
          variants={reduceMotion ? staticTransition : pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {query.isLoading ? (
            <SettingsSkeleton />
          ) : query.isError ? (
            <WidgetError onRetry={() => query.refetch()} message="Settings could not be loaded." />
          ) : (
            <Form values={query.data[section.value]} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
