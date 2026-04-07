import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { revalidateProductPaths } from "@/utils/revalidate";
import mongoose from "mongoose";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  await connectDB();
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const product = await Product.findById(id).lean();
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request: Request, context: Ctx) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  await connectDB();
  const prev = await Product.findById(id).lean();
  if (!prev) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const updated = await Product.findByIdAndUpdate(
    id,
    {
      $set: {
        ...(body.name != null && { name: String(body.name) }),
        ...(body.slug != null && { slug: String(body.slug) }),
        ...(body.description != null && { description: String(body.description) }),
        ...(body.price != null && { price: Number(body.price) }),
        ...(body.comparePrice !== undefined && {
          comparePrice:
            body.comparePrice === null ? undefined : Number(body.comparePrice),
        }),
        ...(body.images != null && { images: body.images }),
        ...(body.category != null && { category: String(body.category) }),
        ...(body.sizes != null && { sizes: body.sizes }),
        ...(body.colors != null && { colors: body.colors }),
        ...(body.stock != null && { stock: Number(body.stock) }),
        ...(body.tags != null && { tags: body.tags }),
        ...(body.isFeatured != null && { isFeatured: Boolean(body.isFeatured) }),
        ...(body.collections != null && { collections: body.collections }),
      },
    },
    { new: true }
  ).lean();
  revalidateProductPaths(String(prev.slug));
  if (body.slug && String(body.slug) !== prev.slug) {
    revalidateProductPaths(String(body.slug));
  }
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, context: Ctx) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  await connectDB();
  const prev = await Product.findByIdAndDelete(id).lean();
  if (!prev) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  revalidateProductPaths(String(prev.slug));
  return NextResponse.json({ ok: true });
}
