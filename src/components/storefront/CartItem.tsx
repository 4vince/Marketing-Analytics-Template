// "Cart item row with image, name, price, quantity controls (increment/decrement/remove).
"use client";
import { CartItem as CartItemType, useCartStore } from "@/store/cart-store";

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="w-20 h-20 bg-gray-100 rounded">
        {item.images[0] && <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded" />}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-primary-600">${(item.price / 100).toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
            className="w-8 h-8 border rounded">-</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 border rounded">+</button>
          <button onClick={() => removeItem(item.id)}
            className="ml-4 text-sm text-red-500">Remove</button>
        </div>
      </div>
    </div>
  );
}
