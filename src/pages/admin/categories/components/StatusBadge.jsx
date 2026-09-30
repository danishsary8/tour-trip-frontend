const STYLES = {
  active: 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200',
  inactive: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
};

const DOT_STYLES = {
  active: 'bg-teal-500',
  inactive: 'bg-slate-400',
};

/** Small pill badge showing a category's Active / Inactive status. */
export default function StatusBadge({ status }) {
  const isActive = status === 'active';
  const label = isActive ? 'Active' : 'Inactive';

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        STYLES[status] ?? STYLES.inactive,
      ].join(' ')}
    >
      <span className={['h-1.5 w-1.5 rounded-full', DOT_STYLES[status] ?? DOT_STYLES.inactive].join(' ')} />
      {label}
    </span>
  );
}
