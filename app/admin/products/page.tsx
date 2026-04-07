import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/formatPrice";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProductsPage() {
  await connectDB();
  const products = await Product.find({}).sort({ updatedAt: -1 }).limit(100).lean();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage catalog items.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">New product</Link>
        </Button>
      </div>
      <div className="mt-8">
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" },
            { key: "price", label: "Price" },
            { key: "stock", label: "Stock" },
            { key: "actions", label: "" },
          ]}
          rows={products.map((p) => ({
            name: p.name,
            slug: p.slug,
            price: formatPrice(p.price),
            stock: p.stock,
            actions: (
              <Link
                href={`/admin/products/${p._id}`}
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
