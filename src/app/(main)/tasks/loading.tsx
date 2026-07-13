import { Skeleton } from "@/components/ui/Skeleton";

export default function TasksLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-24" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-16" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
