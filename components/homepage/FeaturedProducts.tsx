import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import type { HomepageSection } from "@/types/homepage";
import { ProductGrid } from "@/components/products/ProductGrid";

export async function FeaturedProducts({
  section,
}: {
  section: HomepageSection;
}) {
  const data = (section.data ?? {}) as {
    productIds?: string[];
    tag?: string;
    limit?: number;
  };
  const limit = data.limit ?? 8;
  await connectDB();
  let query = Product.find({}).sort({ createdAt: -1 });
  if (data.productIds?.length) {
    const oids = data.productIds
      .filter((id) => mongoose.isValidObjectId(id))
      .map((id) => new mongoose.Types.ObjectId(id));
    query = Product.find({ _id: { $in: oids } });
  } else if (data.tag) {
    query = Product.find({ tags: data.tag }).sort({ createdAt: -1 });
  }
  const raw = await query.limit(limit).lean();
  const products = raw.map((p) => ({
    id: String(p._id),
    name: p.name,
    slug: p.slug,
    price: p.price,
    comparePrice: p.comparePrice,
    image: p.images[0],
  }));

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Featured</h2>
      <ProductGrid products={products} />
    </section>
  );
}
