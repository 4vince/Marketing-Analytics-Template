### Task 3: Product Listing + Detail Pages

**Files:**
- Create: `src/app/products/page.tsx`
- Create: `src/app/products/[slug]/page.tsx`

**Interfaces:**
- Consumes: `ProductGrid` component from Task 2
- Produces: `/products` — paginated product listing with search
- Produces: `/products/[slug]` — full product detail view

- [ ] **Step 1: Create product listing page src/app/products/page.tsx**

```tsx
import ProductGrid from "@/components/storefront/ProductGrid";
import { prisma } from "@/lib/prisma";

interface Props {
  searchParams: { search?: string; category?: string };
}

export default async function ProductsPage({ searchParams }: Props) {
  const where: Record<string, unknown> = { status: "active" };
  if (searchParams.search) {
    where.name = { contains: searchParams.search, mode: "insensitive" };
  }
  if (searchParams.category) where.category = searchParams.category;

  const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
  const categories = await prisma.product.findMany({
    where: { status: "active" },
    select: { category: true },
    distinct: ["category"],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="flex gap-4 mb-8">
        <form className="flex gap-2">
          <input
            name="search"
            defaultValue={searchParams.search}
            placeholder="Search products..."
            className="border rounded px-3 py-2"
          />
          <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded">
            Search
          </button>
        </form>
        <div className="flex gap-2">
          {categories.map((c) => (
            <a
              key={c.category}
              href={`/products?category=${c.category}`}
              className="px-3 py-2 border rounded hover:bg-gray-50"
            >
              {c.category}
            </a>
          ))}
        </div>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
```

- [ ] **Step 2: Create product detail page src/app/products/[slug]/page.tsx**

```tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

interface Props {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.images[0] && (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-primary-600 font-bold mb-6">${(product.price / 100).toFixed(2)}</p>
          {product.compareAtPrice && (
            <p className="text-sm text-gray-500 line-through mb-4">
              ${(product.compareAtPrice / 100).toFixed(2)}
            </p>
          )}
          <div className="prose max-w-none mb-8">{product.description}</div>
          <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create AddToCartButton client component**

Create `src/app/products/[slug]/AddToCartButton.tsx`:
```tsx
"use client";
import { useCartStore } from "@/store/cart-store";

interface Product {
  id: string; name: string; slug: string; price: number; images: string[];
}

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      onClick={() => addItem({ ...product, quantity: 1 })}
      className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 text-lg font-semibold"
    >
      Add to Cart
    </button>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
cd D:\ecommerce-template && npx next build 2>&1 | findstr /V "Info"
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat: add product listing and detail pages"
```

---


