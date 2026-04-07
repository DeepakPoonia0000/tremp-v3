import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json([]);
  }
  await connectDB();
  const user = await User.findById(session.user.id).select("wishlist").lean();
  const ids =
    user?.wishlist?.map((id) => String(id)) ?? [];
  return NextResponse.json(ids);
}
