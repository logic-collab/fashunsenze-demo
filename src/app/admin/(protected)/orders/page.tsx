import Link from "next/link";
import { listOrdersAdmin } from "@/lib/data";
import { formatMoney } from "@/lib/utils";
import StatusBadge from "@/components/admin/StatusBadge";
import OrdersFilter from "@/components/admin/OrdersFilter";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const { status, search } = await searchParams;
  const orders = await listOrdersAdmin({ status, search });

  return (
    <div>
      <h1 className="font-display text-3xl">Orders</h1>
      <p className="mt-1 text-sm text-stone-500">{orders.length} orders</p>

      <OrdersFilter />

      <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-xs tracking-wide text-stone-500 uppercase">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-stone-400">No orders found.</td></tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-stone-100">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium underline underline-offset-2">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p>{order.customerName}</p>
                  <p className="text-xs text-stone-500">{order.phone}</p>
                </td>
                <td className="px-4 py-3 text-stone-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">{formatMoney(order.total)}</td>
                <td className="px-4 py-3"><StatusBadge status={order.paymentStatus} /></td>
                <td className="px-4 py-3"><StatusBadge status={order.orderStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
