"use client";

import { useActionState } from "react";
import { createProduct } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useState } from "react";

export function ProductNewForm() {
  const [images, setImages] = useState<string[]>([]);
  const [state, action, pending] = useActionState(createProduct, null);

  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="slug">Slug (optional)</Label>
        <Input id="slug" name="slug" placeholder="auto from name" />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" required />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" name="stock" type="number" defaultValue={0} />
        </div>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" defaultValue="general" />
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" placeholder="cotton, summer" />
      </div>
      <ImageUploader
        type="products"
        onUploaded={(urls) => setImages((prev) => [...prev, ...urls])}
      />
      <input type="hidden" name="images" value={images.join("\n")} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isFeatured" />
        Featured
      </label>
      {state && "error" in state && state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create product"}
      </Button>
    </form>
  );
}
