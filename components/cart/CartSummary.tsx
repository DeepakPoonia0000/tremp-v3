"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/app/actions/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export function CartSummary() {
  const { items, subtotal, clear } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [state, action, isPending] = useActionState(placeOrder, null);

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      clear();
      router.push("/orders");
    }
  }, [state, clear, router]);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Order summary</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between font-medium">
          <dt>Total</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
      </dl>
      {!isAuthenticated ? (
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/login" className="underline">
            Sign in
          </Link>{" "}
          to place your order.
        </p>
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Your cart is empty.</p>
      ) : (
        <form action={action} className="mt-6 space-y-4">
          <input
            type="hidden"
            name="items"
            value={JSON.stringify(
              items.map((i) => ({
                productId: i.productId,
                qty: i.qty,
                size: i.size,
                color: i.color,
              }))
            )}
          />
          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-sm font-medium">Shipping</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="Jane Doe"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="line1">Address line 1</Label>
                <Input id="line1" name="line1" required />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal code</Label>
                <Input id="postalCode" name="postalCode" required />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" required defaultValue="US" />
              </div>
            </div>
          </div>
          {state && "error" in state && state.error ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Placing order…" : "Place order"}
          </Button>
        </form>
      )}
    </div>
  );
}
