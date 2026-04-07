import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductEditForm } from "@/app/admin/products/[id]/product-edit-form";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit product</h1>
      <div className="mt-8">
        <ProductEditForm
          product={{
            _id: String(product._id),
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            tags: product.tags,
            images: product.images,
            isFeatured: product.isFeatured,
          }}
        />
      </div>
    </div>
  );
}
