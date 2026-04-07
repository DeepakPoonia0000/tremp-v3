import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";
import { generateSlug } from "@/utils/generateSlug";
import { revalidateCollectionPaths } from "@/utils/revalidate";
import { parseCollectionSeason } from "@/lib/collection-utils";

export async function GET() {
  await connectDB();
  const collections = await Collection.find({}).sort({ sortOrder: 1 }).lean();
  return NextResponse.json(collections);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const name = String(body.name ?? "");
  const slug =
    typeof body.slug === "string" && body.slug
      ? body.slug
      : generateSlug(name);
  await connectDB();
  const doc = await Collection.create({
    name,
    slug,
    description: String(body.description ?? ""),
    bannerImage: String(body.bannerImage ?? ""),
    season: parseCollectionSeason(body.season),
    products: Array.isArray(body.products) ? body.products : [],
    isActive: body.isActive !== false,
    sortOrder: Number(body.sortOrder ?? 0),
    metaTitle: String(body.metaTitle ?? name),
    metaDescription: String(body.metaDescription ?? ""),
  });
  revalidateCollectionPaths(doc.slug);
  return NextResponse.json(doc);
}
