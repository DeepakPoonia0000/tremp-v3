import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Collection from "@/models/Collection";
import HomepageConfig from "@/models/HomepageConfig";
import { CACHE_TAGS } from "@/utils/revalidate";

export const getCachedProducts = unstable_cache(
  async () => {
    await connectDB();
    return Product.find({}).sort({ createdAt: -1 }).lean();
  },
  ["all-products"],
  { tags: [CACHE_TAGS.products], revalidate: 30 }
);

export function getCachedProductBySlug(slug: string) {
  return unstable_cache(
    async () => {
      await connectDB();
      return Product.findOne({ slug }).lean();
    },
    ["product", slug],
    { tags: [CACHE_TAGS.product(slug)], revalidate: 30 }
  )();
}

export const getCachedCollections = unstable_cache(
  async () => {
    await connectDB();
    return Collection.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  },
  ["all-collections"],
  { tags: [CACHE_TAGS.collections], revalidate: 30 }
);

export function getCachedCollectionBySlug(slug: string) {
  return unstable_cache(
    async () => {
      await connectDB();
      return Collection.findOne({ slug, isActive: true }).lean();
    },
    ["collection", slug],
    { tags: [CACHE_TAGS.collection(slug)], revalidate: 30 }
  )();
}

export const getCachedHomepage = unstable_cache(
  async () => {
    await connectDB();
    return HomepageConfig.findOne({}).lean();
  },
  ["homepage-config"],
  { tags: [CACHE_TAGS.homepage], revalidate: 30 }
);
