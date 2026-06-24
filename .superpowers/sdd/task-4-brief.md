### Task 4: Cart + Checkout with Stripe

**Files:**
- Create: `src/store/cart-store.ts`
- Create: `src/app/cart/page.tsx`
- Create: `src/components/storefront/CartItem.tsx`
- Create: `src/app/checkout/page.tsx`
- Create: `src/lib/stripe.ts`
- Create: `src/app/api/checkout/route.ts`

**Interfaces:**
- Produces: `useCartStore` — zustand store with `items`, `addItem`, `removeItem`, `updateQuantity`, `total`, `clearCart`
- Consumes: Stripe payment flow

- [ ] **Step 1: Create cart store src/store/cart-store.ts**

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; name: string; slug: string; price: number; images: string[]; quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({ items: get().items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, qty) => set({ items: get().items.map((i) => i.id === id ? { ...i, quantity: qty } : i) }),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);
```

- [ ] **Step 2: Create CartItem component src/components/storefront/CartItem.tsx**

```tsx
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
```

- [ ] **Step 3: Create cart page src/app/cart/page.tsx**

```tsx
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
```

- [ ] **Step 4: Create stripe lib src/lib/stripe.ts**

```ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

export function getStripePublishableKey() {
  return process.env.STRIPE_PUBLISHABLE_KEY!;
}
```

- [ ] **Step 5: Create checkout API src/app/api/checkout/route.ts**

```ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((item: { name: string; price: number; quantity: number }) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      success_url: `${req.headers.get("origin")}/cart?success=true`,
      cancel_url: `${req.headers.get("origin")}/cart?canceled=true`,
    });
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
```

- [ ] **Step 6: Create checkout page src/app/checkout/page.tsx**

```tsx
"use client";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

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
```

- [ ] **Step 7: Verify build**

```bash
cd D:\ecommerce-template && npx next build 2>&1 | findstr /V "Info"
```

- [ ] **Step 8: Commit**

```bash
git add . && git commit -m "feat: add cart store, cart page, and stripe checkout"
```

---


