"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImageUploader({
  type,
  onUploaded,
}: {
  type: "products" | "collections" | "banners";
  onUploaded: (urls: string[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setLoading(true);
    setError(null);
    const form = new FormData();
    form.set("type", type);
    for (const f of Array.from(files)) {
      form.append("files", f);
    }
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as { urls?: string[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      if (data.urls?.length) onUploaded(data.urls);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`upload-${type}`}>Upload images</Label>
      <Input
        id={`upload-${type}`}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(e) => void onChange(e)}
        disabled={loading}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-xs text-muted-foreground">Uploading…</p> : null}
    </div>
  );
}
