import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Ban, Bell, BellOff, CalendarCheck, CheckCheck, CreditCard, Star, Trash2, Users } from "lucide-react";
import { useClearNotifications, useMarkAllNotificationsRead, useNotifications } from "../../features/notifications/hooks";
import { usePopover } from "../../hooks/usePopover";
import { cn } from "../../lib/cn";
import { formatTimeAgo } from "../../lib/time";
import { PopoverPanel } from "../ui/Popover";
import { iconButtonClass } from "./shellUtils";

const TYPES = {
  booking: { icon: CalendarCheck, tile: "bg-primary/12 text-primary-ink", to: "/admin/bookings" },
  payment: { icon: CreditCard, tile: "bg-success/14 text-success-ink", to: "/admin/bookings" },
  review: { icon: Star, tile: "bg-accent/16 text-accent-ink", to: "/admin/reviews" },
  capacity: { icon: Users, tile: "bg-info/14 text-info-ink", to: "/admin/masters" },
  cancellation: { icon: Ban, tile: "bg-danger/12 text-danger-ink", to: "/admin/bookings" },
};

const textButtonClass =
  "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium outline-none transition-[color,background-color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95 disabled:pointer-events-none disabled:opacity-40";

function NotificationRow({ item, index, onOpen }) {
  const reduceMotion = useReducedMotion();
  const type = TYPES[item.type] ?? TYPES.booking;
  const Icon = type.icon;

  return (
    <motion.li
      layout={reduceMotion ? false : "position"}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16, transition: { duration: 0.16, delay: index * 0.03 } }}
      transition={{ duration: 0.22, delay: reduceMotion ? 0 : index * 0.035 }}
    >
      <button
        type="button"
        data-popover-item
        onClick={() => onOpen(type.to)}
        className={cn(
          "group flex w-full items-start gap-3 rounded-control px-2.5 py-2.5 text-left outline-none transition-[background-color] duration-300",
          "hover:bg-foreground/[0.05] focus-visible:bg-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-primary/50",
          !item.read && "bg-primary/[0.06]",
        )}
      >
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105", type.tile)}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block text-sm leading-snug", item.read ? "font-medium text-foreground/85" : "font-semibold text-foreground")}>
            {item.title}
          </span>
          <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted">{item.body}</span>
          <time dateTime={item.createdAt} className="mt-1 block text-[11px] text-muted/80">
            {formatTimeAgo(item.createdAt)}
          </time>
        </span>
        <AnimatePresence initial={false}>
          {!item.read && (
            <motion.span
              key="dot"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.2, delay: reduceMotion ? 0 : index * 0.06 } }}
              className="mt-1.5 size-2 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
            >
              <span className="sr-only">Unread</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.li>
  );
}

function EmptyNotifications() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center px-6 py-10 text-center">
      <span className="relative mb-4 grid size-14 place-items-center rounded-full bg-accent/12 text-accent-ink ring-8 ring-accent/[0.05]">
        <BellOff className="size-6" aria-hidden="true" />
      </span>
      <p className="font-display text-base font-semibold">You’re all caught up</p>
      <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-muted">New bookings, payments and reviews will land here as they happen.</p>
    </motion.div>
  );
}

export function NotificationsMenu() {
  const { open, toggle, close, triggerRef, panelRef } = usePopover();
  const { data: notifications = [], isLoading } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();
  const clearAll = useClearNotifications();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const unread = notifications.filter((item) => !item.read).length;

  function openItem(path) {
    close();
    navigate(path);
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        className={iconButtonClass}
      >
        <Bell className={cn("size-[18px] transition-transform duration-200", open && "-rotate-12")} aria-hidden="true" />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key={unread}
              initial={reduceMotion ? false : { scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 22 }}
              className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold tabular-nums leading-none text-white ring-2 ring-background"
              aria-hidden="true"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <PopoverPanel
        ref={panelRef}
        open={open}
        role="dialog"
        label="Notifications"
        autoFocus="panel"
        className="w-[380px] p-0 max-sm:fixed max-sm:inset-x-3 max-sm:top-[68px] max-sm:w-auto"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-base font-semibold">Notifications</h2>
            {unread > 0 && (
              <span className="rounded-full bg-primary/14 px-2 py-0.5 text-[11px] font-semibold text-primary-ink">{unread} new</span>
            )}
          </div>
          <button
            type="button"
            data-popover-item
            onClick={() => markAllRead.mutate()}
            disabled={unread === 0 || markAllRead.isPending}
            className={cn(textButtonClass, "text-primary-ink hover:bg-primary/10")}
          >
            <CheckCheck className="size-3.5" aria-hidden="true" /> Mark all as read
          </button>
        </div>

        <div className="max-h-[min(420px,60vh)] overflow-y-auto p-1.5" aria-live="polite">
          {isLoading ? (
            <ul className="space-y-1" aria-label="Loading notifications">
              {[0, 1, 2].map((key) => (
                <li key={key} className="flex gap-3 px-2.5 py-2.5">
                  <span className="skeleton size-9 rounded-xl" />
                  <span className="flex-1 space-y-2 pt-1">
                    <span className="skeleton block h-3 w-3/5 rounded" />
                    <span className="skeleton block h-2.5 w-4/5 rounded" />
                  </span>
                </li>
              ))}
            </ul>
          ) : notifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            <ul className="space-y-0.5">
              <AnimatePresence initial={false}>
                {notifications.map((item, index) => (
                  <NotificationRow key={item.id} item={item} index={index} onOpen={openItem} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-3 py-2">
            <span className="text-[11px] text-muted">Showing latest {notifications.length}</span>
            <button
              type="button"
              data-popover-item
              onClick={() => clearAll.mutate()}
              disabled={clearAll.isPending}
              className={cn(textButtonClass, "text-muted hover:bg-danger/10 hover:text-danger-ink")}
            >
              <Trash2 className="size-3.5" aria-hidden="true" /> Clear all
            </button>
          </div>
        )}
      </PopoverPanel>
    </div>
  );
}
