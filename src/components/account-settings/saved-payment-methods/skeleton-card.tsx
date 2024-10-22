import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="px-5 py-3 bg-container_light rounded-lg flex">
      {/* Card icon and info */}
      <div className="flex gap-5 items-center">
        <Skeleton className="rounded-lg w-[41px] h-6" />

        <div className="flex gap-y-[2px] flex-col">
          <Skeleton className="h-4 w-[100px]" />
          <div className="flex space-x-1 items-center">
            <Skeleton className="h-4 w-[70px]" />
            <Skeleton className="h-4 w-[40px]" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-x-4 ml-auto items-center">
        <Skeleton className="h-6 w-[50px]" /> {/* Placeholder for the Default Badge */}
        <div className="flex space-x-2 justify-end items-center">
          <Skeleton className="h-6 w-6" /> {/* Placeholder for the actions icon */}
        </div>
      </div>
    </div>
  );
}
