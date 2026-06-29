"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: "⬡" },
  { href: "/admin/products", label: "Products", icon: "⊞" },
  { href: "/admin/orders", label: "Orders", icon: "☰" },
  { href: "/admin/marketing", label: "Marketing", icon: "⚲" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-2 left-2 z-50 bg-brand-clay border border-brand-fence rounded-xl p-2.5 shadow-xl text-brand-warm-white hover:bg-brand-risen transition-colors"
        aria-label="Toggle sidebar"
      >
        {open ? (
          <span className="text-lg leading-none">&times;</span>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* Overlay on mobile */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-brand-pitch border-r border-brand-fence p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Brand */}
        <Link
          href="/admin"
          className="flex items-center gap-3 mb-10 group"
          onClick={() => setOpen(false)}
        >
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-brand-warm-white font-display font-bold text-base transition-transform group-hover:scale-105">
            C
          </div>
          <span className="font-display text-lg font-semibold text-brand-warm-white">
            Admin
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-primary-500/10 text-primary-500 border border-primary-500/20"
                    : "text-brand-muted hover:text-brand-warm-white hover:bg-brand-risen border border-transparent"
                  }
                `}
              >
                <span className="text-base w-5 text-center">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to store */}
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-brand-muted hover:text-brand-warm-white hover:bg-brand-risen transition-all duration-200 mt-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Storefront
        </Link>
      </aside>
    </>
  );
}
