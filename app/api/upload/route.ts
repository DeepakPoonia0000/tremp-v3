import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/auth";
import {
  validateBrowserFile,
  publicUrlForSavedFile,
} from "@/lib/multer";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const formData = await request.formData();
  const type = (formData.get("type") as string) || "products";
  if (!["products", "collections", "banners"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  const files = formData.getAll("files") as File[];
  const urls: string[] = [];
  for (const file of files) {
    if (!(file instanceof File)) continue;
    const err = validateBrowserFile(file);
    if (err) {
      return NextResponse.json({ error: err }, { status: 400 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const safe = file.name.replace(/[^\w.\-]/g, "_");
    const filename = `${Date.now()}-${safe}`;
    const dir = path.join(
      process.cwd(),
      "public",
      "uploads",
      type as "products" | "collections" | "banners"
    );
    await import("node:fs").then((fs) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });
    const dest = path.join(dir, filename);
    await writeFile(dest, buf);
    urls.push(publicUrlForSavedFile(type as "products" | "collections" | "banners", filename));
  }
  return NextResponse.json({ urls });
}
