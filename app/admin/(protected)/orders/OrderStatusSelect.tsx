"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  orderId: number;
  status: string;
  statusMap: Record<string, { label: string; cls: string }>;
}

export const OrderStatusSelect = ({ orderId, status, statusMap }: Props) => {
  const [current, setCurrent] = useState(status);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setLoading(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setCurrent(next);
    router.refresh();
    setLoading(false);
  };

  const s = statusMap[current] ?? { label: current, cls: "bg-neutral-100 text-neutral-500" };

  return (
    <div className="relative">
      <select
        value={current}
        onChange={handleChange}
        disabled={loading}
        className={`appearance-none text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full cursor-pointer outline-none ${s.cls} disabled:opacity-60`}
      >
        {Object.entries(statusMap).map(([val, { label }]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>
    </div>
  );
};
