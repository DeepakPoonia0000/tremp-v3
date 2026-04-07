import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <p className="mt-2 text-muted-foreground">
        That item may have been removed or the link is incorrect.
      </p>
      <Button asChild className="mt-6">
        <Link href="/products">Browse shop</Link>
      </Button>
    </div>
  );
}
