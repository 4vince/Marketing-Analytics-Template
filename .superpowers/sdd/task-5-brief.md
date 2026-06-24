### Task 5: Admin Auth + Dashboard Layout

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/Sidebar.tsx`
- Create: `src/components/admin/StatsCard.tsx`

**Interfaces:**
- Produces: NextAuth configuration with credentials provider
- Produces: Admin layout with sidebar navigation

- [ ] **Step 1: Create auth config src/lib/auth.ts**

```ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin" },
};
```

- [ ] **Step 2: Create auth route handler src/app/api/auth/[...nextauth]/route.ts**

```ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

- [ ] **Step 3: Create admin layout src/app/admin/layout.tsx**

```tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
```

- [ ] **Step 4: Create admin sidebar src/components/admin/Sidebar.tsx**

```tsx
import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/marketing", label: "Marketing Intelligence" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-6">
      <Link href="/admin" className="text-xl font-bold mb-8 block">Admin</Link>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-primary-600">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 5: Create admin dashboard src/app/admin/page.tsx**

```tsx
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";

export default async function AdminDashboard() {
  const [productCount, orderCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Products" value={productCount} />
        <StatsCard title="Orders" value={orderCount} />
        <StatsCard title="Revenue" value={`$${recentOrders.reduce((s, o) => s + o.total, 0) / 100}`} />
      </div>
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      <table className="w-full bg-white rounded-lg">
        <thead className="border-b">
          <tr>
            <th className="text-left p-3">Order</th>
            <th className="text-left p-3">Customer</th>
            <th className="text-left p-3">Total</th>
            <th className="text-left p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="p-3">{order.id.slice(0, 8)}</td>
              <td className="p-3">{order.customerName}</td>
              <td className="p-3">${(order.total / 100).toFixed(2)}</td>
              <td className="p-3">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 6: Create StatsCard src/components/admin/StatsCard.tsx**

```tsx
interface StatsCardProps {
  title: string;
  value: string | number;
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
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
git add . && git commit -m "feat: add admin auth, layout, sidebar, and dashboard"
```

---


