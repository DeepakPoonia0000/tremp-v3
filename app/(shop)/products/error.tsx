"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ProductsError({
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
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="font-medium">Could not load products</p>
      <p className="mt-2 text-sm text-muted-foreground">{error.digest}</p>
      <Button className="mt-6" type="button" onClick={() => reset()}>
        Retry
      </Button>
    </div>
  );
}
