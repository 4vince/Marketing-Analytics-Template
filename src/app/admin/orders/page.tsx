import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Orders</h1>
      <table className="w-full bg-white rounded-lg">
        <thead className="border-b">
          <tr>
            <th className="text-left p-3">Order ID</th>
            <th className="text-left p-3">Customer</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Total</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="p-3 font-mono">{order.id.slice(0, 8)}</td>
              <td className="p-3">{order.customerName}</td>
              <td className="p-3">{order.customerEmail}</td>
              <td className="p-3">${(order.total / 100).toFixed(2)}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  order.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>{order.status}</span>
              </td>
              <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
