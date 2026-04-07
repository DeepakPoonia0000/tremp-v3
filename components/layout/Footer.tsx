import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4 sm:px-6">
        <div>
          <p className="text-lg font-semibold">Tremp</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Contemporary clothing with timeless silhouettes.
          </p>
        </div>
        <div>
          <p className="font-medium">Shop</p>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/products" className="hover:text-foreground">
                All products
              </Link>
            </li>
            <li>
              <Link href="/collections" className="hover:text-foreground">
                Collections
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-medium">Help</p>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/search" className="hover:text-foreground">
                Search
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-medium">Account</p>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/login" className="hover:text-foreground">
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-foreground">
                Orders
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tremp. All rights reserved.
      </div>
    </footer>
  );
}
