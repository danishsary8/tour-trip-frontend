/** Class recipes shared by the checkout and My Bookings (storefront pill buttons and panels). */
const pill =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

export const primaryPill = `${pill} bg-primary text-white shadow-glow hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-accent active:translate-y-0`;
export const outlinePill = `${pill} border border-border bg-surface text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.05] focus-visible:ring-primary active:translate-y-0`;
export const quietButton =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-primary-ink outline-none transition-colors hover:bg-primary/[0.08] focus-visible:ring-2 focus-visible:ring-primary active:scale-95 disabled:pointer-events-none disabled:opacity-50";
export const panel = "rounded-panel border border-border bg-surface";
export const eyebrow = "text-xs font-semibold uppercase tracking-[0.16em] text-primary-ink";

const smallPill =
  "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";
export const smallPrimary = `${smallPill} bg-primary text-white hover:bg-primary/90 focus-visible:ring-accent`;
export const smallOutline = `${smallPill} border border-border text-foreground hover:border-primary/40 hover:bg-primary/[0.05] focus-visible:ring-primary`;
export const smallDanger = `${smallPill} text-danger-ink hover:bg-danger/[0.08] focus-visible:ring-danger disabled:hover:bg-transparent`;
