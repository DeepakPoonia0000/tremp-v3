"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.info("[analytics] pageview", pathname);
    }
  }, [pathname]);

  return <>{children}</>;
}
