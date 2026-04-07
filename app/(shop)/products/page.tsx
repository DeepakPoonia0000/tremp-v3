import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import type { Metadata } from "next";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "All products",
  description: "Browse the full Tremp catalog.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  await connectDB();
  const filter = category ? { category } : {};
  const raw = await Product.find(filter).sort({ createdAt: -1 }).lean();
  const products = raw.map((p) => ({
    id: String(p._id),
    name: p.name,
    slug: p.slug,
    price: p.price,
    comparePrice: p.comparePrice,
    image: p.images[0],
  }));

  const categories = await Product.distinct("category");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
          <p className="mt-1 text-muted-foreground">
            {raw.length} styles
          </p>
        </div>
        <ProductFilters categories={categories} current={category} />
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
