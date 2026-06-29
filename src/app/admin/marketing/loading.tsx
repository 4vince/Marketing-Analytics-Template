// Marketing intelligence loading skeleton — animated pulse placeholders for score and product cards.
export default function MarketingLoading() {
  return (
    <div>
      <div className="h-8 w-64 bg-brand-risen rounded animate-pulse mb-8" />
      <div className="bg-brand-clay border border-brand-fence rounded-xl p-6 mb-8">
        <div className="h-4 w-32 bg-brand-risen rounded animate-pulse mb-2" />
        <div className="h-8 w-20 bg-brand-risen rounded animate-pulse" />
      </div>
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-brand-clay border border-brand-fence rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="h-6 w-48 bg-brand-risen rounded animate-pulse mb-1" />
                <div className="h-4 w-20 bg-brand-risen rounded animate-pulse" />
              </div>
              <div className="h-8 w-24 bg-brand-risen rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="bg-brand-risen border border-brand-fence rounded-lg p-4">
                  <div className="h-3 w-16 bg-brand-risen/50 rounded animate-pulse mb-1" />
                  <div className="h-5 w-12 bg-brand-risen/50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
