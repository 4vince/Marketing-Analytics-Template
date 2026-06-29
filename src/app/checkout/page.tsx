// Checkout page — creates Stripe Checkout Session and redirects to Stripe-hosted checkout.
"use client";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) router.push("/cart");
  }, [items.length, router]);

  if (items.length === 0) return null;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
        }),
      });
      if (!res.ok) throw new Error("Checkout failed. Please try again.");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#1e1e1e] rounded-xl p-6 border border-[#333]">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b border-[#333] last:border-b-0">
            <span className="text-[#e0e0e0]">{item.name} <span className="text-[#888]">x{item.quantity}</span></span>
            <span className="text-white">${((item.price * item.quantity) / 100).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-4 mt-2 border-t border-[#333]">
          <span className="text-lg font-bold text-white">Total</span>
          <span className="text-lg font-bold text-primary-500">${(total() / 100).toFixed(2)}</span>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-[#1e1e1e] rounded-xl p-8 border border-[#333] text-center max-w-sm mx-4">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold text-lg">Redirecting to secure checkout...</p>
            <p className="text-[#888] text-sm mt-2">You&apos;ll be taken to Stripe to complete payment.</p>
          </div>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full mt-6 bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 disabled:opacity-50 transition-colors text-lg"
      >
        {loading ? "Redirecting..." : "Pay with Stripe"}
      </button>
    </div>
  );
}
