"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, Menu, User, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { useCart } from "@/hooks/useCart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleMobileMenu } from "@/store/slices/uiSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/search", label: "Search" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { items, setOpen } = useCart();
  const dispatch = useAppDispatch();
  const mobileOpen = useAppSelector((s) => s.ui.mobileMenuOpen);
  const cartCount = items.reduce((n, i) => n + i.qty, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            type="button"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Tremp
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  pathname === l.href && "text-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action="/search" className="hidden max-w-sm flex-1 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              placeholder="Search products..."
              className="pl-9"
              aria-label="Search"
            />
          </div>
        </form>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Cart"
          >
            <span className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </span>
          </Button>
          {status === "loading" ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                {session.user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => void signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-2 text-sm font-medium"
                onClick={() => dispatch(toggleMobileMenu())}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
