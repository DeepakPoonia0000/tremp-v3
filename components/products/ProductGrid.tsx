import { ProductCard, type ProductCardProps } from "@/components/products/ProductCard";

export function ProductGrid({ products }: { products: ProductCardProps[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
