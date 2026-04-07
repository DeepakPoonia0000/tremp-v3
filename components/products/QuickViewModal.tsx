"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/formatPrice";
import { useCart } from "@/hooks/useCart";

export interface QuickProduct {
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  description: string;
  images: string[];
  id: string;
}

export function QuickViewModal({ product }: { product: QuickProduct }) {
  const router = useRouter();
  const { add } = useCart();
  const img = product.images[0];

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative aspect-square bg-muted md:aspect-auto md:min-h-[320px]">
            {img ? (
              <Image
                src={img}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 400px"
              />
            ) : null}
          </div>
          <div className="flex flex-col justify-center p-6">
            <DialogHeader>
              <DialogTitle className="text-left text-2xl">
                {product.name}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice != null &&
                product.comparePrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
            </div>
            <p className="mt-4 line-clamp-4 text-sm text-muted-foreground">
              {product.description}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                className="flex-1"
                onClick={() =>
                  add({
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    image: img ?? "",
                    price: product.price,
                    qty: 1,
                  })
                }
              >
                Add to cart
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/products/${product.slug}`}>Full details</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
