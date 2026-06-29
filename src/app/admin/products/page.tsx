// Admin products list — table of all products with edit, delete, and add-new actions.
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-display font-semibold text-brand-warm-white">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-primary-500 text-brand-warm-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-brand-clay border border-brand-fence rounded-xl p-12 text-center space-y-3">
          <p className="text-3xl font-display text-brand-muted">✦</p>
          <p className="text-brand-warm-white font-medium">No products yet.</p>
          <p className="text-sm text-brand-muted">Create your first product to get started.</p>
          <Link
            href="/admin/products/new"
            className="inline-block mt-4 bg-primary-500 text-brand-warm-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20"
          >
            Add Product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-brand-clay border border-brand-fence rounded-xl">
          <table className="w-full min-w-[550px]">
            <thead className="border-b border-brand-fence">
              <tr>
                <th className="text-left p-4 text-xs font-medium text-brand-muted uppercase tracking-wider">Name</th>
                <th className="text-left p-4 text-xs font-medium text-brand-muted uppercase tracking-wider">Price</th>
                <th className="text-left p-4 text-xs font-medium text-brand-muted uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-medium text-brand-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-brand-fence hover:bg-brand-risen/50 transition-colors">
                  <td className="p-4 text-sm text-brand-warm-white">{p.name}</td>
                  <td className="p-4 font-mono text-sm text-brand-warm-white">${(p.price / 100).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : p.status === "draft"
                        ? "bg-brand-yolk/10 text-brand-yolk border border-brand-yolk/20"
                        : "bg-brand-fence/30 text-brand-muted border border-brand-fence"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <Link href={`/admin/products/${p.id}`} className="text-xs text-brand-muted hover:text-primary-500 transition-colors font-medium">
                      Edit
                    </Link>
                    <span className="text-brand-fence">|</span>
                    <DeleteButton productId={p.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
