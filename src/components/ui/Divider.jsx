export function Divider({ children }) {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/38" role="separator">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/16" />
      {children && <span>{children}</span>}
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/16" />
    </div>
  );
}
