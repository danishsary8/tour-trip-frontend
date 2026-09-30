/** Round icon button used across the topbar. */
export const iconButtonClass =
  "relative grid size-10 shrink-0 place-items-center rounded-full text-muted outline-none transition-[color,background-color,transform] duration-200 hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95 disabled:pointer-events-none disabled:opacity-50";

export const isMacPlatform = () =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.userAgentData?.platform ?? navigator.platform ?? "");
