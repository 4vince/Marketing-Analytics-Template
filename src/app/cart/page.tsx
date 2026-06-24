"use client";
import { useCartStore } from "@/store/cart-store";
import CartItem from "@/components/storefront/CartItem";
import Link from "next/link";

export default function CartPage() {
  const { items, total, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/products" className="text-primary-600 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      {items.map((item) => <CartItem key={item.id} item={item} />)}
      <div className="mt-8 text-right">
        <p className="text-xl font-bold">Total: ${(total() / 100).toFixed(2)}</p>
        <div className="flex gap-4 justify-end mt-4">
          <button onClick={clearCart} className="px-4 py-2 border rounded">Clear</button>
          <Link href="/checkout" className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
