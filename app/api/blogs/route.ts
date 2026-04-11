import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { generateSlug } from "@/utils/generateSlug";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const published = searchParams.get("published");
  const featured = searchParams.get("featured");
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const idsParam = searchParams.get("ids");
  
  await connectDB();
  const filter: Record<string, unknown> = {};
  
  if (idsParam) {
    const ids = idsParam.split(",").filter(Boolean);
    if (ids.length) filter._id = { $in: ids };
  } else {
    if (published === "true") filter.isPublished = true;
    if (featured === "true") filter.isPublished = true;
    if (category) filter.category = category;
  }
  
  const skip = (page - 1) * limit;
  
  const blogs = await Blog.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  
  const total = await Blog.countDocuments(filter);
  
  return NextResponse.json({
    blogs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const body = (await request.json()) as Record<string, unknown>;
  const title = String(body.title ?? "");
  
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  
  const slug = 
    typeof body.slug === "string" && body.slug
      ? body.slug
      : generateSlug(title);
  
  await connectDB();
  
  const existingBlog = await Blog.findOne({ slug });
  if (existingBlog) {
    return NextResponse.json({ error: "Blog with this slug already exists" }, { status: 400 });
  }
  
  const tags = String(body.tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  
  const doc = await Blog.create({
    title,
    slug,
    excerpt: String(body.excerpt ?? ""),
    content: String(body.content ?? ""),
    author: String(body.author ?? "Admin"),
    category: String(body.category ?? "general"),
    tags,
    featuredImage: String(body.featuredImage ?? ""),
    isPublished: Boolean(body.isPublished),
    publishedAt: Boolean(body.isPublished) ? new Date() : undefined,
  });
  
  return NextResponse.json(doc);
}
