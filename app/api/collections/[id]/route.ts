import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";
import { revalidateCollectionPaths } from "@/utils/revalidate";
import { parseCollectionSeason } from "@/lib/collection-utils";
import mongoose from "mongoose";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  await connectDB();
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const c = await Collection.findById(id).lean();
  if (!c) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(c);
}

export async function PUT(request: Request, context: Ctx) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  await connectDB();
  const prev = await Collection.findById(id).lean();
  if (!prev) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const updated = await Collection.findByIdAndUpdate(
    id,
    {
      $set: {
        ...(body.name != null && { name: String(body.name) }),
        ...(body.slug != null && { slug: String(body.slug) }),
        ...(body.description != null && { description: String(body.description) }),
        ...(body.bannerImage != null && { bannerImage: String(body.bannerImage) }),
        ...(body.season != null && {
          season: parseCollectionSeason(body.season),
        }),
        ...(body.products != null && { products: body.products }),
        ...(body.isActive != null && { isActive: Boolean(body.isActive) }),
        ...(body.sortOrder != null && { sortOrder: Number(body.sortOrder) }),
        ...(body.metaTitle != null && { metaTitle: String(body.metaTitle) }),
        ...(body.metaDescription != null && {
          metaDescription: String(body.metaDescription),
        }),
      },
    },
    { new: true }
  ).lean();
  revalidateCollectionPaths(String(prev.slug));
  if (body.slug && String(body.slug) !== prev.slug) {
    revalidateCollectionPaths(String(body.slug));
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
  const prev = await Collection.findByIdAndDelete(id).lean();
  if (!prev) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  revalidateCollectionPaths(String(prev.slug));
  return NextResponse.json({ ok: true });
}
