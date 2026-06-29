import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-brand-fence bg-brand-pitch">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-brand-warm-white font-display font-bold text-base">
                C
              </div>
              <span className="font-display text-lg font-semibold text-brand-warm-white">
                Chickenoodle
              </span>
            </div>
            <p className="text-sm text-brand-muted max-w-xs leading-relaxed">
              Quality products, hand-selected with intention. We believe what you buy should feel as good as it looks.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-brand-warm-white uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/products", label: "All Products" },
                { href: "/cart", label: "Shopping Cart" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-muted hover:text-primary-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-brand-warm-white uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex gap-4">
              {[
                { label: "Facebook", icon: "f" },
                { label: "Instagram", icon: "ig" },
                { label: "Twitter", icon: "t" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg border border-brand-fence flex items-center justify-center text-sm font-medium text-brand-muted hover:text-primary-500 hover:border-primary-500/40 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-fence text-center text-xs text-brand-muted">
          &copy; {new Date().getFullYear()} Chickenoodle. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
