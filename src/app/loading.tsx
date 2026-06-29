// Homepage loading skeleton — animated pulse placeholders for hero and featured products.
export default function HomeLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-start pt-10">
        <div className="flex flex-row items-center justify-between gap-12 max-w-7xl mx-auto px-4 w-full">
          <div className="flex-1 space-y-6">
            <div className="h-12 w-96 bg-[#2a2a2a] rounded animate-pulse" />
            <div className="h-6 w-72 bg-[#2a2a2a] rounded animate-pulse" />
            <div className="h-14 w-40 bg-[#2a2a2a] rounded-xl animate-pulse" />
          </div>
          <div className="flex-shrink-0 w-[35%]">
            <div className="w-full aspect-square bg-[#1e1e1e] rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>
      {/* Featured products skeleton */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="h-8 w-64 bg-[#2a2a2a] rounded animate-pulse mx-auto mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#1e1e1e] rounded-xl overflow-hidden">
              <div className="aspect-square bg-[#2a2a2a] animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-16 bg-[#2a2a2a] rounded animate-pulse" />
                <div className="h-5 w-32 bg-[#2a2a2a] rounded animate-pulse" />
                <div className="h-5 w-20 bg-[#2a2a2a] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
