import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Array<{
    id: string; name: string; slug: string; price: number;
    images: string[]; category: string;
  }>;
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-4xl font-display text-brand-muted">✦</p>
        <p className="text-brand-muted font-body">No products yet.</p>
        <p className="text-sm text-brand-muted/60">Check back soon for new arrivals.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
