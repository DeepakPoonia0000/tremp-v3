import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminCollectionNotFound() {
  return (
    <div>
      <h1 className="text-lg font-semibold">Collection not found</h1>
      <Button asChild className="mt-4">
        <Link href="/admin/collections">Back</Link>
      </Button>
    </div>
  );
}
