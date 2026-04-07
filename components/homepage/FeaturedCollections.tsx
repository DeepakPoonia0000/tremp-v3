import Link from "next/link";
import Image from "next/image";
import mongoose from "mongoose";
import type { HomepageSection } from "@/types/homepage";
import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";

export async function FeaturedCollections({
  section,
}: {
  section: HomepageSection;
}) {
  const data = section.data as {
    collectionIds?: string[];
    layout?: "grid" | "carousel";
  };
  const ids = data.collectionIds ?? [];
  await connectDB();
  const objectIds = ids
    .filter((id) => mongoose.isValidObjectId(id))
    .map((id) => new mongoose.Types.ObjectId(id));
  const collections =
    objectIds.length > 0
      ? await Collection.find({ _id: { $in: objectIds } }).lean()
      : await Collection.find({ isActive: true }).sort({ sortOrder: 1 }).limit(4).lean();

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Collections</h2>
        <Link
          href="/collections"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </div>
      <div
        className={
          data.layout === "carousel"
            ? "flex gap-4 overflow-x-auto pb-2"
            : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        }
      >
        {collections.map((c) => (
          <Link
            key={String(c._id)}
            href={`/collections/${c.slug}`}
            className="group relative min-w-[220px] overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="relative aspect-[4/3] bg-muted">
              {c.bannerImage ? (
                <Image
                  src={c.bannerImage}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="280px"
                />
              ) : null}
            </div>
            <div className="p-4">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {c.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
