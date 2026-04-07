"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return (
    <div className="space-y-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Continue with your Google account.
        </p>
      </div>
      <Button
        className="w-full"
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
      >
        Continue with Google
      </Button>
    </div>
  );
}
