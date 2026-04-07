"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <p className="font-medium">Could not load products</p>
      <Button className="mt-4" type="button" onClick={() => reset()}>
        Retry
      </Button>
    </div>
  );
}
