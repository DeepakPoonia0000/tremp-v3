"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/types/order";

export function OrderStatusForm({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="status" className="text-sm font-medium">
        Status
      </label>
      <select
        id="status"
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value as OrderStatus)}
      >
        {(
          [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
          ] as const
        ).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <Button type="button" size="sm" onClick={() => void save()} disabled={loading}>
        {loading ? "Saving…" : "Update"}
      </Button>
    </div>
  );
}
