import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import HomepageConfig from "@/models/HomepageConfig";
import { revalidateHomepage } from "@/utils/revalidate";

export async function GET() {
  await connectDB();
  let doc = await HomepageConfig.findOne({}).lean();
  if (!doc) {
    const created = await HomepageConfig.create({ sections: [] });
    doc = created.toObject();
  }
  return NextResponse.json(doc);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as { sections: unknown };
  await connectDB();
  const doc = await HomepageConfig.findOneAndUpdate(
    {},
    { $set: { sections: body.sections } },
    { upsert: true, new: true }
  ).lean();
  revalidateHomepage();
  return NextResponse.json(doc);
}
