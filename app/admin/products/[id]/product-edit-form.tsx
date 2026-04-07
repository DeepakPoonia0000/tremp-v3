"use client";

import { useActionState, useState } from "react";
import { updateProduct } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface ProductShape {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  tags: string[];
  images: string[];
  isFeatured: boolean;
}

export function ProductEditForm({ product }: { product: ProductShape }) {
  const [images, setImages] = useState<string[]>(product.images);
  const boundUpdate = updateProduct.bind(null, product._id);
  const [state, action, pending] = useActionState(boundUpdate, null);

  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={product.name} />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" required defaultValue={product.slug} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          defaultValue={product.description}
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={product.price}
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            defaultValue={product.stock}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          defaultValue={product.category}
        />
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={product.tags.join(", ")}
        />
      </div>
      <ImageUploader
        type="products"
        onUploaded={(urls) => setImages((prev) => [...prev, ...urls])}
      />
      <input type="hidden" name="images" value={images.join("\n")} />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isFeatured"
          defaultChecked={product.isFeatured}
        />
        Featured
      </label>
      {state && "error" in state && state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
