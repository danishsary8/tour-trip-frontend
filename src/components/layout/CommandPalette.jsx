import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUp, Check, CornerDownLeft, FolderPlus, LogOut, Moon, Plus, Search, SearchX, Sun, UserPlus } from "lucide-react";
import { useTheme } from "../../app/providers/ThemeProvider";
import { useAuth } from "../../features/auth/AuthContext";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { cn } from "../../lib/cn";
import { NAV_GROUPS } from "./navigation";
import { useShell } from "./shellContext";

const QUICK_ACTIONS = [
  { label: "Create tour", path: "/admin/masters/tours/create", icon: Plus, keywords: ["new", "package", "trip"] },
  { label: "Add customer", path: "/admin/customers/create", icon: UserPlus, keywords: ["new", "traveller", "client"] },
  { label: "Add category", path: "/admin/categories/create", icon: FolderPlus, keywords: ["new", "master"] },
];

const groupClass =
  "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[10.5px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted";

function PaletteItem({ icon: Icon, children, hint, tone = "default", checked = false, ...props }) {
  return (
    <Command.Item
      {...props}
      className={cn(
        "group relative flex cursor-pointer select-none items-center gap-3 rounded-control px-2.5 py-2 text-sm outline-none transition-colors duration-150",
        "data-[selected=true]:bg-primary/12 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-45",
        tone === "danger" ? "text-danger-ink" : "text-foreground",
      )}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-surface-2/70 text-muted transition-[color,background-color,transform] duration-150",
          "group-data-[selected=true]:scale-105 group-data-[selected=true]:border-primary/30 group-data-[selected=true]:bg-primary/15 group-data-[selected=true]:text-primary-ink",
          tone === "danger" && "group-data-[selected=true]:bg-danger/15 group-data-[selected=true]:text-danger-ink",
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="flex-1 truncate">{children}</span>
      {checked && <Check className="size-4 text-success-ink" aria-label="Current" />}
      {hint && <span className="hidden text-xs text-muted sm:inline">{hint}</span>}
      <CornerDownLeft
        className="size-3.5 text-muted opacity-0 transition-opacity duration-150 group-data-[selected=true]:opacity-100"
        aria-hidden="true"
      />
    </Command.Item>
  );
}

function Keycap({ children, label }) {
  return (
    <kbd
      aria-label={label}
      className="inline-grid h-5 min-w-5 place-items-center rounded border border-border bg-surface-2 px-1 font-sans text-[10.5px] font-medium text-muted"
    >
      {children}
    </kbd>
  );
}

function PalettePanel({ onClose }) {
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const reduceMotion = useReducedMotion();

  useFocusTrap(panelRef, true, { initialFocusRef: inputRef });

  function run(action) {
    onClose();
    action();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-3 pt-[10vh] sm:pt-[14vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        transition={{ duration: reduceMotion ? 0 : 0.22 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
        aria-hidden="true"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
        }}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -8, transition: { duration: 0.14 } }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 34 }}
        className="relative w-full max-w-[640px] overflow-hidden rounded-panel border border-border bg-surface/90 shadow-panel backdrop-blur-2xl"
      >
        {/* golden-hour edge light */}
        <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" aria-hidden="true" />

        <Command label="Command palette" loop className={groupClass}>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-[18px] shrink-0 text-muted" aria-hidden="true" />
            <Command.Input
              ref={inputRef}
              placeholder="Search pages, actions and settings…"
              className="h-14 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted/80"
            />
            <button
              type="button"
              onClick={onClose}
              className="rounded-md outline-none transition-transform duration-150 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95"
              aria-label="Close command palette"
            >
              <Keycap>esc</Keycap>
            </button>
          </div>

          <Command.List className="max-h-[min(420px,55vh)] overflow-y-auto overscroll-contain px-2 pb-2 [scrollbar-width:thin]">
            <Command.Empty className="flex flex-col items-center px-6 py-12 text-center">
              <span className="mb-3 grid size-12 place-items-center rounded-full bg-accent/12 text-accent-ink">
                <SearchX className="size-5" aria-hidden="true" />
              </span>
              <p className="font-display text-base font-semibold text-foreground">No matches found</p>
              <p className="mt-1 text-xs text-muted">Try a page name like “bookings” or an action like “create”.</p>
            </Command.Empty>

            <Command.Group heading="Navigate">
              {NAV_GROUPS.flatMap((group) => group.items.map((item) => ({ item, group }))).map(({ item, group }) => (
                <PaletteItem
                  key={item.id}
                  value={item.label}
                  keywords={[item.id, group.label, group.crumb ?? "", "go", "open"]}
                  icon={item.icon}
                  hint={group.crumb ?? group.label}
                  onSelect={() => run(() => navigate(item.path))}
                >
                  {item.label}
                </PaletteItem>
              ))}
            </Command.Group>

            <Command.Group heading="Quick actions">
              {QUICK_ACTIONS.map((action) => (
                <PaletteItem
                  key={action.label}
                  value={action.label}
                  keywords={action.keywords}
                  icon={action.icon}
                  onSelect={() => run(() => navigate(action.path))}
                >
                  {action.label}
                </PaletteItem>
              ))}
            </Command.Group>

            <Command.Group heading="Theme">
              <PaletteItem value="Light mode" keywords={["theme", "day"]} icon={Sun} checked={theme === "light"} onSelect={() => run(() => setTheme("light"))}>
                Light mode
              </PaletteItem>
              <PaletteItem value="Dark mode" keywords={["theme", "night"]} icon={Moon} checked={theme === "dark"} onSelect={() => run(() => setTheme("dark"))}>
                Dark mode
              </PaletteItem>
            </Command.Group>

            <Command.Group heading="Account">
              <PaletteItem
                value="Log out"
                keywords={["logout", "sign out", "exit"]}
                icon={LogOut}
                tone="danger"
                onSelect={() =>
                  run(() => {
                    logout();
                    navigate("/admin/login", { replace: true });
                  })
                }
              >
                Log out
              </PaletteItem>
            </Command.Group>
          </Command.List>

          <div className="flex items-center gap-4 border-t border-border bg-surface-2/40 px-4 py-2.5 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <Keycap label="Up arrow">
                <ArrowUp className="size-3" aria-hidden="true" />
              </Keycap>
              <Keycap label="Down arrow">
                <ArrowDown className="size-3" aria-hidden="true" />
              </Keycap>
              navigate
            </span>
            <span className="flex items-center gap-1.5">
              <Keycap label="Enter">
                <CornerDownLeft className="size-3" aria-hidden="true" />
              </Keycap>
              select
            </span>
            <span className="flex items-center gap-1.5">
              <Keycap>esc</Keycap> close
            </span>
            <span className="ml-auto hidden items-center gap-1.5 sm:flex">
              <Keycap>G</Keycap> then <Keycap>D</Keycap> dashboard
            </span>
          </div>
        </Command>
      </motion.div>
    </div>
  );
}

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useShell();

  return <AnimatePresence>{paletteOpen && <PalettePanel key="palette" onClose={() => setPaletteOpen(false)} />}</AnimatePresence>;
}
