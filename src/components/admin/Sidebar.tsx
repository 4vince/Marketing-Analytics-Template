"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/marketing", label: "Marketing" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-2 left-2 z-50 bg-white border rounded-lg p-2 shadow-sm text-gray-700"
        aria-label="Toggle sidebar"
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Overlay on mobile */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r p-6
        transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <Link href="/admin" className="text-xl font-bold mb-8 block" onClick={() => setOpen(false)}>
          Admin
        </Link>
        <nav className="flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="hover:text-primary-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
