import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <h1 className="text-lg font-semibold">Page not found</h1>
      <Button asChild className="mt-4">
        <Link href="/admin/dashboard">Dashboard</Link>
      </Button>
    </div>
  );
}
