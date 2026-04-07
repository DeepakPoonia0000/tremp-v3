import { notFound } from "next/navigation";
import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";
import { getCachedCollectionBySlug } from "@/lib/cache";
import { ProductGrid } from "@/components/products/ProductGrid";
import Product from "@/models/Product";

export const revalidate = 30;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    await connectDB();
    const list = await Collection.find({ isActive: true }).select("slug").lean();
    return list.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCachedCollectionBySlug(slug);
  if (!c) return { title: "Collection" };
  return {
    title: c.metaTitle || c.name,
    description: c.metaDescription || c.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCachedCollectionBySlug(slug);
  if (!collection) notFound();

  await connectDB();
  const products = await Product.find({
    _id: { $in: collection.products },
  })
    .sort({ createdAt: -1 })
    .lean();

  const cards = products.map((p) => ({
    id: String(p._id),
    name: p.name,
    slug: p.slug,
    price: p.price,
    comparePrice: p.comparePrice,
    image: p.images[0],
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">{collection.name}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {collection.description}
      </p>
      <div className="mt-10">
        <ProductGrid products={cards} />
      </div>
    </div>
  );
}
