// Cart item row with image, name, price, quantity controls (increment/decrement/remove).
"use client";
import { CartItem as CartItemType, useCartStore } from "@/store/cart-store";
import { useToast } from "@/components/ui/Toast";

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { addToast } = useToast();

  return (
    <div className="flex gap-5 py-5 border-b border-brand-fence animate-fade-in">
      {/* Image */}
      <div className="w-22 h-22 sm:w-24 sm:h-24 bg-brand-risen rounded-xl border border-brand-fence overflow-hidden flex-shrink-0">
        {item.images[0] && (
          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-brand-warm-white truncate">{item.name}</h3>
        <p className="font-mono text-sm text-primary-500 mt-0.5">
          ${(item.price / 100).toFixed(2)}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-brand-fence text-brand-muted hover:text-brand-warm-white hover:bg-brand-risen transition-colors text-sm"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium text-brand-warm-white tabular-nums">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-brand-fence text-brand-muted hover:text-brand-warm-white hover:bg-brand-risen transition-colors text-sm"
            aria-label="Increase quantity"
          >
            +
          </button>
          <button
            onClick={() => { removeItem(item.id); addToast(`${item.name} removed from cart`, "info"); }}
            className="ml-3 text-xs text-brand-muted hover:text-primary-500 transition-colors font-medium"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="text-right flex-shrink-0">
        <p className="font-mono text-sm text-brand-warm-white font-medium">
          ${((item.price * item.quantity) / 100).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
