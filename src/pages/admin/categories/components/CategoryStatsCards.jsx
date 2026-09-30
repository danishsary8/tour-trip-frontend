import { LayersIcon, CheckCircleIcon, XCircleIcon, MapIcon } from './icons';

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
      <div className={['flex items-center justify-center w-11 h-11 rounded-xl shrink-0', tone.iconWrap].join(' ')}>
        <Icon className={tone.icon} width={22} height={22} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
      </div>
    </div>
  );
}

/** Row of summary cards: Total, Active, Inactive categories and Total Tours. */
export default function CategoryStatsCards({ stats, isLoading }) {
  const cards = [
    {
      key: 'total',
      label: 'Total Categories',
      value: stats.total,
      icon: LayersIcon,
      tone: { iconWrap: 'bg-indigo-50', icon: 'text-indigo-600' },
    },
    {
      key: 'active',
      label: 'Active Categories',
      value: stats.active,
      icon: CheckCircleIcon,
      tone: { iconWrap: 'bg-emerald-50', icon: 'text-emerald-600' },
    },
    {
      key: 'inactive',
      label: 'Inactive Categories',
      value: stats.inactive,
      icon: XCircleIcon,
      tone: { iconWrap: 'bg-rose-50', icon: 'text-rose-500' },
    },
    {
      key: 'totalTours',
      label: 'Total Tours',
      value: stats.totalTours,
      icon: MapIcon,
      tone: { iconWrap: 'bg-sky-50', icon: 'text-sky-600' },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) =>
        isLoading ? (
          <div key={card.key} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 h-[76px] animate-pulse">
            <div className="h-full w-full bg-slate-100 rounded-lg" />
          </div>
        ) : (
          <StatCard key={card.key} label={card.label} value={card.value} icon={card.icon} tone={card.tone} />
        )
      )}
    </div>
  );
}
