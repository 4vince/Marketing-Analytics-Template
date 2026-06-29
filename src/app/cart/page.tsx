// Shopping cart page — displays cart items, total, clear/checkout buttons, and empty state.
"use client";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/components/ui/Toast";
import CartItem from "@/components/storefront/CartItem";
import Link from "next/link";

export default function CartPage() {
  const { items, total, clearCart } = useCartStore();
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (searchParams.get("success") === "true") {
      handled.current = true;
      addToast("Payment successful! Thank you for your order.", "success");
      clearCart();
    } else if (searchParams.get("canceled") === "true") {
      handled.current = true;
      addToast("Payment was canceled. Your cart is still here.", "error");
    }
  }, [searchParams, addToast, clearCart]);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6 text-primary-500">&#9733;</div>
        <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
        <p className="text-[#888] mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className="bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors no-underline inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>
      {items.map((item) => <CartItem key={item.id} item={item} />)}
      <div className="mt-8 text-right">
        <p className="text-2xl font-bold text-white">Total: <span className="text-primary-500">${(total() / 100).toFixed(2)}</span></p>
        <div className="flex gap-4 justify-end mt-4">
          <button onClick={clearCart} className="px-6 py-2 border border-[#444] text-[#e0e0e0] rounded-xl hover:bg-[#1e1e1e] transition-colors">
            Clear Cart
          </button>
          <Link href="/checkout" className="px-6 py-2 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors no-underline">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
