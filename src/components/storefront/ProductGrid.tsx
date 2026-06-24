// Responsive product grid layout — renders ProductCard components or empty-state message.
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
