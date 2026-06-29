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
      className="group block bg-brand-clay rounded-xl overflow-hidden border border-brand-fence transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/30 hover:border-primary-500/30"
    >
      {/* Image */}
      <div className="aspect-square bg-brand-risen overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl text-brand-muted font-display">✦</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-1.5">
        <p className="text-xs text-brand-muted uppercase tracking-wider font-body font-medium">
          {product.category}
        </p>
        <h3 className="font-display font-semibold text-brand-warm-white group-hover:text-primary-500 transition-colors duration-200 leading-tight">
          {product.name}
        </h3>
        <p className="font-mono text-sm text-primary-500 font-medium">
          ${(product.price / 100).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
