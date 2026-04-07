import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { CACHE_TAGS } from "@/utils/revalidate";
import { revalidatePath, revalidateTag } from "next/cache";
import type { OrderItemDTO, ShippingAddressDTO } from "@/types/order";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  if (session.user.role === "admin") {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return NextResponse.json(orders);
  }
  const orders = await Order.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as {
    items: { productId: string; qty: number; size?: string; color?: string }[];
    shippingAddress: ShippingAddressDTO;
    paymentMethod?: string;
  };
  await connectDB();
  const items: OrderItemDTO[] = [];
  let total = 0;
  for (const line of body.items) {
    const product = await Product.findById(line.productId).lean();
    if (!product) {
      return NextResponse.json(
        { error: `Product not found: ${line.productId}` },
        { status: 400 }
      );
    }
    const price = product.price;
    const qty = line.qty;
    total += price * qty;
    items.push({
      product: String(product._id),
      name: product.name,
      image: product.images[0],
      qty,
      size: line.size,
      color: line.color,
      price,
    });
  }
  const order = await Order.create({
    user: session.user.id,
    items,
    total,
    status: "pending",
    shippingAddress: body.shippingAddress,
    paymentMethod: body.paymentMethod ?? "card",
    paymentStatus: "pending",
  });
  revalidateTag(CACHE_TAGS.orders, "default");
  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  return NextResponse.json(order);
}
