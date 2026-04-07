"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import type { ShippingAddressDTO } from "@/types/order";
import { CACHE_TAGS } from "@/utils/revalidate";
import { revalidatePath, revalidateTag } from "next/cache";

export async function placeOrder(
  _prevState: unknown,
  formData: FormData
): Promise<{ ok?: true; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to place an order." };
  }
  const rawItems = formData.get("items");
  if (typeof rawItems !== "string") {
    return { error: "Invalid cart payload." };
  }
  let lines: { productId: string; qty: number; size?: string; color?: string }[];
  try {
    lines = JSON.parse(rawItems) as typeof lines;
  } catch {
    return { error: "Invalid cart data." };
  }

  const shippingAddress: ShippingAddressDTO = {
    fullName: String(formData.get("fullName") ?? ""),
    line1: String(formData.get("line1") ?? ""),
    line2: undefined,
    city: String(formData.get("city") ?? ""),
    state: undefined,
    postalCode: String(formData.get("postalCode") ?? ""),
    country: String(formData.get("country") ?? ""),
  };

  if (
    !shippingAddress.fullName ||
    !shippingAddress.line1 ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    return { error: "Please complete the shipping form." };
  }

  await connectDB();
  const items = [];
  let total = 0;
  for (const line of lines) {
    const product = await Product.findById(line.productId).lean();
    if (!product) {
      return { error: `Product missing: ${line.productId}` };
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

  await Order.create({
    user: session.user.id,
    items,
    total,
    status: "pending",
    shippingAddress,
    paymentMethod: "card",
    paymentStatus: "pending",
  });

  revalidateTag(CACHE_TAGS.orders, "default");
  revalidatePath("/admin/orders");
  revalidatePath("/orders");

  return { ok: true };
}
