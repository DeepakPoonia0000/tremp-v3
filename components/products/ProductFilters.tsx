"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ProductFilters({
  categories,
  current,
}: {
  categories: string[];
  current?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function setCategory(cat: string | null) {
    const next = new URLSearchParams(params.toString());
    if (cat) next.set("category", cat);
    else next.delete("category");
    router.push(`/products?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant={!current ? "default" : "outline"}
        size="sm"
        onClick={() => setCategory(null)}
      >
        All
      </Button>
      {categories.map((c) => (
        <Button
          key={c}
          type="button"
          variant={current === c ? "default" : "outline"}
          size="sm"
          onClick={() => setCategory(c)}
        >
          {c}
        </Button>
      ))}
    </div>
  );
}
