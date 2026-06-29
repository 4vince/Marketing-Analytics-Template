// Checkout page loading skeleton — animated pulse placeholders for order summary.
export default function CheckoutLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="h-8 w-36 bg-[#2a2a2a] rounded animate-pulse mb-8" />
      {[1, 2].map((i) => (
        <div key={i} className="flex justify-between py-2 border-b border-[#333]">
          <div className="h-5 w-40 bg-[#2a2a2a] rounded animate-pulse" />
          <div className="h-5 w-20 bg-[#2a2a2a] rounded animate-pulse" />
        </div>
      ))}
      <div className="mt-4">
        <div className="h-7 w-40 bg-[#2a2a2a] rounded animate-pulse" />
      </div>
      <div className="mt-6 h-12 w-full bg-[#2a2a2a] rounded-lg animate-pulse" />
    </div>
  );
}
