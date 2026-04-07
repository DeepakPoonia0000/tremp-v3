import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import mongoose from "mongoose";
import { CACHE_TAGS } from "@/utils/revalidate";
import { revalidatePath, revalidateTag } from "next/cache";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  await connectDB();
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const order = await Order.findById(id).lean();
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (
    session.user.role !== "admin" &&
    String(order.user) !== session.user.id
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(order);
}

export async function PATCH(request: Request, context: Ctx) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  await connectDB();
  const body = (await request.json()) as { status?: string };
  const order = await Order.findByIdAndUpdate(
    id,
    { $set: { ...(body.status && { status: body.status }) } },
    { new: true }
  ).lean();
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  revalidateTag(CACHE_TAGS.orders, "default");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return NextResponse.json(order);
}
