export default function StatCard({ title, value, change, icon }) {
    return (
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-lg">
                    {icon}
                </div>
                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-success/12 text-success-ink">
                    ↗ {change}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-muted mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">{value}</h3>
            </div>
        </div>
    );
}