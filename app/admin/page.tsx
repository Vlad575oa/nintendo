import { getOrdersCount, getProductsCount, getRecentOrders } from "@/lib/queries";
import Link from "next/link";
import { Plus, Package, ShoppingBag, Settings, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const ordersCount = await getOrdersCount();
  const productsCount = await getProductsCount({});
  const recentOrders = await getRecentOrders(5);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white p-8 space-y-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-black italic">N</span>
          </div>
          <span className="font-black tracking-tight">ADMIN PANEL</span>
        </Link>

        <nav className="space-y-6">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Store</p>
          <div className="space-y-2">
            <Link href="/admin/products" className="flex items-center gap-3 text-sm font-bold p-3 rounded-xl hover:bg-white/5 transition-colors">
              <Package size={18} /> Товары
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-3 text-sm font-bold p-3 rounded-xl hover:bg-white/5 transition-colors">
              <ShoppingBag size={18} /> Заказы
            </Link>
          </div>

          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-12">System</p>
          <div className="space-y-2">
            <Link href="/admin/settings" className="flex items-center gap-3 text-sm font-bold p-3 rounded-xl hover:bg-white/5 transition-colors">
              <Settings size={18} /> Настройки
            </Link>
            <button className="w-full flex items-center gap-3 text-sm font-bold p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors">
              <LogOut size={18} /> Выйти
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black text-secondary">Обзор</h1>
          <Link href="/admin/products/new">
            <button className="bg-primary text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 hover:bg-red-700 transition-all">
              <Plus size={20} /> Добавить товар
            </button>
          </Link>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm">
            <p className="text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Всего товаров</p>
            <p className="text-4xl font-black text-secondary">{productsCount}</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm">
            <p className="text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Новых заказов</p>
            <p className="text-4xl font-black text-secondary">{ordersCount}</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm">
            <p className="text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Выручка за месяц</p>
            <p className="text-4xl font-black text-primary">0 ₽</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-[32px] border border-neutral-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-neutral-100">
            <h2 className="text-xl font-black text-secondary">Последние заказы</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">ID</th>
                  <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Клиент</th>
                  <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Сумма</th>
                  <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Статус</th>
                  <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Дата</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                      <td className="px-8 py-6 text-sm font-bold text-secondary">#{order.id}</td>
                      <td className="px-8 py-6 text-sm font-medium text-neutral-600">{order.name}</td>
                      <td className="px-8 py-6 text-sm font-bold text-secondary">{order.totalAmount.toLocaleString()} ₽</td>
                      <td className="px-8 py-6 text-sm">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-neutral-400">{order.createdAt.toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-neutral-400 font-bold">Заказов пока нет</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
