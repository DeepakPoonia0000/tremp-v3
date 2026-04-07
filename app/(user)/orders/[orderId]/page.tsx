import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { formatPrice } from "@/utils/formatPrice";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ orderId: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders");
  }

  const { orderId } = await params;
  if (!mongoose.isValidObjectId(orderId)) notFound();

  await connectDB();
  const order = await Order.findById(orderId).lean();
  if (!order) notFound();
  if (
    session.user.role !== "admin" &&
    String(order.user) !== session.user.id
  ) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        Order #{String(order._id).slice(-8).toUpperCase()}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Placed {new Date(order.createdAt).toLocaleString()} · Status:{" "}
        <span className="capitalize">{order.status}</span>
      </p>
      <div className="mt-8 space-y-4">
        {order.items.map((item, i) => (
          <div
            key={`${item.product}-${i}`}
            className="flex justify-between border-b border-border pb-4 text-sm"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-muted-foreground">
                Qty {item.qty}
                {[item.size, item.color].filter(Boolean).join(" · ")}
              </p>
            </div>
            <span>{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-lg font-semibold">
        Total {formatPrice(order.total)}
      </p>
      <div className="mt-8 rounded-lg border border-border p-4 text-sm">
        <p className="font-medium">Shipping</p>
        <p className="mt-2 text-muted-foreground">
          {order.shippingAddress.fullName}
          <br />
          {order.shippingAddress.line1}
          <br />
          {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          <br />
          {order.shippingAddress.country}
        </p>
      </div>
    </div>
  );
}
