import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Metadata } from "next";

export const revalidate = 30;

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  await connectDB();
  const raw = query
    ? await Product.find({ $text: { $search: query } })
        .sort({ score: { $meta: "textScore" } })
        .limit(48)
        .lean()
    : [];
  const products = raw.map((p) => ({
    id: String(p._id),
    name: p.name,
    slug: p.slug,
    price: p.price,
    comparePrice: p.comparePrice,
    image: p.images[0],
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold">
        {query ? `Results for “${query}”` : "Search"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {raw.length} products
      </p>
      <div className="mt-8">
        {products.length === 0 ? (
          <p className="text-muted-foreground">
            {query ? "No matches. Try another keyword." : "Enter a search query."}
          </p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
