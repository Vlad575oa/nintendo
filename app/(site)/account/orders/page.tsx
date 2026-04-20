"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ChevronRight, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

const STATUS_LABEL: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending:  { label: "Ожидает оплаты", color: "text-yellow-500 bg-yellow-50",  icon: Clock },
  paid:     { label: "Оплачен",        color: "text-green-600 bg-green-50",    icon: CheckCircle2 },
  shipping: { label: "В доставке",     color: "text-blue-500 bg-blue-50",      icon: Truck },
  failed:   { label: "Отменён",        color: "text-red-500 bg-red-50",        icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((user) => {
        if (!user?.id) { router.push("/auth/login"); return; }
        return fetch("/api/account/orders");
      })
      .then((r) => r?.json())
      .then((data) => { if (data) setOrders(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="container py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Package size={20} className="text-primary" />
        </div>
        <h1 className="text-3xl font-black text-secondary">Мои заказы</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-neutral-100 p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-neutral-300" />
          </div>
          <p className="text-xl font-black text-secondary mb-2">Заказов пока нет</p>
          <p className="text-neutral-400 font-bold text-sm mb-6">Оформите первый заказ и он появится здесь</p>
          <Link
            href="/catalog/all"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all"
          >
            Перейти в каталог
            <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending;
            const StatusIcon = statusInfo.icon;
            return (
              <div key={order.id} className="bg-white rounded-[28px] border border-neutral-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-0.5">Заказ #{order.id}</p>
                    <p className="text-[10px] font-bold text-neutral-300">
                      {new Date(order.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                    <StatusIcon size={11} />
                    {statusInfo.label}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-sm font-bold text-neutral-500 truncate max-w-[200px]">{item.productName} × {item.quantity}</span>
                      <span className="text-sm font-black text-secondary">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-neutral-50 flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Итого</span>
                  <span className="text-lg font-black text-primary">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
