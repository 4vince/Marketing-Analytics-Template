// Admin products list — table of all products with edit, delete, and add-new actions.
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="bg-primary-600 text-white px-4 py-2 rounded">
          Add Product
        </Link>
      </div>
      <table className="w-full bg-white rounded-lg">
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
            <tr key={p.id} className="border-b">
              <td className="p-3">{p.name}</td>
              <td className="p-3">${(p.price / 100).toFixed(2)}</td>
              <td className="p-3">{p.status}</td>
              <td className="p-3 space-x-2">
                <Link href={`/admin/products/${p.id}`} className="text-primary-600">Edit</Link>
                <DeleteButton productId={p.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
