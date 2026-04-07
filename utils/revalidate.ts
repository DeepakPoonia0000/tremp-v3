import { revalidatePath, revalidateTag } from "next/cache";

/** Next.js 16 `revalidateTag` requires a cache life profile (see `cacheLife` presets). */
const TAG_PROFILE = "default" as const;

export const CACHE_TAGS = {
  products: "products",
  product: (slug: string) => `product-${slug}`,
  collections: "collections",
  collection: (slug: string) => `collection-${slug}`,
  homepage: "homepage",
  orders: "orders",
  users: "users",
} as const;

export function revalidateProductPaths(slug?: string) {
  revalidateTag(CACHE_TAGS.products, TAG_PROFILE);
  revalidatePath("/products");
  revalidatePath("/");
  if (slug) {
    revalidateTag(CACHE_TAGS.product(slug), TAG_PROFILE);
    revalidatePath(`/products/${slug}`);
  }
}

export function revalidateCollectionPaths(slug?: string) {
  revalidateTag(CACHE_TAGS.collections, TAG_PROFILE);
  revalidatePath("/collections");
  revalidatePath("/");
  if (slug) {
    revalidateTag(CACHE_TAGS.collection(slug), TAG_PROFILE);
    revalidatePath(`/collections/${slug}`);
  }
}

export function revalidateHomepage() {
  revalidateTag(CACHE_TAGS.homepage, TAG_PROFILE);
  revalidatePath("/");
}
