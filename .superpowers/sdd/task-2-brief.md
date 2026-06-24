### Task 2: Storefront Layout + Home Page

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/components/storefront/Header.tsx`
- Create: `src/components/storefront/Footer.tsx`

**Interfaces:**
- Produces: Root layout wrapping all pages with Header + Footer
- Produces: Home page with hero and featured products section

- [ ] **Step 1: Create root layout src/app/layout.tsx**

```tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";

export const metadata: Metadata = {
  title: "Store",
  description: "E-commerce template",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create Header src/components/storefront/Header.tsx**

```tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">Store</Link>
        <nav className="flex gap-6">
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/cart">Cart</Link>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create Footer src/components/storefront/Footer.tsx**

```tsx
export default function Footer() {
  return (
    <footer className="border-t py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Store. All rights reserved.
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create Home page src/app/page.tsx**

```tsx
import Link from "next/link";
import ProductGrid from "@/components/storefront/ProductGrid";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { status: "active" },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of products.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700"
          >
            Shop Now
          </Link>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Create ProductCard src/components/storefront/ProductCard.tsx**

```tsx
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group border rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <div className="aspect-square bg-gray-100">
        {product.images[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-primary-600 font-bold mt-1">${(product.price / 100).toFixed(2)}</p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 6: Create ProductGrid src/components/storefront/ProductGrid.tsx**

```tsx
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Array<{
    id: string; name: string; slug: string; price: number;
    images: string[]; category: string;
  }>;
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <p className="text-gray-500">No products yet.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
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
git add . && git commit -m "feat: add storefront layout, home page, product grid"
```

---


