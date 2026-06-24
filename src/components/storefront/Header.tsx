// Site header with store name, navigation links (Products, About, Contact, Cart).
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
