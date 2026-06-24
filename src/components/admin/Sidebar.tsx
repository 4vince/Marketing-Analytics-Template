import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/marketing", label: "Marketing Intelligence" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-6">
      <Link href="/admin" className="text-xl font-bold mb-8 block">Admin</Link>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-primary-600">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
