"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlogsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Button asChild>
          <Link href="/admin/blogs/new">Create New Blog</Link>
        </Button>
      </div>

      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Blog management system is ready!
        </p>
        <Button asChild>
          <Link href="/admin/blogs/new">Create Your First Blog</Link>
        </Button>
      </div>
    </div>
  );
}
