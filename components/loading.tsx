import {Skeleton} from "@/components/ui/skeleton";

export default function SkeletonLoader() {
  return (
    <div className="h-full flex flex-col text-primary w-[19rem] dark:bg-[#2B2D31] bg-[#F2F3F5] space-y-6 p-4">
      <div className="flex w-full">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex w-full">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>{" "}
      <div className="flex">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>{" "}
      <div className="flex">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
