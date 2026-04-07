"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
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
    <div className="rounded-lg border border-destructive/50 bg-card p-6">
      <p className="font-medium">Admin panel error</p>
      <p className="mt-1 text-sm text-muted-foreground">{error.digest}</p>
      <Button className="mt-4" type="button" onClick={() => reset()}>
        Retry
      </Button>
    </div>
  );
}
