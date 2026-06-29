// Admin dashboard — shows stats (product count, order count, revenue) and recent orders table.
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";

export default async function AdminDashboard() {
  const [productCount, orderCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Products" value={productCount} />
        <StatsCard title="Orders" value={orderCount} />
        <StatsCard title="Revenue" value={`$${recentOrders.reduce((s, o) => s + o.total, 0) / 100}`} />
      </div>
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="w-full min-w-[500px]">
          <thead className="border-b">
            <tr>
              <th className="text-left p-3">Order</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-sm">{order.id.slice(0, 8)}</td>
                <td className="p-3">{order.customerName}</td>
                <td className="p-3">${(order.total / 100).toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
