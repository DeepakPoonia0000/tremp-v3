import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCollectionsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
