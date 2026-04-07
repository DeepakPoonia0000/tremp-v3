"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

export function ProductImageGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [idx, setIdx] = useState(0);
  const main = images[idx] ?? images[0];

  if (!main) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
        <Image
          src={main}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIdx(i)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                i === idx ? "border-primary" : "border-transparent"
              )}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
