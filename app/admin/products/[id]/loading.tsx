import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductLoading() {
  return (
    <div className="max-w-xl space-y-4">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
