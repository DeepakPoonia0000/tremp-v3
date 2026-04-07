"use client";

import { useActionState } from "react";
import { createCollection } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminNewCollectionPage() {
  const [state, action, pending] = useActionState(createCollection, null);

  return (
    <div>
      <h1 className="text-2xl font-semibold">New collection</h1>
      <form action={action} className="mt-8 max-w-xl space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="slug">Slug (optional)</Label>
          <Input id="slug" name="slug" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <Label htmlFor="bannerImage">Banner image URL</Label>
          <Input id="bannerImage" name="bannerImage" placeholder="/uploads/..." />
        </div>
        <div>
          <Label htmlFor="season">Season</Label>
          <select
            id="season"
            name="season"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            defaultValue="all-year"
          >
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="fall">Fall</option>
            <option value="all-year">All year</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
        </div>
        <div>
          <Label htmlFor="metaTitle">Meta title</Label>
          <Input id="metaTitle" name="metaTitle" />
        </div>
        <div>
          <Label htmlFor="metaDescription">Meta description</Label>
          <Input id="metaDescription" name="metaDescription" />
        </div>
        {state && "error" in state && state.error ? (
          <p className="text-sm text-destructive">{state.error}</p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create"}
        </Button>
      </form>
    </div>
  );
}
