"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

const links = [
  { href: "/profile", label: "Profile" },
  { href: "/orders", label: "Orders" },
];

export function UserSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full shrink-0 border-b border-border pb-4 md:w-52 md:border-b-0 md:border-r md:pb-0 md:pr-6">
      <nav className="flex gap-2 md:flex-col">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
              pathname === l.href && "bg-muted text-foreground"
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
