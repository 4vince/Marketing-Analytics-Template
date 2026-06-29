// Cart page loading skeleton — animated pulse placeholders for cart items and totals.
export default function CartLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-[#2a2a2a] rounded animate-pulse mb-8" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 py-4 border-b border-[#333]">
          <div className="w-20 h-20 bg-[#2a2a2a] rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 bg-[#2a2a2a] rounded animate-pulse" />
            <div className="h-5 w-20 bg-[#2a2a2a] rounded animate-pulse" />
            <div className="flex gap-2 mt-2">
              <div className="w-8 h-8 bg-[#2a2a2a] rounded animate-pulse" />
              <div className="w-8 h-8 bg-[#2a2a2a] rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
      <div className="mt-8 text-right space-y-4">
        <div className="h-8 w-40 bg-[#2a2a2a] rounded animate-pulse ml-auto" />
        <div className="h-10 w-32 bg-[#2a2a2a] rounded animate-pulse ml-auto" />
      </div>
    </div>
  );
}
