"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";

interface Props {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    sizes: string[];
    colors: string[];
    stock: number;
  };
}

export function AddToCartSection({ product }: Props) {
  const { add } = useCart();
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);

  return (
    <div className="mt-8 space-y-4">
      {product.sizes.length > 0 && (
        <div>
          <Label className="mb-2 block">Size</Label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <Button
                key={s}
                type="button"
                size="sm"
                variant={size === s ? "default" : "outline"}
                onClick={() => setSize(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}
      {product.colors.length > 0 && (
        <div>
          <Label className="mb-2 block">Color</Label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <Button
                key={c}
                type="button"
                size="sm"
                variant={color === c ? "default" : "outline"}
                onClick={() => setColor(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
      )}
      <Button
        type="button"
        size="lg"
        className="w-full sm:w-auto"
        disabled={product.stock <= 0}
        onClick={() =>
          add({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: product.image,
            price: product.price,
            qty: 1,
            size,
            color,
          })
        }
      >
        {product.stock <= 0 ? "Out of stock" : "Add to cart"}
      </Button>
    </div>
  );
}
