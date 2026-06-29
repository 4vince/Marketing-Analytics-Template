// Admin products list — table of all products with edit, delete, and add-new actions.
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors inline-block">
          + Add Product
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <p className="text-gray-500 text-lg mb-2">No products yet.</p>
          <p className="text-gray-400 text-sm mb-6">Create your first product to get started.</p>
          <Link href="/admin/products/new" className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition-colors inline-block">
            Add Product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border">
          <table className="w-full min-w-[450px]">
            <thead className="border-b">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">${(p.price / 100).toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      p.status === "active" ? "bg-green-100 text-green-700" :
                      p.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{p.status}</span>
                  </td>
                  <td className="p-3 space-x-3">
                    <Link href={`/admin/products/${p.id}`} className="text-primary-600 hover:text-primary-700">Edit</Link>
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
