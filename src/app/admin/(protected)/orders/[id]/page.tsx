import { notFound } from "next/navigation";
import { getOrderWithItems } from "@/lib/data";
import { formatMoney } from "@/lib/utils";
import OrderStatusControls from "@/components/admin/OrderStatusControls";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getOrderWithItems(Number(id));
  if (!data) notFound();
  const { order, items } = data;

  return (
    <div>
      <h1 className="font-display text-3xl">Order {order.orderNumber}</h1>
      <p className="mt-1 text-sm text-stone-500">Placed {new Date(order.createdAt).toLocaleString()}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 font-display text-xl">Items</h2>
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-stone-500">
                      {item.variantSize !== "One Size" ? `Size ${item.variantSize} · ` : ""}
                      {item.variantColor ? `${item.variantColor} · ` : ""}Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatMoney(item.price)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-stone-100 pt-4 text-sm">
              <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>{formatMoney(order.subtotal)}</span></div>
              <div className="flex justify-between text-stone-600"><span>Delivery</span><span>{formatMoney(order.deliveryFee)}</span></div>
              <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{formatMoney(order.total)}</span></div>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 font-display text-xl">Customer</h2>
            <p className="text-sm">{order.customerName}</p>
            <p className="text-sm text-stone-600">{order.phone}</p>
            {order.email && <p className="text-sm text-stone-600">{order.email}</p>}
            <p className="mt-3 text-sm text-stone-600">{order.address}, {order.city}, {order.state}</p>
            {order.notes && <p className="mt-3 text-sm text-stone-500">Customer note: {order.notes}</p>}
          </div>
        </div>

        <OrderStatusControls order={order} />
      </div>
    </div>
  );
}
