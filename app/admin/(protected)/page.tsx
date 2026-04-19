import prisma from "@/lib/prisma";
import Link from "next/link";
import { Package, ShoppingBag, FileText, TrendingUp, Plus, ArrowRight, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productsCount, ordersCount, postsCount, recentOrders, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.post.count(),
    prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
    prisma.order.aggregate({
      where: { status: "paid" },
      _sum: { totalAmount: true },
    }),
  ]);

  const monthRevenue = revenue._sum.totalAmount ?? 0;

  const statusLabel: Record<string, { label: string; cls: string }> = {
    pending: { label: "Ожидает", cls: "bg-yellow-100 text-yellow-700" },
    paid: { label: "Оплачен", cls: "bg-green-100 text-green-700" },
    failed: { label: "Отменён", cls: "bg-red-100 text-red-600" },
    success: { label: "Выполнен", cls: "bg-blue-100 text-blue-700" },
  };

  return (
    <>
      {/* Top bar */}
      <header className="bg-white border-b border-neutral-100 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#111827]">Дашборд</h1>
          <p className="text-xs text-neutral-400 font-bold mt-0.5">Обзор магазина</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-primary text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={14} /> Новый товар
        </Link>
      </header>

      <div className="p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
          {[
            { label: "Товаров", value: productsCount, icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Заказов", value: ordersCount, icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-50" },
            { label: "Статей в блоге", value: postsCount, icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Выручка (оплачено)", value: formatPrice(monthRevenue), icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{stat.label}</p>
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={16} className={stat.color} />
                </div>
              </div>
              <p className="text-2xl font-black text-[#111827]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { href: "/admin/products/new", label: "Добавить товар", desc: "Создать новую позицию" },
            { href: "/admin/posts/new", label: "Написать статью", desc: "Новая запись в блог" },
            { href: "/admin/faq", label: "Управление FAQ", desc: "Редактировать вопросы" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="bg-white border border-neutral-100 rounded-2xl shadow-sm p-5 flex items-center justify-between group hover:border-primary/20 hover:shadow-md transition-all">
              <div>
                <p className="text-sm font-black text-[#111827]">{l.label}</p>
                <p className="text-[11px] text-neutral-400 font-bold mt-0.5">{l.desc}</p>
              </div>
              <ArrowRight size={16} className="text-neutral-300 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-sm font-black text-[#111827]">Последние заказы</h2>
            <Link href="/admin/orders" className="text-xs font-black text-primary hover:text-red-700 flex items-center gap-1">
              Все заказы <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-50">
                  {["ID", "Клиент", "Телефон", "Сумма", "Статус", "Дата"].map((h) => (
                    <th key={h} className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-neutral-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-neutral-400 text-sm font-bold">
                      <Clock className="mx-auto mb-2 text-neutral-200" size={32} />
                      Заказов пока нет
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    const s = statusLabel[order.status] ?? { label: order.status, cls: "bg-neutral-100 text-neutral-500" };
                    return (
                      <tr key={order.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4 text-xs font-black text-[#111827]">#{order.id}</td>
                        <td className="px-6 py-4 text-xs font-bold text-neutral-600">{order.name}</td>
                        <td className="px-6 py-4 text-xs font-bold text-neutral-400">{order.phone}</td>
                        <td className="px-6 py-4 text-xs font-black text-[#111827]">{formatPrice(order.totalAmount)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${s.cls}`}>{s.label}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-neutral-400">
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
      </div>
    </>
  );
}
