import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const uploadRoot = path.join(process.cwd(), "public", "uploads");

const allowedMime = new Set(["image/jpeg", "image/png", "image/webp"]);

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function storageFor(type: "products" | "collections" | "banners") {
  const dest = path.join(uploadRoot, type);
  ensureDir(dest);
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^\w.\-]/g, "_");
      cb(null, `${Date.now()}-${safe}`);
    },
  });
}

export const uploadLimits = {
  fileSize: 5 * 1024 * 1024,
  files: 10,
} as const;

export function fileFilter(
  _req: unknown,
  file: { mimetype: string; originalname: string },
  cb: multer.FileFilterCallback
) {
  if (allowedMime.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  }
}

export function publicUrlForSavedFile(
  type: "products" | "collections" | "banners",
  filename: string
): string {
  return `/uploads/${type}/${filename}`;
}

/** Validate a browser File against the same rules as multer */
export function validateBrowserFile(file: File): string | null {
  if (!allowedMime.has(file.type)) {
    return "Only JPEG, PNG, and WebP images are allowed";
  }
  if (file.size > uploadLimits.fileSize) {
    return "File too large (max 5MB)";
  }
  return null;
}
