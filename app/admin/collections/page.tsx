import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCollectionsPage() {
  await connectDB();
  const collections = await Collection.find({})
    .sort({ sortOrder: 1 })
    .limit(100)
    .lean();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Collections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Curate capsules and seasons.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/collections/new">New collection</Link>
        </Button>
      </div>
      <div className="mt-8">
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" },
            { key: "season", label: "Season" },
            { key: "active", label: "Active" },
            { key: "actions", label: "" },
          ]}
          rows={collections.map((c) => ({
            name: c.name,
            slug: c.slug,
            season: c.season,
            active: c.isActive ? "Yes" : "No",
            actions: (
              <Link
                href={`/admin/collections/${c._id}`}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Edit
              </Link>
            ),
          }))}
        />
      </div>
    </div>
  );
}
