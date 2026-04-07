import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CollectionNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Collection not found</h1>
      <p className="mt-2 text-muted-foreground">
        This collection is not available.
      </p>
      <Button asChild className="mt-6">
        <Link href="/collections">All collections</Link>
      </Button>
    </div>
  );
}
