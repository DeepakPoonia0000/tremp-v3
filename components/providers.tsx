"use client";

import { SessionProvider } from "next-auth/react";
import { ReduxProvider } from "@/store/provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider>
        {children}
        <Toaster richColors position="top-center" />
      </ReduxProvider>
    </SessionProvider>
  );
}
