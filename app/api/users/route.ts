import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { CACHE_TAGS } from "@/utils/revalidate";
import { revalidateTag } from "next/cache";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const users = await User.find({})
    .select("name email role createdAt")
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();
  return NextResponse.json(users);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as { wishlist?: string[] };
  if (!body.wishlist || !Array.isArray(body.wishlist)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  await connectDB();
  const ids = body.wishlist.filter((id) => mongoose.isValidObjectId(id));
  await User.findByIdAndUpdate(session.user.id, {
    $set: { wishlist: ids },
  });
  revalidateTag(CACHE_TAGS.users, "default");
  return NextResponse.json({ ok: true });
}
