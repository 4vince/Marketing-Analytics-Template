// Admin dashboard loading skeleton — animated pulse placeholders for stats and orders table.
export default function AdminDashboardLoading() {
  return (
    <div>
      <div className="h-8 w-40 bg-brand-risen rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-brand-clay border border-brand-fence rounded-xl p-6">
            <div className="h-4 w-20 bg-brand-risen rounded animate-pulse mb-2" />
            <div className="h-8 w-16 bg-brand-risen rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="h-6 w-32 bg-brand-risen rounded animate-pulse mb-4" />
      <div className="bg-brand-clay border border-brand-fence rounded-xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-4 border-b border-brand-fence">
            <div className="h-5 w-24 bg-brand-risen rounded animate-pulse" />
            <div className="h-5 w-32 bg-brand-risen rounded animate-pulse" />
            <div className="h-5 w-16 bg-brand-risen rounded animate-pulse" />
            <div className="h-5 w-16 bg-brand-risen rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
