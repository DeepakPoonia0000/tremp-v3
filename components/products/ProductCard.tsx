"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/utils/formatPrice";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/utils/cn";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image?: string;
  href?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  image,
  href,
}: ProductCardProps) {
  const { add } = useCart();
  const { items: wishIds, toggle } = useWishlist();
  const inWish = wishIds.includes(id);
  const link = href ?? `/products/${slug}`;

  return (
    <Card className="overflow-hidden border-border/80 transition-shadow hover:shadow-md">
      <Link href={link} className="relative block aspect-[3/4] bg-muted">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 rounded-full bg-background/90 p-2 shadow-sm transition-colors",
            inWish && "text-red-500"
          )}
          onClick={(e) => {
            e.preventDefault();
            toggle(id);
          }}
          aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4", inWish && "fill-current")} />
        </button>
      </Link>
      <CardContent className="p-4">
        <Link href={link} className="font-medium leading-snug hover:underline">
          {name}
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold">{formatPrice(price)}</span>
          {comparePrice != null && comparePrice > price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(comparePrice)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          type="button"
          variant="secondary"
          onClick={() =>
            add({
              productId: id,
              name,
              slug,
              image: image ?? "",
              price,
              qty: 1,
            })
          }
        >
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}
