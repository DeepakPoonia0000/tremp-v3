"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function UserAreaError({
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
    <div className="rounded-lg border border-border p-6 text-center">
      <p className="font-medium">Something went wrong</p>
      <p className="mt-1 text-xs text-muted-foreground">{error.digest}</p>
      <Button className="mt-4" type="button" onClick={() => reset()}>
        Retry
      </Button>
    </div>
  );
}
