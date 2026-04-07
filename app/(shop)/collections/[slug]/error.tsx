"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CollectionError({
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
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="font-medium">Could not load this collection</p>
      <Button className="mt-4" type="button" onClick={() => reset()}>
        Retry
      </Button>
    </div>
  );
}
