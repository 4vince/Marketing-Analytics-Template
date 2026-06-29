"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-pitch/80 backdrop-blur-md border-b border-brand-fence">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Brand mark */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-brand-warm-white font-display font-bold text-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary-500/30">
            C
          </div>
          <span className="font-display text-xl font-semibold text-brand-warm-white tracking-tight">
            Chickenoodle
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-3 py-2 text-sm font-body font-medium text-brand-muted hover:text-brand-warm-white transition-colors duration-200 group"
            >
              {link.label}
              <span className="absolute inset-x-3 bottom-0 h-[2px] bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative ml-4 p-2 text-brand-muted hover:text-brand-warm-white transition-colors duration-200"
            aria-label="Shopping cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full bg-brand-yolk text-[10px] font-bold text-black leading-none px-1 animate-fade-in">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
