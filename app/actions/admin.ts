"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Collection from "@/models/Collection";
import HomepageConfig from "@/models/HomepageConfig";
import { generateSlug } from "@/utils/generateSlug";
import {
  revalidateCollectionPaths,
  revalidateHomepage,
  revalidateProductPaths,
} from "@/utils/revalidate";
import type { HomepageSection } from "@/types/homepage";
import mongoose from "mongoose";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function createProduct(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string } | void> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }
  const name = String(formData.get("name") ?? "");
  if (!name) return { error: "Name is required" };
  const slug =
    String(formData.get("slug") ?? "").trim() || generateSlug(name);
  const description = String(formData.get("description") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const category = String(formData.get("category") ?? "general");
  const stock = Number(formData.get("stock") ?? 0);
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  await connectDB();
  const doc = await Product.create({
    name,
    slug,
    description,
    price,
    images,
    category,
    sizes: [],
    colors: [],
    stock,
    tags,
    isFeatured: formData.get("isFeatured") === "on",
    collections: [],
  });
  revalidateProductPaths(doc.slug);
  redirect(`/admin/products/${doc._id}`);
}

export async function updateProduct(
  productId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string } | void> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }
  if (!mongoose.isValidObjectId(productId)) return { error: "Invalid product" };
  const name = String(formData.get("name") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const description = String(formData.get("description") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const category = String(formData.get("category") ?? "general");
  const stock = Number(formData.get("stock") ?? 0);
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  await connectDB();
  const prev = await Product.findById(productId).lean();
  if (!prev) return { error: "Not found" };
  await Product.findByIdAndUpdate(productId, {
    $set: {
      name,
      slug,
      description,
      price,
      category,
      stock,
      tags,
      images,
      isFeatured: formData.get("isFeatured") === "on",
    },
  });
  revalidateProductPaths(String(prev.slug));
  if (slug !== prev.slug) revalidateProductPaths(slug);
  redirect("/admin/products");
}

export async function createCollection(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string } | void> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }
  const name = String(formData.get("name") ?? "");
  if (!name) return { error: "Name is required" };
  const slug =
    String(formData.get("slug") ?? "").trim() || generateSlug(name);
  await connectDB();
  const doc = await Collection.create({
    name,
    slug,
    description: String(formData.get("description") ?? ""),
    bannerImage: String(formData.get("bannerImage") ?? ""),
    season: String(formData.get("season") ?? "all-year"),
    products: [],
    isActive: true,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    metaTitle: String(formData.get("metaTitle") ?? name),
    metaDescription: String(formData.get("metaDescription") ?? ""),
  });
  revalidateCollectionPaths(doc.slug);
  redirect(`/admin/collections/${doc._id}`);
}

export async function saveHomepageSections(sections: HomepageSection[]) {
  await requireAdmin();
  await connectDB();
  await HomepageConfig.findOneAndUpdate(
    {},
    { $set: { sections } },
    { upsert: true }
  );
  revalidateHomepage();
}
