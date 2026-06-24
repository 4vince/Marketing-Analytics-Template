// Add-to-cart button — calls useCartStore.addItem() with the product and quantity 1.
"use client";
import { useCartStore } from "@/store/cart-store";

interface Product {
  id: string; name: string; slug: string; price: number; images: string[];
}

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      type="button"
      onClick={() => addItem({ ...product, quantity: 1 })}
      className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 text-lg font-semibold"
    >
      Add to Cart
    </button>
  );
}
