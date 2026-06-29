// Cart item row with image, name, price, quantity controls (increment/decrement/remove).
"use client";
import { CartItem as CartItemType, useCartStore } from "@/store/cart-store";
import { useToast } from "@/components/ui/Toast";

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { addToast } = useToast();

  return (
    <div className="flex gap-4 py-4 border-b border-[#333]">
      <div className="w-20 h-20 bg-[#2a2a2a] rounded">
        {item.images[0] && <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded" />}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white">{item.name}</h3>
        <p className="text-primary-500">${(item.price / 100).toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
            className="w-8 h-8 border border-[#444] text-[#e0e0e0] rounded hover:bg-[#2a2a2a]">-</button>
          <span className="text-[#e0e0e0]">{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 border border-[#444] text-[#e0e0e0] rounded hover:bg-[#2a2a2a]">+</button>
          <button onClick={() => { removeItem(item.id); addToast(`${item.name} removed from cart`, "info"); }}
            className="ml-4 text-sm text-red-400 hover:text-red-300">Remove</button>
        </div>
      </div>
    </div>
  );
}
