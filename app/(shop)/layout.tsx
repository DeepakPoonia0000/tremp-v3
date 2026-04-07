import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-3 text-xs text-muted-foreground sm:px-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span>Shop</span>
      </div>
      {children}
    </div>
  );
}
