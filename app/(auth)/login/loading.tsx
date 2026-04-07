import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="mx-auto h-8 w-40" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
