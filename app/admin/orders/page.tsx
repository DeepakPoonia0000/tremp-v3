import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { DataTable } from "@/components/admin/DataTable";
import { formatPrice } from "@/utils/formatPrice";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOrdersPage() {
  await connectDB();
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(200).lean();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="mt-8">
        <DataTable
          columns={[
            { key: "id", label: "Order" },
            { key: "total", label: "Total" },
            { key: "status", label: "Status" },
            { key: "date", label: "Date" },
            { key: "actions", label: "" },
          ]}
          rows={orders.map((o) => ({
            id: String(o._id).slice(-8).toUpperCase(),
            total: formatPrice(o.total),
            status: o.status,
            date: new Date(o.createdAt).toLocaleDateString(),
            actions: (
              <Link
                href={`/admin/orders/${o._id}`}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                View
              </Link>
            ),
          }))}
        />
      </div>
    </div>
  );
}
