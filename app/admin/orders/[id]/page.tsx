import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  await connectDB();
  const order = await Order.findById(id).lean();
  if (!order) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        Order #{String(order._id).slice(-8).toUpperCase()}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {new Date(order.createdAt).toLocaleString()}
      </p>
      <div className="mt-6">
        <OrderStatusForm orderId={String(order._id)} status={order.status} />
      </div>
      <div className="mt-8 space-y-3">
        {order.items.map((item, i) => (
          <div
            key={`${item.product}-${i}`}
            className="flex justify-between border-b border-border pb-3 text-sm"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-muted-foreground">Qty {item.qty}</p>
            </div>
            <span>{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-lg font-semibold">
        Total {formatPrice(order.total)}
      </p>
    </div>
  );
}
