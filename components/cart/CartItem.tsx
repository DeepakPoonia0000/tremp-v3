"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";

export function CartItemRow({
  productId,
  name,
  image,
  price,
  qty,
  size,
  color,
}: {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
}) {
  const { remove, updateQuantity } = useCart();
  return (
    <div className="flex gap-4 border-b border-border py-4 last:border-0">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
        {image ? (
          <Image src={image} alt="" fill className="object-cover" sizes="96px" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">
          {formatPrice(price)} ·{" "}
          <label className="inline-flex items-center gap-1">
            Qty
            <input
              type="number"
              min={1}
              className="w-14 rounded border border-border bg-background px-1 text-center text-sm"
              value={qty}
              onChange={(e) =>
                updateQuantity({
                  productId,
                  size,
                  color,
                  qty: Number(e.target.value),
                })
              }
            />
          </label>
        </p>
        {(size || color) && (
          <p className="text-xs text-muted-foreground">
            {[size, color].filter(Boolean).join(" · ")}
          </p>
        )}
        <Button
          variant="link"
          className="mt-1 h-auto p-0 text-destructive"
          type="button"
          onClick={() => remove({ productId, size, color })}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
