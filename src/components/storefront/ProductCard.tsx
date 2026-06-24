// Product card with image, category, name, price, hover effects, and link to detail page.
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
