import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

type Props = { params: Promise<{ id: string }> };

/** Legacy URL: /shop/product/:id → /products/:slug */
export default async function LegacyProductRedirect({ params }: Props) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product?.slug) notFound();
  redirect(`/products/${product.slug}`);
}
