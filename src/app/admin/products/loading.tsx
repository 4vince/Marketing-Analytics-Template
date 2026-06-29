// Admin products list loading skeleton — animated pulse placeholder for table.
export default function AdminProductsLoading() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-40 bg-brand-risen rounded animate-pulse" />
        <div className="h-10 w-32 bg-brand-risen rounded-xl animate-pulse" />
      </div>
      <div className="bg-brand-clay border border-brand-fence rounded-xl">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 p-4 border-b border-brand-fence">
            <div className="h-5 w-48 bg-brand-risen rounded animate-pulse" />
            <div className="h-5 w-16 bg-brand-risen rounded animate-pulse" />
            <div className="h-5 w-16 bg-brand-risen rounded animate-pulse" />
            <div className="h-5 w-24 bg-brand-risen rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
