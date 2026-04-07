import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrderNotFound() {
  return (
    <div className="text-center">
      <h1 className="text-xl font-semibold">Order not found</h1>
      <Button asChild className="mt-4">
        <Link href="/orders">Back to orders</Link>
      </Button>
    </div>
  );
}
