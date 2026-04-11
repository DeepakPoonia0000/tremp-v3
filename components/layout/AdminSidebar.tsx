"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-full gap-2 overflow-x-auto border-b border-border pb-3 md:w-56 md:flex-col md:border-b-0 md:border-r md:pb-0 md:pr-6">
      <p className="hidden px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:block">
        Admin
      </p>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
            pathname.startsWith(l.href) && "bg-muted text-foreground"
          )}
        >
          {l.label}
        </Link>
      ))}
    </aside>
  );
}
