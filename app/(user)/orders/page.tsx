import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { formatPrice } from "@/utils/formatPrice";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");

  await connectDB();
  const orders = await Order.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>
      <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
        {orders.length === 0 ? (
          <li className="p-6 text-sm text-muted-foreground">No orders yet.</li>
        ) : (
          orders.map((o) => (
            <li key={String(o._id)} className="flex flex-wrap items-center justify-between gap-2 p-4">
              <div>
                <p className="font-medium">
                  Order #{String(o._id).slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString()} · {o.status}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">{formatPrice(o.total)}</span>
                <Link
                  href={`/orders/${o._id}`}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  View
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
