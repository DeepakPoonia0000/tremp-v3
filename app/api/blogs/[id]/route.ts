import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { generateSlug } from "@/utils/generateSlug";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  
  const blog = await Blog.findById(params.id).lean();
  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }
  
  return NextResponse.json(blog);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const body = (await request.json()) as Record<string, unknown>;
  await connectDB();
  
  const existingBlog = await Blog.findById(params.id);
  if (!existingBlog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }
  
  const title = String(body.title ?? existingBlog.title);
  const slug = 
    typeof body.slug === "string" && body.slug
      ? body.slug
      : generateSlug(title);
  
  // Check if slug conflicts with another blog
  const slugConflict = await Blog.findOne({ slug, _id: { $ne: params.id } });
  if (slugConflict) {
    return NextResponse.json({ error: "Blog with this slug already exists" }, { status: 400 });
  }
  
  const tags = String(body.tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  
  const wasPublished = existingBlog.isPublished;
  const willBePublished = Boolean(body.isPublished);
  
  const updateData: Record<string, unknown> = {
    title,
    slug,
    excerpt: String(body.excerpt ?? existingBlog.excerpt),
    content: String(body.content ?? existingBlog.content),
    author: String(body.author ?? existingBlog.author),
    category: String(body.category ?? existingBlog.category),
    tags,
    featuredImage: String(body.featuredImage ?? existingBlog.featuredImage),
    isPublished: willBePublished,
  };
  
  // Set publishedAt if publishing for the first time
  if (!wasPublished && willBePublished) {
    updateData.publishedAt = new Date();
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(
    params.id,
    { $set: updateData },
    { new: true }
  ).lean();
  
  return NextResponse.json(updatedBlog);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  await connectDB();
  
  const deletedBlog = await Blog.findByIdAndDelete(params.id);
  if (!deletedBlog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }
  
  return NextResponse.json({ message: "Blog deleted successfully" });
}
