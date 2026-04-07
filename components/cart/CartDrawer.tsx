"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import { cn } from "@/utils/cn";

export function CartDrawer() {
  const { items, isOpen, setOpen, subtotal, remove, updateQuantity } =
    useCart();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 transition-opacity",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!isOpen}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)} · Qty{" "}
                      <input
                        type="number"
                        min={1}
                        className="ml-1 w-12 rounded border border-border bg-background px-1 text-center text-sm"
                        value={item.qty}
                        onChange={(e) =>
                          updateQuantity({
                            productId: item.productId,
                            size: item.size,
                            color: item.color,
                            qty: Number(e.target.value),
                          })
                        }
                      />
                    </p>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-destructive"
                      type="button"
                      onClick={() =>
                        remove({
                          productId: item.productId,
                          size: item.size,
                          color: item.color,
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border p-4">
            <div className="mb-4 flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <Separator className="mb-4" />
            <Button className="w-full" asChild>
              <Link href="/cart" onClick={() => setOpen(false)}>
                View cart & checkout
              </Link>
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
