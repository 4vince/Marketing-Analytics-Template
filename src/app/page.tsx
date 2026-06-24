// Homepage — hero banner with CTA and featured products grid (up to 8 active products).
import Link from "next/link";
import ProductGrid from "@/components/storefront/ProductGrid";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  try {
    const raw = await prisma.product.findMany({
      where: { status: "active" },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
    products = raw;
  } catch {
    // Database unavailable — show empty featured section
  }

  const safeProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    images: Array.isArray(p.images) ? p.images.filter((i): i is string => typeof i === "string") : [],
    category: p.category,
  }));

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
        <ProductGrid products={safeProducts} />
      </section>
    </div>
  );
}
