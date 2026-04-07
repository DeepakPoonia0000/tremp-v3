import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="bg-primary px-4 py-2 text-center text-sm text-primary-foreground">
      <span>Free shipping on orders over $75 — </span>
      <Link href="/collections" className="underline underline-offset-2">
        Shop new arrivals
      </Link>
    </div>
  );
}
