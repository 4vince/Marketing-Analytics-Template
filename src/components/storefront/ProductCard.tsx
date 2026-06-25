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
      className="group bg-[#1e1e1e] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="aspect-square bg-[#2a2a2a] overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-primary-500">
            &#9733;
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-[#888] mb-1 uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold text-white">{product.name}</h3>
        <p className="text-primary-500 font-bold mt-1">${(product.price / 100).toFixed(2)}</p>
      </div>
    </Link>
  );
}
