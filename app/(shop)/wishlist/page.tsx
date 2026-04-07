"use client";

import { ProductGrid } from "@/components/products/ProductGrid";
import { useWishlist } from "@/hooks/useWishlist";
import { useWishlistProductsQuery } from "@/store/api";

export default function WishlistPage() {
  const { items } = useWishlist();
  const idsKey = items.join(",");
  const { data: products = [], isFetching } = useWishlistProductsQuery(idsKey, {
    skip: items.length === 0,
  });

  const displayProducts = items.length === 0 ? [] : products;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
      <p className="mt-1 text-muted-foreground">
        {isFetching ? "Loading…" : `${displayProducts.length} saved items`}
      </p>
      <div className="mt-8">
        {displayProducts.length === 0 && !isFetching ? (
          <p className="text-muted-foreground">No items yet.</p>
        ) : (
          <ProductGrid products={displayProducts} />
        )}
      </div>
    </div>
  );
}
