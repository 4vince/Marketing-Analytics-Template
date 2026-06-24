"use client";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) router.push("/cart");
  }, [items.length, router]);

  if (items.length === 0) return null;

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between py-2 border-b">
          <span>{item.name} x{item.quantity}</span>
          <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
        </div>
      ))}
      <p className="text-xl font-bold mt-4">Total: ${(total() / 100).toFixed(2)}</p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay with Stripe"}
      </button>
    </div>
  );
}
