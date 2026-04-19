import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { OrderStatusSelect } from "./OrderStatusSelect";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: { label: "Ожидает", cls: "bg-yellow-100 text-yellow-700" },
  paid: { label: "Оплачен", cls: "bg-green-100 text-green-700" },
  failed: { label: "Отменён", cls: "bg-red-100 text-red-600" },
  success: { label: "Выполнен", cls: "bg-blue-100 text-blue-700" },
};

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <header className="bg-white border-b border-neutral-100 px-8 py-5">
        <h1 className="text-xl font-black text-[#111827]">Заказы</h1>
        <p className="text-xs text-neutral-400 font-bold mt-0.5">{orders.length} заказов</p>
      </header>

      <div className="p-8">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100">
                {["#", "Клиент", "Телефон", "Адрес", "Товары", "Сумма", "Статус", "Дата"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[9px] font-black uppercase tracking-widest text-neutral-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-20 text-center">
                    <ShoppingBag size={40} className="mx-auto mb-3 text-neutral-200" />
                    <p className="text-neutral-400 font-bold text-sm">Заказов пока нет</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const s = STATUS_MAP[order.status] ?? { label: order.status, cls: "bg-neutral-100 text-neutral-500" };
                  return (
                    <tr key={order.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                      <td className="px-5 py-4 text-xs font-black text-[#111827]">#{order.id}</td>
                      <td className="px-5 py-4 text-xs font-bold text-neutral-700">{order.name}</td>
                      <td className="px-5 py-4 text-xs font-bold text-neutral-500">{order.phone}</td>
                      <td className="px-5 py-4 text-xs font-bold text-neutral-400 max-w-[160px] truncate">{order.address}</td>
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          {order.items.map((item) => (
                            <p key={item.id} className="text-[10px] font-bold text-neutral-500 line-clamp-1">
                              {item.product.name} × {item.quantity}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-black text-[#111827]">{formatPrice(order.totalAmount)}</td>
                      <td className="px-5 py-4">
                        <OrderStatusSelect orderId={order.id} status={order.status} statusMap={STATUS_MAP} />
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
