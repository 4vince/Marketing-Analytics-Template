### Task 7: Admin Orders Management

**Files:**
- Create: `src/app/admin/orders/page.tsx`
- Create: `src/app/api/orders/route.ts`
- Create: `src/app/api/webhooks/stripe/route.ts`

**Interfaces:**
- Consumes: Stripe webhook for order creation
- Produces: Order management UI in admin

- [ ] **Step 1: Create orders API src/app/api/orders/route.ts**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(orders);
}
```

- [ ] **Step 2: Create Stripe webhook handler**

Create `src/app/api/webhooks/stripe/route.ts`:
```ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await prisma.order.create({
      data: {
        customerEmail: session.customer_details?.email || "unknown",
        customerName: session.customer_details?.name || "Unknown",
        items: [],
        total: session.amount_total || 0,
        status: "paid",
        paymentIntent: session.payment_intent as string,
      },
    });
  }

  return NextResponse.json({ received: true });
}
```

- [ ] **Step 3: Create admin orders page src/app/admin/orders/page.tsx**

```tsx
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Orders</h1>
      <table className="w-full bg-white rounded-lg">
        <thead className="border-b">
          <tr>
            <th className="text-left p-3">Order ID</th>
            <th className="text-left p-3">Customer</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Total</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="p-3 font-mono">{order.id.slice(0, 8)}</td>
              <td className="p-3">{order.customerName}</td>
              <td className="p-3">{order.customerEmail}</td>
              <td className="p-3">${(order.total / 100).toFixed(2)}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  order.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>{order.status}</span>
              </td>
              <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
cd D:\ecommerce-template && npx next build 2>&1 | findstr /V "Info"
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat: add orders management and stripe webhook"
```

---


