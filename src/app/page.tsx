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
      <section className="home autoShow relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-start pt-10">
        <div className="hero-wrapper flex flex-row items-center justify-between gap-12 max-w-7xl mx-auto px-4 w-full">
          <div className="content z-10">
            <h1 className="text-5xl font-black uppercase tracking-wide leading-tight text-primary-500 mb-6">
              Discover Our Collection
            </h1>
            <p className="text-lg text-[#cccccc] mb-10 max-w-xl">
              Explore our curated selection of products handpicked for quality and style.
            </p>
            <Link
              href="/products"
              className="bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold no-underline inline-block hover:bg-transparent hover:text-primary-500 hover:border-2 hover:border-primary-500 hover:scale-105 transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
          <div className="hero-image imageReveal flex-shrink-0 w-[35%] flex justify-end">
            <div className="w-full aspect-square bg-[#1e1e1e] rounded-2xl flex items-center justify-center text-6xl text-primary-500">
              &#9733;
            </div>
          </div>
        </div>
        <div className="media-icons z-10 fixed right-8 top-1/3 flex flex-col gap-5 text-primary-500 text-2xl">
          <a href="#" className="hover:scale-110 transition-transform"><i className="fab fa-facebook-f" /></a>
          <a href="#" className="hover:scale-110 transition-transform"><i className="fab fa-instagram" /></a>
          <a href="#" className="hover:scale-110 transition-transform"><i className="fab fa-twitter" /></a>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-primary-500 uppercase tracking-wide mb-10 text-center">
          Featured Products
        </h2>
        <p className="text-[#cccccc] text-center max-w-2xl mx-auto mb-10 -mt-6">
          Browse our latest and most popular items.
        </p>
        <ProductGrid products={safeProducts} />
      </section>
    </div>
  );
}
