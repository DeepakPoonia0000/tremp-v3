import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminProductNotFound() {
  return (
    <div>
      <h1 className="text-lg font-semibold">Product not found</h1>
      <Button asChild className="mt-4">
        <Link href="/admin/products">Back to products</Link>
      </Button>
    </div>
  );
}
