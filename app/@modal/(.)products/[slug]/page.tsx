import { notFound } from "next/navigation";
import { getCachedProductBySlug } from "@/lib/cache";
import { QuickViewModal } from "@/components/products/QuickViewModal";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductInterceptPage({ params }: Props) {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);
  if (!product) notFound();

  return (
    <QuickViewModal
      product={{
        id: String(product._id),
        name: product.name,
        slug: product.slug,
        price: product.price,
        comparePrice: product.comparePrice,
        description: product.description,
        images: product.images,
      }}
    />
  );
}
