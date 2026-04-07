"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.info("[admin] route", pathname);
    }
  }, [pathname]);
  return <>{children}</>;
}
