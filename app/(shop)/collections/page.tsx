import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";
import type { Metadata } from "next";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Collections",
  description: "Shop curated seasonal edits and capsules.",
};

export default async function CollectionsPage() {
  await connectDB();
  const collections = await Collection.find({ isActive: true })
    .sort({ sortOrder: 1 })
    .lean();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
      <p className="mt-2 text-muted-foreground">
        Curated edits for every season.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <Link
            key={String(c._id)}
            href={`/collections/${c.slug}`}
            className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[16/10] bg-muted">
              {c.bannerImage ? (
                <Image
                  src={c.bannerImage}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="400px"
                />
              ) : null}
            </div>
            <div className="p-5">
              <h2 className="text-lg font-semibold">{c.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {c.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
