"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    if (process.env.NODE_ENV === "production") {
      void import("@/lib/otel").then(({ recordErrorSpan }) => {
        recordErrorSpan("root-error", error);
      });
    }
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">
        {error.message}
        {error.digest ? (
          <span className="mt-2 block text-xs">
            Reference: {error.digest}
          </span>
        ) : null}
      </p>
      <Button type="button" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
