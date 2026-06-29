// Dashboard statistic card — displays a title and value (e.g., product count, revenue).
interface StatsCardProps {
  title: string;
  value: string | number;
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-brand-clay border border-brand-fence rounded-xl p-6 transition-all duration-200 hover:border-primary-500/30 hover:shadow-lg hover:shadow-black/20">
      <p className="text-xs text-brand-muted uppercase tracking-wider font-medium font-body">{title}</p>
      <p className="text-2xl font-display font-semibold text-brand-warm-white mt-1.5 tabular-nums">{value}</p>
    </div>
  );
}
