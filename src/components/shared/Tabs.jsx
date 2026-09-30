import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";

/**
 * Horizontal tab bar with the same look as the Masters section tabs. Arrow keys, Home and
 * End move between tabs; the bar scrolls the active tab into view on narrow screens.
 * Pair each panel with `id={tabPanelId(idPrefix, value)}` and `aria-labelledby={tabId(idPrefix, value)}`.
 */
export const tabId = (prefix, value) => `${prefix}-tab-${value}`;
export const tabPanelId = (prefix, value) => `${prefix}-panel-${value}`;

export function Tabs({ tabs, value, onChange, label, idPrefix, className }) {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector('[aria-selected="true"]');
    if (!list || !active) return;
    list.scrollLeft += active.getBoundingClientRect().left - list.getBoundingClientRect().left - (list.clientWidth - active.clientWidth) / 2;
  }, [value]);

  function onKeyDown(event) {
    const index = tabs.findIndex((tab) => tab.value === value);
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const target = tabs[(next + tabs.length) % tabs.length];
    onChange(target.value);
    listRef.current?.querySelector(`#${tabId(idPrefix, target.value)}`)?.focus();
  }

  return (
    <div ref={listRef} className={cn("overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex w-max min-w-full gap-1">
        {tabs.map(({ value: tabValue, label: tabLabel, icon: Icon }) => {
          const selected = tabValue === value;
          return (
            <button
              key={tabValue}
              id={tabId(idPrefix, tabValue)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={tabPanelId(idPrefix, tabValue)}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tabValue)}
              className={cn(
                "relative inline-flex items-center gap-2 whitespace-nowrap rounded-t-control px-4 py-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/60 active:bg-surface-2",
                selected
                  ? "bg-primary/10 text-primary-ink after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                  : "text-muted hover:bg-surface-2 hover:text-foreground",
              )}
            >
              {Icon && <Icon className="size-4" aria-hidden="true" />}
              {tabLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
