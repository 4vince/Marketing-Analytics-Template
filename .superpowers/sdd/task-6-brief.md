### Task 6: Admin Products CRUD

**Files:**
- Create: `src/app/admin/products/page.tsx`
- Create: `src/components/admin/ProductForm.tsx`
- Create: `src/app/api/products/route.ts`

**Interfaces:**
- Consumes: Prisma `Product` model
- Produces: Product CRUD UI in admin

- [ ] **Step 1: Create products API src/app/api/products/route.ts**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
      description: data.description,
      price: Math.round(data.price * 100),
      compareAtPrice: data.compareAtPrice ? Math.round(data.compareAtPrice * 100) : null,
      images: data.images || [],
      category: data.category || "general",
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      status: data.status || "draft",
    },
  });
  return NextResponse.json(product);
}
```

- [ ] **Step 2: Create admin products page src/app/admin/products/page.tsx**

```tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="bg-primary-600 text-white px-4 py-2 rounded">
          Add Product
        </Link>
      </div>
      <table className="w-full bg-white rounded-lg">
        <thead className="border-b">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Price</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-3">{p.name}</td>
              <td className="p-3">${(p.price / 100).toFixed(2)}</td>
              <td className="p-3">{p.status}</td>
              <td className="p-3">
                <Link href={`/admin/products/${p.id}`} className="text-primary-600">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: Create ProductForm component src/components/admin/ProductForm.tsx**

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initial?: {
    name: string; description: string; price: number; category: string;
    status: string; images: string[];
  };
}

export default function ProductForm({ initial }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price ? (initial.price / 100).toString() : "",
    category: initial?.category || "general",
    status: initial?.status || "draft",
    images: initial?.images?.join(", ") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    setLoading(false);
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="block mb-1">Name</label>
        <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block mb-1">Description</label>
        <textarea name="description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded px-3 py-2" rows={4} required />
      </div>
      <div>
        <label className="block mb-1">Price ($)</label>
        <input name="price" type="number" step="0.01" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block mb-1">Category</label>
        <input name="category" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1">Image URLs (comma-separated)</label>
        <input name="images" value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1">Status</label>
        <select name="status" value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border rounded px-3 py-2">
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <button type="submit" disabled={loading}
        className="bg-primary-600 text-white px-6 py-2 rounded disabled:opacity-50">
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Create new product page**

Create `src/app/admin/products/new/page.tsx`:
```tsx
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">New Product</h1>
      <ProductForm />
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
cd D:\ecommerce-template && npx next build 2>&1 | findstr /V "Info"
```

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat: add admin products CRUD"
```

---


