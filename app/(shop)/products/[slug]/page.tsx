import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCachedProductBySlug } from "@/lib/cache";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatPrice";
import { AddToCartSection } from "@/components/products/AddToCartSection";

export const revalidate = 30;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    await connectDB();
    const products = await Product.find().select("slug").lean();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);
  if (!product) {
    return { title: "Product" };
  }
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: product.images[0]
      ? { images: [{ url: product.images[0] }] }
      : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2 sm:px-6">
      <ProductImageGallery images={product.images} name={product.name} />
      <div>
        <div className="flex flex-wrap gap-2">
          {product.isFeatured && <Badge>Featured</Badge>}
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{product.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-2xl font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice != null && product.comparePrice > product.price && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
        <p className="mt-6 whitespace-pre-wrap text-muted-foreground">
          {product.description}
        </p>
        <AddToCartSection
          product={{
            id: String(product._id),
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.images[0] ?? "",
            sizes: product.sizes,
            colors: product.colors,
            stock: product.stock,
          }}
        />
        <Button variant="link" className="mt-4 h-auto p-0" asChild>
          <Link href="/products">← Back to shop</Link>
        </Button>
      </div>
    </div>
  );
}
