import Link from "next/link";
import { getDashboardStats } from "@/lib/data";
import { formatMoney } from "@/lib/utils";
import StatusBadge from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Revenue (Paid Orders)", value: formatMoney(stats.revenue) },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Pending Orders", value: stats.pendingOrders },
    { label: "Total Products", value: stats.totalProducts },
    { label: "Out of Stock", value: stats.outOfStockCount },
    { label: "Low Stock", value: stats.lowStockCount },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-stone-500">Here&apos;s what&apos;s happening in your store.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-xs text-stone-500">{c.label}</p>
            <p className="mt-1 font-display text-2xl">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white">
          + Add Product
        </Link>
        <Link href="/admin/orders" className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold">
          View Orders
        </Link>
        <Link href="/admin/inventory" className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold">
          Manage Inventory
        </Link>
        <Link href="/admin/collections" className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold">
          Edit Collections
        </Link>
      </div>

      {(stats.outOfStockCount > 0 || stats.lowStockCount > 0) && (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-amber-900">Inventory needs attention</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-amber-800">
            {stats.outOfStockProducts.slice(0, 5).map((p) => (
              <li key={p.id}>{p.name} — Out of Stock</li>
            ))}
            {stats.lowStockProducts.slice(0, 5).map((p) => (
              <li key={p.id}>{p.name} — Low Stock</li>
            ))}
          </ul>
          <Link href="/admin/inventory" className="mt-3 inline-block text-sm font-semibold underline">
            Go to Inventory
          </Link>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl">Recent Orders</h2>
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs tracking-wide text-stone-500 uppercase">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-stone-400">No orders yet.</td></tr>
              )}
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-stone-100">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium underline underline-offset-2">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{formatMoney(order.total)}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.paymentStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={order.orderStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
