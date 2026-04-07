import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { generateSlug } from "@/utils/generateSlug";
import { revalidateProductPaths } from "@/utils/revalidate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const idsParam = searchParams.get("ids");
  const limit = Math.min(Number(searchParams.get("limit")) || 48, 100);
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (idsParam) {
    const ids = idsParam
      .split(",")
      .filter((id) => mongoose.isValidObjectId(id))
      .map((id) => new mongoose.Types.ObjectId(id));
    if (ids.length) filter._id = { $in: ids };
  }
  if (category) filter.category = category;
  if (featured === "true") filter.isFeatured = true;
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  await connectDB();
  const name = String(body.name ?? "");
  const slug =
    typeof body.slug === "string" && body.slug
      ? body.slug
      : generateSlug(name);
  const doc = await Product.create({
    name,
    slug,
    description: String(body.description ?? ""),
    price: Number(body.price ?? 0),
    comparePrice: body.comparePrice != null ? Number(body.comparePrice) : undefined,
    images: Array.isArray(body.images) ? body.images : [],
    category: String(body.category ?? "general"),
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    colors: Array.isArray(body.colors) ? body.colors : [],
    stock: Number(body.stock ?? 0),
    tags: Array.isArray(body.tags) ? body.tags : [],
    isFeatured: Boolean(body.isFeatured),
    collections: Array.isArray(body.collections) ? body.collections : [],
  });
  revalidateProductPaths(doc.slug);
  return NextResponse.json(doc);
}
