"use client";

import { CartItemRow } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const { items } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Cart</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.length === 0 ? (
            <p className="text-muted-foreground">Your cart is empty.</p>
          ) : (
            <div>
              {items.map((item) => (
                <CartItemRow
                  key={`${item.productId}-${item.size}-${item.color}`}
                  productId={item.productId}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                  qty={item.qty}
                  size={item.size}
                  color={item.color}
                />
              ))}
            </div>
          )}
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
