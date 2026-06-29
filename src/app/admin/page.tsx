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
      <h1 className="text-2xl font-display font-semibold text-brand-warm-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatsCard title="Products" value={productCount} />
        <StatsCard title="Orders" value={orderCount} />
        <StatsCard title="Revenue" value={`$${recentOrders.reduce((s, o) => s + o.total, 0) / 100}`} />
      </div>
      <h2 className="text-lg font-display font-semibold text-brand-warm-white mb-4">Recent Orders</h2>
      <div className="overflow-x-auto bg-brand-clay border border-brand-fence rounded-xl">
        <table className="w-full min-w-[500px]">
          <thead className="border-b border-brand-fence">
            <tr>
              <th className="text-left p-4 text-xs font-medium text-brand-muted uppercase tracking-wider">Order</th>
              <th className="text-left p-4 text-xs font-medium text-brand-muted uppercase tracking-wider">Customer</th>
              <th className="text-left p-4 text-xs font-medium text-brand-muted uppercase tracking-wider">Total</th>
              <th className="text-left p-4 text-xs font-medium text-brand-muted uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-brand-fence hover:bg-brand-risen/50 transition-colors">
                <td className="p-4 font-mono text-sm text-brand-muted">{order.id.slice(0, 8)}</td>
                <td className="p-4 text-sm text-brand-warm-white">{order.customerName}</td>
                <td className="p-4 font-mono text-sm text-brand-warm-white">${(order.total / 100).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "paid"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-brand-yolk/10 text-brand-yolk border border-brand-yolk/20"
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-sm text-brand-muted">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
