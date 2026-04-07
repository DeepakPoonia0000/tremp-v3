import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditCollectionPage({ params }: Props) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  await connectDB();
  const c = await Collection.findById(id).lean();
  if (!c) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit collection</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {c.name} — use API or extend this form to assign products and update fields.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Slug: <code className="rounded bg-muted px-1">{c.slug}</code>
      </p>
    </div>
  );
}
