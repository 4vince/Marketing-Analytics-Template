// Marketing intelligence loading skeleton — animated pulse placeholders for score and product cards.
export default function MarketingLoading() {
  return (
    <div>
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-8" />
      <div className="bg-white p-6 rounded-lg border mb-8">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="bg-gray-50 p-3 rounded">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
